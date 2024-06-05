const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to MySQL database');
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`, (error) => {
        if (error) throw error;
        console.log(`Database ${process.env.DATABASE} created or already exists`);
        connection.changeUser({ database: process.env.DATABASE }, (err) => {
            if (err) throw err;
            createTableCategory(connection);
            createTableProduct(connection);
            createTableProductVariant(connection);
            createTableProductReview(connection);
            createTableProductImage(connection);
            createTableCustomer(connection);
            createTableAddress(connection);
            createTableAdminUser(connection);
            createTableShopUser(connection);
            createTableAvatarImage(connection);
            connection.end();
        });
    });
});

const createTableProduct = (connection) => {
    connection.query(`
        CREATE TABLE product
        (
            id int NOT NULL AUTO_INCREMENT,
            category_id int DEFAULT NULL,
            code varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime DEFAULT NULL,
            enabled tinyint(1) NOT NULL,
            variant_selection_method varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
            average_rating double NOT NULL DEFAULT '0',
            PRIMARY KEY (id),
            UNIQUE KEY (code),
            KEY (category_id),
            CONSTRAINT FOREIGN KEY (category_id) REFERENCES category (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Products table created or already exists');
    });
}

const createTableCategory = (connection) => {
    connection.query(`
        CREATE TABLE category
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            image_path VARCHAR(255) DEFAULT NULL,
            slug VARCHAR(255) UNIQUE,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
            meta_title VARCHAR(255) DEFAULT NULL,
            meta_description TEXT DEFAULT NULL,
            meta_keywords TEXT DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Category table created or already exists');
    });
}

const createTableProductVariant = (connection) => {
    connection.query(`
        CREATE TABLE product_variant (
         id int NOT NULL AUTO_INCREMENT,
         product_id int NOT NULL,
         code varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
         created_at datetime NOT NULL,
         updated_at datetime DEFAULT NULL,
         on_hold int NOT NULL,
         on_hand int NOT NULL,
         tracked tinyint(1) NOT NULL,
         width double DEFAULT NULL,
         height double DEFAULT NULL,
         depth double DEFAULT NULL,
         weight double DEFAULT NULL,
         position int NOT NULL,
         shipping_required tinyint(1) NOT NULL,
         version int NOT NULL DEFAULT '1',
         enabled tinyint(1) NOT NULL,
         suggest_amount varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         min_amount double DEFAULT NULL,
         max_amount double DEFAULT NULL,
         min_denomination int DEFAULT NULL,
         PRIMARY KEY (id),
         UNIQUE KEY (code),
         KEY (product_id),
         CONSTRAINT FK_product_variant_product FOREIGN KEY (product_id) REFERENCES product (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Products variant table created or already exists');
    });
}

const createTableProductReview = (connection) => {
    connection.query(`
        CREATE TABLE product_review (
            id int NOT NULL AUTO_INCREMENT,
            product_id int NOT NULL,
            author_id int NOT NULL,
            title varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            rating int NOT NULL,
            comment longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
            status varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime DEFAULT NULL,
            PRIMARY KEY (id),
            KEY (product_id),
            KEY (author_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Products review table created or already exists');
    });
}

const createTableProductImage = (connection) => {
    connection.query(`
        CREATE TABLE product_image (
           id int NOT NULL AUTO_INCREMENT,
           product_id int NOT NULL,
           type varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           path varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
           PRIMARY KEY (id),
           KEY (product_id),
           CONSTRAINT FK_product_image_product FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Products image table created or already exists');
    });
}

const createTableAdminUser = (connection) => {
    connection.query(`
        CREATE TABLE admin_user (
            id int NOT NULL AUTO_INCREMENT,
            username varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            enabled tinyint(1) NOT NULL,
            password varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            last_login datetime DEFAULT NULL,
            password_reset_token varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            password_requested_at datetime DEFAULT NULL,
            email_verification_token varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            verified_at datetime DEFAULT NULL,
            locked tinyint(1) NOT NULL,
            expires_at datetime DEFAULT NULL,
            credentials_expire_at datetime DEFAULT NULL,
            roles longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
            email varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            email_canonical varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            created_at datetime NOT NULL,
            updated_at datetime DEFAULT NULL,
            first_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            last_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            locale_code varchar(12) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
            encoder_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Admin user table created or already exists');
    });
}

const createTableCustomer = (connection) => {
    connection.query(`
        CREATE TABLE customer (
          id int NOT NULL AUTO_INCREMENT,
          email varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
          email_canonical varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
          first_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          last_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          birthday datetime DEFAULT NULL,
          gender varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'u',
          created_at datetime NOT NULL,
          updated_at datetime DEFAULT NULL,
          phone_number varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          subscribed_to_newsletter tinyint(1) NOT NULL,
          xero_contact_id varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          xero_contact_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          ekyc_verified_status tinyint(1) NOT NULL DEFAULT '0',
          occupation varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          purpose_of_transaction varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          preferred_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
          PRIMARY KEY (id),
          UNIQUE KEY (email),
          UNIQUE KEY (email_canonical)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Customer table created or already exists');
    });
}

const createTableShopUser = (connection) => {
    connection.query(`
        CREATE TABLE shop_user (
           id int NOT NULL AUTO_INCREMENT,
           customer_id int NOT NULL,
           username varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           username_canonical varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           enabled tinyint(1) NOT NULL,
           password varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           last_login datetime DEFAULT NULL,
           password_reset_token varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           password_requested_at datetime DEFAULT NULL,
           email_verification_token varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           verified_at datetime DEFAULT NULL,
           locked tinyint(1) NOT NULL,
           expires_at datetime DEFAULT NULL,
           credentials_expire_at datetime DEFAULT NULL,
           roles longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
           email varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           email_canonical varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           created_at datetime NOT NULL,
           updated_at datetime DEFAULT NULL,
           encoder_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           password_reset_token_verified tinyint(1) DEFAULT '0',
           register_at datetime DEFAULT NULL,
           PRIMARY KEY (id),
           CONSTRAINT FOREIGN KEY (customer_id) REFERENCES customer (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Shop user table created or already exists');
    });
}

const createTableAddress = (connection) => {
    connection.query(`
        CREATE TABLE address (
         id int NOT NULL AUTO_INCREMENT,
         customer_id int DEFAULT NULL,
         first_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         last_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         phone_number varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         street varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         company varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         city varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         postcode varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         created_at datetime NOT NULL,
         updated_at datetime DEFAULT NULL,
         country_code varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         province_code varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         province_name varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         street_number varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         state varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         address_type varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
         PRIMARY KEY (id),
         KEY (customer_id),
         CONSTRAINT FK_address_customer FOREIGN KEY (customer_id) REFERENCES customer (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Address table created or already exists');
    });
}

const createTableAvatarImage = (connection) => {
    connection.query(`
        CREATE TABLE avatar_image (
           id int NOT NULL AUTO_INCREMENT,
           admin_user_id int NOT NULL,
           type varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
           path varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
           PRIMARY KEY (id),
           KEY (admin_user_id),
           CONSTRAINT FK_avatar_image_admin_user FOREIGN KEY (admin_user_id) REFERENCES admin_user (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
      `, (error) => {
        if (error) throw error;
        console.log('Avatar admin user image table created or already exists');
    });
}