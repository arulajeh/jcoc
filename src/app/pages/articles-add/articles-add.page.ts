import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-articles-add',
  templateUrl: './articles-add.page.html',
  styleUrls: ['./articles-add.page.scss'],
})
export class ArticlesAddPage implements OnInit {
  imgNotFound = 'assets/img/image.png';

  skeleton = [1,2,3];
  resp:any;

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

  page_size = '5';
  page_number = '1';
  order_by = 'id';
  sort_by = 'ASC';

  constructor(
    private api : ApiService,
    private toastCtrl : ToastController,
    private loadingCtrl : LoadingController,
    private navCtrl: NavController
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
      this.api.getListData('article', this.page_size, this.page_number, this.order_by, this.sort_by, this.search ? this.search : ' ')
      .then((result) => {
        this.resp = JSON.parse(JSON.stringify(result))
        this.listData = this.resp.data;
      }).then(() => {
        this.loadingCtrl.dismiss();
        this.getImages();
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

  sendIdArticle(id){
    const extras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id)
      }
    }
    this.navCtrl.navigateForward(['articles-update'], extras);
    if(this.search == ''){
      this.search = ' ';
    }else{
      this.search = '';
    }
  }

  ngOnInit() {
  }

  nextPrev(nav){
    if (nav === 'next') {
      let a = parseInt(this.page_number) + 1;
      this.page_number = a.toString();
      this.getData();
    } else if (nav === 'prev') {
      let a = parseInt(this.page_number) - 1;
      this.page_number = a.toString();
      this.getData();
    } else if (nav === 'first') {
      this.page_number = '1';
      this.getData();
    } else if (nav === 'last') {
      this.page_number = this.resp.page_information.totalPage.toString();
      this.getData();
    }
  }

  changeSort(id){
    if (this.sort_by === 'ASC') {
      this.sort_by = 'DESC';
      this.order_by = id;
      this.getData();
    } else  if (this.sort_by === 'DESC') {
      this.sort_by = 'ASC';
      this.order_by = id;
      this.getData();
    }
  }

  getImages() {
    Promise.all(
      this.listData.map( async (val) => {
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          const x = JSON.parse(JSON.stringify(res)).data;
          await this.listData.forEach((value) => {
            if (x.id === value.file_id) {
              value.file = x.file
            }
          });
        });
      })
    );
  }

}
