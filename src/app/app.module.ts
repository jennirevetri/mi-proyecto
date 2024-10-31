import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';  // Para usar formularios reactivos
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; 

// Componentes
import { LoginComponent } from './login/login.component'; 
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


// Firebase Modules
import { AngularFireModule } from '@angular/fire/compat';  // Para integrar Firebase
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Para autenticación
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage'; 
import { AdminComponent } from './admin/admin.component';  // Tu configuración de Firebase


@NgModule({
  declarations: [
    AppComponent,   // Declara el LoginComponent aquí
    ProfileComponent,
    AdminComponent ,
    
    
     // Declara el ProfileComponent aquí
  ],
  imports: [
    LoginComponent,
    BrowserModule,
    AppRoutingModule,  // Importa el AppRoutingModule para el enrutamiento
    ReactiveFormsModule,
    FormsModule,  // Importa FormsModule para usar ngModel en formularios
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Inicializa Firebase
    AngularFireAuthModule,
    AngularFirestoreModule,  // Módulo de autenticación de Firebase
    AngularFireStorageModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]  // El componente raíz que se carga primero
})
export class AppModule { }

