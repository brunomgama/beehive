package com.beehive.dashboard.dto.authentication;

/**
 * DTO representing the response returned after successful authentication.
 * Contains user details.
 */
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    public UserResponse() {}

    /**
     * Constructs a User Response with all user public details.
     *
     * @param id User Id
     * @param username Username
     * @param email Email address
     * @param firstName First name
     * @param lastName Last name
     * @param role User role
     */
    public UserResponse(Long id, String username, String email, String firstName, String lastName, String role) {
        this.id = id;
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
     * Returns the username of the user.
     *
     * @return Username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username of the user.
     *
     * @param username Username
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Returns the email address of the user.
     *
     * @return Email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email address of the user.
     *
     * @param email Email address
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Returns the first name of the user.
     *
     * @return First name
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the first name of the user.
     *
     * @param firstName First name
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Returns the last name of the user.
     *
     * @return Last name
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the last name of the user.
     *
     * @param lastName Last name
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Returns the role assigned to the user.
     *
     * @return User role
     */
    public String getRole() {
        return role;
    }

    /**
     * Sets the role assigned to the user.
     *
     * @param role User role
     */
    public void setRole(String role) {
        this.role = role;
    }
}