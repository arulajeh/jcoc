import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { 
    // this.logout();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    console.log('logout');
    this.logout();
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot('login');
  }

}
