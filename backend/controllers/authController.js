const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const generateToken = require('../utils/generateToken');
const { sendOtpEmail } = require('../utils/mailer');

const createOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const customerSignup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existing] = await pool.query('SELECT id, is_verified FROM customers WHERE email = ?', [email]);
    if (existing.length && existing[0].is_verified) {
      return res.status(409).json({ message: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing.length) {
      await pool.query(
        'UPDATE customers SET name = ?, phone = ?, password = ?, is_verified = 0 WHERE email = ?',
        [name, phone, hashedPassword, email]
      );
    } else {
      await pool.query(
        'INSERT INTO customers (name, email, phone, password, is_verified) VALUES (?, ?, ?, ?, 0)',
        [name, email, phone, hashedPassword]
      );
    }

    const otp = createOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query('DELETE FROM otp_verification WHERE email = ?', [email]);
    await pool.query(
      'INSERT INTO otp_verification (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    await sendOtpEmail(email, otp);

    const emailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    res.status(201).json({
      message: emailConfigured
        ? 'Signup successful. Please verify OTP sent to email.'
        : 'Signup successful. Email is not configured, so OTP is shown for local testing.',
      devOtp: emailConfigured ? undefined : otp
    });
  } catch (error) {
    next(error);
  }
};

const verifyCustomerOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const [records] = await pool.query(
      'SELECT * FROM otp_verification WHERE email = ? AND otp = ?',
      [email, otp]
    );

    if (!records.length) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date(records[0].expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    await pool.query('UPDATE customers SET is_verified = 1 WHERE email = ?', [email]);
    await pool.query('DELETE FROM otp_verification WHERE email = ?', [email]);

    res.json({ message: 'OTP verified. You can login now.' });
  } catch (error) {
    next(error);
  }
};

const customerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [customers] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    const customer = customers[0];

    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!customer.is_verified) {
      return res.status(403).json({ message: 'Please verify OTP before login' });
    }

    const token = generateToken({ id: customer.id, role: 'customer' });

    res.json({
      token,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: 'customer'
      }
    });
  } catch (error) {
    next(error);
  }
};

const vendorSignup = async (req, res, next) => {
  try {
    const { businessName, ownerName, email, phone, password, serviceCategory, city } = req.body;

    if (!businessName || !ownerName || !email || !phone || !password || !serviceCategory || !city) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existing] = await pool.query('SELECT id FROM vendors WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Vendor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO vendors
       (business_name, owner_name, email, phone, password, service_category, city)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [businessName, ownerName, email, phone, hashedPassword, serviceCategory, city]
    );

    res.status(201).json({ message: 'Vendor account created. You can login now.' });
  } catch (error) {
    next(error);
  }
};

const vendorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [vendors] = await pool.query('SELECT * FROM vendors WHERE email = ?', [email]);
    const vendor = vendors[0];

    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: vendor.id, role: 'vendor' });

    res.json({
      token,
      user: {
        id: vendor.id,
        name: vendor.business_name,
        email: vendor.email,
        phone: vendor.phone,
        serviceCategory: vendor.service_category,
        city: vendor.city,
        role: 'vendor'
      }
    });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = generateToken({ id: 1, role: 'admin' });

  res.json({
    token,
    user: {
      id: 1,
      name: 'Admin',
      email,
      role: 'admin'
    }
  });
};

module.exports = {
  customerSignup,
  verifyCustomerOtp,
  customerLogin,
  vendorSignup,
  vendorLogin,
  adminLogin
};
