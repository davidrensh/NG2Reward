import { bootstrap } from 'angular2/platform/browser';
import {Component,  NgZone, Directive, Attribute, ElementRef, DynamicComponentLoader, Pipe, PipeTransform, OnInit} from 'angular2/core';
import { FORM_DIRECTIVES, CORE_DIRECTIVES, DatePipe, NgIf,NgFor} from 'angular2/common';
import { JwtHelper } from './angular2-jwt';
import {Login} from "./Login";
import "rxjs/add/operator/cache";
import "rxjs/add/operator/last";
import "rxjs/add/operator/first";
import "rxjs/add/operator/count";
import "rxjs/add/operator/do";
import "rxjs/add/operator/takeLast";

import {AngularFire, FirebaseAuth} from 'angularfire2';
import {
ROUTER_DIRECTIVES,
ROUTER_PROVIDERS,
HashLocationStrategy,
LocationStrategy,
RouteConfig, Router, RouterOutlet, RouteParams, RouterLink, ComponentInstruction
} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/operator/toArray';
//import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/observable/combineLatest';

//import {observableFirebaseObject, observableFirebaseArray, existFirebaseChild} from './myfbOb';


@Component({
    selector: 'SetupStore',
    directives: [ROUTER_DIRECTIVES],
    template: ` 
           <br>
    <div *ngIf="initialized" >
        <div class="card">
            <div class="card-header card-inverse card-info">
                Store basic
              </div>
            Select store to setup: <button class="btn btn-primary"   (click)="SetButtonFace()">{{face}}</button>
          <div *ngIf="face === '<<'">
          <form  class="form-inline">
            Add a new store or change store base policy:<br/>
		  <span class="radio">
            <input class="form-control" required [(ngModel)]="storename"  placeholder="Store name"><input class="form-control" required [(ngModel)]="renewYears"  placeholder="Years for one renew, i.e.: 1"><br>
            <input class="form-control" required  [(ngModel)]="maxPurchase"  placeholder="Max purchase$ limit, i.e.: 1000"><input class="form-control" required  [(ngModel)]="maxRedeem"  placeholder="Max redeem points limit, i.e.: 1000"><br>
		  </span>
		  <button class="btn btn-primary" [disabled]="!(storename && renewYears && maxPurchase && maxRedeem)"  (click)="SaveStore(storename,renewYears,maxPurchase,maxRedeem)">Save</button>
          </form>
            <button class="btn btn-primary" [disabled]="!selectedStore" [hidden]="suredeletestore"  (click)="suredeletestore = true">Delete</button>
            <button class="btn btn-primary" [hidden]="!selectedStore || !suredeletestore"  (click)="deleteStore()"  style="color:Crimson">Sure to delete? Yes</button>
            <button class="btn btn-primary" [hidden]="!selectedStore || !suredeletestore"  (click)="suredeletestore = false"  style="color:DarkGreen">Sure to delete? Cancel</button>
          </div>
            <input class="form-control" [hidden]="1" [(ngModel)]="selectedStore" placeholder="Current store">
            <div  *ngIf="stores">
                <label   *ngFor="#d of stores | async" >
                    <input  class="radio-inline" type="radio" name="nstores" value="{{d.name}}" (click)="selectStore(d)"  checked="checked"> {{d.name }} &nbsp;
                </label>
            </div>
        </div>
	    <div *ngIf="selectedStore" class="card">
            <div class="card-header card-inverse card-info">
                Branches
              </div>
                <form class="form-inline">
                <input class="form-control" required [(ngModel)]="branch" placeholder="Branch name"><button class="btn btn-primary"  (click)="addBranch()">Save</button>
                </form>
                <button class="btn btn-primary" [disabled]="!branch"  (click)="deleteBranch()">Delete</button>
                <div>
                    <label  *ngFor="#b of branches | async" >
                        <input  class="radio-inline" type="radio" name="nBranches" value="{{b.name}}" (click)="branch = b.name" > {{b.name }} &nbsp;
                    </label>
                </div>
	    </div>
	    <div  class="card">
            <div class="card-header card-inverse card-info">
                Employees
             </div>
            Employee:<button class="btn btn-primary"  *ngIf="!assignemployee"  (click)="assignemployee = !assignemployee">>></button>
                <div  *ngIf="assignemployee">
                 <button class="btn btn-primary"  (click)="assignemployee = !assignemployee"><<</button>
                 <form >
                    <input class="form-control" required [(ngModel)]="assignemail" placeholder="User email">
                    <button class="btn btn-primary" [disabled]="!assignemail"  (click)="assignEmployeeTo(assignemail)">Assign to {{selectedStore}}</button>
                 </form>
	  	            <div *ngIf="assignmsg">
                        {{assignmsg}}
		            </div>
                </div>
                <div  *ngIf="!assignemployee">
                    <form class="form-inline">
                        <input class="form-control" required [(ngModel)]="fname" placeholder="First name"><input class="form-control" required [(ngModel)]="lname"  placeholder="Last name"><br>
                        <input class="form-control" required [(ngModel)]="email" placeholder="User email"><input class="form-control" type="password" required [(ngModel)]="password"  placeholder="Password"><br>
                        <button class="btn btn-primary" [disabled]="!(fname && lname && email && password)"  (click)="addEmployee()">Save</button>
                        </form>
                    <button class="btn btn-primary"  (click)="deleteEmployee()">Delete</button>
	  	            <div *ngIf="savedeleteempmsg"  style="color:Crimson">
                        {{savedeleteempmsg}}
		            </div>
                </div>
                <div *ngIf="selectedEmployee"><br> Assigned branches:
                    <label  class="checkbox-inline" *ngFor="#ccb of empnobranches | async" [style.color]="!ccb.checked ? 'red' : 'green'" >
                    <input  type="checkbox" (click)="addremovebranch(selectedEmployee, ccb.name, ccb.checked)" [checked]="ccb.checked"> {{ccb.name }}
                    </label>
                </div>
                <div >
                    Current mployee:
                    <label  *ngFor="#e of employees | async" >
                        <input class="radio-inline" type="radio" name="nemployees" value="{{e.fname}}{{e.lname}}"  (click)="selectEmployee(e)"> {{e.fname}} {{e.lname}}  &nbsp;
                    </label>
                </div>
        </div>
	    <div *ngIf="selectedStore" class="card">
            <div class="card-header card-inverse card-info">
                Card type
             </div>
                <form class="form-inline">
                <input class="form-control" required [(ngModel)]="cardname" placeholder="Card name"><input class="form-control" required [(ngModel)]="dollarpoints"  placeholder="Points for one dollar"><br>
                <button class="btn btn-primary" [disabled]="!(cardname && dollarpoints)"  (click)="addCardType()">Save</button>
                </form>
                <button class="btn btn-primary"  (click)="deleteCardType()">Delete</button>

                <div>
                    <label  *ngFor="#c of cardtypes | async" >
                        <input  class="radio-inline" type="radio" name="ncardtype" value="{{c.name}}({{c.dollarpoints}})"  (click)="cardname = c.name; dollarpoints = c.dollarpoints" > {{c.name}}({{c.dollarpoints}}) &nbsp;
                    </label>
                </div>
	    </div>
	</div>
  `
}) 

