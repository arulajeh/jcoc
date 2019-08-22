import { Component } from '@angular/core';

import { Platform, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  hasLogin = localStorage.getItem('token') ? true : false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
      this.checkLogin();
      this.backButton();
    });
  }

  checkLogin() {
    localStorage.getItem('token') ? {} : this.navCtrl.navigateRoot('login');
  }

  backButton() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (localStorage.getItem('token')) {
        if (this.router.url === '/home/dashboard' || this.router.url === '/login') {
          this.exitNotif();
        } else {
          this.navCtrl.back();
        }
      } else {
        this.exitNotif();
      }
    });
  }

  async exitNotif() {
    const x = await this.alertCtrl.create({
      animated: true,
      backdropDismiss: true,
      keyboardClose: true,
      header: 'Exit App',
      message: 'Are you sure ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            navigator['app'].exitApp();
          },
          cssClass: 'exitYes'
        },
        {
          text: 'No',
          handler: () => {
            this.alertCtrl.dismiss();
          },
          cssClass: 'exitNo'
        }
      ]
    });

    x.present();
  }
}
