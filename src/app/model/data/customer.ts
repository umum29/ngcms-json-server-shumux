export interface ICustomer {
  id?: number;
  name: string;
  levelId: number;
  account: string;
  password: string;
  status: number;
  updateBy: number;
  updated: number;
  insertBy: number;
  inserted: number;
  level?: ILevel;//關聯"levels"
}

export interface ILevel {
  id?: number;
  name: string;
}
