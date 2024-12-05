import { Component, OnInit } from '@angular/core';
import { FileService, FileData } from '../file.service';
import { CommonModule } from '@angular/common';
import Quill from 'quill'; // Importa Quill
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.css']
})
export class TerminosComponent implements OnInit {
  wysiwygFiles: FileData[] = []; // Archivos WYSIWYG
  plainText: string[] = []; // Almacena el texto extraído

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.getFilesByType('wysiwyg').subscribe(files => {
      console.log(files); // Asegúrate de que los archivos wysiwyg se están cargando
      this.wysiwygFiles = files;

      // Procesa cada archivo y extrae el texto plano
      this.plainText = this.wysiwygFiles.map(file => this.extractPlainTextWithQuill(file.textContent));
    });
  }

  // Extraer texto plano usando Quill
  private extractPlainTextWithQuill(htmlContent: string | undefined): string {
    if (!htmlContent) {
      return '';
    }

    // Crear una instancia de Quill en modo "sandbox" para procesar el contenido
    const tempDiv = document.createElement('div');
    const quill = new Quill(tempDiv); // Quill necesita un contenedor para inicializar

    quill.clipboard.dangerouslyPasteHTML(htmlContent); // Carga el contenido HTML en Quill
    return quill.getText(); // Obtén el texto plano
  }
}
