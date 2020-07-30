import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DialogModule } from "./shared/dialog/dialog.module";
import { AppService } from "./app.service";
import { SpinnerComponent } from "./spinner/spinner.component";
import { SpinnerService } from "./spinner/spinner.service";
import { CoreModule } from "./core/core.module";
import { GuardService } from "./core/guard.service";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    DialogModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [AppService, SpinnerService, GuardService],
  bootstrap: [AppComponent]
})
export class AppModule {}
