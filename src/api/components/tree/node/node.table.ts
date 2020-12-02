export const up = `
    CREATE TABLE IF NOT EXISTS node (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        parent INTEGER REFERENCES node(id),
        content INTEGER NOT NULL REFERENCES content(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

export const constraintsUp = `
    ALTER TABLE node ADD CONSTRAINT fk_parent FOREIGN KEY (parent) REFERENCES node(id) ON UPDATE CASCADE ON DELETE SET NULL;
`;
