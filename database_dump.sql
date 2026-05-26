-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: localhost    Database: zar_backend
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '51867b10-584c-11f1-8a79-1e9ebbd0e1f7:1-1278';

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Bangles & Bracelet','bangles-bracelet','1779738197168-menu-1.png',1,'2026-05-25 19:43:17','2026-05-25 19:43:17',NULL),(2,'Mangalsutra & Necklace','mangalsutra-necklace','1779738221918-menu-2.png',1,'2026-05-25 19:43:41','2026-05-25 19:43:41',NULL),(3,'Lightweight Jewellery','lightweight-jewellery','1779738267891-menu-6.png',1,'2026-05-25 19:44:27','2026-05-25 19:44:27',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientele`
--

DROP TABLE IF EXISTS `clientele`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientele` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `clientele_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clientele_image` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientele`
--

LOCK TABLES `clientele` WRITE;
/*!40000 ALTER TABLE `clientele` DISABLE KEYS */;
INSERT INTO `clientele` VALUES (1,'Anjali','UAE','anjali.webp','2026-05-06 12:55:59','2026-05-15 10:49:48',NULL),(2,'b.c.sen','India','b-c-sen.webp','2026-05-15 10:49:31','2026-05-15 10:49:37',NULL),(3,'Manthan','India','1779731557290-NetSuite-Symbol.png','2026-05-25 17:52:37','2026-05-25 17:52:37',NULL);
/*!40000 ALTER TABLE `clientele` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `company` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `subject` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `location` text COLLATE utf8mb4_general_ci,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `event_image` text COLLATE utf8mb4_general_ci,
  `event_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('upcoming','past') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Watch and Jewellery Show Sharjah','Sharjah, UAE.','2026-05-01','2026-05-04','Sharjah Watch and Jewellery Show 2026 is a biannual event that will present the latest jewelry designs, trends in watch collections, and jewelry made up of precious stones and diamonds.','[\"icon-1.png\",\"zar-logo.svg\",\"client-logo.png\",\"1779730552512-Screenshot-2026-05-20-at-12-18-53.png\"]','/event/watch-and-jewellery-show-sharjah','past','2026-05-06 11:58:40','2026-05-25 17:35:52',NULL),(2,'seminar','Sharjah, UAE.','2026-05-23','2026-04-09','ddascxsxcsdxd','[\"1779733071515-BuildYourWayCard1.png\"]','/event/sdsdsdsd','upcoming','2026-05-25 18:17:51','2026-05-25 18:17:51',NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gold_types`
--

DROP TABLE IF EXISTS `gold_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gold_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `purity` decimal(5,2) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gold_types`
--

LOCK TABLES `gold_types` WRITE;
/*!40000 ALTER TABLE `gold_types` DISABLE KEYS */;
INSERT INTO `gold_types` VALUES (1,'22K',91.60,'1779738015295-18k_menu.png',1,'2026-05-25 19:40:15','2026-05-25 19:40:15',NULL),(2,'19K',79.17,'1779738075320-18k_menu.png',1,'2026-05-25 19:41:15','2026-05-25 19:41:15',NULL);
/*!40000 ALTER TABLE `gold_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jewel_subcategories`
--

DROP TABLE IF EXISTS `jewel_subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jewel_subcategories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `collection_type` enum('18k','22k') COLLATE utf8mb4_general_ci NOT NULL DEFAULT '22k',
  `category` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `subcategory_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jewel_subcategories_category_id` (`category_id`),
  CONSTRAINT `fk_jewel_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `jewels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jewel_subcategories`
--

LOCK TABLES `jewel_subcategories` WRITE;
/*!40000 ALTER TABLE `jewel_subcategories` DISABLE KEYS */;
INSERT INTO `jewel_subcategories` VALUES (1,1,'18k','Plain','plain','1779731386220-Screenshot-2026-05-20-at-12-18-53.png',NULL,'2026-05-18 09:55:23','2026-05-25 17:49:46');
/*!40000 ALTER TABLE `jewel_subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jewels`
--

DROP TABLE IF EXISTS `jewels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jewels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `collection_type` enum('18k','22k') COLLATE utf8mb4_general_ci NOT NULL DEFAULT '22k',
  `category` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `collection_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jewels`
--

LOCK TABLES `jewels` WRITE;
/*!40000 ALTER TABLE `jewels` DISABLE KEYS */;
INSERT INTO `jewels` VALUES (1,'18k','Bangles & Bracelets','bangles-bracelet','1778242874870-menu-1.webp',NULL,'2026-05-08 12:21:14','2026-05-15 09:20:50'),(2,'22k','kjbkjbmbmn','nvnvnb','1779726496954-Screenshot-2026-05-19-at-23-13-22.png',NULL,'2026-05-25 16:28:16','2026-05-25 16:28:16');
/*!40000 ALTER TABLE `jewels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `making_types`
--

DROP TABLE IF EXISTS `making_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `making_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `making_types`
--

LOCK TABLES `making_types` WRITE;
/*!40000 ALTER TABLE `making_types` DISABLE KEYS */;
INSERT INTO `making_types` VALUES (1,'Handmaid','1779738311122-menu-3.png',1,'2026-05-25 19:45:11','2026-05-25 19:45:11',NULL),(2,'Plain','1779738327102-22kt_menu.png',1,'2026-05-25 19:45:27','2026-05-25 19:45:27',NULL),(3,'Machine made','1779738346919-menu-8.png',1,'2026-05-25 19:45:46','2026-05-25 19:45:46',NULL);
/*!40000 ALTER TABLE `making_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned DEFAULT NULL,
  `gold_type_id` bigint unsigned DEFAULT NULL,
  `subcategory_id` bigint unsigned DEFAULT NULL,
  `making_type_id` bigint unsigned DEFAULT NULL,
  `sku` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `collection_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `short_description` text COLLATE utf8mb4_general_ci,
  `number_of_pcs` int DEFAULT NULL,
  `approx_weight_gm` decimal(10,3) DEFAULT NULL,
  `display_finish` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `weight_specifications` longtext COLLATE utf8mb4_general_ci,
  `technical_specifications` longtext COLLATE utf8mb4_general_ci,
  `manufacturing_support` text COLLATE utf8mb4_general_ci,
  `product_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_images` longtext COLLATE utf8mb4_general_ci,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `fk_products_gold_type` (`gold_type_id`),
  KEY `fk_products_category` (`category_id`),
  KEY `fk_products_making_type` (`making_type_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_gold_type` FOREIGN KEY (`gold_type_id`) REFERENCES `gold_types` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_products_making_type` FOREIGN KEY (`making_type_id`) REFERENCES `making_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,NULL,NULL,1,NULL,NULL,'Design No. BAPL22K01','BAPL-22K-001','Defined by its geometric form and balanced composition, this earring design is developed for contemporary gold jewellery collections. The fan-shaped silhouette features a deep green inlay at the center, framed with precision-set stones along the outer edge to create controlled contrast and visual clarity. Fine gold borders enhance the structure while maintaining a clean, lightweight profile. Engineered for consistency in finish and wearability, the design offers a refined addition suited for modern retail assortments.',2,NULL,'Rose+White+Gold','[{\"label\":\"Gross Weight:\",\"value\":\"5.00 grams\"},{\"label\":\"Net Weight:\",\"value\":\"5.00 grams\"}]','[{\"feature\":\"Metal Purity\",\"details\":\"Standard 22KT Yellow Gold (Customizable to 18KT, 9KT, 14KT)\"},{\"feature\":\"Dimensions\",\"details\":\"12mm x 8mm\"},{\"feature\":\"Enamel\",\"details\":\"12mm x 8mm Enamel\\tYes (Blue)\"}]','<h2>Manufacturing &amp; Customization Support</h2><p>Zar offers the following B2B support for this design:</p><ul><li><strong>Enamel Customization:</strong> Can choose from a variety of available colors</li><li><strong>Size and Weight Scalability:</strong> Customizable to your required weight and size, with possibility of a slight modification to the design</li><li><strong>Branding:</strong> In-store customization support for retailers, hall-marking, private labelling for bulk buying</li></ul>','BAPL22K01','[\"prod-3.webp\",\"prod-2.webp\"]',NULL,'2026-05-15 09:17:03','2026-05-25 19:22:01'),(2,1,2,NULL,3,'BNG-19K-MM-002','new bangles','BNG-19K-MM-002','zcsds sdcsd',1,NULL,'Rose+White+Gold','[{\"label\":\"Gross Weight\",\"value\":\"42.500\"},{\"label\":\"Net Gold Weight\",\"value\":\"38.200\"}]','[{\"feature\":\"dede\",\"details\":\"22kt\"}]','sdsdc csdcsdcsd sdcasa','asdasdasdasd','[\"1779738631998-18k_menu.png\",\"1779738631999-22kt_menu.png\",\"1779738632000-menu-1.png\"]',NULL,'2026-05-25 19:50:32','2026-05-25 19:50:32');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','staff') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'staff',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Zar Jewels','admin@gmail.com','$2b$10$zv3ULVaxvX.i6mzCkzcvH.aukh2Ew7BqW4g7lzGRlHe.8jN14u2/2','admin',NULL,NULL,'2026-05-05 05:52:26','2026-05-18 10:17:51'),(2,'Staff1','staff@gmail.com','$2y$10$G4NXy6suU4CL75nHYQEqd.rqYAOTP5uAEDjSvanpAzb390.MYF2vS','staff',NULL,NULL,'2026-05-05 05:52:26','2026-05-06 09:38:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26 10:02:21
