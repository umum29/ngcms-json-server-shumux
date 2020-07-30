import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, ValidationErrors } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ORDERSTATUS, ErrorCodeMsg } from "../../../../config";
import { ValidationService } from "../../../../shared/validation/validation.service";
import { DataService, IFilter } from "../../../../service/data.service";
import { IOrder, IOrderCar, ICustomer, IProduct } from "../../../../model/data";
import { IData } from "../../../../model/base";

export interface IDetailOrder {
  order: IOrder;
  oldCars: IOrderCar[];
  cars: IOrderCar[];
}

@Component({
  selector: "dialog-order-detail",
  templateUrl: "./dialog-detail.component.html",
  styleUrls: ["./dialog-detail.component.css"]
})
export class DialogOrderDetailComponent implements OnInit {
  ORDERSTATUS = ORDERSTATUS;
  form: FormGroup;
  customerName: string = "";
  cars: IOrderCar[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDetailOrder,
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit() {
    if (!!this.data) {
      this.createForm();
      if (!!this.data.order) {
        this.editForm();
      }
    }
  }

  createForm() {
    let obj = {
      customerId: ["", [Validators.required, ValidationService.numberOnlyValidator]],
      status: ["", [Validators.required, ValidationService.numberOnlyValidator]],
      arrs: this.fb.array([], Validators.required)
    };
    this.form = this.fb.group(obj);
  }

  editForm() {
    let order = this.data.order;
    this.form.patchValue({
      customerId: order.customerId.toString() || "",
      status: order.status.toString() || ""
    });
    this.setCustomerName(order.customerId.toString());
    this.setCars();
  }

  get arrs(): FormArray {
    return this.form.get("arrs") as FormArray;
  }

  setCustomerName(customerId: string) {
    this.customerName = "";
    if (!!+customerId) {
      this.dataService.getData("customers", +customerId).subscribe((data: IData) => {
        if (!data.errorcode && !!data.res) {
          let customer = <ICustomer>data.res;
          this.customerName = customer.name;
        } else {
          let result = ErrorCodeMsg.filter(item => item.code === 8);
          let msg = result[0].name;
          let o = <ValidationErrors>{};
          o[msg] = true;
          this.form.controls["customerId"].setErrors(o);
        }
      });
    }
  }

  setCars() {
    let filters: IFilter[] = [
      { key: "orderId", val: this.data.order.id },
      { key: "_expand", val: "product" }
    ];
    this.dataService.getData("cars", null, filters).subscribe((data: IData) => {
      let carsArr = <IOrderCar[]>data.res;
      this.data.oldCars = carsArr.slice(0);
      this.cars = carsArr;
      this.setArrs();
    });
  }

  setArrs() {
    if (!!this.cars && !!this.cars.length) {
      this.cars.forEach((car: IOrderCar, index: number) => {
        this.arrs.push(
          this.fb.group({
            productId: [
              car.productId.toString(),
              [Validators.required, ValidationService.numberOnlyValidator]
            ],
            amount: [
              car.amount.toString(),
              [Validators.required, ValidationService.numberOnlyValidator]
            ]
          })
        );
      });
    }
  }

  setProductData(index: number, productId: string) {
    if (!!+productId) {
      this.dataService.getData("products", +productId).subscribe((data: IData) => {
        if (!data.errorcode && !!data.res) {
          let product = <IProduct>data.res;
          this.cars[index].product = product;
          this.cars[index].productId = product.id;
        } else {
          let result = ErrorCodeMsg.filter(item => item.code === 9);
          let msg = result[0].name;
          let o = <ValidationErrors>{};
          o[msg] = true;
          let control = (<FormArray>this.form.controls.arrs).controls;
          control[index]["controls"]["productId"].setErrors(o);
          this.resetProduct(index);
        }
      });
    } else {
      this.resetProduct(index);
    }
  }

  resetProduct(index: number) {
    this.cars[index].product = <IProduct>{
      id: 0,
      typeId: 0,
      name: "",
      price: 0,
      file: ""
    };
    this.cars[index].productId = 0;
  }

  addArr() {
    this.arrs.push(
      this.fb.group({
        productId: ["", [Validators.required, ValidationService.numberOnlyValidator]],
        amount: ["", [Validators.required, ValidationService.numberOnlyValidator]]
      })
    );
    this.cars.push(<IOrderCar>{
      id: 0,
      orderId: 0,
      amount: 0,
      productId: 0,
      product: {}
    });
  }

  delArr(index: number) {
    this.arrs.removeAt(index);
    this.cars.splice(index, 1);
  }

  turnArrs() {
    if (!!this.form.value.arrs && !!this.form.value.arrs.length) {
      this.form.value.arrs.forEach((item: IOrderCar) => {
        item.productId = +item.productId;
        item.amount = +item.amount;
      });
    }
  }

  getDetailData(): IDetailOrder {
    let order = <IOrder>{
      customerId: +this.form.value.customerId,
      status: +this.form.value.status
    };
    this.turnArrs();
    return <IDetailOrder>{
      order: order,
      cars: this.form.value.arrs,
      oldCars: this.data.oldCars
    };
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
