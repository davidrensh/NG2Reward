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
var core_1 = require('angular2/core');
var About = (function () {
    function About() {
    }
    About = __decorate([
        core_1.Component({
            selector: 'about',
            template: "\n<div lass=\"card\">\n            <div class=\"card-header card-inverse card-info\">\n                About\n             </div>\n\n<p>\n    New generation cloud based reward loyalty multiple stores and multiple branches system.<br>\n    Nobody can beat this at performance and price<br>\n    Product of NGR, partner of True Rewards Canada<br>\n    By David Ren (davidrensh@hotmail.com)\n</p>\n\n</div>\n"
        }), 
        __metadata('design:paramtypes', [])
    ], About);
    return About;
}());
exports.About = About;
//# sourceMappingURL=About.js.map