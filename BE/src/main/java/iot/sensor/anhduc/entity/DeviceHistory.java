package iot.sensor.anhduc.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deviceactionhistory")
public class DeviceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device")
    private String device;

    @Column(name = "action")
    private String action;  // "on" or "off"

    @Column(name = "status")
    private String status;  // "success" or "failure"

    @Column(name = "time")
    private LocalDateTime time;

    public DeviceHistory() {}

    public DeviceHistory(String device, String action, String status, LocalDateTime time) {
        this.device = device;
        this.action = action;
        this.status = status;
        this.time = time;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }
}
