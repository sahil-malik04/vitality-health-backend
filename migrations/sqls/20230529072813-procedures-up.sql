CREATE TABLE IF NOT EXISTS onedx_central.procedures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    parent INT,
    `level` INT,
    `type` VARCHAR(255),
    `weight` INT,
    notes VARCHAR(255),
    cpt VARCHAR(255),
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
)