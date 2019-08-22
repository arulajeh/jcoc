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
    const x = this.api.parseEmbedUrl(this.data_music.link);
    this.data_music.link = this.domSanitizer.bypassSecurityTrustResourceUrl(x);
  }

  getDataMusic(){
    return this.api.postData('music/detail', {"id": this.id}).then((result) =>{
       return this.data_music = JSON.parse(JSON.stringify(result)).data;
    }).catch(err => {alert('Error Get Data!')});
  }

  getIdMusic(){
    this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    })
  }

  ngOnInit() {
  }

}
