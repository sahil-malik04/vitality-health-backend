CREATE TABLE IF NOT EXISTS onedx_central.patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    middleName VARCHAR(255),
    lastName VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    sex VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    homeNumber VARCHAR(20),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(100),
    emergencyPhoneNumber VARCHAR(20),
    emergencyContact VARCHAR(255),
    status VARCHAR(255) NOT NULL DEFAULT "active",
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
)