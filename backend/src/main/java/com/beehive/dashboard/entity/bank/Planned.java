package com.beehive.dashboard.entity.bank;

import com.beehive.dashboard.types.bank.MovementCategory;
import com.beehive.dashboard.types.bank.MovementRecurrence;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name="bank_planned")
public class Planned {
    /**
     * Unique identifier for the planned movement (primary key).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Account ID associated with this planned movement.
     * Must not be null.
     */
    @NotNull(message = "Account is required")
    private Long accountId;

    /**
     * Category of the planned movement (e.g., FOOD, UTILITIES).
     */
    @Enumerated(EnumType.STRING)
    private MovementCategory category;

    /**
     * Type of the planned movement (e.g., INCOME, EXPENSE).
     * Must not be null.
     */
    @NotNull(message = "Movement type is required")
    @Enumerated(EnumType.STRING)
    private MovementType type;

    /**
     * Amount of the planned movement (must be positive).
     * Must not be null.
     */
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    /**
     * Description of the planned movement.
     * Must be between 1 and 255 characters and not blank.
     */
    @NotBlank(message = "Description is required")
    @Size(min = 1, max = 255, message = "Description must be between 1 and 255 characters")
    private String description;

    /**
     * Recurrence of the planned movement (e.g., INCOME, EXPENSE).
     * Must not be null.
     */
    @NotNull(message = "Recurrence is required")
    @Enumerated(EnumType.STRING)
    private MovementRecurrence recurrence;

    /**
     * CRON time for the planned movement.
     */
    @NotBlank(message = "Cron time is required")
    private String cron;

    /**
     * Next execution for planned movement.
     */
    private LocalDate nextExecution;

    /**
     * End date for planned movement.
     */
    private LocalDate endDate;

    /**
     * Status of the movement (e.g., PENDING, CONFIRMED).
     * Must not be null.
     */
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private MovementStatus status;

    public Planned() {
    }

    public Planned(Long accountId, MovementCategory category, MovementType type, Double amount, String description,
                   MovementRecurrence recurrence, String cron, LocalDate nextExecution, LocalDate endDate, MovementStatus status) {
        this.accountId = accountId;
        this.category = category;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.recurrence = recurrence;
        this.cron = cron;
        this.nextExecution = nextExecution;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public MovementCategory getCategory() {
        return category;
    }

    public void setCategory(MovementCategory category) {
        this.category = category;
    }

    public MovementType getType() {
        return type;
    }

    public void setType(MovementType type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MovementRecurrence getRecurrence() {
        return recurrence;
    }

    public void setRecurrence(MovementRecurrence recurrence) {
        this.recurrence = recurrence;
    }

    public String getCron() {
        return cron;
    }

    public void setCron(String cron) {
        this.cron = cron;
    }

    public LocalDate getNextExecution() {
        return nextExecution;
    }

    public void setNextExecution(LocalDate nextExecution) {
        this.nextExecution = nextExecution;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public MovementStatus getStatus() {
        return status;
    }

    public void setStatus(MovementStatus status) {
        this.status = status;
    }
}
