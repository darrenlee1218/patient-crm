export const PostBody = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const UserRole = {
  ADMIN: "admin",
  DOCTOR: "doctor",
};

export const UserAccess = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

type IAccess = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export interface IUserInfo {
  username: string;
  usermail: string;
  isAdmin: boolean;
  id: string;
  token: string;
  access: IAccess;
}

export interface IPatient {
  username: string;
  usermail: string;
  userphone: string;
}
