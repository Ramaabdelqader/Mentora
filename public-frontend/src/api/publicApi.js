import api from "./client";
export const getCategories = async () => (await api.get("/categories")).data;
export const getCourses = async () => (await api.get("/courses")).data;
export const getCourse = async (id) => (await api.get(`/courses/${id}`)).data;
export const register = async (body) => (await api.post("/auth/register", body)).data;
export const login = async (body) => (await api.post("/auth/login", body)).data;
export const me = async () => (await api.get("/auth/me")).data;
