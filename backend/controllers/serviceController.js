const pool = require('../config/db');

const getServices = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const services = await pool.query(
      `SELECT * FROM services
       WHERE is_active = TRUE
       AND (name ILIKE $1 OR category ILIKE $2 OR description ILIKE $3)
       ORDER BY id DESC`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json(services.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { getServices };
