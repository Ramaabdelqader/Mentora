import api from "/src/api/client.js";

// Unwrap response data
function unwrap(response) {
  return response.data;
}

// Standardized error handling
function wrapError(e) {
  const msg = e?.response?.data?.message || e.message || "API error";
  throw new Error(msg);
}

// AUTH
export const login = async (body) => {
  try {
    return unwrap(await api.post("/auth/login", body));
  } catch (e) {
    return wrapError(e);
  }
};

export const registerUser = async (body) => {
  try {
    return unwrap(await api.post("/auth/register", body));
  } catch (e) {
    return wrapError(e);
  }
};

// COURSES
export const listCourses = async () => {
  try {
    return unwrap(await api.get("/courses"));
  } catch (e) {
    return wrapError(e);
  }
};

export const createCourse = async (body) => {
  try {
    return unwrap(await api.post("/courses", body));
  } catch (e) {
    return wrapError(e);
  }
};

export const updateCourse = async (id, body) => {
  try {
    return unwrap(await api.put(`/courses/${id}`, body));
  } catch (e) {
    return wrapError(e);
  }
};

export const deleteCourse = async (id) => {
  try {
    return unwrap(await api.delete(`/courses/${id}`));
  } catch (e) {
    return wrapError(e);
  }
};

// LESSONS
export const listLessons = async (courseId) => {
  try {
    const path = courseId ? `/lessons?courseId=${courseId}` : "/lessons";
    return unwrap(await api.get(path));
  } catch (e) {
    return wrapError(e);
  }
};

export const createLesson = async (body) => {
  try {
    return unwrap(await api.post("/lessons", body));
  } catch (e) {
    return wrapError(e);
  }
};

export const updateLesson = async (id, body) => {
  try {
    return unwrap(await api.put(`/lessons/${id}`, body));
  } catch (e) {
    return wrapError(e);
  }
};

export const deleteLesson = async (id) => {
  try {
    return unwrap(await api.delete(`/lessons/${id}`));
  } catch (e) {
    return wrapError(e);
  }
};

// CATEGORIES
export const listCategories = async () => {
  try {
    return unwrap(await api.get("/categories"));
  } catch (e) {
    return wrapError(e);
  }
};

export const createCategory = async (body) => {
  try {
    return unwrap(await api.post("/categories", body));
  } catch (e) {
    return wrapError(e);
  }
};

export const deleteCategory = async (id) => {
  try {
    return unwrap(await api.delete(`/categories/${id}`));
  } catch (e) {
    return wrapError(e);
  }
};

// USERS (Admin only)
export const listUsers = async () => {
  try {
    return unwrap(await api.get("/users"));
  } catch (e) {
    return wrapError(e);
  }
};

export const setUserRole = async (id, role) => {
  try {
    return unwrap(await api.patch(`/users/${id}/role`, { role }));
  } catch (e) {
    return wrapError(e);
  }
};

export const resetUserPassword = async (id, password) => {
  try {
    return unwrap(await api.patch(`/users/${id}/password`, { password }));
  } catch (e) {
    return wrapError(e);
  }
};

export const deleteUser = async (id) => {
  try {
    return unwrap(await api.delete(`/users/${id}`));
  } catch (e) {
    return wrapError(e);
  }
};
