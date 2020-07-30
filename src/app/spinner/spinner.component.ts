import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs/internal/Subscription";
import { SpinnerState, SpinnerService } from "./spinner.service";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.css"]
})
export class SpinnerComponent implements OnInit {
  visible = false;
  subscription: Subscription;

  constructor(private spinnerService: SpinnerService, public dialog: MatDialog) {
    this.subscription = this.spinnerService.spinnerState.subscribe((state: SpinnerState) => {
      this.visible = state.show;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
