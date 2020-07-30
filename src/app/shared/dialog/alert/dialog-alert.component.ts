import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { filter, take } from "rxjs/operators";
import { ErrorCodeMsg } from "../../../config";

@Component({
  selector: "share-dialog-alert",
  templateUrl: "./dialog-alert.component.html",
  styleUrls: ["./dialog-alert.component.css"]
})
export class DialogAlertComponent implements OnInit {
  private ErrorCodeMsg = ErrorCodeMsg;

  constructor(
    public dialogRef: MatDialogRef<DialogAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { errorcode: number }
  ) {}

  ngOnInit() {}

  getMsgName(): string {
    if (!!this.data) {
      let result = this.ErrorCodeMsg.filter(item => item.code === this.data.errorcode);
      return !!result.length ? result[0].name : "fail";
    }
  }
}
