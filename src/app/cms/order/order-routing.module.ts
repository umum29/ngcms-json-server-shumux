import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CmsResolver } from "../cms-resolve";
import { OrderComponent } from "./order.component";
import { OrderListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    component: OrderComponent,
    children: [
      {
        path: "list",
        component: OrderListComponent,
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
export class OrderRoutingModule {}
