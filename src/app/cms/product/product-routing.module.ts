import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CmsResolver } from "../cms-resolve";
import { ProductListComponent } from "./list/list.component";
import { ProductComponent } from "./product.component";

const routes: Routes = [
  {
    path: "",
    component: ProductComponent,
    children: [
      {
        path: "list",
        component: ProductListComponent,
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
export class ProductRoutingModule {}
