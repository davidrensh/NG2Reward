import { bootstrap } from 'angular2/platform/browser';
import {Component, NgZone, Directive, Attribute, ElementRef, DynamicComponentLoader, Pipe, PipeTransform} from 'angular2/core';
import { FORM_DIRECTIVES, CORE_DIRECTIVES, DatePipe, NgIf,NgFor} from 'angular2/common';
import { JwtHelper } from './angular2-jwt';
import {Login} from "./Login";

import {
ROUTER_DIRECTIVES,
ROUTER_PROVIDERS,
HashLocationStrategy,
LocationStrategy,
RouteConfig, Router, RouterOutlet, RouteParams, RouterLink, ComponentInstruction
} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
//import {observableFirebaseObject, observableFirebaseArray, existFirebaseChild} from './myfbOb';

import {AngularFire, FirebaseAuth} from 'angularfire2';

@Component({
    selector: 'home',
    directives: [ROUTER_DIRECTIVES],
    template: `
    <div  *ngIf="selectedStore ===  null || selectedBranch === null || selectedStore === '' || selectedBranch === '' || swicthlocation">
        Choose your store:<br/>
            <label *ngFor="#d of employeestores | async" >
                <input  class="radio-inline" *ngIf="d.name" type="radio" name= "nstores" value="{{d.name}}" (click)="selectStore(d.name,d.ownerid)"  checked="checked"> {{d.name }} &nbsp;
            </label>
        <input class="form-control" [hidden]="1" [(ngModel)]="selectedStore" placeholder="Current store">
        <div *ngIf="selectedStore">
            <button class="btn btn-primary" [disabled]="!selectedStore" [hidden]="suredeletestore"  (click)="suredeletestore = true">Delete</button>
            <button class="btn btn-primary" [hidden]="!selectedStore || !suredeletestore"  (click)="deleteStore()"  style="color:Crimson">Sure to delete? Yes</button>
            <button class="btn btn-primary" [hidden]="!selectedStore || !suredeletestore"  (click)="suredeletestore = false"  style="color:DarkGreen">Sure to delete? Cancel</button>
        <br/>
        Choose your branch:
            <label *ngFor="#b of empBranches | async" >
                <input  class="radio-inline" type="radio" name= "nBranches" value="{{b.name}}" (click)="selectBranch(b.name)"  checked="checked"> {{b.name }} &nbsp;
            </label>
        <input class="form-control" [hidden]="1" [(ngModel)]="selectedBranch" placeholder="Select one branch from above branch list.">
        </div>
    </div>
  <div *ngIf="selectedStore && selectedBranch">
   Welcome to : {{selectedStore}} - {{selectedBranch}} &nbsp; 
    <button class="btn btn-primary" *ngIf="!swicthlocation"  (click)="swicthlocation = !swicthlocation">Switch Location>></button>
    <button class="btn btn-primary" *ngIf="swicthlocation"  (click)="swicthlocation = !swicthlocation"><<</button>
    <br>

	<div>
        <input class="form-control" [(ngModel)]="cardemail" (keyup)="doneTyping($event)" placeholder="Swipe card">
            <button class="btn btn-primary" [hidden]="!cardemail"  (click)="loadCard(cardemail)">Go</button> 
            <button class="btn btn-primary" [hidden]="!cardemail"  (click)="issuecard = !issuecard">Issue card</button>
            <br>
        <div *ngIf="issuecard">
            <label  *ngIf="!cardexistinstore && calledload"> Card is not exist in this store. Please assign card to customer. </label>
            <label  *ngFor="#c of cardtypes | async" >
                <input  class="radio-inline" type="radio" name="ncardtype" value="{{c.name}}({{c.dollarpoints}})"  (click)="assginCard(cardemail, c.name)" > {{c.name}}({{c.dollarpoints}}) &nbsp;
            </label>            
        </div>
        <div *ngIf="cardloaded && cardtype" name="cardinfo">{{lasts}}
          {{name}} &nbsp; {{points}} pts. (Type: {{cardtype}})<br>
          Last swipe:{{last}} &nbsp; <br>Expiry:{{expiry}}
        </div>
	</div>
    <div *ngIf="cardloaded && cardtype">
        <input class="radio-inline" type="radio" name="ntype" value="0" (click)="ptype = 0" checked> Purchase <button class="btn btn-primary"  *ngIf="!showMore"   (click)="showMore = !showMore">...</button>
        <span *ngIf="showMore" >
            <input class="radio-inline" type="radio" name= "ntype" value="1" (click)="ptype = 1" > Redeem 
            <input class="radio-inline" type="radio" name= "ntype" value="2" (click)="ptype = 2" > Return
            <input class="radio-inline" type="radio" name= "ntype" value="3" (click)="ptype = 3" > Renew<br>
        </span>
        <div *ngIf="ptype > -1">
            <input class="form-control" [(ngModel)]="inumber"  placeholder="Invoice number"><br>
            <input class="form-control" *ngIf="ptype === 0 || ptype === 3" [(ngModel)]="itotal" (keyup)="doneSubmitTyping($event)"  placeholder="Invoice total$">
            <input class="form-control" *ngIf="ptype === 2" [(ngModel)]="itotal" placeholder="Return total$">
            <input class="form-control" *ngIf="ptype === 1" [(ngModel)]="redeempoints" (keyup)="doneSubmitTyping($event)" placeholder="Total points">
            <br>
           <div  *ngIf="ptype === 2"> <input class="form-control" [(ngModel)]="reason" (keyup)="doneSubmitTyping($event)" placeholder="Reason"><br>
           </div>

            <div *ngIf="err !== ''" style="color:Crimson" >{{err}}<br></div>
            <button class="btn btn-primary"   (click)="submit()">Submit</button>
        </div>
    </div>

 </div>
<div *ngIf="store == '' || branch ==''" class="home">
    For store owner, please click <a [routerLink]="['/SetupStore']">Store management</a> <br>
    For employee, please login and select proper store / location.<br>
    <a [routerLink]="['/Login']">Login</a>
</div>
  `
}) 

