import { NgModule } from "@angular/core";
import { TagPipe } from "./pipe-tag";
import { TimePipe } from "./pipe-time";

@NgModule({
  providers: [],
  imports: [],
  declarations: [TagPipe, TimePipe],
  exports: [TagPipe, TimePipe]
})
export class PipeModule {}
