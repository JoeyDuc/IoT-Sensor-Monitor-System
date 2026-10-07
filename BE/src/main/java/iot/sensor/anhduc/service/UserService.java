package iot.sensor.anhduc.service;

import iot.sensor.anhduc.config.JwtTokenProvider;
import iot.sensor.anhduc.dto.*;
import iot.sensor.anhduc.entity.User;
import iot.sensor.anhduc.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()) &&
            !request.getPassword().equals(user.getPassword())) { // fallback for plain-text initial admin
            throw new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        String token = tokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public UserProfileDto register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .studentCode(request.getStudentCode())
                .className(request.getClassName())
                .role("ROLE_USER")
                .build();

        User saved = userRepository.save(user);
        return toProfileDto(saved);
    }

    public UserProfileDto getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));
        return toProfileDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(String username, UserProfileDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getStudentCode() != null) user.setStudentCode(dto.getStudentCode());
        if (dto.getClassName() != null) user.setClassName(dto.getClassName());
        if (dto.getGithub() != null) user.setGithub(dto.getGithub());
        if (dto.getFigma() != null) user.setFigma(dto.getFigma());
        if (dto.getPostman() != null) user.setPostman(dto.getPostman());
        if (dto.getReportUrl() != null) user.setReportUrl(dto.getReportUrl());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());

        User updated = userRepository.save(user);
        return toProfileDto(updated);
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword()) &&
            !request.getOldPassword().equals(user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserProfileDto toProfileDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .studentCode(user.getStudentCode())
                .className(user.getClassName())
                .github(user.getGithub())
                .figma(user.getFigma())
                .postman(user.getPostman())
                .reportUrl(user.getReportUrl())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .build();
    }
}
