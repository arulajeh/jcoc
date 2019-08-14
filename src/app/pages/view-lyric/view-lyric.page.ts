import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-lyric',
  templateUrl: './view-lyric.page.html',
  styleUrls: ['./view-lyric.page.scss'],
})
export class ViewLyricPage implements OnInit {

  trustedVideoUrl: SafeResourceUrl;
  id;
  data_music:any;
  safeUrl = [];
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private domSanitizer: DomSanitizer
  ) { }

  async ionViewDidEnter(){
    await this.getIdMusic();
    await this.getDataMusic();
    this.data_music.link = this.domSanitizer.bypassSecurityTrustResourceUrl(this.data_music.link);
    // this.safeUrl.push({
    //   url: this.trustedVideoUrl,
    //   title: this.data_music.judul,
    //   artis: this.data_music.penyanyi,
    //   lyrics: this.data_music.lirik,
    //   chord: this.data_music.chord
    // });

    console.log('data music ' + this.data_music);
  }

  getDataMusic(){
    return this.api.postData('music/detail', {"id": this.id}).then((result) =>{
      console.log('result ' + result);
       return this.data_music = JSON.parse(JSON.stringify(result)).data;
      //console.log('data music ' + this.data_music)
    }).catch(err => {alert('Error Get Data!')});
  }

  getIdMusic(){
    this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    })
    console.log(this.id);
  }

  ngOnInit() {
  }

}
