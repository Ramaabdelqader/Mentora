import { Enrollment, Course } from "../models/index.js";

export async function enroll(req, res, next) {
  try {
    const { courseId } = req.body ?? {};
    if (courseId === undefined) return res.status(400).json({ message: "courseId required" });

    const cid = Number(courseId);
    if (isNaN(cid)) return res.status(400).json({ message: "Invalid courseId" });

    const course = await Course.findByPk(cid);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const [row, created] = await Enrollment.findOrCreate({
      where: { UserId: req.user.id, CourseId: cid },
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
      include: [{ model: Course }],
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
    if (courseId === undefined) return res.status(400).json({ message: "courseId required" });

    const cid = Number(courseId);
    if (isNaN(cid)) return res.status(400).json({ message: "Invalid courseId" });

    const count = await Enrollment.destroy({
      where: { UserId: req.user.id, CourseId: cid },
    });
    if (!count) return res.status(404).json({ message: "Enrollment not found" });
    return res.status(204).end();
  } catch (e) {
    next(e);
  }
}
