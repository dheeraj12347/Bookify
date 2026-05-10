const pool = require('../config/db');

const getStats = async (req, res, next) => {
  try {
    const [[customerCount]] = await pool.query('SELECT COUNT(*) AS total FROM customers');
    const [[vendorCount]] = await pool.query('SELECT COUNT(*) AS total FROM vendors');
    const [[bookingCount]] = await pool.query('SELECT COUNT(*) AS total FROM bookings');
    const [[revenue]] = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS total
       FROM bookings WHERE status IN ('Accepted', 'Completed')`
    );
    const [recentBookings] = await pool.query(
      `SELECT b.*, c.name AS customer_name, s.name AS service_name
       FROM bookings b
       JOIN customers c ON b.customer_id = c.id
       JOIN services s ON b.service_id = s.id
       ORDER BY b.created_at DESC
       LIMIT 8`
    );

    res.json({
      customers: customerCount.total,
      vendors: vendorCount.total,
      bookings: bookingCount.total,
      revenue: revenue.total,
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
