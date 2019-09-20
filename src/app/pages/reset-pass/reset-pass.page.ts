import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  username = '';
  status : any;

  constructor(
    private api: ApiService,
    private route: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async submit(){
    // console.log(this.username);
    if(this.username === ""){
      this.notif("Please enter your Username!");
    }else{
      await this.api.postData('resetpassword', {"username": this.username}).then((result) => {
        return this.status = JSON.parse(JSON.stringify(result)).sukses;
      });
      if(this.status == true){
        //alert('SUCCESS');
        this.notif("Success! Please check your email!");
        this.route.navigateByUrl('/login');
      }else{
        // alert('FAILED!');
        this.notif("Failed!");
      }
    }
  }

  async notif(ms){
    const toast = await this.toastController.create({
      message: ms,
      duration: 2000
    });
    toast.present();
  }

}
