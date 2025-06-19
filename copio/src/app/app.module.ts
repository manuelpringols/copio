import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componenti/home/home.component';
import { SnippetComponent } from './componenti/snippet/snippet.component';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import {
  provideHttpClient,
  HTTP_INTERCEPTORS,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { DocComponent } from './componenti/doc/doc.component';
import { PageComponent } from './componenti/doc/page/page.component';
import { QuillModule } from 'ngx-quill';
import { LoginComponent } from './componenti/login/login.component';
import { RegisterComponent } from './componenti/register/register.component';
import { NotFoundComponent } from './componenti/not-found/not-found.component';
import { tokenInterceptor } from './token.interceptor';
import { UserComponent } from './componenti/user/user.component';

import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SnippetComponent,
    DocComponent,
    PageComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    QuillModule.forRoot(),
    MarkdownModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    provideClientHydration(withEventReplay()),

    provideHttpClient(withInterceptors([tokenInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
