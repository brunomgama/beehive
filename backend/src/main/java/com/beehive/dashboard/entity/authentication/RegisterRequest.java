package com.beehive.dashboard.entity.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for user registration requests.
 * Contains all required fields for registering a new user, with validation constraints.
 * Used for authentication API endpoints.
 */
public class RegisterRequest {
    /**
     * Username for the new user account.
     * Must be between 3 and 50 characters and not blank.
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    /**
     * Email address for the new user account.
     * Must be valid and not blank.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    /**
     * Password for the new user account.
     * Must be at least 8 characters and not blank.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    /**
     * First name of the new user.
     * Must not be blank.
     */
    @NotBlank(message = "First name is required")
    private String firstName;

    /**
     * Last name of the new user.
     * Must not be blank.
     */
    @NotBlank(message = "Last name is required")
    private String lastName;

    /**
     * Default constructor for RegisterRequest.
     */
    public RegisterRequest() {}

    /**
     * Constructs a RegisterRequest with all required fields.
     * @param username the username for registration
     * @param email the email address for registration
     * @param password the password for registration
     * @param firstName the first name of the user
     * @param lastName the last name of the user
     */
    public RegisterRequest(String username, String email, String password, String firstName, String lastName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    /**
     * Gets the username for registration.
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username for registration.
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the email address for registration.
     * @return the email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email address for registration.
     * @param email the email address to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Gets the password for registration.
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password for registration.
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets the first name of the user.
     * @return the first name
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the first name of the user.
     * @param firstName the first name to set
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Gets the last name of the user.
     * @return the last name
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the last name of the user.
     * @param lastName the last name to set
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}