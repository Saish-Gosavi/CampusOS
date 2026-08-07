import { StudentService } from "../services/student.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

export class StudentController {
  static async getAllStudents(req, res, next) {
    try {
      const students = await StudentService.getAll(req.user, req.query);
      return apiResponse.success(res, students, "Students list retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getStudentById(req, res, next) {
    try {
      const student = await StudentService.getById(req.params.id);
      return apiResponse.success(res, student, "Student retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createStudent(req, res, next) {
    try {
      const student = await StudentService.create(req.user, req.body);
      return apiResponse.success(res, student, "Student created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateStudent(req, res, next) {
    try {
      const student = await StudentService.update(req.user, req.params.id, req.body);
      return apiResponse.success(res, student, "Student updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteStudent(req, res, next) {
    try {
      await StudentService.delete(req.user, req.params.id);
      return apiResponse.success(res, null, "Student deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
