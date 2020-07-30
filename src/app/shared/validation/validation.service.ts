import { FormControl } from "@angular/forms";

export class ValidationService {
  static userValidator(control: FormControl) {
    //英數字+@
    if (!!control.value.match && control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidUser: true };
    }
  }

  static numberOnlyValidator(control: FormControl) {
    //純數字+.
    let val = control.value;
    if (!!val) {
      if (typeof val == "number") {
        val = val.toString();
      }
      if (val.match(/[0-9]|\./)) {
        return null;
      } else {
        return { invalidNumberOnly: true };
      }
    }
  }

  static integerValidator(control: FormControl) {
    //正整数
    if (!!control.value.match && control.value.match(/^[1-9]\d*$/)) {
      return null;
    } else {
      return { invalidInteger: true };
    }
  }

  static matchingPasswords(otherControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {
      if (!control.parent) {
        return null;
      }
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error("matchingPasswords(): other control is not found in parent group");
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }
      if (!otherControl) {
        return null;
      }
      if (otherControl.value !== thisControl.value) {
        return {
          invalidRepeatPassword: true
        };
      }
      return null;
    };
  }
}
