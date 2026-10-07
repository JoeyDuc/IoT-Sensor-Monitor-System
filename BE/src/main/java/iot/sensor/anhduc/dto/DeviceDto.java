package iot.sensor.anhduc.dto;

import iot.sensor.anhduc.entity.Device;

public class DeviceDto {
    private String id;
    private String code;
    private String name;
    private String type;
    private String location;
    private String status;
    private String unit;
    private String iconType;

    public DeviceDto() {
    }

    public DeviceDto(String id, String code, String name, String type, String location, String status, String unit, String iconType) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = type;
        this.location = location;
        this.status = status;
        this.unit = unit;
        this.iconType = iconType;
    }

    public static DeviceDto fromEntity(Device device) {
        if (device == null) return null;
        return DeviceDto.builder()
                .id(device.getCode() != null ? device.getCode() : String.valueOf(device.getId()))
                .code(device.getCode())
                .name(device.getName())
                .type(device.getType())
                .location(device.getLocation())
                .status(device.getStatus())
                .unit(device.getUnit())
                .iconType(device.getIconType())
                .build();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getIconType() {
        return iconType;
    }

    public void setIconType(String iconType) {
        this.iconType = iconType;
    }

    public static DeviceDtoBuilder builder() {
        return new DeviceDtoBuilder();
    }

    public static class DeviceDtoBuilder {
        private String id;
        private String code;
        private String name;
        private String type;
        private String location;
        private String status;
        private String unit;
        private String iconType;

        public DeviceDtoBuilder id(String id) { this.id = id; return this; }
        public DeviceDtoBuilder code(String code) { this.code = code; return this; }
        public DeviceDtoBuilder name(String name) { this.name = name; return this; }
        public DeviceDtoBuilder type(String type) { this.type = type; return this; }
        public DeviceDtoBuilder location(String location) { this.location = location; return this; }
        public DeviceDtoBuilder status(String status) { this.status = status; return this; }
        public DeviceDtoBuilder unit(String unit) { this.unit = unit; return this; }
        public DeviceDtoBuilder iconType(String iconType) { this.iconType = iconType; return this; }

        public DeviceDto build() {
            return new DeviceDto(id, code, name, type, location, status, unit, iconType);
        }
    }
}
