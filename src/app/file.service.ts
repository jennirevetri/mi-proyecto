import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface FileData {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private firestore: AngularFirestore) {}

  // Devuelve un observable con todos los archivos
  getAllFiles(): Observable<FileData[]> {
    return this.firestore.collection<FileData>('files').valueChanges();
  }

  // Devuelve un observable con los archivos filtrados por tipo
  getFilesByType(fileType: string): Observable<FileData[]> {
    return this.firestore
      .collection<FileData>('files', ref => ref.where('fileType', '==', fileType))
      .valueChanges();
  }
}
