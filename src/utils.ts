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

export function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];
}

export function rgbToHex(rgb: number[]) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

export function limitColorContrast(...rgb: number[]) {
    const hsl = rgb2hsl(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    hsl[2] = Math.max(hsl[2], 0.5);
    return hsl2rgb(hsl[0], hsl[1], hsl[2]);
}

// http://hsl2rgb.nichabi.com/javascript-function.php
export function hsl2rgb(h: number, s: number, l: number) {
    var r, g, b, m, c, x

    h *= 360;
    s *= 100;
    l *= 100;

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return [r, g, b];
}

// https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
export function rgb2hsl(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l * 100];
}

// dragElement
interface DragState {
    button: number,
    x: number,
    y: number,
    delta: [number, number],
    absolute: [number, number],
    mousedown: Boolean,
    mouseup: Boolean,
    target: EventTarget | null,
    ctrlKey: Boolean,
    altKey: Boolean,
    shiftKey: Boolean,
    pressure: number,
    pointerId: number | null,
    type: string | null
}

export function dragElement(ele: HTMLElement, callback: Function) {

    let lastEvent: PointerEvent | null;
    let downEvent: PointerEvent | null;
    let dragging: Boolean = false;

    let state: DragState;
    let pointers: { [key: number]: PointerEvent; } = {};

    let currPointer: number | null;

    ele.addEventListener('pointerdown', e => {
        pointers[e.pointerId] = e;

        if (!currPointer) {
            dragging = true;
            downEvent = e;
            currPointer = e.pointerId;
            state = {
                button: e.button,
                x: e.x,
                y: e.y,
                delta: [0, 0],
                absolute: [0, 0],
                mousedown: true,
                mouseup: false,
                target: e.target,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                pressure: 1.0,
                pointerId: null,
                type: ""
            }
        }

        callback(state);
    });

    window.addEventListener('pointerup', e => {
        currPointer = null;
        downEvent = null;
        lastEvent = null;

        if (dragging) {
            state.x = e.x;
            state.y = e.y;
            state.mousedown = false;
            state.mouseup = true;
            state.target = e.target;

            callback(state);
        }

        dragging = false;

        delete pointers[e.pointerId];
    });

    window.addEventListener('pointermove', e => {
        if (e.pointerId == currPointer) {
            if (dragging && downEvent && lastEvent) {

                state.x = e.x;
                state.y = e.y;
                state.delta = [
                    e.x - lastEvent.x,
                    e.y - lastEvent.y
                ];
                state.absolute = [
                    downEvent.x - e.x,
                    downEvent.y - e.y
                ];
                state.mousedown = false;
                state.mouseup = false;
                state.target = e.target;
                state.ctrlKey = e.ctrlKey;
                state.altKey = e.altKey;
                state.shiftKey = e.shiftKey;
                state.pressure = e.pressure;
                state.type = e.pointerType;
                state.pointerId = e.pointerId;

                callback(state);
            }
            lastEvent = e;
        }
    });
}
