import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
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

  page_size = null;
  page_number = null;
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  safeUrl = [];
  listMusics = [];

  constructor(
    public navCtrl: NavController,
    private domSanitizer: DomSanitizer,
    private api: ApiService
  ) { }

  ngOnInit() {
  }
  

  async ionViewDidEnter() {
    await this.getDataMusic();
    this.convertSafeUrl(this.listMusics);
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
    return this.api.getListData('music/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ').then((result) => {
      console.log(result);
      return this.listMusics = JSON.parse(JSON.stringify(result)).data;
    }).catch(err => {console.log(err)});
  }

  async searchData() {
    console.log('value search ',this.search)
    await this.getDataMusic().then((res) => {
      this.safeUrl = [];
      console.log('list music baru', res);
      return this.convertSafeUrl(res)
    });
  }

  sendIdMusic(id){
    //console.log(id);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['view-lyric'], navigationExtras);

  }

  // getMusicList(){
  //   this.api.getListData('music')
  // }

  // ionViewWillEnter(): void {
  //   for(let i of this.music_lists){
  //     this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(i.link);
  //   }
  // } 

  

}