export class SetupStore implements OnInit {
    suredeletestore: boolean = false;
    face: string = ">>";
    savedeleteempmsg: string;
    assignmsg: string;
    assignemail: string;
    assignemployee: boolean = false;
    //messagesRef: Firebase;
    initialized: any = false;
    branch: string;
    branches: Observable<any[]> = null;
    empbranches: Observable<any[]> = null;
    empnobranches: Observable<any[]> = null;

    fname: string;
    lname: string;
    email: string;
    password: string;
    selectedEmployee: string
    employees: Observable<any[]>;

    storename: string;
    renewYears: number;
    maxPurchase: number;
    maxRedeem: number;

    cardname: string;
    dollarpoints: number;
    cardtypes: Observable<any[]>;

    static s_store: string;
    static s_item: any;
    static s_branch: string;
    selectedStore: string;
    stores: Observable<any[]>;

    err: string;
    parentRouter: any;
    uid: string;
    owner_fname: string;
    owner_lname: string;
    owner_email: string;

    jwt: string;
    decodedJwt: string;
    static gAuid: string;
    jwtHelper: JwtHelper = new JwtHelper();
    constructor(params: RouteParams, _parentRouter: Router, public af: AngularFire) {

        //this.messagesRef = Login.messagesRef;
        this.parentRouter = _parentRouter;
        if (!localStorage.getItem('uid')) {
            this.parentRouter.parent.navigateByUrl('/Signup');
        }
        this.jwt = localStorage.getItem('uid');
        //var uu = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        this.uid = this.jwt;// uu.d.uid;
        this.loadStore();
    }
    ngOnDestroy() {
        
    }
    loadStore() {
        this.stores = this.af.list("/users/" + this.uid + "/stores");
        let oo = this.stores;
        let sname = "";
        oo.subscribe(res => {
            if (res) {
                res.map(function (item) {
                    SetupStore.s_store = item.name;
                    SetupStore.s_item = item;
                    sname = item.name;

                });
            }
        }
        );
        setTimeout(() => {
           // console.log("sname:" + sname);

            if (SetupStore.s_store) {
                this.selectedStore = SetupStore.s_store;
                this.selectStore(SetupStore.s_item);
                let my: Observable<any> = this.af.object("/users/" + this.uid);
                my.subscribe(kk=> {
                    this.owner_fname = kk.fname;
                    this.owner_lname = kk.lname;
                    this.owner_email = kk.email;
                }
                );
            }
        }, 1000);
    }
    ngOnInit() {
        this.initialized = true;
    }
    SetButtonFace() {
        if (this.face === ">>") this.face = "<<";
        else this.face = ">>";
    }
    SaveStore(storename: string, renewYears: number, maxPurchase: number, maxRedeem: number) {

       // var usersRef = this.af.object("/users/" + this.uid);// this.messagesRef.child("users").child(this.uid);

        this.af.object("/users/" + this.uid + "/loginstores/"+ storename).update({
            ownerid: this.uid,
            name: storename
        });
        this.af.object("/users/" + this.uid + "/buyatstores/" + storename).update({
            ownerid: this.uid,
            name: storename
        });
        var rref = this.af.object("/users/" + this.uid+ "/stores/"+ storename);
        rref.update({
            name: storename,
            renewyears: renewYears,
            maxpurchase: maxPurchase,
            maxredeem: maxRedeem
        });
        if (this.owner_email && this.owner_fname && this.owner_lname)
            this.af.object("/users/" + this.uid + "/stores/" + storename + "/employees/"+ this.uid).update({
                uid: this.uid,
                email: this.owner_email,
                fname: this.owner_fname,
                lname: this.owner_lname
            });
   }
    selectStore(d: any) {
        this.selectedStore = d.name;
        this.storename = d.name;
        this.maxPurchase = d.maxpurchase;
        this.maxRedeem = d.maxredeem;
        this.renewYears = d.renewyears;
        this.branches = this.af.list("/users/"+ this.uid+ "/stores/"+ d.name + "/branches");
        this.cardtypes = this.af.list("/users/" + this.uid + "/stores/" + d.name + "/cardtypes");// observableFirebaseArray(this.messagesRef.child("users").child(this.uid).child("stores").child(d.name).child("cardtypes").limitToLast(100));
        this.employees = this.af.list("/users/" + this.uid + "/stores/" + d.name + "/employees");// observableFirebaseArray(this.messagesRef.child("users").child(this.uid).child("stores").child(d.name).child("employees").limitToLast(100));
        //oo.subscribe(res => {
        //    if (res) {
        //        res.map(function (item) {
        //            SetupStore.s_store = item.name;
        //            SetupStore.s_item = item;
        //        });
        //    }
        //}
        //);
    }
    deleteStore() {
        //this.selectedStore = d.name;
        //this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore)
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore).remove();
        this.suredeletestore = false;
        this.loadStore();
    }
    selectEmployee(e: any) {
        this.savedeleteempmsg = "";
        this.assignmsg = "";
        this.selectedEmployee = e.uid;
        this.fname = e.fname;
        this.lname = e.lname;
        this.email = e.email;
        this.resetEmployeeBranch();
        //console.log("Last branch holded:" + SetupStore.s_branch);
    }

    resetEmployeeBranch() {
        if (this.branches != null) {
            this.empbranches = this.af.list("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + this.selectedEmployee + "/branches");// observableFirebaseArray(this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(this.selectedEmployee).child("branches").limitToLast(100));

            this.empnobranches = Observable.combineLatest(this.branches, this.empbranches, (first: any[], second: any[]) => {
                var combinedArray: any[] = [];
                first.forEach(function (a) {
                    second.forEach(function (b) {
                        if (b.name === a.name)
                            a.checked = true;
                    });
                    combinedArray.push(a);
                });
                return combinedArray;
            });
        }
    }
    addremovebranch(empuid: string, name: string, isadded: boolean) {
        if (!isadded) {
            this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + empuid + "/branches/" + name) // this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(empuid)
                //.child("branches").child(name)
                .set({ name: name });
            //console.log("add:" + name + " for" + empuid + " owner:" + this.uid);
        }
        else {
            //this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(empuid)
            //    .child("branches").child(name)
            this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + empuid + "/branches/" + name)
                .remove();
            //console.log("remove:" + name + " for" + empuid);

        }
        this.resetEmployeeBranch();
    }
    deleteBranch() {
       // console.log("branch=" + this.branch);
        //this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("branches").child(this.branch)
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/branches/" + this.branch)
            .remove();
    }
    deleteCardType() {
       // this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("cardtypes").child(this.cardname)
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/cardtypes/" + this.cardname).remove();
    }
    deleteEmployee() {
        if (this.selectedEmployee !== this.uid)
           // this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(this.selectedEmployee)
            this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + this.selectedEmployee).remove();
        else this.savedeleteempmsg = "You cannot delete yourself !";
    }
    addBranch() {
        //var usersRef = this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("branches").child(this.branch);
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/branches/" + this.branch).update({
            name: this.branch,
            checked: false
        });
    }
    addCardType() {
        //var usersRef = this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("cardtypes").child(this.cardname);
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/cardtypes/" + this.cardname).update({
            name: this.cardname,
            dollarpoints: this.dollarpoints
        });
    }
    assignEmployeeTo(email: string) {
        this.assignmsg = "";
        SetupStore.gAuid = "";
        try {
            //var rref = this.af.object("/members/"+ Login.xemail(email));// this.messagesRef.child("members").child(Login.xemail(email));
            //console.log("YYY" + Login.xemail(email));
            this.email = email;
            var f: string = "";
            var l: string = "";
            this.fname = "";
            this.lname = "";
            var o: Observable<any> = this.af.object("/members/" + Login.xemail(email));// observableFirebaseObject(rref);
            var s = o.subscribe(res => {
                if (res && res.uid) {
                    SetupStore.gAuid = res.uid;
                    console.log("66" + res.uid);

                } else
                    console.log("100 === is null ....");
                console.log("55" );

            },
                e => console.log('onError: %s', e)
            );
            setTimeout(() => {

                if (SetupStore.gAuid) {
                    console.log("cc" + SetupStore.gAuid);
                    let oo: Observable<any> = this.af.object("/users/" + SetupStore.gAuid);//SetupStore.gAuid));
                    oo.subscribe(kk=> {
                        f = kk.fname;
                        l = kk.lname;
                        console.log("dd" + f + " gg" + l);
                        console.log("dd" + f + l);
                        if (f !== "" && l !== "") {
                            console.log("ee" + f + l);
                            //var usersRef = this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(SetupStore.gAuid);
                            this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + SetupStore.gAuid).update({
                                uid: SetupStore.gAuid,
                                email: this.email,
                                fname: f,
                                lname: l
                            });
                            this.fname = f;
                            this.lname = l;

                            this.processAddEmployee(false);
                        }

                    },
                        e => console.log('onError2: %s', e),
                        () => {
                            console.log('onCompleted')
                        }
                    );

                }
            }, 1000);
        } catch (err) {
            console.log("Attn:" + err);
        }
    }
    processAddEmployee(isaddbaseinfo:boolean) {
        console.log("processAddEmployee ..gAuid:" + SetupStore.gAuid );
        var r2 = this.af.object("/users/" + SetupStore.gAuid);//this.messagesRef.child("users").child(SetupStore.gAuid);

        if (isaddbaseinfo) {
            r2.update({
                uid: SetupStore.gAuid,
                email: this.email,
                fname: this.fname,
                lname: this.lname,
                ismember: true,
                isemployee: true
            });
        }
        this.af.object("/users/" + SetupStore.gAuid + "/loginstores/"+ this.selectedStore).update({
            ownerid: this.uid,//store owner id
            name: this.selectedStore
        });
        this.af.object("/users/" + SetupStore.gAuid + "/buyatstores/"+ this.selectedStore).update({
            ownerid: this.uid,//store owner id
            name: this.selectedStore
        });

        var rref = this.af.object("/members/"+ Login.xemail(this.email));
        rref.update({
            uid: SetupStore.gAuid,
            email: this.email
        });
        //console.log("added member");
        var usersRef = this.af.object("/users/" + this.uid + "/buyatstores/" + this.selectedStore + "/employees/" + SetupStore.gAuid);// this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(SetupStore.gAuid);
        usersRef.update({
            uid: SetupStore.gAuid,
            email: this.email,
            fname: this.fname,
            lname: this.lname
        });
    }
    addEmployee() {
        this.assignmsg = "";
        this.savedeleteempmsg = "";
        var employeeuid: string;
        let hasError = false;
        let emailExist = false;
        this.af.auth.createUser({
            email: this.email,
            password: this.password
        }).then((authData) => {
            SetupStore.gAuid = authData.uid;
        }
        ).catch((error) => {
            hasError = true;
            switch (error.code) {
                case "EMAIL_TAKEN":
                    emailExist = true;
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email." + this.email);
                    break;
                default:
                    console.log("Error creating user:", error);
            }
        });
        //, function (error, userData) {
        //    if (error) {
        //        hasError = true;
        //        switch (error.code) {
        //            case "EMAIL_TAKEN":
        //                emailExist = true;
        //                console.log("The new user account cannot be created because the email is already in use.");
        //                break;
        //            case "INVALID_EMAIL":
        //                console.log("The specified email is not a valid email." + this.email);
        //                break;
        //            default:
        //                console.log("Error creating user:", error);
        //        }
        //        return;
        //    } else {
        //        SetupStore.gAuid = userData.uid;
        //    }
        //});

        setTimeout(() => {
            if (!hasError)
                this.processAddEmployee(true);
            else if (emailExist) {
                this.savedeleteempmsg = "This user account is existing. Assign the user as employee.";
                this.assignEmployeeTo(this.email);
            }
        }, 1000);
    }

}