package iot.sensor.anhduc.service;

import iot.sensor.anhduc.dto.HistoryDto;
import iot.sensor.anhduc.dto.PageResponse;
import iot.sensor.anhduc.entity.DeviceAction;
import iot.sensor.anhduc.repository.DeviceActionRepository;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private static final Logger log = LoggerFactory.getLogger(HistoryService.class);

    private final DeviceActionRepository actionRepository;

    public HistoryService(DeviceActionRepository actionRepository) {
        this.actionRepository = actionRepository;
    }

    public PageResponse<HistoryDto> getHistory(
            String keyword,
            String device,
            String action,
            String status,
            Long fromDate,
            Long toDate,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = Sort.by(
                "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy != null && !sortBy.isBlank() ? sortBy : "time"
        );
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), size, sort);

        Specification<DeviceAction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (device != null && !device.isBlank() && !"All Devices".equalsIgnoreCase(device)) {
                String devNorm = device.trim();
                String devLower = devNorm.toLowerCase();
                if (devNorm.contains("1") || devLower.contains("nhiệt độ") || devLower.contains("nhiet do")) {
                    predicates.add(cb.or(
                            cb.equal(root.get("deviceId"), 1L),
                            cb.equal(root.get("deviceName"), devNorm),
                            cb.equal(root.get("deviceName"), "Đèn LED 1 (Nhiệt độ)"),
                            cb.equal(root.get("deviceName"), "Đèn LED 1")
                    ));
                } else if (devNorm.contains("2") || devLower.contains("độ ẩm") || devLower.contains("do am")) {
                    predicates.add(cb.or(
                            cb.equal(root.get("deviceId"), 2L),
                            cb.equal(root.get("deviceName"), devNorm),
                            cb.equal(root.get("deviceName"), "Đèn LED 2 (Độ ẩm)"),
                            cb.equal(root.get("deviceName"), "Đèn LED 2")
                    ));
                } else if (devNorm.contains("3") || devLower.contains("ánh sáng") || devLower.contains("anh sang")) {
                    predicates.add(cb.or(
                            cb.equal(root.get("deviceId"), 3L),
                            cb.equal(root.get("deviceName"), devNorm),
                            cb.equal(root.get("deviceName"), "Đèn LED 3 (Ánh sáng)"),
                            cb.equal(root.get("deviceName"), "Đèn LED 3")
                    ));
                } else {
                    predicates.add(cb.equal(root.get("deviceName"), devNorm));
                }
            }

            if (action != null && !action.isBlank() && !"All Actions".equalsIgnoreCase(action)) {
                String actNorm = action.trim().toUpperCase();
                if (actNorm.contains("BẬT") || actNorm.contains("TURN_ON") || "ON".equals(actNorm)) {
                    predicates.add(cb.equal(root.get("action"), "TURN_ON"));
                } else if (actNorm.contains("TẮT") || actNorm.contains("TURN_OFF") || "OFF".equals(actNorm)) {
                    predicates.add(cb.equal(root.get("action"), "TURN_OFF"));
                } else {
                    predicates.add(cb.equal(root.get("action"), action));
                }
            }

            if (status != null && !status.isBlank() && !"All Status".equalsIgnoreCase(status)) {
                String statNorm = status.trim().toUpperCase();
                if (statNorm.contains("THÀNH CÔNG") || statNorm.contains("SUCCESS")) {
                    predicates.add(cb.equal(root.get("status"), "SUCCESS"));
                } else if (statNorm.contains("THẤT BẠI") || statNorm.contains("FAILED") || statNorm.contains("FAIL")) {
                    predicates.add(cb.equal(root.get("status"), "FAILED"));
                } else {
                    predicates.add(cb.equal(root.get("status"), status));
                }
            }

            if (fromDate != null) {
                LocalDateTime from = LocalDateTime.ofInstant(Instant.ofEpochMilli(fromDate), ZoneId.systemDefault());
                predicates.add(cb.greaterThanOrEqualTo(root.get("time"), from));
            }

            if (toDate != null) {
                LocalDateTime to = LocalDateTime.ofInstant(Instant.ofEpochMilli(toDate), ZoneId.systemDefault());
                predicates.add(cb.lessThanOrEqualTo(root.get("time"), to));
            }

            if (keyword != null && !keyword.isBlank()) {
                String kw = keyword.trim();
                String kwLower = kw.toLowerCase();
                List<Predicate> orList = new ArrayList<>();

                // 1. User
                orList.add(cb.like(cb.lower(root.get("user")), "%" + kwLower + "%"));

                // 2. Action (Vietnamese / English)
                if (kwLower.contains("bật") || kwLower.contains("bat") || kwLower.equals("on")
                        || kwLower.contains("turn_on") || kwLower.contains("turn on")) {
                    orList.add(cb.equal(root.get("action"), "TURN_ON"));
                }
                if (kwLower.contains("tắt") || kwLower.contains("tat") || kwLower.equals("off")
                        || kwLower.contains("turn_off") || kwLower.contains("turn off")) {
                    orList.add(cb.equal(root.get("action"), "TURN_OFF"));
                }
                orList.add(cb.like(cb.lower(root.get("action")), "%" + kwLower + "%"));

                // 3. Status (Vietnamese / English)
                if (kwLower.contains("thành công") || kwLower.contains("thanh cong") || kwLower.contains("thành")
                        || kwLower.contains("success") || kwLower.equals("ok")) {
                    orList.add(cb.equal(root.get("status"), "SUCCESS"));
                }
                if (kwLower.contains("thất bại") || kwLower.contains("that bai") || kwLower.contains("thất")
                        || kwLower.contains("fail") || kwLower.contains("lỗi")) {
                    orList.add(cb.equal(root.get("status"), "FAILED"));
                }
                orList.add(cb.like(cb.lower(root.get("status")), "%" + kwLower + "%"));

                // 4. Device semantic matching
                if (kwLower.contains("nhiệt độ") || kwLower.contains("nhiet do") || kwLower.contains("nhiet")
                        || kwLower.contains("temp") || kwLower.contains("led 1") || kwLower.contains("led1")
                        || kwLower.contains("đèn 1") || kwLower.contains("den 1")) {
                    orList.add(cb.or(
                            cb.equal(root.get("deviceId"), 1L),
                            cb.like(root.get("deviceName"), "%1%"),
                            cb.like(root.get("deviceName"), "%Nhiệt độ%")
                    ));
                }

                if (kwLower.contains("độ ẩm") || kwLower.contains("do am") || kwLower.contains("humi")
                        || kwLower.contains("led 2") || kwLower.contains("led2")
                        || kwLower.contains("đèn 2") || kwLower.contains("den 2")) {
                    orList.add(cb.or(
                            cb.equal(root.get("deviceId"), 2L),
                            cb.like(root.get("deviceName"), "%2%"),
                            cb.like(root.get("deviceName"), "%Độ ẩm%")
                    ));
                }

                if (kwLower.contains("ánh sáng") || kwLower.contains("anh sang") || kwLower.contains("light")
                        || kwLower.contains("led 3") || kwLower.contains("led3")
                        || kwLower.contains("đèn 3") || kwLower.contains("den 3")) {
                    orList.add(cb.or(
                            cb.equal(root.get("deviceId"), 3L),
                            cb.like(root.get("deviceName"), "%3%"),
                            cb.like(root.get("deviceName"), "%Ánh sáng%")
                    ));
                }

                if (kwLower.equals("đèn") || kwLower.equals("den") || kwLower.equals("led")
                        || kwLower.equals("thiết bị") || kwLower.equals("thiet bi")) {
                    orList.add(cb.or(
                            cb.equal(root.get("deviceId"), 1L),
                            cb.equal(root.get("deviceId"), 2L),
                            cb.equal(root.get("deviceId"), 3L),
                            cb.like(root.get("deviceName"), "%Đèn%")
                    ));
                }

                // 5. Generic deviceName permutations for Postgres case sensitivity (e.g. 'đ'/'Đ')
                String patOriginal = "%" + kw + "%";
                String patLower = "%" + kwLower + "%";
                String patUpper = "%" + kw.toUpperCase() + "%";
                String patCap = "%" + (kw.isEmpty() ? "" : kw.substring(0, 1).toUpperCase() + kw.substring(1).toLowerCase()) + "%";
                String patUpperD = "%" + kw.replace('đ', 'Đ') + "%";
                String patLowerD = "%" + kw.replace('Đ', 'đ') + "%";
                String patUpperDUpper = "%" + kw.replace('đ', 'Đ').toUpperCase() + "%";

                orList.add(cb.like(root.get("deviceName"), patOriginal));
                orList.add(cb.like(root.get("deviceName"), patLower));
                orList.add(cb.like(root.get("deviceName"), patUpper));
                orList.add(cb.like(root.get("deviceName"), patCap));
                orList.add(cb.like(root.get("deviceName"), patUpperD));
                orList.add(cb.like(root.get("deviceName"), patLowerD));
                orList.add(cb.like(root.get("deviceName"), patUpperDUpper));

                // 6. ID
                try {
                    long idNum = Long.parseLong(kw);
                    orList.add(cb.equal(root.get("id"), idNum));
                } catch (NumberFormatException ignored) {}

                // 7. Time
                Expression<String> timeFmt1 = cb.function("to_char", String.class, root.get("time"), cb.literal("YYYY-MM-DD HH24:MI:SS"));
                Expression<String> timeFmt2 = cb.function("to_char", String.class, root.get("time"), cb.literal("DD/MM/YYYY HH24:MI:SS"));
                orList.add(cb.like(timeFmt1, patOriginal));
                orList.add(cb.like(timeFmt2, patOriginal));

                predicates.add(cb.or(orList.toArray(new Predicate[0])));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<DeviceAction> pageResult = actionRepository.findAll(spec, pageable);
        List<HistoryDto> dtos = pageResult.getContent().stream()
                .map(HistoryDto::fromEntity)
                .collect(Collectors.toList());

        return PageResponse.<HistoryDto>builder()
                .content(dtos)
                .page(pageResult.getNumber() + 1)
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .last(pageResult.isLast())
                .build();
    }
}
