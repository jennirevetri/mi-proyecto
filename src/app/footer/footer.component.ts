import { Component, OnInit } from '@angular/core';
import { FileService, FileData } from '../file.service'; 
import { TangramComponent } from '../tangram/tangram.component'; // Importa el servicio
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [TangramComponent, CommonModule]
})
export class FooterComponent implements OnInit {
  pdfFiles: FileData[] = [];

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.getFilesByType('pdf').subscribe(files => {
      console.log(files);  // Para asegurarte de que los archivos pdf también se están cargando
      this.pdfFiles = files;
    });
  }


}
