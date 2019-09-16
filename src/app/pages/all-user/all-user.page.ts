import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.page.html',
  styleUrls: ['./all-user.page.scss'],
})
export class AllUserPage implements OnInit {
  imgNotFound = 'assets/img/image.png';
  page_size = '5';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  listMembers: any;

  resp: any;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getMemberList();
  }

  initData() {

  }

  getMemberList() {
    this.showLoading('Getting user data').then(() => {
      this.api.getListData('users/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ')
      .then((res) => {
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(res));
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getMemberList();
        } else {
          return this.listMembers = JSON.parse(JSON.stringify(res)).data;
        }
      }).then(() => {
        this.getImages();
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error Getting Data');
      })
    })
  }

  async showLoading(msg) {
    const x = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      keyboardClose: true,
      showBackdrop: true,
      message: msg,
      spinner: "dots"
    });

    x.present();
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

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getMemberList();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getMemberList();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getMemberList();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      this.getMemberList();
    }
  }

  getImages() {
    Promise.all(
      this.listMembers.map( async (val) => {
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          const x = JSON.parse(JSON.stringify(res)).data;
          await this.listMembers.forEach((value) => {
            if (x.id === value.file_id) {
              value.file = x.file
            }
          });
        });
      })
    );
  }

  detail(id){
    console.log(id);
    const extras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };

    this.navCtrl.navigateForward('member-detail', extras);
  }

}
