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
require("rxjs/add/operator/cache");
require("rxjs/add/operator/last");
require("rxjs/add/operator/first");
require("rxjs/add/operator/count");
require("rxjs/add/operator/do");
require("rxjs/add/operator/takeLast");
var angularfire2_1 = require('angularfire2');
var router_1 = require('angular2/router');
var Observable_1 = require('rxjs/Observable');
//import 'rxjs/add/operator/toArray';
//import 'rxjs/add/operator/skipWhile';
require('rxjs/add/observable/combineLatest');
//import {observableFirebaseObject, observableFirebaseArray, existFirebaseChild} from './myfbOb';
var SetupStore = (function () {
    function SetupStore(params, _parentRouter, af) {
        this.af = af;
        this.suredeletestore = false;
        this.face = ">>";
        this.assignemployee = false;
        //messagesRef: Firebase;
        this.initialized = false;
        this.branches = null;
        this.empbranches = null;
        this.empnobranches = null;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        //this.messagesRef = Login.messagesRef;
        this.parentRouter = _parentRouter;
        if (!localStorage.getItem('uid')) {
            this.parentRouter.parent.navigateByUrl('/Signup');
        }
        this.jwt = localStorage.getItem('uid');
        //var uu = this.jwt && this.jwtHelper.decodeToken(this.jwt);
        this.uid = this.jwt; // uu.d.uid;
        this.loadStore();
    }
    SetupStore.prototype.ngOnDestroy = function () {
    };
    SetupStore.prototype.loadStore = function () {
        var _this = this;
        this.stores = this.af.list("/users/" + this.uid + "/stores");
        var oo = this.stores;
        var sname = "";
        oo.subscribe(function (res) {
            if (res) {
                res.map(function (item) {
                    SetupStore.s_store = item.name;
                    SetupStore.s_item = item;
                    sname = item.name;
                });
            }
        });
        setTimeout(function () {
            // console.log("sname:" + sname);
            if (SetupStore.s_store) {
                _this.selectedStore = SetupStore.s_store;
                _this.selectStore(SetupStore.s_item);
                var my = _this.af.object("/users/" + _this.uid);
                my.subscribe(function (kk) {
                    _this.owner_fname = kk.fname;
                    _this.owner_lname = kk.lname;
                    _this.owner_email = kk.email;
                });
            }
        }, 1000);
    };
    SetupStore.prototype.ngOnInit = function () {
        this.initialized = true;
    };
    SetupStore.prototype.SetButtonFace = function () {
        if (this.face === ">>")
            this.face = "<<";
        else
            this.face = ">>";
    };
    SetupStore.prototype.SaveStore = function (storename, renewYears, maxPurchase, maxRedeem) {
        // var usersRef = this.af.object("/users/" + this.uid);// this.messagesRef.child("users").child(this.uid);
        this.af.object("/users/" + this.uid + "/loginstores/" + storename).update({
            ownerid: this.uid,
            name: storename
        });
        this.af.object("/users/" + this.uid + "/buyatstores/" + storename).update({
            ownerid: this.uid,
            name: storename
        });
        var rref = this.af.object("/users/" + this.uid + "/stores/" + storename);
        rref.update({
            name: storename,
            renewyears: renewYears,
            maxpurchase: maxPurchase,
            maxredeem: maxRedeem
        });
        if (this.owner_email && this.owner_fname && this.owner_lname)
            this.af.object("/users/" + this.uid + "/stores/" + storename + "/employees/" + this.uid).update({
                uid: this.uid,
                email: this.owner_email,
                fname: this.owner_fname,
                lname: this.owner_lname
            });
    };
    SetupStore.prototype.selectStore = function (d) {
        this.selectedStore = d.name;
        this.storename = d.name;
        this.maxPurchase = d.maxpurchase;
        this.maxRedeem = d.maxredeem;
        this.renewYears = d.renewyears;
        this.branches = this.af.list("/users/" + this.uid + "/stores/" + d.name + "/branches");
        this.cardtypes = this.af.list("/users/" + this.uid + "/stores/" + d.name + "/cardtypes"); // observableFirebaseArray(this.messagesRef.child("users").child(this.uid).child("stores").child(d.name).child("cardtypes").limitToLast(100));
        this.employees = this.af.list("/users/" + this.uid + "/stores/" + d.name + "/employees"); // observableFirebaseArray(this.messagesRef.child("users").child(this.uid).child("stores").child(d.name).child("employees").limitToLast(100));
        //oo.subscribe(res => {
        //    if (res) {
        //        res.map(function (item) {
        //            SetupStore.s_store = item.name;
        //            SetupStore.s_item = item;
        //        });
        //    }
        //}
        //);
    };
    SetupStore.prototype.deleteStore = function () {
        //this.selectedStore = d.name;
        //this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore)
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore).remove();
        this.suredeletestore = false;
        this.loadStore();
    };
    SetupStore.prototype.selectEmployee = function (e) {
        this.savedeleteempmsg = "";
        this.assignmsg = "";
        this.selectedEmployee = e.uid;
        this.fname = e.fname;
        this.lname = e.lname;
        this.email = e.email;
        this.resetEmployeeBranch();
        //console.log("Last branch holded:" + SetupStore.s_branch);
    };
    SetupStore.prototype.resetEmployeeBranch = function () {
        if (this.branches != null) {
            this.empbranches = this.af.list("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + this.selectedEmployee + "/branches"); // observableFirebaseArray(this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(this.selectedEmployee).child("branches").limitToLast(100));
            this.empnobranches = Observable_1.Observable.combineLatest(this.branches, this.empbranches, function (first, second) {
                var combinedArray = [];
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
    };
    SetupStore.prototype.addremovebranch = function (empuid, name, isadded) {
        if (!isadded) {
            this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + empuid + "/branches/" + name) // this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(empuid)
                .set({ name: name });
        }
        else {
            //this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(empuid)
            //    .child("branches").child(name)
            this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + empuid + "/branches/" + name)
                .remove();
        }
        this.resetEmployeeBranch();
    };
    SetupStore.prototype.deleteBranch = function () {
        // console.log("branch=" + this.branch);
        //this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("branches").child(this.branch)
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/branches/" + this.branch)
            .remove();
    };
    SetupStore.prototype.deleteCardType = function () {
        // this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("cardtypes").child(this.cardname)
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/cardtypes/" + this.cardname).remove();
    };
    SetupStore.prototype.deleteEmployee = function () {
        if (this.selectedEmployee !== this.uid)
            // this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(this.selectedEmployee)
            this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/employees/" + this.selectedEmployee).remove();
        else
            this.savedeleteempmsg = "You cannot delete yourself !";
    };
    SetupStore.prototype.addBranch = function () {
        //var usersRef = this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("branches").child(this.branch);
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/branches/" + this.branch).update({
            name: this.branch,
            checked: false
        });
    };
    SetupStore.prototype.addCardType = function () {
        //var usersRef = this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("cardtypes").child(this.cardname);
        this.af.object("/users/" + this.uid + "/stores/" + this.selectedStore + "/cardtypes/" + this.cardname).update({
            name: this.cardname,
            dollarpoints: this.dollarpoints
        });
    };
    SetupStore.prototype.assignEmployeeTo = function (email) {
        var _this = this;
        this.assignmsg = "";
        SetupStore.gAuid = "";
        try {
            //var rref = this.af.object("/members/"+ Login.xemail(email));// this.messagesRef.child("members").child(Login.xemail(email));
            //console.log("YYY" + Login.xemail(email));
            this.email = email;
            var f = "";
            var l = "";
            this.fname = "";
            this.lname = "";
            var o = this.af.object("/members/" + Login_1.Login.xemail(email)); // observableFirebaseObject(rref);
            var s = o.subscribe(function (res) {
                if (res && res.uid) {
                    SetupStore.gAuid = res.uid;
                    console.log("66" + res.uid);
                }
                else
                    console.log("100 === is null ....");
                console.log("55");
            }, function (e) { return console.log('onError: %s', e); });
            setTimeout(function () {
                if (SetupStore.gAuid) {
                    console.log("cc" + SetupStore.gAuid);
                    var oo = _this.af.object("/users/" + SetupStore.gAuid); //SetupStore.gAuid));
                    oo.subscribe(function (kk) {
                        f = kk.fname;
                        l = kk.lname;
                        console.log("dd" + f + " gg" + l);
                        console.log("dd" + f + l);
                        if (f !== "" && l !== "") {
                            console.log("ee" + f + l);
                            //var usersRef = this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(SetupStore.gAuid);
                            _this.af.object("/users/" + _this.uid + "/stores/" + _this.selectedStore + "/employees/" + SetupStore.gAuid).update({
                                uid: SetupStore.gAuid,
                                email: _this.email,
                                fname: f,
                                lname: l
                            });
                            _this.fname = f;
                            _this.lname = l;
                            _this.processAddEmployee(false);
                        }
                    }, function (e) { return console.log('onError2: %s', e); }, function () {
                        console.log('onCompleted');
                    });
                }
            }, 1000);
        }
        catch (err) {
            console.log("Attn:" + err);
        }
    };
    SetupStore.prototype.processAddEmployee = function (isaddbaseinfo) {
        console.log("processAddEmployee ..gAuid:" + SetupStore.gAuid);
        var r2 = this.af.object("/users/" + SetupStore.gAuid); //this.messagesRef.child("users").child(SetupStore.gAuid);
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
        this.af.object("/users/" + SetupStore.gAuid + "/loginstores/" + this.selectedStore).update({
            ownerid: this.uid,
            name: this.selectedStore
        });
        this.af.object("/users/" + SetupStore.gAuid + "/buyatstores/" + this.selectedStore).update({
            ownerid: this.uid,
            name: this.selectedStore
        });
        var rref = this.af.object("/members/" + Login_1.Login.xemail(this.email));
        rref.update({
            uid: SetupStore.gAuid,
            email: this.email
        });
        //console.log("added member");
        var usersRef = this.af.object("/users/" + this.uid + "/buyatstores/" + this.selectedStore + "/employees/" + SetupStore.gAuid); // this.messagesRef.child("users").child(this.uid).child("stores").child(this.selectedStore).child("employees").child(SetupStore.gAuid);
        usersRef.update({
            uid: SetupStore.gAuid,
            email: this.email,
            fname: this.fname,
            lname: this.lname
        });
    };
    SetupStore.prototype.addEmployee = function () {
        var _this = this;
        this.assignmsg = "";
        this.savedeleteempmsg = "";
        var employeeuid;
        var hasError = false;
        var emailExist = false;
        this.af.auth.createUser({
            email: this.email,
            password: this.password
        }).then(function (authData) {
            SetupStore.gAuid = authData.uid;
        }).catch(function (error) {
            hasError = true;
            switch (error.code) {
                case "EMAIL_TAKEN":
                    emailExist = true;
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email." + _this.email);
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
        setTimeout(function () {
            if (!hasError)
                _this.processAddEmployee(true);
            else if (emailExist) {
                _this.savedeleteempmsg = "This user account is existing. Assign the user as employee.";
                _this.assignEmployeeTo(_this.email);
            }
        }, 1000);
    };
    SetupStore = __decorate([
        core_1.Component({
            selector: 'SetupStore',
            directives: [router_1.ROUTER_DIRECTIVES],
            template: " \n           <br>\n    <div *ngIf=\"initialized\" >\n        <div class=\"card\">\n            <div class=\"card-header card-inverse card-info\">\n                Store basic\n              </div>\n            Select store to setup: <button class=\"btn btn-primary\"   (click)=\"SetButtonFace()\">{{face}}</button>\n          <div *ngIf=\"face === '<<'\">\n          <form  class=\"form-inline\">\n            Add a new store or change store base policy:<br/>\n\t\t  <span class=\"radio\">\n            <input class=\"form-control\" required [(ngModel)]=\"storename\"  placeholder=\"Store name\"><input class=\"form-control\" required [(ngModel)]=\"renewYears\"  placeholder=\"Years for one renew, i.e.: 1\"><br>\n            <input class=\"form-control\" required  [(ngModel)]=\"maxPurchase\"  placeholder=\"Max purchase$ limit, i.e.: 1000\"><input class=\"form-control\" required  [(ngModel)]=\"maxRedeem\"  placeholder=\"Max redeem points limit, i.e.: 1000\"><br>\n\t\t  </span>\n\t\t  <button class=\"btn btn-primary\" [disabled]=\"!(storename && renewYears && maxPurchase && maxRedeem)\"  (click)=\"SaveStore(storename,renewYears,maxPurchase,maxRedeem)\">Save</button>\n          </form>\n            <button class=\"btn btn-primary\" [disabled]=\"!selectedStore\" [hidden]=\"suredeletestore\"  (click)=\"suredeletestore = true\">Delete</button>\n            <button class=\"btn btn-primary\" [hidden]=\"!selectedStore || !suredeletestore\"  (click)=\"deleteStore()\"  style=\"color:Crimson\">Sure to delete? Yes</button>\n            <button class=\"btn btn-primary\" [hidden]=\"!selectedStore || !suredeletestore\"  (click)=\"suredeletestore = false\"  style=\"color:DarkGreen\">Sure to delete? Cancel</button>\n          </div>\n            <input class=\"form-control\" [hidden]=\"1\" [(ngModel)]=\"selectedStore\" placeholder=\"Current store\">\n            <div  *ngIf=\"stores\">\n                <label   *ngFor=\"#d of stores | async\" >\n                    <input  class=\"radio-inline\" type=\"radio\" name=\"nstores\" value=\"{{d.name}}\" (click)=\"selectStore(d)\"  checked=\"checked\"> {{d.name }} &nbsp;\n                </label>\n            </div>\n        </div>\n\t    <div *ngIf=\"selectedStore\" class=\"card\">\n            <div class=\"card-header card-inverse card-info\">\n                Branches\n              </div>\n                <form class=\"form-inline\">\n                <input class=\"form-control\" required [(ngModel)]=\"branch\" placeholder=\"Branch name\"><button class=\"btn btn-primary\"  (click)=\"addBranch()\">Save</button>\n                </form>\n                <button class=\"btn btn-primary\" [disabled]=\"!branch\"  (click)=\"deleteBranch()\">Delete</button>\n                <div>\n                    <label  *ngFor=\"#b of branches | async\" >\n                        <input  class=\"radio-inline\" type=\"radio\" name=\"nBranches\" value=\"{{b.name}}\" (click)=\"branch = b.name\" > {{b.name }} &nbsp;\n                    </label>\n                </div>\n\t    </div>\n\t    <div  class=\"card\">\n            <div class=\"card-header card-inverse card-info\">\n                Employees\n             </div>\n            Employee:<button class=\"btn btn-primary\"  *ngIf=\"!assignemployee\"  (click)=\"assignemployee = !assignemployee\">>></button>\n                <div  *ngIf=\"assignemployee\">\n                 <button class=\"btn btn-primary\"  (click)=\"assignemployee = !assignemployee\"><<</button>\n                 <form >\n                    <input class=\"form-control\" required [(ngModel)]=\"assignemail\" placeholder=\"User email\">\n                    <button class=\"btn btn-primary\" [disabled]=\"!assignemail\"  (click)=\"assignEmployeeTo(assignemail)\">Assign to {{selectedStore}}</button>\n                 </form>\n\t  \t            <div *ngIf=\"assignmsg\">\n                        {{assignmsg}}\n\t\t            </div>\n                </div>\n                <div  *ngIf=\"!assignemployee\">\n                    <form class=\"form-inline\">\n                        <input class=\"form-control\" required [(ngModel)]=\"fname\" placeholder=\"First name\"><input class=\"form-control\" required [(ngModel)]=\"lname\"  placeholder=\"Last name\"><br>\n                        <input class=\"form-control\" required [(ngModel)]=\"email\" placeholder=\"User email\"><input class=\"form-control\" type=\"password\" required [(ngModel)]=\"password\"  placeholder=\"Password\"><br>\n                        <button class=\"btn btn-primary\" [disabled]=\"!(fname && lname && email && password)\"  (click)=\"addEmployee()\">Save</button>\n                        </form>\n                    <button class=\"btn btn-primary\"  (click)=\"deleteEmployee()\">Delete</button>\n\t  \t            <div *ngIf=\"savedeleteempmsg\"  style=\"color:Crimson\">\n                        {{savedeleteempmsg}}\n\t\t            </div>\n                </div>\n                <div *ngIf=\"selectedEmployee\"><br> Assigned branches:\n                    <label  class=\"checkbox-inline\" *ngFor=\"#ccb of empnobranches | async\" [style.color]=\"!ccb.checked ? 'red' : 'green'\" >\n                    <input  type=\"checkbox\" (click)=\"addremovebranch(selectedEmployee, ccb.name, ccb.checked)\" [checked]=\"ccb.checked\"> {{ccb.name }}\n                    </label>\n                </div>\n                <div >\n                    Current mployee:\n                    <label  *ngFor=\"#e of employees | async\" >\n                        <input class=\"radio-inline\" type=\"radio\" name=\"nemployees\" value=\"{{e.fname}}{{e.lname}}\"  (click)=\"selectEmployee(e)\"> {{e.fname}} {{e.lname}}  &nbsp;\n                    </label>\n                </div>\n        </div>\n\t    <div *ngIf=\"selectedStore\" class=\"card\">\n            <div class=\"card-header card-inverse card-info\">\n                Card type\n             </div>\n                <form class=\"form-inline\">\n                <input class=\"form-control\" required [(ngModel)]=\"cardname\" placeholder=\"Card name\"><input class=\"form-control\" required [(ngModel)]=\"dollarpoints\"  placeholder=\"Points for one dollar\"><br>\n                <button class=\"btn btn-primary\" [disabled]=\"!(cardname && dollarpoints)\"  (click)=\"addCardType()\">Save</button>\n                </form>\n                <button class=\"btn btn-primary\"  (click)=\"deleteCardType()\">Delete</button>\n\n                <div>\n                    <label  *ngFor=\"#c of cardtypes | async\" >\n                        <input  class=\"radio-inline\" type=\"radio\" name=\"ncardtype\" value=\"{{c.name}}({{c.dollarpoints}})\"  (click)=\"cardname = c.name; dollarpoints = c.dollarpoints\" > {{c.name}}({{c.dollarpoints}}) &nbsp;\n                    </label>\n                </div>\n\t    </div>\n\t</div>\n  "
        }), 
        __metadata('design:paramtypes', [router_1.RouteParams, router_1.Router, angularfire2_1.AngularFire])
    ], SetupStore);
    return SetupStore;
}());
exports.SetupStore = SetupStore;
//# sourceMappingURL=SetupStore.js.map