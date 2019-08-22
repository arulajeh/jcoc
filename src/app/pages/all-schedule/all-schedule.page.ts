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
  imgNotFound = 'assets/img/image.png';
  page_size = '100';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  listSchedule:any;

  resp:any;

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
      return this.api.getListData('schedule/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search)
      .then((result) =>{
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(result));
        this.listSchedule = JSON.parse(JSON.stringify(result)).data;
      }).then(() => {
        this.getImages();
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting data');
      })
    });
  }

  sendIdSchedule(id){
    console.log('id schedule', id);
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

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getDataSchedule();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getDataSchedule();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getDataSchedule();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      this.getDataSchedule();
    }
  }

  getImages() {
    Promise.all(
      this.listSchedule.map( async (val) => {
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          const x = JSON.parse(JSON.stringify(res)).data;
          await this.listSchedule.forEach((value) => {
            if (x.id === value.file_id) {
              value.file = x.file
            }
          });
        });
      })
    );
  }

}
