import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './features/auth/auth.module';
// Why important:
// - CoreModule and SharedModule are imported to provide common services and components.
// - AuthModule is imported to handle authentication features across the app.
// - BrowserModule is essential for running the app in a browser.
// - AppRoutingModule manages the routing configuration for the app.
// - BrowserAnimationsModule enables animations in Angular Material components.
// - HttpClientModule allows making HTTP requests to the backend API.
// - CommonModule provides common directives like ngIf and ngFor.
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthModule,
    SharedModule,
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    IonicModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
