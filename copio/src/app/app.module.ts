import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componenti/home/home.component';
import { SnippetComponent } from './componenti/snippet/snippet.component';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { provideHttpClient } from '@angular/common/http';
import { DocComponent } from './componenti/doc/doc.component';
import { PageComponent } from './componenti/doc/page/page.component';
import { QuillModule } from 'ngx-quill';
import { LoginComponent } from './componenti/login/login.component';
import { RegisterComponent } from './componenti/login/register/register.component';
import { NotFoundComponent } from './componenti/not-found/not-found.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SnippetComponent,
    DocComponent,
    PageComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    QuillModule.forRoot()
  ],
  providers: [
    provideClientHydration(withEventReplay(),

),
provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
