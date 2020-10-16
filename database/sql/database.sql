CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    tree INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS node (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    parent INTEGER REFERENCES node(id),
    content INTEGER NOT NULL UNIQUE REFERENCES content(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tree (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    root_node INTEGER REFERENCES node(id),
    creator INTEGER REFERENCES employee(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE node ADD CONSTRAINT fk_parent FOREIGN KEY (parent) REFERENCES node(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE node ADD CONSTRAINT fk_content FOREIGN KEY (content) REFERENCES content(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE content ADD CONSTRAINT fk_tree FOREIGN KEY (tree) REFERENCES tree(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE tree ADD CONSTRAINT fk_root_node FOREIGN KEY (root_node) REFERENCES node(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE tree ADD CONSTRAINT fk_creator FOREIGN KEY (creator) REFERENCES employee(id) ON UPDATE CASCADE ON DELETE SET NULL;