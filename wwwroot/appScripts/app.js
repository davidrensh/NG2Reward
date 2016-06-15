/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
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
/*
 * Angular
 */
//import {ExceptionHandler} from 'angular2/src/facade/exception_handler';
var core_1 = require('angular2/core');
//var ENV = "production";
//import 'ie-shim'; // Internet Explorer
// import 'es6-shim';
// import 'es6-promise';
// import 'es7-reflect-metadata';
// Prefer CoreJS over the polyfills above
//import 'core-js';
//import {Zone} from 'zone.js/dist/zone';
//import 'zone.js/dist/long-stack-trace-zone.js';
//if ('production' === ENV) {
//    // Production
//    require('zone.js/dist/zone');
//    require('zone.js/dist/long-stack-trace-zone');
//} else {
//    // Development
//    Error.stackTraceLimit = Infinity;
//    require('zone.js/dist/long-stack-trace-zone');
//}
var core_2 = require('angular2/core');
var angularfire2_1 = require('angularfire2');
var browser_1 = require('angular2/platform/browser');
var router_1 = require('angular2/router');
/*
 * Components
 */
var EmployeeHome_1 = require('./EmployeeHome');
var MemberHome_1 = require('./MemberHome');
var OwnerHome_1 = require('./OwnerHome');
var Login_1 = require('./Login');
var Logout_1 = require('./Logout');
var About_1 = require('./About');
var Member_1 = require('./Member');
var MemberProfile_1 = require('./MemberProfile');
var MemberReports_1 = require('./MemberReports');
var EmployeeReports_1 = require('./EmployeeReports');
var OwnerReports_1 = require('./OwnerReports');
var Signup_1 = require('./Signup');
var SetupStore_1 = require('./SetupStore');
var shareds_1 = require('./shareds');
var MainApp = (function () {
    function MainApp(router, ss) {
        this.router = router;
        this.ss = ss;
    }
    MainApp.prototype.logout = function () {
        localStorage.removeItem('jwt');
        //var messagesRef = new Firebase(Login.firebaseUrl);
        Login_1.Login.messagesRef.unauth();
        this.ss.setlevel(0);
        this.router.navigateByUrl('/Login');
    };
    MainApp = __decorate([
        core_2.Component({
            selector: 'router-app',
            directives: [router_1.ROUTER_DIRECTIVES, router_1.RouterLink],
            template: "\n    <div >\n        <div class=\"container\">\n        <nav>\n            <ul class=\"nav navbar-nav\">\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() > 0\" [routerLink]=\"['/Logout']\">Logout</a>                                     </li>\n             <li class=\"nav-item\">  <a [routerLink]=\"['/Member']\">Membership</a>                                                           </li>\n             <li class=\"nav-item\">  <a *ngIf=\"!ss.getlevel() || ss.getlevel() === 0\" [routerLink]=\"['/Signup']\">Store Owner</a>            </li>\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() === 1\" [routerLink]=\"['/MemberHome']\">Home</a>                                 </li>\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() === 1\" [routerLink]=\"['/MemberReports']\">Reports</a>                           </li>\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() === 1\" [routerLink]=\"['/MemberProfile']\">Profile</a>                           </li>\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() === 2\" [routerLink]=\"['/EmployeeHome']\">Home</a>                               </li>\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() === 2\" [routerLink]=\"['/EmployeeReports']\">Reports</a>                         </li>\n             <li class=\"nav-item\">  <a *ngIf=\"!ss.getlevel() || ss.getlevel() === 0\" [routerLink]=\"['/Login']\">Login</a>   </li>\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() === 3\" [routerLink]=\"['/SetupStore']\">Home</a>                                 </li>\n             <li class=\"nav-item\">  <a *ngIf=\"ss.getlevel() === 3\" [routerLink]=\"['/OwnerReports']\">Reports</a>                            </li>\n             <li class=\"nav-item\">  <a [routerLink]=\"['/About']\">About</a>                                                                 </li>\n            </ul>\n        </nav>\n    </div>\n  <div>\n    <div class=\"container\">\n        <router-outlet></router-outlet>\n    </div>\n</div>\n  "
        }),
        router_1.RouteConfig([
            { path: '/', name: 'root', redirectTo: ['/Login'] },
            { path: '/Login', name: 'Login', component: Login_1.Login },
            { path: '/Logout', name: 'Logout', component: Logout_1.Logout },
            { path: '/Signup', name: 'Signup', component: Signup_1.Signup },
            { path: '/Member', name: 'Member', component: Member_1.Member },
            { path: '/MemberHome', name: 'MemberHome', component: MemberHome_1.MemberHome },
            { path: '/EmployeeHome', name: 'EmployeeHome', component: EmployeeHome_1.EmployeeHome },
            { path: '/OwnerHome', name: 'OwnerHome', component: OwnerHome_1.OwnerHome },
            { path: '/MemberReports', name: 'MemberReports', component: MemberReports_1.MemberReports },
            { path: '/MemberProfile', name: 'MemberProfile', component: MemberProfile_1.MemberProfile },
            { path: '/EmployeeReports', name: 'EmployeeReports', component: EmployeeReports_1.EmployeeReports },
            { path: '/OwnerReports', name: 'OwnerReports', component: OwnerReports_1.OwnerReports },
            { path: '/SetupStore', name: 'SetupStore', component: SetupStore_1.SetupStore },
            { path: '/About', name: 'About', component: About_1.About }
        ]), 
        __metadata('design:paramtypes', [router_1.Router, shareds_1.SharedService])
    ], MainApp);
    return MainApp;
}());
exports.MainApp = MainApp;
// class _ArrayLogger {
//    res = [];
//    log(s: any): void { this.res.push(s); }
//    logError(s: any): void { this.res.push(s); }
//    logGroup(s: any): void { this.res.push(s); }
//    logGroupEnd() {
//        this.res.forEach(error => {
//            console.error(error);
//        })
//    };
//}
//class CustomExceptionHandler implements ExceptionHandler {
//    //constructor(_logger: any, _rethrowException?: boolean) { }
//     //constructor(new _ArrayLogger(),false) { }
//    //constructor(_logger: any, _rethrowException?: boolean) {
//    //    super(new _ArrayLogger(), false);
//    //}
//    constructor( _logger: _ArrayLogger,  _rethrowException: boolean = true) {
//    }
//    //constructor(_logger: any, _rethrowException?: boolean) {
//    //}
//    call(error, stackTrace = null, reason = null) {
//        console.log("errors abound!");
//        console.log(error);
//        console.log(stackTrace);
//        console.log(reason);
//    }
//    //call(exception, stackTrace: any, reason: string){
//    //    console.log("DRen custom error, reason:" + reason + " exception:" + JSON.stringify(exception) + "stack:" + +JSON.stringify(stackTrace));
//    //}
//}
core_1.enableProdMode();
browser_1.bootstrap(MainApp, [shareds_1.SharedService, angularfire2_1.FIREBASE_PROVIDERS,
    angularfire2_1.defaultFirebase('https://ngr.firebaseio.com'), angularfire2_1.firebaseAuthConfig({
        method: angularfire2_1.AuthMethods.Password,
        provider: angularfire2_1.AuthProviders.Password
    }),
    router_1.ROUTER_PROVIDERS,
    core_2.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })
]); //, provide(ExceptionHandler, { useClass: CustomExceptionHandler }
//# sourceMappingURL=app.js.map