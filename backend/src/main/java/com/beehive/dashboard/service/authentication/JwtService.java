package com.beehive.dashboard.service.authentication;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service class for JWT token operations.
 * Handles token generation, validation, and claims extraction for authentication.
 */
@Service
public class JwtService {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String secretKey;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    /**
     * Extracts username from JWT token.
     *
     * @param token JWT token string
     * @return Username contained in the token subject claim
     */
    public String extractUsername(String token) {
        logger.debug("Extracting username from JWT token");

        try {
            String username = extractClaim(token, Claims::getSubject);
            logger.debug("Successfully extracted username from token: {}", username);
            return username;
        } catch (Exception e) {
            logger.error("Failed to extract username from token - Error: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Extracts a specific claim from JWT token using a claims resolver function.
     *
     * @param token JWT token string
     * @param claimsResolver Function to extract specific claim from Claims object
     * @param <T> Type of the claim to extract
     * @return The extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        logger.debug("Extracting specific claim from JWT token");

        try {
            final Claims claims = extractAllClaims(token);
            T claimValue = claimsResolver.apply(claims);
            logger.debug("Successfully extracted claim from token");
            return claimValue;
        } catch (Exception e) {
            logger.error("Failed to extract claim from token - Error: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Generates JWT token for user with default claims.
     *
     * @param userDetails UserDetails containing user information
     * @return Generated JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        logger.info("Generating JWT token for user: {}", userDetails.getUsername());

        String token = generateToken(new HashMap<>(), userDetails);
        logger.info("JWT token generated successfully for user: {}", userDetails.getUsername());
        logger.debug("Token generation completed for user: {}", userDetails.getUsername());

        return token;
    }
    
    /**
     * Generates JWT token for user with custom extra claims.
     *
     * @param extraClaims Additional claims to include in the token
     * @param userDetails UserDetails containing user information
     * @return Generated JWT token string
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        logger.info("Generating JWT token with extra claims for user: {}", userDetails.getUsername());
        logger.debug("Extra claims count: {}, Expiration: {} ms", extraClaims.size(), jwtExpiration);

        try {
            String token = buildToken(extraClaims, userDetails, jwtExpiration);
            logger.info("JWT token with extra claims generated successfully for user: {}", userDetails.getUsername());
            return token;
        } catch (Exception e) {
            logger.error("Failed to generate JWT token for user: {} - Error: {}", userDetails.getUsername(), e.getMessage());
            throw e;
        }
    }
    
    /**
     * Builds JWT token with specified claims, user details and expiration.
     *
     * @param extraClaims Additional claims to include in the token
     * @param userDetails UserDetails containing user information
     * @param expiration Token expiration time in milliseconds
     * @return Built JWT token string
     */
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        logger.debug("Building JWT token for user: {} with expiration: {} ms", userDetails.getUsername(), expiration);

        try {
            Date issuedAt = new Date(System.currentTimeMillis());
            Date expirationDate = new Date(System.currentTimeMillis() + expiration);

            logger.debug("Token times - Issued: {}, Expires: {}", issuedAt, expirationDate);

            String token = Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(userDetails.getUsername())
                    .setIssuedAt(issuedAt)
                    .setExpiration(expirationDate)
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();

            logger.debug("JWT token built successfully for user: {}", userDetails.getUsername());
            return token;
        } catch (Exception e) {
            logger.error("Failed to build JWT token for user: {} - Error: {}", userDetails.getUsername(), e.getMessage());
            throw e;
        }
    }
    
    /**
     * Validates JWT token against user details.
     *
     * @param token JWT token string to validate
     * @param userDetails UserDetails to validate against
     * @return True if token is valid and belongs to the user, false otherwise
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        logger.debug("Validating JWT token for user: {}", userDetails.getUsername());

        try {
            final String username = extractUsername(token);
            boolean isUsernameMatch = username.equals(userDetails.getUsername());
            boolean isNotExpired = !isTokenExpired(token);
            boolean isValid = isUsernameMatch && isNotExpired;

            logger.debug("Token validation results - Username match: {}, Not expired: {}, Valid: {}",
                isUsernameMatch, isNotExpired, isValid);

            if (isValid) {
                logger.info("JWT token validation successful for user: {}", userDetails.getUsername());
            } else {
                logger.warn("JWT token validation failed for user: {} - Username match: {}, Not expired: {}",
                    userDetails.getUsername(), isUsernameMatch, isNotExpired);
            }

            return isValid;
        } catch (Exception e) {
            logger.error("JWT token validation error for user: {} - Error: {}", userDetails.getUsername(), e.getMessage());
            return false;
        }
    }
    
    /**
     * Checks if JWT token is expired.
     *
     * @param token JWT token string to check
     * @return True if token is expired, false otherwise
     */
    private boolean isTokenExpired(String token) {
        logger.debug("Checking if JWT token is expired");

        try {
            Date expiration = extractExpiration(token);
            Date now = new Date();
            boolean isExpired = expiration.before(now);

            logger.debug("Token expiration check - Expires: {}, Now: {}, Is expired: {}",
                expiration, now, isExpired);

            if (isExpired) {
                logger.warn("JWT token is expired - Expiration: {}", expiration);
            }

            return isExpired;
        } catch (Exception e) {
            logger.error("Failed to check token expiration - Error: {}", e.getMessage());
            return true; // Consider expired if we can't check
        }
    }
    
    /**
     * Extracts expiration date from JWT token.
     *
     * @param token JWT token string
     * @return Date representing token expiration time
     */
    private Date extractExpiration(String token) {
        logger.debug("Extracting expiration date from JWT token");

        try {
            Date expiration = extractClaim(token, Claims::getExpiration);
            logger.debug("Successfully extracted expiration date: {}", expiration);
            return expiration;
        } catch (Exception e) {
            logger.error("Failed to extract expiration date from token - Error: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Extracts all claims from JWT token.
     *
     * @param token JWT token string
     * @return Claims object containing all token claims
     */
    private Claims extractAllClaims(String token) {
        logger.debug("Extracting all claims from JWT token");

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            logger.debug("Successfully extracted all claims from token");
            return claims;
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token is expired - Error: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token - Error: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("Malformed JWT token - Error: {}", e.getMessage());
            throw e;
        } catch (SecurityException e) {
            logger.error("Invalid JWT token signature - Error: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid JWT token argument - Error: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Gets the signing key for JWT token operations.
     *
     * @return Key object for signing and verifying JWT tokens
     */
    private Key getSignInKey() {
        logger.debug("Creating signing key for JWT operations");

        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            Key signingKey = Keys.hmacShaKeyFor(keyBytes);
            logger.debug("Signing key created successfully");
            return signingKey;
        } catch (Exception e) {
            logger.error("Failed to create signing key - Error: {}", e.getMessage());
            throw e;
        }
    }
}