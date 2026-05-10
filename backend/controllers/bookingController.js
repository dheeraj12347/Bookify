const pool = require('../config/db');

const createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, address, notes } = req.body;

    if (!serviceId || !bookingDate || !address) {
      return res.status(400).json({ message: 'Service, booking date, and address are required' });
    }

    const [services] = await pool.query('SELECT * FROM services WHERE id = ? AND is_active = 1', [serviceId]);
    const service = services[0];

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const [result] = await pool.query(
      `INSERT INTO bookings
       (customer_id, service_id, booking_date, address, notes, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [req.user.id, serviceId, bookingDate, address, notes || '', service.price]
    );

    res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
  } catch (error) {
    next(error);
  }
};

const getCustomerBookings = async (req, res, next) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, s.name AS service_name, s.category, s.image_url,
              v.business_name AS vendor_name, v.phone AS vendor_phone
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN vendors v ON b.vendor_id = v.id
       WHERE b.customer_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const getVendorBookings = async (req, res, next) => {
  try {
    const [vendorRows] = await pool.query('SELECT service_category FROM vendors WHERE id = ?', [req.user.id]);
    const vendor = vendorRows[0];

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const [bookings] = await pool.query(
      `SELECT b.*, s.name AS service_name, s.category, c.name AS customer_name,
              c.phone AS customer_phone, c.email AS customer_email
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN customers c ON b.customer_id = c.id
       WHERE s.category = ?
       AND (b.vendor_id = ? OR b.vendor_id IS NULL)
       ORDER BY b.created_at DESC`,
      [vendor.service_category, req.user.id]
    );

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const acceptBooking = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `UPDATE bookings b
       JOIN services s ON b.service_id = s.id
       JOIN vendors v ON v.id = ?
       SET b.status = 'Accepted', b.vendor_id = ?
       WHERE b.id = ?
       AND b.status = 'Pending'
       AND b.vendor_id IS NULL
       AND s.category = v.service_category`,
      [req.user.id, req.user.id, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(400).json({ message: 'Booking cannot be accepted' });
    }

    res.json({ message: 'Booking accepted' });
  } catch (error) {
    next(error);
  }
};

const rejectBooking = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `UPDATE bookings b
       JOIN services s ON b.service_id = s.id
       JOIN vendors v ON v.id = ?
       SET b.status = 'Cancelled', b.vendor_id = ?
       WHERE b.id = ?
       AND b.status = 'Pending'
       AND b.vendor_id IS NULL
       AND s.category = v.service_category`,
      [req.user.id, req.user.id, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(400).json({ message: 'Booking cannot be rejected' });
    }

    res.json({ message: 'Booking rejected' });
  } catch (error) {
    next(error);
  }
};

const completeBooking = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `UPDATE bookings
       SET status = 'Completed'
       WHERE id = ? AND vendor_id = ? AND status = 'Accepted'`,
      [req.params.id, req.user.id]
    );

    if (!result.affectedRows) {
      return res.status(400).json({ message: 'Booking cannot be completed' });
    }

    res.json({ message: 'Booking marked completed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getVendorBookings,
  acceptBooking,
  rejectBooking,
  completeBooking
};
