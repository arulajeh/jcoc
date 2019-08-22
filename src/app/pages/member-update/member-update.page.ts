import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import * as md5 from "md5";
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-member-update',
  templateUrl: './member-update.page.html',
  styleUrls: ['./member-update.page.scss'],
})
export class MemberUpdatePage implements OnInit {

  listPostions = [];
  gender = [
    {
      id: 1,
      name: "Male"
    },
    {
      id: 2,
      name: "Female"
    }
  ]
  dataUser = {
    id: 0,
    username: '',
    name: '',
    password: '',
    phone: '',
    position_id: null,
    gender_id: null,
    email: '',
    image: {
      file_name: '',
      file_size: 0,
      file_type: '',
      base64: null,
      isImage: null
    }
  }
  position = {
    id: 0,
    position_name: ""
  };
  selectGender = {
      id: 0,
      name: ""
  };
  pass = '';
  files = [];
  stillUploading = false;
  base64File = '';
  id: number;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.getParams();
    await this.getDataPosition().then(() => {
      this.getMemberDetail();
    })
  }

  getParams() {
    return this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id'])
    });
  }

  getDataPosition() {
    return this.api.getMasterData('position').then( async (res) => {
      return this.listPostions = await JSON.parse(JSON.stringify(res)).data;
    })
  }

  getMemberDetail() {
    return this.showLoading('Getting user detail').then(() => {
      const body = {id: this.id};
      return this.api.postData('users/detail', body)
      .then((res) => {
        this.loadingCtrl.dismiss();
        const resp = JSON.parse(JSON.stringify(res)).data;
        this.position = this.listPostions.find(x => x.id === resp.position_id);
        this.selectGender = this.gender.find(x => x.id === resp.gender_id);
        this.dataUser = {
          id: this.id,
          email: resp.email,
          gender_id: resp.gender_id,
          image: {
            file_name: '',
            base64: '',
            file_size: 0,
            file_type: '',
            isImage: null
          },
          name: resp.name,
          password: '',
          phone: resp.phone,
          position_id: resp.position_id,
          username: resp.username
        }
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting user detail');
      })
    })
  }

  submit() {
    this.dataUser.password = this.pass !== '' ? md5(this.pass) : '';
    this.dataUser.position_id = this.position.id;
    this.dataUser.gender_id = this.selectGender.id;
    this.dataUser.id = this.id;
    this.api.postData('users/update', this.dataUser)
    .then((res) => {
      let ress = JSON.parse(JSON.stringify(res));
      if (ress.sukses === true) {
        this.showToast('Update user successfully')
      } else {
        this.showToast('Failed update users');
      }
    }).catch((err) => {
      this.showToast('Failed update users');
    });
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
          this.dataUser.image = {
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            base64: reader.result,
            isImage: file.type.includes('image')
          };
          resolve(this.dataUser.image);
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
      position: "bottom",
      message: msg
    });

    a.present();
  }

  async showLoading(msg) {
    const x = await this.loadingCtrl.create({
      animated: true,
      spinner: "dots",
      keyboardClose: true,
      message: msg,
      translucent: true
    });

    x.present();
  }

}
