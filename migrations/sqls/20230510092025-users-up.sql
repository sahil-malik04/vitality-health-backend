CREATE TABLE IF NOT EXISTS onedx_central.users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    firstName VARCHAR(255),
    middleName VARCHAR(255),
    lastName VARCHAR(255),
    password VARCHAR(100) NOT NULL,
    `userRole` JSON NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT "active",
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
)