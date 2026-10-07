package iot.sensor.anhduc.dto;

public class DeviceControlRequest {
    private String action; // "ON", "OFF", "TURN_ON", "TURN_OFF"
    private String user;

    public DeviceControlRequest() {
    }

    public DeviceControlRequest(String action, String user) {
        this.action = action;
        this.user = user;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
