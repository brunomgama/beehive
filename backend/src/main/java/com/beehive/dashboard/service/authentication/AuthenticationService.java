package com.beehive.dashboard.service.authentication;

import com.beehive.dashboard.entity.authentication.User;
import com.beehive.dashboard.repository.authentication.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service class for handling user authentication business logic.
 * Manages user registration, authentication, and JWT token operations.
 */
@Service
public class AuthenticationService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    /**
     * Registers a new user in the system after validating uniqueness constraints.
     *
     * @param user User entity containing registration information
     * @return JWT token string for the newly registered user
     * @throws RuntimeException if username or email already exists
     */
    public String register(User user) {
        logger.info("Starting user registration process for username: {}", user.getUsername());

        if (userRepository.existsByUsername(user.getUsername())) {
            logger.warn("Registration failed - Username already exists: {}", user.getUsername());
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            logger.warn("Registration failed - Email already exists: {}", user.getEmail());
            throw new RuntimeException("Email already exists");
        }

        logger.debug("Encoding password for user: {}", user.getUsername());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        logger.debug("Saving user to database: {}", user.getUsername());
        User savedUser = userRepository.save(user);
        logger.info("User successfully saved to database with ID: {} for username: {}", savedUser.getId(), savedUser.getUsername());

        logger.debug("Generating JWT token for registered user: {}", savedUser.getUsername());
        String token = jwtService.generateToken(savedUser);
        logger.info("Registration completed successfully for user: {}", savedUser.getUsername());

        return token;
    }
    
    /**
     * Authenticates a user using username and password credentials.
     *
     * @param username User's username for authentication
     * @param password User's password for authentication
     * @return JWT token string for the authenticated user
     * @throws RuntimeException if authentication fails or user is not found
     */
    public String authenticate(String username, String password) {
        logger.info("Starting authentication process for username: {}", username);

        try {
            logger.debug("Attempting authentication with Spring Security for username: {}", username);
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            logger.info("Authentication successful for username: {}", username);
        } catch (Exception e) {
            logger.error("Authentication failed for username: {} - Error: {}", username, e.getMessage());
            throw e;
        }

        logger.debug("Retrieving user details from database for username: {}", username);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> {
                logger.error("User not found in database during authentication: {}", username);
                return new RuntimeException("User not found");
            });

        logger.debug("Generating JWT token for authenticated user: {}", username);
        String token = jwtService.generateToken(user);
        logger.info("Authentication process completed successfully for user: {}", username);

        return token;
    }
    
    /**
     * Retrieves the current user information based on a JWT token.
     *
     * @param token JWT token containing user information
     * @return User entity with current user details
     * @throws RuntimeException if token is invalid or user is not found
     */
    public User getCurrentUser(String token) {
        logger.debug("Extracting user information from JWT token");

        try {
            String username = jwtService.extractUsername(token);
            logger.debug("Successfully extracted username from token: {}", username);

            logger.debug("Retrieving user details from database for username: {}", username);
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found in database for username extracted from token: {}", username);
                    return new RuntimeException("User not found");
                });

            logger.info("Successfully retrieved current user: {}", username);
            return user;
        } catch (Exception e) {
            logger.error("Failed to get current user from token - Error: {}", e.getMessage());
            throw new RuntimeException("Invalid token or user not found");
        }
    }
}