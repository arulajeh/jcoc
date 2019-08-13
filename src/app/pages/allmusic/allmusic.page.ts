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
  
  music_lists =[
    {
      "name" : "Skip The Use",
      "title" : "Nameless World",
      "link" : "https://www.youtube.com/embed/OHXf7wEpBPI"
    },
    {
      "name" : "Skip The Use",
      "title" : "Nameless World",
      "link" : "https://www.youtube.com/embed/OHXf7wEpBPI"
    },
    {
      "name" : "Skip The Use",
      "title" : "Nameless World",
      "link" : "https://www.youtube.com/embed/OHXf7wEpBPI"
    },
    {
      "name" : "Skip The Use",
      "title" : "Nameless World",
      "link" : "https://www.youtube.com/embed/OHXf7wEpBPI"
    },
    {
      "name" : "Skip The Use",
      "title" : "Nameless World",
      "link" : "https://www.youtube.com/embed/OHXf7wEpBPI"
    },
    {
      "name" : "Skip The Use",
      "title" : "Nameless World",
      "link" : "https://www.youtube.com/embed/OHXf7wEpBPI"
    },
    {
      "name" : "Skip The Use",
      "title" : "Nameless World",
      "link" : "https://www.youtube.com/embed/OHXf7wEpBPI"
    },
  ]
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
    for (let index of this.listMusics) {
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(index.link);
      this.safeUrl.push({
        url:this.trustedVideoUrl,
        title: index.judul,
        artist: index.penyanyi,
        id: index.id
      });
      //console.log(this.safeUrl);
    }
  }

  getDataMusic() {
    console.log('music');
    return this.api.getListData('music/all', this.page_size, this.page_number, this.order_by, this.sort_by, this.search).then((result) => {
      console.log(result);
      return this.listMusics = JSON.parse(JSON.stringify(result)).data;
      // console.log(this.listMusics)
    }).catch(err => {alert('Error Get Data')});
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
