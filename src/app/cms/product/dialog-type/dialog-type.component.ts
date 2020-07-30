import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dialog-product-type",
  templateUrl: "./dialog-type.component.html",
  styleUrls: ["./dialog-type.component.css"]
})
export class DialogProductTypeComponent implements OnInit {
  ipContent = new FormControl("", [Validators.required]);
  isUpdateNameIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogProductTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { typeNames: string[] }
  ) {}

  ngOnInit() {
    if (!this.data || !this.data.typeNames || !this.data.typeNames.length) {
      this.data.typeNames = [];
    }
  }

  onDelete(index: number) {
    this.data.typeNames.splice(index, 1);
  }

  onInsert() {
    if (!!this.ipContent.value && this.ipContent.valid) {
      this.data.typeNames.push(this.ipContent.value);
      this.ipContent.setValue("");
    }
  }

  onSave(index: number, value: string) {
    this.data.typeNames[index] = value;
    this.isUpdateNameIndex = 0;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.data.typeNames);
  }
}
