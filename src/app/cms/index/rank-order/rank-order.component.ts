import { Component, OnInit, Input } from "@angular/core";
import { DataService, IFilter } from "../../../service/data.service";
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

@Component({
  selector: "app-rank-order",
  templateUrl: "./rank-order.component.html",
  styleUrls: ["./rank-order.component.css"]
})
export class RankOrderComponent implements OnInit {
  @Input() innerWidth: number = 0;
  @Input() innerHeight: number = 0;
  rankOrders: IChartData[] = [];
  max = 3;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.setDatas(0);
  }

  setDatas(tag: number) {
    if (tag <= this.max) {
      this.setOrders(tag, this.setDate(tag));
    }
  }

  setDate(lastIndex?: number): IDateRange {
    let obj = <IDateRange>{
      startDate: null,
      endDate: null
    };
    obj.startDate = moment()
      .month(moment().month() - lastIndex)
      .startOf("month");
    obj.endDate = moment()
      .month(moment().month() - lastIndex)
      .endOf("month");
    return obj;
  }

  setOrders(tag: number, range: IDateRange) {
    let filters: IFilter[] = [
      { key: "status", val: 5 },
      { key: "inserted_gte", val: range.startDate.valueOf() },
      { key: "inserted_lte", val: range.endDate.valueOf() }
    ];
    this.dataService.getData("orders", null, filters).subscribe((data: IData) => {
      if (!data.errorcode && !!data.res) {
        let orders = <IOrder[]>data.res;
        this.settingOrder(tag, orders);
      } else {
        this.setDatas(++tag);
      }
    });
  }

  settingOrder(tag: number, orders: IOrder[]) {
    if (!!orders.length) {
      this.runPerOrder(tag, 0, orders);
    } else {
      this.setDatas(++tag);
    }
  }

  runPerOrder(tag: number, orderIndex: number, orders: IOrder[]) {
    let leng = orders.length;
    if (orderIndex < leng) {
      this.setPerOrder(tag, orderIndex, orders);
    } else {
      this.setRankOrders(tag, orders);
    }
  }

  setPerOrder(tag: number, orderIndex: number, orders: IOrder[]) {
    let order = orders[orderIndex];
    let filters: IFilter[] = [
      { key: "orderId", val: order.id },
      { key: "_expand", val: "product" }
    ];
    this.dataService.getData("cars", null, filters).subscribe((carData: IData) => {
      if (!carData.errorcode && !!carData.res) {
        let cars = <IOrderCar[]>carData.res;
        let sum = this.sumCars(cars);
        order["sum"] = sum;
      } else {
        order["sum"] = 0;
      }
      this.runPerOrder(tag, ++orderIndex, orders);
    });
  }

  sumCars(cars: IOrderCar[]): number {
    let sum = 0;
    if (!!cars && !!cars.length) {
      cars.forEach((car: IOrderCar) => {
        sum += car.product.price * car.amount;
      });
    }
    return sum;
  }

  setRankOrders(tag: number, orders: IOrder[]) {
    let total = orders
      .map((order: IOrder) => {
        return order["sum"];
      })
      .reduce((a: number, c: number) => {
        return a + c;
      }, 0);
    let obj = <IChartData>{
      name: this.setRankName(tag),
      value: total
    };
    this.rankOrders.push(obj);
    this.setDatas(++tag);
  }

  setRankName(tag: number): string {
    let nowMonth = moment().month() + 1;
    let tagMonth = nowMonth - tag;
    return `${tagMonth}`;
  }
}
