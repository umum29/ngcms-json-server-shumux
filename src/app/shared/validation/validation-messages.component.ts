import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "validation-messages",
  template:
    '<div class="error-message" *ngIf="errorMessage !== null">{{errorMessage | translate}}</div>',
  styles: [".error-message{color:#DF7607;font-size: x-small;}"]
})
export class ValidationMessagesComponent {
  @Input() control: FormControl;
  constructor() {}

  get errorMessage() {
    if (!!this.control) {
      for (let propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return propertyName;
        }
      }
    }
    return null;
  }
}
