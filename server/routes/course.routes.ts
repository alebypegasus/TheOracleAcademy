import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, CourseController.listCourses);
router.post("/generate", authMiddleware, CourseController.generateCourse);
router.post("/complete-step", authMiddleware, CourseController.completeStep);

// GET node content is public — any visitor can read lesson content
router.get("/node/:nodeId", CourseController.getNodeContent);
// POST (save/edit) is admin-only — auth enforced inside controller
router.post("/node/:nodeId", authMiddleware, CourseController.saveNodeContent);

export default router;
