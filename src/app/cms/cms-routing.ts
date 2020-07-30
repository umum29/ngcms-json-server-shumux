import { Routes } from "@angular/router";
export const CmsRouting: Routes = [
  {
    path: "index",
    loadChildren: "src/app/cms/index/index.module#IndexModule"
  },
  {
    path: "user",
    loadChildren: "src/app/cms/user/user.module#UserModule"
  },
  {
    path: "admin",
    loadChildren: "src/app/cms/admin/admin.module#AdminModule"
  },
  {
    path: "customer",
    loadChildren: "src/app/cms/customer/customer.module#CustomerModule"
  },
  {
    path: "product",
    loadChildren: "src/app/cms/product/product.module#ProductModule"
  },
  {
    path: "order",
    loadChildren: "src/app/cms/order/order.module#OrderModule"
  }
];
