import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import * as md5 from "md5";
import { ToastController } from '@ionic/angular';

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
      file_size: '',
      file_type: '',
      base64: null,
      isImage: null
    }
  }
  position: any;
  selectGender:any;
  pass = '';
  files = [];
  stillUploading = false;
  base64File = '';
  id: number;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
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
      console.log(this.id);
    });
  }

  getDataPosition() {
    return this.api.getMasterData('position').then( async (res) => {
      this.listPostions = await JSON.parse(JSON.stringify(res)).data;
      return console.log(this.listPostions);
    })
  }

  getMemberDetail() {
    const body = {id: this.id};
    return this.api.postData('users/detail', body).then((res) => {
      const resp = JSON.parse(JSON.stringify(res)).data;
      this.dataUser = {
        id: this.id,
        email: resp.email,
        gender_id: resp.gender_id,
        image: resp.file,
        name: resp.name,
        password: '',
        phone: resp.phone,
        position_id: resp.position_id,
        username: resp.username
      }
    });
  }

  submit() {
    this.dataUser.password = md5(this.pass);
    this.dataUser.position_id = this.position.id;
    this.dataUser.gender_id = this.selectGender.id;
    this.dataUser.id = this.id;
    this.api.postData('users/update', this.dataUser)
    .then((res) => {
      console.log(res);
      let ress = JSON.parse(JSON.stringify(res));
      if (ress.sukses === true) {
        
      } else {
        this.showToast('Failed insert users');
      }
    }).catch((err) => {
      console.log(err);
      this.showToast('Failed insert users');
    })
    console.log(this.dataUser);
  }

  async changeFile(e) {
    const files = e.target.files;
    for (const a of files) {
      const b = await this.fileToBase64(a);
    }
    console.log(this.dataUser, this.pass, this.position, this.selectGender);
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

}
