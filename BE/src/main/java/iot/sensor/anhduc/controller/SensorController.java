package iot.sensor.anhduc.controller;

import iot.sensor.anhduc.dto.*;
import iot.sensor.anhduc.service.SensorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping("/data")
    public ResponseEntity<ApiResponse<PageResponse<DataSensorDto>>> getSensorData(
            @RequestParam(defaultValue = "All") String sensorType,
            @RequestParam(required = false, defaultValue = "") String quickSearch,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "time") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<DataSensorDto> result = sensorService.getSensorData(
                sensorType, quickSearch, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<SensorSummaryDto>> getLatestSummary() {
        SensorSummaryDto summary = sensorService.getLatestSummary();
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<DashboardChartDto>> getChartData(
            @RequestParam(defaultValue = "last15") String filterMode,
            @RequestParam(required = false) Long from,
            @RequestParam(required = false) Long to
    ) {
        DashboardChartDto chart = sensorService.getChartData(filterMode, from, to);
        return ResponseEntity.ok(ApiResponse.ok(chart));
    }

    @PostMapping("/data")
    public ResponseEntity<ApiResponse<DataSensorDto>> postReading(@RequestBody DataSensorDto dto) {
        DataSensorDto saved = sensorService.createReading(dto);
        return ResponseEntity.ok(ApiResponse.ok("Thêm dữ liệu thành công", saved));
    }
}
