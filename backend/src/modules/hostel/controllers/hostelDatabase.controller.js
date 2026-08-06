const hostelService = require('../services/hostelDatabase.service');

// GET /api/database/hostel-database
const getHostels = async (req, res, next) => {
  try {
    const hostels = await hostelService.getAllHostels();
    res.status(200).json({
      status: 'success',
      results: hostels.length,
      data: hostels
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/database/hostel-database
const createHostel = async (req, res, next) => {
  try {
    const hostel = await hostelService.createHostel(req.body);

    // Audit log
    console.log(
      `[AUDIT] Hostel created by user ${req.user?.id} at ${new Date().toISOString()}`,
      hostel
    );

    res.status(201).json({
      status: 'success',
      data: hostel
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHostels, createHostel };
