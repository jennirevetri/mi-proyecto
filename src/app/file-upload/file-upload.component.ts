import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

interface FileData {
  fileName: string;
  fileUrl: string;
  fileType: string;
  audioType?: string;
  textContent?: string; 
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule]
})
export class FileUploadComponent implements OnInit {
  fileType: string = 'audio';
  audioType: string = 'transition1';
  editorContent: string = '';
  wysiwygText: string = '';
  audioFiles: { [key: string]: FileData[] } = { transition1: [], transition2: [], transition3: [] };
  imageFiles: FileData[] = [];
  videoFiles: FileData[] = [];
  uploadSuccess: boolean = false;
  pdfFiles: FileData[] = [];
  subtitleFiles: FileData[] = [];
  allFiles: FileData[] = [];
  
  editorConfig = {
    theme: 'snow',
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.loadFilesFromFirestore();
    this.loadWysiwygContent();
  }

  loadWysiwygContent() {
    this.firestore.collection('files', ref => ref.where('fileType', '==', 'wysiwyg').limit(1))
      .get()
      .subscribe(snapshot => {
        if (!snapshot.empty) {
          const fileData = snapshot.docs[0].data() as FileData;
          this.editorContent = fileData.textContent || '';
          this.wysiwygText = fileData.textContent || '';
        }
      });
  }

  saveFiles() {
    if (this.fileType === 'wysiwyg') {
      const fileData: FileData = {
        fileName: 'terms_and_conditions.html',
        fileUrl: '',
        fileType: 'wysiwyg',
        textContent: this.editorContent
      };

      this.firestore.collection('files').add(fileData).then(() => {
        this.uploadSuccess = true;
        this.wysiwygText = this.editorContent;
        setTimeout(() => this.uploadSuccess = false, 3000);
      });
    } else {
      // Implementa la lógica de guardar otros tipos de archivos aquí
      console.log('Guardando otros tipos de archivos...');
    }
  }

  loadFilesFromFirestore() {
    this.firestore.collection('files').snapshotChanges().subscribe(snapshot => {
      snapshot.forEach(doc => {
        const fileData = doc.payload.doc.data() as FileData;
        if (fileData.fileType === 'audio' && !this.audioFiles[fileData.audioType || 'transition1'].some(file => file.fileName === fileData.fileName)) {
          this.audioFiles[fileData.audioType || 'transition1'].push(fileData);
        } else if (fileData.fileType === 'image' && !this.imageFiles.some(file => file.fileName === fileData.fileName)) {
          this.imageFiles.push(fileData);
        } else if (fileData.fileType === 'video' && !this.videoFiles.some(file => file.fileName === fileData.fileName)) {
          this.videoFiles.push(fileData);
        } else if (fileData.fileType === 'pdf' && !this.pdfFiles.some(file => file.fileName === fileData.fileName)) {
          this.pdfFiles.push(fileData);
        } else if (fileData.fileType === 'subtitles' && !this.subtitleFiles.some(file => file.fileName === fileData.fileName)) {
          this.subtitleFiles.push(fileData);
        } else if (fileData.fileType === 'wysiwyg' && !this.allFiles.some(file => file.fileName === fileData.fileName)) {
          this.allFiles.push(fileData);
        }
      });
    });
  }

