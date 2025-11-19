package com.beehive.dashboard.entity.bank;

import com.beehive.dashboard.types.bank.MovementCategory;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Entity representing a bank movement (transaction) in the system.
 * Contains all required fields for movement management, including account association, category, type, amount,
 * description, date, and status.
 * Features:
 * - JPA entity mapping for persistence
 * - Validation constraints for input safety
 * - Movement type, category, and status enumerations
 * - Standard constructors and accessors
 */
@Entity
@Table(name = "bank_movements")
public class Movement {
    /**
     * Unique identifier for the movement (primary key).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Account ID associated with this movement.
     * Must not be null.
     */
    @NotNull(message = "Account is required")
    private Long accountId;

    /**
     * Category of the movement (e.g., FOOD, UTILITIES).
     */
    @Enumerated(EnumType.STRING)
    private MovementCategory category;

    /**
     * Type of the movement (e.g., INCOME, EXPENSE).
     * Must not be null.
     */
    @NotNull(message = "Movement type is required")
    @Enumerated(EnumType.STRING)
    private MovementType type;

    /**
     * Amount of the movement (must be positive).
     * Must not be null.
     */
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    /**
     * Description of the movement.
     * Must be between 1 and 255 characters and not blank.
     */
    @NotBlank(message = "Description is required")
    @Size(min = 1, max = 255, message = "Description must be between 1 and 255 characters")
    private String description;

    /**
     * Date of the movement.
     * Must not be null.
     */
    @NotNull(message = "Date is required")
    private LocalDate date;

    /**
     * Status of the movement (e.g., PENDING, CONFIRMED).
     * Must not be null.
     */
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private MovementStatus status;

    /**
     * Default constructor for Movement.
     */
    public Movement() {
    }

    /**
     * Constructs a Movement with all required fields.
     * @param accountId the account ID associated with the movement
     * @param category the category of the movement
     * @param type the type of the movement
     * @param amount the amount of the movement
     * @param description the description of the movement
     * @param date the date of the movement
     * @param status the status of the movement
     */
    public Movement(Long accountId, MovementCategory category, MovementType type, Double amount, String description, LocalDate date, MovementStatus status) {
        this.accountId = accountId;
        this.category = category;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.status = status;
    }

    /**
     * Gets the movement ID.
     * @return the movement ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the movement ID.
     * @param id the movement ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the account ID associated with this movement.
     * @return the account ID
     */
    public Long getAccountId() {
        return accountId;
    }

    /**
     * Sets the account ID associated with this movement.
     * @param accountId the account ID to set
     */
    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    /**
     * Gets the category of the movement.
     * @return the movement category
     */
    public MovementCategory getCategory() {
        return category;
    }

    /**
     * Sets the category of the movement.
     * @param category the movement category to set
     */
    public void setCategory(MovementCategory category) {
        this.category = category;
    }

    /**
     * Gets the type of the movement.
     * @return the movement type
     */
    public MovementType getType() {
        return type;
    }

    /**
     * Sets the type of the movement.
     * @param type the movement type to set
     */
    public void setType(MovementType type) {
        this.type = type;
    }

    /**
     * Gets the amount of the movement.
     * @return the movement amount
     */
    public Double getAmount() {
        return amount;
    }

    /**
     * Sets the amount of the movement.
     * @param amount the movement amount to set
     */
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    /**
     * Gets the description of the movement.
     * @return the movement description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of the movement.
     * @param description the movement description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the date of the movement.
     * @return the movement date
     */
    public LocalDate getDate() {
        return date;
    }

    /**
     * Sets the date of the movement.
     * @param date the movement date to set
     */
    public void setDate(LocalDate date) {
        this.date = date;
    }

    /**
     * Gets the status of the movement.
     * @return the movement status
     */
    public MovementStatus getStatus() {
        return status;
    }

    /**
     * Sets the status of the movement.
     * @param status the movement status to set
     */
    public void setStatus(MovementStatus status) {
        this.status = status;
    }
}
