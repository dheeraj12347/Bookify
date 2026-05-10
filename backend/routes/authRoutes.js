const express = require('express');
const {
  customerSignup,
  verifyCustomerOtp,
  customerLogin,
  vendorSignup,
  vendorLogin,
  adminLogin
} = require('../controllers/authController');

const router = express.Router();

router.post('/customer/signup', customerSignup);
router.post('/customer/verify-otp', verifyCustomerOtp);
router.post('/customer/login', customerLogin);
router.post('/vendor/signup', vendorSignup);
router.post('/vendor/login', vendorLogin);
router.post('/admin/login', adminLogin);

module.exports = router;
