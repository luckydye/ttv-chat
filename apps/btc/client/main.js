/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$2=Symbol(),n$3=new Map;class s$3{constructor(t,n){if(this._$cssResult$=!0,n!==e$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t;}get styleSheet(){let e=n$3.get(this.cssText);return t$1&&void 0===e&&(n$3.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const o$3=t=>new s$3("string"==typeof t?t:t+"",e$2),r$2=(t,...n)=>{const o=1===t.length?t[0]:n.reduce(((e,n,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1]),t[0]);return new s$3(o,e$2)},i$1=(e,n)=>{t$1?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S$1=t$1?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$3(e)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window.trustedTypes,r$1=e$1?e$1.emptyScript:"",h$1=window.reactiveElementPolyfillSupport,o$2={toAttribute(t,i){switch(i){case Boolean:t=t?r$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$2=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$2,reflect:!1,hasChanged:n$2};class a$1 extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o();}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S$1(i));}else void 0!==i&&s.push(S$1(i));return s}static _$Eh(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1);}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$ES(t,i,s=l$2){var e,r;const h=this.constructor._$Eh(t,s);if(void 0!==h&&!0===s.reflect){const n=(null!==(r=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==r?r:o$2.toAttribute)(i,s.type);this._$Ei=t,null==n?this.removeAttribute(h):this.setAttribute(h,n),this._$Ei=null;}}_$AK(t,i){var s,e,r;const h=this.constructor,n=h._$Eu.get(t);if(void 0!==n&&this._$Ei!==n){const t=h.getPropertyOptions(n),l=t.converter,a=null!==(r=null!==(e=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof l?l:null)&&void 0!==r?r:o$2.fromAttribute;this._$Ei=n,this[n]=a(i,t.type),this._$Ei=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$2)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ep=this._$E_());}async _$E_(){this.isUpdatePending=!0;try{await this._$Ep;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU();}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EU(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$EC=void 0),this._$EU();}updated(t){}firstUpdated(t){}}a$1.finalized=!0,a$1.elementProperties=new Map,a$1.elementStyles=[],a$1.shadowRootOptions={mode:"open"},null==h$1||h$1({ReactiveElement:a$1}),(null!==(s$2=globalThis.reactiveElementVersions)&&void 0!==s$2?s$2:globalThis.reactiveElementVersions=[]).push("1.3.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=globalThis.trustedTypes,s$1=i?i.createPolicy("lit-html",{createHTML:t=>t}):void 0,e=`lit$${(Math.random()+"").slice(9)}$`,o$1="?"+e,n$1=`<${o$1}>`,l$1=document,h=(t="")=>l$1.createComment(t),r=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea|title)$/i,p=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),$=p(1),b=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),T=new WeakMap,x=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,p=-1,$=0;for(;$<s.length&&(d.lastIndex=$,u=d.exec(s),null!==u);)$=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,p=-1):void 0===u[1]?p=-2:(p=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$1:p>=0?(l.push(o),s.slice(0,p)+"$lit$"+s.slice(p)+e+y):s+e+(-2===p?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==s$1?s$1.createHTML(u):u,l]};class E{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=E.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?H:"@"===i[1]?I:S});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e),s=t.length-1;if(s>0){l.textContent=i?i.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h());}}}else if(8===l.nodeType)if(l.data===o$1)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e,t+1));)c.push({type:7,index:r}),t+=e.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function P(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=P(t,d._$AS(t,i.values),d,e)),i}class V{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),r(t)?t===w||null==t||""===t?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):u(t)?this.S(t):this.$(t);}A(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t));}$(t){this._$AH!==w&&r(this._$AH)?this._$AA.nextSibling.data=t:this.k(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=E.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new V(o,this),i=t.p(this.options);t.m(s),this.k(i),this._$AH=t;}}_$AC(t){let i=T.get(t.strings);return void 0===i&&T.set(t.strings,i=new E(t)),i}S(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.A(h()),this.A(h()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P(this,t,i,0),n=!r(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=P(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r(h)||h!==this._$AH[l]),h===w?t=w:t!==w&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.C(t);}C(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}C(t){this.element[this.name]=t===w?void 0:t;}}const k=i?i.emptyScript:"";class H extends S{constructor(){super(...arguments),this.type=4;}C(t){t&&t!==w?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=P(this,t,i,0))&&void 0!==s?s:w)===b)return;const e=this._$AH,o=t===w&&e!==w||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==w&&(e===w||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t);}}const z=window.litHtmlPolyfillSupport;null==z||z(E,N),(null!==(t=globalThis.litHtmlVersions)&&void 0!==t?t:globalThis.litHtmlVersions=[]).push("2.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends a$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=x(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.2.0");class ChatInfo extends s {
    constructor(msg) {
        super();
        this.message = msg;
    }
    static get styles() {
        return r$2 `
      :host {
        display: block;
        background: #211b25;
        padding: 8px 15px;
        margin: 2px 0;
        line-height: 1.33em;
      }
      .message {
        display: inline;
      }
    `;
    }
    render() {
        return this.message.content;
    }
}
class ChatNote extends s {
    constructor(msg) {
        super();
        this.message = "";
        this.message = msg;
    }
    static get styles() {
        return r$2 `
      :host {
        display: block;
        background: #0c0c0c;
        padding: 8px 15px;
        margin: 2px 0;
        opacity: 0.5;
        line-height: 1.33em;
      }
      .message {
        display: inline-flex;
      }
      img {
        margin: 0 4px;
      }
    `;
    }
    render() {
        if (this.message) {
            return $ `
        <div class="line">
          <div class="message">${this.message}</div>
        </div>
      `;
        }
    }
}
customElements.define("chat-info", ChatInfo);
customElements.define("chat-note", ChatNote);const Ease = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};
let scrollToSpeed = 10;
let currentAnimation = -1;
class AnimatedScroll {
    static scrollTo(target, root) {
        clearTimeout(currentAnimation);
        const start = root.scrollTop;
        const dist = target - start;
        let current = start;
        let elapsed = 0;
        let lastTick = Date.now();
        const loop = () => {
            const currentTick = Date.now();
            const deltaTime = (currentTick - lastTick) / (1000 / scrollToSpeed);
            elapsed += deltaTime;
            current = start + (Ease.easeOutCubic(elapsed) * dist);
            lastTick = currentTick;
            root.scrollTo(0, current);
            if (elapsed < 0.85 && Math.abs(target - current) > 3) {
                currentAnimation = setTimeout(loop, 1000 / 60);
            }
            else {
                root.scrollTo(0, target);
            }
        };
        loop();
        return () => {
            clearTimeout(currentAnimation);
        };
    }
}function map(value, in_min, in_max, out_min, out_max) {
    return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
class FluidInput extends s {
    render() {
        return $ `
			<style>
				:host {
                    display: inline-block;
                    height: 28px;
                    width: 85px;

                    --color-input-background: #1B1B1B;
                    --color-input-hover-background: #202020;
                    --color-input-active-background: #373737;
				}

                .input-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: var(--color-input-background);
                    border-radius: 4px;
                    cursor: e-resize;
                    position: relative;
                    overflow: hidden;
                }

                .input-container:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: calc(100% * var(--value));
                    pointer-events: none;
                    background: white;
                    opacity: 0.025;
                }

                .input-container[active]:before {
                    opacity: 0.1;
                }

                .input-container:hover {
                    background: var(--color-input-hover-background);
                }
                
                .input-container[active] {
                    background: var(--color-input-active-background);
                }

                .value-container {
                    white-space: nowrap;
                    height: 100%;
                }

                .input-value {
                    cursor: e-resize;
                    height: 100%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    background: transparent;
                    margin: 0 -10px;
                    width: auto;
                    padding: 0;
                    color: inherit;
                    font-family: inherit;
                    font-size: inherit;
                    text-align: center;
                }

                .input-value:focus {
                    cursor: text;
                }

                .value-suffix {
                    opacity: 0.5;
                    pointer-events: none;
                }

                .input-value:focus {
                    outline: none;
                    cursor: text;
                }

                .arrow {
                    padding: 0 6px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    opacity: 0.75;
                    position: absolute;
                }

                .left-arrow {
                    left: 0;
                }
                .right-arrow {
                    right: 0;
                }

                .arrow:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .arrow:active {
                    background: rgba(255, 255, 255, 0.01);
                }

                .arrow svg {
                    fill: none;
                    stroke: var(--color-text, #eee);
                    stroke-width: 1.25px;
                    stroke-linecap: round;
                }
                
			</style>
			<div class="input-container">
                <span class="arrow left-arrow">
                    <svg x="0px" y="0px" width="7.3px" height="11px" viewBox="0 0 7.3 12.5">
                        <polyline class="st0" points="6.3,1 1,6.3 6.3,11.5 "/>
                    </svg>
                </span>
                <span class="value-container">
                    <input class="input-value"></input>
                    ${this.suffix
            ? $ `
                            <span class="value-suffix">${this.suffix}</span>
                          `
            : ""}
                </span>
                <span class="arrow right-arrow">
                    <svg x="0px" y="0px" width="7.3px" height="11px" viewBox="0 0 7.3 12.5">
                        <polyline class="st0" points="1,11.5 6.3,6.3 1,1 "/>
                    </svg>
                </span>
			</div>
		`;
    }
    static get properties() {
        return {
            value: {},
            min: {},
            max: {},
            steps: {},
        };
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = +val;
        this.requestUpdate();
    }
    get min() {
        return this._min;
    }
    set min(val) {
        this._min = +val;
        this.requestUpdate();
    }
    get max() {
        return this._max;
    }
    set max(val) {
        this._max = +val;
        this.requestUpdate();
    }
    get steps() {
        return this._steps;
    }
    set steps(val) {
        this._steps = +val;
        this.requestUpdate();
    }
    get suffix() {
        return this.getAttribute("suffix");
    }
    set suffix(v) {
        this.setAttribute("suffix", v);
        this.requestUpdate();
    }
    get isRange() {
        return this.max || this.min;
    }
    constructor() {
        super();
        this._value = 0.2;
        this._min = 0;
        this._max = 0;
        this._steps = 0.1;
        this.requestUpdate();
        this.input = this.shadowRoot.querySelector(".input-container");
        this.inputValue = this.shadowRoot.querySelector(".input-value");
        this.leftArrow = this.shadowRoot.querySelector(".left-arrow");
        this.rightArrow = this.shadowRoot.querySelector(".right-arrow");
        this.registerHandlers();
    }
    registerHandlers() {
        let startPos = null;
        let startMovePos = null;
        let startValue = this.value;
        let focused = false;
        const cancel = () => {
            startPos = null;
            startMovePos = null;
            this.input.removeAttribute("active");
        };
        const up = (e) => {
            if (startPos && !startMovePos) {
                this.inputValue.disabled = false;
                focused = true;
                this.inputValue.focus();
            }
            cancel();
        };
        const start = (e) => {
            if (!focused) {
                startPos = [e.x, e.y];
                startValue = this.value;
                this.input.setAttribute("active", "");
                e.preventDefault();
            }
        };
        const move = (e) => {
            if (startPos) {
                if (Math.abs(e.x - startPos[0]) > 10) {
                    startMovePos = [e.x, e.y];
                }
            }
            if (startMovePos && startPos) {
                let scale = e.shiftKey ? 0.0005 : 0.005;
                if (this.max - this.min > 0) {
                    scale *= (this.max - this.min) / 4;
                }
                let absolute = startValue + (e.x - startPos[0]) * scale;
                absolute = absolute - (absolute % this.steps);
                this.setValue(absolute);
                e.preventDefault();
            }
        };
        const submit = () => {
            if (isNaN(this.inputValue.value)) {
                try {
                    const evalValue = math.evaluate(this.inputValue.value);
                    this.setValue(evalValue);
                }
                catch (err) {
                    console.log(err);
                }
                cancelInput();
            }
            else {
                this.setValue(parseFloat(this.inputValue.value));
                this.inputValue.disabled = true;
                focused = false;
            }
        };
        const cancelInput = () => {
            this.setValue(this.value);
            this.inputValue.disabled = true;
            focused = false;
        };
        const input = (e) => {
            if (e.key == "Enter") {
                submit();
            }
            else if (e.key == "Escape") {
                cancelInput();
            }
        };
        this.inputValue.addEventListener("blur", submit);
        this.inputValue.addEventListener("keydown", input);
        this.input.addEventListener("mousedown", start);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        window.addEventListener("mousecancel", cancel);
        window.addEventListener("mouseleave", cancel);
        this.leftArrow.addEventListener("click", (e) => {
            this.setValue(this.value - this.steps);
            e.preventDefault();
        });
        this.rightArrow.addEventListener("click", (e) => {
            this.setValue(this.value + this.steps);
            e.preventDefault();
        });
        this.addEventListener("mousedown", (e) => {
            if (!startPos && !focused) {
                e.preventDefault();
            }
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name == "value") {
            this.setValue(newValue);
        }
        if (name == "min") {
            this.min = +newValue;
        }
        if (name == "max") {
            this.max = +newValue;
        }
        if (name == "steps") {
            this.steps = +newValue;
        }
    }
    update(args) {
        super.update(args);
        if (!this.inputValue) {
            return;
        }
        if (this.isRange) {
            this.input.style.setProperty("--value", map(this.value, this.min, this.max, 0, 1));
        }
        const getPrecision = (n) => {
            const precParts = n.toString().split(".");
            const size = precParts[1] ? precParts[1].length : 0;
            if (precParts[1] && precParts[1].substring(0, 3) == "000") {
                return 0;
            }
            return size;
        };
        const valuePrecision = getPrecision(this.value);
        const stepsPrecision = getPrecision(this.steps);
        const precision = valuePrecision > stepsPrecision ? stepsPrecision : valuePrecision;
        this.inputValue.value = this.value.toFixed(precision);
        this.inputValue.size = this.inputValue.value.length;
    }
    setValue(value) {
        const lastVal = this.value;
        if (this.isRange) {
            this.value = Math.min(Math.max(value, this.min), this.max);
        }
        else {
            this.value = value;
        }
        this.dispatchEvent(new InputChangeEvent(this.value - lastVal, this.value));
    }
}
class InputChangeEvent extends Event {
    constructor(delta, value) {
        super("change");
        this.delta = delta;
        this.value = value;
    }
}
customElements.define("fluid-input", FluidInput);class Tiemr extends s {
    constructor() {
        super();
        this.updateRate = 1;
        setInterval(() => {
            this.requestUpdate();
        }, 1000 * this.updateRate);
    }
    static get properties() {
        return {
            starttime: Number,
            updateRate: Number,
        };
    }
    static get styles() {
        return r$2 `
      :host {
        display: inline-block;
      }
    `;
    }
    render() {
        const uptimems = Date.now() - new Date(this.starttime).valueOf();
        const uptime = {
            hours: Math.floor(uptimems / 1000 / 60 / 60),
            minutes: Math.floor((uptimems / 1000 / 60) % 60),
            seconds: Math.floor((uptimems / 1000) % 60),
        };
        return $ `
      <span>${`${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s`}</span>
    `;
    }
}
customElements.define("stream-timer", Tiemr);function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
class Color {
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ];
    }
    static rgbToHex(rgb) {
        return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
    }
    static limitColorContrast(...rgb) {
        const hsl = this.rgb2hsl(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
        hsl[2] = Math.max(hsl[2], 0.5);
        return this.hsl2rgb(hsl[0], hsl[1], hsl[2]);
    }
    static hsl2rgb(h, s, l) {
        var r, g, b, m, c, x;
        h *= 360;
        s *= 100;
        l *= 100;
        if (!isFinite(h))
            h = 0;
        if (!isFinite(s))
            s = 0;
        if (!isFinite(l))
            l = 0;
        h /= 60;
        if (h < 0)
            h = 6 - (-h % 6);
        h %= 6;
        s = Math.max(0, Math.min(1, s / 100));
        l = Math.max(0, Math.min(1, l / 100));
        c = (1 - Math.abs((2 * l) - 1)) * s;
        x = c * (1 - Math.abs((h % 2) - 1));
        if (h < 1) {
            r = c;
            g = x;
            b = 0;
        }
        else if (h < 2) {
            r = x;
            g = c;
            b = 0;
        }
        else if (h < 3) {
            r = 0;
            g = c;
            b = x;
        }
        else if (h < 4) {
            r = 0;
            g = x;
            b = c;
        }
        else if (h < 5) {
            r = x;
            g = 0;
            b = c;
        }
        else {
            r = c;
            g = 0;
            b = x;
        }
        m = l - c / 2;
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return [r, g, b];
    }
    static rgb2hsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l * 100];
    }
}const IRCEvents = {
    Joined: "chat.joined",
    Parted: "chat.parted",
    UserState: "chat.user",
    ChatState: "chat.state",
    ChatClear: "chat.clear",
    ChatInfo: "chat.info",
    ChatNote: "chat.notice",
    ChatMessage: "chat.message",
    ChatDeleteMessage: "chat.delete.message",
};
const listeners = new Map();
class IRC {
    static connectoToChat(username, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return invoke("connect_to_chat", {
                username: username,
                token: token,
            }).catch((e) => console.error(e));
        });
    }
    static getUserlist(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return invoke("get_userlist", {
                channel,
            })
                .then((text) => JSON.parse(text))
                .catch((e) => console.error(e));
        });
    }
    static joinChatRoom(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return invoke("chat_join_room", {
                channel,
            }).catch((e) => console.error(e));
        });
    }
    static partChatRoom(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return invoke("chat_leave_room", {
                channel,
            }).catch((e) => console.error(e));
        });
    }
    static sendMessage(channel_login, channel_id, message, reply_message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loopBackMessage = (e) => {
                if (message[0] !== "/") {
                    if (!this.usermap[channel_login]) {
                        console.error("User not listed");
                    }
                    const user = this.usermap[channel_login];
                    const message_data = {
                        channel: channel_login,
                        message_type: "user",
                        id: Math.floor(Math.random() * 100000000000).toString(),
                        text: message,
                        user_name: user.username || "user not found",
                        user_id: "chat-client",
                        color: Color.hexToRgb(user.color),
                        emotes: [],
                        badges: user.badges || [],
                        timestamp: new Date(),
                        is_action: false,
                        bits: 0,
                        tags: {
                            "room-id": channel_id,
                            "reply-parent-msg-id": reply_message_id != undefined ? reply_message_id : null,
                        },
                    };
                    for (let callback of listeners.get("chat.message")) {
                        callback(message_data);
                    }
                }
                console.log("message sent");
            };
            if (reply_message_id != undefined) {
                return invoke("chat_reply", {
                    channel: channel_login,
                    messageId: reply_message_id,
                    message: message,
                })
                    .then(loopBackMessage)
                    .catch((e) => console.error(e));
            }
            else {
                return invoke("chat_send_message", {
                    channel: channel_login,
                    message,
                })
                    .then(loopBackMessage)
                    .catch((e) => console.error(e));
            }
        });
    }
    static replyToMessage(channel_login, channel_id, message, message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendMessage(channel_login, channel_id, message, message_id);
        });
    }
    static sendCommand(channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return invoke("chat_send_message", {
                channel,
                message,
            })
                .then((e) => {
                console.log("command sent");
            })
                .catch((e) => console.error(e));
        });
    }
    static listen(eventName, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!listeners.has(eventName)) {
                listeners.set(eventName, new Set());
            }
            listeners.get(eventName).add(callback);
            return listen(eventName, (event) => {
                switch (eventName) {
                    case "chat.user": {
                        if (event.payload) {
                            const payload = event.payload;
                            const message_data = {
                                channel: payload.channel,
                                username: payload.username,
                                badges: payload.badges,
                                color: Color.rgbToHex(Color.limitColorContrast(...payload.name_color)),
                                emote_sets: payload.emote_sets,
                            };
                            this.usermap[payload.channel] = message_data;
                            return callback(message_data);
                        }
                        break;
                    }
                    case "chat.clear": {
                        if (event.payload) {
                            return callback(event.payload);
                        }
                        break;
                    }
                    case "chat.message": {
                        return callback(event.payload);
                    }
                    case "chat.delete.message": {
                        return callback(event.payload);
                    }
                    case "chat.info": {
                        return callback(event.payload);
                    }
                    case "chat.state": {
                        if (event.payload) {
                            return callback(event.payload);
                        }
                        break;
                    }
                    case "chat.joined": {
                        if (event.payload) {
                            return callback(event.payload);
                        }
                        break;
                    }
                    case "chat.parted": {
                        if (event.payload) {
                            return callback(event.payload);
                        }
                        break;
                    }
                    default: {
                        if (event.payload) {
                            return callback(event.payload);
                        }
                        break;
                    }
                }
            });
        });
    }
}
IRC.usermap = {};const NumberFormat = new Intl.NumberFormat('en-IN');
const langFormat = new Intl.DisplayNames(['en'], { type: 'language' });
class Format {
}
Format.lang = (langshort) => langFormat.of(langshort);
Format.number = (n) => NumberFormat.format(n);
Format.seconds = (s, short = false) => {
    if (s > 60 * 60) {
        const h = s / 60 / 60;
        return `${h.toFixed(1)} ${short ? "h" : (h > 1 ? "hours" : "hour")}`;
    }
    if (s > 60) {
        const m = Math.floor(s / 60);
        return `${m} ${short ? "min" : (m > 1 ? "minutes" : "minute")}`;
    }
    return `${s} ${short ? (s > 1 ? "secs" : "sec") : (s > 1 ? "seconds" : "second")}`;
};class ChatUserList extends s {
    constructor() {
        super(...arguments);
        this.filter = "";
    }
    static get properties() {
        return {
            channel: String,
        };
    }
    updateList() {
        this.request();
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield IRC.getUserlist(this.channel);
            this.list = list.chatters;
            const chatters = list.chatters;
            const viewerCount = chatters.viewers.length;
            const modCount = chatters.moderators.length;
            const vipCount = chatters.vips.length;
            const staffCount = chatters.staff.length +
                chatters.admins.length +
                chatters.global_mods.length;
            const counts = this.shadowRoot.querySelector(".user-list-counts");
            counts.innerHTML = "";
            if (staffCount > 0) {
                counts.innerHTML += `<img height="16px" width="16px" src="./images/Staff.svg"/> ${Format.number(staffCount)}  `;
            }
            if (modCount > 0) {
                counts.innerHTML += `<img height="16px" width="16px" src="./images/Mod.svg"/> ${Format.number(modCount)}  `;
            }
            if (vipCount > 0) {
                counts.innerHTML += `<img height="16px" width="16px" src="./images/VIP.svg"/> ${Format.number(vipCount)}  `;
            }
            counts.innerHTML += `<img height="16px" width="16px" src="./images/Viewer.svg"/> ${Format.number(viewerCount)}`;
            this.requestUpdate();
        });
    }
    static get styles() {
        return r$2 `
      @keyframes userlist-slidein {
        from {
          transform: translate(0, -10px);
          opacity: 0;
        }
      }
      :host {
        display: block;
        animation: userlist-slidein 0.2s ease;
        z-index: 10000000;
      }
      .list,
      .preview {
        min-height: 10px;
        border-radius: 3px;
        background: #1f1f23f0;
        backdrop-filter: blur(12px);
        box-shadow: rgb(0 0 0 / 25%) 1px 2px 8px;
        padding: 10px 10px;
        font-size: 12px;
        color: #eee;
        border: 1px solid #303030;
        min-width: 200px;
        max-width: 400px;
      }
      .preview {
        white-space: nowrap;
        margin-bottom: 5px;
      }
      .list {
        max-height: 500px;
        overflow: auto;
        font-size: 14px;
      }
      .user-search {
        color: #eee;
        margin-bottom: 5px;
        width: 100%;
        background: transparent;
        border: none;
        border-bottom: 1px solid grey;
        padding: 6px 8px;
        box-sizing: border-box;
      }
      .full-list {
      }
      .list-title {
        margin: 15px 0 8px 0;
        color: rgb(185 185 185);
      }
      .user {
      }
      .user-list-counts {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .user-list-counts img:not(:first-child) {
        margin-left: 15px;
      }
      .user-list-counts img {
        margin-right: 5px;
      }

      /* // webkit scrollbars */
      ::-webkit-scrollbar {
        width: 8px;
        margin: 5px 0;
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      ::-webkit-scrollbar-track-piece {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-scrollbar-thumb, #464646);
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-scrollbar-thumb-hover, #555555);
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
    }
    setFilter(str) {
        this.filter = str;
        this.requestUpdate();
    }
    render() {
        const renderList = (arr) => {
            return arr
                .filter((username) => {
                return username.match(this.filter);
            })
                .map((username) => {
                return $ `<div class="user">${username}</div>`;
            });
        };
        return $ `
      <div class="preview">
        <span class="user-list-counts"></span>
      </div>

      ${this.list
            ? $ `
            <div class="list">
              <input
                class="user-search"
                placeholder="Search user"
                @input="${(e) => {
                this.setFilter(e.target.value);
            }}"
              />
              <div class="full-list">
                <div class="list-title">Braodcast</div>
                ${renderList(this.list.broadcaster)}
                <div class="list-title">Staff</div>
                ${renderList(this.list.staff)}
                <div class="list-title">Mods</div>
                ${renderList(this.list.moderators)}
                <div class="list-title">VIPs</div>
                ${renderList(this.list.vips)}
                <div class="list-title">Viewers</div>
                ${renderList(this.list.viewers)}
              </div>
            </div>
          `
            : ""}
    `;
    }
}
customElements.define("chat-user-list", ChatUserList);class Chat extends s {
    constructor() {
        super();
        this.MAX_BUFFER_SIZE = 200;
        this.channel = "";
        this.scrollLock = true;
        this.chatHeight = 0;
        this.init = false;
        this.moderator = false;
        this.cancelLastScrollAnimation = null;
        this.lastMessage = null;
        window.addEventListener("resize", (e) => {
            this.chatHeight = this.clientHeight;
        });
    }
    static get properties() {
        return {
            hidden: { type: Boolean },
        };
    }
    cancelAnimation() {
        if (this.cancelLastScrollAnimation) {
            this.cancelLastScrollAnimation();
        }
    }
    appendMessage(msg) {
        let followup = false;
        if (this.lastMessage && this.lastMessage.user_name == msg.user_name) {
            followup = true;
        }
        const ele = msg.content(this.moderator);
        if (ele) {
            if (followup) {
                ele.setAttribute("followup", "");
            }
            const line = this.insertAdjacentElement("beforeend", ele);
            this.afterAppend();
            this.lastMessage = msg;
            return line;
        }
    }
    appendInfo(msg) {
        const line = new ChatInfo(msg);
        this.insertAdjacentElement("beforeend", line);
        this.afterAppend();
    }
    appendNote(text) {
        const line = new ChatNote(text);
        this.insertAdjacentElement("beforeend", line);
        this.afterAppend();
    }
    appendTimestamp(ts) {
        this.appendNote($ `
      <div class="timestamp">
        ${ts.toLocaleDateString()} ${ts.toLocaleTimeString()}
      </div>
    `);
    }
    setRoom(channel) {
        this.channel = channel;
        this.requestUpdate();
        this.setAttribute("name", this.channel);
    }
    placeBookmarkLine() {
        if (this.bookmark) {
            this.removeBookmarkLine();
        }
        const line = document.createElement("div");
        line.className = "bookmark";
        this.appendChild(line);
        this.bookmark = line;
    }
    removeBookmarkLine() {
        if (this.bookmark) {
            this.bookmark.remove();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.chatHeight = this.clientHeight;
        this.show();
    }
    onScroll(e) {
        if (!this.scrollLock) {
            if (this.scrollElement.scrollTop >= this.lowestScrollX) {
                this.lock();
            }
        }
    }
    onWheel(e) {
        const dir = e.deltaY;
        if (dir < 0 && this.scrollLock) {
            this.cancelAnimation();
            this.unlock();
        }
    }
    lock() {
        this.scrollLock = true;
        this.setAttribute("locked", "");
    }
    unlock() {
        this.scrollLock = false;
        this.removeAttribute("locked");
        this.placeBookmarkLine();
    }
    show() {
        this.removeAttribute("hidden");
        requestAnimationFrame(() => {
            this.chatHeight = this.clientHeight;
            this.scrollElement = this.shadowRoot.querySelector(".lines");
            if (!this.init) {
                this.scrollElement.addEventListener("wheel", (e) => this.onWheel(e));
                this.init = true;
            }
            this.scrollToLatest();
            this.lock();
        });
    }
    hide() {
        this.setAttribute("hidden", "");
    }
    get lowestScrollX() {
        var _a;
        return (((_a = this.scrollElement) === null || _a === void 0 ? void 0 : _a.scrollHeight) || 0) - this.chatHeight;
    }
    scrollToLatest() {
        if (this.hasAttribute("hidden")) {
            return;
        }
        if (this.scrollElement) {
            AnimatedScroll.scrollTo(this.lowestScrollX, this.scrollElement);
        }
        this.lock();
    }
    afterAppend() {
        if (this.children.length > this.MAX_BUFFER_SIZE + 20) {
            const rest = this.children.length - this.MAX_BUFFER_SIZE;
            for (let i = 0; i < rest; i++) {
                this.children[i].remove();
            }
        }
        if (this.scrollLock) {
            requestAnimationFrame(() => {
                this.scrollToLatest();
            });
        }
    }
    render() {
        return $ `
      <div class="chat-actions">
        <div></div>
        <div class="chat-channel-name">${this.channel}</div>
        <div class="chat-state-icons"></div>
      </div>
      <div class="scroll-to-bottom" @click="${() => this.scrollToLatest()}">
        <span>Scroll to the bottom</span>
      </div>
      <div class="lines" @scroll="${(e) => this.onScroll(e)}">
        <slot></slot>
      </div>
    `;
    }
    static get styles() {
        return r$2 `
      :host {
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .header {
        background: rgba(25, 25, 28, 0.75);
        backdrop-filter: blur(24px);
        background: rgba(25, 25, 28, 0.9);
        backdrop-filter: blur(24px);
        position: relative;
        z-index: 1000;
        border-bottom: 1px solid black;
      }

      .lines {
        backface-visibility: hidden; /* prevent repaint */
        padding-top: 30px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      .lines-inner {
        display: block;
      }
      .line {
      }

      .chat-actions {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        padding: 4px 8px;
        box-sizing: border-box;
      }

      .chat-action {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      .chat-actions button {
        border: none;
        padding: 0px;
        margin: 0px;
        background: transparent;
        min-width: 24px;
        height: 22px;
        cursor: pointer;
      }
      .chat-actions button:hover {
        outline: #464646 solid 1px;
      }
      .chat-actions button:active {
        background: #333333;
      }
      .chat-actions button:active img {
        transform: scale(0.95);
      }

      .scroll-to-bottom {
        transition: opacity 0.125s ease, transform 0.125s ease;
        transform: translate(0, 10px);
        opacity: 0;
        pointer-events: none;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgb(8 8 8 / 75%);
        backdrop-filter: blur(12px);
        padding: 8px 15px;
        text-align: center;
        box-sizing: border-box;
        z-index: 100000;
        cursor: pointer;
        margin: 4px 40px;
        border-radius: 6px;
        border: 1px solid #19191b;
      }

      :host(:not([locked])) .scroll-to-bottom {
        transform: translate(0, 0);
        opacity: 1;
        pointer-events: all;
        transition: opacity 0.25s ease, transform 0.25s ease;
      }

      :host(:not([locked])) .scroll-to-bottom:hover {
        transform: scale(1.005);
        transition: none;
      }
      :host(:not([locked])) .scroll-to-bottom:active {
        transform: scale(0.995);
      }

      /* // webkit scrollbars */
      ::-webkit-scrollbar {
        width: 8px;
        margin: 5px 0;
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      ::-webkit-scrollbar-track-piece {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-scrollbar-thumb, #1c1c1c);
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-scrollbar-thumb-hover, #333333);
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }

      .chat-channel-name {
        opacity: 0.75;
        font-size: 12px;
        font-weight: 400;
      }
      .chat-channel-name:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      .chat-channel-name:active {
        opacity: 0.5;
      }
      :host([modview]) .chat-channel-name {
        display: none;
      }
    `;
    }
}
customElements.define("sample-chat", Chat);var UserLevel;
(function (UserLevel) {
    UserLevel[UserLevel["everyone"] = 0] = "everyone";
    UserLevel[UserLevel["subscriber"] = 1] = "subscriber";
    UserLevel[UserLevel["vip"] = 2] = "vip";
    UserLevel[UserLevel["moderator"] = 3] = "moderator";
    UserLevel[UserLevel["editor"] = 4] = "editor";
    UserLevel[UserLevel["broadcaster"] = 5] = "broadcaster";
})(UserLevel || (UserLevel = {}));class AppEvent extends Event {
    constructor(eventType) {
        if (!eventType) {
            throw new Error("Tried to create event without type");
        }
        super(eventType);
        this.data = {};
    }
    static get type() {
        return "unknown-event";
    }
}class ChannelCreatedEvent extends AppEvent {
    constructor(channel) {
        super(ChannelCreatedEvent.type);
        this.data = {
            id: channel.channel_id,
            channel
        };
    }
    static get type() {
        return "app-channel-created";
    }
}class ChannelRemovedEvent extends AppEvent {
    constructor(channel_name) {
        super("app-channel-removed");
        this.data = {
            name: channel_name
        };
    }
}class ChannelMovedEvent extends AppEvent {
    constructor(to_index, from_index) {
        super("app-channel-moved");
        this.data = {
            from_index: from_index,
            to_index: to_index,
        };
    }
}class ChannelSelecteddEvent extends AppEvent {
    constructor(channel_name) {
        super("app-channel-selected");
        this.data = {
            channel: channel_name
        };
    }
}const defaultCommandList = [
    {
        command: 'mods',
        syntax: '/mods',
        userlevel: UserLevel.everyone,
        description: 'This command will display a list of all chat moderators for that specific channel.'
    },
    {
        command: 'vips',
        syntax: '/vips',
        userlevel: UserLevel.everyone,
        description: 'This command will display a list of VIPs for that specific channel.'
    },
    {
        command: 'color',
        syntax: '/color COLOR',
        userlevel: UserLevel.everyone,
        description: 'Allows you to change the color of your username'
    },
    {
        command: 'block',
        syntax: '/block USERNAME',
        userlevel: UserLevel.everyone,
        description: 'This command will allow you to block all messages from a specific user in chat and whispers if you do not wish to see their comments.'
    },
    {
        command: 'unblock',
        syntax: '/unblock USERNAME',
        userlevel: UserLevel.everyone,
        description: 'This command will allow you to remove users from your block list that you previously added.'
    },
    {
        command: 'me',
        syntax: '/me TEXT',
        userlevel: UserLevel.everyone,
        description: 'This command will remove the colon that typically appears after your chat name and colorizes your message text with your names color.'
    },
    {
        command: 'w',
        syntax: '/w USERNAME MESSAGE',
        userlevel: UserLevel.everyone,
        description: 'This command sends a private message to another user on Twitch.'
    },
    {
        command: 'timeout',
        syntax: '/timeout USERNAME SECONDS',
        userlevel: UserLevel.moderator,
        description: 'This command allows you to temporarily ban someone from the chat room for 10 minutes by default.'
    },
    {
        command: 'ban',
        syntax: '/ban USERNAME',
        userlevel: UserLevel.moderator,
        description: 'This command will allow you to permanently ban a user from the chat room.'
    },
    {
        command: 'unban',
        syntax: '/unban USERNAME',
        userlevel: UserLevel.moderator,
        description: 'This command will allow you to lift a permanent ban on a user from the chat room. You can also use this command to end a ban early; this also applies to timeouts.'
    },
    {
        command: 'slow',
        syntax: '/slow SECONDS',
        userlevel: UserLevel.moderator,
        description: 'This command allows you to set a limit on how often users in the chat room are allowed to send messages (rate limiting).'
    },
    {
        command: 'slowoff',
        syntax: '/slowoff',
        userlevel: UserLevel.moderator,
        description: 'This command allows you to disable slow mode if you had previously set it.'
    },
    {
        command: 'followers',
        syntax: '/followers',
        userlevel: UserLevel.moderator,
        description: 'This command allows you or your mods to restrict chat to all or some of your followers, based on how long they’ve followed — from 0 minutes (all followers) to 3 months.'
    },
    {
        command: 'followersoff',
        syntax: '/followersoff',
        userlevel: UserLevel.moderator,
        description: 'This command will disable followers only mode if it was previously enabled on the channel.'
    },
    {
        command: 'subscribers',
        syntax: '/subscribers',
        userlevel: UserLevel.moderator,
        description: 'This command allows you to set your room so only users subscribed to you can talk in the chat room.'
    },
    {
        command: 'subscribersoff',
        syntax: '/subscribersoff',
        userlevel: UserLevel.moderator,
        description: 'This command allows you to disable subscribers only chat room if you previously enabled it.'
    },
    {
        command: 'clear',
        syntax: '/clear',
        userlevel: UserLevel.moderator,
        description: 'This command will allow the Broadcaster and chat moderators to completely wipe the previous chat history.'
    },
    {
        command: 'emoteonly',
        syntax: '/emoteonly',
        userlevel: UserLevel.moderator,
        description: 'This command allows you to set your room so only messages that are 100% emotes are allowed.'
    },
    {
        command: 'emoteonlyoff',
        syntax: '/emoteonlyoff',
        userlevel: UserLevel.moderator,
        description: 'This command allows you to disable emote only mode if you previously enabled it.'
    },
    {
        command: 'commercial',
        syntax: '/commercial',
        userlevel: UserLevel.moderator,
        description: 'An Affiliate and Partner command that runs a commercial, for 30 seconds, for all of your viewers.'
    },
    {
        command: 'poll',
        syntax: '/poll',
        userlevel: UserLevel.moderator,
        description: 'Open create Poll dialog.'
    }
];
class TwitchCommands {
    static fetchCommandList(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                commandPrefix: "/",
                serviceName: "Twitch",
                commands: defaultCommandList.map((cmd) => {
                    return {
                        command: cmd.command,
                        description: cmd.description,
                        userlevel: cmd.userlevel,
                    };
                })
            };
        });
    }
}function generateNonce(length = 30) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
const reward_listeners = new Set();
const mod_action_listeners = new Set();
const poll_listeners = new Set();
const hype_train_listeners = new Set();
const request_nonce_map = {};
class TwitchPubsub {
    constructor(oauth_token) {
        this.pubsub_url = 'wss://pubsub-edge.twitch.tv';
        this.rewards = {};
        this.access_token = oauth_token;
        const token = localStorage.getItem('user-token');
        if (!token) {
            throw new Error('not logged in, can not connect to pubsub.');
        }
    }
    loadRedemtionHistory() {
        const redemtion_history = localStorage.getItem('redemtion-hisotry');
        if (redemtion_history) {
            this.rewards = JSON.parse(redemtion_history);
        }
    }
    saveRedemtionHistory() {
        localStorage.setItem('redemtion-hisotry', JSON.stringify(this.rewards));
    }
    queuePing() {
        setTimeout(() => {
            this.socket.send(JSON.stringify({ type: "PING" }));
        }, 1000 * 60 * (4 + Math.random()));
    }
    reconnect() {
        console.log('reconnecting...');
        setTimeout(() => {
            this.connect();
        }, 1000);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log('Connecting to pubsub');
                this.socket = new WebSocket(this.pubsub_url);
                this.socket.addEventListener('message', ({ data }) => {
                    const json = JSON.parse(data);
                    if (json.error) {
                        console.error('Error', json.error);
                        return;
                    }
                    if (json.type === "PONG") {
                        console.log('PONG');
                        this.queuePing();
                        return;
                    }
                    if (json.type === "RECONNECT") {
                        console.log('RECONNECT');
                        this.reconnect();
                        return;
                    }
                    if (json.type === "RESPONSE") {
                        if (json.error != "") {
                            console.log('pubsub error response', json);
                        }
                        else {
                            for (let topic of request_nonce_map[json.nonce]) {
                                console.log('sucessfull listen on', topic);
                            }
                            delete request_nonce_map[json.nonce];
                        }
                    }
                    if (json.type === "MESSAGE") {
                        const messageData = JSON.parse(json.data.message);
                        this.handlePubsubMessage(messageData);
                    }
                });
                this.socket.addEventListener('open', e => {
                    this.queuePing();
                    resolve(true);
                });
                this.socket.addEventListener('error', e => {
                    reject();
                });
                this.socket.addEventListener('close', e => {
                    this.reconnect();
                });
            });
        });
    }
    listen(topics) {
        const nonce = generateNonce();
        const request = {
            "type": "LISTEN",
            "nonce": nonce,
            "data": {
                "topics": topics,
                "auth_token": this.access_token
            }
        };
        request_nonce_map[nonce] = topics;
        this.socket.send(JSON.stringify(request));
    }
    onRedemtion(callback) {
        reward_listeners.add(callback);
        return () => reward_listeners.delete(callback);
    }
    onModAction(callback) {
        mod_action_listeners.add(callback);
        return () => mod_action_listeners.delete(callback);
    }
    onHypeTrain(callback) {
        hype_train_listeners.add(callback);
        return () => hype_train_listeners.delete(callback);
    }
    handlePubsubMessage(message) {
        switch (message.type) {
            case "reward-redeemed":
                this.handleRedemtionMessage(message);
                break;
            case "moderation_action":
                this.handleModActionMessage(message);
                break;
            case "hype-train-start":
                this.handleHypeTrainMessage(message);
                break;
            case "POLL_COMPLETE":
            case "POLL_UPDATE":
            case "POLL_CREATE":
                this.handlePollMessage(message);
                break;
            default:
                console.log('Uunhandled pubsub message', message.type);
                console.log(message);
        }
    }
    handleHypeTrainMessage(message) {
        const channel_id = message.data.channel_id;
        const level = message.data.progress.level.value;
        const started_at = message.data.started_at;
        const expires_at = message.data.expires_at;
        this.emitForListeners(hype_train_listeners, {
            channel_id,
            level,
            started_at,
            expires_at,
        });
    }
    handlePollMessage(message) {
        const poll = message.data.poll;
        const title = poll.title;
        const started_at = poll.started_at;
        const duration = poll.duration_seconds;
        const options = poll.choices;
        switch (message.type) {
            case "POLL_CREATE":
                this.emitForListeners(poll_listeners, {
                    title,
                    started_at,
                    duration,
                    options
                });
                break;
        }
    }
    handleRedemtionMessage(message) {
        var _a;
        const data = message.data;
        const redemtion = data.redemption;
        const channel_id = redemtion.channel_id;
        const ts = redemtion.redeemed_at;
        const user_id = redemtion.user.id;
        const user_name = redemtion.user.display_name;
        const reward = redemtion.reward;
        const reward_id = reward.id;
        const cost = reward.cost;
        const title = reward.title;
        const image_url = ((_a = reward.image) === null || _a === void 0 ? void 0 : _a.url_2x) || reward.default_image.url_2x;
        const reward_data = {
            reward_id,
            channel_id,
            cost,
            timestamp: ts,
            user_id,
            user_name,
            title,
            image_url
        };
        this.emitForListeners(reward_listeners, reward_data);
        this.rewards[reward_data.reward_id] = reward_data;
        this.saveRedemtionHistory();
    }
    handleModActionMessage(message) {
        const data = message.data;
        const action = data.moderation_action;
        switch (action) {
            case "timeout": {
                const mod_user = data.created_by;
                const [target_user, time] = data.args;
                this.emitForListeners(mod_action_listeners, {
                    action: action,
                    message: `${mod_user} timed out ${target_user} for ${Format.seconds(time)}.`
                });
                break;
            }
            case "untimeout": {
                const mod_user = data.created_by;
                const [target_user] = data.args;
                this.emitForListeners(mod_action_listeners, {
                    action: action,
                    message: `${mod_user} remove the timeout for ${target_user}.`
                });
                break;
            }
            default:
                console.log('unhandled mod action', message);
        }
    }
    emitForListeners(listeners, data) {
        for (let listener of listeners) {
            listener(data);
        }
    }
}const CLIENT_ID = "8gwe8mu523g9cstukr8rnnwspqjykf";
const REDIRECT_URI = "https://best-twitch-chat.web.app/auth";
class TwitchApi {
    static get CLIENT_ID() {
        return CLIENT_ID;
    }
    static get REDIRECT_URI() {
        return REDIRECT_URI;
    }
    static fetch(path = "/users", query = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const token = localStorage.getItem('user-token');
            const url = `https://api.twitch.tv/helix${path}?${query}&client_id=${CLIENT_ID}`;
            return fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Client-Id': CLIENT_ID
                }
            })
                .then(res => res.json())
                .catch(err => {
                console.error(err);
            });
        });
    }
    static getUserInfo(user_login) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user_login.length <= 2) {
                return undefined;
            }
            const userinfo = yield this.fetch("/users", `login=${user_login}`);
            if (userinfo.data) {
                return userinfo.data[0];
            }
        });
    }
    static getCustomReward(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userinfo = yield this.fetch("/channel_points/custom_rewards", `broadcaster_id=${user_id}`);
            return userinfo;
        });
    }
    static connectToPubSub() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = localStorage.getItem('user-token');
            if (token) {
                const pubsub = new TwitchPubsub(token);
                return pubsub.connect().then(() => pubsub);
            }
            else {
                throw new Error('not logged in, can not connect to pubsub.');
            }
        });
    }
    static getStreams(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.fetch("/streams", "user_id=" + user_id)).data;
        });
    }
    static getChannel(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.fetch("/channels", "broadcaster_id=" + user_id)).data;
        });
    }
    static getAvailableCommands() {
        return defaultCommandList;
    }
    static getClip(clip_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.fetch('/clips', 'id=' + clip_id)).data;
        });
    }
    static setChannelInfo(channel_id, info) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch('https://api.twitch.tv/helix/channels?broadcaster_id=' + channel_id, {
                method: "PATCH",
                body: JSON.stringify(info),
            });
        });
    }
    static getChannelEditors(channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.fetch('/channels/editors', 'broadcaster_id=' + channel_id)).data;
        });
    }
    static createPoll() {
    }
    static getModdedChannels(channel_login) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(`https://modlookup.3v.fi/api/user-v3/${channel_login}`, {
                headers: {
                    "User-Agent": "https://github.com/luckydye/better-twitch-chat"
                }
            })
                .then(res => res.json())
                .then(json => {
                return json.channels;
            });
        });
    }
}class Focus {
    static onFocus(callback) {
        window.addEventListener('focus', e => {
            callback();
        });
    }
    static onBlur(callback) {
        window.addEventListener('blur', e => {
            callback();
        });
    }
}let global_badges = {};
let channel_badges = {};
class Badges {
    static getBadgeByName(name, version) {
        const badge = global_badges[name];
        if (badge.versions[version]) {
            return badge.versions[version].image_url_2x;
        }
        else {
            return badge.versions[Object.keys(badge.versions)[0]].image_url_2x;
        }
    }
    static getChachedChannelBadges(channel_id) {
        if (!channel_badges[channel_id]) {
            channel_badges[channel_id] = {};
            Badges.getChannelBadges(channel_id);
        }
        return channel_badges[channel_id];
    }
    static getChannelBadges(channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channel_id)
                return;
            return fetch(`https://badges.twitch.tv/v1/badges/channels/${channel_id}/display`)
                .then(res => res.json())
                .then(json => {
                channel_badges[channel_id] = json.badge_sets;
                return json.badge_sets;
            })
                .catch(err => {
                console.error(err);
            });
        });
    }
    static getGlobalBadges() {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch("https://badges.twitch.tv/v1/badges/global/display")
                .then(res => res.json())
                .then(json => {
                global_badges = json.badge_sets;
            })
                .catch(err => {
                console.error(err);
            });
        });
    }
}class EmoteService {
    static get service_name() {
        return "emotes";
    }
    static get global_emotes() {
        throw new Error('global_emotes getter not implemented');
    }
    static getGlobalEmotes() {
        throw new Error('getGlobalEmotes() not implemented');
    }
    static getChannelEmotes(id) {
        throw new Error('getChannelEmotes() not implemented');
    }
}class Emote {
    constructor(emote) {
        this.id = emote.id;
    }
    static get url_template() {
        return "";
    }
    static get scale_template() {
        return {
            x1: "x1",
            x2: "x2",
            x3: "x3",
        };
    }
    get url_x1() {
        return this.constructor.url_template
            .replace("{{id}}", this.id)
            .replace("{{scale}}", this.constructor.scale_template.x1);
    }
    get url_x2() {
        return this.constructor.url_template
            .replace("{{id}}", this.id)
            .replace("{{scale}}", this.constructor.scale_template.x2);
    }
    get url_x3() {
        return this.constructor.url_template
            .replace("{{id}}", this.id)
            .replace("{{scale}}", this.constructor.scale_template.x3);
    }
}let globalEmotes$3 = {};
let emoteSets = new Map();
class TwitchEmote extends Emote {
    constructor(emote) {
        super(emote);
        this.owner_id = emote.owner_id;
        this.type = emote.emote_type;
    }
    static get url_template() {
        const theme = "dark";
        const format = "default";
        return `https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/${format}/${theme}/{{scale}}`;
    }
    static get scale_template() {
        return {
            x1: "1.0",
            x2: "2.0",
            x3: "3.0",
        };
    }
}
class TwitchEmotes extends EmoteService {
    static get service_name() {
        return "twitch";
    }
    static get global_emotes() {
        return globalEmotes$3;
    }
    static getGlobalEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            return TwitchApi.fetch("/chat/emotes/global").then(data => {
                for (let emote of data.data) {
                    globalEmotes$3[emote.name] = new TwitchEmote(emote);
                }
                return globalEmotes$3;
            });
        });
    }
    static getChannelEmotes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return TwitchApi.fetch("/chat/emotes", "broadcaster_id=" + id).then(data => {
                if (data.data) {
                    const channelEmotes = {};
                    for (let emote of data.data) {
                        channelEmotes[emote.name] = new TwitchEmote(emote);
                    }
                    return channelEmotes;
                }
            });
        });
    }
    static getEmoteSets(emote_sets) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(emote_sets.map(set_id => this.getEmoteSet(set_id))).then(sets => {
                const fitlerdSets = [];
                for (let set of sets) {
                    if (set != null) {
                        fitlerdSets.push(set);
                    }
                }
                return fitlerdSets;
            });
        });
    }
    static getEmoteSet(emote_set_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (emoteSets.has(emote_set_id)) {
                return emoteSets.get(emote_set_id);
            }
            return TwitchApi.fetch('/chat/emotes/set', 'emote_set_id=' + emote_set_id)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (data.data && data.data.length > 0) {
                    const emtoeSet = {};
                    for (let emote of data.data) {
                        emtoeSet[emote.name] = new TwitchEmote(emote);
                    }
                    let set_name = data.data[0].emote_type;
                    if (set_name == "subscriptions") {
                        const channel = (yield TwitchApi.getChannel(data.data[0].owner_id));
                        set_name = ((_a = channel[0]) === null || _a === void 0 ? void 0 : _a.broadcaster_name) || set_name;
                    }
                    const set = {
                        name: set_name,
                        emotes: emtoeSet
                    };
                    emoteSets.set(emote_set_id, set);
                    return set;
                }
            }));
        });
    }
}let globalEmotes$2 = {};
class BTTVEmote extends Emote {
    static get url_template() {
        return "https://cdn.betterttv.net/emote/{{id}}/{{scale}}";
    }
    static get scale_template() {
        return {
            x1: "1x",
            x2: "2x",
            x3: "3x",
        };
    }
}
class BTTVEmotes extends EmoteService {
    static get service_name() {
        return "bttv";
    }
    static get global_emotes() {
        return globalEmotes$2;
    }
    static getGlobalEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch("https://api.betterttv.net/3/cached/emotes/global")
                .then(res => res.json())
                .then(data => {
                for (let emote of data) {
                    globalEmotes$2[emote.code] = new BTTVEmote(emote);
                }
                return globalEmotes$2;
            });
        });
    }
    static getChannelEmotes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch("https://api.betterttv.net/3/cached/users/twitch/" + id)
                .then(res => res.json())
                .then(data => {
                const channelEmotes = {};
                if (data.channelEmotes) {
                    for (let emote of data.channelEmotes) {
                        channelEmotes[emote.code] = new BTTVEmote(emote);
                    }
                }
                if (data.sharedEmotes) {
                    for (let emote of data.sharedEmotes) {
                        channelEmotes[emote.code] = new BTTVEmote(emote);
                    }
                }
                return channelEmotes;
            });
        });
    }
}let globalEmotes$1 = {};
class FFZEmote extends Emote {
    static get url_template() {
        return "https://cdn.frankerfacez.com/emote/{{id}}/{{scale}}";
    }
    static get scale_template() {
        return {
            x1: "1",
            x2: "2",
            x3: "3",
        };
    }
}
class FFZEmotes extends EmoteService {
    static get service_name() {
        return "ffz";
    }
    static get global_emotes() {
        return globalEmotes$1;
    }
    static getGlobalEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    static getChannelEmotes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch("https://api.frankerfacez.com/v1/room/id/" + id)
                .then(res => res.json())
                .then(data => {
                if (data.sets) {
                    const channelEmotes = {};
                    for (let set in data.sets) {
                        for (let emote of data.sets[set].emoticons) {
                            channelEmotes[emote.name] = new FFZEmote(emote);
                        }
                    }
                    return channelEmotes;
                }
            });
        });
    }
}let globalEmotes = {};
class SevenTVEmote extends Emote {
    static get url_template() {
        return "https://cdn.7tv.app/emote/{{id}}/{{scale}}";
    }
    static get scale_template() {
        return {
            x1: "1x",
            x2: "2x",
            x3: "3x",
        };
    }
}
class SevenTVEmotes extends EmoteService {
    static get service_name() {
        return "7tv";
    }
    static get global_emotes() {
        return globalEmotes;
    }
    static getGlobalEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch("https://api.7tv.app/v2/emotes/global")
                .then(res => res.json())
                .then(data => {
                for (let emote of data) {
                    globalEmotes[emote.name] = new SevenTVEmote(emote);
                }
                return globalEmotes;
            });
        });
    }
    static getChannelEmotes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(`https://api.7tv.app/v2/users/${id}/emotes`)
                .then(res => res.json())
                .then(data => {
                const channelEmotes = {};
                if (data.status !== 404) {
                    for (let emote of data) {
                        channelEmotes[emote.name] = new SevenTVEmote(emote);
                    }
                }
                return channelEmotes;
            });
        });
    }
}let global_emotes = {};
let channel_emotes = {};
const EMOTE_SERVICES = [
    TwitchEmotes,
    BTTVEmotes,
    FFZEmotes,
    SevenTVEmotes
];
class Emotes {
    static get global_emotes() {
        return global_emotes;
    }
    static getGlobalEmote(name) {
        for (let service in global_emotes) {
            if (!global_emotes[service]) {
                continue;
            }
            if (name in global_emotes[service]) {
                return global_emotes[service][name];
            }
        }
    }
    static getGlobalEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promise.all([...EMOTE_SERVICES].map((Service) => __awaiter(this, void 0, void 0, function* () {
                const emotes = yield Service.getGlobalEmotes();
                global_emotes[Service.service_name] = emotes;
            }))).then(() => {
                return global_emotes;
            });
        });
    }
    static getChachedChannelEmotes(channel_id) {
        if (!channel_emotes[channel_id]) {
            Emotes.getChannelEmotes(channel_id);
        }
        return channel_emotes[channel_id];
    }
    static getChannelEmotes(channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channel_id)
                return;
            if (!channel_emotes[channel_id]) {
                channel_emotes[channel_id] = {};
            }
            return yield Promise.all([...EMOTE_SERVICES].map((Service) => __awaiter(this, void 0, void 0, function* () {
                const emotes = yield Service.getChannelEmotes(channel_id);
                channel_emotes[channel_id][Service.service_name] = emotes;
            }))).then(() => {
                return channel_emotes[channel_id];
            });
        });
    }
}class Webbrowser {
    static parseSearch(str = "", res = {}) {
        str
            .substring(1)
            .split("&")
            .map((item) => item.split("="))
            .forEach((item) => {
            res[item[0]] = unescape(item[1]);
        });
        return res;
    }
    static matchURL(str) {
        return str.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g);
    }
    static openInBrowwser(url) {
        invoke("open_link", { url });
    }
}class Account {
    constructor(user_info, oauth_token) {
        this.user_login = user_info.login;
        this.user_id = user_info.id;
        this.profile_image = user_info.profile_image_url;
        IRC.connectoToChat(this.user_login, oauth_token);
    }
}class LoginEvent extends AppEvent {
    constructor(account) {
        super("app-login");
        this.data = {
            account: account
        };
    }
}let logged_in_user;
let logged_in = false;
function handleAuthenticatedUser(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const userinfo = yield fetchTwitchAuthApi("/oauth2/userinfo", token);
        const username = userinfo.preferred_username;
        console.log('Login', username);
        if (username == null) {
            logout();
            return false;
        }
        else {
            localStorage.setItem('user-token', token);
            logged_in = true;
        }
        const user_data = yield TwitchApi.getUserInfo(username);
        if (user_data) {
            if (!logged_in_user) {
                const account = new Account(user_data, token);
                logged_in_user = account;
                window.dispatchEvent(new LoginEvent(account));
            }
            return true;
        }
        return false;
    });
}
function getLoggedInUser() {
    if (logged_in) {
        return logged_in_user;
    }
}
function logout() {
    localStorage.removeItem('user-token');
    logged_in = false;
    logged_in_user = null;
    location.reload();
}
function fetchTwitchAuthApi(path = "/oauth2/userinfo", token) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://id.twitch.tv${path}`;
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .catch(err => {
            console.error(err);
        });
    });
}
function checLogin() {
    const token = localStorage.getItem('user-token');
    if (token && !logged_in) {
        return handleAuthenticatedUser(token);
    }
    return false;
}
function authClientUser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (checLogin() !== false) {
            return;
        }
        const type = "token+id_token";
        const scopes = [
            "channel:edit:commercial",
            "channel:manage:polls",
            "channel:manage:predictions",
            "channel:manage:redemptions",
            "channel:read:hype_train",
            "channel:read:polls",
            "channel:read:predictions",
            "channel:read:redemptions",
            "channel:manage:broadcast",
            "channel:read:editors",
            "moderation:read",
            "user:manage:blocked_users",
            "user:read:blocked_users",
            "bits:read",
            "channel:moderate",
            "chat:read",
            "chat:edit",
            "whispers:read",
            "openid"
        ];
        const claims = {
            "userinfo": {
                "preferred_username": null
            }
        };
        const url = `https://id.twitch.tv/oauth2/authorize?client_id=${TwitchApi.CLIENT_ID}` +
            `&redirect_uri=${TwitchApi.REDIRECT_URI}` +
            `&response_type=${type}` +
            `&scope=${scopes.join("%20")}` +
            `&claims=${JSON.stringify(claims)}`;
        const win = open(url);
        if (win) {
            win.addEventListener('load', e => {
                console.log("win load event", win);
                const params = win.location.hash;
                const parsed = Webbrowser.parseSearch(params);
                const access_token = parsed.access_token;
                handleAuthenticatedUser(access_token);
                win.close();
            });
        }
        else {
            throw new Error('could not open authentication window');
        }
    });
}const Default_EventMessage_Color = "rgb(12, 12, 12)";
const ColorEventTypeMap = {
    SubOrResub: "rgb(33, 27, 37)",
    Raid: "rgb(33, 27, 37)",
    SubGift: "rgb(33, 27, 37)",
    SubMysteryGift: "rgb(33, 27, 37)",
    AnonSubMysteryGift: "rgb(33, 27, 37)",
    GiftPaidUpgrade: "rgb(33, 27, 37)",
    AnonGiftPaidUpgrade: "rgb(33, 27, 37)",
    Ritual: "rgb(33, 27, 37)",
    BitsBadgeTier: "rgb(33, 27, 37)",
};
const messageCache = [];
const footprintMap = [];
class MessageParser {
    constructor(channel) {
        this.channel = channel;
    }
    parse(message) {
        if (message.message_type == "user") {
            return this.parseUserMessage(message);
        }
        if (message.message_type == "event") {
            return this.parseEventMessage(message);
        }
        return [];
    }
    parseUserMessage(message) {
        return [this.parseChatTextMessage(message)];
    }
    parseEventMessage(message) {
        const user = message.message
            ? this.parseChatTextMessage(message.message)
            : null;
        const event = {
            type: "info",
            id: message.id,
            background_color: message.event
                ? ColorEventTypeMap[message.event.type]
                : Default_EventMessage_Color,
            timestamp: message.timestamp,
            content: $ `
        <div class="line">
          <div class="message">${message.text}</div>
        </div>
      `,
        };
        return user == null ? [event] : [user, event];
    }
    parseEmotes(message_text, channel_id, sender_name, message_emtoes) {
        const client_user = getLoggedInUser();
        const user_login = client_user === null || client_user === void 0 ? void 0 : client_user.user_login;
        const wordEmoteMap = {};
        let channel_emotes = Emotes.getChachedChannelEmotes(channel_id);
        if (message_emtoes) {
            for (let emote of message_emtoes) {
                const start = emote.char_range.start;
                const end = emote.char_range.end;
                const wordToReplace = message_text.slice(start, end);
                wordEmoteMap[wordToReplace] = {
                    name: wordToReplace,
                    service: "twitch",
                    emote: new TwitchEmote(emote),
                };
            }
        }
        const msg_words = message_text.split(" ");
        msg_words.forEach((str) => {
            if (channel_emotes) {
                for (let service in channel_emotes) {
                    if (!channel_emotes[service] ||
                        (service == "twitch" && sender_name != user_login)) {
                        continue;
                    }
                    if (str in channel_emotes[service]) {
                        wordEmoteMap[str] = {
                            name: str,
                            service: service,
                            emote: channel_emotes[service][str],
                        };
                    }
                }
            }
            if (Emotes.global_emotes) {
                for (let service in Emotes.global_emotes) {
                    if (!Emotes.global_emotes[service]) {
                        continue;
                    }
                    if (str in Emotes.global_emotes[service]) {
                        wordEmoteMap[str] = {
                            name: str,
                            service: service,
                            emote: Emotes.global_emotes[service][str],
                        };
                    }
                }
            }
        });
        return wordEmoteMap;
    }
    parseChatTextMessage(message) {
        const client_user = getLoggedInUser();
        const user_login = client_user === null || client_user === void 0 ? void 0 : client_user.user_login;
        const channel_id = message.tags["room-id"];
        const reward_id = message.tags["custom-reward-id"];
        let redemtion_title = "custom reward";
        if (reward_id) {
            const redemtion = this.channel.findReward(reward_id);
            if (redemtion) {
                redemtion_title = redemtion.title;
            }
        }
        let color = Color.rgbToHex(Color.limitColorContrast(...message.color));
        let highlighted = message.tags["msg-id"] == "highlighted-message";
        let action = message.is_action;
        let timestamp = message.timestamp;
        let isReply = message.tags["reply-parent-msg-id"] != null;
        let tagged = false;
        const wordLinkMap = {};
        const wordMentionMap = {};
        let channel_badges = Badges.getChachedChannelBadges(channel_id);
        const wordEmoteMap = this.parseEmotes(message.text, channel_id, message.user_name, message.emotes);
        const msg_words = message.text.split(" ");
        msg_words.forEach((str) => {
            const urlMatch = Webbrowser.matchURL(str);
            if (urlMatch) {
                wordLinkMap[urlMatch[0]] = urlMatch[0];
            }
            if (str.match(/\@[a-zA-Z0-9]+/g)) {
                wordMentionMap[str] = str;
            }
            if (user_login &&
                (str.toLocaleLowerCase() == user_login.toLocaleLowerCase() ||
                    str.toLocaleLowerCase() == "@" + user_login.toLocaleLowerCase())) {
                wordMentionMap[str] = str;
                tagged = true;
            }
        });
        if (message.user_name.toLocaleLowerCase() == message.channel) {
            highlighted = true;
        }
        const getSubBadge = (version) => {
            if (channel_badges["subscriber"]) {
                return channel_badges["subscriber"].versions[version].image_url_2x;
            }
        };
        const renderEmote = (emoteInfo) => {
            return $ `
        <span class="emote"
          ><img
            emote
            service="${emoteInfo.service}"
            name="${emoteInfo.name}"
            alt="${emoteInfo.name}"
            src="${emoteInfo.emote.url_x2}"
            height="32"
        /></span>
      `;
        };
        const renderLink = (linkInfo) => {
            return $ `<a
        class="inline-link"
        href="javascript:()"
        @click="${() => {
                Webbrowser.openInBrowwser(linkInfo);
            }}"
        >${linkInfo}</a
      > `;
        };
        const renderMention = (name) => {
            return $ `<span class="mention">${name}</span> `;
        };
        let parsed_msg = msg_words.map((word) => {
            if (wordEmoteMap[word]) {
                return renderEmote(wordEmoteMap[word]);
            }
            if (wordLinkMap[word]) {
                return renderLink(wordLinkMap[word]);
            }
            if (wordMentionMap[word]) {
                return renderMention(wordMentionMap[word]);
            }
            return word + " ";
        });
        let line_title = reward_id ? `Redeemed ${redemtion_title}.` : null;
        if (isReply) {
            const parent_message = this.channel.getMessageById(message.tags["reply-parent-msg-id"]);
            if (parent_message) {
                line_title = `${parent_message.user_name}: ${parent_message.text}`;
            }
        }
        const msgFootprint = messageFootprint(message.text);
        const similarMessages = [];
        for (let [channel, id, footprint] of footprintMap) {
            if (footprint == msgFootprint && channel == message.channel) {
                similarMessages.push(id);
            }
        }
        messageCache.unshift([message.channel, message.id, message]);
        if (messageCache.length > 100) {
            messageCache.pop();
        }
        footprintMap.unshift([message.channel, message.id, msgFootprint]);
        if (footprintMap.length > 100) {
            footprintMap.pop();
        }
        let latestSimilarMessage = null;
        if (similarMessages.length > 0) {
            for (let messageId of similarMessages) {
                const [c, id, msg] = messageCache.find(([channel, id, _]) => id == messageId && channel == message.channel);
                latestSimilarMessage = id;
            }
        }
        const createLine = (mod = false) => {
            const lineEle = document.createElement("chat-line");
            if (message.is_action) {
                lineEle.setAttribute("action", "");
            }
            const template = $ `
        <style>
          [userid="${message.user_id}"] {
            --color: ${color};
          }
        </style>

        ${line_title ? $ ` <div class="line-title">${line_title}</div> ` : ""}
        ${mod &&
                message.user_name !== user_login &&
                !message.badges.find((b) => b.name == "moderator" || b.name == "broadcaster")
                ? $ `
              <span
                class="chat-line-tool mod-tool inline-tool"
                title="Timeout 10s"
                @click="${() => this.channel.timeout(message.channel, message.user_name, 10)}"
              >
                <img
                  src="./images/block_white_24dp.svg"
                  width="16px"
                  height="16px"
                />
              </span>
              <span
                class="chat-line-tool mod-tool inline-tool delete-tool"
                title="Delete Message"
                @click="${() => this.channel.deleteMessage(message.channel, message.id)}"
              >
                <img
                  src="./images/delete_white_24dp.svg"
                  width="16px"
                  height="16px"
                />
              </span>
              <span
                class="chat-line-tool inline-tool mod-tool-deleted"
                title="Unban"
                @click="${() => this.channel.unban(message.channel, message.user_name)}"
              >
                <img
                  src="./images/done_white_24dp.svg"
                  width="16px"
                  height="16px"
                />
              </span>
            `
                : ""}
        <span class="bages">
          ${message.badges.map((badge) => {
                let badge_url = "";
                if (badge.name == "subscriber") {
                    badge_url =
                        getSubBadge(badge.version) ||
                            Badges.getBadgeByName(badge.name, badge.version);
                    return $ `<img
                class="badge"
                alt="${badge.name} (${badge.description})"
                src="${badge_url}"
                width="18"
                height="18"
              />`;
                }
                badge_url = Badges.getBadgeByName(badge.name, badge.version);
                return $ `<img
              class="badge"
              alt="${badge.name}"
              src="${badge_url}"
              width="18"
              height="18"
            />`;
            })}
        </span>
        <span
          class="username"
          @click="${() => this.channel.openUserCard(message.user_name)}"
          >${message.user_name}:</span
        >
        ${isReply && false
                ? $ `
              <button class="reply-icon" title="Reply">
                <img
                  src="./images/question_answer_white_24dp.svg"
                  height="18px"
                  width="18px"
                />
              </button>
            `
                : ""}
        <span class="message">${parsed_msg}</span>

        ${message.user_name !== user_login
                ? $ `
              <div
                class="tool chat-line-tool"
                title="Reply"
                @click="${() => this.channel.reply(message.channel, message)}"
              >
                <img
                  src="./images/reply_white_24dp.svg"
                  height="18px"
                  width="18px"
                />
              </div>
            `
                : ""}
      `;
            lineEle.setAttribute("messageid", message.id);
            lineEle.setAttribute("userid", message.user_id);
            if (tagged) {
                lineEle.setAttribute("tagged", "");
            }
            if (highlighted) {
                lineEle.setAttribute("highlighted", "");
            }
            if (action) {
                lineEle.setAttribute("action", "");
            }
            lineEle.message = messageData;
            x(template, lineEle);
            if (latestSimilarMessage != null) {
                lineEle.setAttribute("compact", "");
            }
            return lineEle;
        };
        const messageData = {
            type: "message",
            id: message.id,
            user_name: message.user_name,
            user_id: message.user_id,
            highlighted: highlighted,
            tagged: tagged,
            action: action,
            reply: isReply,
            timestamp: timestamp,
            text: message.text,
            content: createLine,
        };
        return messageData;
    }
}
function messageFootprint(msgString) {
    const words = new Set([...msgString.split(" ")]);
    const str = [...words].join("");
    let footprint = "XXXXXXXXXXXXXXXXXXXXXXXX";
    for (let i = 0; i < footprint.length; i++) {
        const charIndex = Math.floor((i / footprint.length) * str.length);
        const char = str[charIndex];
        footprint = footprint.substring(0, i) + char + footprint.substring(i + 1);
    }
    return footprint;
}class ChannelStateChanged extends AppEvent {
    constructor(channel) {
        super("app-channel-state-changed");
        this.data = {
            channel: channel,
        };
    }
}class ChannelInfoChanged extends AppEvent {
    constructor(channel) {
        super(ChannelInfoChanged.type);
        this.data = {
            channel: channel,
        };
    }
    static get type() {
        return "app-channel-changed";
    }
}class ChatMessageEvent extends AppEvent {
    constructor(channel, message) {
        super("app-chat-message");
        this.data = {
            channel,
            message
        };
    }
}class StreamElementsApi {
    static fetchCommandList(channel_login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.fetchChannel(channel_login);
            const url1 = `https://api.streamelements.com/kappa/v2/bot/commands/${user._id}/default`;
            const url2 = `https://api.streamelements.com/kappa/v2/bot/commands/${user._id}`;
            return fetch(url2).then(res => res.json()).then((list) => __awaiter(this, void 0, void 0, function* () {
                const defaults = yield fetch(url1).then(res => res.json());
                return {
                    commandPrefix: "!",
                    serviceName: "StreamElements",
                    commands: [...defaults, ...list].filter(cmd => cmd.enabled).map((cmd) => {
                        let userlevel = cmd.accessLevel;
                        if (cmd.accessLevel <= 100)
                            userlevel = UserLevel.everyone;
                        if (cmd.accessLevel >= 250)
                            userlevel = UserLevel.subscriber;
                        if (cmd.accessLevel >= 400)
                            userlevel = UserLevel.vip;
                        if (cmd.accessLevel >= 500)
                            userlevel = UserLevel.moderator;
                        if (cmd.accessLevel >= 1500)
                            userlevel = UserLevel.broadcaster;
                        return {
                            command: cmd.command,
                            description: cmd.description,
                            userlevel: userlevel
                        };
                    })
                };
            }));
        });
    }
    static fetchChannel(channel_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api.streamelements.com/kappa/v2/channels/${channel_name}`;
            return fetch(url).then(res => res.json());
        });
    }
}class NightbotApi {
    static fetchCommandList(channel_login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.fetchChannel(channel_login);
            const url = `https://api.nightbot.tv/1/commands`;
            return fetch(url, {
                headers: {
                    'nightbot-channel': user.channel._id
                }
            }).then(res => res.json()).then(({ commands }) => {
                return {
                    commandPrefix: "!",
                    serviceName: "Nightbot",
                    commands: commands.map((cmd) => {
                        return {
                            command: cmd.name,
                            description: cmd.message,
                            userlevel: UserLevel[cmd.userLevel]
                        };
                    })
                };
            });
        });
    }
    static fetchChannel(channel_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api.nightbot.tv/1/channels/t/${channel_name}`;
            return fetch(url).then(res => res.json());
        });
    }
}class Notifications {
    static initialize() {
        return Notification.requestPermission(function (result) {
            return result;
        });
    }
    static send(text) {
        const icon = "./images/icon.png";
        const options = {
            title: text,
            body: null,
            icon: icon,
        };
        __TAURI__.notification.sendNotification(options);
    }
}const COMMAND_CACHE_LIFETIME = 1000 * 60;
let pubsub;
let pubsub_features;
const COMMAND_SERVICE = [
    StreamElementsApi,
    NightbotApi,
    TwitchCommands
];
class Channel {
    constructor(channel_name) {
        this.is_live = false;
        this.channel_description = "";
        this.chat_connected = false;
        this.r9k = false;
        this.subscribers_only = false;
        this.emote_only = false;
        this.follwers_only = -1;
        this.slow_mode = 0;
        this.chatter_count = 0;
        this.chatters = [];
        this.channel_view_count = 0;
        this.slowmode_time = 10;
        this.followermode_time = 10;
        this.vip = false;
        this.moderator = false;
        this.broadcaster = false;
        this.emoteSets = [];
        this.commandListCache = [];
        this.commandListCacheTS = -1;
        this.channel_login = channel_name;
        this.messageParser = new MessageParser(this);
        this.chat = document.createElement('twitch-chat');
        this.chat.setRoom(this.channel_login);
        Focus.onBlur(() => {
            if (Application.getSelectedChannel() == this.channel_login) {
                this.chat.placeBookmarkLine();
            }
        });
        Focus.onFocus(() => {
            if (Application.getSelectedChannel() == this.channel_login) {
                this.chat.removeBookmarkLine();
            }
        });
        this.getChannelInfo().then((info) => __awaiter(this, void 0, void 0, function* () {
            if (!info)
                return;
            yield Badges.getChannelBadges(this.channel_id);
            yield Emotes.getChannelEmotes(this.channel_id);
            this.channel_id = info.id;
            this.profile_image_url = info.profile_image_url;
            this.channel_view_count = info.view_count;
            this.channel_description = info.description;
            window.dispatchEvent(new ChannelInfoChanged(this));
            this.joinIRC();
            this.fetchChannelStatus();
            this.fetchChannelBio().then(bio => {
                this.chat.setBio(bio);
            });
            setInterval(() => {
                this.fetchChannelStatus();
            }, 1000 * 60);
            this.connectPubsub();
        }));
    }
    fetchChannelBio() {
        return __awaiter(this, void 0, void 0, function* () {
            return TwitchApi.getChannel(this.channel_id).then((channel) => {
                return channel[0];
            });
        });
    }
    fetchChannelStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel_id)
                throw new Error('requested channel status without id.');
            const stream = yield TwitchApi.getStreams(this.channel_id);
            if (stream[0]) {
                if (this.is_live === false) {
                    Notifications.send(`${this.channel_login} is live!`);
                }
                this.is_live = true;
                this.chat.setTitle(stream[0]);
            }
            else {
                this.is_live = false;
                this.chat.setTitle(null);
            }
            yield IRC.getUserlist(this.channel_login).then(chatters => {
                this.chatters = [
                    ...chatters.chatters.broadcaster,
                    ...chatters.chatters.vips,
                    ...chatters.chatters.moderators,
                    ...chatters.chatters.staff,
                    ...chatters.chatters.admins,
                    ...chatters.chatters.global_mods,
                    ...chatters.chatters.viewers,
                ];
                this.chatter_count = chatters.chatter_count;
            });
            window.dispatchEvent(new ChannelInfoChanged(this));
        });
    }
    getChannelInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel_login) {
                return TwitchApi.getUserInfo(this.channel_login).then(info => {
                    return info;
                });
            }
            return undefined;
        });
    }
    getStream() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel_id) {
                return (yield TwitchApi.getStreams(this.channel_id))[0];
            }
        });
    }
    onJoin(msg) {
        console.log("Joined ", msg.channel_login);
        this.chat_connected = true;
        this.chat.appendNote("Connected to " + msg.channel_login);
    }
    onPart(msg) {
        console.log("Parted ", msg.channel_login);
        this.chat_connected = false;
        this.chat.appendNote("Disconnected from " + msg.channel_login);
    }
    joinIRC() {
        this.chat.appendNote(`Connecting`);
        IRC.listen(IRCEvents.Joined, (msg) => {
            const acc = Application.getCurrentAccount();
            if (msg.channel_login == this.channel_login && msg.user_login == acc.user_login) {
                this.onJoin(msg);
            }
        });
        IRC.listen(IRCEvents.Parted, (msg) => {
            const acc = Application.getCurrentAccount();
            if (msg.channel_login == this.channel_login && msg.user_login == acc.user_login) {
                this.onPart(msg);
            }
        });
        IRC.listen(IRCEvents.UserState, (msg) => {
            if (msg.channel === this.channel_login) {
                this.vip = false;
                this.moderator = false;
                this.vip = msg.badges.find(b => b.name == "vip") !== undefined;
                this.moderator = msg.badges.find(b => b.name == "moderator") !== undefined;
                this.broadcaster = msg.badges.find(b => b.name == "broadcaster") !== undefined;
                this.chat.moderator = this.moderator;
                this.emoteSets = msg.emote_sets;
                if (!this.mod_pubsub && (this.moderator || this.broadcaster)) {
                    this.mod_pubsub = true;
                    TwitchApi.connectToPubSub().then(pubsub => {
                        this.mod_pubsub = pubsub;
                        const user_id = Application.getCurrentAccount().user_id;
                        this.mod_pubsub.listen([
                            `chat_moderator_actions.${user_id}.${this.channel_id}`,
                        ]);
                        this.mod_pubsub.onModAction(data => {
                            this.chat.appendNote(data.message);
                        });
                    });
                }
            }
            window.dispatchEvent(new ChannelStateChanged(this));
        });
        IRC.listen(IRCEvents.ChatState, msg => {
            if (msg.channel_login == this.channel_login) {
                if (msg.r9k !== null) {
                    this.r9k = msg.r9k;
                }
                if (msg.subscribers_only !== null) {
                    this.subscribers_only = msg.subscribers_only;
                }
                if (msg.emote_only !== null) {
                    this.emote_only = msg.emote_only;
                }
                if (msg.follwers_only !== null) {
                    this.follwers_only = msg.follwers_only !== "Disabled" ? msg.follwers_only.Enabled.secs : -1;
                    if (this.followermode_time === 0) {
                        this.followermode_time = msg.follwers_only.Enabled.secs / 60;
                    }
                }
                if (msg.slow_mode !== null) {
                    this.slow_mode = msg.slow_mode.secs;
                    if (this.slowmode_time === 0) {
                        this.slowmode_time = this.slow_mode;
                    }
                }
            }
            window.dispatchEvent(new ChannelStateChanged(this));
        });
        let lastMessage = null;
        let lastTimestamp = null;
        IRC.listen(IRCEvents.ChatMessage, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (this.channel_login !== msg.channel)
                return;
            const chatMessages = this.messageParser.parse(msg);
            for (let message of chatMessages) {
                const ts = new Date(message.timestamp);
                if (lastMessage && lastTimestamp) {
                    if (ts.valueOf() - new Date(lastMessage.timestamp).valueOf() > 1000 * 60 * 10) {
                        this.chat.appendTimestamp(ts);
                        lastTimestamp = ts;
                    }
                    else {
                        if (ts.valueOf() - lastTimestamp.valueOf() > 1000 * 60 * 10) {
                            this.chat.appendTimestamp(ts);
                            lastTimestamp = ts;
                        }
                    }
                }
                else if (lastMessage == null) {
                    this.chat.appendTimestamp(ts);
                    lastTimestamp = ts;
                }
                lastMessage = message;
                if (message.tagged) {
                    const mentionChannel = Application.getChannel("@");
                    mentionChannel.chat.appendMessage(message);
                }
                this.chat.appendMessage(message);
                window.dispatchEvent(new ChatMessageEvent(msg.channel, message));
            }
        }));
        IRC.listen(IRCEvents.ChatInfo, (msg) => {
            if (this.channel_login !== msg.channel)
                return;
            const chatMessages = this.messageParser.parse(msg);
            for (let msg of chatMessages) {
                switch (msg.type) {
                    case "info":
                        this.chat.appendInfo(msg);
                        break;
                    case "message":
                        msg.highlighted = true;
                        if (msg.tagged) {
                            const mentionChannel = Application.getChannel("@");
                            mentionChannel.chat.appendMessage(msg);
                        }
                        this.chat.appendMessage(msg);
                        break;
                }
            }
        });
        IRC.listen(IRCEvents.ChatNote, (msg) => {
            if (this.channel_login !== msg.channel_login)
                return;
            this.chat.appendNote(msg.message_text);
        });
        IRC.listen(IRCEvents.ChatClear, (msg) => {
            if (this.channel_login === msg.channel_login) {
                const action = msg.action.UserBanned || msg.action.UserTimedOut;
                const lines = this.chat.querySelectorAll(`[userid="${action.user_id}"]`);
                for (let line of [...lines]) {
                    line.setAttribute("deleted", "");
                }
                if (msg.action.UserBanned) {
                    this.chat.appendNote(`${action.user_login} got banned.`);
                }
                if (msg.action.UserTimedOut) {
                    this.chat.appendNote(`${action.user_login} got timed out for ${Format.seconds(action.timeout_length.secs)}.`);
                }
            }
        });
        IRC.listen(IRCEvents.ChatDeleteMessage, (msg) => {
            if (this.channel_login === msg.channel_login) {
                const line = this.chat.querySelector(`[messageid="${msg.message_id}"]`);
                if (line) {
                    line.setAttribute("deleted", "");
                }
                this.chat.appendNote(`${msg.sender_login}'s' message got deleted.`);
            }
        });
        IRC.joinChatRoom(this.channel_login.toLocaleLowerCase());
    }
    toggleSlowMode() {
        if (this.moderator || this.broadcaster) {
            if (this.slow_mode) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/slowoff");
            }
            else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/slow " + this.slowmode_time);
            }
        }
    }
    toggleFollowerMode() {
        if (this.moderator || this.broadcaster) {
            if (this.follwers_only > -1) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/followersoff");
            }
            else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/followers " + this.followermode_time);
            }
        }
    }
    toggleEmoteOnlyMode() {
        if (this.moderator || this.broadcaster) {
            if (this.emote_only) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/emoteonlyoff");
            }
            else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/emoteonly");
            }
        }
    }
    toggleSubOnlyMode() {
        if (this.moderator || this.broadcaster) {
            if (this.subscribers_only) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/subscribersoff");
            }
            else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/subscribers");
            }
        }
    }
    toggleR9kMode() {
        if (this.moderator || this.broadcaster) {
            if (this.r9k) {
                IRC.sendMessage(this.channel_login, this.channel_id, "/r9kbetaoff");
            }
            else {
                IRC.sendMessage(this.channel_login, this.channel_id, "/r9kbeta");
            }
        }
    }
    getMessageById(message_id) {
        const channels = Application.getChannels();
        for (let channel of channels) {
            const ch = Application.getChannel(channel);
            if (ch) {
                const chat = ch.chat;
                const msg = chat.querySelector(`[messageid="${message_id}"]`);
                if (msg) {
                    return msg ? msg.message : undefined;
                }
            }
        }
    }
    reply(channel, message) {
        Application.selectChannel(channel);
        const input = document.querySelector('chat-input');
        input.reply(message.user_name, message.id);
    }
    timeout(channel, user_name, secs) {
        IRC.sendMessage(channel, this.channel_id, `/timeout ${user_name} ${secs}`);
    }
    deleteMessage(channel, message_id) {
        IRC.sendMessage(channel, this.channel_id, `/delete ${message_id}`);
    }
    unban(channel, user_name) {
        IRC.sendMessage(channel, this.channel_id, `/unban ${user_name}`);
    }
    openUserCard(user_name) {
        const url = `https://www.twitch.tv/popout/${this.channel_login}/viewercard/${user_name}`;
        open(url);
    }
    connectPubsub() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!pubsub) {
                pubsub = yield TwitchApi.connectToPubSub();
                pubsub_features = yield TwitchApi.connectToPubSub();
            }
            pubsub.listen([
                `community-points-channel-v1.${this.channel_id}`,
                `hype-train-events-v1.${this.channel_id}`
            ]);
            pubsub_features.listen([
                `polls.${this.channel_id}`,
            ]);
            pubsub.onRedemtion(data => {
                if (data.channel_id == this.channel_id) {
                    this.chat.appendRedemtion(data);
                }
            });
            pubsub.onHypeTrain(data => {
                if (data.channel_id == this.channel_id) {
                    const detla = Math.floor(data.started_at - data.expires_at / 1000);
                    this.chat.appendNote(`Hypetrain! Level ${data.level}. ${Format.seconds(detla)} left.`);
                }
            });
        });
    }
    findReward(id) {
        if (pubsub) {
            return pubsub.rewards[id];
        }
    }
    fetchCommandList(callback) {
        if (Date.now() - this.commandListCacheTS > COMMAND_CACHE_LIFETIME) {
            this.commandListCache = [];
            this.commandListCacheTS = Date.now();
        }
        else {
            for (let list of this.commandListCache) {
                callback(list);
            }
            return;
        }
        for (let service of COMMAND_SERVICE) {
            service.fetchCommandList(this.channel_login).then(list => {
                this.commandListCache.push(list);
                callback(list);
            });
        }
    }
}let applicationState = {
    selectedChannel: "@",
    channels: [],
};
let channels = new Set();
let currentAccoumt;
class Application {
    static on(eventOrEventArray, callback) {
        if (eventOrEventArray instanceof Array) {
            for (let event of eventOrEventArray) {
                addEventListener(event, callback);
            }
        }
        else {
            addEventListener(eventOrEventArray, callback);
        }
    }
    static getCurrentAccount() {
        return currentAccoumt;
    }
    static setAccount(account) {
        currentAccoumt = account;
    }
    static saveState() {
        localStorage.setItem('save-state', JSON.stringify(applicationState));
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = localStorage.getItem('save-state');
            if (state) {
                const json = JSON.parse(state);
                applicationState = Object.assign(applicationState, json);
            }
            const mentionChannel = new Channel("@");
            channels.add(mentionChannel);
            for (let channel of applicationState.channels) {
                this.createChannel(channel);
            }
        });
    }
    static getSelectedChannel() {
        return applicationState.selectedChannel;
    }
    static getChannels() {
        return applicationState.channels;
    }
    static getActiveChannel() {
        return this.getChannel(applicationState.selectedChannel);
    }
    static selectChannel(room_name) {
        applicationState.selectedChannel = room_name;
        window.dispatchEvent(new ChannelSelecteddEvent(room_name));
        this.saveState();
    }
    static moveChannel(channel, newIndex) {
        const rooms = applicationState.channels;
        const currIndex = rooms.indexOf(channel);
        rooms.splice(currIndex, 1);
        const part1 = rooms.slice(0, newIndex);
        const part2 = rooms.slice(newIndex);
        applicationState.channels = [...part1, channel, ...part2];
        window.dispatchEvent(new ChannelMovedEvent(newIndex, currIndex));
        this.saveState();
    }
    static createChannel(channel_name) {
        if (applicationState.channels.indexOf(channel_name) === -1) {
            applicationState.channels.push(channel_name);
        }
        const channel = new Channel(channel_name);
        channels.add(channel);
        window.dispatchEvent(new ChannelCreatedEvent(channel));
        this.saveState();
    }
    static removeChannel(channel_name) {
        const index = applicationState.channels.indexOf(channel_name);
        applicationState.channels.splice(index, 1);
        const channel = this.getChannel(channel_name);
        channels.delete(channel);
        const newSelected = Math.min(Math.max(0, index), applicationState.channels.length - 1);
        this.selectChannel(this.getChannels()[newSelected]);
        window.dispatchEvent(new ChannelRemovedEvent(channel_name));
        this.saveState();
    }
    static getChannel(channel_name) {
        for (let channel of channels) {
            if (channel.channel_login === channel_name) {
                return channel;
            }
        }
    }
}class ContextMenu extends s {
    constructor(x, y) {
        super();
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
        this.addEventListener("blur", (e) => {
            setTimeout(() => {
                if (document.activeElement !== this) {
                    this.close();
                }
            }, 150);
        });
    }
    static get styles() {
        return r$2 `
      @keyframes slide-right {
        from {
          opacity: 0;
          transform: translate(-10px, 0);
        }
      }
      @keyframes slide-down {
        from {
          opacity: 0;
          transform: translate(0, -10px);
        }
      }
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translate(0, 10px);
        }
      }
      :host {
        outline: none;
        animation: var(--anim, slide-in) 0.15s ease;
        display: block;
        position: fixed;
        top: calc(var(--y, 0) * 1px);
        left: calc(var(--x, 0) * 1px);
        z-index: 10000000;
        padding: 5px;
        border-radius: 6px;
        box-shadow: rgb(0 0 0 / 25%) 1px 2px 8px;
        border: 1px solid rgb(48, 48, 48);
        background: rgba(31, 31, 35, 0.94);
        backdrop-filter: blur(12px);
      }
      /* // webkit scrollbars */
      ::-webkit-scrollbar {
        width: 8px;
        margin: 5px 0;
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      ::-webkit-scrollbar-track-piece {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-scrollbar-thumb, #464646);
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-scrollbar-thumb-hover, #555555);
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
    }
    static openOn(ele, direction) {
        const rect = ele.getClientRects()[0];
        let x = rect.x;
        let y = rect.y;
        switch (direction) {
            case "down":
                x -= 10;
                y += 25;
                break;
            case "right":
                x += 20;
                y += 25;
                break;
            case "up":
                x -= rect.width + 300;
                y -= 400;
                break;
            default:
                x += 40;
                y -= 10;
                break;
        }
        const overlap = Math.min(window.innerWidth - (x + rect.width), 0);
        x += overlap - 10;
        const newEle = new this(x, y);
        switch (direction) {
            case "down":
                newEle.style.setProperty("--anim", "slide-down");
                break;
            case "right":
                newEle.style.setProperty("--anim", "slide-right");
                break;
            case "up":
                newEle.style.setProperty("--anim", "slide-up");
                break;
            default:
                newEle.style.setProperty("--anim", "slide-right");
                break;
        }
        document.body.append(newEle);
        return newEle;
    }
    close() {
        this.remove();
    }
    connectedCallback() {
        super.connectedCallback();
        this.style.setProperty("--x", this.x.toString());
        this.style.setProperty("--y", this.y.toString());
        this.tabIndex = 0;
        this.focus();
    }
    render() {
        return $ `
      <div>
        <slot></slot>
      </div>
    `;
    }
}
customElements.define("context-menu", ContextMenu);class EmotePicker extends ContextMenu {
    constructor(...args) {
        super(...args);
        this.twitch_user_emotes = [];
        this.currentEmote = null;
        this.tabSelected = "twitch";
        this.currentEmote = null;
        this.shadowRoot.addEventListener("pointermove", (e) => {
            let newTarget = null;
            if (e.target.hasAttribute("emote")) {
                newTarget = e.target;
            }
            else {
                newTarget = null;
            }
            if (newTarget !== this.currentEmote) {
                this.currentEmote = newTarget;
                this.requestUpdate();
            }
        });
    }
    static get styles() {
        return r$2 `
      ${super.styles}
      :host {
        display: block;
        right: 10px !important;
        bottom: 60px;
        top: auto;
        left: auto;
      }
      .emote-list {
        height: 300px;
        width: 350px;
        max-width: calc(100vw - 60px);
        overflow: auto;
        padding: 8px 12px;
      }
      .category {
        display: flex;
        flex-wrap: wrap;
        --grid-gap: 5px;
        margin-right: calc(var(--grid-gap) * -1px);
        padding: 0 4px;
      }
      .category img {
        object-fit: contain;
        cursor: pointer;
        max-height: 32px;
        margin: 0 var(--grid-gap) var(--grid-gap) 0;
      }
      .category img:hover {
        background: #333;
        outline: 1px solid #eeeeeebe;
      }
      .category img:active {
        transform: scale(0.95);
      }

      label {
        display: block;
        font-weight: 300;
        margin: 15px 0 10px 0;
        opacity: 0.5;
        text-transform: capitalize;
      }
      label:first-child {
        margin-top: 0;
      }

      .tabs {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        justify-content: center;
        justify-items: center;
        grid-gap: 12px;
        padding: 4px 12px 8px 12px;
      }

      .tab {
        line-height: 24px;
        vertical-align: middle;
        position: relative;
        text-align: center;
        cursor: pointer;
        width: 100%;
        user-select: none;
        border-radius: 4px;
        font-size: 12px;
        opacity: 0.5;
      }
      .tab[active] {
        opacity: 1;
      }
      .tab[active]::after {
        opacity: 1;
      }
      .tab:hover {
        background: #ffffff08;
      }
      .tab:active {
        background: #ffffff14;
      }
      .tab::after {
        content: "";
        display: block;
        bottom: 0px;
        left: 50%;
        width: 100%;
        height: 2px;
        background: grey;
        opacity: 0.5;
        text-align: center;
      }

      .emote-preview {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 0;
        background: inherit;
        border: inherit;
        border-radius: inherit;
        display: flex;
        align-items: center;
        padding: 12px;
        backdrop-filter: inherit;
        font-size: 18px;
        font-weight: 400;
      }
      .emote-preview img {
        margin-right: 20px;
      }
    `;
    }
    connectedCallback() {
        super.connectedCallback();
        const channel = Application.getActiveChannel();
        TwitchEmotes.getEmoteSets(channel.emoteSets).then((sets) => {
            this.twitch_user_emotes = sets;
            this.requestUpdate();
        });
    }
    groupEmoteSets(sets, currentChannel) {
        const groups = [];
        setLoop: for (let set of sets) {
            for (let group of groups) {
                if (group.name == set.name) {
                    group.emotes = Object.assign(group.emotes, set.emotes);
                    continue setLoop;
                }
            }
            groups.unshift(set);
        }
        return groups.sort((a, b) => {
            if (a.name == "globals") {
                return 1;
            }
            if (b.name == "globals") {
                return -1;
            }
            if (a.name.toLocaleLowerCase() ==
                currentChannel.channel_login.toLocaleLowerCase()) {
                return -1;
            }
            if (b.name.toLocaleLowerCase() ==
                currentChannel.channel_login.toLocaleLowerCase()) {
                return 1;
            }
            return 0;
        });
    }
    renderEmoteTab(channel, tab) {
        const grouped = this.groupEmoteSets(this.twitch_user_emotes, channel);
        if (tab == "twitch") {
            if (grouped.length == 0) {
                return $ `<net-loader />`;
            }
            else {
                return $ `
          ${grouped.map((set) => {
                    const emotes = Object.keys(set.emotes);
                    return emotes.length > 0
                        ? $ `
                  <label>${set.name}</label>
                  <div class="category">
                    ${emotes.map((emote) => $ `<img
                        src="${set.emotes[emote].url_x2}"
                        alt="${emote}"
                        emote
                        @click="${() => {
                            const input = document.querySelector("chat-input");
                            input.insert(emote);
                        }}"
                      /> `)}
                  </div>
                `
                        : "";
                })}
        `;
            }
        }
        const channel_emotes = Emotes.getChachedChannelEmotes(channel.channel_id);
        const global_emotes = Emotes.global_emotes;
        return $ `
      ${channel_emotes[tab] && Object.keys(channel_emotes[tab]).length > 0
            ? $ `
            <label>Channel</label>
            <div class="category">
              ${Object.keys(channel_emotes[tab]).map((emote) => $ `<img
                  src="${channel_emotes[tab][emote].url_x2}"
                  alt="${emote}"
                  emote
                  @click="${() => {
                const input = document.querySelector("chat-input");
                input.insert(emote);
            }}"
                /> `)}
            </div>
          `
            : ""}
      ${global_emotes[tab] && Object.keys(global_emotes[tab]).length > 0
            ? $ `
            <label>Global</label>
            <div class="category">
              ${Object.keys(global_emotes[tab]).map((emote) => $ `<img
                  src="${global_emotes[tab][emote].url_x2}"
                  alt="${emote}"
                  emote
                  @click="${() => {
                const input = document.querySelector("chat-input");
                input.insert(emote);
            }}"
                /> `)}
            </div>
          `
            : ""}
    `;
    }
    selectTab(tab) {
        this.tabSelected = tab;
        this.requestUpdate();
    }
    render() {
        const channel = Application.getActiveChannel();
        const emoteTab = this.renderEmoteTab(channel, this.tabSelected);
        return $ `
      <div class="tabs">
        <div
          class="tab"
          ?active="${this.tabSelected == "twitch"}"
          tab-id="twitch"
          @click="${(e) => this.selectTab(e.target.getAttribute("tab-id"))}"
        >
          Twitch
        </div>
        <div
          class="tab"
          ?active="${this.tabSelected == "bttv"}"
          tab-id="bttv"
          @click="${(e) => this.selectTab(e.target.getAttribute("tab-id"))}"
        >
          BTTV
        </div>
        <div
          class="tab"
          ?active="${this.tabSelected == "ffz"}"
          tab-id="ffz"
          @click="${(e) => this.selectTab(e.target.getAttribute("tab-id"))}"
        >
          FFZ
        </div>
        <div
          class="tab"
          ?active="${this.tabSelected == "7tv"}"
          tab-id="7tv"
          @click="${(e) => this.selectTab(e.target.getAttribute("tab-id"))}"
        >
          7TV
        </div>
      </div>

      <div class="emote-list">${emoteTab}</div>

      ${this.currentEmote != null
            ? $ `
            <div class="emote-preview">
              <img src="${this.currentEmote.src}" />
              <span>${this.currentEmote.alt}</span>
            </div>
          `
            : ""}
    `;
    }
}
customElements.define("emote-picker", EmotePicker);class ChatCommandEvent extends AppEvent {
    constructor(message) {
        super("app-chat-command");
        this.canceled = false;
        this.data = {
            message
        };
    }
    cancel() {
        this.canceled = true;
    }
}const message_parser = new MessageParser();
const MAX_HSITORY_LENGTH = 20;
class ChatInput extends s {
    constructor() {
        super();
        this.history = [];
        this.historyPointer = -1;
        this.commandSugestionsList = null;
        this.commandCharacter = "/";
        this.inputElement = document.createElement("div");
        this.inputElement.id = "chat-input";
        this.inputElement.contentEditable = "true";
        this.inputElement.setAttribute("placeholder", "Send a message");
        this.inputElement.setAttribute("empty", "");
        this.inputElement.addEventListener("keydown", (e) => {
            this.handleKeyDown(e);
        });
        this.inputElement.addEventListener("keyup", (e) => {
            this.handleKeyUp(e);
        });
        this.inputElement.addEventListener("focus", (e) => {
            this.inputElement.removeAttribute("empty");
        });
        this.inputElement.addEventListener("blur", (e) => {
            if (this.value == "") {
                this.inputElement.setAttribute("empty", "");
            }
        });
        this.inputElement.addEventListener("click", (e) => {
            this.focus();
        });
        const handlePaste = (e) => {
            const ele = this.getInputElement();
            const item = [...e.clipboardData.items].find((item) => {
                return item.type == "text/plain";
            });
            item.getAsString((str) => {
                if (str[0] == "!" || str[0] == "/") {
                    this.enableCommandMode(str[0]);
                    this.insert(str.slice(1));
                }
                else {
                    this.insert(str);
                }
                ele.focus();
            });
            e.preventDefault();
        };
        window.addEventListener("paste", (e) => {
            if (document.activeElement == document.body) {
                handlePaste(e);
            }
        });
        this.inputElement.addEventListener("paste", handlePaste);
        window.addEventListener("keydown", (e) => {
            if (document.activeElement == document.body &&
                !e.ctrlKey &&
                !e.shiftKey &&
                !e.altKey) {
                const ele = this.getInputElement();
                ele === null || ele === void 0 ? void 0 : ele.focus();
            }
        });
    }
    set value(v) {
        const ele = this.getInputElement();
        ele.innerHTML = v;
    }
    get value() {
        const ele = this.getInputElement();
        if (this.commandMode &&
            (this.commandCharacter == "!" || this.commandCharacter == "/")) {
            return this.commandCharacter + ele.innerText;
        }
        else {
            return ele.innerText;
        }
    }
    set commandMode(val) {
        if (val === true) {
            this.inputElement.setAttribute("command", this.commandCharacter);
            this.setAttribute("command", this.commandCharacter);
        }
        else {
            this.inputElement.removeAttribute("command");
            this.removeAttribute("command");
        }
    }
    get commandMode() {
        return this.hasAttribute("command");
    }
    getInputElement() {
        return this.inputElement;
    }
    submit(e) {
        if (this.value != "") {
            this.addToHistory(this.value);
            const channel = Application.getChannel(Application.getSelectedChannel());
            if (this.replyId) {
                IRC.replyToMessage(channel.channel_login, channel.channel_id, this.value, this.replyId);
            }
            else {
                const ev = new ChatCommandEvent(this.value);
                if (this.commandMode) {
                    window.dispatchEvent(ev);
                }
                if (!ev.canceled) {
                    IRC.sendMessage(channel.channel_login, channel.channel_id, this.value);
                }
            }
        }
    }
    reply(message_sender, message_id) {
        this.enableCommandMode(message_sender);
        this.replyId = message_id;
        this.insert("<br>");
        this.focus();
    }
    loadHistory() {
        const history = localStorage.getItem("input-history");
        if (history && history instanceof Array) {
            this.history = JSON.parse(history);
        }
    }
    saveHistory() {
        localStorage.setItem("input-history", JSON.stringify(this.history));
    }
    addToHistory(value) {
        this.history.unshift(value);
        if (this.history.length > MAX_HSITORY_LENGTH) {
            this.history.pop();
        }
    }
    prevHistoryValue() {
        this.historyPointer = Math.max(this.historyPointer - 1, 0);
        const historyValue = this.history[this.historyPointer];
        if (historyValue) {
            this.value = historyValue;
        }
    }
    nextHistoryValue() {
        this.historyPointer = Math.min(this.historyPointer + 1, this.history.length - 1);
        const historyValue = this.history[this.historyPointer];
        if (historyValue) {
            this.value = historyValue;
        }
    }
    openEmotePicker(e) {
        EmotePicker.openOn(e.target, "up");
    }
    insert(str) {
        const ele = this.getInputElement();
        const index = this.getCursorPosition();
        const part1 = ele.innerText.slice(0, index);
        const part2 = ele.innerText.slice(index);
        const newValue = [part1, str, part2].join("");
        this.value = newValue;
        ele.focus();
        this.setCursorPosition(1);
    }
    focus() {
        this.getInputElement().focus();
    }
    getCursorPosition() {
        if (this.shadowRoot) {
            return this.shadowRoot.getSelection().focusOffset;
        }
    }
    setCursorPosition(index) {
        if (this.shadowRoot) {
            const el = this.inputElement;
            const range = document.createRange();
            const sel = this.shadowRoot.getSelection();
            range.setStart(el, index);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    resetInput() {
        this.value = "";
        this.historyPointer = -1;
        this.commandMode = false;
        this.commandSugestionsList = null;
        this.replyId = undefined;
        this.requestUpdate();
    }
    enableCommandMode(prefix = "/") {
        this.commandCharacter = prefix;
        this.inputElement.innerHTML += "<br>";
        requestAnimationFrame(() => {
            this.setCursorPosition(1);
        });
        this.commandMode = true;
        this.requestUpdate();
    }
    autocomplete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.value.length >= 1) {
                const sugs = this.commandSugestionsList;
                if (sugs) {
                    let cmd = sugs[sugs.length - 1];
                    if (cmd) {
                        if (cmd.command.replace(this.commandCharacter, "") ==
                            this.inputElement.innerText &&
                            sugs.length > 1) {
                            cmd = sugs[sugs.length - 2];
                        }
                        this.inputElement.innerText = cmd.command.replace(this.commandCharacter, "");
                        this.setCursorPosition(1);
                        return;
                    }
                }
                const words = this.inputElement.innerText.split(" ");
                const currWord = words[words.length - 1];
                const emotes = yield this.getEmnoteSugestions(currWord);
                if (emotes[0]) {
                    this.inputElement.innerText =
                        words.slice(0, words.length - 1).join(" ") + " " + emotes[0];
                    this.setCursorPosition(1);
                    return;
                }
                const names = this.getNameSugestions(currWord);
                if (names[0]) {
                    this.inputElement.innerText =
                        words.slice(0, words.length - 1).join(" ") + " " + names[0];
                    this.setCursorPosition(1);
                }
            }
        });
    }
    handleKeyDown(e) {
        if (e.key == "Enter") {
            this.submit(e);
            this.resetInput();
            e.preventDefault();
        }
        if (e.key == " " && false) {
            const words = this.value.split(" ");
            const lastWord = words[words.length - 1];
            const channel = Application.getActiveChannel();
            if (channel) {
                const emote_map = message_parser.parseEmotes(lastWord, channel.channel_id, []);
                const emote = emote_map[lastWord];
                if (emote) {
                    const emoteUrl = emote.emote.url_x2;
                    const img = new Image();
                    img.src = emoteUrl;
                    img.width = 24;
                    img.height = 24;
                    img.setAttribute("emote", "");
                    this.inputElement.innerText = words
                        .slice(0, words.length - 2)
                        .join(" ");
                    this.inputElement.appendChild(img);
                    this.setCursorPosition(1);
                }
            }
        }
        if (e.key == "ArrowUp") {
            if (this.commandMode) ;
            else {
                this.nextHistoryValue();
            }
            e.preventDefault();
        }
        if (e.key == "ArrowDown") {
            if (this.commandMode) ;
            else {
                this.prevHistoryValue();
            }
            e.preventDefault();
        }
        if (e.key == "Tab") {
            e.preventDefault();
            this.autocomplete();
        }
        if (this.value == "" && e.key == "/") {
            e.preventDefault();
            this.enableCommandMode("/");
        }
        if (this.value == "" && e.key == "!") {
            e.preventDefault();
            this.enableCommandMode("!");
        }
        if (e.key == "Backspace") {
            if (this.inputElement.innerText.length == 0 ||
                this.inputElement.innerText == " " ||
                this.inputElement.innerText == "\n" ||
                this.inputElement.innerText == "") {
                this.resetInput();
            }
        }
    }
    handleKeyUp(e) {
        if (e.key == "Backspace") {
            if (this.inputElement.innerText.length == 0 ||
                this.inputElement.innerText == " " ||
                this.inputElement.innerText == "\n" ||
                this.inputElement.innerText == "") {
                this.resetInput();
            }
        }
        const commandSugestiosn = this.commandCharacter == "/" || this.commandCharacter == "!";
        if (this.commandMode && commandSugestiosn && this.value.length >= 0) {
            this.getCommandSugestions(this.inputElement.innerText, (list) => {
                this.commandSugestionsList = list;
                this.requestUpdate();
                setTimeout(() => {
                    var _a;
                    const ele = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".flyout");
                    ele === null || ele === void 0 ? void 0 : ele.scrollTo(0, ele.scrollHeight);
                }, 1);
            });
        }
    }
    getNameSugestions(str) {
        const channel = Application.getChannel(Application.getSelectedChannel());
        if (channel) {
            const chatters = channel.chatters;
            return chatters.filter((name) => name.toLocaleLowerCase().match(str.toLocaleLowerCase()));
        }
        return [];
    }
    getEmnoteSugestions(str) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = Application.getChannel(Application.getSelectedChannel());
            if (channel) {
                const global = yield Emotes.getGlobalEmotes();
                const chnl = yield Emotes.getChannelEmotes(channel.channel_id);
                const allEmtoes = [];
                for (let serivce in global) {
                    if (chnl) {
                        for (let emote in chnl[serivce]) {
                            allEmtoes.push(emote);
                        }
                    }
                    for (let emote in global[serivce]) {
                        allEmtoes.push(emote);
                    }
                }
                return allEmtoes.filter((name) => name.toLocaleLowerCase().match(str.toLocaleLowerCase()));
            }
            return [];
        });
    }
    getCommandSugestions(str, callback) {
        const list = [];
        const channel = Application.getChannel(Application.getSelectedChannel());
        return channel === null || channel === void 0 ? void 0 : channel.fetchCommandList((list_part) => {
            if (list_part.commandPrefix == this.commandCharacter) {
                let currentUserLevel = 0;
                if (channel.vip)
                    currentUserLevel = UserLevel.vip;
                if (channel.moderator)
                    currentUserLevel = UserLevel.moderator;
                if (channel.broadcaster)
                    currentUserLevel = UserLevel.broadcaster;
                for (let cmd of list_part.commands) {
                    if ((cmd.command.match(str) || str.replace(" ", "") == "\n") &&
                        cmd.userlevel <= currentUserLevel) {
                        list.push({
                            service: list_part.serviceName,
                            command: list_part.commandPrefix +
                                cmd.command.replace(list_part.commandPrefix, ""),
                            description: cmd.description,
                        });
                    }
                }
                callback(list);
            }
        });
    }
    static get styles() {
        return r$2 `
      :host {
        display: block;
        width: 100%;
        position: relative;
      }
      :host([disabled]) {
        pointer-events: none;
        opacity: 0;
      }

      /* // webkit scrollbars */
      ::-webkit-scrollbar {
        width: 8px;
        margin: 5px 0;
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      ::-webkit-scrollbar-track-piece {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-scrollbar-thumb, #1c1c1c);
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-scrollbar-thumb-hover, #333333);
      }
      ::-webkit-scrollbar-corner {
        background: transparent;
      }

      .wrapper {
        padding: 8px;
      }
      .input-field {
        position: relative;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
      }
      .text-input {
      }
      .text-input #chat-input {
        resize: none;
        border-radius: 4px;
        background: hsl(240deg 4% 19%);
        width: 100%;
        border: none;
        outline: none;
        padding: 13px 40px 15px 12px;
        color: #eee;
        font-family: "Roboto", sans-serif;
        font-size: 14px;
        box-sizing: border-box;
        display: block;
        transition: outline 0.2s ease;
        outline: 2px solid transparent;
      }
      .text-input #chat-input:focus {
        outline-color: #1f1f23;
      }
      .text-input #chat-input::after {
        content: attr(placeholder);
        display: none;
        transition: opacity 0.1s ease;
        pointer-events: none;
      }
      .text-input #chat-input[empty]::after {
        display: block;
        opacity: 0.5;
      }
      @keyframes flyin {
        from {
          opacity: 0;
          transform: translateX(-8px);
        }
      }
      .text-input #chat-input[command]::before {
        content: attr(command);
        display: inline-block;
        background: #1f1f23;
        padding: 4px 8px;
        border-radius: 4px;
        margin-right: 5px;
        animation: flyin 0.15s ease;
      }
      .util {
        position: absolute;
        right: 0;
        top: 7px;
        padding: 0 10px;
        display: grid;
        grid-auto-flow: column;
        grid-gap: 5px;
      }
      button {
        border-radius: 4px;
        border: none;
        padding: 4px;
        min-width: 25px;
        min-height: 25px;
        background: transparent;
        margin: 0;
        cursor: pointer;
        color: #fff;
      }
      button:hover {
        background: #34343a;
      }
      button:active {
        transform: scale(0.95);
      }
      button img {
        display: block;
      }

      @keyframes flyout {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.99);
        }
      }

      .flyout {
        display: none;
      }
      :host([command]) .flyout {
        animation: flyout 0.2s ease;
        display: block;
        position: absolute;
        bottom: calc(100% - 10px);
        left: 30px;
        right: 30px;
        min-height: 20px;
        padding: 8px;
        background: rgb(20 20 20);
        border-radius: 6px;
        box-shadow: 1px 2px 24px rgb(0 0 0 / 30%);
        border: 1px solid rgb(16 16 16);
        z-index: 100000;
        max-height: 200px;
        overflow: auto;
      }
      :host(:not(:focus-within)) .flyout {
        display: none;
      }

      .command-sugestion {
        border-radius: 4px;
        display: grid;
        grid-template-columns: 1fr auto;
        padding: 8px;
        gap: 4px;
        align-items: center;
        background: rgb(27, 27, 27);
        cursor: pointer;
      }
      .command-sugestion:hover {
        background: rgb(42, 42, 42);
      }
      .command-sugestion:not(:last-child) {
        margin-bottom: 2px;
      }
      .command-name {
        font-size: 14px;
        font-weight: 400;
      }
      .command-service {
        opacity: 0.25;
        font-weight: 400;
        font-size: 12px;
      }
      .command-description {
        opacity: 0.5;
        font-size: 12px;
        grid-column: 1 / span 2;
      }
      net-loader {
        transform: scale(0.75);
      }
    `;
    }
    render() {
        const insertCommand = (cmd) => {
            this.value = cmd.command.replace(this.commandCharacter, "");
            this.setCursorPosition(1);
        };
        const commandSugestiosn = this.commandCharacter == "/" || this.commandCharacter == "!";
        return $ `
      ${this.commandMode && commandSugestiosn
            ? $ `
            ${this.commandSugestionsList == null
                ? $ `
                  <div class="flyout">
                    <net-loader></net-loader>
                  </div>
                `
                : $ `
                  <div class="flyout">
                    ${this.commandSugestionsList.map((cmd) => {
                    return $ `
                        <div
                          class="command-sugestion"
                          @mousedown="${(e) => insertCommand(cmd)}"
                        >
                          <div class="command-name">${cmd.command}</div>
                          <div class="command-service">${cmd.service}</div>
                          <div class="command-description">
                            ${cmd.description}
                          </div>
                        </div>
                      `;
                })}
                  </div>
                `}
          `
            : ""}

      <div class="wrapper">
        <div class="input-field">
          <div class="text-input">${this.inputElement}</div>
          <div class="util">
            <!-- <button name="create poll">Y</button>
                        <button name="create prediction">X</button> -->
            <button name="Emotes" @click="${this.openEmotePicker}">
              <img
                src="./images/sentiment_satisfied_alt_white_24dp.svg"
                width="20px"
                height="20px"
              />
            </button>
          </div>
        </div>
      </div>
    `;
    }
}
customElements.define("chat-input", ChatInput);class AddChannelDialog extends ContextMenu {
    static get styles() {
        return r$2 `
      ${super.styles}
      .select-action {
        box-sizing: border-box;
        padding: 6px 8px;
        border-radius: 4px;
        background: #2f2f32;
        color: white;
        min-width: 180px;
        outline: none;
        border: none;
        margin-bottom: 10px;
      }
      input {
        box-sizing: border-box;
        padding: 6px 8px;
        border-radius: 4px;
        background: #101010;
        color: white;
        min-width: 180px;
        outline: none;
        border: none;
      }
    `;
    }
    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            var _a;
            (_a = this.shadowRoot.querySelector("input")) === null || _a === void 0 ? void 0 : _a.focus();
        }, 1);
    }
    submit(e) {
        Application.createChannel(e.target.value.toLocaleLowerCase());
        this.remove();
    }
    render() {
        return $ `
      <div>
        <select class="select-action">
          <option>Add Channel</option>
        </select>
        <br />
        <input
          placeholder="username"
          @keyup="${(e) => {
            if (e.key == "Enter") {
                this.submit(e);
            }
        }}"
        />
      </div>
    `;
    }
}
customElements.define("add-channel-dialog", AddChannelDialog);var Events = {
    ChannelCreated: "app-channel-created",
    ChannelMoved: "app-channel-moved",
    ChannelRemoved: "app-channel-removed",
    ChannelSelected: "app-channel-selected",
    ChannelInfoChanged: "app-channel-changed",
    ChannelStateChanged: "app-channel-state-changed",
    ChatMessageEvent: "app-chat-message",
    ChatCommandEvent: "app-chat-command",
    Login: "app-login",
    Logout: "app-logout",
    Initialize: "app-initialize",
};class ChatRooms extends s {
    constructor() {
        super();
        this.icons = [];
        this.target = null;
        Application.on(Events.ChannelSelected, (e) => {
            this.requestUpdate();
        });
        Application.on(Events.ChannelRemoved, (e) => {
            this.requestUpdate();
        });
        Application.on(Events.Initialize, (e) => {
            this.requestUpdate();
        });
        Application.on(Events.ChannelCreated, (e) => {
            this.requestUpdate();
        });
    }
    createRenderRoot() {
        return this;
    }
    render() {
        const rooms = Application.getChannels();
        const commitDrag = (e) => {
        };
        const move = (e) => {
        };
        const startDrag = (e) => {
        };
        return $ `
      <div
        class="icon-list"
        @pointermove="${move}"
        @pointerup="${commitDrag}"
        @pointercancel="${commitDrag}"
      >
        <div
          channel="@"
          ?selected="${Application.getSelectedChannel() == "@"}"
          class="room-icon mentions-icon"
          hint="Mentions"
          @mousedown="${() => {
            Application.selectChannel("@");
        }}"
        >
          <img src="./images/Mention.svg" width="18px" height="18px" />
        </div>

        ${rooms.map((room) => {
            return $ `
            <profile-indicator
              channel="${room}"
              ?selected="${Application.getSelectedChannel() == room}"
              class="room-icon chat-room-icon"
              hint="${room}"
              @mousedown="${() => {
                Application.selectChannel(room);
            }}"
              @pointerdown="${startDrag}"
            >
            </profile-indicator>
          `;
        })}

        <div
          class="room-icon new-room"
          @click="${(e) => {
            AddChannelDialog.openOn(e.target, "right");
        }}"
          hint="Join Room"
        >
          +
        </div>
      </div>
    `;
    }
}
customElements.define("chat-rooms", ChatRooms);class Loader extends s {
    static get styles() {
        return r$2 `
      :host {
        display: block;
        z-index: 10000000000;
      }
      .loader {
        display: flex;
        justify-content: center;
        align-items: center;
        width: auto;
      }
      @keyframes rotate {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(-360deg);
        }
      }
      .loader img {
        width: 32px;
        height: 32px;
        animation: rotate 1s linear infinite;
      }
    `;
    }
    render() {
        return $ `
      <div class="loader">
        <img src="./images/loader.svg" />
      </div>
    `;
    }
}
customElements.define("net-loader", Loader);class TwitchAuthComp$1 extends s {
    constructor() {
        super();
        this.loggedin = false;
        this.loading = true;
        const logged_in = checLogin();
        if (logged_in instanceof Promise) {
            logged_in.then((logged_in) => {
                this.loading = false;
                this.loggedin = logged_in;
                this.requestUpdate();
            });
        }
        else {
            this.loading = false;
        }
    }
    createRenderRoot() {
        return this;
    }
    pasteToken(e) {
        navigator.clipboard.readText().then((clipText) => {
            const json = JSON.parse(clipText);
            handleAuthenticatedUser(json.access_token).then((logged_in) => {
                if (logged_in) {
                    this.loggedin = logged_in;
                    this.requestUpdate();
                }
                else {
                    alert("Error logging in.");
                }
            });
        });
    }
    render() {
        if (this.loading) {
            return $ `<net-loader></net-loader>`;
        }
        else if (!this.loggedin) {
            return $ `
        <h3>Do not show this on stream!</h3>
        <br />
        <div class="auth">
          <button @click="${(e) => authClientUser()}">Login</button>
          <button @click="${(e) => this.pasteToken(e)}">Paste Token</button>
        </div>
      `;
        }
    }
}
customElements.define("twitch-login-panel", TwitchAuthComp$1);class TwitchAuthComp extends s {
    constructor() {
        super();
        this.user = null;
        window.addEventListener("app-login", (e) => {
            this.user = e.data.account;
            this.requestUpdate();
        });
    }
    static get styles() {
        return r$2 `
      :host {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
      }

      .user-icon {
        width: 24px;
        height: 24px;
        position: relative;
        cursor: pointer;
      }
      .user-icon img {
        overflow: hidden;
        border-radius: 50%;
        background: #333333;
      }
      .user-icon img[loading] {
        opacity: 0;
      }
      .user-icon:hover::after {
        content: "Switch User";
        position: absolute;
        left: calc(100% + 5px);
        top: 50%;
        transform: translate(0, -50%);
        padding: 4px 8px;
        border-radius: 3px;
        z-index: 10000;
        background: rgb(0 0 0 / 50%);
        backdrop-filter: blur(4px);
        width: max-content;
      }
    `;
    }
    logout() {
        logout();
    }
    render() {
        if (this.user) {
            const img = new Image();
            img.width = 24;
            img.alt = this.user.user_login;
            img.src = this.user.profile_image;
            return $ `
        <div class="auth">
          <div
            class="user-icon"
            @click="${(e) => {
                const menu = ContextMenu.openOn(e.target);
                const btn = document.createElement("button");
                btn.innerHTML = "Logout";
                btn.onclick = () => {
                    this.logout();
                };
                menu.append(btn);
            }}"
          >
            ${img}
          </div>
        </div>
      `;
        }
    }
}
customElements.define("twitch-profile", TwitchAuthComp);class TwitchChat extends Chat {
    constructor() {
        super();
        this.stream_title = "";
        this.game = "";
        this.viewer_count = 0;
        this.status = "";
        this.stream_start = 0;
        Application.on(Events.ChannelInfoChanged, (e) => __awaiter(this, void 0, void 0, function* () {
            const channel = e.data.channel;
            if (channel.channel_login === this.channel) {
                this.requestUpdate();
            }
        }));
        Application.on(Events.ChannelStateChanged, (e) => __awaiter(this, void 0, void 0, function* () {
            const channel = e.data.channel;
            if (channel.channel_login === this.channel) {
                this.requestUpdate();
                if (channel.moderator || channel.broadcaster) {
                    this.setAttribute("modview", "");
                }
                else {
                    this.removeAttribute("modview");
                }
            }
        }));
    }
    static get styles() {
        return r$2 `
      ${super.styles}

      .info {
        opacity: 0.5;
        padding: 10px 15px;
      }

      @keyframes bio-slidein {
        from {
          transform: translate(0, -0px);
          opacity: 0;
        }
      }
      .bio {
        animation: bio-slidein 0.2s ease;
        display: grid;
        grid-template-columns: auto 1fr;
        padding: 60px 30px 40px 30px;
        margin-bottom: 10px;
        background: #0c0c0c;
      }
      .profile-image {
        border-radius: 50%;
        overflow: hidden;
        width: 112px;
        height: 112px;
        border: 3px solid rgb(148, 74, 255);
      }
      .profile-image img {
        width: 100%;
      }
      .pin {
        margin-left: 30px;
      }
      .profile-name {
        font-size: 28px;
        margin-bottom: 5px;
        white-space: nowrap;
      }
      .profile-desc {
        margin-top: 20px;
        grid-column: 1 / span 2;
        line-height: 150%;
      }
      .viewcount {
        opacity: 0.5;
        margin-bottom: 5px;
      }
      .game {
        opacity: 0.5;
        margin-bottom: 5px;
        font-weight: bold;
      }
      .language {
        opacity: 0.5;
        margin-bottom: 5px;
      }

      .chat-state-icons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        grid-column: 3;
      }
      .user-state-icon,
      .room-state-icon {
        display: none;
        color: #eee;
        opacity: 0.5;
        margin-left: 5px;
        cursor: default;
        justify-content: center;
        align-items: center;
        margin-left: 8px;
        user-select: none;
        padding: 0px 3px;
      }
      .room-state-icon.action-expand {
        padding: 0px;
      }
      .user-state-icon[active],
      .room-state-icon[active] {
        display: flex;
      }
      :host([modview]) .room-state-icon {
        opacity: 0.25;
        display: flex;
      }
      :host([modview]) .room-state-icon[active] {
        opacity: 1;
      }

      :host([modview]) .room-state-icon {
        border: none;
        margin: 0px;
        background: transparent;
        min-width: 16px;
        height: 22px;
        cursor: pointer;
        border-radius: 3px;
      }
      :host([modview]) .room-state-icon:hover {
        outline: #464646 solid 1px;
      }
      :host([modview]) .room-state-icon:active {
        background: #333333;
      }
      :host([modview]) .room-state-icon:active img {
        transform: scale(0.95);
      }

      .dropdown-content:focus-within,
      .dropdown-content:hover,
      .dropdown-content:focus,
      .dropdown-button:focus ~ .dropdown-content {
        display: block;
      }

      .dropdown-content {
        position: absolute;
        top: calc(100% + 5px);
        left: -10px;
        display: none;
      }

      .expand-list {
        display: inline-block;
        margin-left: 8px;
      }

      .event-feed {
        position: absolute;
        top: 60px;
        left: 10px;
        /* outline: 1px solid white; */
        right: 10px;
        height: 40px;
        z-index: 1000;
        pointer-events: none;
      }

      .chat-title {
        grid-column: 2;
        position: relative;
        z-index: 100;
        width: 100%;
        padding: 5px 6px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        align-items: center;
        white-space: nowrap;
        font-size: 12px;
        font-weight: 400;
        color: #ababab;
        display: flex;
        flex-wrap: wrap;
        background: linear-gradient(180deg, rgb(0 0 0 / 15%), transparent);
      }

      .chat-title > div {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .chat-title span {
        opacity: 0.5;
      }

      .tag {
        display: inline-block;
        border-radius: 12px;
        background: rgba(25, 25, 28, 0.9);
        padding: 5px 10px;
        backdrop-filter: blur(8px);
        border: 1px solid #1f1f23;
        max-width: 100%;
        margin-right: 4px;
        margin-bottom: 4px;
        font-size: 12px;
        color: #cbcbcb;
        box-shadow: 1px 2px 8px #00000049;
      }

      .tag img {
        vertical-align: bottom;
      }

      .title-tag {
        width: 100%;
        font-weight: 500;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    }
    openUserlist() {
        return __awaiter(this, void 0, void 0, function* () {
            const listEle = this.shadowRoot.querySelector("chat-user-list");
            listEle.updateList();
        });
    }
    openVisPanel() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    appendRedemtion(data) {
        this.appendNote($ `${data.user_name} redeemed ${data.title} for ${data.cost}
        <img src="${data.image_url}" height="18px" width="18px" />`);
    }
    openSlowModeSettins(e) {
        const channel = Application.getChannel(this.channel);
        const menu = ContextMenu.openOn(e.target, "down");
        const input = document.createElement("fluid-input");
        input.value = channel === null || channel === void 0 ? void 0 : channel.slowmode_time;
        input.steps = "1";
        input.min = 1;
        input.max = 600;
        input.suffix = "sec";
        input.style.width = "100px";
        input.addEventListener("change", (e) => {
            channel.slowmode_time = input.value;
        });
        menu.append(input);
    }
    openFollowerModeSettings(e) {
        const channel = Application.getChannel(this.channel);
        const menu = ContextMenu.openOn(e.target, "down");
        const input = document.createElement("fluid-input");
        input.value = channel.followermode_time;
        input.steps = "1";
        input.min = 0;
        input.max = 600;
        input.suffix = "min";
        input.style.width = "100px";
        input.addEventListener("change", (e) => {
            channel.followermode_time = input.value;
        });
        menu.append(input);
    }
    setTitle(options) {
        if (options) {
            const { viewer_count = 0, started_at = 0, game_name = "", title = "", } = options;
            this.game = game_name;
            this.stream_start = started_at;
            this.stream_title = title;
            this.viewer_count = viewer_count;
        }
        else {
            this.stream_start = 0;
            this.stream_title = "";
            this.viewer_count = 0;
        }
        this.requestUpdate();
    }
    setBio(bio_data) {
        this.bio = bio_data;
        this.requestUpdate();
    }
    render() {
        let channel = Application.getChannel(this.channel);
        if (!channel) {
            channel = {};
        }
        return $ `
      <div class="header">
        <div class="chat-actions">
          <div>
            <div class="chat-action">
              <button
                title="Close chat"
                @click="${(e) => {
            Application.removeChannel(channel.channel_login);
        }}"
              >
                <img src="./images/close.svg" width="16px" height="16px" />
              </button>
            </div>
            <div class="chat-action">
              <button
                class="dropdown-button"
                title="Userlist"
                @click="${() => {
            this.openUserlist();
        }}"
              >
                <img src="./images/people.svg" width="16px" height="16px" />
              </button>
              <div class="dropdown-content" tabindex="0">
                <chat-user-list
                  channel="${channel.channel_login}"
                ></chat-user-list>
              </div>
            </div>
            <!-- <div class="chat-action">
                            <button class="dropdown-button" title="Show and Hide Elements" @click="${() => {
            this.openVisPanel();
        }}">    
                                <img src="./images/visibility_white_24dp.svg" width="16px" height="16px" />
                            </button>
                            <div class="dropdown-content" tabindex="0">
                                
                            </div>
                        </div> -->
            <div class="chat-action">
              <button
                title="Open Stream"
                @click="${() => {
            Webbrowser.openInBrowwser(`https://www.twitch.tv/${channel.channel_login}`);
        }}"
              >
                <img src="./images/open.svg" width="16px" height="16px" />
              </button>
            </div>
          </div>
          <div
            class="chat-channel-name"
            @click="${() => {
            Webbrowser.openInBrowwser(`https://www.twitch.tv/${channel.channel_login}`);
        }}"
          >
            ${channel.channel_login}
          </div>
          <div class="chat-state-icons">
            <div class="chat-action">
              <div
                class="room-state-icon"
                title="Slow mode for ${channel.slow_mode}s"
                ?active="${channel.slow_mode !== 0}"
                @click="${() => channel.toggleSlowMode(channel)}"
              >
                <img src="./images/slowmode.svg" width="18px" height="18px" />
              </div>
              <div
                class="room-state-icon action-expand"
                title="Slowmode time"
                @click="${this.openSlowModeSettins}"
              >
                <img
                  src="./images/expand_more_black_24dp.svg"
                  width="16px"
                  height="16px"
                />
              </div>
            </div>
            <div class="chat-action">
              <div
                class="room-state-icon"
                title="Follow mode for ${channel.follwers_only}s"
                ?active="${channel.follwers_only >= 0}"
                @click="${() => channel.toggleFollowerMode(channel)}"
              >
                <img src="./images/follower.svg" width="18px" height="18px" />
              </div>
              <div
                class="room-state-icon action-expand"
                title="Follower time"
                @click="${this.openFollowerModeSettings}"
              >
                <img
                  src="./images/expand_more_black_24dp.svg"
                  width="16px"
                  height="16px"
                />
              </div>
            </div>
            <div class="chat-action">
              <div
                class="room-state-icon"
                title="Emote only mode"
                ?active="${channel.emote_only}"
                @click="${() => channel.toggleEmoteOnlyMode(channel)}"
              >
                <img src="./images/emote.svg" width="18px" height="18px" />
              </div>
            </div>
            <div class="chat-action">
              <div
                class="room-state-icon"
                title="Sub only mode"
                ?active="${channel.subscribers_only}"
                @click="${() => channel.toggleSubOnlyMode(channel)}"
              >
                <img src="./images/subscriber.svg" width="18px" height="18px" />
              </div>
            </div>
            <div class="chat-action">
              <div
                class="room-state-icon"
                title="r9k mode"
                ?active="${channel.r9k}"
                @click="${() => channel.toggleR9kMode(channel)}"
              >
                r9k
              </div>
            </div>
            <div class="chat-action">
              <div
                class="user-state-icon"
                title="Moderator"
                ?active="${channel.moderator}"
              >
                <img
                  src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2"
                  width="18px"
                  height="18px"
                />
              </div>
            </div>
            <div class="chat-action">
              <div
                class="user-state-icon"
                title="Broadcaster"
                ?active="${channel.broadcaster}"
              >
                <img
                  src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2"
                  width="18px"
                  height="18px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-title">
        ${!this.stream_title
            ? $ `
              <div class="tag" title="Status">Offline</div>

              ${channel.chatter_count > 0
                ? $ `
                    <div class="tag" title="Chatters">
                      <img src="./images/Viewer.svg" width="16px" />
                      ${Format.number(channel.chatter_count)}
                    </div>
                  `
                : ""}
            `
            : $ `
              <div class="tag title-tag" title="${this.stream_title}">
                ${this.stream_title}
              </div>
              <div class="tag" title="Uptime">
                Live -
                <stream-timer starttime="${this.stream_start}"></stream-timer>
              </div>
              <div class="tag" title="Game">
                <img src="./images/Game.svg" width="16px" />
                ${this.game}
              </div>
              <div class="tag" title="Viewercount">
                <img src="./images/Viewer.svg" width="16px" />
                ${Format.number(this.viewer_count)}
              </div>
            `}
      </div>
      <div class="event-feed"></div>
      <div class="scroll-to-bottom" @click="${() => this.scrollToLatest()}">
        <span>Scroll to the bottom</span>
      </div>
      <div class="lines" @scroll="${(e) => this.onScroll(e)}">
        ${this.bio
            ? $ `
              <div class="bio">
                <div class="profile-image">
                  <img src="${channel.profile_image_url || ""}" width="125px" />
                </div>
                <div class="pin">
                  <div class="profile-name">
                    ${this.bio.broadcaster_name}
                    ${this.bio.broadcaster_type == "partner"
                ? $ `
                          <img src="./images/verified.svg" alt="verified" />
                        `
                : ""}
                  </div>
                  <div class="game">${this.bio.game_name}</div>
                  <div class="language">
                    ${Format.lang(this.bio.broadcaster_language)}
                  </div>
                  <div class="viewcount">
                    ${Format.number(channel.channel_view_count)} views
                  </div>
                </div>
                ${channel.channel_description == ""
                ? ""
                : $ `
                      <div class="profile-desc">
                        ${channel.channel_description}
                      </div>
                    `}
              </div>
            `
            : ""}
        <slot class="lines-inner"></slot>
      </div>
    `;
    }
}
customElements.define("twitch-chat", TwitchChat);class ProfileIndicator extends s {
    constructor() {
        super(...arguments);
        this.live = false;
        this.new_message = false;
        this.tagged = false;
    }
    static get properties() {
        return {
            channel: { type: String },
        };
    }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        if (name === "channel" && this.channel) {
            IRC.listen(IRCEvents.ChatMessage, (msg) => {
                var _a;
                if (msg.channel === this.channel &&
                    Application.getSelectedChannel() !== this.channel &&
                    ((_a = Application.getChannel(this.channel)) === null || _a === void 0 ? void 0 : _a.chat_connected)) {
                    this.new_message = true;
                    this.requestUpdate();
                }
            });
            Application.on(Events.ChatMessageEvent, (e) => {
                var _a;
                if (e.data.channel === this.channel &&
                    Application.getSelectedChannel() !== this.channel &&
                    ((_a = Application.getChannel(this.channel)) === null || _a === void 0 ? void 0 : _a.chat_connected)) {
                    this.new_message = true;
                    if (e.data.message.tagged) {
                        this.tagged = true;
                    }
                    this.requestUpdate();
                }
            });
            Application.on(Events.ChannelSelected, (e) => {
                if (e.data.channel === this.channel) {
                    this.new_message = false;
                    this.tagged = false;
                    this.requestUpdate();
                }
            });
            Application.on(Events.ChannelInfoChanged, (e) => __awaiter(this, void 0, void 0, function* () {
                const channel = e.data.channel;
                if (channel.channel_login === this.channel) {
                    this.live = channel.is_live;
                    this.profile_image_url = channel.profile_image_url;
                    this.requestUpdate();
                }
            }));
        }
    }
    static get styles() {
        return r$2 `
      :host {
        display: block;
      }
      .profile-icon {
        position: relative;
      }
      .profile-icon[live]::after {
        content: "";
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        overflow: hidden;
        background: rgb(225 43 43);
        border: 2px solid rgb(31, 31, 35);
      }
      .profile-icon[newmessage] {
        transition: all 0.2s ease;
      }
      @keyframes appear {
        0% {
          transform: scale(0.75);
        }
        75% {
          transform: scale(1.02);
        }
        100% {
          transform: scale(1);
        }
      }
      .profile-icon[newmessage]::before {
        animation: appear 0.2s ease;
        content: "";
        position: absolute;
        top: -3px;
        right: -3px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        border-radius: 50%;
        background: #1f1f23;
        z-index: -1;
        border: 1px solid #858585;
      }
      .profile-icon[tagged]::before {
        border-color: hsl(0deg 97% 60%);
      }
      .profile-icon .image {
        overflow: hidden;
        border-radius: 50%;
        background: #333333;
        box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.25);
      }
      .profile-icon img {
        width: 25px;
        height: 25px;
        display: block;
        pointer-events: none;
      }
      .profile-icon img[empty] {
        opacity: 0;
      }
    `;
    }
    render() {
        return $ `
      <div
        class="profile-icon"
        ?live="${this.live}"
        ?tagged="${this.tagged}"
        ?newmessage="${this.new_message}"
      >
        <div class="image">
          <img
            ?empty="${!this.profile_image_url}"
            width="24px"
            src="${this.profile_image_url || ""}"
            alt="${this.channel}"
          />
        </div>
      </div>
    `;
    }
}
customElements.define("profile-indicator", ProfileIndicator);class PageOverlay extends s {
    constructor(x = 0, y = 0) {
        super();
        this.x = 0;
        this.y = 0;
        this._clientWidth = 0;
        this._clientHeight = 0;
        this.x = x;
        this.y = y;
    }
    static get styles() {
        return r$2 `
      :host {
        --x: 0;
        --y: 0;

        display: block;
        padding: 8px;
        background: #000000b5;
        border-radius: 6px;
        text-align: center;
        backdrop-filter: blur(6px);
        text-transform: capitalize;
        font-size: 12px;

        position: fixed;
        left: calc(var(--x) * 1px);
        top: calc(var(--y) * 1px);
        pointer-events: none;

        transform: translate(5px, calc(-100% - 5px));
        backface-visibility: hidden; /* prevent repaint */
      }
    `;
    }
    get width() {
        return this._clientWidth;
    }
    get height() {
        return this._clientHeight;
    }
    setPosition(x = this.x, y = this.y) {
        const overlap = Math.min(window.innerWidth - (x + this.width + 5), 0);
        this.x = x + overlap;
        this.y = y;
        this.style.setProperty("--x", this.x.toString());
        this.style.setProperty("--y", this.y.toString());
    }
    connectedCallback() {
        super.connectedCallback();
        requestAnimationFrame(() => {
            this._clientWidth = this.clientWidth;
            this._clientHeight = this.clientHeight;
        });
    }
    render() {
        return $ `
      <div>
        <slot></slot>
      </div>
    `;
    }
}
customElements.define("page-overlay", PageOverlay);class YouTubeApi {
    static getVideo(video_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = "AIzaSyCyyFjmnG3-kgnlc1Pdn0VyWAqjvnzUFYo";
            const url = `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${video_id}&part=snippet,statistics`;
            return fetch(url).then(res => res.json()).then(json => {
                return json.items[0];
            });
        });
    }
}function renderYouTubeVideo(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const vid = yield YouTubeApi.getVideo(videoId);
        const view_count = vid.statistics.viewCount;
        const title = vid.snippet.title;
        const channel = vid.snippet.channelTitle;
        const thumb = vid.snippet.thumbnails.medium.url;
        return $ `
    <div class="clip-thumbnail">
      <img src="${thumb}" width="180px" />
    </div>
    <div class="clip-title">${title}</div>
    <div>${channel}</div>
    <div>
      <img src="./images/Viewer.svg" width="16px" />
      ${view_count}
    </div>
  `;
    });
}
function renderTwitchClip(clipId) {
    return __awaiter(this, void 0, void 0, function* () {
        const clips = yield TwitchApi.getClip(clipId);
        const clip = clips[0];
        return $ `
    <div class="clip-thumbnail">
      <img src="${clip.thumbnail_url}" width="180px" />
    </div>
    <div class="clip-title">${clip.title}</div>
    <div>
      <img src="./images/Viewer.svg" width="16px" />
      ${clip.view_count}
    </div>
  `;
    });
}
class LinkPreview {
    static generate(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlInstance = new URL(url);
            if (urlInstance.hostname == "youtu.be") {
                const videoId = urlInstance.pathname.substring(1);
                return renderYouTubeVideo(videoId);
            }
            if (urlInstance.hostname == "www.youtube.com") {
                const params = Webbrowser.parseSearch(urlInstance.search);
                const videoId = params.v;
                return renderYouTubeVideo(videoId);
            }
            if (urlInstance.hostname == "www.twitch.tv") {
                const split = urlInstance.pathname.split("/");
                const clipId = split[split.length - 1];
                return renderTwitchClip(clipId);
            }
            if (urlInstance.hostname == "clips.twitch.tv") {
                const clipId = urlInstance.pathname.substring(1);
                return renderTwitchClip(clipId);
            }
        });
    }
}let lastTarget = null;
let lastOverlay = null;
function createOverlayForImageElement(e) {
    const target = e.target;
    const overlay = new PageOverlay(e.x, e.y);
    const service = target.getAttribute('service');
    overlay.innerHTML = `
        <img src="${target.src}" />
        <div style="margin-top: 5px;">${target.alt}</div>
        ${service ? `<div style="margin-top: 2px; opacity: 0.5;">${service}</div>` : ""}
    `;
    document.body.append(overlay);
    return overlay;
}
let linkOverlayTimeout;
function createOverlayForLink(e) {
    const target = e.target;
    const overlay = new PageOverlay(e.x, e.y);
    overlay.innerHTML = `<net-loader></net-loader>`;
    clearTimeout(linkOverlayTimeout);
    linkOverlayTimeout = setTimeout(() => {
        if (lastTarget == target) {
            LinkPreview.generate(target.innerText).then(data => {
                x(data, overlay);
            });
        }
    }, 200);
    document.body.append(overlay);
    return overlay;
}
function createTooltipListener(root = window) {
    root.addEventListener('pointermove', e => {
        const target = e.target;
        if (lastOverlay != null) {
            lastOverlay.setPosition(e.x, e.y);
        }
        if (target !== lastTarget) {
            lastTarget = null;
            if (lastOverlay) {
                lastOverlay.remove();
                lastOverlay = null;
            }
            if (target && target.hasAttribute('emote')) {
                lastOverlay = createOverlayForImageElement(e);
                lastTarget = target;
            }
            if (target && target.classList.contains('badge')) {
                lastOverlay = createOverlayForImageElement(e);
                lastTarget = target;
            }
            if (target && target.classList.contains('inline-link')) {
                lastOverlay = createOverlayForLink(e);
                lastTarget = target;
            }
        }
    });
}
createTooltipListener(window);function onLogin(account) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Logged in", account);
        yield Badges.getGlobalBadges();
        yield Emotes.getGlobalEmotes();
        yield Application.init();
        Application.setAccount(account);
        console.log("Initialized");
        window.dispatchEvent(new Event(Events.Initialize));
        Application.on(Events.ChannelSelected, (e) => {
            const channel = e.data.channel;
            renderSelecetdChat(channel);
        });
        renderSelecetdChat(Application.getSelectedChannel());
        Notifications.initialize();
    });
}
function renderSelecetdChat(channel) {
    const input = document.querySelector("chat-input");
    const container = document.querySelector(".chat");
    if (container) {
        for (let child of container.children) {
            if (child.hide != undefined) {
                child.hide();
            }
        }
        const chat = Application.getChannel(channel);
        const chatEle = chat === null || chat === void 0 ? void 0 : chat.chat;
        if (chatEle) {
            if (!chatEle.parentNode) {
                container.append(chatEle);
            }
            if (channel === "@") {
                input === null || input === void 0 ? void 0 : input.setAttribute("disabled", "");
            }
            else {
                input === null || input === void 0 ? void 0 : input.removeAttribute("disabled");
            }
            chatEle.show();
        }
    }
}
window.addEventListener("app-login", (e) => {
    onLogin(e.data.account);
});
window.addEventListener(Events.ChatCommandEvent, (e) => {
    if (e.data.message == "/poll") {
        alert("create poll dialog");
        e.cancel();
    }
});
window.invoke = () => __awaiter(void 0, void 0, void 0, function* () { });