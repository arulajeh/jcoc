import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  submit() {
    this.api.login(this.username, this.password).then((result) => {
      console.log(result);
    })
    // this.navCtrl.navigateRoot('/home');
  }

}
