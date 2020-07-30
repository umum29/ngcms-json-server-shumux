import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MateriaModule } from "./materia/materia.module";
import { ValidationModule } from "./validation/validation.module";
import { DialogModule } from "./dialog/dialog.module";
import { PipeModule } from "./pipe/pipe-module";
import { LoadingModule } from "./loading/loading.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    MateriaModule,
    PipeModule,
    ValidationModule,
    LoadingModule,
    NgxChartsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    MateriaModule,
    PipeModule,
    ValidationModule,
    LoadingModule,
    NgxChartsModule
  ]
})
export class SharedModule {}
