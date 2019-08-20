import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NavigationExtras } from '@angular/router';
import { NavController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-all-schedule',
  templateUrl: './all-schedule.page.html',
  styleUrls: ['./all-schedule.page.scss'],
})
export class AllSchedulePage implements OnInit {

  page_size = '100';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  listSchedule:any;

  constructor(
    private api : ApiService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ionViewDidEnter(){
      this.getDataSchedule()
  }

  getDataSchedule(){
    return this.showLoading('Getting data').then(() => {
      return this.api.getListData('schedule', this.page_size, this.page_number, this.order_by, this.sort_by, this.search)
      .then((result) =>{
        this.loadingCtrl.dismiss();
        this.listSchedule = JSON.parse(JSON.stringify(result)).data;
      });
    });
  }

  sendIdSchedule(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/view-schedule'], navigationExtras);
  }

  ngOnInit() {
  }

  async showToast(msg) {
    const a = await this.toastCtrl.create({
      animated: true,
      duration: 2000,
      keyboardClose: true,
      message: msg,
      position: "bottom"
    });

    a.present();
  }

  async showLoading(msg) {
    const x = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      message: msg,
      showBackdrop: true,
      spinner: "dots",
      keyboardClose: true
    });
    x.present();
  }

}
