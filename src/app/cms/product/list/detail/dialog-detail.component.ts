import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IType, IProduct } from "../../../../model/data";
import { PRODUCTSTATUS } from "../../../../config";
import { ValidationService } from "../../../../shared/validation/validation.service";

export interface IDetailProduct {
  product: IProduct;
  types: IType[];
}

@Component({
  selector: "dialog-product-detail",
  templateUrl: "./dialog-detail.component.html",
  styleUrls: ["./dialog-detail.component.css"]
})
export class DialogProductDetailComponent implements OnInit {
  PRODUCTSTATUS = PRODUCTSTATUS;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDetailProduct,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (!!this.data && !!this.data.types) {
      this.createForm();
      if (!!this.data.product) {
        this.editForm();
      }
    }
  }

  createForm() {
    let obj = {
      name: ["", [Validators.required]],
      price: ["", [Validators.required, ValidationService.integerValidator]],
      typeId: ["", [Validators.required, ValidationService.numberOnlyValidator]],
      status: ["", [Validators.required]],
      file: ["", [Validators.required]]
    };
    this.form = this.fb.group(obj);
  }

  editForm() {
    let product = this.data.product;
    this.form.patchValue({
      name: product.name || "",
      price: product.price.toString() || "",
      typeId: product.typeId.toString() || "",
      status: product.status.toString() || "",
      file: product.file || ""
    });
  }

  getDetailData(): IProduct {
    return <IProduct>{
      name: this.form.value.name,
      price: +this.form.value.price,
      typeId: +this.form.value.typeId,
      status: +this.form.value.status,
      file: this.form.value.file
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
