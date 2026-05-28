-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 04:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zar_jeweller`
--

-- --------------------------------------------------------

--
-- Table structure for table `clientele`
--

CREATE TABLE `clientele` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `clientele_title` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `clientele_image` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientele`
--

INSERT INTO `clientele` (`id`, `clientele_title`, `country`, `clientele_image`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Anjali', 'UAE', 'anjali.webp', '2026-05-06 12:55:59', '2026-05-15 10:49:48', NULL),
(2, 'b.c.sen', 'India', 'b-c-sen.webp', '2026-05-15 10:49:31', '2026-05-15 10:49:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `event_image` text DEFAULT NULL,
  `event_url` varchar(500) DEFAULT NULL,
  `status` enum('upcoming','past') NOT NULL DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `location`, `start_date`, `end_date`, `description`, `event_image`, `event_url`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Watch and Jewellery Show Sharjah', 'Sharjah, UAE.', '2026-05-02', '2026-05-05', 'Sharjah Watch and Jewellery Show 2026 is a biannual event that will present the latest jewelry designs, trends in watch collections, and jewelry made up of precious stones and diamonds.', '[\"icon-1.png\",\"zar-logo.svg\",\"client-logo.png\"]', '/event/watch-and-jewellery-show-sharjah', 'past', '2026-05-06 11:58:40', '2026-05-06 12:56:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jewels`
--

CREATE TABLE `jewels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `collection_type` enum('18k','22k') NOT NULL DEFAULT '22k',
  `category` varchar(255) NOT NULL,
  `collection_url` varchar(500) DEFAULT NULL,
  `image` varchar(500) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jewels`
--

INSERT INTO `jewels` (`id`, `collection_type`, `category`, `collection_url`, `image`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '18k', 'Bangles & Bracelets', 'bangles-bracelet', '1778242874870-menu-1.webp', NULL, '2026-05-08 12:21:14', '2026-05-15 09:20:50');

-- --------------------------------------------------------

--
-- Table structure for table `jewel_subcategories`
--

CREATE TABLE `jewel_subcategories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `collection_type` enum('18k','22k') NOT NULL DEFAULT '22k',
  `category` varchar(255) NOT NULL,
  `subcategory_url` varchar(500) DEFAULT NULL,
  `image` varchar(500) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jewel_subcategories`
--

INSERT INTO `jewel_subcategories` (`id`, `category_id`, `collection_type`, `category`, `subcategory_url`, `image`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, '18k', 'Plain', 'plain', 'Broad.webp', NULL, '2026-05-18 09:55:23', '2026-05-18 09:55:23');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subcategory_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `collection_name` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `number_of_pcs` int(11) DEFAULT NULL,
  `approx_weight_gm` decimal(10,3) DEFAULT NULL,
  `display_finish` varchar(255) DEFAULT NULL,
  `weight_specifications` longtext DEFAULT NULL,
  `technical_specifications` longtext DEFAULT NULL,
  `manufacturing_support` text DEFAULT NULL,
  `product_url` varchar(255) DEFAULT NULL,
  `product_images` longtext DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `subcategory_id`, `title`, `collection_name`, `short_description`, `number_of_pcs`, `approx_weight_gm`, `display_finish`, `weight_specifications`, `technical_specifications`, `manufacturing_support`, `product_url`, `product_images`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Design No. BAPL22K01', 'BAPL-22K-001', 'Defined by its geometric form and balanced composition, this earring design is developed for contemporary gold jewellery collections. The fan-shaped silhouette features a deep green inlay at the center, framed with precision-set stones along the outer edge to create controlled contrast and visual clarity. Fine gold borders enhance the structure while maintaining a clean, lightweight profile. Engineered for consistency in finish and wearability, the design offers a refined addition suited for modern retail assortments.', 2, NULL, 'Rose+White+Gold', '[{\"label\":\"Gross Weight:\",\"value\":\"5.00 grams\"},{\"label\":\"Net Weight:\",\"value\":\"5.00 grams\"}]', '[{\"feature\":\"Metal Purity\",\"details\":\"Standard 22KT Yellow Gold (Customizable to 18KT, 9KT, 14KT)\"},{\"feature\":\"Dimensions\",\"details\":\"12mm x 8mm\"},{\"feature\":\"Enamel\",\"details\":\"12mm x 8mm Enamel\\tYes (Blue)\"}]', '<h2>Manufacturing &amp; Customization Support</h2><p>Zar offers the following B2B support for this design:</p><ul><li><strong>Enamel Customization:</strong> Can choose from a variety of available colors</li><li><strong>Size and Weight Scalability:</strong> Customizable to your required weight and size, with possibility of a slight modification to the design</li><li><strong>Branding:</strong> In-store customization support for retailers, hall-marking, private labelling for bulk buying</li></ul>', 'BAPL22K01', '[\"prod-3.webp\",\"prod-2.webp\"]', NULL, '2026-05-15 09:17:03', '2026-05-18 09:29:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Zar Jewels', 'admin@gmail.com', '$2b$10$zv3ULVaxvX.i6mzCkzcvH.aukh2Ew7BqW4g7lzGRlHe.8jN14u2/2', 'admin', NULL, NULL, '2026-05-05 05:52:26', '2026-05-18 10:17:51'),
(2, 'Staff1', 'staff@gmail.com', '$2y$10$G4NXy6suU4CL75nHYQEqd.rqYAOTP5uAEDjSvanpAzb390.MYF2vS', 'staff', NULL, NULL, '2026-05-05 05:52:26', '2026-05-06 09:38:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientele`
--
ALTER TABLE `clientele`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jewels`
--
ALTER TABLE `jewels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jewel_subcategories`
--
ALTER TABLE `jewel_subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_jewel_subcategories_category_id` (`category_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientele`
--
ALTER TABLE `clientele`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jewels`
--
ALTER TABLE `jewels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jewel_subcategories`
--
ALTER TABLE `jewel_subcategories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jewel_subcategories`
--
ALTER TABLE `jewel_subcategories`
  ADD CONSTRAINT `fk_jewel_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `jewels` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
