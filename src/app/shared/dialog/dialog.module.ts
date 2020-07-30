import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MateriaModule } from "../materia/materia.module";
import { DialogAlertComponent } from "./alert/dialog-alert.component";
import { ValidationModule } from "../validation/validation.module";

@NgModule({
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MateriaModule,
    ValidationModule
  ],
  declarations: [DialogAlertComponent],
  exports: [DialogAlertComponent],
  entryComponents: [DialogAlertComponent]
})
export class DialogModule {}
