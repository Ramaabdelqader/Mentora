import { Enrollment, Course } from "../models/index.js";

export async function enroll(req, res, next) {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "courseId required" });

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const [row, created] = await Enrollment.findOrCreate({
      where: { UserId: req.user.id, CourseId: Number(courseId) },
      defaults: { progress: 0 },
    });

    return res.status(created ? 201 : 200).json(row);
  } catch (e) {
    next(e);
  }
}

export async function myCourses(req, res, next) {
  try {
    const rows = await Enrollment.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Course }], // so the public site can read row.Course
      order: [["createdAt", "DESC"]],
    });
    return res.json(rows);
  } catch (e) {
    next(e);
  }
}

export async function drop(req, res, next) {
  try {
    const { courseId } = req.params;
    if (!courseId) return res.status(400).json({ message: "courseId required" });

    await Enrollment.destroy({
      where: { UserId: req.user.id, CourseId: Number(courseId) },
    });
    return res.status(204).end();
  } catch (e) {
    next(e);
  }
}
