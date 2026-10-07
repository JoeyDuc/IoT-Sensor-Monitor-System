package iot.sensor.anhduc.controller;

import iot.sensor.anhduc.dto.ApiResponse;
import iot.sensor.anhduc.dto.ChangePasswordRequest;
import iot.sensor.anhduc.dto.UserProfileDto;
import iot.sensor.anhduc.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(
            @RequestParam(required = false) String username,
            Authentication authentication
    ) {
        String targetUser = (username != null && !username.isBlank())
                ? username
                : (authentication != null ? authentication.getName() : "admin");

        try {
            UserProfileDto profile = userService.getProfile(targetUser);
            return ResponseEntity.ok(ApiResponse.ok(profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @RequestBody UserProfileDto dto,
            Authentication authentication
    ) {
        String targetUser = (dto.getUsername() != null && !dto.getUsername().isBlank())
                ? dto.getUsername()
                : (authentication != null ? authentication.getName() : "admin");

        try {
            UserProfileDto updated = userService.updateProfile(targetUser, dto);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody ChangePasswordRequest request,
            @RequestParam(required = false) String username,
            Authentication authentication
    ) {
        String targetUser = (username != null && !username.isBlank())
                ? username
                : (authentication != null ? authentication.getName() : "admin");

        try {
            userService.changePassword(targetUser, request);
            return ResponseEntity.ok(ApiResponse.ok("Đổi mật khẩu thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
