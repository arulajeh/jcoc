import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NavController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-allmusic',
  templateUrl: './allmusic.page.html',
  styleUrls: ['./allmusic.page.scss'],
})
export class AllmusicPage implements OnInit {

  //trustedVideoUrl: SafeResourceUrl;
  trustedVideoUrl: SafeResourceUrl;

  page_size = '5';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  safeUrl = [];
  listMusics = [];
  resp:any;

  constructor(
    public navCtrl: NavController,
    private domSanitizer: DomSanitizer,
    private api: ApiService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }
  

  async ionViewDidEnter() {
    await this.getDataMusic();
  }

  convertSafeUrl(data){
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

  getDataMusic() {
    console.log('music');
    return this.showLoading().then(() => {
      return this.api.getListData('music/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ')
      .then((result) => {
        this.safeUrl = []
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(result));
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getDataMusic();
        } else {
          this.listMusics = JSON.parse(JSON.stringify(result)).data;
          return this.convertSafeUrl(this.listMusics);
        }
      }).catch(err => {
        this.loadingCtrl.dismiss();
        console.log(err);
      });
    })
  }

  sendIdMusic(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/view-lyric'], navigationExtras);
  }

  async nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      await this.getDataMusic();
    } else {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      await this.getDataMusic();
    }
  }

  async showLoading() {
    const a = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      message: "Getting data..",
      spinner: "dots"
    });

    a.present();
  }

  doRefresh(event) {
    this.getDataMusic()
    .then(() => {
      event.target.complete();
    });
  }

}
