import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard, canActivateRoute } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'app/home',
    pathMatch: 'full'
  },
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [canActivateRoute],
    children: [
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [NonAuthGuard]
  }
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AuthModule,
    BrowserModule,
    LoginModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
