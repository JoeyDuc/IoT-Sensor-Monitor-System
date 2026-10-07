package iot.sensor.anhduc.dto;

public class UserProfileDto {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String studentCode;
    private String className;
    private String github;
    private String figma;
    private String postman;
    private String reportUrl;
    private String avatarUrl;
    private String role;

    public UserProfileDto() {
    }

    public UserProfileDto(Long id, String fullName, String username, String email, String phone, String studentCode, String className, String github, String figma, String postman, String reportUrl, String avatarUrl, String role) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.studentCode = studentCode;
        this.className = className;
        this.github = github;
        this.figma = figma;
        this.postman = postman;
        this.reportUrl = reportUrl;
        this.avatarUrl = avatarUrl;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getFigma() {
        return figma;
    }

    public void setFigma(String figma) {
        this.figma = figma;
    }

    public String getPostman() {
        return postman;
    }

    public void setPostman(String postman) {
        this.postman = postman;
    }

    public String getReportUrl() {
        return reportUrl;
    }

    public void setReportUrl(String reportUrl) {
        this.reportUrl = reportUrl;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static UserProfileDtoBuilder builder() {
        return new UserProfileDtoBuilder();
    }

    public static class UserProfileDtoBuilder {
        private Long id;
        private String fullName;
        private String username;
        private String email;
        private String phone;
        private String studentCode;
        private String className;
        private String github;
        private String figma;
        private String postman;
        private String reportUrl;
        private String avatarUrl;
        private String role;

        public UserProfileDtoBuilder id(Long id) { this.id = id; return this; }
        public UserProfileDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserProfileDtoBuilder username(String username) { this.username = username; return this; }
        public UserProfileDtoBuilder email(String email) { this.email = email; return this; }
        public UserProfileDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public UserProfileDtoBuilder studentCode(String studentCode) { this.studentCode = studentCode; return this; }
        public UserProfileDtoBuilder className(String className) { this.className = className; return this; }
        public UserProfileDtoBuilder github(String github) { this.github = github; return this; }
        public UserProfileDtoBuilder figma(String figma) { this.figma = figma; return this; }
        public UserProfileDtoBuilder postman(String postman) { this.postman = postman; return this; }
        public UserProfileDtoBuilder reportUrl(String reportUrl) { this.reportUrl = reportUrl; return this; }
        public UserProfileDtoBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public UserProfileDtoBuilder role(String role) { this.role = role; return this; }

        public UserProfileDto build() {
            return new UserProfileDto(id, fullName, username, email, phone, studentCode, className, github, figma, postman, reportUrl, avatarUrl, role);
        }
    }
}
