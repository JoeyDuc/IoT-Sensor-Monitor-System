package iot.sensor.anhduc.dto;

import iot.sensor.anhduc.entity.DeviceAction;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class HistoryDto {
    private String id;
    private String user;
    private String device;
    private String action;
    private String status;
    private String time;
    private Long timestamp;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public HistoryDto() {
    }

    public HistoryDto(String id, String user, String device, String action, String status, String time, Long timestamp) {
        this.id = id;
        this.user = user;
        this.device = device;
        this.action = action;
        this.status = status;
        this.time = time;
        this.timestamp = timestamp;
    }

    public static HistoryDto fromEntity(DeviceAction entity) {
        if (entity == null) return null;
        String formatted = entity.getTime() != null ? entity.getTime().format(FORMATTER) : "";
        Long ts = entity.getTime() != null
                ? entity.getTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
                : System.currentTimeMillis();

        return HistoryDto.builder()
                .id(entity.getId() != null ? String.valueOf(entity.getId()) : "")
                .user(entity.getUser() != null ? entity.getUser() : "admin")
                .device(entity.getDeviceName())
                .action(entity.getAction())
                .status(entity.getStatus())
                .time(formatted)
                .timestamp(ts)
                .build();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public static HistoryDtoBuilder builder() {
        return new HistoryDtoBuilder();
    }

    public static class HistoryDtoBuilder {
        private String id;
        private String user;
        private String device;
        private String action;
        private String status;
        private String time;
        private Long timestamp;

        public HistoryDtoBuilder id(String id) { this.id = id; return this; }
        public HistoryDtoBuilder user(String user) { this.user = user; return this; }
        public HistoryDtoBuilder device(String device) { this.device = device; return this; }
        public HistoryDtoBuilder action(String action) { this.action = action; return this; }
        public HistoryDtoBuilder status(String status) { this.status = status; return this; }
        public HistoryDtoBuilder time(String time) { this.time = time; return this; }
        public HistoryDtoBuilder timestamp(Long timestamp) { this.timestamp = timestamp; return this; }

        public HistoryDto build() {
            return new HistoryDto(id, user, device, action, status, time, timestamp);
        }
    }
}
