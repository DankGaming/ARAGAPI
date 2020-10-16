export const up = `
    CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        tree INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

export const constraintsUp = `
    ALTER TABLE content ADD CONSTRAINT fk_tree FOREIGN KEY (tree) REFERENCES tree(id) ON UPDATE CASCADE ON DELETE CASCADE;
`;
