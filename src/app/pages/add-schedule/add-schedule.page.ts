import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.page.html',
  styleUrls: ['./add-schedule.page.scss'],
})
export class AddSchedulePage implements OnInit {
  imgNotFound = 'assets/img/image.png';

  listMusics = [];
  songLeader = [];
  singer = [];
  pianis:any;
  basis:any;
  gitaris:any;
  drummer:any;
  music = [];

  files = [];

  listMembers = {
    basis: [],
    gitaris: [],
    drummer: [],
    pianis: [],
    vokalis: [],
    song_leader: []
  }

  hasilGender = [];

  dataSchedule = {
    event_date: "",
    event_name: "",
    basis: 0,
    gitaris: 0,
    drummer: 0,
    user_id: 0,
    pianis: 0,
    vokalis: [],
    song_leader: [],
    lagu: [],
    image: {
      file_name: "",
      file_size: 0,
      file_type: "",
      base64: null,
      isImage: null
    }
  };

  page_size = '5';
  page_number = '1';
  search = '';
  order_by = 'event_name';
  sort_by = 'ASC';

  scheduleList = [];
  resp

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  getScheduleList() {
    this.showLoading('Getting data').then(() => {
      const api = JSON.parse(localStorage.getItem('data')).akses === 1 ? 'schedule/all' : 'schedule';
      this.api.getListData(api, this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ')
      .then((res) => {
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(res));
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getScheduleList();
        } else {
          return this.scheduleList = JSON.parse(JSON.stringify(res)).data;
        }
        // console.log(res);
        // this.scheduleList = JSON.parse(JSON.stringify(res)).data;
        // console.log(this.scheduleList);
      }).then(() => {
        this.getImages();
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error Getting data');
      })
    })
  }

  check(){
    let x = this.parseSelectable(this.songLeader);
    let y = this.parseSelectable(this.singer);
    // x = this.parseSelectable(this.songLeader);
    console.log(x , y);
  }

  async submit() {
    this.showLoading('Submit data').then( async () => {
      this.dataSchedule.song_leader = this.songLeader ? await this.parseSelectable(this.songLeader) : null;
      this.dataSchedule.vokalis = this.singer ? await this.parseSelectable(this.singer) : null;
      this.dataSchedule.pianis = this.pianis ? await this.parseSelectable(this.pianis) : null;
      this.dataSchedule.basis = this.basis ? await this.parseSelectable(this.basis) : null;
      this.dataSchedule.drummer = this.drummer ? await this.parseSelectable(this.drummer) : null;
      this.dataSchedule.gitaris = this.gitaris ? await this.parseSelectable(this.gitaris) : null;
      this.dataSchedule.lagu = this.music ? await this.parseSelectable(this.music) : null;
  
      this.api.postData('schedule/create', this.dataSchedule).then((res) => {
        this.loadingCtrl.dismiss();
        console.log(res);
        const response = JSON.parse(JSON.stringify(res));
        if (response.sukses === true) {
          this.showToast('Create schedule successfully');
          this.dataSchedule = {
            event_date: "",
            event_name: "",
            basis: 0,
            gitaris: 0,
            drummer: 0,
            user_id: 0,
            pianis: 0,
            vokalis: [],
            song_leader: [],
            lagu: [],
            image: {
              file_name: "",
              file_size: 0,
              file_type: "",
              base64: null,
              isImage: null
            }
          };
          this.getScheduleList()
        } else {
          this.showToast('Failed create schedule');
        }
      });
    })
    
    console.log(' Data Schedule Submit',this.dataSchedule);
    // console.log(a);
  }

  initData() {

  }

  ionViewDidEnter() {
    this.getUsersList();
    this.getMusicList();
    this.getScheduleList();
  }

  getMusicList() {
    this.api.getListData('music', '1000', '1', 'judul', 'ASC').then((res) => {
      console.log(res);
      this.listMusics = JSON.parse(JSON.stringify(res)).data;
    })
  }

  getUsersList() {
    this.api.getListData('users/list', '1000', '1', 'name', 'ASC', ' ').then((res) => {
      console.log(res);
      const resp = JSON.parse(JSON.stringify(res)).data;
      this.listMembers = {
        basis: resp.filter(x => x.position_name === 'Basis'),
        drummer: resp.filter(x => x.position_name === 'Drummer'),
        gitaris: resp.filter(x => x.position_name === 'Gitaris'),
        pianis: resp.filter(x => x.position_name === 'Pianis'),
        song_leader: resp.filter(x => x.position_name === 'Song Leader'),
        vokalis: resp.filter(x => x.position_name === 'Singer')
      }
      console.log(this.listMembers);
    });
  }

  parseSelectable(data) {
    console.log(data);
    if (Array.isArray(data)) {
      let any = [];
      data.forEach((val, index) => {
        any.push(val.id);
      });
      return any;
    } else {
      return data.id;
    }
  }

  async changeFile(e) {
    const files = e.target.files;
    for (const a of files) {
      const b = await this.fileToBase64(a);
    }
    // console.log(this.dataUser, this.pass, this.position, this.selectGender);
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const temp = this.files.map(a => a.name);
        if (temp.includes(file.name)) {
          resolve(file);
        } else {
          this.dataSchedule.image = {
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            base64: reader.result,
            isImage: file.type.includes('image')
          };
          resolve(this.dataSchedule.image);
        }
      };
      reader.onerror = (error) => {
        reject(`error: ${error}`);
      };
    });
  }

  deleteImg(e) {
    this.files = this.files.filter(file => file.id !== parseInt(e, 10));
  }

  async showToast(msg) {
    const a = await this.toastCtrl.create({
      animated: true,
      duration: 2000,
      keyboardClose: true,
      message: msg,
      position: "bottom"
    });

    a.present();
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

  async deleteSchedule(id) {
    const data = {id: id}
    this.api.postData('schedule/delete', data)
    .then((res) => {
      const response = JSON.parse(JSON.stringify(res));
      if (response.sukses === true) {
        this.showToast('Delete schedule successfully');
        this.getScheduleList();
      } else {
        this.showToast('Failed delete schedule');
      }
    })
  }

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getScheduleList();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getScheduleList();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getScheduleList();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      console.log(this.page_number);
      this.getScheduleList();
    }
  }

  changeSort(name) {
    if (this.sort_by === 'ASC') {
      this.sort_by = 'DESC';
      this.order_by = name;
      this.getScheduleList();
    } else {
      this.sort_by = 'ASC';
      this.order_by = name;
      this.getScheduleList();
    }
  }

  updateSchedule(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    }
    this.navCtrl.navigateForward(['schedule-update'], navigationExtras);
  }

  getImages() {
    console.log(this.scheduleList);
    Promise.all(
      this.scheduleList.map( async (val) => {
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          const x = JSON.parse(JSON.stringify(res)).data;
          await this.scheduleList.forEach((value) => {
            if (x.id === value.file_id) {
              value.file = x.file
            }
          });
        });
      })
    );
  }

}
