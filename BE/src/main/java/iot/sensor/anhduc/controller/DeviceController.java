package iot.sensor.anhduc.controller;

import iot.sensor.anhduc.dto.ApiResponse;
import iot.sensor.anhduc.dto.DeviceControlRequest;
import iot.sensor.anhduc.dto.DeviceDto;
import iot.sensor.anhduc.service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeviceDto>>> getAllDevices() {
        List<DeviceDto> devices = deviceService.getAllDevices();
        return ResponseEntity.ok(ApiResponse.ok(devices));
    }

    @PostMapping("/{id}/control")
    public ResponseEntity<ApiResponse<DeviceDto>> controlDevice(
            @PathVariable String id,
            @RequestBody(required = false) DeviceControlRequest request,
            Authentication authentication) {
        if (request == null) {
            request = new DeviceControlRequest();
        }
        if (request.getUser() == null || request.getUser().isBlank()) {
            request.setUser(authentication != null ? authentication.getName() : "admin");
        }

        try {
            DeviceDto result = deviceService.controlDevice(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Điều khiển thiết bị thành công", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<DeviceDto>> toggleDevice(
            @PathVariable String id,
            Authentication authentication) {
        DeviceControlRequest request = new DeviceControlRequest();
        request.setUser(authentication != null ? authentication.getName() : "admin");
        try {
            DeviceDto result = deviceService.controlDevice(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Chuyển trạng thái thiết bị thành công", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
