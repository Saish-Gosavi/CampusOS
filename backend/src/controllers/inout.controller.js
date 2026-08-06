import { prisma } from '../config/prisma.js';

export const getInOutLogs = async (req, res) => {
  try {
    const { hostelId, userType, direction } = req.query;
    const filter = {};
    if (hostelId) filter.hostelId = parseInt(hostelId);
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
        loggedBy: l.loggedBy?.name || 'System Admin'
      }))
    });
  } catch (error) {
    console.error('Error fetching in out logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
};

export const createInOutLog = async (req, res) => {
  try {
    const { name, userType, direction, reason, hostelId } = req.body;
    
    const loggedById = req.user?.id || 1;

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
    console.error('Error creating in out log:', error);
    res.status(500).json({ success: false, message: 'Failed to create log' });
  }
};
