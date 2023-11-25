-- CREATE TABLE IF NOT EXISTS onedx_central.appointments (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     title VARCHAR(255),
--     patientId INT NOT NULL,
--     facilityId INT NOT NULL,
--     procedureId INT NOT NULL,
--     roomId INT,
--     referrerId INT,
--     startDate DATETIME,
--     completionDate DATETIME,
--     finalDate DATETIME,
--     timeSlot VARCHAR(255),
--     comments TEXT,
--     isSelf BOOLEAN NOT NULL,
--     category VARCHAR(100) NOT NULL,
--     status VARCHAR(100) NOT NULL,
--     isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
--     createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
--     updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
-- );
ALTER TABLE
    appointments
ADD
    CONSTRAINT FK_patientId FOREIGN KEY (patientId) REFERENCES patients(id),
ADD
    CONSTRAINT FK_appointmentFacilityId FOREIGN KEY (facilityId) REFERENCES facilities(id),
ADD
    CONSTRAINT FK_procedureId FOREIGN KEY (procedureId) REFERENCES procedures(id),
ADD
    CONSTRAINT FK_roomId FOREIGN KEY (roomId) REFERENCES rooms(id),
ADD
    CONSTRAINT FK_appointmentReferrerId FOREIGN KEY (referrerId) REFERENCES referrers(id);