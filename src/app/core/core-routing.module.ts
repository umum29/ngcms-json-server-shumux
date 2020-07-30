import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GuardService } from "./guard.service";
import { CoreComponent } from "./core.component";
import { CmsRouting } from "../cms/cms-routing";
import { CmsResolver } from "../cms/cms-resolve";

const routes: Routes = [
  {
    path: "cms",
    component: CoreComponent,
    canActivate: [GuardService],
    children: CmsRouting
  },
  { path: "", redirectTo: "cms", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CmsResolver]
})
export class CoreRoutingModule {}
