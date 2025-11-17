package com.beehive.dashboard.service.authentication;

import com.beehive.dashboard.dto.authentication.UserResponse;
import com.beehive.dashboard.entity.authentication.User;
import com.beehive.dashboard.repository.authentication.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for handling user authentication business logic.
 * Manages user registration, authentication, and JWT token operations.
 */
@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieves a specific user by its unique identifier.
     *
     * @param id The unique identifier of the user to retrieve
     * @return User entity matching the provided ID
     * @throws ResponseStatusException with NOT_FOUND status if account doesn't exist
     */
    public UserResponse getById(Long id) {
        logger.info("Retrieving user with ID: {}", id);

        logger.debug("Searching database for account ID: {}", id);
        User user = userRepository.findById(id).orElseThrow(() -> {
            logger.error("User not found with ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "User not found with the provided id: " + id);
        });

        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name());

        logger.info("Successfully retrieved user with ID: {}", id);
        logger.debug("User details - Name: {} {}", user.getFirstName(), user.getLastName());

        return userResponse;
    }

    /**
     * Retrieves all user accounts from the database.
     *
     * @return List of all User entities in the system
     */
    public List<UserResponse> getAll() {
        logger.info("Retrieving all users from database");

        List<UserResponse> users = userRepository.findAll().stream().map(user -> new UserResponse(
                user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name()
        )).collect(Collectors.toList());
        logger.info("Successfully retrieved {} accounts", users.size());

        return users;
    }
}