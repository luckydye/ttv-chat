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