  handleFileUpload(event: any) {
  const file = event.target.files[0];
  const fileType = this.fileType;

  if (file) {
    // Validations for audio files
    if (fileType === 'audio') {
      const requiredAudioTypes = ['transition1', 'transition2', 'transition3'];
      const missingTypes = requiredAudioTypes.filter(type => this.audioFiles[type].length === 0);
      
      

      if (this.audioFiles[this.audioType].length > 0) {
        alert(`You must delete the existing audio file for ${this.audioType} before uploading a new one.`);
        return;
      }
    }

    // Validations for subtitle files
    if (fileType === 'subtitles' && this.subtitleFiles.length > 0) {
      alert('You must delete the existing subtitle file before uploading a new one.');
      return;
    }

    // Validations for video files
    if (fileType === 'video' && this.videoFiles.length > 0) {
      alert('You must delete the existing video file before uploading a new one.');
      return;
    }

    // Validations for PDF files
    if (fileType === 'pdf' && this.pdfFiles.length > 0) {
      alert('You must delete the existing PDF file before uploading a new one.');
      return;
    }

    // Validations for WYSIWYG content
    if (fileType === 'wysiwyg' && this.allFiles.some(f => f.fileType === 'wysiwyg')) {
      alert('You must delete the existing WYSIWYG content before uploading a new one.');
      return;
    }

    // Validations for image files
    if (fileType === 'image') {
      if (this.imageFiles.length === 0) {
        alert('You must upload at least one image.');
      } else if (this.imageFiles.length >= 3) {
        alert('You can upload a maximum of 3 images. Please delete an existing image before uploading a new one.');
        return;
      }
    }

    const filePath = `${fileType}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.saveFileData(file, fileType, url);
          this.uploadSuccess = true;
          setTimeout(() => this.uploadSuccess = false, 3000);
        });
      })
    ).subscribe();
  }
}

  saveFileData(file: any, fileType: string, fileUrl: string) {
    const fileData: FileData = {
      fileName: file.name,
      fileUrl: fileUrl,
      fileType: fileType
    };

    if (fileType === 'audio' && !this.audioFiles[this.audioType].some(f => f.fileName === fileData.fileName)) {
      this.audioFiles[this.audioType].push(fileData);
    } else if (fileType === 'image' && !this.imageFiles.some(f => f.fileName === fileData.fileName)) {
      this.imageFiles.push(fileData);
    } else if (fileType === 'video' && !this.videoFiles.some(f => f.fileName === fileData.fileName)) {
      this.videoFiles.push(fileData);
    } else if (fileType === 'pdf' && !this.pdfFiles.some(f => f.fileName === fileData.fileName)) {
      this.pdfFiles.push(fileData);
    } else if (fileType === 'subtitles' && !this.subtitleFiles.some(f => f.fileName === fileData.fileName)) {
      this.subtitleFiles.push(fileData);
    } else if (fileType === 'wysiwyg' && !this.allFiles.some(f => f.fileName === fileData.fileName)) {
      this.allFiles.push(fileData);
    }

    this.firestore.collection('files').add(fileData);
  }

  removeFile(file: FileData, fileType: string, audioType?: string) {
    if (fileType === 'wysiwyg') {
      // For WYSIWYG, we'll clear the content and remove it from Firestore
      
      this.wysiwygText = '';
      this.firestore.collection('files').ref.where('fileType', '==', 'wysiwyg').get().then(snapshot => {
        snapshot.forEach(doc => doc.ref.delete());
      });
    } else {
      const fileRef = this.storage.refFromURL(file.fileUrl);
      fileRef.delete().subscribe(() => {
        this.firestore.collection('files').ref.where('fileName', '==', file.fileName).get().then(snapshot => {
          snapshot.forEach(doc => doc.ref.delete());
        });
  
        if (fileType === 'audio' && audioType) {
          this.audioFiles[audioType] = this.audioFiles[audioType].filter(f => f.fileName !== file.fileName);
        } else if (fileType === 'image') {
          this.imageFiles = this.imageFiles.filter(f => f.fileName !== file.fileName);
        } else if (fileType === 'video') {
          this.videoFiles = this.videoFiles.filter(f => f.fileName !== file.fileName);
        } else if (fileType === 'pdf') {
          this.pdfFiles = this.pdfFiles.filter(f => f.fileName !== file.fileName);
        } else if (fileType === 'subtitles') {
          this.subtitleFiles = this.subtitleFiles.filter(f => f.fileName !== file.fileName);
        }
      });
    }
  }

  updateFileType(event: any) {
    this.fileType = event.target.value;
  }
}