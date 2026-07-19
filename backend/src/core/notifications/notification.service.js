const db = require('../../database/connection');

class NotificationService {
  async sendNotification({ userId, type, message, metadata = {} }) {
    console.log(`[Notification] Dispatching notification to User ${userId}: [${type}] - ${message}`);
    
    try {
      const sql = 'INSERT INTO notifications (user_id, type, message, metadata, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())';
      const params = [userId, type, message, JSON.stringify(metadata)];
      
      await db.query(sql, params);
    } catch (err) {
      console.error('[Notification Error] Failed to store notification in db:', err.message);
    }
  }
}

module.exports = new NotificationService();
