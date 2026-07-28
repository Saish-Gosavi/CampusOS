const hostelModel = require('../models/hostelDatabase.model');
const AppError = require('../../../utils/AppError');

const getAllHostels = async () => {
  const hostels = await hostelModel.getAllHostels();
  return hostels;
};

const createHostel = async (data) => {
  // Validation
  if (!data.name || !data.type) {
    throw new AppError('Hostel name and type are required.', 400);
  }

  const validTypes = ['boys', 'girls', 'co_ed'];
  if (!validTypes.includes(data.type)) {
    throw new AppError(`Type must be one of: ${validTypes.join(', ')}`, 400);
  }

  const hostel = await hostelModel.createHostel(data);
  return hostel;
};

module.exports = { getAllHostels, createHostel };
