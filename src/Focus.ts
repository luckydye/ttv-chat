// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

// let hidden, visibilityChange;
// if (typeof document.hidden !== "undefined") {
//     hidden = "hidden";
//     visibilityChange = "visibilitychange";
// } else if (typeof document.msHidden !== "undefined") {
//     hidden = "msHidden";
//     visibilityChange = "msvisibilitychange";
// } else if (typeof document.webkitHidden !== "undefined") {
//     hidden = "webkitHidden";
//     visibilityChange = "webkitvisibilitychange";
// }

// function handleVisibilityChange() {
//     if (document[hidden]) {
//         alert('hide it!');
//     } else {

//     }
// }

// document.addEventListener(visibilityChange, handleVisibilityChange, false);

/////
// interface for listening to changes in window focus.

export default class Focus {

    static onFocus(callback: Function) {
        window.addEventListener('focus', e => {
            callback();
        });
    }

    static onBlur(callback: Function) {
        window.addEventListener('blur', e => {
            callback();
        });
    }

}
