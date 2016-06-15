import {Component, NgZone, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';
import {
ROUTER_DIRECTIVES,
ROUTER_PROVIDERS,
HashLocationStrategy,
LocationStrategy,
RouteConfig, Router, RouterOutlet, RouteParams, RouterLink, ComponentInstruction
} from 'angular2/router';
import {Login} from "./Login";
import {SharedService} from './shareds';
@Component({
    selector: 'Logout',
    template: `
	  	<div>
Logout
		</div>
	`
})
export class Logout  {

    constructor(public router: Router, public ss: SharedService) {
        this.logout();
    }
    logout() {
        localStorage.removeItem('jwt');
        
        Login.messagesRef.unauth();
        this.ss.setlevel(0);
        this.router.navigateByUrl('/Login');
    }
}
