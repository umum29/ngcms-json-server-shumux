import { IProduct } from "./product";
import { ICustomer } from "./customer";

export interface IOrder {
  id: number;
  customerId: number;
  cars?: IOrderCar[];//關聯"cars"
  status: number;
  customer?: ICustomer;//關聯"customers"
  updateBy: number;
  updated: number ;
  insertBy: number;
  inserted: number;
}

export interface IOrderCar {
  id: number;
  orderId: number;
  productId: number;
  amount: number;
  product?: IProduct;//關聯"products"
}
