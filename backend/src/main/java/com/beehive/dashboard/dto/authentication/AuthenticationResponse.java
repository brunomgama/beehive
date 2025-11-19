package com.beehive.dashboard.dto.authentication;

/**
 * DTO representing the response returned after successful authentication.
 * Contains user details and the authentication token for session management.
 * Typical usage includes returning this object from authentication endpoints.
 */
public class AuthenticationResponse {

    private Long id;
    private String token;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    public AuthenticationResponse() {}

    /**
     * Constructs an AuthenticationResponse with all user details and token.
     *
     * @param id User ID
     * @param token JWT token
     * @param username Username
     * @param email Email address
     * @param firstName First name
     * @param lastName Last name
     * @param role User role
     */
    public AuthenticationResponse(Long id, String token, String username, String email, String firstName, String lastName, String role) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    /**
     * Gets the user ID.
     * @return the user ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the user ID.
     * @param id the user ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Returns the JWT token issued upon authentication.
     *
     * @return JWT token
     */
    public String getToken() {
        return token;
    }

    /**
     * Sets the JWT token.
     *
     * @param token JWT token
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * Returns the username of the authenticated user.
     *
     * @return Username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username of the authenticated user.
     *
     * @param username Username
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Returns the email address of the authenticated user.
     *
     * @return Email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email address of the authenticated user.
     *
     * @param email Email address
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Returns the first name of the authenticated user.
     *
     * @return First name
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the first name of the authenticated user.
     *
     * @param firstName First name
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Returns the last name of the authenticated user.
     *
     * @return Last name
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the last name of the authenticated user.
     *
     * @param lastName Last name
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Returns the role assigned to the authenticated user.
     *
     * @return User role
     */
    public String getRole() {
        return role;
    }

    /**
     * Sets the role assigned to the authenticated user.
     *
     * @param role User role
     */
    public void setRole(String role) {
        this.role = role;
    }
}