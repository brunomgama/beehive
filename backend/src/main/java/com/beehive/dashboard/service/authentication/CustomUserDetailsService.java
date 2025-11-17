package com.beehive.dashboard.service.authentication;

import com.beehive.dashboard.repository.authentication.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom implementation of Spring Security's UserDetailsService.
 * Loads user details from the database for authentication and authorization purposes.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;
    
    /**
     * Loads user details by username for Spring Security authentication.
     *
     * @param username The username to search for in the database
     * @return UserDetails implementation containing user information and authorities
     * @throws UsernameNotFoundException if user is not found in the database
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Loading user details for username: {}", username);

        try {
            logger.debug("Searching database for user with username: {}", username);
            UserDetails userDetails = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("User not found in database: {}", username);
                    return new UsernameNotFoundException("User not found: " + username);
                });

            logger.info("Successfully loaded user details for username: {}", username);
            logger.debug("User found with authorities: {}", userDetails.getAuthorities());

            return userDetails;
        } catch (UsernameNotFoundException e) {
            logger.error("Authentication failed - User not found: {}", username);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error while loading user details for username: {} - Error: {}", username, e.getMessage());
            throw new UsernameNotFoundException("Error loading user: " + username, e);
        }
    }
}