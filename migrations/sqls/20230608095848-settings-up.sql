CREATE TABLE IF NOT EXISTS onedx_central.settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    timeInterval INT,
    appointmentLimit INT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
)