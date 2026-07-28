const prisma = require('../../../database/prismaClient');

// Get all hostels with their blocks and capacities
const getAllHostels = async () => {
  return prisma.hostel.findMany({
    include: {
      blocks: {
        include: {
          capacities: true
        }
      }
    }
  });
};

// Create a new hostel
const createHostel = async (data) => {
  return prisma.hostel.create({
    data: {
      name: data.name,
      address: data.address,
      type: data.type
    }
  });
};

module.exports = { getAllHostels, createHostel };
