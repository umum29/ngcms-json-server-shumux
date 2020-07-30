import { ICustomer, ILevel } from "./customer";
import { IProduct, IType } from "./product";
import { IUser } from "./user";
import { IAdmin, IPower, IHold } from "./admin";
import { IOrder, IOrderCar } from "./order";

export * from "./user";
export * from "./admin";
export * from "./customer";
export * from "./product";
export * from "./order";

export type IModel =
  | IUser
  | IAdmin
  | IPower
  | IHold
  | ICustomer
  | ILevel
  | IProduct
  | IType
  | IOrder
  | IOrderCar;
