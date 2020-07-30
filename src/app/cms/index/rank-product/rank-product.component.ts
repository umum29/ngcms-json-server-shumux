import { Component, OnInit, Input } from "@angular/core";
import { DataService, IFilter } from "./../../../service/data.service";
import { IData } from "../../../model/base";
import { IOrder, IOrderCar } from "../../../model/data";
import * as _moment from "moment";
import { Moment } from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

interface IChartData {
  name: string;
  value: number;
}

interface IDateRange {
  startDate: Moment;
  endDate: Moment;
}

interface IAmountProduct {
  productName: string;
  totalAmount: number;
}

@Component({
  selector: "app-rank-product",
  templateUrl: "./rank-product.component.html",
  styleUrls: ["./rank-product.component.css"]
})
export class RankProductComponent implements OnInit {
  @Input() innerWidth: number = 0;
  @Input() innerHeight: number = 0;
  rankProducts: IChartData[] = [];
  sumProducts: { [key: number]: number } = {};
  max = 5;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.setDatas();
  }

  setDate(): IDateRange {
    let obj = <IDateRange>{
      startDate: null,
      endDate: null
    };
    obj.startDate = moment().startOf("month");
    obj.endDate = moment()
      .startOf("month")
      .add(1, "months");
    return obj;
  }

  setDatas() {
    this.setOrders(this.setDate());
  }

  setOrders(range: IDateRange) {
    let filters: IFilter[] = [
      { key: "status", val: 5 },
      { key: "inserted_gte", val: range.startDate.valueOf() },
      { key: "inserted_lte", val: range.endDate.valueOf() }
    ];
    this.dataService.getData("orders", null, filters).subscribe((data: IData) => {
      if (!data.errorcode && !!data.res) {
        let orders = <IOrder[]>data.res;
        this.runPerOrder(0, orders);
      }
    });
  }

  runPerOrder(orderIndex: number, orders: IOrder[]) {
    let leng = orders.length;
    if (orderIndex < leng) {
      this.setPerOrder(orderIndex, orders);
    } else {
      this.setRankProducts();
    }
  }

  setPerOrder(orderIndex: number, orders: IOrder[]) {
    let order = orders[orderIndex];
    let filters: IFilter[] = [
      { key: "orderId", val: order.id },
      { key: "_expand", val: "product" }
    ];
    this.dataService.getData("cars", null, filters).subscribe((carData: IData) => {
      if (!carData.errorcode && !!carData.res) {
        let cars = <IOrderCar[]>carData.res;
        this.setPerProduct(cars);
      }
      this.runPerOrder(++orderIndex, orders);
    });
  }

  setPerProduct(cars: IOrderCar[]) {
    cars.forEach((car: IOrderCar) => {
      if (!this.sumProducts[car.product.name]) {
        this.sumProducts[car.product.name] = 0;
      }
      this.sumProducts[car.product.name] = this.sumProducts[car.product.name] + car.amount;
    });
  }

  setRankProducts() {
    let arrs: IAmountProduct[] = [];
    arrs = this.sortRankProducts(arrs);
    if (!!arrs && !!arrs.length) {
      this.rankProducts = [];
      let max = arrs.length - 1 < this.max ? arrs.length - 1 : this.max;
      for (let i = 0; i <= max; i++) {
        this.rankProducts.push({
          name: arrs[i].productName,
          value: arrs[i].totalAmount
        });
      }
    }
  }

  sortRankProducts(arrs: IAmountProduct[]): IAmountProduct[] {
    let keys = Object.keys(this.sumProducts);
    keys.forEach((k: string) => {
      let obj = <IAmountProduct>{
        productName: k,
        totalAmount: this.sumProducts[k]
      };
      arrs.push(obj);
    });
    arrs.sort((a, b) => {
      if (a.totalAmount < b.totalAmount) {
        return 1;
      }
      if (a.totalAmount > b.totalAmount) {
        return -1;
      }
      return 0;
    });
    return arrs;
  }
}
