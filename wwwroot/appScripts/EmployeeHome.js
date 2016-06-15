"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var angular2_jwt_1 = require('./angular2-jwt');
var Login_1 = require("./Login");
var router_1 = require('angular2/router');
//import {observableFirebaseObject, observableFirebaseArray, existFirebaseChild} from './myfbOb';
var angularfire2_1 = require('angularfire2');
var EmployeeHome = (function () {
    function EmployeeHome(params, _parentRouter, af) {
        this.af = af;
        this.suredeletestore = false;
        this.swicthlocation = false;
        this.cardloaded = false;
        this.issuecard = false;
        this.dollarpoints = 1;
        this.renewYears = 1;
        this.maxPurchase = 1000;
        this.maxRedeem = 1000;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.selectedStore = "";
        this.selectedBranch = "";
        this.cardexistinstore = false;
        this.calledload = false;
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
        this.employeeuid = this.jwt; // uu.d.uid;
        this.loadStores();
    }
    EmployeeHome.prototype.loadStores = function () {
        var _this = this;
        // var r = this.messagesRef.child("users").child(this.employeeuid).child("loginstores");
        this.employeestores = this.af.list("/users/" + this.employeeuid + "/loginstores"); // observableFirebaseArray(r);
        var ostores = this.af.object("/users/" + this.employeeuid + "/loginstores"); // observableFirebaseObject(r);
        ostores.subscribe(function (res) {
            //console.log("Here 2 :" + res.laststorename);
            if (res.laststorename && res.lastownerid && res.lastbranch) {
                _this.selectedStore = res.laststorename;
                _this.storeownerid = res.lastownerid;
                _this.selectedBranch = res.lastbranch;
            }
            else {
                _this.swicthlocation = true;
            }
        });
        this.employeestores.subscribe(function (res) {
            res.map(function (item) {
                //console.log("name:" + item.name + " id=" + item.ownerid);
                EmployeeHome.s_store = item.name;
                EmployeeHome.s_ownerid = item.ownerid;
            });
        });
        setTimeout(function () {
            //console.log("storename:" + EmployeeHome.s_store + " id=" + EmployeeHome.s_ownerid);
            if (!_this.selectedStore || !_this.storeownerid || !_this.selectedBranch) {
                if (EmployeeHome.s_store && EmployeeHome.s_ownerid) {
                    //console.log("storename3:" + EmployeeHome.s_store + " id3=" + EmployeeHome.s_ownerid);
                    _this.selectedStore = EmployeeHome.s_store;
                    _this.storeownerid = EmployeeHome.s_ownerid;
                    _this.selectStore(EmployeeHome.s_store, EmployeeHome.s_ownerid);
                }
            }
        }, 1200);
    };
    EmployeeHome.prototype.deleteStore = function () {
        //console.log("aaa" + this.employeeuid + this.selectedStore);
        // this.messagesRef.child("users").child(this.employeeuid).child("loginstores").child(this.selectedStore)
        this.af.object("/users/" + this.employeeuid + "/loginstores/" + this.selectedStore).remove();
        this.suredeletestore = false;
        this.loadStores();
        //console.log("bbb");
    };
    EmployeeHome.prototype.selectBranch = function (name) {
        this.selectedBranch = name;
        //this.messagesRef.child("users").child(this.employeeuid).child("loginstores")
        this.af.object("/users/" + this.employeeuid + "/loginstores").update({
            lastbranch: name
        });
    };
    EmployeeHome.prototype.selectStore = function (name, owner) {
        var _this = this;
        this.selectedStore = name;
        this.storeownerid = owner;
        //console.log("owner" + owner + " name" + name + "emp" + this.employeeuid);
        // this.messagesRef.child("users").child(this.employeeuid).child("loginstores")
        this.af.object("/users/" + this.employeeuid + "/loginstores").update({
            lastownerid: this.storeownerid,
            laststorename: this.selectedStore
        });
        //var rref = this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.selectedStore);
        var ostore = this.af.object("/users/" + this.storeownerid + "/stores/" + this.selectedStore); // observableFirebaseObject(rref);
        ostore.subscribe(function (res) {
            _this.renewYears = res.renewYears,
                _this.maxPurchase = res.maxpurchase;
            _this.maxRedeem = res.maxredeem;
        });
        setTimeout(function () {
            //console.log("selected store is: " + this.selectedStore);
            _this.empBranches = _this.af.list("/users/" + owner + "/stores/" + name + "/employees/" + _this.employeeuid + "/branches");
            // observableFirebaseArray(Login.messagesRef.child("users").child(owner).child("stores").child(name).child("employees").child(this.employeeuid).child("branches").limitToLast(100));
            _this.cardtypes = _this.af.list("/users/" + owner + "/stores/" + name + "/employees/" + _this.employeeuid + "/cardtypes");
            //observableFirebaseArray(this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.selectedStore).child("cardtypes").limitToLast(100));
            _this.empBranches.subscribe(function (res) {
                res.map(function (item) {
                    //console.log("name:" + item.name + " id=" + item.ownerid);
                    EmployeeHome.s_branch = item.name;
                });
            });
        }, 1000);
        setTimeout(function () {
            if (EmployeeHome.s_branch) {
                _this.selectBranch(EmployeeHome.s_branch);
            }
        }, 2000);
    };
    EmployeeHome.prototype.assginCard = function (cardemail, cardname) {
        //console.log("assginCard");
        //this.messagesRef.child("members").child(Login.xemail(cardemail)).child("stores").child(this.selectedStore)
        this.af.object("/members/" + Login_1.Login.xemail(cardemail) + "/stores/" + this.selectedStore)
            .update({
            ownerid: this.storeownerid,
            storename: this.selectedStore,
            cardtype: cardname,
            points: 0,
            lastswip: (new Date()).toISOString(),
            lastlogin: (new Date()).toISOString()
        });
        this.loadCard(cardemail);
    };
    EmployeeHome.prototype.loadCard = function (cardemail) {
        var _this = this;
        this.err = "";
        //var usersRef = this.messagesRef.child("members").child(Login.xemail(cardemail));
        this.cardtype = null;
        this.issuecard = true;
        this.cardloaded = false;
        this.cardexistinstore = false;
        this.calledload = true;
        this.carduid = "";
        //console.log("a1:" + this.selectedStore);
        this.af.object("/members/" + Login_1.Login.xemail(cardemail) + "/stores/" + this.selectedStore).subscribe(function (res) {
            if (res) {
                _this.cardexistinstore = true;
            }
        });
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
        setTimeout(function () {
            // console.log("a3 1:" + this.cardexistinstore);
            if (_this.cardexistinstore) {
                //console.log("a3 2");
                _this.processload(Login_1.Login.xemail(cardemail));
                _this.cardloaded = true;
            }
            else {
                _this.cardloaded = false;
            }
        }, 1000);
    };
    EmployeeHome.prototype.processload = function (emailx) {
        var _this = this;
        //console.log("a3 2");
        var o2 = this.af.object("/members/" + emailx + "/stores/" + this.selectedStore);
        // observableFirebaseObject(this.messagesRef.child("members").child(emailx).child("stores").child(this.selectedStore));
        o2.subscribe(function (res) {
            if (res) {
                //console.log("a3:" + JSON.stringify(res));
                _this.last = res.last; // new Date(res.last).toISOString().substr(0, 10);
                //console.log("a31:" + res.last);
                //not working at iPhone chrome and safari
                //this.lasts = new DatePipe().transform(new Date(res.last), ['yyyy-MM-dd']); 
                //this.lasts = (new Date(res.last)).toISOString();
                _this.points = res.points;
                _this.cardtype = res.cardtype;
                _this.issuecard = false;
                //console.log("a32:" + this.cardtype);
                _this.expiry = res.expiry; // new Date(res.expiry).toISOString().substr(0, 10);
                _this.last = res.last; // new Date(res.last).toISOString().substr(0, 10);
            }
        });
        //setTimeout(() => {
        var o = this.af.object("/members/" + emailx); // observableFirebaseObject(this.messagesRef.child("members").child(emailx));
        o.subscribe(function (res) {
            if (res) {
                _this.carduid = res.uid;
                //console.log("load uid:" + this.carduid);
                if (res.uid === undefined) {
                    _this.cardloaded = false;
                }
            }
        });
        //}, 1000);
        setTimeout(function () {
            ///console.log("kkk");
            var op = _this.af.object("/users/" + _this.carduid); // observableFirebaseObject(this.messagesRef.child("users").child(this.carduid));
            op.subscribe(function (res) {
                if (res) {
                    _this.name = res.fname + " " + res.lname;
                }
            });
            if (_this.cardtype) {
                // var rr = this.messagesRef.child("users").child(this.storeownerid).child("stores").child(this.selectedStore).child("cardtypes").child(this.cardtype);
                var o3 = _this.af.object("/users/" + _this.storeownerid + "/stores/" + _this.selectedStore + "/cardtypes/" + _this.cardtype);
                //observableFirebaseObject(rrcardtype
                o3.subscribe(function (res) {
                    _this.dollarpoints = res.dollarpoints;
                    //console.log("load dollarpoints:" + this.dollarpoints);
                    _this.cardloaded = true;
                });
            }
        }, 1100);
    };
    EmployeeHome.prototype.doneTyping = function ($event) {
        this.err = "";
        if ($event.which === 13) {
            this.loadCard(this.cardemail);
        }
        else
            this.cleanCardInfo();
    };
    EmployeeHome.prototype.doneSubmitTyping = function ($event) {
        if ($event.which === 13) {
            this.submit();
        }
    };
    EmployeeHome.prototype.submit = function () {
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
                    if (this.redeempoints <= this.maxRedeem) {
                        if (this.redeempoints <= this.points)
                            this.AddTransaction(this.cardemail, -this.redeempoints, this.ptype, this.inumber, 0, "");
                        else
                            this.err = "No enough points to redeem.";
                    }
                    else
                        this.err = "Entered total redemm points:" + this.redeempoints + " over max redeem limit." + this.maxRedeem;
                else
                    this.err = "Please enter correct total points.";
                break;
            case 2:
                if (this.itotal >= 0)
                    if (this.itotal <= this.maxPurchase)
                        this.AddTransaction(this.cardemail, -this.itotal * this.dollarpoints, this.ptype, this.inumber, this.itotal, this.reason);
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
    };
    EmployeeHome.prototype.cleanCardInfo = function () {
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
    };
    EmployeeHome.prototype.clean = function () {
        this.cardemail = "";
        this.cleanCardInfo();
    };
    EmployeeHome.prototype.AddTransaction = function (cardemail, mpoints, ptype, invoice, totaldollar, reason) {
        //var usersRef = this.messagesRef.child("members").child(Login.xemail(cardemail));
        var totalP = this.points + mpoints;
        // usersRef.child("stores").child(this.selectedStore)
        this.af.object("/members/" + Login_1.Login.xemail(cardemail) + "/stores/" + this.selectedStore)
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
    };
    EmployeeHome.prototype.renew = function (card) {
        // var usersRef = this.messagesRef.child("members").child(Login.xemail(this.cardemail));
        //usersRef.child("stores").child(this.selectedStore)
        this.af.object("/members/" + Login_1.Login.xemail(this.cardemail) + "/stores/" + this.selectedStore).update({
            expiry: new Date(this.expiry) < (new Date) ? (new Date).setFullYear((new Date).getFullYear() + this.renewYears) : new Date(this.expiry).setFullYear(new Date(this.expiry).getFullYear() + this.renewYears)
        });
    };
    EmployeeHome = __decorate([
        core_1.Component({
            selector: 'home',
            directives: [router_1.ROUTER_DIRECTIVES],
            template: "\n    <div  *ngIf=\"selectedStore ===  null || selectedBranch === null || selectedStore === '' || selectedBranch === '' || swicthlocation\">\n        Choose your store:<br/>\n            <label *ngFor=\"#d of employeestores | async\" >\n                <input  class=\"radio-inline\" *ngIf=\"d.name\" type=\"radio\" name= \"nstores\" value=\"{{d.name}}\" (click)=\"selectStore(d.name,d.ownerid)\"  checked=\"checked\"> {{d.name }} &nbsp;\n            </label>\n        <input class=\"form-control\" [hidden]=\"1\" [(ngModel)]=\"selectedStore\" placeholder=\"Current store\">\n        <div *ngIf=\"selectedStore\">\n            <button class=\"btn btn-primary\" [disabled]=\"!selectedStore\" [hidden]=\"suredeletestore\"  (click)=\"suredeletestore = true\">Delete</button>\n            <button class=\"btn btn-primary\" [hidden]=\"!selectedStore || !suredeletestore\"  (click)=\"deleteStore()\"  style=\"color:Crimson\">Sure to delete? Yes</button>\n            <button class=\"btn btn-primary\" [hidden]=\"!selectedStore || !suredeletestore\"  (click)=\"suredeletestore = false\"  style=\"color:DarkGreen\">Sure to delete? Cancel</button>\n        <br/>\n        Choose your branch:\n            <label *ngFor=\"#b of empBranches | async\" >\n                <input  class=\"radio-inline\" type=\"radio\" name= \"nBranches\" value=\"{{b.name}}\" (click)=\"selectBranch(b.name)\"  checked=\"checked\"> {{b.name }} &nbsp;\n            </label>\n        <input class=\"form-control\" [hidden]=\"1\" [(ngModel)]=\"selectedBranch\" placeholder=\"Select one branch from above branch list.\">\n        </div>\n    </div>\n  <div *ngIf=\"selectedStore && selectedBranch\">\n   Welcome to : {{selectedStore}} - {{selectedBranch}} &nbsp; \n    <button class=\"btn btn-primary\" *ngIf=\"!swicthlocation\"  (click)=\"swicthlocation = !swicthlocation\">Switch Location>></button>\n    <button class=\"btn btn-primary\" *ngIf=\"swicthlocation\"  (click)=\"swicthlocation = !swicthlocation\"><<</button>\n    <br>\n\n\t<div>\n        <input class=\"form-control\" [(ngModel)]=\"cardemail\" (keyup)=\"doneTyping($event)\" placeholder=\"Swipe card\">\n            <button class=\"btn btn-primary\" [hidden]=\"!cardemail\"  (click)=\"loadCard(cardemail)\">Go</button> \n            <button class=\"btn btn-primary\" [hidden]=\"!cardemail\"  (click)=\"issuecard = !issuecard\">Issue card</button>\n            <br>\n        <div *ngIf=\"issuecard\">\n            <label  *ngIf=\"!cardexistinstore && calledload\"> Card is not exist in this store. Please assign card to customer. </label>\n            <label  *ngFor=\"#c of cardtypes | async\" >\n                <input  class=\"radio-inline\" type=\"radio\" name=\"ncardtype\" value=\"{{c.name}}({{c.dollarpoints}})\"  (click)=\"assginCard(cardemail, c.name)\" > {{c.name}}({{c.dollarpoints}}) &nbsp;\n            </label>            \n        </div>\n        <div *ngIf=\"cardloaded && cardtype\" name=\"cardinfo\">{{lasts}}\n          {{name}} &nbsp; {{points}} pts. (Type: {{cardtype}})<br>\n          Last swipe:{{last}} &nbsp; <br>Expiry:{{expiry}}\n        </div>\n\t</div>\n    <div *ngIf=\"cardloaded && cardtype\">\n        <input class=\"radio-inline\" type=\"radio\" name=\"ntype\" value=\"0\" (click)=\"ptype = 0\" checked> Purchase <button class=\"btn btn-primary\"  *ngIf=\"!showMore\"   (click)=\"showMore = !showMore\">...</button>\n        <span *ngIf=\"showMore\" >\n            <input class=\"radio-inline\" type=\"radio\" name= \"ntype\" value=\"1\" (click)=\"ptype = 1\" > Redeem \n            <input class=\"radio-inline\" type=\"radio\" name= \"ntype\" value=\"2\" (click)=\"ptype = 2\" > Return\n            <input class=\"radio-inline\" type=\"radio\" name= \"ntype\" value=\"3\" (click)=\"ptype = 3\" > Renew<br>\n        </span>\n        <div *ngIf=\"ptype > -1\">\n            <input class=\"form-control\" [(ngModel)]=\"inumber\"  placeholder=\"Invoice number\"><br>\n            <input class=\"form-control\" *ngIf=\"ptype === 0 || ptype === 3\" [(ngModel)]=\"itotal\" (keyup)=\"doneSubmitTyping($event)\"  placeholder=\"Invoice total$\">\n            <input class=\"form-control\" *ngIf=\"ptype === 2\" [(ngModel)]=\"itotal\" placeholder=\"Return total$\">\n            <input class=\"form-control\" *ngIf=\"ptype === 1\" [(ngModel)]=\"redeempoints\" (keyup)=\"doneSubmitTyping($event)\" placeholder=\"Total points\">\n            <br>\n           <div  *ngIf=\"ptype === 2\"> <input class=\"form-control\" [(ngModel)]=\"reason\" (keyup)=\"doneSubmitTyping($event)\" placeholder=\"Reason\"><br>\n           </div>\n\n            <div *ngIf=\"err !== ''\" style=\"color:Crimson\" >{{err}}<br></div>\n            <button class=\"btn btn-primary\"   (click)=\"submit()\">Submit</button>\n        </div>\n    </div>\n\n </div>\n<div *ngIf=\"store == '' || branch ==''\" class=\"home\">\n    For store owner, please click <a [routerLink]=\"['/SetupStore']\">Store management</a> <br>\n    For employee, please login and select proper store / location.<br>\n    <a [routerLink]=\"['/Login']\">Login</a>\n</div>\n  "
        }), 
        __metadata('design:paramtypes', [router_1.RouteParams, router_1.Router, angularfire2_1.AngularFire])
    ], EmployeeHome);
    return EmployeeHome;
}());
exports.EmployeeHome = EmployeeHome;
//# sourceMappingURL=EmployeeHome.js.map