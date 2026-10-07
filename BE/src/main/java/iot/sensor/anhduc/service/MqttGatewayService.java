package iot.sensor.anhduc.service;

import iot.sensor.anhduc.event.MqttMessageReceivedEvent;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class MqttGatewayService implements MqttCallbackExtended {

    private static final Logger log = LoggerFactory.getLogger(MqttGatewayService.class);

    @Value("${mqtt.broker.url:tcp://localhost:1883}")
    private String brokerUrl;

    @Value("${mqtt.client.id:anhduc_iot_backend}")
    private String clientId;

    @Value("${mqtt.username:}")
    private String username;

    @Value("${mqtt.password:}")
    private String password;

    @Value("${mqtt.topic.sensor-data:sensor_data}")
    private String sensorDataTopic;

    @Value("${mqtt.topic.device-control:device_control}")
    private String deviceControlTopic;

    @Value("${mqtt.topic.device-response:device_response}")
    private String deviceResponseTopic;

    private final ApplicationEventPublisher eventPublisher;
    private MqttClient mqttClient;

    public MqttGatewayService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @PostConstruct
    public void init() {
        connectToBroker();
    }

    public synchronized void connectToBroker() {
        try {
            if (mqttClient != null && mqttClient.isConnected()) {
                return;
            }

            // Append random suffix to avoid client ID collision on restart
            String actualClientId = clientId + "_" + System.currentTimeMillis() % 10000;
            mqttClient = new MqttClient(brokerUrl, actualClientId, new MemoryPersistence());
            mqttClient.setCallback(this);

            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setConnectionTimeout(10);
            options.setKeepAliveInterval(60);

            if (username != null && !username.isBlank()) {
                options.setUserName(username);
            }
            if (password != null && !password.isBlank()) {
                options.setPassword(password.toCharArray());
            }

            log.info("Connecting to MQTT broker at {}", brokerUrl);
            mqttClient.connect(options);
            log.info("Successfully connected to MQTT broker");

        } catch (MqttException e) {
            log.error("Failed to connect to MQTT broker {}: {}. Will retry automatically.", brokerUrl, e.getMessage());
        }
    }

    @Override
    public void connectComplete(boolean reconnect, String serverURI) {
        log.info("MQTT connection complete (reconnect={}) to {}", reconnect, serverURI);
        subscribeToTopics();
    }

    private void subscribeToTopics() {
        try {
            if (mqttClient != null && mqttClient.isConnected()) {
                mqttClient.subscribe(sensorDataTopic, 1);
                mqttClient.subscribe(deviceResponseTopic, 1);
                log.info("Subscribed to MQTT topics: '{}', '{}'", sensorDataTopic, deviceResponseTopic);
            }
        } catch (MqttException e) {
            log.error("Failed to subscribe to MQTT topics: {}", e.getMessage());
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        log.warn("MQTT connection lost: {}", cause != null ? cause.getMessage() : "unknown reason");
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) {
        String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        log.info("MQTT message received on topic '{}': {}", topic, payload);
        try {
            eventPublisher.publishEvent(new MqttMessageReceivedEvent(this, topic, payload));
        } catch (Exception e) {
            log.error("Error processing MQTT message: {}", e.getMessage(), e);
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // delivery completed
    }

    public boolean publish(String topic, String message) {
        try {
            if (mqttClient == null || !mqttClient.isConnected()) {
                connectToBroker();
            }
            if (mqttClient != null && mqttClient.isConnected()) {
                MqttMessage mqttMessage = new MqttMessage(message.getBytes(StandardCharsets.UTF_8));
                mqttMessage.setQos(1);
                mqttClient.publish(topic, mqttMessage);
                log.info("Published to MQTT topic '{}': {}", topic, message);
                return true;
            } else {
                log.warn("Cannot publish to '{}': MQTT client is not connected", topic);
                return false;
            }
        } catch (MqttException e) {
            log.error("Failed to publish to MQTT topic '{}': {}", topic, e.getMessage());
            return false;
        }
    }

    public boolean publishDeviceControl(String payload) {
        return publish(deviceControlTopic, payload);
    }

    public boolean isConnected() {
        return mqttClient != null && mqttClient.isConnected();
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (mqttClient != null && mqttClient.isConnected()) {
                mqttClient.disconnect();
                mqttClient.close();
                log.info("MQTT client disconnected successfully");
            }
        } catch (MqttException e) {
            log.error("Error disconnecting MQTT client: {}", e.getMessage());
        }
    }
}
