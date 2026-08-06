import { prisma } from '../config/prisma.js';

export const getNotices = async (req, res) => {
  try {
    const { hostelId, priority } = req.query;
    const filter = {};
    if (hostelId) filter.hostelId = parseInt(hostelId);
    if (priority) filter.priority = priority;

    const notices = await prisma.notice.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { name: true, role: { select: { name: true } } } }
      }
    });

    res.json({
      success: true,
      data: notices.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        priority: n.priority,
        date: n.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: n.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        postedBy: n.createdBy?.role?.name === 'superadmin' ? 'Super Admin' : (n.createdBy?.name || 'Admin')
      }))
    });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notices' });
  }
};

export const createNotice = async (req, res) => {
  try {
    const { title, content, priority, hostelId } = req.body;
    
    // In a real app, you get this from req.user (the JWT token)
    // For now, we mock it or expect it in the body if we don't have auth middleware applied everywhere
    const createdById = req.user?.id || 1; 

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        priority: priority || 'General',
        hostelId: hostelId ? parseInt(hostelId) : null,
        createdById
      }
    });

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ success: false, message: 'Failed to create notice' });
  }
};
