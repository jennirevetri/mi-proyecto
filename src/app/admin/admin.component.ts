import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  estilosForm: FormGroup;
  nombreArchivoFuentePrincipal: string | null = null; // Para almacenar el nombre del archivo seleccionado
  nombreArchivoFuenteSecundaria: string | null = null; // Para almacenar el nombre del archivo seleccionado

  defaultEstilos = {
    colorFondo: '#ffffff',
    colorTexto: '#000000',
    colorTitulo: '#333333',
    colorSubtitulo: '#555555',
    tamanoTitulo: 2,
    tamanoSubtitulo: 1.5,
    tamanoParrafo: 1,
  };
  
  colorCampos = [
    { label: 'Color de Fondo', nombre: 'colorFondo' },
    { label: 'Color de Texto', nombre: 'colorTexto' },
    { label: 'Color de Título', nombre: 'colorTitulo' },
    { label: 'Color de Subtítulo', nombre: 'colorSubtitulo' },
  ];

  tamanoCampos = [
    { label: 'Tamaño Títulos', nombre: 'tamanoTitulo' },
    { label: 'Tamaño Subtítulos', nombre: 'tamanoSubtitulo' },
    { label: 'Tamaño Párrafos', nombre: 'tamanoParrafo' },
  ];

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.estilosForm = this.fb.group(this.defaultEstilos);
  }

  ngOnInit(): void {
    this.cargarEstilos();

    // Suscribirse a los cambios del formulario para aplicar estilos en tiempo real
    this.estilosForm.valueChanges.subscribe((valores) => {
      this.aplicarEstilos(valores);
    });
  }

  cargarEstilos(): void {
    this.firestore
      .collection('configuracion')
      .doc('estilos')
      .valueChanges()
      .subscribe((data: any) => {
        if (data) {
          this.estilosForm.patchValue(data);
          this.aplicarEstilos(data);
        } else {
          this.estilosForm.patchValue(this.defaultEstilos);
          this.aplicarEstilos(this.defaultEstilos);
        }
      });
  }

  guardarEstilos(): void {
    const valoresEstilos = this.estilosForm.value;

    this.firestore
      .collection('configuracion')
      .doc('estilos')
      .set(valoresEstilos)
      .then(() => {
        console.log("Estilos guardados exitosamente.");
      })
      .catch((error) => console.error("Error al guardar estilos: ", error));
  }

  aplicarEstilos(estilos: any): void {
    document.documentElement.style.setProperty('--color-fondo', estilos.colorFondo);
    document.documentElement.style.setProperty('--color-texto', estilos.colorTexto);
    document.documentElement.style.setProperty('--color-titulo', estilos.colorTitulo);
    document.documentElement.style.setProperty('--color-subtitulo', estilos.colorSubtitulo);
    document.documentElement.style.setProperty('--tamano-titulo', estilos.tamanoTitulo + 'em');
    document.documentElement.style.setProperty('--tamano-subtitulo', estilos.tamanoSubtitulo + 'em');
    document.documentElement.style.setProperty('--tamano-parrafo', estilos.tamanoParrafo + 'em');

    // Aplicar el color de fondo al documento
    document.body.style.backgroundColor = estilos.colorFondo;
    // Aplicar el color de texto al cuerpo
    document.body.style.color = estilos.colorTexto;
  }

  restablecerPredeterminado(): void {
    this.estilosForm.patchValue(this.defaultEstilos);
    this.guardarEstilos();
  }

  cargarArchivo(event: Event, campo: string): void {
    const archivo = (event.target as HTMLInputElement).files![0];
    if (archivo) {
      const filePath = `fuentes/${campo}/${archivo.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, archivo).then(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          document.documentElement.style.setProperty(`--${campo}`, `url(${url})`);
        });
      });

      // Actualizar el nombre del archivo para mostrarlo
      if (campo === 'fuentePrincipal') {
        this.nombreArchivoFuentePrincipal = archivo.name;
      } else if (campo === 'fuenteSecundaria') {
        this.nombreArchivoFuenteSecundaria = archivo.name;
      }
    }
  }
}
