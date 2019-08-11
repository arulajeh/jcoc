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
    position: null,
    gender: null,
    email: '',
    image: {
      name: '',
      size: '',
      type: '',
      base64: null,
      isImage: null
    }
  }
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

  ngOnInit() {
  }

  async submit() {
    // await md5(this.dataUser.password);
    // this.dataUser.password = '1345';
    this.dataUser.password = md5(this.pass);
    // md5(this.dataUser.password);
    console.log(this.dataUser);
  }

  initData() {
    this.getDataPosition();
  }

  getDataPosition() {
    this.api.getMasterData('position').then( async (res) => {
      // console.log(res);
      this.listPostions = await JSON.parse(JSON.stringify(res)).data;
      return console.log(this.listPostions);
    })
  }

  async changeFile(e) {
    // this.stillUploading = true;
    const files = e.target.files;
    for (const a of files) {
      const b = await this.fileToBase64(a);
    }
    // for (const a of this.files) {
    //   a.id = await this.upload(a);
    // }
    // this.stillUploading = false;
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
            name: file.name,
            size: file.size,
            type: file.type,
            base64: reader.result,
            isImage: file.type.includes('image')
          };
          // const data = {
          //   name: file.name,
          //   size: file.size,
          //   type: file.type,
          //   base64: reader.result,
          //   uploadComplete: 0,
          //   id: 9999999,
          //   isImage: file.type.includes('image')
          // };
          // this.files.push(data);
          console.log(this.dataUser);
          resolve(this.dataUser.image);
        }
      };
      reader.onerror = (error) => {
        reject(`error: ${error}`);
      };
      // resolve();
    });
  }

  // async upload(file) {
  //   console.log('Uploading File', file);
  //   return new Promise((resolve, reject) => {
  //     return this.projectAllocationApi.uploadFile(file).then(res => {
  //       if (res.insert_master_file.returning.length === 1) {
  //         file.uploadComplete = 1;
  //         file.id = res.insert_master_file.returning[0].id;
  //         resolve(file.id);
  //       } else {
  //         // this.presentToast('Failed Uploading', 'danger');
  //         file.uploadComplete = 2;
  //         reject('Failed Upload');
  //       }
  //     }).catch(err => {
  //       file.uploadComplete = 2;
  //       // this.presentToast(`Failed Uploading ${err}`, 'danger');
  //       reject(err);
  //     });
  //   });
  // }
  deleteImg(e) {
    this.files = this.files.filter(file => file.id !== parseInt(e, 10));
  }

}
