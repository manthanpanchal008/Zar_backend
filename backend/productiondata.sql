-- MySQL dump style setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop obsolete or existing tables
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `gold_types`;
DROP TABLE IF EXISTS `collection_types`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `clientele`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `careers`;
DROP TABLE IF EXISTS `career_applications`;
DROP TABLE IF EXISTS `build_connections`;
DROP TABLE IF EXISTS `contact_inquiries`;
DROP TABLE IF EXISTS `zar_journey`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `manufacturing`;
DROP TABLE IF EXISTS `jewels`;
DROP TABLE IF EXISTS `jewel_subcategories`;

-- Table structure for users
CREATE TABLE `users` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `reset_otp` VARCHAR(6) NULL DEFAULT NULL,
  `reset_otp_expiry` TIMESTAMP NULL DEFAULT NULL,
  `reset_otp_attempts` INT DEFAULT 0,
  `reset_otp_last_sent` TIMESTAMP NULL DEFAULT NULL,
  `reset_token` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES 
(1, 'Zar Jewels', 'admin@gmail.com', '$2b$10$zv3ULVaxvX.i6mzCkzcvH.aukh2Ew7BqW4g7lzGRlHe.8jN14u2/2', 'admin', '2026-05-05 05:52:26', '2026-05-18 10:17:51'),
(2, 'Staff1', 'staff@gmail.com', '$2y$10$G4NXy6suU4CL75nHYQEqd.rqYAOTP5uAEDjSvanpAzb390.MYF2vS', 'staff', '2026-05-05 05:52:26', '2026-05-06 09:38:07');

-- Table structure for categories
CREATE TABLE `categories` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for categories
INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `is_active`, `created_at`, `updated_at`) VALUES 
(1, 'Bangles & Bracelet', 'bangles-bracelet', '1779738197168-menu-1.png', 1, '2026-05-25 19:43:17', '2026-05-25 19:43:17'),
(2, 'Mangalsutra & Necklace', 'mangalsutra-necklace', '1779738221918-menu-2.png', 1, '2026-05-25 19:43:41', '2026-05-25 19:43:41'),
(3, 'Lightweight Jewellery', 'lightweight-jewellery', '1779738267891-menu-6.png', 1, '2026-05-25 19:44:27', '2026-05-25 19:44:27');

-- Table structure for gold_types
CREATE TABLE `gold_types` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `purity` DECIMAL(5,2) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for gold_types
INSERT INTO `gold_types` (`id`, `name`, `purity`, `image`, `is_active`, `created_at`, `updated_at`) VALUES 
(1, '22K', 91.60, '1779738015295-18k_menu.png', 1, '2026-05-25 19:40:15', '2026-05-25 19:40:15'),
(2, '19K', 79.17, '1779738075320-18k_menu.png', 1, '2026-05-25 19:41:15', '2026-05-25 19:41:15');

-- Table structure for collection_types
CREATE TABLE `collection_types` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for collection_types
INSERT INTO `collection_types` (`id`, `name`, `image`, `is_active`, `created_at`, `updated_at`) VALUES 
(1, 'Handmade', '1779738311122-menu-3.png', 1, '2026-05-25 19:45:11', '2026-05-25 19:45:11'),
(2, 'Plain', '1779738327102-22kt_menu.png', 1, '2026-05-25 19:45:27', '2026-05-25 19:45:27'),
(3, 'Machine made', '1779738346919-menu-8.png', 1, '2026-05-25 19:45:46', '2026-05-25 19:45:46');

