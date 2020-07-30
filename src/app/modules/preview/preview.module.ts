import { NgModule } from "@angular/core";
import { PreviewComponent } from "./preview.component";
import { CommonModule } from "@angular/common";

@NgModule({
  providers: [],
  imports: [CommonModule],
  declarations: [PreviewComponent],
  exports: [PreviewComponent]
})
export class PreviewModule {}
