import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-schedule-update',
  templateUrl: './schedule-update.page.html',
  styleUrls: ['./schedule-update.page.scss'],
})
export class ScheduleUpdatePage implements OnInit {
  id;
  resp;

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
    id: null,
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

  constructor(
    private route:ActivatedRoute,
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router : Router
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.showLoading('Getting data').then(async () => {
      await this.getParams();
      await this.getUsersList();
      await this.getMusicList();
      await this.getScheduleDetail();
      this.loadingCtrl.dismiss();
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    });
  }

  getMusicList() {
    return this.api.getListData('music', '1000', '1', 'judul', 'ASC').then((res) => {
      this.listMusics = JSON.parse(JSON.stringify(res)).data;
    })
  }

  getUsersList() {
    return this.api.getListData('users/list', '1000', '1', 'name', 'ASC').then((res) => {
      const resp = JSON.parse(JSON.stringify(res)).data;
      this.listMembers = {
        basis: resp.filter(x => x.position_name === 'Basis'),
        drummer: resp.filter(x => x.position_name === 'Drummer'),
        gitaris: resp.filter(x => x.position_name === 'Gitaris'),
        pianis: resp.filter(x => x.position_name === 'Pianis'),
        song_leader: resp.filter(x => x.position_name === 'Song Leader'),
        vokalis: resp.filter(x => x.position_name === 'Singer')
      }
    });
  }

  getScheduleDetail() {
    const data = {id: this.id}
    return this.api.postData('schedule/detail',data).then(async (res) => {
      this.resp = JSON.parse(JSON.stringify(res));
      this.dataSchedule.event_date = this.resp.data.event_date;
      this.dataSchedule.event_name = this.resp.data.event_name;
      this.gitaris = await this.listMembers.gitaris.find(x => x.id === this.resp.data.gitaris_id);
      this.pianis = await this.listMembers.pianis.find(x => x.id === this.resp.data.pianis_id);
      this.basis = await this.listMembers.basis.find(x => x.id === this.resp.data.basis_id);
      this.drummer = await this.listMembers.drummer.find(x => x.id === this.resp.data.drummer_id);
      this.songLeader = await this.reparseSelectable(this.listMembers.song_leader, this.resp.data.song_leader_id);
      this.singer = await this.reparseSelectable(this.listMembers.vokalis, this.resp.data.vokalis_id);
      this.music = await this.reparseSelectable(this.listMusics, this.resp.data.music_id);
    }).catch((err) => {
      this.loadingCtrl.dismiss();
    })
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

  parseSelectable(data) {
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

  reparseSelectable(data1, data2) {
    let x = [];
    data1.map((val) => {
      data2.forEach(element => {
        if (val.id === element) {
        x.push(val);
        }
      });
    });
    return x;
  }

  async changeFile(e) {
    const files = e.target.files;
    for (const a of files) {
      const b = await this.fileToBase64(a);
    }
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

  async submit() {
    this.dataSchedule.id = this.id;
    this.dataSchedule.song_leader = this.songLeader ? await this.parseSelectable(this.songLeader) : null;
    this.dataSchedule.vokalis = this.singer ? await this.parseSelectable(this.singer) : null;
    this.dataSchedule.pianis = this.pianis ? await this.parseSelectable(this.pianis) : null;
    this.dataSchedule.basis = this.basis ? await this.parseSelectable(this.basis) : null;
    this.dataSchedule.drummer = this.drummer ? await this.parseSelectable(this.drummer) : null;
    this.dataSchedule.gitaris = this.gitaris ? await this.parseSelectable(this.gitaris) : null;
    this.dataSchedule.lagu = this.music ? await this.parseSelectable(this.music) : null;
    this.api.postData('schedule/update', this.dataSchedule).then((res) => {
      const response = JSON.parse(JSON.stringify(res));
      if (response.sukses === true) {
        this.showToast('Update schedule successfully');
        this.router.navigateByUrl('/home/add-schedule');
      } else {
        this.showToast('Failed create schedule');
      }
    });
  }

}
