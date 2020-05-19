import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
declare var google;
@Component({
  selector: 'app-geolocation',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  userEmail: string;
  latitude: any;
  longitude: any;
  @ViewChild('mapElement', { static: true }) mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  constructor(private fb: FormBuilder, private geolocation: Geolocation,private navCtrl: NavController,private authService: AuthenticateService) {
    this.createDirectionForm();
  }

  ngOnInit() {
    
    if(this.authService.userDetails()){
      this.userEmail = this.authService.userDetails().email;
    }else{
      this.navCtrl.navigateBack('');
    }
  }

  logout(){
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    })
  }


  createDirectionForm() {
    this.directionForm = this.fb.group({
      destination: ['', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
      });

      this.directionsDisplay.setMap(map);
      const icon = {
        url: 'assets/icon/1.png',
        scaledSize: new google.maps.Size(35, 50),
      };

      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };

      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Sunteti aici!',
        icon: icon
      });

      map.setCenter(pos);
    })
}
  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route({
      origin: { lat: this.latitude, lng: this.longitude },
      destination: formValues.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Eroare ' + status);
      }
    });
  }
}