-- Zar Jewels Database Setup Script
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB
-- This file contains all table schemas, constraints, and standard seed data.

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Drop Existing Tables (ordered to avoid constraint errors)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `gold_types`;
DROP TABLE IF EXISTS `collection_types`;
DROP TABLE IF EXISTS `users`;
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

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
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

-- Dumping seed data for `users`
-- Admin: admin@gmail.com / Password: admin (or hashed equivalent: $2b$10$zv3ULVaxvX.i6mzCkzcvH.aukh2Ew7BqW4g7lzGRlHe.8jN14u2/2)
-- Staff: staff@gmail.com / Password: staff (or hashed equivalent: $2y$10$G4NXy6suU4CL75nHYQEqd.rqYAOTP5uAEDjSvanpAzb390.MYF2vS)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES 
(1, 'Zar Jewels Admin', 'admin@gmail.com', '$2b$10$zv3ULVaxvX.i6mzCkzcvH.aukh2Ew7BqW4g7lzGRlHe.8jN14u2/2', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Zar Jewels Staff', 'staff@gmail.com', '$2y$10$G4NXy6suU4CL75nHYQEqd.rqYAOTP5uAEDjSvanpAzb390.MYF2vS', 'staff', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `categories`
-- --------------------------------------------------------
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

-- Dumping seed data for `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `is_active`, `created_at`, `updated_at`) VALUES 
(1, 'Bangles & Bracelet', 'bangles-bracelet', '1779738197168-menu-1.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Mangalsutra & Necklace', 'mangalsutra-necklace', '1779738221918-menu-2.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Lightweight Jewellery', 'lightweight-jewellery', '1779738267891-menu-6.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `gold_types`
-- --------------------------------------------------------
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

-- Dumping seed data for `gold_types`
INSERT INTO `gold_types` (`id`, `name`, `purity`, `image`, `is_active`, `created_at`, `updated_at`) VALUES 
(1, '22K', 91.60, '1779738015295-18k_menu.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '19K', 79.17, '1779738075320-18k_menu.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `collection_types`
-- --------------------------------------------------------
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

-- Dumping seed data for `collection_types`
INSERT INTO `collection_types` (`id`, `name`, `image`, `is_active`, `created_at`, `updated_at`) VALUES 
(1, 'Handmade', '1779738311122-menu-3.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Plain', '1779738327102-22kt_menu.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Machine made', '1779738346919-menu-8.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `products`
-- --------------------------------------------------------
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

-- Dumping seed data for `products`
INSERT INTO `products` (`id`, `category_id`, `gold_type_id`, `subcategory_id`, `collection_type_id`, `sku`, `title`, `short_description`, `number_of_pcs`, `display_finish`, `weight_specifications`, `technical_specifications`, `manufacturing_support`, `product_url`, `product_images`, `created_at`, `updated_at`) VALUES 
(1, 1, 1, NULL, 1, 'BAPL22K01', 'Design No. BAPL22K01', 'Defined by its geometric form and balanced composition, this earring design is developed for contemporary gold jewellery collections. The fan-shaped silhouette features a deep green inlay at the center, framed with precision-set stones along the outer edge to create controlled contrast and visual clarity. Fine gold borders enhance the structure while maintaining a clean, lightweight profile. Engineered for consistency in finish and wearability, the design offers a refined addition suited for modern retail assortments.', 2, 'Rose+White+Gold', '[{"label":"Gross Weight:","value":"5.00 grams"},{"label":"Net Weight:","value":"5.00 grams"}]', '[{"feature":"Metal Purity","details":"Standard 22KT Yellow Gold (Customizable to 18KT, 9KT, 14KT)"},{"feature":"Dimensions","details":"12mm x 8mm"},{"feature":"Enamel","details":"Yes (Blue)"}]', '<h2>Manufacturing &amp; Customization Support</h2><p>Zar offers the following B2B support for this design:</p><ul><li><strong>Enamel Customization:</strong> Can choose from a variety of available colors</li><li><strong>Size and Weight Scalability:</strong> Customizable to your required weight and size, with possibility of a slight modification to the design</li><li><strong>Branding:</strong> In-store customization support for retailers, hall-marking, private labelling for bulk buying</li></ul>', 'BAPL22K01', '["prod-3.webp","prod-2.webp"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 2, NULL, 3, 'BNG-19K-MM-002', 'New Bangles', 'Elegant lightweight modern bangles designed for daily wear.', 1, 'Rose+White+Gold', '[{"label":"Gross Weight","value":"42.50 grams"},{"label":"Net Gold Weight","value":"38.20 grams"}]', '[{"feature":"Metal Purity","details":"19KT Yellow Gold"},{"feature":"Finish","details":"High Polish"}]', 'Custom size and weights are available on request.', 'new-bangles', '["1779738631998-18k_menu.png","1779738631999-22kt_menu.png"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `events`
-- --------------------------------------------------------
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

-- Dumping seed data for `events`
INSERT INTO `events` (`id`, `title`, `location`, `start_date`, `end_date`, `description`, `event_image`, `event_url`, `status`, `created_at`, `updated_at`) VALUES 
(1, 'Watch and Jewellery Show Sharjah', 'Sharjah, UAE.', '2026-05-01', '2026-05-04', 'Sharjah Watch and Jewellery Show 2026 is a biannual event presenting the latest jewelry designs, trends in watch collections, and jewelry made of precious stones and diamonds.', '["icon-1.png","zar-logo.svg","client-logo.png"]', '/event/watch-and-jewellery-show-sharjah', 'past', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Seminar and Exhibition', 'Mumbai, India', '2026-06-15', '2026-06-18', 'Upcoming jewellery designs showcase and networking event.', '["1779733071515-BuildYourWayCard1.png"]', '/event/seminar-mumbai', 'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `clientele`
-- --------------------------------------------------------
CREATE TABLE `clientele` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `clientele_title` VARCHAR(255) NOT NULL,
  `clientele_image` VARCHAR(500) DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping seed data for `clientele`
INSERT INTO `clientele` (`id`, `clientele_title`, `clientele_image`, `created_at`, `updated_at`) VALUES 
(1, 'Anjali Jewels', 'anjali.webp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'B.C. Sen Jewellers', 'b-c-sen.webp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Manthan Group', '1779731557290-NetSuite-Symbol.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `testimonials`
-- --------------------------------------------------------
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

-- Dumping seed data for `testimonials`
INSERT INTO `testimonials` (`id`, `name`, `comment`, `position`, `companyName`, `created_at`, `updated_at`) VALUES 
(1, 'Rajesh Mehta', 'Zar Jewels offers outstanding craftsmanship and premium quality designs. Their support is excellent.', 'Owner', 'Mehta & Sons Jewellers', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Amit Sharma', 'The lightweight collection has been a great hit among our retail customers. Very consistent finish.', 'Purchase Director', 'Sharma Retail Group', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `careers`
-- --------------------------------------------------------
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

-- Dumping seed data for `careers`
INSERT INTO `careers` (`id`, `position`, `experience`, `location`, `jobDescription`, `created_at`, `updated_at`) VALUES 
(1, 'Senior Jewellery Designer', '5-8 Years', 'Mumbai, India', 'We are looking for a Senior Jewellery Designer experienced in CAD, manual sketching, and 3D modeling. Must understand gold weight specifications and manufacturing constraints.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Production Supervisor', '3-5 Years', 'Rajkot, India', 'Responsible for supervising the handmade and machine-made gold jewellery manufacturing processes, quality control, and schedule adherence.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `career_applications`
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table structure for `build_connections`
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table structure for `contact_inquiries`
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table structure for `zar_journey`
-- --------------------------------------------------------
CREATE TABLE `zar_journey` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `year` INT NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping seed data for `zar_journey`
INSERT INTO `zar_journey` (`id`, `year`, `description`, `image`, `created_at`, `updated_at`) VALUES 
(1, 2018, 'Zar Jewels founded with a vision to redefine traditional B2B gold jewellery craftsmanship.', 'journey-2018.webp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2022, 'Expanded facilities to incorporate advanced German machinery for machine-made collections.', 'journey-2022.webp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 2025, 'Established global export desk catering to retailers and wholesalers in UAE and Singapore.', 'journey-2025.webp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for `contacts` (Legacy Contact Table)
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table structure for `manufacturing` (Legacy/Inactive)
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table structure for `jewels` (Legacy/Inactive - replaced by Categories)
-- --------------------------------------------------------
CREATE TABLE `jewels` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `collection_type` ENUM('18k', '22k') NOT NULL DEFAULT '22k',
  `category` VARCHAR(255) NOT NULL,
  `collection_url` VARCHAR(500) DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for `jewel_subcategories` (Legacy/Inactive)
-- --------------------------------------------------------
CREATE TABLE `jewel_subcategories` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT(20) UNSIGNED NOT NULL,
  `collection_type` ENUM('18k', '22k') NOT NULL DEFAULT '22k',
  `category` VARCHAR(255) NOT NULL,
  `subcategory_url` VARCHAR(500) DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
