import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import * as moment from 'moment';
import { FirebaseService } from '../../__services/firebase.service';
import { NgxSpinnerService } from "ngx-spinner";
import { staticdata } from '../../constants/staticdata';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  galleryImgs: any[] = [];
  constructor(
    private storage: AngularFireStorage,
    private spinner : NgxSpinnerService,
    private fbService: FirebaseService
  ) { }

  async ngOnInit() {
    this.galleryImgs = [];
    // this.galleryImgs = staticdata.gallery;

    try {
      this.getAllGalleryImgs();
    } catch(err) {
      this.galleryImgs = [];
      // this.galleryImgs = staticdata.gallery;
    }
  }

  getAllGalleryImgs() {
    return new Promise((resolve, reject) => {
      this.fbService.getAllGalleryData().subscribe(res => {
        if(res.length > 0) {
          this.galleryImgs = [];
          this.galleryImgs = res;
        }
        resolve('ok');
      }, err => {
        this.galleryImgs = [];
        // this.galleryImgs = staticdata.gallery;
        reject('no data');
      });
    })
  }

}
