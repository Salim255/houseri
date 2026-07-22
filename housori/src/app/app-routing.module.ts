import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./features/auth/guard/AuthGuard";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '',

    loadChildren: () => import('./features/layout/layout.module').then(m => m.LayoutModule),
    canMatch: [AuthGuard],
  },
  {
    path:'**',
    loadChildren: () => import('./features/error-page/error-page.module').then(m => m.ErrorPageModule)
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
