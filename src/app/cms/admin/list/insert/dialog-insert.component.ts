import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ValidationService } from "../../../../shared/validation/validation.service";
import { IAdmin, IPower } from "../../../../model/data";
import { AdminPowerComponent } from "../power/power.component";

export interface IDetailAdmin {
  admin: IAdmin;
  powers: IPower[];
}

@Component({
  selector: "dialog-admin-insert",
  templateUrl: "./dialog-insert.component.html",
  styleUrls: ["./dialog-insert.component.css"]
})
export class DialogAdminInsertComponent implements OnInit {
  @ViewChild(AdminPowerComponent, { static: false }) powerComp: AdminPowerComponent;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAdminInsertComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    let obj = {
      account: [
        "",
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ],
      password: [
        "",
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ],
      name: ["", Validators.required]
    };
    this.form = this.fb.group(obj);
  }

  getDetailData(): IDetailAdmin {
    let powers: IPower[] = [];
    this.powerComp.getPowers().forEach((power: IPower) => {
      if (power.check) {
        powers.push(power);
      }
    });
    let admin = <IAdmin>{
      account: this.form.value.account,
      password: this.form.value.password,
      name: this.form.value.name,
      status: 1
    };
    return <IDetailAdmin>{
      admin: admin,
      powers: powers
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
