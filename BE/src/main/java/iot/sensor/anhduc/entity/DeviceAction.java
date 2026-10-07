package iot.sensor.anhduc.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "action", indexes = {
    @Index(name = "idx_action_time", columnList = "time"),
    @Index(name = "idx_action_device", columnList = "device_name"),
    @Index(name = "idx_action_status", columnList = "status")
})
public class DeviceAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_id")
    private Long deviceId;

    @Column(name = "device_name", length = 100)
    private String deviceName;

    @Column(name = "username", length = 50)
    private String user;

    @Column(nullable = false, length = 50)
    private String action; // "TURN_ON", "TURN_OFF"

    @Column(nullable = false, length = 50)
    private String status; // "SUCCESS", "FAILED", "LOADING"

    @Column(nullable = false)
    private LocalDateTime time;

    public DeviceAction() {
    }

    public DeviceAction(Long id, Long deviceId, String deviceName, String user, String action, String status, LocalDateTime time) {
        this.id = id;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.user = user;
        this.action = action;
        this.status = status;
        this.time = time;
    }

    @PrePersist
    public void prePersist() {
        if (time == null) {
            time = LocalDateTime.now();
        }
        if (status == null) {
            status = "SUCCESS";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
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

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public static DeviceActionBuilder builder() {
        return new DeviceActionBuilder();
    }

    public static class DeviceActionBuilder {
        private Long id;
        private Long deviceId;
        private String deviceName;
        private String user;
        private String action;
        private String status = "SUCCESS";
        private LocalDateTime time;

        public DeviceActionBuilder id(Long id) { this.id = id; return this; }
        public DeviceActionBuilder deviceId(Long deviceId) { this.deviceId = deviceId; return this; }
        public DeviceActionBuilder deviceName(String deviceName) { this.deviceName = deviceName; return this; }
        public DeviceActionBuilder user(String user) { this.user = user; return this; }
        public DeviceActionBuilder action(String action) { this.action = action; return this; }
        public DeviceActionBuilder status(String status) { this.status = status; return this; }
        public DeviceActionBuilder time(LocalDateTime time) { this.time = time; return this; }

        public DeviceAction build() {
            return new DeviceAction(id, deviceId, deviceName, user, action, status, time);
        }
    }
}
