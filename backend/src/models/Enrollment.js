// Factory-style definition (called from models/index.js with (sequelize, DataTypes))
export default (sequelize, DataTypes) => {
  const Enrollment = sequelize.define("Enrollment", {
    progress: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0..100
    completedAt: { type: DataTypes.DATE, allowNull: true },
  });
  return Enrollment;
};
 