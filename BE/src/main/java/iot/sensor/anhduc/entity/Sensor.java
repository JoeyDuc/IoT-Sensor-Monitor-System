package iot.sensor.anhduc.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensors")
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String type; // Temperature, Humidity, Light

    @Column(length = 20)
    private String unit; // °C, %, lux

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Sensor() {
    }

    public Sensor(Long id, String name, String type, String unit, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.unit = unit;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public static SensorBuilder builder() {
        return new SensorBuilder();
    }

    public static class SensorBuilder {
        private Long id;
        private String name;
        private String type;
        private String unit;
        private LocalDateTime createdAt;

        public SensorBuilder id(Long id) { this.id = id; return this; }
        public SensorBuilder name(String name) { this.name = name; return this; }
        public SensorBuilder type(String type) { this.type = type; return this; }
        public SensorBuilder unit(String unit) { this.unit = unit; return this; }
        public SensorBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Sensor build() {
            return new Sensor(id, name, type, unit, createdAt);
        }
    }
}
