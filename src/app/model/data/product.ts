export interface IProduct {
  id: number;
  typeId: number;
  name: string;
  price: number;
  status: number;
  file: string;
  type?: IType;//關聯"types"
  updateBy: number;
  updated: number;
  insertBy: number;
  inserted: number;
}

export interface IType {
  id: number;
  name: string;
}
