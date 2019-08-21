import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import * as md5 from "md5";
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  imgNotFound = 'assets/img/image.png';
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

  page_size = '5'
  page_number = '1'
  order_by = 'name'
  sort_by = 'ASC'
  search = ''
  listMembers = [];
  resp:any;

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
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
      let ress = JSON.parse(JSON.stringify(res));
      if (ress.sukses === true) {
        this.position = undefined;
        this.selectGender = undefined;
        this.pass = '';
        this.dataUser = {
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
        this.getMemberList();
      } else {
        this.showToast('Failed insert users');
      }
    }).catch((err) => {
      console.log(err);
      this.showToast('Failed insert users');
    })
    console.log(this.dataUser);
  }

  initData() {
    this.getDataPosition();
    this.getMemberList()
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
    console.log('member');
    return this.loadAnimation().then(() => {
      const api = JSON.parse(localStorage.getItem('data')).akses === 1 ? 'users/all' : 'users';
      return this.api.getListData(api, this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ')
      .then((res) => {
        // console.log(res);
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(res));
        console.log(' this response ',this.resp);
        if (parseInt(this.page_number) > this.resp.page_information.totalPage) {
          this.page_number = this.resp.page_information.totalPage.toString();
          this.getMemberList();
        } else {
          return this.listMembers = JSON.parse(JSON.stringify(res)).data;
        }
        console.log(this.listMembers);
      }).then(() => {
        this.getImages();
      }).catch((err) => {
        this.loadingCtrl.dismiss();
      })
    })
  }

  deleteUser(id){
    console.log(id)
    let body = {id: id}
    this.api.postData('users/delete', body).then((res) => {
      const response = JSON.parse(JSON.stringify(res));
      console.log(response)
      if (response.sukses === true) {
        this.showToast('Delete user successfully');
        this.getMemberList();
      } else {
        this.showToast('Failed delete user');
      }
    }).catch((err) => {
      this.showToast('Failed delete user');
    })
  }

  sendIdUser(id){
    const extras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    }
    this.navCtrl.navigateForward(['/member-update'], extras);
  }

  async showToast(msg) {
    const a = await this.toastCtrl.create({
      message: msg,
      animated: true,
      duration: 2000,
      keyboardClose: true,
      position: "bottom"
    });

    a.present();
  }

  doRefresh(event) {
    this.getMemberList().then(() => {
      event.target.complete();
    })
  }

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getMemberList();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getMemberList();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getMemberList();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      console.log(this.page_number);
      this.getMemberList();
    }
  }

  changeSort(id){
    if (this.sort_by === 'ASC') {
      this.sort_by = 'DESC';
      this.order_by = id;
      this.getMemberList();
    } else  if (this.sort_by === 'DESC') {
      this.sort_by = 'ASC';
      this.order_by = id;
      this.getMemberList();
    }
  }

  getImages() {
    Promise.all(
      this.listMembers.map( async (val) => {
        // console.log(val.id);
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          // console.log(res);
          const x = JSON.parse(JSON.stringify(res));
          console.log(x);
          // await this.listMembers.forEach((value) => {
          //   console.log(value)
          //   if (x.id === value.file_id) {
          //     value.file = x.file
          //   }
          // });
        });
      })
    );
  }

}
