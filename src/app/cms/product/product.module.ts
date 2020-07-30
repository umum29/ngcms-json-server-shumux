import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { PreviewModule } from "../../modules/preview/preview.module";
import { SearchModule } from "../../modules/search/search.module";
import { ProductRoutingModule } from "./product-routing.module";
import { ProductComponent } from "./product.component";
import { ProductListComponent } from "./list/list.component";
import { DialogProductTypeComponent } from "./dialog-type/dialog-type.component";
import { DialogProductDetailComponent } from "./list/detail/dialog-detail.component";
import { FileUploaderComponent } from "./list/file-uploader/file-uploader.component";

@NgModule({
  imports: [SharedModule, PreviewModule, SearchModule, ProductRoutingModule],
  declarations: [
    ProductComponent,
    ProductListComponent,
    DialogProductTypeComponent,
    DialogProductDetailComponent,
    FileUploaderComponent
  ],
  exports: [ProductComponent],
  providers: [],
  entryComponents: [DialogProductTypeComponent, DialogProductDetailComponent]
})
export class ProductModule {}
