package com.beehive.dashboard.controller.authentication;

import com.beehive.dashboard.dto.authentication.UserResponse;
import com.beehive.dashboard.service.authentication.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for handling user authentication operations.
 * Provides endpoints for user registration, login, and current user retrieval.
 */
@RestController
@RequestMapping("/v1/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    /**
     * Retrieves all user accounts from the system.
     *
     * @return ResponseEntity containing list of all accounts
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll() {
        logger.info("Request to retrieve all users");

        List<UserResponse> users = userService.getAll();
        logger.info("Retrieved {} users from database", users.size());

        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    /**
     * Retrieve user information based on the id
     *
     * @param id User id to be fetched
     * @return ResponseEntity containing the requested user
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        logger.info("Request to retrieve user with ID: {}", id);

        try {
            UserResponse user = userService.getById(id);
            logger.info("Successfully retrieved user with ID: {}", id);
            logger.debug("Account details - Name: {} {}", user.getFirstName(), user.getLastName());

            return ResponseEntity.status(HttpStatus.OK).body(user);
        } catch (RuntimeException e) {
            logger.error("Failed to retrieve account with ID: {} - Error: {}", id, e.getMessage());
            throw e;
        }
    }
}