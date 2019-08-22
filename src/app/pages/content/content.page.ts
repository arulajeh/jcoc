import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
})
export class ContentPage implements OnInit {
  imgNotFound = 'assets/img/image.png';
  content = {
    title: '',
    image: {
      file_name: '',
      file_size: 0,
      file_type: '',
      base64: null,
      isImage: ''
    }
  }

  listImage = [];

  files = [];
  stillUploading = false;
  base64File = '';

  search = '';
  listContent = [];
  inputForm = false;

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ionViewDidEnter() {
    this.getData();
  }

  ngOnInit() {
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
          this.content.image = {
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            base64: reader.result,
            isImage: file.type.includes('image')
          };
          console.log(this.content);
          resolve(this.content.image);
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

  submit() {
    this.api.postData('content/create', this.content).then((result) => {
      console.log(result);
      const res = JSON.parse(JSON.stringify(result));
      if (res.sukses === true) {
        this.showToast('Success upload content');
        this.content = {
          title: '',
          image: {
            base64: null,
            file_name: '',
            file_size: 0,
            file_type: '',
            isImage: null
          }
        }
        this.getData();
      } else if(res.sukses === false && res.msg === 'limit') {
        this.showToast('You have reached content limit');
      } else {
        this.showToast('Failed upload content');
      }
    }).catch((err) => {
      this.showToast('Failed upload content');
    })
  }

  async getData() {
    this.loadingAnimated().then(() => {
      this.api.getListData('content', '5', '1', 'title', 'ASC', this.search ? this.search : ' ')
      .then(async (result) => {
        this.loadingCtrl.dismiss();
        console.log(result)
        return this.listContent = await JSON.parse(JSON.stringify(result)).data;
      }).then(() => {
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

  deleteContent(id) {
    this.showToast('Deletting data');
    const data = {
      id: id
    }
    this.api.postData('content/delete', data)
    .then((result) => {
      const res = JSON.parse(JSON.stringify(result))
      if (res.sukses) {
        this.showToast('Delete content successfully');
        this.getData();
      } else {
        this.showToast('Fail delete content');
      }
    }).catch((err) => {
      this.showToast('Fail delete content');
    });
  }

  insertImage() {
    this.listContent.map((value, index) => {
      console.log(value.file_id);
    })
  }

  getImages() {
    Promise.all(
      this.listContent.map( async (val) => {
        const body = {id: val.file_id}
        await this.api.postData('image', body).then(async (res) => {
          const x = JSON.parse(JSON.stringify(res)).data;
          await this.listContent.forEach((value) => {
            if (x.id === value.file_id) {
              value.file = x.file
            }
          });
        });
      })
    );
  }
}
