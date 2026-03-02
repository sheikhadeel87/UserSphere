const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

const {
  createUser,
  getUsers,
  getUserById,
  replaceUser,
  updateUser,
  deleteUser,
  getUserStats,
  getGeneralStats,
  getUserNames,
  getUserByAge,
  filterUsers,
  getGrowthPrediction
} = require('../controllers/user.controller');

const router = express.Router();

// Public routes (stats for dashboard)
router.get('/stats', getUserStats);
router.get('/general-stats', getGeneralStats);
router.get('/names', getUserNames);
router.get('/filter', filterUsers);
router.get('/predictions', getGrowthPrediction);

// Protected routes (require login)
router.route('/')
  .post(protect, createUser)
  .get(protect, getUsers);

router.route('/:id')
  .get(protect, getUserById)
  .put(protect, replaceUser)
  .patch(protect, updateUser)
  .delete(protect, adminOnly, deleteUser);  // Only admin can delete

module.exports = router;
