
import {Component, NgZone,  EventEmitter} from 'angular2/core';
import { FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common';
import { Router, RouterLink } from 'angular2/router';
import {NgFor} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
//import {observableFirebaseObject, observableFirebaseArray} from './myfbOb';
import {Signup} from './Signup';
import {SharedService} from './shareds';
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {AngularFire, FirebaseAuth} from 'angularfire2';
@Component({
    selector: 'display',
    template: `
<div id="phone" class="text-center hidden-sm-up">
        <input class="form-control" type="hidden" [(ngModel)]="isLoggedIn" placeholder="">
	  	<div >
          <br>
           <form class="form-inline">
		  <span class="radio">
            <input class="form-control" required [(ngModel)]="email" placeholder="User email" (keyup)="doneTyping0($event,password,pass)"><br>
            <input class="form-control" #pass required [(ngModel)]="password" type="password" (keyup)="doneTyping($event,email)" placeholder="Password"><br>
		  </span>
		  <button class="btn btn-primary"  [disabled]="!(email && password)"    (click)="authWithPassword(email , password)">Sign in</button>
           </form>
	  	    <div *ngIf="errmsg"  style="color:Crimson">
                {{errmsg}}
		    </div>
		</div>
        <div *ngIf="showfork" >
            <label class="radio-inline" *ngIf="hasMember">
                <input  type="radio" name="nlogin"   (click)="setLevel(1)" >Login as member<br/>
            </label>
            <label class="radio-inline" *ngIf="hasEmployee">
                <input  type="radio" name="nlogin"   (click)="setLevel(2)" >Login as employee<br/>
            </label>
            <label class="radio-inline" *ngIf="hasOwner">
                <input  type="radio" name="nlogin"   (click)="setLevel(3)" >Login as owner
            </label>
        </div>
        <ul class="list-group alert alert-danger text-left">
            <li class="list-group-item">Store owner, click top menu to create store, branches and manage it.</li>
            <li class="list-group-item">Store employee, just login with your email and password. </li>
            <li class="list-group-item">Member, just login with your email and password. Then, check your points, transactions, etc.</li>
            <li class="list-group-item">You can use any email address. It's just for login. The only issue is that you cannot reset password or receive notifications.</li>
        </ul>
</div>
<div id="othermedia" class="text-left hidden-md-down">
        <input class="form-control" type="hidden" [(ngModel)]="isLoggedIn" placeholder="">
	  	<div >
          <br>
           <form class="form-inline">
		  <span class="radio">
            <input class="form-control" required [(ngModel)]="email" placeholder="User email" (keyup)="doneTyping0($event,password,pass)"><br>
            <input class="form-control" #pass required [(ngModel)]="password" type="password" (keyup)="doneTyping($event,email)" placeholder="Password"><br>
		  </span><br>
		  <button class="btn btn-primary"  [disabled]="!(email && password)"    (click)="authWithPassword(email , password)">Sign in</button>
           </form>
	  	    <div *ngIf="errmsg"  style="color:Crimson">
                {{errmsg}}
		    </div>
		</div>
        <div *ngIf="showfork" >
            <label *ngIf="hasMember">
                <input class="form-control" type="radio" name="nlogin"   (click)="setLevel(1)" >Login as member<br/>
            </label>
            <label *ngIf="hasEmployee">
                <input class="form-control" type="radio" name="nlogin"   (click)="setLevel(2)" >Login as employee<br/>
            </label>
            <label *ngIf="hasOwner">
                <input class="form-control" type="radio" name="nlogin"   (click)="setLevel(3)" >Login as owner
            </label>
        </div>
        <ul class="list-group alert alert-danger text-left">
            <li class="list-group-item">Store owner, click top menu to create store, branches and manage it.</li>
            <li class="list-group-item">Store employee, just login with your email and password. </li>
            <li class="list-group-item">Member, just login with your email and password. Then, check your points, transactions, etc.</li>
            <li class="list-group-item">You can use any email address. It's just for login. The only issue is that you cannot reset password or receive notifications.</li>
        </ul>
</div>

	`,
    directives: [NgFor, RouterLink, ACCORDION_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
})
export class Login {
    errmsg: string;
    showfork: boolean = false;
    hasMember: boolean = false;
    hasEmployee: boolean = false;
    hasOwner: boolean = false;
    loggedLevel: number;
    static url: string = "https://ngr.firebaseio.com";
    static messagesRef: Firebase = new Firebase(Login.url);
    isLoggedIn: boolean = false;
    authData: any;
    email: string;
    password: string;
    //fbitems: Observable<any[]>;

    progressValue: number = 40;
    public oneAtATime: boolean = true;
    public items: Array<string> = ['Item 1', 'Item 2', 'Item 3'];

    public status: Object = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    public groups: Array<any> = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    public addItem(): void {
        this.items.push(`Items ${this.items.length + 1}`);
    }
    step(val: number) {
        this.progressValue += val;
    }
    constructor(public router: Router, private zone: NgZone, public ss: SharedService, public af: AngularFire) {
        //Login.messagesRef = new Firebase(Login.firebaseUrl);
       
        //this.fbitems = af.database.list('/users');
        //console.log("000a" + af.database);
        //af.auth.subscribe(res => {
        //    console.log("0001" + res);
        //}
        //);
        
    }
    static xemail(e: string): string {
        return e.replace(".", "^");
    }
    setLevel(l: number) {
        //console.log("setLevel:" + l);
        this.ss.setlevel(l);
        //amain  .loggedLevel = l;
        if (l === 1) {
            this.router.parent.navigate(['/MemberHome']);
        }
        if (l === 2) {
            this.router.parent.navigate(['/EmployeeHome']);
        }
        if (l === 3) {
            this.router.parent.navigate(['/SetupStore']);
        }
        //this.loggedLevel = l;
        //console.log("aaa" + l);
        //store owner
        //if (l === 3) {
        //    console.log("ownerstorescount" + this.ownerstorescount + " lastownerstore" + this.lastownerstore);
        //}
    }

    authWithPassword(email: string, password: string) {
        this.errmsg = "";
        this.email = email;
        let o: Observable<any>;

        this.af.auth.login({ email: this.email, password: this.password }).then((authData) => {
            this.authData = authData;
            this.isLoggedIn = true;
            localStorage.setItem('uid', authData.uid);

            //console.log("aaa" + this.authData);
            var usersRef =this.af.object("/users/" + this.authData.uid);
            usersRef.update({
                uid: this.authData.uid,
                email: email,
                lastlogin: (new Date()).toISOString()
            });
            o = this.af.object("/users/" + this.authData.uid);
            var s = o.subscribe(res => {

                this.hasOwner = res.isowner;
                this.hasEmployee = res.isemployee;
                this.hasMember = res.ismember;
                //console.log("reset zz");
                this.showfork = true;//this one not working
            }
            );
        }).catch((error) => {
            this.errmsg = error;
            console.log(error);
            });


        //Login.messagesRef.authWithPassword({
        //    email: email,
        //    password: password
        //}, (error, authData) => {
        //    if (error) {
        //        this.errmsg = error;
        //        console.log(error);
        //    } else {
        //        this.authData = authData;
        //        this.isLoggedIn = true;
        //        localStorage.setItem('jwt', authData.token);

        //        //console.log(this.authData.uid);
        //        var usersRef = Login.messagesRef.child("users").child(this.authData.uid);
        //        usersRef.update({
        //            uid: this.authData.uid,
        //            email: email,
        //            lastlogin: (new Date()).toISOString()
        //        });
        //        o = observableFirebaseObject(Login.messagesRef.child("users").child(this.authData.uid));
        //        var s = o.subscribe(res => {

        //            this.hasOwner = res.isowner;
        //            this.hasEmployee = res.isemployee;
        //            this.hasMember = res.ismember;
        //            //console.log("reset zz");
        //            this.showfork = true;//this one not working
        //        }
        //        );
        //    }
        //});
        setTimeout(() => {
           // console.log("reset zz222");
            if (this.hasMember && !this.hasEmployee && !this.hasOwner) this.setLevel(1);
            if (!this.hasMember && this.hasEmployee && !this.hasOwner) this.setLevel(2);
            if (!this.hasMember && !this.hasEmployee && this.hasOwner) this.setLevel(3);
            if (this.authData) this.showfork = true;
            o = null;
        }, 1000);
    }

    doneTyping($event, email: string) {
        this.errmsg = "";
        //console.log("aab");
        if ($event.which === 13) {
            //console.log("aab");
            this.authWithPassword(email, $event.target.value);
        }
    }
    doneTyping0($event, password: string, passctl) {
        this.errmsg = "";
        if ($event.which === 13) {
            //this.authWithPassword($event.target.value, password);
            //console.log("aa");
            passctl.focus();
            passctl.select();
        }
    }
}
