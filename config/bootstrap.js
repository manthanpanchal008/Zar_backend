const mysql = require('mysql2/promise');
const path = require('path');
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require('./env');

async function ensureSchema() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });
  } catch (error) {
    if (error && (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND')) {
      throw new Error(
        `Cannot connect to MySQL at ${DB_HOST}:${DB_PORT}. ` +
        'Ensure MySQL is running and verify DB_HOST, DB_PORT, DB_USER, and DB_PASSWORD in .env.'
      );
    }

    if (error && error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error(
        `MySQL access denied for user "${DB_USER}" on ${DB_HOST}:${DB_PORT}. ` +
        'Verify DB_USER and DB_PASSWORD in .env.'
      );
    }

    throw error;
  }

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.query(`USE \`${DB_NAME}\`;`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
      email_verified_at TIMESTAMP NULL DEFAULT NULL,
      remember_token VARCHAR(100) NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff' AFTER password;
  `);

  await connection.query(`
    UPDATE users
    SET role = 'staff'
    WHERE role IS NULL OR role = '';
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      company VARCHAR(255) DEFAULT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS jewels (
      id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      collection_type ENUM('18k', '22k') NOT NULL DEFAULT '22k',
      category VARCHAR(255) NOT NULL,
      collection_url VARCHAR(500) DEFAULT NULL,
      image VARCHAR(500) NOT NULL,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS events (
      id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      location VARCHAR(255) DEFAULT NULL,
      start_date DATE DEFAULT NULL,
      end_date DATE DEFAULT NULL,
      description TEXT DEFAULT NULL,
      event_image LONGTEXT DEFAULT NULL,
      event_url VARCHAR(500) DEFAULT NULL,
      status ENUM('upcoming', 'past') NOT NULL DEFAULT 'upcoming',
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      category_id BIGINT(20) UNSIGNED DEFAULT NULL,
      subcategory_id BIGINT(20) UNSIGNED DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      collection_name VARCHAR(255) NOT NULL,
      short_description TEXT DEFAULT NULL,
      number_of_pcs INT(11) DEFAULT NULL,
      display_finish VARCHAR(255) DEFAULT NULL,
      weight_specifications LONGTEXT DEFAULT NULL,
      technical_specifications LONGTEXT DEFAULT NULL,
      manufacturing_support TEXT DEFAULT NULL,
      product_url VARCHAR(500) DEFAULT NULL,
      product_images LONGTEXT DEFAULT NULL,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS jewel_subcategories (
      id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      category_id BIGINT(20) UNSIGNED NOT NULL,
      collection_type ENUM('18k', '22k') NOT NULL DEFAULT '22k',
      category VARCHAR(255) NOT NULL,
      subcategory_url VARCHAR(500) DEFAULT NULL,
      image VARCHAR(500) NOT NULL,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER status;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS clientele (
      id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      clientele_title VARCHAR(255) NOT NULL,
      clientele_image VARCHAR(500) DEFAULT NULL,
      deleted_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    ALTER TABLE clientele
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER clientele_image;
  `);

  await connection.query(`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS event_image LONGTEXT DEFAULT NULL AFTER description;
  `);

  // Migrate data only if the old columns still exist
  const [evCols] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events'
      AND COLUMN_NAME IN ('image_paths', 'image_url');
  `);
  const legacyCols = evCols.map((r) => r.COLUMN_NAME);

  if (legacyCols.includes('image_paths')) {
    await connection.query(`
      UPDATE events
      SET event_image = NULLIF(image_paths, '')
      WHERE (event_image IS NULL OR event_image = '') AND NULLIF(image_paths, '') IS NOT NULL;
    `);
  }
  if (legacyCols.includes('image_url')) {
    await connection.query(`
      UPDATE events
      SET event_image = JSON_ARRAY(SUBSTRING_INDEX(REPLACE(image_url, '\\\\', '/'), '/', -1))
      WHERE (event_image IS NULL OR event_image = '') AND NULLIF(image_url, '') IS NOT NULL;
    `);
  }
  if (legacyCols.includes('image_paths')) {
    await connection.query(`ALTER TABLE events DROP COLUMN image_paths;`);
  }
  if (legacyCols.includes('image_url')) {
    await connection.query(`ALTER TABLE events DROP COLUMN image_url;`);
  }

  // Rename link_url → event_url if the old column still exists
  const [urlCols] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events'
      AND COLUMN_NAME = 'link_url';
  `);
  if (urlCols.length > 0) {
    await connection.query(`
      ALTER TABLE events CHANGE COLUMN link_url event_url VARCHAR(500) DEFAULT NULL;
    `);
  } else {
    await connection.query(`
      ALTER TABLE events ADD COLUMN IF NOT EXISTS event_url VARCHAR(500) DEFAULT NULL;
    `);
  }

  // Jewels — migrate to minimal collection schema
  await connection.query(`
    ALTER TABLE jewels
    ADD COLUMN IF NOT EXISTS collection_type ENUM('18k', '22k') NOT NULL DEFAULT '22k' AFTER id;
  `);

  await connection.query(`
    ALTER TABLE jewels
    ADD COLUMN IF NOT EXISTS category VARCHAR(255) NULL AFTER collection_type;
  `);

  await connection.query(`
    ALTER TABLE jewels
    ADD COLUMN IF NOT EXISTS collection_url VARCHAR(500) DEFAULT NULL AFTER category;
  `);

  await connection.query(`
    ALTER TABLE jewels
    ADD COLUMN IF NOT EXISTS image VARCHAR(500) NULL AFTER category;
  `);

  await connection.query(`
    ALTER TABLE jewels
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER image;
  `);

  const [jewelCols] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jewels';
  `);
  const jewelColumnSet = new Set(jewelCols.map((row) => row.COLUMN_NAME));

  if (jewelColumnSet.has('karat')) {
    await connection.query(`
      UPDATE jewels
      SET collection_type = karat
      WHERE (collection_type IS NULL OR collection_type = '') AND karat IN ('18k', '22k');
    `);
  }

  if (jewelColumnSet.has('name')) {
    await connection.query(`
      UPDATE jewels
      SET category = name
      WHERE (category IS NULL OR category = '') AND name IS NOT NULL AND name <> '';
    `);
  }

  await connection.query(`
    UPDATE jewels
    SET category = 'General'
    WHERE category IS NULL OR category = '';
  `);

  await connection.query(`
    UPDATE jewels
    SET image = 'placeholder.jpg'
    WHERE image IS NULL OR image = '';
  `);

  await connection.query(`
    ALTER TABLE jewels
    MODIFY COLUMN category VARCHAR(255) NOT NULL;
  `);

  await connection.query(`
    ALTER TABLE jewels
    MODIFY COLUMN image VARCHAR(500) NOT NULL;
  `);

  if (jewelColumnSet.has('name')) {
    await connection.query(`ALTER TABLE jewels DROP COLUMN name;`);
  }
  if (jewelColumnSet.has('description')) {
    await connection.query(`ALTER TABLE jewels DROP COLUMN description;`);
  }
  if (jewelColumnSet.has('price')) {
    await connection.query(`ALTER TABLE jewels DROP COLUMN price;`);
  }
  if (jewelColumnSet.has('karat')) {
    await connection.query(`ALTER TABLE jewels DROP COLUMN karat;`);
  }

  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS category_id BIGINT(20) UNSIGNED DEFAULT NULL AFTER id;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS subcategory_id BIGINT(20) UNSIGNED DEFAULT NULL AFTER category_id;
  `);
  const [productCols] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products';
  `);
  const productColumnSet = new Set(productCols.map((row) => row.COLUMN_NAME));

  if (productColumnSet.has('image_paths') && !productColumnSet.has('product_images')) {
    await connection.query(`
      ALTER TABLE products
      CHANGE COLUMN image_paths product_images LONGTEXT DEFAULT NULL;
    `);
  }

  if (productColumnSet.has('enquiry_link') && !productColumnSet.has('product_url')) {
    await connection.query(`
      ALTER TABLE products
      CHANGE COLUMN enquiry_link product_url VARCHAR(500) DEFAULT NULL;
    `);
  }

  if (productColumnSet.has('category_name')) {
    await connection.query(`
      UPDATE products p
      LEFT JOIN jewels j ON j.category = p.category_name AND j.deleted_at IS NULL
      SET p.category_id = j.id
      WHERE p.category_id IS NULL AND p.category_name IS NOT NULL AND p.category_name <> '';
    `);

    await connection.query(`
      ALTER TABLE products DROP COLUMN category_name;
    `);
  }

  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT '' AFTER category_id;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS collection_name VARCHAR(255) NOT NULL DEFAULT '' AFTER title;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT NULL AFTER collection_name;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS number_of_pcs INT(11) DEFAULT NULL AFTER short_description;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS display_finish VARCHAR(255) DEFAULT NULL AFTER number_of_pcs;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS weight_specifications LONGTEXT DEFAULT NULL AFTER display_finish;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS technical_specifications LONGTEXT DEFAULT NULL AFTER weight_specifications;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS manufacturing_support TEXT DEFAULT NULL AFTER technical_specifications;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS product_url VARCHAR(500) DEFAULT NULL AFTER manufacturing_support;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS product_images LONGTEXT DEFAULT NULL AFTER product_url;
  `);
  await connection.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER product_images;
  `);

  await connection.query(`
    ALTER TABLE jewel_subcategories
    ADD COLUMN IF NOT EXISTS subcategory_url VARCHAR(500) DEFAULT NULL AFTER category;
  `);

  if (productColumnSet.has('gross_weight_grams') || productColumnSet.has('net_gold_weight_grams') || productColumnSet.has('stone_weight_grams') || productColumnSet.has('stone_weight_carats')) {
    await connection.query(`
      UPDATE products
      SET weight_specifications = JSON_ARRAY(
        JSON_OBJECT('label', 'Gross Weight', 'value', CONCAT(COALESCE(CAST(gross_weight_grams AS CHAR), '-'), ' grams')),
        JSON_OBJECT('label', 'Net Gold Weight', 'value', CONCAT(COALESCE(CAST(net_gold_weight_grams AS CHAR), '-'), ' grams')),
        JSON_OBJECT('label', 'Stone Weight', 'value', CONCAT(COALESCE(CAST(stone_weight_grams AS CHAR), '-'), ' grams', IF(stone_weight_carats IS NULL, '', CONCAT(' (', CAST(stone_weight_carats AS CHAR), ' Carats)'))))
      )
      WHERE (weight_specifications IS NULL OR weight_specifications = '')
        AND (gross_weight_grams IS NOT NULL OR net_gold_weight_grams IS NOT NULL OR stone_weight_grams IS NOT NULL OR stone_weight_carats IS NOT NULL);
    `);
  }

  if (productColumnSet.has('metal_purity') || productColumnSet.has('technical_finish') || productColumnSet.has('stone_composition') || productColumnSet.has('construction')) {
    await connection.query(`
      UPDATE products
      SET technical_specifications = JSON_ARRAY(
        JSON_OBJECT('feature', 'Metal Purity', 'details', COALESCE(metal_purity, '')),
        JSON_OBJECT('feature', 'Finish', 'details', COALESCE(technical_finish, '')),
        JSON_OBJECT('feature', 'Stone Composition', 'details', COALESCE(stone_composition, '')),
        JSON_OBJECT('feature', 'Construction', 'details', COALESCE(construction, ''))
      )
      WHERE (technical_specifications IS NULL OR technical_specifications = '')
        AND (metal_purity IS NOT NULL OR technical_finish IS NOT NULL OR stone_composition IS NOT NULL OR construction IS NOT NULL);
    `);
  }

  if (productColumnSet.has('design_no')) {
    await connection.query(`ALTER TABLE products DROP COLUMN design_no;`);
  }
  if (productColumnSet.has('sku_code')) {
    await connection.query(`ALTER TABLE products DROP COLUMN sku_code;`);
  }
  if (productColumnSet.has('karat_label')) {
    await connection.query(`ALTER TABLE products DROP COLUMN karat_label;`);
  }
  if (productColumnSet.has('gross_weight_grams')) {
    await connection.query(`ALTER TABLE products DROP COLUMN gross_weight_grams;`);
  }
  if (productColumnSet.has('net_gold_weight_grams')) {
    await connection.query(`ALTER TABLE products DROP COLUMN net_gold_weight_grams;`);
  }
  if (productColumnSet.has('stone_weight_grams')) {
    await connection.query(`ALTER TABLE products DROP COLUMN stone_weight_grams;`);
  }
  if (productColumnSet.has('stone_weight_carats')) {
    await connection.query(`ALTER TABLE products DROP COLUMN stone_weight_carats;`);
  }
  if (productColumnSet.has('metal_purity')) {
    await connection.query(`ALTER TABLE products DROP COLUMN metal_purity;`);
  }
  if (productColumnSet.has('technical_finish')) {
    await connection.query(`ALTER TABLE products DROP COLUMN technical_finish;`);
  }
  if (productColumnSet.has('stone_composition')) {
    await connection.query(`ALTER TABLE products DROP COLUMN stone_composition;`);
  }
  if (productColumnSet.has('construction')) {
    await connection.query(`ALTER TABLE products DROP COLUMN construction;`);
  }

  const [productImageRows] = await connection.query(
    `SELECT id, product_images FROM products WHERE product_images IS NOT NULL AND product_images <> ''`
  );

  for (const row of productImageRows) {
    let rawImages = [];

    try {
      const parsed = JSON.parse(row.product_images);
      rawImages = Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      rawImages = [row.product_images];
    }

    const normalized = rawImages
      .map((item) => {
        const input = String(item || '').trim();
        if (!input) return null;

        const withoutQuery = input.split('?')[0].split('#')[0];
        return path.posix.basename(withoutQuery.replace(/\\/g, '/')) || null;
      })
      .filter(Boolean);

    await connection.query(`UPDATE products SET product_images = ? WHERE id = ?`, [
      JSON.stringify(normalized),
      row.id,
    ]);
  }

  await connection.end();
}

module.exports = {
  ensureSchema,
};
