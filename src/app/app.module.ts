import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/home/home.component';
import { AboutComponent } from './About/about/about.component';
import { OurWorksComponent } from './Works/our-works/our-works.component';
import { GalleryComponent } from './Gallery/gallery/gallery.component';
import { OurTeamComponent } from './Team/our-team/our-team.component';
import { ContactUsComponent } from './Contact/contact-us/contact-us.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

//firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    OurWorksComponent,
    GalleryComponent,
    OurTeamComponent,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'nameless-admin'),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [  { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
