import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-music',
  templateUrl: './edit-music.page.html',
  styleUrls: ['./edit-music.page.scss'],
})
export class EditMusicPage implements OnInit {

  dataMusic = {
    judul: '',
    penyanyi: '',
    lirik: '',
    chord: '',
    link: ''
  }

  id;
  data_music:any;
  status:any;

  constructor(
    private route : ActivatedRoute,
    private api : ApiService,
    private toastController : ToastController
  ) { }

  async ionViewDidEnter(){
    await this.getIdMusic();
    await this.getDataMusic();
    console.log(this.id);
    // console.log('data music ' + this.data_music);
  }

  // initData(){
  //   this.getIdMusic();
  //   this.getDataMusic();
  // }

  getIdMusic(){
    this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    })
    console.log(this.id);
  }

  getDataMusic(){
    console.log(this.id);
    return this.api.postData('music/detail', {"id": this.id}).then((result) =>{
      console.log('result ' + result);
      return this.dataMusic = JSON.parse(JSON.stringify(result)).data;
    }).catch(err => {alert('Error Get Data!')});
  }

  async submit(){
    if(this.dataMusic.judul === ""){
      this.notif("You haven't enter the Music Title");
    }else if(this.dataMusic.penyanyi === ""){
      this.notif("You haven't enter the Artist Name");
    }else if(this.dataMusic.lirik === ""){
      this.notif("You haven't enter the Music Lyrics");
    }else if(this.dataMusic.chord === ""){
      this.notif("You haven't enter the Music Chord");
    }else if(this.dataMusic.link === ""){
      this.notif("You haven't enter the Music Link/URL");
    }else{
      await this.api.postData('music/update', this.dataMusic).then((result) =>{
      console.log(JSON.stringify(result));
      return this.status = JSON.parse(JSON.stringify(result)).sukses;
    });
      console.log(this.dataMusic);
      console.log(this.status);
      if(this.status == true){
        //alert('SUCCESS');
        this.notif("Success! Music has been updated.");
      }else{
        // alert('FAILED!');
        this.notif("Failed!");
      }
    }
  }

  async notif(ms){
    const toast = await this.toastController.create({
      message: ms,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

}
