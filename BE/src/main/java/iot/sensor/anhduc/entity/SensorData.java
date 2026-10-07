package iot.sensor.anhduc.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "datasensor")
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "humidity")
    private Double humidity;

    @Column(name = "light")
    private Double light;

    @Column(name = "time")
    private LocalDateTime time;

    public SensorData() {}

    public SensorData(Double temperature, Double humidity, Double light, LocalDateTime time) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.light = light;
        this.time = time;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }
    public Double getLight() { return light; }
    public void setLight(Double light) { this.light = light; }
    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }
}
