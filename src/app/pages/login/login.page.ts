import { Component, OnInit } from '@angular/core';
import { ToastController, MenuController, NavController } from '@ionic/angular';
import { ApiService } from "../../services/api.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  resData:any;

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private route: Router,
    private menuCtrl: MenuController,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  submit() {
    this.api.login(this.username, this.password).then((result) => {
      this.resData = JSON.parse(JSON.stringify(result));
      if (this.resData.sukses === true) {
        localStorage.setItem('token', this.resData.token);
        localStorage.setItem('data', JSON.stringify(this.resData.data));
        this.showToast('Login Successfully');
        this.route.navigateByUrl('/home');
      } else {
        this.showToast('Invalid username / password');
      }
    }).catch((err) => {
      this.showToast('Invalid username / password');
    })
  }

  moveReset(){
    this.route.navigateByUrl('/reset-pass');
  }

  async showToast(msg) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: "bottom",
      animated: true
    });
    t.present();
  }

}