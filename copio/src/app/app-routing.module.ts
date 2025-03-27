import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import { SnippetComponent } from './componenti/snippet/snippet.component';
import { DocComponent } from './componenti/doc/doc.component';
import { PageComponent } from './componenti/doc/page/page.component';
import { LoginComponent } from './componenti/login/login.component';
import { RegisterComponent } from './componenti/login/register/register.component';
import { authGuard } from './auth.guard';
import { NotFoundComponent } from './componenti/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'snippet',
    component: SnippetComponent,
  },
  { path: 'doc', component: DocComponent, canActivate : [authGuard] },

  { path: 'doc/page/:id', component: PageComponent, canActivate : [authGuard] },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component:NotFoundComponent }, // fallback route

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
