import { Component, OnInit } from '@angular/core';
import { FileService, FileData } from '../file.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [CommonModule,HeaderComponent,FooterComponent]
  
})
export class LandingPageComponent implements OnInit {
  images: FileData[] = [];
  videos: FileData[] = [];
  currentIndex: number = 0;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    // Cargar imágenes
    this.fileService.getFilesByType('image').subscribe(files => {
      console.log(files);  // Para asegurarte de que los archivos se están cargando correctamente
      this.images = files;
    });
  
    // Cargar videos
    this.fileService.getFilesByType('video').subscribe(files => {
      console.log(files);  // Para asegurarte de que los archivos de video también se están cargando
      this.videos = files;
    });
  }
  

  // Lógica para el carrusel
  next(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Reinicia el carrusel
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Vuelve al último
    }
  }
}
