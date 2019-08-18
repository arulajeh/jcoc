import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, NavController, LoadingController } from '@ionic/angular';
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

  page_size = '5';
  page_number = '1';
  order_by = 'judul';
  sort_by = 'ASC';
  search = '';

  ionSelect = null;

  listMusic = [];

  status : any;

  id;
  resp:any;

  constructor(
    private api: ApiService,
    public toastController: ToastController,
    public navCtrl : NavController,
    private loadingCtrl: LoadingController
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
        return this.status = JSON.parse(JSON.stringify(result)).sukses;
      });
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
    return this.showLoading('Getting data').then(() => {
      return this.api.getListData('music', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ')
      .then((result) => {
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(result));
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getMusicList();
        } else {
          return this.listMusic = JSON.parse(JSON.stringify(result)).data;
        }
      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.notif("Error Getting Data");
      });
    });
  }

  sendIdMusic(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    };
    this.navCtrl.navigateForward(['/edit-music'], navigationExtras);
  }

  deleteMusic(id){
    return this.showLoading('Deleting music').then(() => {
      return this.api.postData('music/delete', {"id": id}).then(async (result) => {
        this.loadingCtrl.dismiss();
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
    })
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

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getMusicList();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getMusicList();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getMusicList();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      this.getMusicList();
    }
  }

  async showLoading(msg) {
    const a = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      message: msg,
      spinner: "dots"
    });

    a.present();
  }

  doRefresh(event) {
    this.getMusicList()
    .then(() => {
      event.target.complete();
    });
  }

  changeSort(name) {
    if (this.sort_by === 'ASC') {
      this.sort_by = 'DESC';
      this.order_by = name;
      this.getMusicList();
    } else {
      this.sort_by = 'ASC';
      this.order_by = name;
      this.getMusicList();
    }
  }

}
