import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController } from '@ionic/angular';
import * as md5 from "md5";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  dataUser = {
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
  isFilled = false;
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
  listPostions:any;
  files = [];
  stillUploading = false;
  base64File = '';
  ionSelect = null;

  page_size = null
  page_number = null
  order_by = 'id'
  sort_by = 'ASC'
  search = ''
  listMembers:any;

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController
  ) { }

  async ionViewDidEnter() {
    await this.loadAnimation();
    await this.initData();
    this.loadingCtrl.dismiss();
  }

  async loadAnimation() {
    const x = await this.loadingCtrl.create({
      animated: true,
      spinner: "dots",
      keyboardClose: true,
      message: "Please Wait ...",
      translucent: true
    });

    x.present();
  }

  changeSelect() {
    console.log(this.ionSelect);
  }

  ngOnInit() {
  }

  async submit() {
    this.dataUser.password = md5(this.pass);
    this.dataUser.position_id = this.position.id;
    this.dataUser.gender_id = this.selectGender.id;
    this.api.postData('users/create', this.dataUser)
    .then((res) => {
      console.log(res);
    })
    console.log(this.dataUser);
  }

  initData() {
    this.getDataPosition();
    this.getMemberList();
  }

  getDataPosition() {
    this.api.getMasterData('position').then( async (res) => {
      this.listPostions = await JSON.parse(JSON.stringify(res)).data;
      return console.log(this.listPostions);
    })
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

  getMemberList() {
    console.log('member')
    this.api.getListData('users', this.page_size, this.page_number, this.order_by, this.sort_by, this.search)
    .then((res) => {
      // console.log(res);
      this.listMembers = JSON.parse(JSON.stringify(res)).data;
      console.log(this.listMembers);
    });
  }

}
