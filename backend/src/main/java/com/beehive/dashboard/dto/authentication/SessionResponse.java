package com.beehive.dashboard.dto.authentication;

import java.time.LocalDateTime;

/**
 * DTO for session response data.
 */
public class SessionResponse {
    private Long id;
    private String sessionToken;
    private String deviceType;
    private String browser;
    private String os;
    private String ipAddress;
    private LocalDateTime createdAt;
    private LocalDateTime lastActiveAt;
    private boolean isCurrent;

    public SessionResponse() {
    }

    public SessionResponse(Long id, String sessionToken, String deviceType, String browser, String os, String ipAddress, LocalDateTime createdAt, LocalDateTime lastActiveAt, boolean isCurrent) {
        this.id = id;
        this.sessionToken = sessionToken;
        this.deviceType = deviceType;
        this.browser = browser;
        this.os = os;
        this.ipAddress = ipAddress;
        this.createdAt = createdAt;
        this.lastActiveAt = lastActiveAt;
        this.isCurrent = isCurrent;
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

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
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

    public boolean isCurrent() {
        return isCurrent;
    }

    public void setCurrent(boolean current) {
        isCurrent = current;
    }
}
