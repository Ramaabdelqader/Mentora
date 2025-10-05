import api from "./client";
export const getCategories = async () => (await api.get("/categories")).data;
export const getCourses = async () => (await api.get("/courses")).data;
export const getCourse = async (id) => (await api.get(`/courses/${id}`)).data;
export const register = async (body) => (await api.post("/auth/register", body)).data;
export const login = async (body) => (await api.post("/auth/login", body)).data;
// ENROLLMENTS (DB-backed)
export const getMyEnrollments = async () =>
  (await api.get("/enrollments/my-courses")).data;  // returns array

export const enrollCourse = async (courseId) =>
  (await api.post("/enrollments", { courseId })).data;

export const dropEnrollment = async (courseId) =>
  (await api.delete(`/enrollments/${courseId}`)).data;
// add this near your other exports
export const getLessons = async (courseId) =>
  (await api.get(`/lessons?courseId=${courseId}`)).data;
export const getLesson = async (lessonId) =>
  (await api.get(`/lessons/${lessonId}`)).data; // needs token



export const me = async () => (await api.get("/auth/me")).data;
