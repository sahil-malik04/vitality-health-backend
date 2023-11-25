-- CREATE TABLE IF NOT EXISTS onedx_central.manage_referrers (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     referrerId INT,
--     groupId INT,
--     createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
--     updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
-- );
ALTER TABLE
    manage_referrers
ADD
    CONSTRAINT FK_referrerId FOREIGN KEY (referrerId) REFERENCES referrers(id),
ADD
    CONSTRAINT FK_groupId FOREIGN KEY (groupId) REFERENCES referrer_groups(id);