(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[11],{"0nnG":function(t,e,n){"use strict";n.r(e),n.d(e,"version",(function(){return r})),n.d(e,"permutation",(function(){return o})),n.d(e,"combination",(function(){return h})),n.d(e,"factorial",(function(){return u})),n.d(e,"factoradic",(function(){return c})),n.d(e,"combinadic",(function(){return l})),n.d(e,"randomInteger",(function(){return a})),n.d(e,"Permutation",(function(){return p})),n.d(e,"Combination",(function(){return m})),n.d(e,"BaseN",(function(){return b})),n.d(e,"PowerSet",(function(){return y})),n.d(e,"CartesianProduct",(function(){return z}));const r="1.4.5",i="function"==typeof BigInt?BigInt:Number,s=t=>t<=Number.MAX_SAFE_INTEGER?Number(t):i(t);function o(t,e){if(t<0)throw new RangeError("negative n is not acceptable");if(e<0)throw new RangeError("negative k is not acceptable");if(0==e)return 1;if(t<e)return 0;[t,e]=[i(t),i(e)];let n=i(1);for(;e--;)n*=t--;return s(n)}function h(t,e){if(0==e)return 1;if(t==e)return 1;if(t<e)return 0;const n=o,r=i(n(t,e))/i(n(e,e));return s(r)}function u(t){return o(t,t)}function c(t,e=0){if(t<0)return;let[n,r]=[i(t),i(1)];if(e)r=i(u(e));else{for(e=1;r<n;r*=i(++e));n<r&&(r/=i(e--))}let s=[0];for(;e;r/=i(e--))s[e]=Math.floor(Number(n/r)),n%=r;return s}function l(t,e){const n=h(t,e);return r=>{if(r<0||n<=r)return;let s=[],[o,u]=[t,e],c=i(n)-i(1)-i(r);for(let n=0;n<e;n++){for(o--;c<h(o,u);)o--;s.push(t-1-o),c-=i(h(o,u)),u--}return s}}const f="undefined"!==typeof crypto?crypto:{},d="function"===typeof f.randomBytes?t=>Uint8Array.from(f.randomBytes(t)):"function"===typeof f.getRandomValues?t=>f.getRandomValues(new Uint8Array(t)):t=>Uint8Array.from(Array(t),(()=>256*Math.random()));function a(t=0,e=Math.pow(2,53)){let n=t.constructor;if(0===arguments.length)return Math.floor(Math.random()*n(e));if(1==arguments.length&&([t,e]=[n(0),t]),"number"==typeof t)return[t,e]=[Math.ceil(Number(t)),Math.ceil(Number(e))],Math.floor(Math.random()*(e-t))+t;const r=n(e)-n(t),i=r.toString(16).length,s=d(i),o=s.reduce(((t,e)=>(t<<n(8))+n(e)),n(0));return(n(o)*r>>n(8*i))+n(t)}class g{static of(...t){return new(Function.prototype.bind.apply(this,[null].concat(t)))}static from(t){return new(Function.prototype.bind.apply(this,[null].concat(t)))}[Symbol.iterator](){return function*(t,e){for(let n=0;n<e;n++)yield t.nth(n)}(this,this.length)}toArray(){return[...this]}get isBig(){return Number.MAX_SAFE_INTEGER<this.length}get isSafe(){return"undefined"!==typeof BigInt||!this.isBig}_check(t){if(t<0){if(this.length<-t)return;return s(i(this.length)+i(t))}if(!(this.length<=t))return t}nth(t){return[]}sample(){return this.nth(a(this.length))}samples(){return function*(t){for(;;)yield t.sample()}(this)}}class p extends g{constructor(t,e=0){super(),this.seed=[...t],this.size=0<e?e:this.seed.length,this.length=o(this.seed.length,this.size),Object.freeze(this)}nth(t){if(void 0===(t=this._check(t)))return;const e=this.seed.length-this.size,n=u(e);let r=c(i(t)*i(n),this.seed.length),s=this.seed.slice(),o=[];for(let i=this.seed.length-1;e<=i;i--)o.push(s.splice(r[i],1)[0]);return o}}class m extends g{constructor(t,e=0){super(),this.seed=[...t],this.size=0<e?e:this.seed.length,this.size=e,this.length=h(this.seed.length,this.size),this.comb=l(this.seed.length,this.size),Object.freeze(this)}bitwiseIterator(){const t=this.length.constructor,[e,n,r]=[t(0),t(1),t(2)],i=t=>{const e=t&-t,n=e+t;return n+((n^t)/e>>r)};let s=(n<<t(this.size))-n;return function*(t,r){for(let h=0;h<r;h++,s=i(s)){var o=[];for(let r=s,i=0;e<r;r>>=n,i++)r&n&&o.push(t.seed[i]);yield o}}(this,this.length)}nth(t){if(void 0!==(t=this._check(t)))return this.comb(t).reduce(((t,e)=>t.concat(this.seed[e])),[])}}class b extends g{constructor(t,e=1){super(),this.seed=[...t],this.size=e;let n=this.seed.length;this.base=n;let r=e<1?0:Array(e).fill(i(n)).reduce(((t,e)=>t*e));this.length=s(r),Object.freeze(this)}nth(t){if(void 0===(t=this._check(t)))return;let e=i(t);const n=i(this.base);let r=[];for(let i=0;i<this.size;i++){var s=e%n;r.push(this.seed[Number(s)]),e-=s,e/=n}return r}}class y extends g{constructor(t){super(),this.seed=[...t];const e=i(1)<<i(this.seed.length);this.length=s(e),Object.freeze(this)}nth(t){if(void 0===(t=this._check(t)))return;let e=i(t),n=[];for(let r=i(0);e;e>>=i(1),r++)e&i(1)&&n.push(this.seed[Number(r)]);return n}}class z extends g{constructor(...t){super(),this.seed=t.map((t=>[...t])),this.size=this.seed.length;const e=this.seed.reduce(((t,e)=>t*i(e.length)),i(1));this.length=s(e),Object.freeze(this)}nth(t){if(void 0===(t=this._check(t)))return;let e=i(t),n=[];for(let r=0;r<this.size;r++){const t=this.seed[r].length,s=i(t),o=e%s;n.push(this.seed[r][Number(o)]),e-=o,e/=s}return n}}}}]);