import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-articles-update',
  templateUrl: './articles-update.page.html',
  styleUrls: ['./articles-update.page.scss'],
})
export class ArticlesUpdatePage implements OnInit {

  resp:any;
  data = {
    id : 0,
    title: '',
    image: {
      file_name: '',
      file_size: 0,
      file_type: '',
      base64: null,
      isImage: ''
    },
    content: '',
    files_id: 0
  }
  id;
  files = [];

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router : Router
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
    await this.getParams();
    await this.getArticleDetail();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      this.id = JSON.parse(params['id']);
    })
  }

  getArticleDetail() {
    this.showLoading('Getting data').then(() => {
      const data = {id: this.id}
      this.api.postData('article/detail', data).then((res) => {
        this.loadingCtrl.dismiss();
        this.resp = JSON.parse(JSON.stringify(res)).data;
        this.data.content = this.resp.content;
        this.data.title = this.resp.title;
        this.data.files_id = this.resp.files_id
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error getting data');
      })
    });
  }

  submit() {
    this.showLoading('Submit data').then(() => {
      this.data.id = this.id;
      this.api.postData('article/update', this.data).then((res) => {
        this.loadingCtrl.dismiss();
        const response = JSON.parse(JSON.stringify(res));
        if (response.sukses === true) {
          this.showToast('Update article successfully');
          this.router.navigateByUrl('/home/articles-add');
        } else {
          this.showToast('Update article failed');
        }
      }).catch((err) => {
        this.loadingCtrl.dismiss();
        this.showToast('Error submit data');
      })
    })
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

  navBack(){
    this.navCtrl.back();
  }

}
