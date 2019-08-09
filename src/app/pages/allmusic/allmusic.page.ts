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

  

  constructor(
    public navCtrl: NavController,
    private domSanitizer: DomSanitizer,
    private api: ApiService
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getDataMusic();
    for (let index of this.music_lists) {
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(index.link);
      this.safeUrl.push({
        url:this.trustedVideoUrl,
        title: index.title,
        artist: index.name
      });
    }
  }

  getDataMusic() {
    this.api.getListData('users').then((result) => {
      console.log(result);
    }).catch(err => {alert('Error Get Data')});
  }
  // ionViewWillEnter(): void {
  //   for(let i of this.music_lists){
  //     this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(i.link);
  //   }
  // } 

}
