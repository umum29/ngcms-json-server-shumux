import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CmsResolver } from "../cms-resolve";
import { UserComponent } from "./user.component";

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    resolve: { listTab: CmsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
