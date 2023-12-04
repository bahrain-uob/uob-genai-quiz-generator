import { Auth } from "aws-amplify";

export const getUserId = async (setter?: any) => {
  let id = (await Auth.currentAuthenticatedUser()).username;
  if (setter) setter(id);
  return id;
};

export const isEqual = <T>(val: T, other: T) => {
  return JSON.stringify(val) === JSON.stringify(other);
};

export const clearQuiz = () => {
  localStorage.removeItem("quiz");
  localStorage.removeItem("stage");
};

export const clearAll = () => {
  localStorage.removeItem("nav");
  localStorage.removeItem("coursesList");
  localStorage.removeItem("materialsList");
  localStorage.removeItem("quizzesList");
  localStorage.removeItem("quiz");
  localStorage.removeItem("stage");
};
