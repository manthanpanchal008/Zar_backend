const pool = require('../config/db');

function parseEnumValues(columnType) {
  const matches = columnType.match(/'([^']+)'/g) || [];
  return matches.map((value) => value.slice(1, -1));
}

async function listUserRoles() {
  const [rows] = await pool.query(`
    SELECT COLUMN_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'role'
    LIMIT 1
  `);

  if (!rows[0] || !rows[0].COLUMN_TYPE) {
    return [];
  }

  return parseEnumValues(rows[0].COLUMN_TYPE);
}

async function getDashboardSummary() {
  const [summaryRows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM jewels WHERE deleted_at IS NULL) AS totalJewels,
      (SELECT COUNT(*) FROM contacts) AS totalContacts,
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM users WHERE role = 'admin') AS totalAdmins,
      (SELECT COUNT(*) FROM users WHERE role = 'staff') AS totalStaff
  `);

  const [recentRows] = await pool.query(`
    SELECT id, collection_type, category, created_at
    FROM jewels
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);

  return {
    totalJewels: Number(summaryRows[0]?.totalJewels || 0),
    totalContacts: Number(summaryRows[0]?.totalContacts || 0),
    totalUsers: Number(summaryRows[0]?.totalUsers || 0),
    totalAdmins: Number(summaryRows[0]?.totalAdmins || 0),
    totalStaff: Number(summaryRows[0]?.totalStaff || 0),
    latestJewel: recentRows[0] || null,
  };
}

module.exports = {
  getDashboardSummary,
  listUserRoles,
};
