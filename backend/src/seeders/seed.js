import "dotenv/config";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/db.js";
import { User, Category, Course, Lesson } from "../models/index.js";

async function seed() {
  await sequelize.sync({ force: true });

  // users
  const [admin, instructor, student] = await Promise.all([
    User.create({ name: "Admin", email: "admin@mentora.com", password: await bcrypt.hash("admin123", 10), role: "admin" }),
    User.create({ name: "Sara Kim", email: "sara@mentora.com", password: await bcrypt.hash("instructor123", 10), role: "instructor" }),
    User.create({ name: "Jane Doe", email: "jane@mentora.com", password: await bcrypt.hash("student123", 10), role: "student" }),
  ]);

  // categories
  const [prog, design] = await Promise.all([
    Category.create({ name: "Programming" }),
    Category.create({ name: "Design" }),
  ]);

  // courses
  const js = await Course.create({
    title: "JavaScript from Zero to Hero",
    description: "Master JS fundamentals, ES6+, and build real apps.",
    price: 49.99, level: "Beginner", duration: "12h",
    thumbnail: "",
    CategoryId: prog.id,
    instructorId: instructor.id,
  });

  const react = await Course.create({
    title: "React Essentials",
    description: "Hooks, routing, state management, patterns.",
    price: 59.99, level: "Intermediate", duration: "10h",
    thumbnail: "",
    CategoryId: prog.id,
    instructorId: instructor.id,
  });

  // lessons
  await Lesson.bulkCreate([
    { title: "Intro & Setup", order: 1, CourseId: js.id },
    { title: "Variables & Types", order: 2, CourseId: js.id },
    { title: "Async/Await", order: 3, CourseId: js.id },
    { title: "JSX & Components", order: 1, CourseId: react.id },
    { title: "Hooks", order: 2, CourseId: react.id },
  ]);

  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
