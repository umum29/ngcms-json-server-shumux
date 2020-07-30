import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { IndexRoutingModule } from "./index-routing.module";
import { IndexComponent } from "./index.component";
import { RankOrderComponent } from "./rank-order/rank-order.component";
import { RankProductComponent } from './rank-product/rank-product.component';

@NgModule({
  imports: [SharedModule, IndexRoutingModule],
  declarations: [IndexComponent, RankOrderComponent, RankProductComponent],
  exports: [IndexComponent],
  providers: []
})
export class IndexModule {}
