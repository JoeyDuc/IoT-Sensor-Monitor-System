package iot.sensor.anhduc.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "datasensor", indexes = {
    @Index(name = "idx_datasensor_time", columnList = "time"),
    @Index(name = "idx_datasensor_type", columnList = "sensor_type")
})
public class DataSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sensor_id")
    private Long sensorId;

    @Column(name = "sensor_name", length = 100)
    private String sensorName;

    @Column(name = "sensor_type", length = 50)
    private String sensorType; // Temperature, Humidity, Light

    private Double value;

    @Column(length = 20)
    private String unit; // °C, %, lux

    @Column(length = 20)
    private String status; // Normal, Warning, Error

    @Column(length = 20)
    private String connection; // Online, Offline

    @Column(nullable = false)
    private LocalDateTime time;

    public DataSensor() {
    }

    public DataSensor(Long id, Long sensorId, String sensorName, String sensorType, Double value, String unit, String status, String connection, LocalDateTime time) {
        this.id = id;
        this.sensorId = sensorId;
        this.sensorName = sensorName;
        this.sensorType = sensorType;
        this.value = value;
        this.unit = unit;
        this.status = status;
        this.connection = connection;
        this.time = time;
    }

    @PrePersist
    public void prePersist() {
        if (time == null) {
            time = LocalDateTime.now();
        }
        if (connection == null) {
            connection = "Online";
        }
        if (status == null && sensorType != null && value != null) {
            status = calculateStatus(sensorType, value);
        }
    }

    public static String calculateStatus(String type, Double val) {
        if (val == null) return "Normal";
        if ("Temperature".equalsIgnoreCase(type)) {
            if (val >= 35.0) return "Error";
            if (val >= 30.0) return "Warning";
            return "Normal";
        }
        if ("Humidity".equalsIgnoreCase(type)) {
            if (val >= 85.0 || val <= 20.0) return "Error";
            if (val >= 75.0 || val <= 30.0) return "Warning";
            return "Normal";
        }
        if ("Light".equalsIgnoreCase(type)) {
            if (val >= 800.0) return "Error";
            if (val >= 650.0) return "Warning";
            return "Normal";
        }
        return "Normal";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSensorId() {
        return sensorId;
    }

    public void setSensorId(Long sensorId) {
        this.sensorId = sensorId;
    }

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public static DataSensorBuilder builder() {
        return new DataSensorBuilder();
    }

    public static class DataSensorBuilder {
        private Long id;
        private Long sensorId;
        private String sensorName;
        private String sensorType;
        private Double value;
        private String unit;
        private String status;
        private String connection = "Online";
        private LocalDateTime time;

        public DataSensorBuilder id(Long id) { this.id = id; return this; }
        public DataSensorBuilder sensorId(Long sensorId) { this.sensorId = sensorId; return this; }
        public DataSensorBuilder sensorName(String sensorName) { this.sensorName = sensorName; return this; }
        public DataSensorBuilder sensorType(String sensorType) { this.sensorType = sensorType; return this; }
        public DataSensorBuilder value(Double value) { this.value = value; return this; }
        public DataSensorBuilder unit(String unit) { this.unit = unit; return this; }
        public DataSensorBuilder status(String status) { this.status = status; return this; }
        public DataSensorBuilder connection(String connection) { this.connection = connection; return this; }
        public DataSensorBuilder time(LocalDateTime time) { this.time = time; return this; }

        public DataSensor build() {
            return new DataSensor(id, sensorId, sensorName, sensorType, value, unit, status, connection, time);
        }
    }
}
