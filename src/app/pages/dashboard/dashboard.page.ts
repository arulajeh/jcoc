import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController, NavController, IonSlides } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  imgNotFound = 'assets/img/image.png';

  @ViewChild("mySlider", {read: IonSlides, static: false}) slides: IonSlides;
  // @ViewChild

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
  respContent:any;

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
      return this.api.getListData('content', '5', '1', 'id', 'ASC', ' ').then((res) => {
        this.loadingCtrl.dismiss();
        this.respContent = JSON.parse(JSON.stringify(res));
        this.contentList = this.respContent.data;
      }).catch(() => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting data');
      })
    })
    
  }

  getMusicList() {
    return this.showLoading('Getting music data').then(() => {
      return this.api.getListData('music/all', '8', this.page_number, 'judul', 'ASC', this.search ? this.search : ' ')
      .then((res) => {
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(res));
        console.log(this.resp);
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getMusicList();
        } else {
          this.musicList = JSON.parse(JSON.stringify(res)).data;
          // return this.listMusic = JSON.parse(JSON.stringify(result)).data;
          return this.convertSafeUrl(this.musicList);
        }
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting music list');
      })
    })
  }

  async ionViewDidEnter() {
    await this.getDataContent();
    await this.getMusicList();
    this.getImages();
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
      const x = this.api.parseEmbedUrl(index.link);
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(x);
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

  ionSlidesDidLoad(){
    this.slides.startAutoplay();
  }

  getImages() {
    Promise.all(
      this.contentList.map( async (val) => {
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          const x = JSON.parse(JSON.stringify(res)).data;
          await this.contentList.forEach((value) => {
            if (x.id === value.file_id) {
              value.file = x.file
            }
          });
        });
      })
    );
  }

}
