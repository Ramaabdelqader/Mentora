import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

import UserModel from "./User.js";
import CategoryModel from "./Category.js";
import CourseModel from "./Course.js";
import LessonModel from "./Lesson.js";
import EnrollmentModel from "./Enrollment.js";

export const User = UserModel(sequelize, DataTypes);
export const Category = CategoryModel(sequelize, DataTypes);
export const Course = CourseModel(sequelize, DataTypes);
export const Lesson = LessonModel(sequelize, DataTypes);
export const Enrollment = EnrollmentModel(sequelize, DataTypes);

// Associations with explicit foreign keys
Category.hasMany(Course, { foreignKey: "CategoryId" });
Course.belongsTo(Category, { foreignKey: "CategoryId" });

User.hasMany(Course, { as: "instructorCourses", foreignKey: "instructorId" });
Course.belongsTo(User, { as: "instructor", foreignKey: "instructorId" });

Course.hasMany(Lesson, { foreignKey: "CourseId" });
Lesson.belongsTo(Course, { foreignKey: "CourseId" });

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

export default { sequelize, User, Category, Course, Lesson, Enrollment };
