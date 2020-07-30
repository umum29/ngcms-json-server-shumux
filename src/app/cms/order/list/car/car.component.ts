import { Component, Input, OnInit } from "@angular/core";
import { DataService, IFilter } from "../../../../service/data.service";
import { IData } from "./../../../../model/base";
import { IOrderCar, IOrder } from "./../../../../model/data";

@Component({
  selector: "app-order-car",
  templateUrl: "./car.component.html",
  styleUrls: ["./car.component.css"]
})
export class OrderCarComponent implements OnInit {
  @Input() order: IOrder = null;
  cars: IOrderCar[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (!!this.order) {
      this.setDatas();
    }
  }

  setDatas() {
    let filters: IFilter[] = [
      { key: "orderId", val: this.order.id },
      { key: "_expand", val: "product" }
    ];
    this.dataService.getData("cars", null, filters).subscribe((data: IData) => {
      if (!data.errorcode && !!data.res) {
        this.cars = <IOrderCar[]>data.res;
      }
    });
  }

  getSum(index: number, price = 0, amount = 0): number {
    let sum = price * amount;
    this.cars[index]["sum"] = sum;
    return sum;
  }

  getTotal(): number {
    let t = 0;
    if (!!this.cars && !!this.cars.length) {
      t = this.cars
        .map((car: IOrderCar) => {
          return car["sum"];
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue);
    }
    return t;
  }
}
