package iot.sensor.anhduc.controller;

import iot.sensor.anhduc.dto.ApiResponse;
import iot.sensor.anhduc.dto.HistoryDto;
import iot.sensor.anhduc.dto.PageResponse;
import iot.sensor.anhduc.service.HistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<HistoryDto>>> getHistory(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(defaultValue = "All Devices") String device,
            @RequestParam(defaultValue = "All Actions") String action,
            @RequestParam(defaultValue = "All Status") String status,
            @RequestParam(required = false) Long fromDate,
            @RequestParam(required = false) Long toDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "time") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<HistoryDto> result = historyService.getHistory(
                keyword, device, action, status, fromDate, toDate, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
