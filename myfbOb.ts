﻿// Angular 2 Toolkit - Firebase Observables
// Copyright 2015 Oasis Digital - http://oasisdigital.com
//     written by Kyle Cordes - http://kylecordes.com
// November 2015

// This is a first draft at two different translations of a Firebase query
// to an Observable. One is suitable for "leaf" objects, these are watched
// as a unit and replaced with each update. The other is suitable for Firebase
// "arrays", it understands the conventions use their to make an observable
// that yields an array with each change.

// TODO understand TypeScript generics more fully, seek advice from a guru.

// TODO Further polish this, publish as a reusable library.

// TODO determine if the safe copies are compatible with performant Angular 2.
import {Observable} from 'rxjs/Observable';

// TODO How do I type this without adding another dependency on @reactivex/rxjs?
// import { Subscriber } from 'rxjs/dist/cjs/Rx';

export function observableFirebaseObject<T>(ref: FirebaseQuery): Observable<T> {
    return Observable.create(function (observer: any) {
        function value(snapshot: FirebaseDataSnapshot) {
            //console.log("val:" + JSON.stringify(snapshot.val()));
            observer.next(snapshot.val());
        }
        ref.on('value', value);
        return function () {
            ref.off('value', value);
        }
    });
}
function existFirebaseChildCallback(ref, exists) : boolean {
    return exists;
}
export function existFirebaseChild(ref: FirebaseQuery): Observable<boolean> {
    return Observable.create(function (observer: any) {
        function value(snapshot: FirebaseDataSnapshot) {
            observer.next(snapshot.exists());
        }
        ref.once('value', value);
        return function () {
            ref.off('value', value);
        }
    //ref.once('value', function (snapshot) {
    //    exists = snapshot.exists();
    //    //existFirebaseChildCallback(ref, exists);
    //    });
    });
}
export function observableFirebaseArray<T>(ref: FirebaseQuery): Observable<T[]> {

    return Observable.create(function (observer: any) {
        // Looking for how to type this well.
        let arr: any[] = [];
        const keyFieldName = "$$key";

        function child_added(snapshot: FirebaseDataSnapshot, prevChildKey: string) {
            let child = snapshot.val();
            child[keyFieldName] = snapshot.key();
            let prevEntry = arr.filter((y) => y[keyFieldName] === prevChildKey);
            arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
            observer.next(arr.slice()); // Safe copy
        }

        function child_changed(snapshot: FirebaseDataSnapshot) {
            let key = snapshot.key();
            let child = snapshot.val();
            // TODO replace object rather than mutate it?
            let x = arr.filter((y) => y[keyFieldName] === key);
            if (x) {
                for (var k in child) x[k] = child[k];
            }
            observer.next(arr.slice()); // Safe copy
        }

        function child_removed(snapshot: FirebaseDataSnapshot) {
            let key = snapshot.key();
            let child = snapshot.val();
            let x = arr.filter((y) => y[keyFieldName] === key);
            var xarr: string[] = [];
            if (x) {
                arr.forEach(function (item) {
                    xarr.push(item[keyFieldName]);
                });
                arr.splice(xarr.indexOf(x[0][keyFieldName]), 1);
            }
            observer.next(arr.slice()); // Safe copy
            
        }

        function child_moved(snapshot: FirebaseDataSnapshot, prevChildKey: string) {
            let key = snapshot.key();
            let child = snapshot.val();
            child[keyFieldName] = key;
            // Remove from old slot
            let x = arr.filter((y) => y[keyFieldName] === key);
            if (x) {
                arr.splice(arr.indexOf(x), 1);
            }
            // Add in new slot
            let prevEntry = arr.filter((y) => y[keyFieldName] === prevChildKey);
            if (prevEntry) {
                arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
            } else {
                arr.splice(0, 0, child);
            }
            observer.next(arr.slice()); // Safe copy
        }

        // Start out empty, until data arrives
        observer.next(arr.slice()); // Safe copy

        ref.on('child_added', child_added);
        ref.on('child_changed', child_changed);
        ref.on('child_removed', child_removed);
        ref.on('child_moved', child_moved);

        return function () {
            ref.off('child_added', child_added);
            ref.off('child_changed', child_changed);
            ref.off('child_removed', child_removed);
            ref.off('child_moved', child_moved);
        }
    });
}

