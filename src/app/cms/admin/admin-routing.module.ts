import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CmsResolver } from "../cms-resolve";
import { AdminComponent } from "./admin.component";
import { AdminListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "list",
        component: AdminListComponent,
        resolve: { listTab: CmsResolver }
      },
      { path: "", redirectTo: "list", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
