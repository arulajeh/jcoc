import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-articles-add',
  templateUrl: './articles-add.page.html',
  styleUrls: ['./articles-add.page.scss'],
})
export class ArticlesAddPage implements OnInit {

  data = {
    title: '',
    image: {
      file_name: '',
      file_size: 0,
      file_type: '',
      base64: null,
      isImage: ''
    },
    content: ''
  }

  listImage = [];

  files = [];
  stillUploading = false;
  base64File = '';

  search = '';
  listData = [];
  inputForm = false;

  constructor(
    private api : ApiService,
    private toastCtrl : ToastController,
    private loadingCtrl : LoadingController
  ) { }

  ionViewDidEnter(){
    this.getData();
  }

  async changeFile(e){
    const files = e.target.files;
    for(const a of files){
      const b = await this.fileToBase64(a);
    }
  }

  async fileToBase64(file){
    return new Promise((resolve, reject)=> {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const temp = this.files.map(a=>a.name);
        if(temp.includes(file.name)){
          resolve(file);
        }else{
          this.data.image = {
            file_name : file.name,
            file_size : file.size,
            file_type : file.type,
            base64 : reader.result,
            isImage : file.type.includes('image')
          };
          console.log(this.data);
          resolve(this.data.image);
        }
      };
      reader.onerror = (error) => {
        reject(`error : ${error}`);
      };
    });
  }

  deleteImg(e){
    this.files = this.files.filter(file => file.id !== parseInt(e,10));
  }

  submit() {
    this.api.postData('article/create', this.data).then((result) => {
      console.log(result);
      const res = JSON.parse(JSON.stringify(result));
      if (res.sukses === true) {
        this.showToast('Success upload content');
        this.data = {
          title: '',
          image: {
            base64: null,
            file_name: '',
            file_size: 0,
            file_type: '',
            isImage: null
          },
          content: ''
        };
        this.getData();
      } /*else if(res.sukses === false && res.msg === 'limit') {
        this.showToast('You have reached content limit');
      }*/ else {
        this.showToast('Failed upload content');
      }
    }).catch((err) => {
      this.showToast('Failed upload content');
    })
  }

  async getData() {
    this.loadingAnimated().then(() => {
      this.api.getListData('article', null, null, null, null, this.search ? this.search : ' ')
      .then((result) => {
        console.log(result)
        this.listData = JSON.parse(JSON.stringify(result)).data;
        this.insertImage();
      }).then(() => {
        this.loadingCtrl.dismiss();
      }).catch((err) => {
        this.loadingCtrl.dismiss();
      })
    })
  }

  async showToast(msg) {
    const a = await this.toastCtrl.create({
      message: msg,
      animated: true,
      duration: 2000,
      position: "bottom"
    });
    a.present();
  }

  async loadingAnimated() {
    const l = await this.loadingCtrl.create({
      animated: true,
      message: 'Getting data...',
      spinner: "dots",
      backdropDismiss: false,
      keyboardClose: true,
      translucent: false
    });

    l.present();
  }

  deleteArticle(id) {
    const data = {
      id: id
    }
    this.api.postData('article/delete', data)
    .then((result) => {
      const res = JSON.parse(JSON.stringify(result))
      if (res.sukses) {
        this.showToast('Delete Article successfully');
        this.getData();
      } else {
        this.showToast('Fail delete content');
      }
    }).catch((err) => {
      this.showToast('Fail delete content');
    });
  }

  insertImage() {
    this.listData.map((value, index) => {
      console.log(value.file_id);
    })
  }

  sendIdArticle(id){

  }

  ngOnInit() {
  }

}
