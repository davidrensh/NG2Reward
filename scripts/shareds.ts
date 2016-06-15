import {Injectable} from 'angular2/core';

@Injectable()
export class SharedService {
    level: number = 0;
    setlevel(l: number) {
        this.level = l;
    }
    getlevel(): number {
        return this.level;
    }
}