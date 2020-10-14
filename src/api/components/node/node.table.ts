export const up = `
    CREATE TABLE IF NOT EXISTS node (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        parent INTEGER REFERENCES node(id) ON UPDATE CASCADE ON DELETE SET NULL,
        content INTEGER NOT NULL REFERENCES content(id) ON UPDATE CASCADE ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;
