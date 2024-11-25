import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as L from 'leaflet'; 


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  profileData: any = {
    gender: '',
    firstName: '',
    lastName: '',
    streetNumber: '',
    streetName: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    latitude: '',
    longitude: '',
    timezoneOffset: '',
    timezoneDescription: '',
    email: '',
    phone: '',
    cell: '',
    username: '',
    dob: '',
    age: '',
    nat: '',
    picture: '',
    registrationDate: '' // Campo para la fecha de registro
  };

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadProfileData();
      } else {
        this.router.navigate(['/login']);
      }
    });

    this.initializeMap();
  }

  async loadProfileData() {
    const profileRef = this.firestore.collection('users').doc(this.user.uid);
    const doc = await profileRef.get().toPromise();
  
    // Comprobar si doc existe y tiene datos
    if (doc && doc.exists) {
      this.profileData = doc.data() || {}; // Asegúrate de que no sea null
    } else {
      // Asigna valores predeterminados si el perfil no existe
      this.profileData.email = this.user.email;
      this.profileData.registrationDate = new Date().toISOString().split('T')[0]; // Fecha actual
    }
  }
  

  async saveProfileData() {
    const profileRef = this.firestore.collection('users').doc(this.user.uid);
    await profileRef.set(this.profileData);
    alert('Profile updated successfully!');
  }

  onDobChange(event: any) {
    const dob = new Date(event.target.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    // Verificar si ya ha pasado el cumpleaños este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      this.profileData.age = age - 1;
    } else {
      this.profileData.age = age;
    }
  }

  initializeMap() {
    const map = L.map('map').setView([37.0902, -95.7129], 4); // Centrar en Estados Unidos

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    // Configuración del icono del marcador
    const markerIcon = L.icon({
        iconUrl: 'assets/ubi.png', // Cambia esto a la URL de tu imagen
        iconSize: [25, 41], // Ajusta el tamaño del icono según necesites
        iconAnchor: [12, 41], // La parte del icono que se ancla al marcador
        popupAnchor: [1, -34], // Ajusta esto si usas ventanas emergentes
    });

    // Crear el marcador con el icono personalizado
    const marker = L.marker([37.0902, -95.7129], {
        icon: markerIcon,
        draggable: true
    }).addTo(map);

    marker.on('dragend', (e) => {
        const lat = e.target.getLatLng().lat;
        const lng = e.target.getLatLng().lng;
        this.profileData.latitude = lat.toFixed(4);
        this.profileData.longitude = lng.toFixed(4);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
                const address = data.address;
                this.profileData.streetNumber = address.house_number || '';
                this.profileData.streetName = address.road || '';
                this.profileData.city = address.city || address.town || address.village || '';
                this.profileData.state = address.state || '';
                this.profileData.country = address.country || '';
                this.profileData.postcode = address.postcode || '';
            })
            .catch(error => console.error('Error:', error));

        // Fetch timezone info using TimezoneDB API
        fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${lat}&lng=${lng}`)
            .then(response => response.json())
            .then(data => {
                this.profileData.timezoneOffset = (data.gmtOffset / 3600).toFixed(2); // Convert from seconds to hours
                this.profileData.timezoneDescription = data.zoneName;
            })
            .catch(error => console.error('Error:', error));
    });
}}

