package iot.sensor.anhduc.dto;

import iot.sensor.anhduc.entity.DataSensor;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class DataSensorDto {
    private String id;
    private String sensor;
    private String type;
    private Double value;
    private String unit;
    private String status;
    private String connection;
    private String time;
    private Long timestamp;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public DataSensorDto() {
    }

    public DataSensorDto(String id, String sensor, String type, Double value, String unit, String status, String connection, String time, Long timestamp) {
        this.id = id;
        this.sensor = sensor;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.status = status;
        this.connection = connection;
        this.time = time;
        this.timestamp = timestamp;
    }

    public static DataSensorDto fromEntity(DataSensor entity) {
        if (entity == null) return null;
        String formattedTime = entity.getTime() != null ? entity.getTime().format(FORMATTER) : "";
        Long ts = entity.getTime() != null
                ? entity.getTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
                : System.currentTimeMillis();

        return DataSensorDto.builder()
                .id(entity.getId() != null ? String.valueOf(entity.getId()) : "")
                .sensor(entity.getSensorName() != null ? entity.getSensorName() : (entity.getSensorType() + " Sensor"))
                .type(entity.getSensorType())
                .value(entity.getValue())
                .unit(entity.getUnit())
                .status(entity.getStatus() != null ? entity.getStatus() : "Normal")
                .connection(entity.getConnection() != null ? entity.getConnection() : "Online")
                .time(formattedTime)
                .timestamp(ts)
                .build();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSensor() {
        return sensor;
    }

    public void setSensor(String sensor) {
        this.sensor = sensor;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public static DataSensorDtoBuilder builder() {
        return new DataSensorDtoBuilder();
    }

    public static class DataSensorDtoBuilder {
        private String id;
        private String sensor;
        private String type;
        private Double value;
        private String unit;
        private String status;
        private String connection;
        private String time;
        private Long timestamp;

        public DataSensorDtoBuilder id(String id) { this.id = id; return this; }
        public DataSensorDtoBuilder sensor(String sensor) { this.sensor = sensor; return this; }
        public DataSensorDtoBuilder type(String type) { this.type = type; return this; }
        public DataSensorDtoBuilder value(Double value) { this.value = value; return this; }
        public DataSensorDtoBuilder unit(String unit) { this.unit = unit; return this; }
        public DataSensorDtoBuilder status(String status) { this.status = status; return this; }
        public DataSensorDtoBuilder connection(String connection) { this.connection = connection; return this; }
        public DataSensorDtoBuilder time(String time) { this.time = time; return this; }
        public DataSensorDtoBuilder timestamp(Long timestamp) { this.timestamp = timestamp; return this; }

        public DataSensorDto build() {
            return new DataSensorDto(id, sensor, type, value, unit, status, connection, time, timestamp);
        }
    }
}
