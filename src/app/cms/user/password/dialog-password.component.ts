import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { ValidationService } from "../../../shared/validation/validation.service";
import { IData } from "../../../model/base";
import { Observable } from "rxjs/internal/Observable";
import { DataService } from "../../../service/data.service";
import { UserService } from "../../../service/user.service";

export interface IPassword {
  old?: string;
  new?: string;
  repeat?: string;
}

@Component({
  selector: "dialog-user-password",
  templateUrl: "./dialog-password.component.html",
  styleUrls: ["./dialog-password.component.css"]
})
export class DialogUserPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogUserPasswordComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    let obj = {
      oldP: [
        "",
        [Validators.required, Validators.minLength(6), ValidationService.userValidator],
        this.asyncValidator.bind(this)
      ],
      newP: ["", [Validators.required, Validators.minLength(6), ValidationService.userValidator]],
      repeatP: ["", [Validators.required, ValidationService.matchingPasswords("newP")]]
    };
    this.form = this.fb.group(obj);
  }

  getDetailData(): IPassword {
    return <IPassword>{
      old: this.form.value.oldP,
      new: this.form.value.newP,
      repeat: this.form.value.repeatP
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }

  asyncValidator(control): Observable<IData> {
    return Observable.create(observer => {
      if (control.value === this.userService.getUser().password) {
        observer.next(null);
      } else {
        observer.next({ invalidOldPassword: true });
      }
      observer.complete();
    });
  }
}
