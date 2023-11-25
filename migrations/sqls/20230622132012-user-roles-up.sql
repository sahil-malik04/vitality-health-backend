CREATE TABLE IF NOT EXISTS onedx_central.user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roleId INT NOT NULL,
    userId INT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ALTER TABLE
--     user_roles
-- ADD
--     CONSTRAINT FK_roleId FOREIGN KEY (roleId) REFERENCES roles(id),
-- ADD
--     CONSTRAINT FK_userId FOREIGN KEY (userId) REFERENCES users(id);