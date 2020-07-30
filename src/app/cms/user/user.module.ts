import { NgModule } from "@angular/core";
import { UserRoutingModule } from "./user-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { UserComponent } from "./user.component";
import { DialogUserPasswordComponent } from './password/dialog-password.component';

@NgModule({
  imports: [SharedModule, UserRoutingModule],
  declarations: [UserComponent, DialogUserPasswordComponent],
  exports: [UserComponent],
  providers: [],
  entryComponents: [DialogUserPasswordComponent]
})
export class UserModule {}
