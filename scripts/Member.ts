import {Component, NgZone} from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouterLink } from 'angular2/router';
import {NgFor, NgFormModel, FORM_PROVIDERS, FormBuilder, Validators} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';

import {AngularFire, FirebaseAuth} from 'angularfire2';
import {Login} from './Login';
@Component({
    selector: 'display',
    template: `
	    <div  class="card">
            <div class="card-header card-inverse card-info">
                Register membership
             </div>
          <br>
        <form class="form-inline">
		  <span class="radio">
            <input class="form-control" required [(ngModel)]="fname" placeholder="First name" ><input class="form-control" required [(ngModel)]="lname"  placeholder="Last name"><br>
            <input class="form-control" required [(ngModel)]="email" placeholder="User email"><input class="form-control" required type="password" [(ngModel)]="password"  placeholder="Password"><br>
		  </span><br>
		  <button class="btn btn-primary" type="submit"  (click)="signupMember(fname, lname,email,password)">Signup</button>
        </form>
		</div>
	  	<div *ngIf="isSigned && addedmsg">
            {{addedmsg}}
		</div>        
	`,
    directives: [NgFor, RouterLink],
})
export class Member {
    isSigned: boolean = false;
    //messagesRef: Firebase;

    fname: string;
    lname: string;
    email: string;
    password: string;
    addedmsg:string;
    private parentRouter: Router;
    static gAuid: string;
    authData: any;
    form: any;
    constructor(_parentRouter: Router, _builder: FormBuilder, public af: AngularFire) {
        //this.messagesRef = Login.messagesRef;
        this.parentRouter = _parentRouter;
        //this.form = _builder.group({
        //    fcname: ['', Validators.required],
        //    password: ['', Validators.required]
        //});
    }

    signupMember(fname: string, lname: string, email: string, password: string) {
        this.addedmsg = null;
        this.isSigned = false;
        if (fname !== "" && lname !== "" && email !== "" && password !== "") {
            this.af.auth.createUser({
                email: email,
                password: password
            }).then(function (authData) {
                this.authData = authData;
               // var usersRef = this.messagesRef.child("users").child(Member.gAuid);
                this.af.object("/users/" + this.authData.uid).update({
                    uid: Member.gAuid,
                    email: email,
                    fname: fname,
                    lname: lname,
                    ismember: true
                });
                let emailx = Login.xemail(email);
               // var rref = this.messagesRef.child("members").child(emailx);
                this.af.object("/members/" + emailx).update({
                    uid: this.authData.uid,
                    email: email
                });
                this.fname = "";
                this.lname = "";
                this.email = "";
                this.password = "";
                this.isSigned = true;
                this.addedmsg = "Card added!";
   
            }).catch(function (error) {

                switch (error.code) {
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        break;
                    default:
                        console.log("Error creating user:", error);
                    case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use. Use the credential to setup store.");

                }
            });
        }
    }
}
