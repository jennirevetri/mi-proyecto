import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common'; // Importa CommonModule aquí

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent], // Asegúrate de incluir CommonModule
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'] // Asegúrate de que esto sea 'styleUrls' y no 'styleUrl'
})
export class LandingPageComponent {
  images = [
    { src: 'assets/paisaje1.jpg', alt: 'Paisaje 1' }, // Asegúrate de cambiar el nombre a tus imágenes
    { src: 'assets/paisaje2.jpg', alt: 'Paisaje 2' },
    { src: 'assets/paisaje3.jpg', alt: 'Paisaje 3' },
    { src: 'assets/paisaje4.jpg', alt: 'Paisaje 4' },
    { src: 'assets/paisaje5.jpg', alt: 'Paisaje 5' },
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
