import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TabComponent } from "./tab.component";

@NgModule({
  providers: [],
  imports: [SharedModule],
  declarations: [TabComponent],
  exports: [TabComponent]
})
export class TabModule {}
