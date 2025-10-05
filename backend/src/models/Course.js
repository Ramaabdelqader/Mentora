export default (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    level: { type: DataTypes.STRING, allowNull: false, defaultValue: "Beginner" },
    duration: { type: DataTypes.STRING, allowNull: false, defaultValue: "0h" },
    thumbnail: { type: DataTypes.STRING },
  });
  return Course;
};
