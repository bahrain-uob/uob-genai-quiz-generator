import { Auth } from "aws-amplify";

export const getUserId = async (setter?: any) => {
  let id = (await Auth.currentAuthenticatedUser()).username;
  if (setter) setter(id);
  return id;
};
