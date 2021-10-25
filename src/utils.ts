interface Params {
    [key: string]: string;
}

export function parseSearch(str: string = "", res: Params = {}) {
    str.substring(1).split('&').map(item => item.split('=')).forEach(item => {
        res[item[0]] = unescape(item[1]);
    });
    return res;
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(...rgb: number[]) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}