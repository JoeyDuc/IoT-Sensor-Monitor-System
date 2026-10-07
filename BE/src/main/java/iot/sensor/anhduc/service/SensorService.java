package iot.sensor.anhduc.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import iot.sensor.anhduc.dto.*;
import iot.sensor.anhduc.entity.DataSensor;
import iot.sensor.anhduc.event.MqttMessageReceivedEvent;
import iot.sensor.anhduc.repository.DataSensorRepository;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SensorService {

    private static final Logger log = LoggerFactory.getLogger(SensorService.class);

    private final DataSensorRepository dataSensorRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Value("${mqtt.topic.sensor-data:sensor_data}")
    private String sensorDataTopic;

    private static final DateTimeFormatter CHART_TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter FULL_TIME_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public SensorService(
            DataSensorRepository dataSensorRepository,
            SimpMessagingTemplate messagingTemplate,
            ObjectMapper objectMapper) {
        this.dataSensorRepository = dataSensorRepository;
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @EventListener
    @Transactional
    public void handleMqttMessage(MqttMessageReceivedEvent event) {
        if (!sensorDataTopic.equalsIgnoreCase(event.getTopic())) {
            return;
        }

        try {
            JsonNode root = objectMapper.readTree(event.getPayload());
            LocalDateTime now = LocalDateTime.now();
            List<DataSensor> savedList = new ArrayList<>();

            // Support format: { "temp": 20, "humid": 80, "light": 1000 } or {
            // "temperature": 20, ... }
            if (root.has("temp") || root.has("temperature")) {
                double tempVal = root.has("temp") ? root.get("temp").asDouble() : root.get("temperature").asDouble();
                DataSensor s = DataSensor.builder()
                        .sensorId(1L)
                        .sensorName("Temperature Sensor")
                        .sensorType("Temperature")
                        .value(tempVal)
                        .unit("°C")
                        .connection("Online")
                        .status(DataSensor.calculateStatus("Temperature", tempVal))
                        .time(now)
                        .build();
                savedList.add(dataSensorRepository.save(s));
            }

            if (root.has("humid") || root.has("humidity")) {
                double humVal = root.has("humid") ? root.get("humid").asDouble() : root.get("humidity").asDouble();
                DataSensor s = DataSensor.builder()
                        .sensorId(2L)
                        .sensorName("Humidity Sensor")
                        .sensorType("Humidity")
                        .value(humVal)
                        .unit("%")
                        .connection("Online")
                        .status(DataSensor.calculateStatus("Humidity", humVal))
                        .time(now)
                        .build();
                savedList.add(dataSensorRepository.save(s));
            }

            if (root.has("light")) {
                double lightVal = root.get("light").asDouble();
                DataSensor s = DataSensor.builder()
                        .sensorId(3L)
                        .sensorName("Light Sensor")
                        .sensorType("Light")
                        .value(lightVal)
                        .unit("lux")
                        .connection("Online")
                        .status(DataSensor.calculateStatus("Light", lightVal))
                        .time(now)
                        .build();
                savedList.add(dataSensorRepository.save(s));
            }

            // Support individual reading format: { "sensor": "...", "type": "...", "value":
            // 20, "unit": "..." }
            if (savedList.isEmpty() && root.has("value") && (root.has("type") || root.has("sensor"))) {
                String type = root.has("type") ? root.get("type").asText() : "Temperature";
                String name = root.has("sensor") ? root.get("sensor").asText() : type + " Sensor";
                String unit = root.has("unit") ? root.get("unit").asText()
                        : ("Temperature".equalsIgnoreCase(type) ? "°C"
                                : "Humidity".equalsIgnoreCase(type) ? "%" : "lux");
                double val = root.get("value").asDouble();

                DataSensor s = DataSensor.builder()
                        .sensorId(1L)
                        .sensorName(name)
                        .sensorType(type)
                        .value(val)
                        .unit(unit)
                        .connection("Online")
                        .status(DataSensor.calculateStatus(type, val))
                        .time(now)
                        .build();
                savedList.add(dataSensorRepository.save(s));
            }

            if (!savedList.isEmpty()) {
                log.info("Saved {} sensor reading(s) to database", savedList.size());
                List<DataSensorDto> dtos = savedList.stream().map(DataSensorDto::fromEntity).toList();

                // Broadcast new readings to /topic/sensors
                messagingTemplate.convertAndSend("/topic/sensors", dtos);

                // Broadcast updated summary to /topic/dashboard
                messagingTemplate.convertAndSend("/topic/dashboard/summary", getLatestSummary());
            }

        } catch (Exception e) {
            log.error("Failed to parse and store sensor data MQTT payload: {}", event.getPayload(), e);
        }
    }

    public PageResponse<DataSensorDto> getSensorData(
            String sensorType,
            String quickSearch,
            int page,
            int size,
            String sortBy,
            String sortDir) {
        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy != null && !sortBy.isBlank() ? sortBy : "time");
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), size, sort);

        Specification<DataSensor> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (sensorType != null && !sensorType.isBlank() && !"All".equalsIgnoreCase(sensorType)) {
                predicates.add(cb.equal(cb.lower(root.get("sensorType")), sensorType.toLowerCase()));
            }

            if (quickSearch != null && !quickSearch.isBlank()) {
                String searchPattern = "%" + quickSearch.trim().toLowerCase() + "%";

                Predicate pName = cb.like(cb.lower(root.get("sensorName")), searchPattern);
                Predicate pType = cb.like(cb.lower(root.get("sensorType")), searchPattern);
                Predicate pUnit = cb.like(cb.lower(root.get("unit")), searchPattern);

                // Support flexible date search: to_char(time, 'YYYY-MM-DD HH24:MI:SS') &
                // 'DD/MM/YYYY HH24:MI:SS'
                Expression<String> timeFmt1 = cb.function("to_char", String.class, root.get("time"),
                        cb.literal("YYYY-MM-DD HH24:MI:SS"));
                Expression<String> timeFmt2 = cb.function("to_char", String.class, root.get("time"),
                        cb.literal("DD/MM/YYYY HH24:MI:SS"));
                Predicate pTime1 = cb.like(cb.lower(timeFmt1), searchPattern);
                Predicate pTime2 = cb.like(cb.lower(timeFmt2), searchPattern);

                List<Predicate> orList = new ArrayList<>(List.of(pName, pType, pUnit, pTime1, pTime2));

                // If number, match value and id
                try {
                    double valNum = Double.parseDouble(quickSearch.trim());
                    orList.add(cb.equal(root.get("value"), valNum));
                } catch (NumberFormatException ignored) {
                }

                try {
                    long idNum = Long.parseLong(quickSearch.trim());
                    orList.add(cb.equal(root.get("id"), idNum));
                } catch (NumberFormatException ignored) {
                }

                predicates.add(cb.or(orList.toArray(new Predicate[0])));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<DataSensor> pageResult = dataSensorRepository.findAll(spec, pageable);
        List<DataSensorDto> dtos = pageResult.getContent().stream()
                .map(DataSensorDto::fromEntity)
                .collect(Collectors.toList());

        return PageResponse.<DataSensorDto>builder()
                .content(dtos)
                .page(pageResult.getNumber() + 1)
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .last(pageResult.isLast())
                .build();
    }

    public SensorSummaryDto getLatestSummary() {
        return SensorSummaryDto.builder()
                .temperature(buildMetricInfo("Temperature", "°C", 28.5))
                .humidity(buildMetricInfo("Humidity", "%", 72.0))
                .light(buildMetricInfo("Light", "lux", 520.0))
                .build();
    }

    private SensorSummaryDto.MetricInfo buildMetricInfo(String type, String defaultUnit, double defaultVal) {
        Pageable pageable = PageRequest.of(0, 2);
        List<DataSensor> recent = dataSensorRepository.findRecentBySensorType(type, pageable);

        if (recent.isEmpty()) {
            return SensorSummaryDto.MetricInfo.builder()
                    .value(defaultVal)
                    .unit(defaultUnit)
                    .trend("+0.0%")
                    .trendUp(true)
                    .build();
        }

        DataSensor latest = recent.get(0);
        double latestVal = latest.getValue() != null ? latest.getValue() : defaultVal;
        String unit = latest.getUnit() != null ? latest.getUnit() : defaultUnit;

        String trend = "+0.0%";
        boolean trendUp = true;
        if (recent.size() > 1 && recent.get(1).getValue() != null) {
            double prevVal = recent.get(1).getValue();
            if (prevVal > 0) {
                double diff = ((latestVal - prevVal) / prevVal) * 100.0;
                trendUp = diff >= 0;
                trend = String.format("%s%.1f%%", trendUp ? "+" : "", diff);
            }
        }

        return SensorSummaryDto.MetricInfo.builder()
                .value(latestVal)
                .unit(unit)
                .trend(trend)
                .trendUp(trendUp)
                .build();
    }

    public DashboardChartDto getChartData(String filterMode, Long fromTimestamp, Long toTimestamp) {
        return DashboardChartDto.builder()
                .temperature(getChartSeries("Temperature", filterMode, fromTimestamp, toTimestamp))
                .humidity(getChartSeries("Humidity", filterMode, fromTimestamp, toTimestamp))
                .light(getChartSeries("Light", filterMode, fromTimestamp, toTimestamp))
                .build();
    }

    private List<DashboardChartDto.ChartPoint> getChartSeries(
            String type, String filterMode, Long fromTimestamp, Long toTimestamp) {
        List<DataSensor> list;

        if ("dateRange".equalsIgnoreCase(filterMode) && fromTimestamp != null && toTimestamp != null) {
            LocalDateTime start = LocalDateTime.ofInstant(Instant.ofEpochMilli(fromTimestamp), ZoneId.systemDefault());
            LocalDateTime end = LocalDateTime.ofInstant(Instant.ofEpochMilli(toTimestamp), ZoneId.systemDefault());
            list = dataSensorRepository.findBySensorTypeAndTimeBetweenOrderByTimeAsc(type, start, end);
        } else {
            // Last 15 readings
            list = dataSensorRepository.findTop15BySensorTypeOrderByTimeDesc(type);
            Collections.reverse(list); // Chronological order
        }

        return list.stream().map(d -> {
            long ts = d.getTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
            return DashboardChartDto.ChartPoint.builder()
                    .time(d.getTime().format(CHART_TIME_FMT))
                    .value(d.getValue())
                    .timestamp(ts)
                    .fullTime(d.getTime().format(FULL_TIME_FMT))
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public DataSensorDto createReading(DataSensorDto dto) {
        DataSensor entity = DataSensor.builder()
                .sensorId(1L)
                .sensorName(dto.getSensor() != null ? dto.getSensor() : dto.getType() + " Sensor")
                .sensorType(dto.getType())
                .value(dto.getValue())
                .unit(dto.getUnit())
                .connection(dto.getConnection() != null ? dto.getConnection() : "Online")
                .time(LocalDateTime.now())
                .build();
        DataSensor saved = dataSensorRepository.save(entity);
        return DataSensorDto.fromEntity(saved);
    }
}
