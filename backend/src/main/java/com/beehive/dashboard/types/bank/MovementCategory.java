package com.beehive.dashboard.types.bank;

/**
 * Enum representing categories for bank account movements.
 * Used to classify transactions for reporting, analytics, and business logic.
 * Typical usage includes assigning categories to movements and filtering transaction history.
 */
public enum MovementCategory {
    // Housing
    RENT,
    PROPERTY_TAXES,
    HOME_MAINTENANCE_REPAIRS,
    HOME_INSURANCE,
    HOUSEHOLD_SUPPLIES_FURNITURE,
    
    // Transportation
    FUEL,
    PUBLIC_TRANSPORT,
    UBER,
    CAR_MAINTENANCE,
    PARKING,
    VEHICLE_INSURANCE,
    TOLLS,
    
    // Shopping
    SHOPPING,
    CLOTHING,
    ELECTRONICS,
    GIFTS,
    BEAUTY_COSMETICS,
    
    // Food & Dining
    GROCERIES,
    RESTAURANTS,
    FAST_FOOD,
    COFFEE_SHOPS,
    ALCOHOL_BARS,
    FOOD_DRINKS,
    
    // Entertainment
    ENTERTAINMENT,
    MOVIES,
    EVENTS,
    GAMES,
    NIGHTLIFE,
    HOBBIES,
    GYM,
    
    // Technology & Services
    TECH,
    SOFTWARE_SUBSCRIPTIONS,
    INTERNET_SERVICES,
    MOBILE_PHONE_PLANS,
    NET,
    
    // Utilities
    UTILITIES,
    WATER,
    ELECTRICITY,
    GAS,
    
    // Business
    OFFICE_SUPPLIES,
    BUSINESS_TRAVEL,
    PROFESSIONAL_SERVICES,
    
    // Education
    EDUCATION,
    ONLINE_COURSES,
    CLASSES,
    
    // Insurance
    HEALTH_INSURANCE,
    CAR_INSURANCE,
    LIFE_INSURANCE,
    TRAVEL_INSURANCE,
    
    // Health & Medical
    HEALTH,
    PHARMACY,
    MEDICAL,
    THERAPY,
    
    // Pets
    PET_FOOD,
    VET_VISITS,
    PET_ACCESSORIES,
    PET_GROOMING,
    
    // Banking & Investments
    BANK_FEES,
    INVESTMENTS,
    
    // Streaming & Subscriptions
    STREAMING_SERVICES,
    VIDEO_STREAMING,
    MUSIC_STREAMING,
    CLOUD_STORAGE,
    DIGITAL_MAGAZINES,
    NEWS_SUBSCRIPTIONS,
    
    // Travel
    HOTELS,
    FLIGHTS,
    CAR_RENTAL,
    TOURS,
    
    // Income
    SALARY,
    FREELANCING,
    INVESTMENT_INCOME,
    REFUNDS,
    RENTAL_INCOME,
    
    // General
    OTHER
}