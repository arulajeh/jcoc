import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-add-music',
  templateUrl: './add-music.page.html',
  styleUrls: ['./add-music.page.scss'],
})
export class AddMusicPage implements OnInit {

  dataMusic = {
    judul: '',
    penyanyi: '',
    lirik: '',
    chord: '',
    link: ''
  }

  page_size = null;
  page_number = null;
  order_by = 'id';
  sort_by = 'ASC';
  search = '';

  ionSelect = null;

  listMusic = [];

  status : any;

  id;

  constructor(
    private api: ApiService,
    public toastController: ToastController,
    public navCtrl : NavController
  ) { }

  async ionViewDidEnter(){
    await this.initData();
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
      await this.api.postData('music/create', this.dataMusic).then((result) => {
        console.log(result);
        return this.status = JSON.parse(JSON.stringify(result)).sukses;
      });
      console.log(this.dataMusic);
      console.log(this.status);
      if(this.status == true){
        //alert('SUCCESS');
        this.notif("Success! Music has been udded.");
        this.dataMusic.judul = "";
        this.dataMusic.penyanyi = "";
        this.dataMusic.lirik = "";
        this.dataMusic.chord = "";
        this.dataMusic.link = "";
      }else{
        // alert('FAILED!');
        this.notif("Failed!");
      }
    }
    
  }

  initData(){
    this.getMusicList();
  }

  getMusicList(){
    console.log('music list');
    return this.api.getListData('music', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ').then((result) => {
      console.log(result);
      return this.listMusic = JSON.parse(JSON.stringify(result)).data;
    }).catch(err => {alert('Error Get Data')});
  }

  async searchData(){
    console.log('value search',this.search);
    await this.getMusicList().then((res) => {
      this.listMusic = [];
      console.log('list music baru', res);
    })
  }

  changeSelect(){
    console.log(this.ionSelect);
  }

  sendIdMusic(id){
    console.log(id);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/edit-music'], navigationExtras);
  }

  deleteMusic(id){
    return this.api.postData('music/delete', {"id": id}).then(async (result) => {
      // console.log('result' + result);
      const toast = await this.toastController.create({
        message: 'Success! Music has been deleted.',
        duration: 2000
      });
      toast.present();
      this.getMusicList();
    }).catch(async err => {
      const toast = await this.toastController.create({
        message: 'Failed!',
        duration: 2000
      });
      toast.present();
    });
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
