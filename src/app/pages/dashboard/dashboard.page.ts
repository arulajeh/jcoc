import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public slideOpts = {
    slidesPerView: 1,
    initialSlide: 0,
    speed: 400,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };

  contentList = [];
  musicList = []
  resp:any;

  page_number = '1';
  search = '';
  safeUrl = [];
  trustedVideoUrl:any;

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  getDataContent() {
    return this.showLoading('Getting data').then(() => {
      return this.api.getListData('content').then((res) => {
        this.loadingCtrl.dismiss();
        const response = JSON.parse(JSON.stringify(res));
        this.contentList = response.data;
        console.log(this.contentList);
      }).catch(() => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting data');
      })
    })
    
  }

  getMusicList() {
    return this.showLoading('Getting music data').then(() => {
      return this.api.getListData('music/all', '5', this.page_number, 'judul', 'ASC', this.search ? this.search : ' ')
      .then((res) => {
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(res));
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getMusicList();
        } else {
          this.musicList = JSON.parse(JSON.stringify(res)).data;
          // return this.listMusic = JSON.parse(JSON.stringify(result)).data;
          return this.convertSafeUrl(this.musicList);
        }
        // console.log(this.musicList);
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting music list');
      })
    })
  }

  async ionViewDidEnter() {
    await this.getDataContent();
    await this.getMusicList();
    console.log(this.musicList);
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

  convertSafeUrl(data){
    this.safeUrl = [];
    for (let index of data) {
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(index.link);
      this.safeUrl.push({
        url:this.trustedVideoUrl,
        title: index.judul,
        artist: index.penyanyi,
        id: index.id
      });
    }
  }

  sendIdMusic(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/view-lyric'], navigationExtras);
  }

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getMusicList();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getMusicList();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getMusicList();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      this.getMusicList();
    }
  }

}
