const pool = require('../config/db');

const getServices = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const [services] = await pool.query(
      `SELECT * FROM services
       WHERE is_active = 1
       AND (name LIKE ? OR category LIKE ? OR description LIKE ?)
       ORDER BY id DESC`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json(services);
  } catch (error) {
    next(error);
  }
};

module.exports = { getServices };
