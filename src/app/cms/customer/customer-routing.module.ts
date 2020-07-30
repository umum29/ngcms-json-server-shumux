import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CmsResolver } from "../cms-resolve";
import { CustomerComponent } from "./customer.component";
import { CustomerListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    component: CustomerComponent,
    children: [
      {
        path: "list",
        component: CustomerListComponent,
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
export class CustomerRoutingModule {}
