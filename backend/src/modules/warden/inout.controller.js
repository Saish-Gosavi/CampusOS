import { prisma } from '../../config/prisma.js';

export const getWardenInOutLogs = async (req, res) => {
  try {
    const user = req.user;
    let hostelId = user?.hostelId;

    if (user?.role?.toLowerCase() === 'warden') {
      const warden = await prisma.warden.findUnique({ where: { userId: user.id } });
      if (warden?.hostelId) {
        hostelId = warden.hostelId;
      }
    }

    const { userType, direction } = req.query;
    const filter = {};
    if (hostelId) {
      filter.hostelId = parseInt(hostelId);
    }
    if (userType && userType !== 'All') filter.userType = userType;
    if (direction && direction !== 'All') filter.direction = direction;

    const logs = await prisma.inOutLog.findMany({
      where: filter,
      orderBy: { timestamp: 'desc' },
      include: {
        loggedBy: { select: { name: true } }
      }
    });

    res.json({
      success: true,
      data: logs.map(l => ({
        id: l.id,
        name: l.name,
        userType: l.userType,
        direction: l.direction,
        reason: l.reason,
        date: l.timestamp.toLocaleDateString(),
        time: l.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        loggedBy: l.loggedBy?.name || 'Warden'
      }))
    });
  } catch (error) {
    console.error('Error fetching warden in out logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
};

export const createWardenInOutLog = async (req, res) => {
  try {
    const user = req.user;
    let hostelId = user?.hostelId;

    if (user?.role?.toLowerCase() === 'warden') {
      const warden = await prisma.warden.findUnique({ where: { userId: user.id } });
      if (warden?.hostelId) {
        hostelId = warden.hostelId;
      }
    }

    const { name, userType, direction, reason } = req.body;
    const loggedById = user?.id || 1;

    const log = await prisma.inOutLog.create({
      data: {
        name,
        userType,
        direction,
        reason,
        hostelId: hostelId ? parseInt(hostelId) : null,
        loggedById
      }
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    console.error('Error creating warden in out log:', error);
    res.status(500).json({ success: false, message: 'Failed to create log' });
  }
};
