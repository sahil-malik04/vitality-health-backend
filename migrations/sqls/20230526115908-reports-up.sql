-- CREATE TABLE IF NOT EXISTS onedx_central.reports (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     appointmentId INT NOT NULL,
--     report TEXT,
--     isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
--     createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
--     updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
-- );
ALTER TABLE
    reports
ADD
    CONSTRAINT FK_appointmentId FOREIGN KEY (appointmentId) REFERENCES appointments(id);