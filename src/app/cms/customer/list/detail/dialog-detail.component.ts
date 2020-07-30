import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ValidationService } from "../../../../shared/validation/validation.service";
import { ICustomer, ILevel } from "../../../../model/data";
import { ACCOUNTSTATUS } from "../../../../config";

export interface IDetailCustomer {
  customer: ICustomer;
  levels: ILevel[];
}

@Component({
  selector: "dialog-customer-detail",
  templateUrl: "./dialog-detail.component.html",
  styleUrls: ["./dialog-detail.component.css"]
})
export class DialogCustomerDetailComponent implements OnInit {
  ACCOUNTSTATUS = ACCOUNTSTATUS;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCustomerDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDetailCustomer,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (!!this.data && !!this.data.levels) {
      this.createForm();
      if (!!this.data.customer) {
        this.editForm();
      }
    }
  }

  createForm() {
    let obj = {
      name: ["", Validators.required],
      levelId: ["", Validators.required],
      status: ["", Validators.required]
    };
    if (!this.data.customer) {
      //insert
      obj["account"] = [
        "",
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ];
      obj["password"] = [
        "",
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ];
    }
    this.form = this.fb.group(obj);
  }

  editForm() {
    let customer = this.data.customer;
    this.form.setValue({
      name: customer.name || "",
      levelId: customer.levelId.toString() || "",
      status: customer.status.toString() || ""
    });
  }

  getDetailData(): ICustomer {
    return <ICustomer>{
      account: this.form.value.account,
      password: this.form.value.password,
      name: this.form.value.name,
      levelId: +this.form.value.levelId,
      status: +this.form.value.status
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
