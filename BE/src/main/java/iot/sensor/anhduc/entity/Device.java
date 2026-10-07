package iot.sensor.anhduc.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code; // e.g. "led1", "led2", "led3"

    @Column(nullable = false, length = 100)
    private String name; // e.g. "Đèn LED 1", "Quạt phòng khách"

    @Column(length = 50)
    private String type; // e.g. "LED", "FAN"

    @Column(length = 100)
    private String location; // e.g. "Phòng khách", "Main Hall"

    @Column(nullable = false, length = 20)
    private String status; // "ON" or "OFF"

    @Column(name = "icon_type", length = 50)
    private String iconType; // "light", "temperature", "humidity", "fan"

    @Column(length = 20)
    private String unit;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Device() {
    }

    public Device(Long id, String code, String name, String type, String location, String status, String iconType, String unit, LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = type;
        this.location = location;
        this.status = status;
        this.iconType = iconType;
        this.unit = unit;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "OFF";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIconType() {
        return iconType;
    }

    public void setIconType(String iconType) {
        this.iconType = iconType;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static DeviceBuilder builder() {
        return new DeviceBuilder();
    }

    public static class DeviceBuilder {
        private Long id;
        private String code;
        private String name;
        private String type;
        private String location;
        private String status = "OFF";
        private String iconType;
        private String unit;
        private LocalDateTime createdAt;

        public DeviceBuilder id(Long id) { this.id = id; return this; }
        public DeviceBuilder code(String code) { this.code = code; return this; }
        public DeviceBuilder name(String name) { this.name = name; return this; }
        public DeviceBuilder type(String type) { this.type = type; return this; }
        public DeviceBuilder location(String location) { this.location = location; return this; }
        public DeviceBuilder status(String status) { this.status = status; return this; }
        public DeviceBuilder iconType(String iconType) { this.iconType = iconType; return this; }
        public DeviceBuilder unit(String unit) { this.unit = unit; return this; }
        public DeviceBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Device build() {
            return new Device(id, code, name, type, location, status, iconType, unit, createdAt);
        }
    }
}
