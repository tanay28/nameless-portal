import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FirebaseService } from '../../__services/firebase.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  myForm : any;
  submitted = false;
  subscribeUpdates = false;
  errMsg = '';
  constructor(
    private fb: FormBuilder,
    private fbService: FirebaseService
  ) { }

  ngOnInit() {
    this.errMsg = '';
    this.subscribeUpdates = false;
    this.myForm = this.fb.group({
      fullName: ['',Validators.required],
      emailId: ['',Validators.required],
      msgDes: [''],
    });
  }

  onCheck(event: any) {
    this.subscribeUpdates = !this.subscribeUpdates;
  }

  get fval(){return this.myForm.controls;}

  onFocus() {
    this.errMsg = '';
  }

  onSubmit() {
    this.submitted = true;

    if(this.myForm.invalid) {
      this.errMsg = 'Name and email are required.!!';
      return;
    }

    const contactUsData = {
      _id : '',
      fullName : this.fval.fullName.value,
      email : this.fval.emailId.value,
      msgDescription : this.fval.msgDes.value,
      isSubscribed : this.subscribeUpdates,
      author : 'CURRENT_USER',
      createdAt: moment().format('YYYY-MM-DDTHH:mm:ss')
    };

    this.fbService.saveContactUsData(contactUsData).then(async ()=> {
      this.myForm.reset();
      this.submitted = false;
      this.subscribeUpdates = false;
    }).catch(err => {
      this.myForm.reset();
      this.subscribeUpdates = false;
      console.log(err);
    })

    console.log(contactUsData);
  }

}
