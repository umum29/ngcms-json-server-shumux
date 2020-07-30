import { NgModule } from "@angular/core";
import { LayoutModule } from "@angular/cdk/layout";
import { CdkTableModule } from "@angular/cdk/table";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import {
  MatPaginatorModule,
  MatDatepickerModule,
  MatCardModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatTableModule,
  MatCheckboxModule,
  MatRadioModule,
  MatPaginatorIntl
} from "@angular/material";
import { CustomMatPaginatorIntl } from "./custom-mat-paginator-intl";

@NgModule({
  imports: [
    LayoutModule,
    CdkTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  exports: [
    LayoutModule,
    CdkTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  declarations: [],

  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ]
})
export class MateriaModule {}
