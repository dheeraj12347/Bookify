const pool = require('../config/db');

const createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, address, notes } = req.body;

    if (!serviceId || !bookingDate || !address) {
      return res.status(400).json({ message: 'Service, booking date, and address are required' });
    }

    const services = await pool.query('SELECT * FROM services WHERE id = $1 AND is_active = TRUE', [serviceId]);
    const service = services.rows[0];

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const result = await pool.query(
      `INSERT INTO bookings
       (customer_id, service_id, booking_date, address, notes, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
       RETURNING id`,
      [req.user.id, serviceId, bookingDate, address, notes || '', service.price]
    );

    res.status(201).json({ message: 'Booking created successfully', bookingId: result.rows[0].id });
  } catch (error) {
    next(error);
  }
};

const getCustomerBookings = async (req, res, next) => {
  try {
    const bookings = await pool.query(
      `SELECT b.*, s.name AS service_name, s.category, s.image_url,
              v.business_name AS vendor_name, v.phone AS vendor_phone
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN vendors v ON b.vendor_id = v.id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json(bookings.rows);
  } catch (error) {
    next(error);
  }
};

const getVendorBookings = async (req, res, next) => {
  try {
    const vendorRows = await pool.query('SELECT service_category FROM vendors WHERE id = $1', [req.user.id]);
    const vendor = vendorRows.rows[0];

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const bookings = await pool.query(
      `SELECT b.*, s.name AS service_name, s.category, c.name AS customer_name,
              c.phone AS customer_phone, c.email AS customer_email
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN customers c ON b.customer_id = c.id
       WHERE s.category = $1
       AND (b.vendor_id = $2 OR b.vendor_id IS NULL)
       ORDER BY b.created_at DESC`,
      [vendor.service_category, req.user.id]
    );

    res.json(bookings.rows);
  } catch (error) {
    next(error);
  }
};

const acceptBooking = async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE bookings b
       SET status = 'Accepted', vendor_id = $2
       FROM services s, vendors v
       WHERE b.service_id = s.id
       AND v.id = $1
       AND b.id = $3
       AND b.status = 'Pending'
       AND b.vendor_id IS NULL
       AND s.category = v.service_category
       RETURNING b.id`,
      [req.user.id, req.user.id, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(400).json({ message: 'Booking cannot be accepted' });
    }

    res.json({ message: 'Booking accepted' });
  } catch (error) {
    next(error);
  }
};

const rejectBooking = async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE bookings b
       SET b.status = 'Cancelled', b.vendor_id = $2
       FROM services s, vendors v
       WHERE b.service_id = s.id
       AND v.id = $1
       AND b.id = $3
       AND b.status = 'Pending'
       AND b.vendor_id IS NULL
       AND s.category = v.service_category
       RETURNING b.id`,
      [req.user.id, req.user.id, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(400).json({ message: 'Booking cannot be rejected' });
    }

    res.json({ message: 'Booking rejected' });
  } catch (error) {
    next(error);
  }
};

const completeBooking = async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'Completed'
       WHERE id = $1 AND vendor_id = $2 AND status = 'Accepted'
       RETURNING id`,
      [req.params.id, req.user.id]
    );

    if (!result.rowCount) {
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
