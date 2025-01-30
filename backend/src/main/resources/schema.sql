CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    price VARCHAR(255),
    rating DOUBLE,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS product_images (
    product_id BIGINT NOT NULL,
    images VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES product(id)
);