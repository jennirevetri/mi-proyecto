import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule en el componente


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]  // Asegúrate de importar FormsModule aquí
})
export class FileUploadComponent {
  fileType: string = 'audio'; // Esta es la propiedad que falta
  audioFiles: any[] = [];
  imageFiles: any[] = [];
  videoFiles: any[] = [];
  pdfFiles: any[] = [];
  wysiwygText: string = '';

  toggleWysiwygEditor() {
    if (this.fileType === 'wysiwyg') {
      // Logica para mostrar el editor WYSIWYG
    }
  }

  handleFileUpload(event: any) {
    const files = event.target.files;
    if (this.fileType === 'audio') {
      this.handleAudioUpload(files);
    } else if (this.fileType === 'image') {
      this.handleImageUpload(files);
    } else if (this.fileType === 'video') {
      this.handleVideoUpload(files);
    } else if (this.fileType === 'pdf') {
      this.handlePdfUpload(files);
    }
  }

  handleAudioUpload(files: FileList) {
    if (this.audioFiles.length + files.length <= 3) {
      Array.from(files).forEach(file => {
        const audioUrl = URL.createObjectURL(file);
        this.audioFiles.push({ name: file.name, url: audioUrl });
      });
    }
  }

  handleImageUpload(files: FileList) {
    Array.from(files).forEach(file => {
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        this.imageFiles.push({
          name: file.name,
          url: imgUrl,
          width: img.width,
          height: img.height,
          size: file.size
        });
      };
      img.src = imgUrl;
    });
  }

  handleVideoUpload(files: FileList) {
    Array.from(files).forEach(file => {
      const videoUrl = URL.createObjectURL(file);
      this.videoFiles.push({ name: file.name, url: videoUrl });
    });
  }

  handlePdfUpload(files: FileList) {
    Array.from(files).forEach(file => {
      const pdfUrl = URL.createObjectURL(file);
      this.pdfFiles.push({ name: file.name, url: pdfUrl });
    });
  }

  removeFile(file: any, type: string) {
    if (type === 'audio') {
      this.audioFiles = this.audioFiles.filter(f => f !== file);
    } else if (type === 'image') {
      this.imageFiles = this.imageFiles.filter(f => f !== file);
    } else if (type === 'video') {
      this.videoFiles = this.videoFiles.filter(f => f !== file);
    } else if (type === 'pdf') {
      this.pdfFiles = this.pdfFiles.filter(f => f !== file);
    }
  }

  saveFiles() {
    alert('Archivos guardados con éxito.');
  }
}
