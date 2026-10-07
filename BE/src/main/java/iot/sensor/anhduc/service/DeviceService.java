package iot.sensor.anhduc.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import iot.sensor.anhduc.dto.DeviceControlRequest;
import iot.sensor.anhduc.dto.DeviceDto;
import iot.sensor.anhduc.dto.HistoryDto;
import iot.sensor.anhduc.entity.Device;
import iot.sensor.anhduc.entity.DeviceAction;
import iot.sensor.anhduc.event.MqttMessageReceivedEvent;
import iot.sensor.anhduc.repository.DeviceActionRepository;
import iot.sensor.anhduc.repository.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private static final Logger log = LoggerFactory.getLogger(DeviceService.class);

    private final DeviceRepository deviceRepository;
    private final DeviceActionRepository actionRepository;
    private final MqttGatewayService mqttGatewayService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Value("${mqtt.topic.device-response:device_response}")
    private String deviceResponseTopic;

    public DeviceService(
            DeviceRepository deviceRepository,
            DeviceActionRepository actionRepository,
            MqttGatewayService mqttGatewayService,
            SimpMessagingTemplate messagingTemplate,
            ObjectMapper objectMapper) {
        this.deviceRepository = deviceRepository;
        this.actionRepository = actionRepository;
        this.mqttGatewayService = mqttGatewayService;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    public List<DeviceDto> getAllDevices() {
        return deviceRepository.findAll().stream()
                .map(DeviceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeviceDto controlDevice(String identifier, DeviceControlRequest request) {
        Device device = findDevice(identifier);

        String newStatus;
        if (request != null && request.getAction() != null && !request.getAction().isBlank()) {
            String act = request.getAction().toUpperCase();
            if (act.contains("ON")) {
                newStatus = "ON";
            } else if (act.contains("OFF")) {
                newStatus = "OFF";
            } else {
                newStatus = "ON".equalsIgnoreCase(device.getStatus()) ? "OFF" : "ON";
            }
        } else {
            newStatus = "ON".equalsIgnoreCase(device.getStatus()) ? "OFF" : "ON";
        }

        device.setStatus(newStatus);
        Device savedDevice = deviceRepository.save(device);

        String username = (request != null && request.getUser() != null && !request.getUser().isBlank())
                ? request.getUser()
                : "admin";

        // Save action history record
        DeviceAction action = DeviceAction.builder()
                .deviceId(savedDevice.getId())
                .deviceName(savedDevice.getName())
                .user(username)
                .action("ON".equals(newStatus) ? "TURN_ON" : "TURN_OFF")
                .status("SUCCESS")
                .time(LocalDateTime.now())
                .build();
        DeviceAction savedAction = actionRepository.save(action);

        // Publish to MQTT topic device_control
        String code = savedDevice.getCode() != null ? savedDevice.getCode().toLowerCase() : "led1";
        String statusLower = newStatus.toLowerCase();

        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("device", code);
        payloadMap.put("action", statusLower);
        payloadMap.put(code, statusLower);

        try {
            String jsonPayload = objectMapper.writeValueAsString(payloadMap);
            mqttGatewayService.publishDeviceControl(jsonPayload);
        } catch (Exception e) {
            log.error("Failed to serialize MQTT control payload: {}", e.getMessage());
        }

        DeviceDto dto = DeviceDto.fromEntity(savedDevice);

        // Broadcast to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/devices", getAllDevices());
        messagingTemplate.convertAndSend("/topic/history", HistoryDto.fromEntity(savedAction));

        return dto;
    }

    @EventListener
    @Transactional
    public void handleDeviceResponseMqtt(MqttMessageReceivedEvent event) {
        if (!deviceResponseTopic.equalsIgnoreCase(event.getTopic())) {
            return;
        }

        try {
            String payload = event.getPayload().trim();
            log.info("Processing device response from hardware: {}", payload);

            if (payload.startsWith("{")) {
                JsonNode node = objectMapper.readTree(payload);
                
                // Iterate over all fields in the JSON response
                Iterator<String> fieldNames = node.fieldNames();
                while (fieldNames.hasNext()) {
                    String field = fieldNames.next();
                    // Ignore metadata fields if they exist
                    if (!"device".equalsIgnoreCase(field) && !"status".equalsIgnoreCase(field) && !"action".equalsIgnoreCase(field)) {
                        String deviceCode = field;
                        String status = node.get(field).asText().toUpperCase();
                        String normalizedStatus = status.contains("ON") ? "ON" : "OFF";
                        
                        deviceRepository.findByCode(deviceCode).ifPresent(dev -> {
                            // Update device status based on hardware confirmation
                            dev.setStatus(normalizedStatus);
                            deviceRepository.save(dev);

                            // Update the latest action to SUCCESS
                            actionRepository.findTop1ByDeviceIdOrderByTimeDesc(dev.getId()).ifPresent(act -> {
                                act.setStatus("SUCCESS");
                                actionRepository.save(act);
                            });
                        });
                    }
                }
                // Broadcast updated devices list to frontend
                messagingTemplate.convertAndSend("/topic/devices", getAllDevices());
                
            } else if (payload.contains(":")) {
                // Fallback for simple string format: "led1:on"
                String[] parts = payload.split(":");
                String deviceCode = parts[0].trim();
                String status = parts[1].trim().toUpperCase();
                String normalizedStatus = status.contains("ON") ? "ON" : "OFF";
                
                deviceRepository.findByCode(deviceCode).ifPresent(dev -> {
                    dev.setStatus(normalizedStatus);
                    deviceRepository.save(dev);

                    actionRepository.findTop1ByDeviceIdOrderByTimeDesc(dev.getId()).ifPresent(act -> {
                        act.setStatus("SUCCESS");
                        actionRepository.save(act);
                    });

                    messagingTemplate.convertAndSend("/topic/devices", getAllDevices());
                });
            }

        } catch (Exception e) {
            log.error("Failed to process device response MQTT payload: {}", event.getPayload(), e);
        }
    }

    private Device findDevice(String identifier) {
        Optional<Device> byCode = deviceRepository.findByCode(identifier);
        if (byCode.isPresent())
            return byCode.get();

        try {
            Long id = Long.parseLong(identifier);
            return deviceRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thiết bị: " + identifier));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Không tìm thấy thiết bị: " + identifier);
        }
    }
}
