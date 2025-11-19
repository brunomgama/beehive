package com.beehive.dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for Cross-Origin Resource Sharing (CORS).
 * Sets up CORS mappings and configuration for the application endpoints.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Adds CORS mappings for the specified endpoint patterns.
     * Allows requests from <code>http://localhost:3000 </code> with specified HTTP methods and headers.
     *
     * @param registry the {@link CorsRegistry} to configure
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/v1/**")
//                .allowedOrigins("http://localhost:3000", "http://100.75.101.53:3000")
                .allowedOrigins("http://localhost:3000", "https://grateful-showed-mardi-conditions.trycloudflare.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    /**
     * Provides a CORS configuration source bean for the application.
     * Configures allowed origins, methods, headers, and credentials for <code>/v1/**</code> endpoints.
     *
     * @return the configured {@link CorsConfigurationSource}
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000");
//        configuration.addAllowedOrigin("http://100.75.101.53:3000");
        configuration.addAllowedOrigin("https://grateful-showed-mardi-conditions.trycloudflare.com");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/v1/**", configuration);
        return source;
    }
}