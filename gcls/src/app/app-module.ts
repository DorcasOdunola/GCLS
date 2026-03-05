import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './material-module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { Login } from './login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Lesson } from './lesson/lesson';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [App, SideNavComponent, Login, Lesson],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
