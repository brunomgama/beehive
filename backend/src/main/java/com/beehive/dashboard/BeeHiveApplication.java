package com.beehive.dashboard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BeeHiveApplication {

	private static final Logger logger = LoggerFactory.getLogger(BeeHiveApplication.class);

	/**
	 * Main entry point for the Spring Boot application.
	 * Initializes the application context and starts the embedded server.
	 *
	 * @param args Command line arguments passed to the application
	 */
	public static void main(String[] args) {
		logger.info("Starting Dashboard Demo Application...");
		logger.info("Application startup initiated with {} command line arguments", args.length);

		try {
			logger.debug("Initializing Spring Boot application context");
			SpringApplication.run(BeeHiveApplication.class, args);
			logger.info("Dashboard Demo Application started successfully");
			logger.info("Application is ready to accept requests");
		} catch (Exception e) {
			logger.error("Failed to start Dashboard Demo Application - Error: {}", e.getMessage(), e);
			throw e;
		}
	}
}
