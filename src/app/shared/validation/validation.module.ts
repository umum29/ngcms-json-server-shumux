import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ValidationDirective } from "./validation.directive";
import { ValidationService } from "./validation.service";
import { ValidationMessagesComponent } from "./validation-messages.component";

@NgModule({
  providers: [ValidationService],
  imports: [CommonModule, FormsModule, TranslateModule],
  declarations: [ValidationMessagesComponent, ValidationDirective],
  exports: [ValidationMessagesComponent, ValidationDirective]
})
export class ValidationModule {}
