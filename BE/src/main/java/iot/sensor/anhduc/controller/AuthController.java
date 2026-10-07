package iot.sensor.anhduc.controller;

import iot.sensor.anhduc.dto.ApiResponse;
import iot.sensor.anhduc.dto.AuthRequest;
import iot.sensor.anhduc.dto.AuthResponse;
import iot.sensor.anhduc.dto.RegisterRequest;
import iot.sensor.anhduc.dto.UserProfileDto;
import iot.sensor.anhduc.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileDto>> register(@RequestBody RegisterRequest request) {
        try {
            UserProfileDto profile = userService.register(request);
            return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công", profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "admin";
        try {
            UserProfileDto profile = userService.getProfile(username);
            return ResponseEntity.ok(ApiResponse.ok(profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
