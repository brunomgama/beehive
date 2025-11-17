package com.beehive.dashboard.entity.authentication;

import com.beehive.dashboard.types.authentication.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Entity representing a user in the system.
 * Implements Spring Security's UserDetails for authentication and authorization.
 * Contains all personal, credential, and account status fields required for user management.
 * Features:
 * - JPA entity mapping for persistence
 * - Validation constraints for input safety
 * - Role-based authorization
 * - Audit fields for creation and update timestamps
 * - Account status flags for security
 */
@Entity
@Table(name = "users")
public class User implements UserDetails {
    /**
     * Unique identifier for the user (primary key).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Username for login and identification.
     * Must be unique and between 3 and 50 characters.
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    private String username;

    /**
     * Email address for contact and login.
     * Must be unique and valid.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;

    /**
     * Hashed password for authentication.
     * Must not be blank.
     */
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    /**
     * First name of the user.
     */
    @NotBlank(message = "First name is required")
    @Column(name = "firstName", nullable = false)
    private String firstName;

    /**
     * Last name of the user.
     */
    @NotBlank(message = "Last name is required")
    @Column(name = "lastName", nullable = false)
    private String lastName;

    /**
     * Role of the user (USER, ADMIN, etc.).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    /**
     * Timestamp of last update.
     */
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    /**
     * Timestamp of creation.
     */
    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Indicates if the user account is enabled.
     */
    @Column(name = "isEnabled", nullable = false)
    private boolean isEnabled = true;

    /**
     * Indicates if the user account is non-expired.
     */
    @Column(name = "isAccountNonExpired", nullable = false)
    private boolean isAccountNonExpired = true;

    /**
     * Indicates if the user account is non-locked.
     */
    @Column(name = "isAccountNonLocked", nullable = false)
    private boolean isAccountNonLocked = true;

    /**
     * Indicates if the user credentials are non-expired.
     */
    @Column(name = "isCredentialsNonExpired", nullable = false)
    private boolean isCredentialsNonExpired = true;

    /**
     * Default constructor. Sets creation timestamp.
     */
    public User() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Constructs a user with all required personal and credential fields.
     * @param username the username
     * @param email the email address
     * @param password the password
     * @param firstName the first name
     * @param lastName the last name
     */
    public User(String username, String email, String password, String firstName, String lastName) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    /**
     * Updates the updatedAt timestamp before entity update.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Returns authorities granted to the user (role-based).
     * @return collection of granted authorities
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /**
     * Gets the username for authentication.
     * @return the username
     */
    @Override
    public String getUsername() {
        return username;
    }

    /**
     * Gets the password for authentication.
     * @return the password
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Checks if the account is non-expired.
     * @return true if account is non-expired
     */
    @Override
    public boolean isAccountNonExpired() {
        return isAccountNonExpired;
    }

    /**
     * Checks if the account is non-locked.
     * @return true if account is non-locked
     */
    @Override
    public boolean isAccountNonLocked() {
        return isAccountNonLocked;
    }

    /**
     * Checks if the credentials are non-expired.
     * @return true if credentials are non-expired
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return isCredentialsNonExpired;
    }

    /**
     * Checks if the account is enabled.
     * @return true if account is enabled
     */
    @Override
    public boolean isEnabled() {
        return isEnabled;
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
     * Sets the username.
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the email address.
     * @return the email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email address.
     * @param email the email address to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Sets the password.
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets the first name.
     * @return the first name
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the first name.
     * @param firstName the first name to set
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Gets the last name.
     * @return the last name
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the last name.
     * @param lastName the last name to set
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Gets the user role.
     * @return the role
     */
    public Role getRole() {
        return role;
    }

    /**
     * Sets the user role.
     * @param role the role to set
     */
    public void setRole(Role role) {
        this.role = role;
    }

    /**
     * Gets the last updated timestamp.
     * @return the updatedAt timestamp
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets the last updated timestamp.
     * @param updatedAt the updatedAt timestamp to set
     */
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Gets the creation timestamp.
     * @return the createdAt timestamp
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the creation timestamp.
     * @param createdAt the createdAt timestamp to set
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Sets the enabled status.
     * @param enabled true to enable, false to disable
     */
    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

    /**
     * Sets the account non-expired status.
     * @param accountNonExpired true if non-expired
     */
    public void setAccountNonExpired(boolean accountNonExpired) {
        isAccountNonExpired = accountNonExpired;
    }

    /**
     * Sets the account non-locked status.
     * @param accountNonLocked true if non-locked
     */
    public void setAccountNonLocked(boolean accountNonLocked) {
        isAccountNonLocked = accountNonLocked;
    }

    /**
     * Sets the credentials non-expired status.
     * @param credentialsNonExpired true if credentials are non-expired
     */
    public void setCredentialsNonExpired(boolean credentialsNonExpired) {
        isCredentialsNonExpired = credentialsNonExpired;
    }
}