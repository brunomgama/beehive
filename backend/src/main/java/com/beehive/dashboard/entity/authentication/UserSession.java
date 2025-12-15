package com.beehive.dashboard.entity.authentication;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a user session in the system.
 * Tracks user login sessions with device and browser information.
 */
@Entity
@Table(name = "user_sessions")
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_token", nullable = false, unique = true)
    private String sessionToken;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "os", length = 100)
    private String os;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_active_at", nullable = false)
    private LocalDateTime lastActiveAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public UserSession() {
        this.createdAt = LocalDateTime.now();
        this.lastActiveAt = LocalDateTime.now();
    }

    public UserSession(String sessionToken, Long userId, String userAgent, String ipAddress) {
        this();
        this.sessionToken = sessionToken;
        this.userId = userId;
        this.userAgent = userAgent;
        this.ipAddress = ipAddress;
        parseUserAgent(userAgent);
    }

    /**
     * Parses the user agent string to extract device, browser, and OS information.
     */
    private void parseUserAgent(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            this.deviceType = "Unknown";
            this.browser = "Unknown";
            this.os = "Unknown";
            return;
        }

        // Parse device type
        if (userAgent.contains("Mobile") || userAgent.contains("Android") || userAgent.contains("iPhone") || userAgent.contains("iPad")) {
            this.deviceType = userAgent.contains("iPad") ? "Tablet" : "Mobile";
        } else {
            this.deviceType = "Desktop";
        }

        // Parse browser
        if (userAgent.contains("Edg/")) {
            this.browser = "Edge " + extractVersion(userAgent, "Edg/");
        } else if (userAgent.contains("Chrome/") && !userAgent.contains("Edg/")) {
            this.browser = "Chrome " + extractVersion(userAgent, "Chrome/");
        } else if (userAgent.contains("Safari/") && !userAgent.contains("Chrome/")) {
            this.browser = "Safari " + extractVersion(userAgent, "Version/");
        } else if (userAgent.contains("Firefox/")) {
            this.browser = "Firefox " + extractVersion(userAgent, "Firefox/");
        } else {
            this.browser = "Unknown";
        }

        // Parse OS
        if (userAgent.contains("Windows NT 10")) {
            this.os = "Windows 10/11";
        } else if (userAgent.contains("Windows NT")) {
            this.os = "Windows";
        } else if (userAgent.contains("Mac OS X")) {
            this.os = "macOS";
        } else if (userAgent.contains("Linux")) {
            this.os = "Linux";
        } else if (userAgent.contains("iPhone") || userAgent.contains("iPad")) {
            this.os = "iOS";
        } else if (userAgent.contains("Android")) {
            this.os = "Android";
        } else {
            this.os = "Unknown";
        }
    }

    private String extractVersion(String userAgent, String prefix) {
        try {
            int start = userAgent.indexOf(prefix) + prefix.length();
            int end = start;
            while (end < userAgent.length() && (Character.isDigit(userAgent.charAt(end)) || userAgent.charAt(end) == '.')) {
                end++;
            }
            String version = userAgent.substring(start, end);
            if (version.contains(".")) {
                return version.substring(0, version.indexOf("."));
            }
            return version;
        } catch (Exception e) {
            return "";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastActiveAt() {
        return lastActiveAt;
    }

    public void setLastActiveAt(LocalDateTime lastActiveAt) {
        this.lastActiveAt = lastActiveAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
    
    public void updateLastActive() {
        this.lastActiveAt = LocalDateTime.now();
    }
}
