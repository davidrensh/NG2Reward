import {Component, NgZone} from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouterLink } from 'angular2/router';
import {NgFor} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';
import {Login} from './Login';
import {SharedService} from './shareds';

import {AngularFire, FirebaseAuth} from 'angularfire2';
@Component({
    selector: 'display',
    template: `
	  	<div *ngIf="!isSigned"	class="card">
            <div class="card-header card-inverse card-info">
                Register store
             </div>
          <form class="form-inline">
		  <span class="radio">
            <input class="form-control" required [(ngModel)]="fname" placeholder="First name"><input class="form-control" required [(ngModel)]="lname"  placeholder="Last name"><br>
            <input class="form-control" required [(ngModel)]="email" placeholder="User email"><input class="form-control" type="password" required #password  placeholder="Password"><br>
            <input class="form-control" required [(ngModel)]="storename"  placeholder="Store name"><input class="form-control" required [(ngModel)]="renewYears"  placeholder="Years for one renew, i.e.: 1"><br>
            <input class="form-control" required  [(ngModel)]="maxPurchase"  placeholder="Max purchase$ limit, i.e.: 1000"><input class="form-control" required  [(ngModel)]="maxRedeem"  placeholder="Max redeem points limit, i.e.: 1000"><br>
		  </span><br>
		  <button class="btn btn-primary" [disabled]="!(fname && lname && email && password.value && storename && renewYears && maxPurchase && maxRedeem)"  (click)="signupStore(fname, lname,email,password.value,storename,renewYears,maxPurchase,maxRedeem)">Signup</button>
          </form>
		</div>
	`,
    directives: [NgFor, RouterLink],
})
export class Signup {
    isSigned: boolean = false;
    //messagesRef: Firebase;

    fname: string;
    lname: string;
    email: string;

    storename: string;

    renewYears: number;
    maxPurchase: number;
    maxRedeem: number;
    private parentRouter: Router;

    authData: any;
    constructor(_parentRouter: Router, public ss: SharedService, public af: AngularFire) {
        //this.messagesRef = Login.messagesRef;
        this.parentRouter = _parentRouter;
    }

    signupStore(fname:string,lname:string, email: string, password: string, storename: string, renewYears: number, maxPurchase: number, maxRedeem: number) {
        this.af.auth.createUser({
            email: email,
            password: password
        }).then(function (authData) {
            //console.log("Authenticated successfully with payload:", authData);
            this.authData = authData;
            this.isSigned = true;
            localStorage.setItem('uid', authData.uid);

           // var usersRef = this.messagesRef.child("users").child(authData.uid);
            this.af.object("/users/" + this.authData.uid).update({
                uid: authData.uid,
                email: email,
                fname: fname,
                lname: lname,
                isowner: true,
                isemployee: true,
                ismember: true
            });
           // usersRef.child("loginstores").child(storename)
            this.af.object("/users/" + this.authData.uid + "/loginstores/" + storename).update({
                ownerid: authData.uid,
                name: storename
            });
            //usersRef.child("buyatstores").child(storename)
            this.af.object("/users/" + this.authData.uid + "/buyatstores/" + storename).update({
                ownerid: authData.uid,
                name: storename
            });
            //var rref = this.messagesRef.child("users").child(authData.uid).child("stores").child(storename);
            this.af.object("/users/" + this.authData.uid + "/stores/" + storename).update({
                name: storename,
                renewyears: renewYears,
                maxpurchase: maxPurchase,
                maxredeem: maxRedeem
            });
            //rref.child("employees").child(authData.uid)
            this.af.object("/users/" + this.authData.uid + "/stores/" + storename + "/employees/" + authData.uid).update({
                uid: authData.uid,
                email: email,
                fname: fname,
                lname: lname
            });

            let emailx = Login.xemail(email);
           // var rref = this.messagesRef.child("members").child(emailx);
            this.af.object("/members/" + emailx).update({
                uid: authData.uid,
                email: email
            });
            //console.log("gooo");
            this.ss.setlevel(3);
            this.parentRouter.parent.navigateByUrl('/Login');
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

        //this.messagesRef.createUser({
        //    email: email,
        //    password: password
        //}, function (error, userData) {
        //    if (error) {
        //        switch (error.code) {
        //            case "INVALID_EMAIL":
        //                console.log("The specified email is not a valid email.");
        //                break;
        //            default:
        //                console.log("Error creating user:", error);
        //            case "EMAIL_TAKEN":
        //                console.log("The new user account cannot be created because the email is already in use. Use the credential to setup store.");
        //        }
        //        return;
        //    } else {

        //    }
        //});

        //setTimeout(() => {
        //    this.messagesRef.authWithPassword({
        //        email: email,
        //        password: password
        //    }, (error, authData) => {
        //        if (error) {
        //            console.log(error);
        //        } else {
        //            //console.log("Authenticated successfully with payload:", authData);
        //            this.authData = authData;
        //            this.isSigned = true;
        //            localStorage.setItem('jwt', authData.token);

        //            var usersRef = this.messagesRef.child("users").child(authData.uid);
        //            usersRef.update({
        //                uid: authData.uid,
        //                email: email,
        //                fname: fname,
        //                lname: lname,
        //                isowner: true,
        //                isemployee: true,
        //                ismember: true
        //            });
        //            usersRef.child("loginstores").child(storename).update({
        //                ownerid: authData.uid,
        //                name: storename
        //            });
        //            usersRef.child("buyatstores").child(storename).update({
        //                ownerid: authData.uid,
        //                name: storename
        //            });
        //            var rref = this.messagesRef.child("users").child(authData.uid).child("stores").child(storename);
        //            rref.update({
        //                name: storename,
        //                renewyears: renewYears,
        //                maxpurchase: maxPurchase,
        //                maxredeem: maxRedeem
        //            });
        //            rref.child("employees").child(authData.uid).update({
        //                uid: authData.uid,
        //                email: email,
        //                fname: fname,
        //                lname: lname
        //            });

        //            let emailx = Login.xemail(email);
        //            var rref = this.messagesRef.child("members").child(emailx);
        //            rref.update({
        //                uid: authData.uid,
        //                email: email
        //            });
        //            //console.log("gooo");
        //            this.ss.setlevel(3);
        //            this.parentRouter.parent.navigateByUrl('/Login');
        //        }
        //    });
        //}, 1000);
    }

}
