import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-lyric-chord',
  templateUrl: './lyric-chord.component.html',
  styleUrls: ['./lyric-chord.component.scss'],
})
export class LyricChordComponent implements OnInit {

  public myToggle = false;
  trustedVideoUrl: SafeResourceUrl;
  id;
  data_music:any;
  safeUrl = [];
  constructor(
    public route: ActivatedRoute,
    public domSanitizer: DomSanitizer,
    public api: ApiService
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
  isClicked($event){
    this.myToggle = !this.myToggle;
  }

  ngOnInit() { }
}
