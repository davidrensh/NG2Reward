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
var router_1 = require('angular2/router');
var Login_1 = require("./Login");
var shareds_1 = require('./shareds');
var Logout = (function () {
    function Logout(router, ss) {
        this.router = router;
        this.ss = ss;
        this.logout();
    }
    Logout.prototype.logout = function () {
        localStorage.removeItem('jwt');
        Login_1.Login.messagesRef.unauth();
        this.ss.setlevel(0);
        this.router.navigateByUrl('/Login');
    };
    Logout = __decorate([
        core_1.Component({
            selector: 'Logout',
            template: "\n\t  \t<div>\nLogout\n\t\t</div>\n\t"
        }), 
        __metadata('design:paramtypes', [router_1.Router, shareds_1.SharedService])
    ], Logout);
    return Logout;
}());
exports.Logout = Logout;
//# sourceMappingURL=Logout.js.map