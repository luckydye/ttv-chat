

const NumberFormat = new Intl.NumberFormat('en-IN');
const langFormat = new Intl.DisplayNames(['en'], { type: 'language' });

export default class Format {

    static lang = (langshort: string) => langFormat.of(langshort);
    static number = (n: number) => NumberFormat.format(n);
    static seconds = (s: number, short: boolean = false) => {
        if (s > 60 * 60) {
            const h = s / 60 / 60;
            return `${h.toFixed(1)} ${short ? "h" : (h > 1 ? "hours" : "hour")}`;
        }
        if (s > 60) {
            const m = Math.floor(s / 60);
            return `${m} ${short ? "min" : (m > 1 ? "minutes" : "minute")}`;
        }
        return `${s} ${short ? (s > 1 ? "secs" : "sec") : (s > 1 ? "seconds" : "second")}`;
    };

}