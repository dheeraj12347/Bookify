const express = require('express');
const {
  createBooking,
  getCustomerBookings,
  getVendorBookings,
  acceptBooking,
  rejectBooking,
  completeBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect('customer'), createBooking);
router.get('/customer', protect('customer'), getCustomerBookings);
router.get('/vendor', protect('vendor'), getVendorBookings);
router.patch('/:id/accept', protect('vendor'), acceptBooking);
router.patch('/:id/reject', protect('vendor'), rejectBooking);
router.patch('/:id/complete', protect('vendor'), completeBooking);

module.exports = router;
