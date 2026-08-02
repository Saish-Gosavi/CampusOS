import { NoticeService } from "../services/notice.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";

export class NoticeController {
  static async getAll(req, res, next) {
    try {
      const notices = await NoticeService.getAll();
      return apiResponse.success(res, notices, "Notices retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const notice = await NoticeService.create(req.body, req.user.id);
      return apiResponse.success(res, notice, "Notice created successfully", 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const notice = await NoticeService.update(req.params.id, req.body, req.user.id);
      return apiResponse.success(res, notice, "Notice updated successfully");
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      await NoticeService.remove(req.params.id, req.user.id);
      return apiResponse.success(res, null, "Notice deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}