-- Table structure for products
CREATE TABLE `products` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT(20) UNSIGNED DEFAULT NULL,
  `gold_type_id` BIGINT(20) UNSIGNED DEFAULT NULL,
  `subcategory_id` BIGINT(20) UNSIGNED DEFAULT NULL,
  `collection_type_id` BIGINT(20) UNSIGNED DEFAULT NULL,
  `sku` VARCHAR(255) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL DEFAULT '',
  `short_description` TEXT DEFAULT NULL,
  `number_of_pcs` INT DEFAULT NULL,
  `display_finish` VARCHAR(255) DEFAULT NULL,
  `weight_specifications` LONGTEXT DEFAULT NULL,
  `technical_specifications` LONGTEXT DEFAULT NULL,
  `manufacturing_support` TEXT DEFAULT NULL,
  `product_url` VARCHAR(500) DEFAULT NULL,
  `product_images` LONGTEXT DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_gold_type` FOREIGN KEY (`gold_type_id`) REFERENCES `gold_types` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_collection_type` FOREIGN KEY (`collection_type_id`) REFERENCES `collection_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for products
INSERT INTO `products` (`id`, `category_id`, `gold_type_id`, `subcategory_id`, `collection_type_id`, `sku`, `title`, `short_description`, `number_of_pcs`, `display_finish`, `weight_specifications`, `technical_specifications`, `manufacturing_support`, `product_url`, `product_images`, `created_at`, `updated_at`) VALUES 
(1, NULL, NULL, 1, NULL, NULL, 'Design No. BAPL22K01', 'Defined by its geometric form and balanced composition, this earring design is developed for contemporary gold jewellery collections. The fan-shaped silhouette features a deep green inlay at the center, framed with precision-set stones along the outer edge to create controlled contrast and visual clarity. Fine gold borders enhance the structure while maintaining a clean, lightweight profile. Engineered for consistency in finish and wearability, the design offers a refined addition suited for modern retail assortments.', 2, 'Rose+White+Gold', '[{"label":"Gross Weight:","value":"5.00 grams"},{"label":"Net Weight:","value":"5.00 grams"}]', '[{"feature":"Metal Purity","details":"Standard 22KT Yellow Gold (Customizable to 18KT, 9KT, 14KT)"},{"feature":"Dimensions","details":"12mm x 8mm"},{"feature":"Enamel","details":"12mm x 8mm Enamel\\tYes (Blue)"}]', '<h2>Manufacturing &amp; Customization Support</h2><p>Zar offers the following B2B support for this design:</p><ul><li><strong>Enamel Customization:</strong> Can choose from a variety of available colors</li><li><strong>Size and Weight Scalability:</strong> Customizable to your required weight and size, with possibility of a slight modification to the design</li><li><strong>Branding:</strong> In-store customization support for retailers, hall-marking, private labelling for bulk buying</li></ul>', 'BAPL22K01', '["prod-3.webp","prod-2.webp"]', '2026-05-15 09:17:03', '2026-05-25 19:22:01'),
(2, 1, 2, NULL, 3, 'BNG-19K-MM-002', 'new bangles', 'zcsds sdcsd', 1, 'Rose+White+Gold', '[{"label":"Gross Weight","value":"42.500"},{"label":"Net Gold Weight","value":"38.200"}]', '[{"feature":"dede","details":"22kt"}]', 'sdsdc csdcsdcsd sdcasa', 'asdasdasdasd', '["1779738631998-18k_menu.png","1779738631999-22kt_menu.png","1779738632000-menu-1.png"]', '2026-05-25 19:50:32', '2026-05-25 19:50:32');

-- Table structure for events
CREATE TABLE `events` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `event_image` LONGTEXT DEFAULT NULL,
  `event_url` VARCHAR(500) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'upcoming',
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for events
INSERT INTO `events` (`id`, `title`, `location`, `start_date`, `end_date`, `description`, `event_image`, `event_url`, `status`, `created_at`, `updated_at`) VALUES 
(1, 'Watch and Jewellery Show Sharjah', 'Sharjah, UAE.', '2026-05-01', '2026-05-04', 'Sharjah Watch and Jewellery Show 2026 is a biannual event that will present the latest jewelry designs, trends in watch collections, and jewelry made up of precious stones and diamonds.', '["icon-1.png","zar-logo.svg","client-logo.png","1779730552512-Screenshot-2026-05-20-at-12-18-53.png"]', '/event/watch-and-jewellery-show-sharjah', 'past', '2026-05-06 11:58:40', '2026-05-25 17:35:52'),
(2, 'seminar', 'Sharjah, UAE.', '2026-05-23', '2026-04-09', 'ddascxsxcsdxd', '["1779733071515-BuildYourWayCard1.png"]', '/event/sdsdsdsd', 'upcoming', '2026-05-25 18:17:51', '2026-05-25 18:17:51');

-- Table structure for clientele
CREATE TABLE `clientele` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `clientele_title` VARCHAR(255) NOT NULL,
  `clientele_image` VARCHAR(500) DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for clientele
INSERT INTO `clientele` (`id`, `clientele_title`, `clientele_image`, `created_at`, `updated_at`) VALUES 
(1, 'Anjali', 'anjali.webp', '2026-05-06 12:55:59', '2026-05-15 10:49:48'),
(2, 'b.c.sen', 'b-c-sen.webp', '2026-05-15 10:49:31', '2026-05-15 10:49:37'),
(3, 'Manthan', '1779731557290-NetSuite-Symbol.png', '2026-05-25 17:52:37', '2026-05-25 17:52:37');

-- Table structure for testimonials
CREATE TABLE `testimonials` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `comment` TEXT NOT NULL,
  `position` VARCHAR(255) DEFAULT NULL,
  `companyName` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for careers
CREATE TABLE `careers` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `position` VARCHAR(255) NOT NULL,
  `experience` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `jobDescription` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for career_applications
CREATE TABLE `career_applications` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `workExperience` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `contactNumber` VARCHAR(50) NOT NULL,
  `cvFile` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for build_connections
CREATE TABLE `build_connections` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `country` ENUM('India', 'Others') NOT NULL,
  `state` VARCHAR(255) NOT NULL DEFAULT '',
  `city` VARCHAR(255) NOT NULL DEFAULT '',
  `pincode` VARCHAR(20) NOT NULL,
  `contact` VARCHAR(50) NOT NULL,
  `category` ENUM('Distributor', 'Retailers', 'Wholesaler') NOT NULL,
  `referredBy` VARCHAR(255) DEFAULT NULL,
  `companyWebsite` VARCHAR(255) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for contact_inquiries
CREATE TABLE `contact_inquiries` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `contactNumber` VARCHAR(50) NOT NULL,
  `inquiryType` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for zar_journey
CREATE TABLE `zar_journey` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `year` INT NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for contacts (Legacy)
CREATE TABLE `contacts` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for manufacturing (Legacy/Inactive)
CREATE TABLE `manufacturing` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
