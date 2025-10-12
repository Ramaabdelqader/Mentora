import { Lesson, Course, Enrollment } from "../models/index.js";

const ALLOWED_LESSON_FIELDS = ["title", "content", "videoUrl", "order"];

export async function listLessons(req, res, next) {
  try {
    const { courseId } = req.query;
    const where = {};
    if (courseId !== undefined) {
      const cid = Number(courseId);
      if (isNaN(cid)) return res.status(400).json({ message: "Invalid courseId" });
      where.CourseId = cid;
    }

    const rows = await Lesson.findAll({
      where,
      attributes: ["id", "title", "order", "CourseId"],
      order: [["order", "ASC"]],
    });
    res.json(rows);
  } catch (e) { next(e); }
}

export async function getLessonSecure(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid lesson id" });

    const lesson = await Lesson.findByPk(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const enr = await Enrollment.findOne({
      where: { UserId: req.user.id, CourseId: lesson.CourseId },
    });
    if (!enr) return res.status(403).json({ message: "Please enroll to access this lesson." });

    res.json({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      order: lesson.order,
      courseId: lesson.CourseId,
    });
  } catch (e) { next(e); }
}

export async function createLesson(req, res, next) {
  try {
    const { title, courseId } = req.body;
    if (!title || courseId === undefined) {
      return res.status(400).json({ message: "title and courseId are required" });
    }
    const cid = Number(courseId);
    if (isNaN(cid)) return res.status(400).json({ message: "Invalid courseId" });

    const course = await Course.findByPk(cid);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Authorization: if instructor, must own course
    if (req.user.role === "instructor" && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const data = { CourseId: course.id };

    for (const f of ALLOWED_LESSON_FIELDS) {
      if (req.body[f] !== undefined) {
        data[f] = req.body[f];
      }
    }

    const lesson = await Lesson.create(data);
    res.status(201).json(lesson);
  } catch (e) {
    next(e);
  }
}

export async function updateLesson(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid lesson id" });

    const lesson = await Lesson.findByPk(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findByPk(lesson.CourseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.user.role === "instructor" && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = {};
    for (const f of ALLOWED_LESSON_FIELDS) {
      if (req.body[f] !== undefined) {
        updates[f] = req.body[f];
      }
    }

    await lesson.update(updates);
    res.json(lesson);
  } catch (e) {
    next(e);
  }
}

export async function deleteLesson(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid lesson id" });

    const lesson = await Lesson.findByPk(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findByPk(lesson.CourseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.user.role === "instructor" && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const count = await Lesson.destroy({ where: { id } });
    if (!count) return res.status(404).json({ message: "Lesson not found" });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
