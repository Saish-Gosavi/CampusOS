const db = require('../../database/connection');

class AuditLogService {
  async logAction({ userId, action, moduleName, details, ipAddress = null }) {
    console.log(`[Audit Log] User: ${userId} | Module: ${moduleName} | Action: ${action}`);
    
    try {
      const sql = 'INSERT INTO audit_logs (user_id, action, module, details, ip_address, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
      const params = [userId, action, moduleName, typeof details === 'string' ? details : JSON.stringify(details), ipAddress];
      
      await db.query(sql, params);
    } catch (err) {
      console.error('[Audit Log Error] Failed to write audit event:', err.message);
    }
  }
}

module.exports = new AuditLogService();
