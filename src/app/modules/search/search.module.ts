import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from "ng-pick-datetime";
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from "ng-pick-datetime-moment";
import { SearchSelectComponent } from "./search-select/search-select.component";
import { SearchInputComponent } from "./search-input/search-input.component";
import { SearchDateComponent } from "./search-date/search-date.component";

@NgModule({
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE]
    },
    { provide: OWL_DATE_TIME_FORMATS, useValue: OWL_MOMENT_DATE_TIME_FORMATS }
  ],
  imports: [SharedModule, OwlDateTimeModule, OwlNativeDateTimeModule],
  declarations: [SearchSelectComponent, SearchInputComponent, SearchDateComponent],
  exports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SearchSelectComponent,
    SearchInputComponent,
    SearchDateComponent
  ]
})
export class SearchModule {}
