import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { SearchModule } from "../../modules/search/search.module";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CustomerComponent } from "./customer.component";
import { CustomerListComponent } from "./list/list.component";
import { DialogCustomerLevelComponent } from "./dialog-level/dialog-level.component";
import { DialogCustomerDetailComponent } from "./list/detail/dialog-detail.component";

@NgModule({
  imports: [SharedModule, SearchModule, CustomerRoutingModule],
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    DialogCustomerLevelComponent,
    DialogCustomerDetailComponent
  ],
  exports: [CustomerComponent],
  providers: [],
  entryComponents: [DialogCustomerDetailComponent, DialogCustomerLevelComponent]
})
export class CustomerModule {}
