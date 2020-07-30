import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { PreviewModule } from "../../modules/preview/preview.module";
import { SearchModule } from "../../modules/search/search.module";
import { OrderRoutingModule } from "./order-routing.module";
import { OrderComponent } from "./order.component";
import { OrderListComponent } from "./list/list.component";
import { OrderCarComponent } from "./list/car/car.component";
import { DialogOrderDetailComponent } from "./list/detail/dialog-detail.component";

@NgModule({
  imports: [SharedModule, PreviewModule, SearchModule, OrderRoutingModule],
  declarations: [OrderComponent, OrderListComponent, DialogOrderDetailComponent, OrderCarComponent],
  exports: [OrderComponent],
  providers: [],
  entryComponents: [DialogOrderDetailComponent]
})
export class OrderModule {}
