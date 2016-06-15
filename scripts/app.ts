/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

/*
 * Angular
 */
//import {ExceptionHandler} from 'angular2/src/facade/exception_handler';
import {enableProdMode} from 'angular2/core'; 
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

import { provide, Component} from 'angular2/core';
import {FIREBASE_PROVIDERS,
    defaultFirebase,
    firebaseAuthConfig,
    AuthMethods,
    AuthProviders} from 'angularfire2';

import {bootstrap} from 'angular2/platform/browser';
import {
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  HashLocationStrategy,
  LocationStrategy,
  RouteConfig, Router, RouterLink
} from 'angular2/router';
/*
 * Components
 */
import {EmployeeHome} from './EmployeeHome';
import {MemberHome} from './MemberHome';
import {OwnerHome} from './OwnerHome';

import {Login} from './Login';
import {Logout} from './Logout';
import {About} from './About';
import {Member} from './Member';
import {MemberProfile} from './MemberProfile';

import {MemberReports} from './MemberReports';
import {EmployeeReports} from './EmployeeReports';
import {OwnerReports} from './OwnerReports';

import {Signup} from './Signup';
import {SetupStore} from './SetupStore';
import {SharedService} from './shareds';

@Component({               // 0: not logged in; 1: logged in as member; 2: logged in as store employee; 3: logged in as store owner
  selector: 'router-app',
  directives: [ROUTER_DIRECTIVES, RouterLink],

  template: `
    <div >
        <div class="container">
        <nav>
            <ul class="nav navbar-nav">
             <li class="nav-item">  <a *ngIf="ss.getlevel() > 0" [routerLink]="['/Logout']">Logout</a>                                     </li>
             <li class="nav-item">  <a [routerLink]="['/Member']">Membership</a>                                                           </li>
             <li class="nav-item">  <a *ngIf="!ss.getlevel() || ss.getlevel() === 0" [routerLink]="['/Signup']">Store Owner</a>            </li>
             <li class="nav-item">  <a *ngIf="ss.getlevel() === 1" [routerLink]="['/MemberHome']">Home</a>                                 </li>
             <li class="nav-item">  <a *ngIf="ss.getlevel() === 1" [routerLink]="['/MemberReports']">Reports</a>                           </li>
             <li class="nav-item">  <a *ngIf="ss.getlevel() === 1" [routerLink]="['/MemberProfile']">Profile</a>                           </li>
             <li class="nav-item">  <a *ngIf="ss.getlevel() === 2" [routerLink]="['/EmployeeHome']">Home</a>                               </li>
             <li class="nav-item">  <a *ngIf="ss.getlevel() === 2" [routerLink]="['/EmployeeReports']">Reports</a>                         </li>
             <li class="nav-item">  <a *ngIf="!ss.getlevel() || ss.getlevel() === 0" [routerLink]="['/Login']">Login</a>   </li>
             <li class="nav-item">  <a *ngIf="ss.getlevel() === 3" [routerLink]="['/SetupStore']">Home</a>                                 </li>
             <li class="nav-item">  <a *ngIf="ss.getlevel() === 3" [routerLink]="['/OwnerReports']">Reports</a>                            </li>
             <li class="nav-item">  <a [routerLink]="['/About']">About</a>                                                                 </li>
            </ul>
        </nav>
    </div>
  <div>
    <div class="container">
        <router-outlet></router-outlet>
    </div>
</div>
  `
})
//                <a *ngIf="ss.getlevel() === 3" [routerLink]="['/OwnerHome']">Home</a>

@RouteConfig([
        { path: '/', name: 'root', redirectTo: ['/Login'] },
        { path: '/Login', name: 'Login', component: Login },
        { path: '/Logout', name: 'Logout', component: Logout },
        { path: '/Signup', name: 'Signup', component: Signup },
        { path: '/Member', name: 'Member', component: Member },

        { path: '/MemberHome', name: 'MemberHome', component: MemberHome },
        { path: '/EmployeeHome', name: 'EmployeeHome', component: EmployeeHome },
        { path: '/OwnerHome', name: 'OwnerHome', component: OwnerHome },

        { path: '/MemberReports', name: 'MemberReports', component: MemberReports },
        { path: '/MemberProfile', name: 'MemberProfile', component: MemberProfile },
        { path: '/EmployeeReports', name: 'EmployeeReports', component: EmployeeReports },
        { path: '/OwnerReports', name: 'OwnerReports', component: OwnerReports },
        { path: '/SetupStore', name: 'SetupStore', component: SetupStore },

        { path: '/About', name: 'About', component: About }
])
export class MainApp {
    
    constructor(public router: Router, public ss: SharedService) {
    }
    logout() {
        localStorage.removeItem('jwt');
        //var messagesRef = new Firebase(Login.firebaseUrl);
        Login.messagesRef.unauth();
        this.ss.setlevel(0);
        this.router.navigateByUrl('/Login');
    }
}

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

enableProdMode();

bootstrap(MainApp, [SharedService, FIREBASE_PROVIDERS,
    defaultFirebase('https://ngr.firebaseio.com'), firebaseAuthConfig({
        method: AuthMethods.Password,
        provider: AuthProviders.Password
    }),
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);//, provide(ExceptionHandler, { useClass: CustomExceptionHandler }

