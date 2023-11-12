import { Auth } from "aws-amplify";

export const getUserId = async (setter?: any) => {
  let id = (await Auth.currentAuthenticatedUser()).username;
  if (setter) setter(id);
  return id;
};

export const isEqual = <T>(val: T, other: T) => {
  return JSON.stringify(val) === JSON.stringify(other);
};
