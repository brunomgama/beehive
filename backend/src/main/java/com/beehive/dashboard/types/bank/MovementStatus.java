package com.beehive.dashboard.types.bank;

/**
 * Enum representing the status of a bank account movement.
 * Used to track the lifecycle and outcome of transactions within the application.
 * Typical usage includes filtering movements by status and managing transaction workflows.
 */
public enum MovementStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    FAILED
}
