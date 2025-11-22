package com.beehive.dashboard.entity.bank;

import com.beehive.dashboard.types.bank.AccountType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Entity representing a bank account in the system.
 * Contains all required fields for account management, including user association, account name, IBAN, balance, and type.
 * Features:
 * - JPA entity mapping for persistence
 * - Validation constraints for input safety
 * - Account type enumeration
 * - Standard constructors and accessors
 */
@Entity
@Table(name="bank_account")
public class Account {
    /**
     * Unique identifier for the account (primary key).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User ID associated with this account.
     * Must not be null.
     */
    @NotNull
    private Long userId;

    /**
     * Name of the account (e.g., "Checking", "Savings").
     * Must be between 2 and 75 characters and not blank.
     */
    @NotBlank(message = "Account Name is required")
    @Size(min = 2, max = 75, message = "Account Name must be between 2 and 75 characters")
    private String accountName;

    /**
     * IBAN (International Bank Account Number) for the account.
     * Must be exactly 25 characters and not blank.
     */
    @NotBlank(message = "IBAN is required")
    @Size(min = 25, max = 25, message = "IBAN must be 25 characters")
    private String iban;

    /**
     * Current balance of the account.
     * Must not be null.
     */
    @NotNull(message = "Balance is required")
    private Double balance;

    /**
     * Type of the account (e.g., CHECKING, SAVINGS).
     */
    @Enumerated(EnumType.STRING)
    private AccountType type;

    /**
     * Priority in which we show the accounts.
     * Which is more important
     */
    private Long priority;

    /**
     * Default constructor for Account.
     */
    public Account() {
    }

    /**
     * Constructs an Account with all required fields.
     * @param userId the user ID associated with the account
     * @param accountName the name of the account
     * @param iban the IBAN of the account
     * @param balance the initial balance
     * @param type the account type
     */
    public Account(Long userId, String accountName, String iban, Double balance, AccountType type, Long priority) {
        this.userId = userId;
        this.accountName = accountName;
        this.iban = iban;
        this.balance = balance;
        this.type = type;
        this.priority = priority;
    }

    /**
     * Gets the account ID.
     * @return the account ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the account ID.
     * @param id the account ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the user ID associated with this account.
     * @return the user ID
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * Sets the user ID associated with this account.
     * @param userId the user ID to set
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * Gets the account name.
     * @return the account name
     */
    public String getAccountName() {
        return accountName;
    }

    /**
     * Sets the account name.
     * @param accountName the account name to set
     */
    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    /**
     * Gets the IBAN of the account.
     * @return the IBAN
     */
    public String getIban() {
        return iban;
    }

    /**
     * Sets the IBAN of the account.
     * @param iban the IBAN to set
     */
    public void setIban(String iban) {
        this.iban = iban;
    }

    /**
     * Gets the current balance of the account.
     * @return the balance
     */
    public Double getBalance() {
        return balance;
    }

    /**
     * Sets the current balance of the account.
     * @param balance the balance to set
     */
    public void setBalance(Double balance) {
        this.balance = balance;
    }

    /**
     * Gets the account type.
     * @return the account type
     */
    public AccountType getType() {
        return type;
    }

    /**
     * Sets the account type.
     * @param type the account type to set
     */
    public void setType(AccountType type) {
        this.type = type;
    }

    /**
     * Gets the account priority.
     * @return the account priority
     */
    public Long getPriority() {
        return priority;
    }

    /**
     * Sets the account priority.
     * @param priority the account priority to set
     */
    public void setPriority(Long priority) {
        this.priority = priority;
    }
}
