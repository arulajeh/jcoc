import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-allmusic',
  templateUrl: './allmusic.page.html',
  styleUrls: ['./allmusic.page.scss'],
})
export class AllmusicPage implements OnInit {

  //trustedVideoUrl: SafeResourceUrl;
  trustedVideoUrl: SafeResourceUrl;
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
        artist: index.penyanyi
      });
    }
  }

  getDataMusic() {
    return this.api.getListData('music').then((result) => {
      console.log(result);
      return this.listMusics = JSON.parse(JSON.stringify(result)).data;
      // console.log(this.listMusics)
    }).catch(err => {alert('Error Get Data')});
  }
  // ionViewWillEnter(): void {
  //   for(let i of this.music_lists){
  //     this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(i.link);
  //   }
  // } 

}
