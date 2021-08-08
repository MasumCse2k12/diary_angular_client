import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpHeaders
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Modules
import { AppRoutingModule } from './app-routing.module';
import { MaterialDesignModule } from './material-module';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Componenets
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';


// Auth Guard
import { AuthGuard } from './auth.guard';

// Services
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';


const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE, PATCH",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    "Access-Control-Max-Age" : "3600",
    "Access-Control-Expose-Headers": "Location",
  })
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotfoundComponent,
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    BrowserAnimationsModule
],
providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true,
    },
    AuthService,
    AuthGuard
],
bootstrap: [AppComponent],
})
export class AppModule { }
