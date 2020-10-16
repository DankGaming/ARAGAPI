export const up = `
    CREATE TABLE IF NOT EXISTS tree (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        name VARCHAR(100) NOT NULL,
        root_node INTEGER REFERENCES node(id),
        creator INTEGER REFERENCES employee(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

export const constraintsUp = `
    ALTER TABLE content ADD CONSTRAINT fk_root_node FOREIGN KEY (root_node) REFERENCES node(id) ON UPDATE CASCADE ON DELETE SET NULL;
    ALTER TABLE content ADD CONSTRAINT fk_creator FOREIGN KEY (creator) REFERENCES employee(id) ON UPDATE CASCADE ON DELETE SET NULL;
`;
