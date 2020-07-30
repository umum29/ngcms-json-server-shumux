import { IHold } from "./admin";

export interface IUser {
  id: number;
  name: string;
  account: string;
  password: string;
  status: number;
  token: string;
  holds: IHold[];//關聯"holds"
}
