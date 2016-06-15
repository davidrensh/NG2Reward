// Angular 2 Toolkit - Firebase Observables
// Copyright 2015 Oasis Digital - http://oasisdigital.com
//     written by Kyle Cordes - http://kylecordes.com
// November 2015
"use strict";
// This is a first draft at two different translations of a Firebase query
// to an Observable. One is suitable for "leaf" objects, these are watched
// as a unit and replaced with each update. The other is suitable for Firebase
// "arrays", it understands the conventions use their to make an observable
// that yields an array with each change.
// TODO understand TypeScript generics more fully, seek advice from a guru.
// TODO Further polish this, publish as a reusable library.
// TODO determine if the safe copies are compatible with performant Angular 2.
var Observable_1 = require('rxjs/Observable');
// TODO How do I type this without adding another dependency on @reactivex/rxjs?
// import { Subscriber } from 'rxjs/dist/cjs/Rx';
function observableFirebaseObject(ref) {
    return Observable_1.Observable.create(function (observer) {
        function value(snapshot) {
            //console.log("val:" + JSON.stringify(snapshot.val()));
            observer.next(snapshot.val());
        }
        ref.on('value', value);
        return function () {
            ref.off('value', value);
        };
    });
}
exports.observableFirebaseObject = observableFirebaseObject;
function existFirebaseChildCallback(ref, exists) {
    return exists;
}
function existFirebaseChild(ref) {
    return Observable_1.Observable.create(function (observer) {
        function value(snapshot) {
            observer.next(snapshot.exists());
        }
        ref.once('value', value);
        return function () {
            ref.off('value', value);
        };
        //ref.once('value', function (snapshot) {
        //    exists = snapshot.exists();
        //    //existFirebaseChildCallback(ref, exists);
        //    });
    });
}
exports.existFirebaseChild = existFirebaseChild;
function observableFirebaseArray(ref) {
    return Observable_1.Observable.create(function (observer) {
        // Looking for how to type this well.
        var arr = [];
        var keyFieldName = "$$key";
        function child_added(snapshot, prevChildKey) {
            var child = snapshot.val();
            child[keyFieldName] = snapshot.key();
            var prevEntry = arr.filter(function (y) { return y[keyFieldName] === prevChildKey; });
            arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
            observer.next(arr.slice()); // Safe copy
        }
        function child_changed(snapshot) {
            var key = snapshot.key();
            var child = snapshot.val();
            // TODO replace object rather than mutate it?
            var x = arr.filter(function (y) { return y[keyFieldName] === key; });
            if (x) {
                for (var k in child)
                    x[k] = child[k];
            }
            observer.next(arr.slice()); // Safe copy
        }
        function child_removed(snapshot) {
            var key = snapshot.key();
            var child = snapshot.val();
            var x = arr.filter(function (y) { return y[keyFieldName] === key; });
            var xarr = [];
            if (x) {
                arr.forEach(function (item) {
                    xarr.push(item[keyFieldName]);
                });
                arr.splice(xarr.indexOf(x[0][keyFieldName]), 1);
            }
            observer.next(arr.slice()); // Safe copy
        }
        function child_moved(snapshot, prevChildKey) {
            var key = snapshot.key();
            var child = snapshot.val();
            child[keyFieldName] = key;
            // Remove from old slot
            var x = arr.filter(function (y) { return y[keyFieldName] === key; });
            if (x) {
                arr.splice(arr.indexOf(x), 1);
            }
            // Add in new slot
            var prevEntry = arr.filter(function (y) { return y[keyFieldName] === prevChildKey; });
            if (prevEntry) {
                arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
            }
            else {
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
        };
    });
}
exports.observableFirebaseArray = observableFirebaseArray;
//# sourceMappingURL=myfbOb.js.map