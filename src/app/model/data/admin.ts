export interface IAdmin {
  id?: number;
  name: string;
  account: string;
  password: string;
  status: number;
  holds?: IHold[];//關聯"holds"
  token: string;
  insertBy: number;
  inserted: number;
  updateBy: number;
  updated: number;
}

export interface IPower {
  id: number;
  name: string;
  check?: boolean;
}

export interface IHold {
  id?: number;
  adminId: number;//關聯"admins"
  powerId: number;
  power?: IPower;//關聯"powers"
}
