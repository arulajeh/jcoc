import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

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

  

  constructor(public navCtrl: NavController,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    for (let index of this.music_lists) {
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(index.link);
      this.safeUrl.push({
        url:this.trustedVideoUrl,
        title: index.title,
        artist: index.name
      });
    }
  }
  // ionViewWillEnter(): void {
  //   for(let i of this.music_lists){
  //     this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(i.link);
  //   }
  // } 

}
