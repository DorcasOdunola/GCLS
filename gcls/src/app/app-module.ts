import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './material-module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { Login } from './login/login';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [App, SideNavComponent, Login],
  imports: [BrowserModule, AppRoutingModule, MaterialModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
