import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import { SnippetComponent } from './componenti/snippet/snippet.component';

const routes: Routes = [
  {
    path : "", component:HomeComponent,

  },

  {
    path : "snippet", component:SnippetComponent,

  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
