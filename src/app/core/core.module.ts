import { NgModule, Optional, SkipSelf } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { CoreRoutingModule } from "./core-routing.module";
import { CoreService } from "./core.service";
import { CoreComponent } from "./core.component";
import { TabModule } from "../modules/tab/tab.module";
import { MenuComponent } from "./menu/menu.component";

@NgModule({
  imports: [SharedModule, TabModule, CoreRoutingModule],
  exports: [CoreComponent],
  declarations: [CoreComponent, MenuComponent],
  providers: [CoreService]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }
}

function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(
      `${moduleName} has already been loaded. Import Core modules in the AppModule only.`
    );
  }
}
