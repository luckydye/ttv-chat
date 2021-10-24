interface Params {
    [key: string]: string;
}

export function parseSearch(str: string = "", res: Params = {}) {
    str.substring(1).split('&').map(item => item.split('=')).forEach(item => {
        res[item[0]] = unescape(item[1]);
    });
    return res;
}