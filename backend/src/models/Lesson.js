export default (sequelize, DataTypes) => {
  const Lesson = sequelize.define("Lesson", {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT },
    videoUrl: { type: DataTypes.STRING },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  });
  return Lesson;
};
