import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import { SnippetComponent } from './componenti/snippet/snippet.component';
import { DocComponent } from './componenti/doc/doc.component';
import { PageComponent } from './componenti/doc/page/page.component';

const routes: Routes = [
  {
    path : "", component:HomeComponent,

  },

  {
    path : "snippet", component:SnippetComponent,

  },
  { path: 'doc', component: DocComponent },
  { path: 'doc/page/:id', component: PageComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
