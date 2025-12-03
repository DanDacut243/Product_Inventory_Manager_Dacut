-- MySQL schema for products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `sku` varchar(64) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `quantity` int unsigned NOT NULL DEFAULT 0,
  `description` text NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_unique` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
