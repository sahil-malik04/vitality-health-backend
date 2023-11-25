-- CREATE TABLE IF NOT EXISTS onedx_central.employees (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     firstName VARCHAR(255) NOT NULL,
--     middleName VARCHAR(255),
--     lastName VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     phoneNumber VARCHAR(20) NOT NULL,
--     mobileNumber VARCHAR(20),
--     position ENUM('radiologist', 'technologist', 'admin') NOT NULL,
--     facilityId INT NOT NULL,
--     status VARCHAR(255) NOT NULL DEFAULT "active",
--     isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
--     createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
--     updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
-- );
ALTER TABLE
    employees
ADD
    CONSTRAINT FK_facilityId FOREIGN KEY (facilityId) REFERENCES facilities(id);