export class EmployeeHome {
    suredeletestore: boolean = false;

    swicthlocation: boolean = false;
    cardloaded: boolean = false;
    issuecard: boolean = false;
    cardtypes: Observable<any[]>;
    //messagesRef: Firebase;
    //store: string;
    //branch: string;
    cardemail: string;
    carduid: string;
    name: string;
    points: number;
    last: string;
    //lasts: string;
    expiry: string;
    cardtype: string;

    itotal: number;
    reason: string;
    inumber: string;
    redeempoints: number;
    ptype: number;
    private parentRouter: Router;
    
    showMore: boolean;
    err: string;
    dollarpoints: number = 1;
    renewYears: number = 1;
    maxPurchase: number = 1000;
    maxRedeem: number = 1000;

    static s_store: string;
    static s_branch: string;
    static s_ownerid: string;

    employeeuid: string;
    storeownerid: string;
    jwt: string;
    decodedJwt: string;
    jwtHelper: JwtHelper = new JwtHelper();

    employeestores: Observable<any[]>;
    selectedStore: string = "";
    selectedBranch: string = "";
    empBranches: Observable<any[]>;
    cardexistinstore: boolean = false;
    calledload: boolean = false;
    constructor(params: RouteParams, _parentRouter: Router, public af: AngularFire) {
        //,_elementRef: ElementRef, _loader: DynamicComponentLoader,
        //_parentRouter: Router, @Attribute('name') nameAttr: string) {
        //super(_elementRef, _loader, _parentRouter, nameAttr);
        //this.messagesRef = Login.messagesRef;
        this.ptype = 0;
        this.showMore = false;
        //this.store = params.get('a');
        //this.branch = params.get('b');
        //this.store = localStorage.getItem('store'); //params.get('a');
        //this.branch = localStorage.getItem('branch'); //params.get('b');

        this.parentRouter = _parentRouter;
        if (!localStorage.getItem('uid')) {
            this.parentRouter.parent.navigateByUrl('/Login');
        }
        this.jwt = localStorage.getItem('uid');
        //var uu = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        this.employeeuid = this.jwt;// uu.d.uid;
        this.loadStores();
    }
    loadStores() {
       // var r = this.messagesRef.child("users").child(this.employeeuid).child("loginstores");
        this.employeestores = this.af.list("/users/"+ this.employeeuid+ "/loginstores");// observableFirebaseArray(r);

        let ostores: Observable<any> = this.af.object("/users/" + this.employeeuid + "/loginstores");// observableFirebaseObject(r);
        ostores.subscribe(res => {
            //console.log("Here 2 :" + res.laststorename);
            if (res.laststorename && res.lastownerid && res.lastbranch) {
                this.selectedStore = res.laststorename;
                this.storeownerid = res.lastownerid;
                this.selectedBranch = res.lastbranch;
            } else {
                this.swicthlocation = true;
            }
        }
        );

        this.employeestores.subscribe(res => {
            res.map(function (item) {
                //console.log("name:" + item.name + " id=" + item.ownerid);
                EmployeeHome.s_store = item.name;
                EmployeeHome.s_ownerid = item.ownerid;
            });
        }
        );
        setTimeout(() => {
            //console.log("storename:" + EmployeeHome.s_store + " id=" + EmployeeHome.s_ownerid);
            if (!this.selectedStore || !this.storeownerid || !this.selectedBranch) {
                if (EmployeeHome.s_store && EmployeeHome.s_ownerid) {
                    //console.log("storename3:" + EmployeeHome.s_store + " id3=" + EmployeeHome.s_ownerid);
                    this.selectedStore = EmployeeHome.s_store;
                    this.storeownerid = EmployeeHome.s_ownerid;
                    this.selectStore(EmployeeHome.s_store, EmployeeHome.s_ownerid);
                }
            }
        }, 1200);
    }
    deleteStore() {
        //console.log("aaa" + this.employeeuid + this.selectedStore);
       // this.messagesRef.child("users").child(this.employeeuid).child("loginstores").child(this.selectedStore)
        this.af.object("/users/" + this.employeeuid + "/loginstores/" + this.selectedStore).remove();
        this.suredeletestore = false;
        this.loadStores();
        //console.log("bbb");
    }
    selectBranch(name: string) {
        this.selectedBranch = name;
        //this.messagesRef.child("users").child(this.employeeuid).child("loginstores")
        this.af.object("/users/" + this.employeeuid + "/loginstores").update({
            lastbranch: name
        });

     }
    selectStore(name: string, owner: string) {
        this.selectedStore = name;
        this.storeownerid = owner;
        //console.log("owner" + owner + " name" + name + "emp" + this.employeeuid);

       // this.messagesRef.child("users").child(this.employeeuid).child("loginstores")
        this.af.object("/users/" + this.employeeuid + "/loginstores").update({
            lastownerid: this.storeownerid,
            laststorename: this.selectedStore
        });

        //var rref = this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.selectedStore);
        let ostore: Observable<any> = this.af.object("/users/" + this.storeownerid + "/stores/" + this.selectedStore);// observableFirebaseObject(rref);
        ostore.subscribe(res => {
            this.renewYears = res.renewYears,
            this.maxPurchase = res.maxpurchase;
            this.maxRedeem = res.maxredeem;
        }
        );
        setTimeout(() => {
            //console.log("selected store is: " + this.selectedStore);
            this.empBranches = this.af.list("/users/" + owner + "/stores/" + name + "/employees/" + this.employeeuid + "/branches");
           // observableFirebaseArray(Login.messagesRef.child("users").child(owner).child("stores").child(name).child("employees").child(this.employeeuid).child("branches").limitToLast(100));
            this.cardtypes = this.af.list("/users/" + owner + "/stores/" + name + "/employees/" + this.employeeuid + "/cardtypes");
            //observableFirebaseArray(this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.selectedStore).child("cardtypes").limitToLast(100));
            this.empBranches.subscribe(res => {
                    res.map(function (item) {
                        //console.log("name:" + item.name + " id=" + item.ownerid);
                        EmployeeHome.s_branch = item.name;
                    });
            }
            );
        }, 1000);
        setTimeout(() => {
            if (EmployeeHome.s_branch) {
                this.selectBranch(EmployeeHome.s_branch);
            }
        }, 2000);
     }
    assginCard(cardemail: string, cardname: string) {
        //console.log("assginCard");
        //this.messagesRef.child("members").child(Login.xemail(cardemail)).child("stores").child(this.selectedStore)
        this.af.object("/members/"+ Login.xemail(cardemail)+ "/stores/"+ this.selectedStore)
            .update({
            ownerid: this.storeownerid,
            storename: this.selectedStore,
            cardtype: cardname,
            points: 0,
            lastswip: (new Date()).toISOString(),
            lastlogin: (new Date()).toISOString()
        });
        this.loadCard(cardemail);
    }
    loadCard(cardemail: string) {
        this.err = "";
        //var usersRef = this.messagesRef.child("members").child(Login.xemail(cardemail));
        this.cardtype = null;
        this.issuecard = true;
        this.cardloaded = false;
        this.cardexistinstore = false;
        this.calledload = true;
        this.carduid = "";
        //console.log("a1:" + this.selectedStore);
        this.af.object("/members/" + Login.xemail(cardemail) + "/stores/" + this.selectedStore).subscribe(res => {
            if (res) {
                this.cardexistinstore = true;
            }
        }
        );
        
        //let oexist = existFirebaseChild(
        //   // usersRef.child("stores").child(this.selectedStore)
        //     this.af.object("/members/" + Login.xemail(cardemail) + "/stores/" + this.selectedStore)
        //);
        //oexist.subscribe(res => {
        //    if (res) {
                
        //        this.cardexistinstore = res;
        //        //console.log("aa3:" + this.cardexistinstore + " res" + res);
        //    }
        //}
        //);

        //usersRef.child("stores").child(this.selectedStore).once('value', function (snapshot) {
        //    //console.log("a2:");
        //    this.cardexistinstore = snapshot.exists();
        //    console.log("a2 2:" + this.cardexistinstore );

        //});
        
        setTimeout(() => {
           // console.log("a3 1:" + this.cardexistinstore);
            if (this.cardexistinstore) {
                //console.log("a3 2");
                this.processload(Login.xemail(cardemail));

                this.cardloaded = true;
            } else {
                this.cardloaded = false;
            }
        }, 1000);
    }
    processload(emailx: string) {
        //console.log("a3 2");
        let o2: Observable<any> = this.af.object("/members/" + emailx + "/stores/" + this.selectedStore);
           // observableFirebaseObject(this.messagesRef.child("members").child(emailx).child("stores").child(this.selectedStore));
        o2.subscribe(res => {
            if (res) {
                //console.log("a3:" + JSON.stringify(res));
                this.last = res.last;// new Date(res.last).toISOString().substr(0, 10);
                //console.log("a31:" + res.last);
                //not working at iPhone chrome and safari
                //this.lasts = new DatePipe().transform(new Date(res.last), ['yyyy-MM-dd']); 
                //this.lasts = (new Date(res.last)).toISOString();
                this.points = res.points;
                this.cardtype = res.cardtype;
                this.issuecard = false;
                //console.log("a32:" + this.cardtype);
                this.expiry = res.expiry;// new Date(res.expiry).toISOString().substr(0, 10);
                this.last = res.last;// new Date(res.last).toISOString().substr(0, 10);
                //console.log("load points:" + this.points);
            }
        }
        );

        //setTimeout(() => {
        let o: Observable<any> = this.af.object("/members/" + emailx);// observableFirebaseObject(this.messagesRef.child("members").child(emailx));
        o.subscribe(res => {
            if (res) {
                this.carduid = res.uid;
                //console.log("load uid:" + this.carduid);
                if (res.uid === undefined) {
                    this.cardloaded = false;
                }
            }
        }
        );
        //}, 1000);

        setTimeout(() => {
            ///console.log("kkk");
            let op: Observable<any> = this.af.object("/users/" + this.carduid);// observableFirebaseObject(this.messagesRef.child("users").child(this.carduid));
            op.subscribe(res => {
                if (res) {
                    this.name = res.fname + " " + res.lname;
                }
            }
            );
            if (this.cardtype) {
               // var rr = this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.selectedStore).child("cardtypes").child(this.cardtype);
                let o3: Observable<any> = this.af.object("/users/" + this.storeownerid + "/stores/" + this.selectedStore + "/cardtypes/" + this.cardtype);
                //observableFirebaseObject(rrcardtype
                o3.subscribe(res => {
                    this.dollarpoints = res.dollarpoints;
                    //console.log("load dollarpoints:" + this.dollarpoints);
                    this.cardloaded = true;
                }
                );
            }
        }, 1100);
    }
    doneTyping($event) {
        this.err = "";
        if ($event.which === 13) {
            this.loadCard(this.cardemail);
        } else this.cleanCardInfo();
    }
    doneSubmitTyping($event) {
        if ($event.which === 13) {
            this.submit();
        }
    }
    submit() {
        this.err = "";
        //var r2 = this.messagesRef.child("users").child(this.carduid);
        //r2.child("buyatstores").child(this.selectedStore)
        this.af.object("/users/" + this.carduid + "/buyatstores/" + this.selectedStore)
            .update({
            ownerid: this.storeownerid,
            name: this.selectedStore
        });
        switch (this.ptype) {
            case 0:
                if (this.itotal >= 0)
                    if (this.itotal <= this.maxPurchase)
                        this.AddTransaction(this.cardemail, this.itotal * this.dollarpoints, this.ptype, this.inumber, this.itotal, "");
                    else
                        this.err = "Entered total amount: " + this.itotal + " over max purchase limit" + this.maxPurchase + ".";
                else 
                    this.err = "Please enter correct total amount.";
                break;
            case 1:
                if (this.itotal >= 0)
                    if (this.redeempoints <= this.maxRedeem)
                    {
                        if (this.redeempoints <= this.points)
                            this.AddTransaction(this.cardemail, - this.redeempoints, this.ptype, this.inumber, 0, "");
                        else
                            this.err = "No enough points to redeem.";
                    } else 
                        this.err = "Entered total redemm points:" + this.redeempoints + " over max redeem limit." + this.maxRedeem;
                else
                    this.err = "Please enter correct total points.";
                break;
            case 2:
                if (this.itotal >= 0)
                    if (this.itotal <= this.maxPurchase)
                        this.AddTransaction(this.cardemail, - this.itotal * this.dollarpoints, this.ptype, this.inumber, this.itotal, this.reason);
                    else
                        this.err = "Entered total amount: " + this.itotal + " over max purchase limit" + this.maxPurchase + ".";
                else
                    this.err = "Please enter correct total return amount.";
                break;
            case 3:
                if (this.itotal >= 0)
                    if (this.itotal <= this.maxPurchase) {
                        this.AddTransaction(this.cardemail, this.itotal * this.dollarpoints, this.ptype, this.inumber, this.itotal, "");
                        this.renew(this.carduid);
                    }
                    else
                        this.err = "Entered total amount: " + this.itotal + " over max purchase limit" + this.maxPurchase + ".";
                else
                    this.err = "Please enter correct total amount.";
                break;
        }
        if (this.err == "") {
            this.cardloaded = false;
            this.clean();
        }
    }
    cleanCardInfo() {
        this.calledload = false;
        this.name = "";
        this.points = 0;
        this.cardtype = "";
        this.last = null;
        this.expiry = null;
        this.err = "";
        this.itotal = 0;
        this.inumber = "";
        this.reason = "";
        this.ptype = 0;
        this.showMore = false;
    }
    clean() {
        this.cardemail = "";
        this.cleanCardInfo();
    }
    AddTransaction(cardemail: string, mpoints: number, ptype: number, invoice: string, totaldollar: number, reason: string) {
       
        //var usersRef = this.messagesRef.child("members").child(Login.xemail(cardemail));
        let totalP = this.points + mpoints;
       // usersRef.child("stores").child(this.selectedStore)
        this.af.object("/members/" + Login.xemail(cardemail) + "/stores/"+ this.selectedStore)
            .update({
            last: (new Date).toISOString(),
            points: totalP
        });

        //var trans = this.messagesRef.child("xyz").child(this.storeownerid).child(this.selectedStore);
        //trans.push({
        //    uid: this.carduid,
        //    cardtype:this.cardtype,
        //    ttype: ptype,
        //    invoice:invoice,
        //    points: totalP,
        //    totaldollar: totaldollar,
        //    reason: reason,
        //    ownerid: this.storeownerid,
        //    branch: this.selectedBranch,
        //    empid:this.employeeuid
        //});

        var trans3 = this.af.list("/users/" + this.storeownerid + "/stores/" + this.selectedStore + "/transaction");
        //this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.selectedStore).child("transaction");
        trans3.push({
            uid: this.carduid,
            date: (new Date).toISOString(),
            cardtype: this.cardtype,
            ttype: ptype,
            invoice: invoice,
            points: totalP,
            totaldollar: totaldollar,
            reason: reason,
            ownerid: this.storeownerid,
            branch: this.selectedBranch,
            empid: this.employeeuid
        });

        var trans2 = this.af.list("/users/" + this.carduid + "/buyatstores/" + this.selectedStore + "/transaction");
        //this.messagesRef.child("users").child(this.carduid).child("buyatstores").child(this.selectedStore).child("transaction");
        trans2.push({
            uid: this.carduid,
            date: (new Date).toISOString(),
            cardtype: this.cardtype,
            ttype: ptype,
            invoice: invoice,
            points: totalP,
            totaldollar: totaldollar,
            reason: reason,
            ownerid: this.storeownerid,
            branch: this.selectedBranch,
            empid: this.employeeuid
        });
    }

    renew(card: string) {
        
       // var usersRef = this.messagesRef.child("members").child(Login.xemail(this.cardemail));

        //usersRef.child("stores").child(this.selectedStore)
        this.af.object("/members/" + Login.xemail(this.cardemail) + "/stores/" + this.selectedStore).update({
            expiry: new Date(this.expiry) < (new Date) ? (new Date).setFullYear((new Date).getFullYear() + this.renewYears) : new Date(this.expiry).setFullYear(new Date(this.expiry).getFullYear() + this.renewYears)
        });
    }

}