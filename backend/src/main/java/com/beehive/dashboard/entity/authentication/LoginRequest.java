package com.beehive.dashboard.entity.authentication;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for user login requests.
 * Contains username and password fields with validation constraints.
 * Used for authentication API endpoints.
 */
public class LoginRequest {
    
    /**
     * Username of the user attempting to log in.
     * Must not be blank.
     */
    @NotBlank(message = "Username is required")
    private String username;
    
    /**
     * Password of the user attempting to log in.
     * Must not be blank.
     */
    @NotBlank(message = "Password is required")
    private String password;
    
    /**
     * Default constructor for LoginRequest.
     */
    public LoginRequest() {}
    
    /**
     * Constructs a LoginRequest with username and password.
     * @param username the username for login
     * @param password the password for login
     */
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    /**
     * Gets the username for login.
     * @return the username
     */
    public String getUsername() {
        return username;
    }
    
    /**
     * Sets the username for login.
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }
    
    /**
     * Gets the password for login.
     * @return the password
     */
    public String getPassword() {
        return password;
    }
    
    /**
     * Sets the password for login.
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }
}