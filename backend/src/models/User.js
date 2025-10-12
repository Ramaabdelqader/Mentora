import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize) => {
  class User extends Model {}
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false }, // stores HASH
      role: { type: DataTypes.ENUM("student", "instructor", "admin"), defaultValue: "student" },
    },
    { sequelize, modelName: "User" }
  );

  // hash on create/update if changed
  User.beforeCreate(async (u) => {
    if (u.password) u.password = await bcrypt.hash(u.password, 10);
  });
  User.beforeUpdate(async (u) => {
    if (u.changed("password")) u.password = await bcrypt.hash(u.password, 10);
  });

  return User;
};
