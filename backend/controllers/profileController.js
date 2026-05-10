const pool = require('../config/db');

const getProfile = async (req, res, next) => {
  try {
    if (req.user.role === 'customer') {
      const rows = await pool.query(
        'SELECT id, name, email, phone, created_at FROM customers WHERE id = $1',
        [req.user.id]
      );
      return res.json({ ...rows.rows[0], role: 'customer' });
    }

    if (req.user.role === 'vendor') {
      const rows = await pool.query(
        `SELECT id, business_name, owner_name, email, phone, service_category, city, created_at
         FROM vendors WHERE id = $1`,
        [req.user.id]
      );
      return res.json({ ...rows.rows[0], role: 'vendor' });
    }

    res.json({ id: 1, name: 'Admin', role: 'admin' });
  } catch (error) {
    next(error);
  }
};

const updateCustomerProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    await pool.query('UPDATE customers SET name = $1, phone = $2 WHERE id = $3', [name, phone, req.user.id]);
    res.json({ message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

const updateVendorProfile = async (req, res, next) => {
  try {
    const { businessName, ownerName, phone, serviceCategory, city } = req.body;

    if (!businessName || !ownerName || !phone || !serviceCategory || !city) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await pool.query(
      `UPDATE vendors
       SET business_name = $1, owner_name = $2, phone = $3, service_category = $4, city = $5
       WHERE id = $6`,
      [businessName, ownerName, phone, serviceCategory, city, req.user.id]
    );

    res.json({ message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateCustomerProfile, updateVendorProfile };
