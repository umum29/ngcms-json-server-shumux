import { Input, Directive, forwardRef } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms";
import { ValidationService } from "./validation.service";

@Directive({
  selector: "[fnValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ValidationDirective),
      multi: true
    }
  ]
})
export class ValidationDirective implements Validator {
  @Input() fnValidator: string;
  validate(c: AbstractControl): { [key: string]: any } {
    return ValidationService[this.fnValidator](c);
  }
}
