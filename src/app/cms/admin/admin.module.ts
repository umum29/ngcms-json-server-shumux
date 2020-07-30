import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { AdminListComponent } from "./list/list.component";
import { AdminPowerComponent } from "./list/power/power.component";
import { AdminPowerMainComponent } from "./list/power-main/power-main.component";
import { DialogAdminInsertComponent } from "./list/insert/dialog-insert.component";

@NgModule({
  imports: [SharedModule, AdminRoutingModule],
  declarations: [
    AdminComponent,
    AdminListComponent,
    AdminPowerMainComponent,
    AdminPowerComponent,
    DialogAdminInsertComponent
  ],
  exports: [AdminComponent],
  providers: [],
  entryComponents: [DialogAdminInsertComponent]
})
export class AdminModule {}
