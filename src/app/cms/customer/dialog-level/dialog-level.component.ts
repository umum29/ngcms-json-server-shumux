import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dialog-customer-level",
  templateUrl: "./dialog-level.component.html",
  styleUrls: ["./dialog-level.component.css"]
})
export class DialogCustomerLevelComponent implements OnInit {
  ipContent = new FormControl("", [Validators.required]);
  isUpdateNameIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogCustomerLevelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { levelNames: string[] }
  ) {}

  ngOnInit() {
    if (!this.data || !this.data.levelNames || !this.data.levelNames.length) {
      this.data.levelNames = [];
    }
  }

  onDelete(index: number) {
    this.data.levelNames.splice(index, 1);
  }

  onInsert() {
    if (!!this.ipContent.value && this.ipContent.valid) {
      this.data.levelNames.push(this.ipContent.value);
      this.ipContent.setValue("");
    }
  }

  onSave(index: number, value: string) {
    this.data.levelNames[index] = value;
    this.isUpdateNameIndex = 0;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.data.levelNames);
  }
}
