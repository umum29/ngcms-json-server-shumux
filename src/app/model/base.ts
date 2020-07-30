import { IModel } from "./data";

export interface IPage {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface IData {
  res: IModel | IModel[];
  errorcode: number;
}
