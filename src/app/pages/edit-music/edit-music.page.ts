import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, NavController, LoadingController } from '@ionic/angular';

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
    private toastController : ToastController,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  async ionViewDidEnter(){
    await this.getIdMusic();
    await this.getDataMusic();
  }

  backPage(){
    // this.navCtrl.navigateBack('home/add-music');
    this.router.navigateByUrl('/home/add-music');
  }

  getIdMusic(){
    this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    })
  }

  getDataMusic(){
    this.showLoading('Getting data').then(() => {
      return this.api.postData('music/detail', {"id": this.id}).then((result) =>{
        this.loadingCtrl.dismiss();
        return this.dataMusic = JSON.parse(JSON.stringify(result)).data;
      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.notif('Error getting data');
      });
    })
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
      return this.status = JSON.parse(JSON.stringify(result)).sukses;
    });
      if(this.status == true){
        this.notif("Success! Music has been updated.");
        this.backPage();
      }else{
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

  async showLoading(msg) {
    const a = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      keyboardClose: true,
      showBackdrop: true,
      spinner: "dots",
      message: msg
    });

    a.present();
  }

}
