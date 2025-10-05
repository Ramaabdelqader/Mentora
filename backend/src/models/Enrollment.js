export default (sequelize, DataTypes) => {
  const Enrollment = sequelize.define("Enrollment", {
    progress: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // 0..100
  });
  return Enrollment;
};
