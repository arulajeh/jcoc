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

  // ionViewWillEnter(): void {
  //   for(let i of this.music_lists){
  //     this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(i.link);
  //   }
  // } 

}
