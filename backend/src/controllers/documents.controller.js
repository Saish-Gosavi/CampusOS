import { prisma } from '../config/prisma.js';

export const uploadStudentDocument = async (req, res) => {
  try {
    const { studentId, documentType, name } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await prisma.studentDocument.create({
      data: {
        studentId: parseInt(studentId),
        documentType,
        name,
        fileUrl
      }
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ success: false, message: 'Failed to upload document' });
  }
};

export const getStudentDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const documents = await prisma.studentDocument.findMany({
      where: { studentId: parseInt(studentId) },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
};
