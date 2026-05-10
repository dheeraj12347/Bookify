const express = require('express');
const { getProfile, updateCustomerProfile, updateVendorProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect('customer', 'vendor', 'admin'), getProfile);
router.put('/customer', protect('customer'), updateCustomerProfile);
router.put('/vendor', protect('vendor'), updateVendorProfile);

module.exports = router;
