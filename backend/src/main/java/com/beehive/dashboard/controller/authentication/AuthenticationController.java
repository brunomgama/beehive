package com.beehive.dashboard.controller.authentication;

import com.beehive.dashboard.dto.authentication.AuthenticationResponse;
import com.beehive.dashboard.entity.authentication.LoginRequest;
import com.beehive.dashboard.entity.authentication.RegisterRequest;
import com.beehive.dashboard.service.authentication.AuthenticationService;
import com.beehive.dashboard.entity.authentication.User;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling user authentication operations.
 * Provides endpoints for user registration, login, and current user retrieval.
 */
@RestController
@RequestMapping("/v1/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Registers a new user account in the system.
     *
     * @param request RegisterRequest containing user registration details
     * @return ResponseEntity with AuthenticationResponse containing JWT token and user details, or error response
     */
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("Registration attempt for username: {} and email: {}", request.getUsername(), request.getEmail());

        try {
            User user = new User(request.getUsername(),
                    request.getEmail(), request.getPassword(),
                    request.getFirstName(), request.getLastName());

            logger.debug("Creating user object for registration: {}", user.getUsername());
            String token = authenticationService.register(user);
            logger.info("User registration successful for username: {}", request.getUsername());

            AuthenticationResponse response = new AuthenticationResponse(
                    token, user.getUsername(), user.getEmail(),
                    user.getFirstName(), user.getLastName(), user.getRole().name()
            );

            logger.debug("Returning authentication response for newly registered user: {}", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Registration failed for username: {} - Error: {}", request.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Authenticates a user with username and password credentials.
     *
     * @param request LoginRequest containing username and password
     * @return ResponseEntity with AuthenticationResponse containing JWT token and user details, or error response
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login attempt for username: {}", request.getUsername());

        try {
            String token = authenticationService.authenticate(request.getUsername(), request.getPassword());
            logger.debug("Authentication successful, retrieving user details for: {}", request.getUsername());

            User user = authenticationService.getCurrentUser(token);
            logger.info("Login successful for username: {}", request.getUsername());

            AuthenticationResponse response = new AuthenticationResponse(
                    token, user.getUsername(), user.getEmail(),
                    user.getFirstName(), user.getLastName(), user.getRole().name()
            );

            logger.debug("Returning authentication response for logged in user: {}", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Login failed for username: {} - Error: {}", request.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Retrieves current user information based on JWT token.
     *
     * @param authHeader Authorization header containing Bearer JWT token
     * @return ResponseEntity with AuthenticationResponse containing current user details, or error response
     */
    @GetMapping("/me")
    public ResponseEntity<AuthenticationResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        logger.info("Request to get current user information from token");

        try {
            String token = authHeader.substring(7);
            logger.debug("Extracting user information from JWT token");

            User user = authenticationService.getCurrentUser(token);
            logger.info("Successfully retrieved current user: {}", user.getUsername());

            AuthenticationResponse response = new AuthenticationResponse(
                    token, user.getUsername(), user.getEmail(),
                    user.getFirstName(), user.getLastName(), user.getRole().name()
            );

            logger.debug("Returning current user information for: {}", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Failed to retrieve current user information - Error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
}