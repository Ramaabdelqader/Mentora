import api from "./client";

// Auth
export const login = async (body) => (await api.post("/auth/login", body)).data;

// Courses
export const listCourses = async () => (await api.get("/courses")).data;
export const createCourse = async (body) => (await api.post("/courses", body)).data;
export const updateCourse = async (id, body) => (await api.put(`/courses/${id}`, body)).data;
export const deleteCourse = async (id) => (await api.delete(`/courses/${id}`)).data;

// Lessons
export const listLessons = async (courseId) =>
  (await api.get(`/lessons${courseId ? `?courseId=${courseId}` : ""}`)).data;
export const createLesson = async (body) => (await api.post("/lessons", body)).data;
export const updateLesson = async (id, body) => (await api.put(`/lessons/${id}`, body)).data;
export const deleteLesson = async (id) => (await api.delete(`/lessons/${id}`)).data;

// Categories
export const listCategories = async () => (await api.get("/categories")).data;
export const createCategory = async (body) => (await api.post("/categories", body)).data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}`)).data;

// Users (admin only)
export const listUsers = async () => (await api.get("/users")).data;
export const setUserRole = async (id, role) => (await api.patch(`/users/${id}/role`, { role })).data;
export const resetUserPassword = async (id, password) =>
  (await api.patch(`/users/${id}/password`, { password })).data;
export const deleteUser = async (id) => (await api.delete(`/users/${id}`)).data;
// Create (register) a user via public auth endpoint.
// Admin token is already attached by the axios interceptor.
export const registerUser = async (body) =>
  (await api.post("/auth/register", body)).data; // -> { token, user }
