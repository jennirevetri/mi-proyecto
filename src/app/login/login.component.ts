import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // Campo para confirmar la contraseña
  isLoginMode: boolean = true; // Cambia entre Login y Registro
  message: string = ''; // Mensaje para el usuario
  adminUid: string = 'AC7KSssMRtY8W2Ts18yap7uQFpV2'; // UID del administrador

  constructor(private auth: AngularFireAuth, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = ''; // Limpiar mensaje al cambiar modo
    this.clearFields(); // Limpiar los campos de entrada
  }

  clearFields() {
    this.email = '';
    this.password = '';
    this.confirmPassword = ''; // Limpiar también el campo de confirmación
  }

  submit() {
    if (this.isLoginMode) {
      this.login();
    } else {
      this.register();
    }
  }

  login() {
    if (!this.email || !this.password) {
      console.error('Email y contraseña son requeridos');
      return;
    }

    if (this.password.length < 6) {
      console.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(async () => {
        console.log('Login exitoso');
        this.clearFields(); // Limpiar campos después de iniciar sesión

        // Verificar si el usuario es admin
        const user = await this.auth.currentUser;
        if (user && user.uid === this.adminUid) {
          this.router.navigate(['/admin']); // Redirigir a configuración si es admin
        } else {
          this.router.navigate(['/profile']); // Redirigir a perfil si no es admin
        }
      })
      .catch((error) => {
        console.error('Error en login:', error.message);
        this.message = 'Error en login: ' + error.message;
      });
  }

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      console.error('Email, contraseña y confirmación son requeridos');
      return;
    }

    if (this.password.length < 6) {
      console.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden.');
      this.message = 'Las contraseñas no coinciden.';
      return;
    }

    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async () => {
        console.log('Registro exitoso');
        this.clearFields(); // Limpiar campos después de registrarse

        // Verificar si el usuario es admin
        const user = await this.auth.currentUser;
        if (user && user.uid === this.adminUid) {
          this.router.navigate(['/admin']); // Redirigir a configuración si es admin
        } else {
          this.router.navigate(['/profile']); // Redirigir a perfil si no es admin
        }
      })
      .catch((error) => {
        console.error('Error en registro:', error.message);
        this.message = 'Error en registro: ' + error.message;
      });
  }
}
