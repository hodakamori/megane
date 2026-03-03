var GM=Object.defineProperty;var VM=(r,t,i)=>t in r?GM(r,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):r[t]=i;var Bt=(r,t,i)=>VM(r,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();var Uh={exports:{}},Ko={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var m_;function kM(){if(m_)return Ko;m_=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(s,l,c){var h=null;if(c!==void 0&&(h=""+c),l.key!==void 0&&(h=""+l.key),"key"in l){c={};for(var d in l)d!=="key"&&(c[d]=l[d])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:h,ref:l!==void 0?l:null,props:c}}return Ko.Fragment=t,Ko.jsx=i,Ko.jsxs=i,Ko}var g_;function XM(){return g_||(g_=1,Uh.exports=kM()),Uh.exports}var vt=XM(),Ph={exports:{}},re={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var __;function YM(){if(__)return re;__=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),h=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),_=Symbol.for("react.activity"),S=Symbol.iterator;function E(N){return N===null||typeof N!="object"?null:(N=S&&N[S]||N["@@iterator"],typeof N=="function"?N:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},T=Object.assign,A={};function v(N,J,ht){this.props=N,this.context=J,this.refs=A,this.updater=ht||y}v.prototype.isReactComponent={},v.prototype.setState=function(N,J){if(typeof N!="object"&&typeof N!="function"&&N!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,N,J,"setState")},v.prototype.forceUpdate=function(N){this.updater.enqueueForceUpdate(this,N,"forceUpdate")};function U(){}U.prototype=v.prototype;function D(N,J,ht){this.props=N,this.context=J,this.refs=A,this.updater=ht||y}var O=D.prototype=new U;O.constructor=D,T(O,v.prototype),O.isPureReactComponent=!0;var H=Array.isArray;function B(){}var P={H:null,A:null,T:null,S:null},V=Object.prototype.hasOwnProperty;function L(N,J,ht){var Y=ht.ref;return{$$typeof:r,type:N,key:J,ref:Y!==void 0?Y:null,props:ht}}function C(N,J){return L(N.type,J,N.props)}function z(N){return typeof N=="object"&&N!==null&&N.$$typeof===r}function nt(N){var J={"=":"=0",":":"=2"};return"$"+N.replace(/[=:]/g,function(ht){return J[ht]})}var $=/\/+/g;function ct(N,J){return typeof N=="object"&&N!==null&&N.key!=null?nt(""+N.key):J.toString(36)}function ft(N){switch(N.status){case"fulfilled":return N.value;case"rejected":throw N.reason;default:switch(typeof N.status=="string"?N.then(B,B):(N.status="pending",N.then(function(J){N.status==="pending"&&(N.status="fulfilled",N.value=J)},function(J){N.status==="pending"&&(N.status="rejected",N.reason=J)})),N.status){case"fulfilled":return N.value;case"rejected":throw N.reason}}throw N}function I(N,J,ht,Y,lt){var yt=typeof N;(yt==="undefined"||yt==="boolean")&&(N=null);var At=!1;if(N===null)At=!0;else switch(yt){case"bigint":case"string":case"number":At=!0;break;case"object":switch(N.$$typeof){case r:case t:At=!0;break;case g:return At=N._init,I(At(N._payload),J,ht,Y,lt)}}if(At)return lt=lt(N),At=Y===""?"."+ct(N,0):Y,H(lt)?(ht="",At!=null&&(ht=At.replace($,"$&/")+"/"),I(lt,J,ht,"",function(te){return te})):lt!=null&&(z(lt)&&(lt=C(lt,ht+(lt.key==null||N&&N.key===lt.key?"":(""+lt.key).replace($,"$&/")+"/")+At)),J.push(lt)),1;At=0;var Vt=Y===""?".":Y+":";if(H(N))for(var Ht=0;Ht<N.length;Ht++)Y=N[Ht],yt=Vt+ct(Y,Ht),At+=I(Y,J,ht,yt,lt);else if(Ht=E(N),typeof Ht=="function")for(N=Ht.call(N),Ht=0;!(Y=N.next()).done;)Y=Y.value,yt=Vt+ct(Y,Ht++),At+=I(Y,J,ht,yt,lt);else if(yt==="object"){if(typeof N.then=="function")return I(ft(N),J,ht,Y,lt);throw J=String(N),Error("Objects are not valid as a React child (found: "+(J==="[object Object]"?"object with keys {"+Object.keys(N).join(", ")+"}":J)+"). If you meant to render a collection of children, use an array instead.")}return At}function k(N,J,ht){if(N==null)return N;var Y=[],lt=0;return I(N,Y,"","",function(yt){return J.call(ht,yt,lt++)}),Y}function q(N){if(N._status===-1){var J=N._result;J=J(),J.then(function(ht){(N._status===0||N._status===-1)&&(N._status=1,N._result=ht)},function(ht){(N._status===0||N._status===-1)&&(N._status=2,N._result=ht)}),N._status===-1&&(N._status=0,N._result=J)}if(N._status===1)return N._result.default;throw N._result}var _t=typeof reportError=="function"?reportError:function(N){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var J=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof N=="object"&&N!==null&&typeof N.message=="string"?String(N.message):String(N),error:N});if(!window.dispatchEvent(J))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",N);return}console.error(N)},Tt={map:k,forEach:function(N,J,ht){k(N,function(){J.apply(this,arguments)},ht)},count:function(N){var J=0;return k(N,function(){J++}),J},toArray:function(N){return k(N,function(J){return J})||[]},only:function(N){if(!z(N))throw Error("React.Children.only expected to receive a single React element child.");return N}};return re.Activity=_,re.Children=Tt,re.Component=v,re.Fragment=i,re.Profiler=l,re.PureComponent=D,re.StrictMode=s,re.Suspense=m,re.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=P,re.__COMPILER_RUNTIME={__proto__:null,c:function(N){return P.H.useMemoCache(N)}},re.cache=function(N){return function(){return N.apply(null,arguments)}},re.cacheSignal=function(){return null},re.cloneElement=function(N,J,ht){if(N==null)throw Error("The argument must be a React element, but you passed "+N+".");var Y=T({},N.props),lt=N.key;if(J!=null)for(yt in J.key!==void 0&&(lt=""+J.key),J)!V.call(J,yt)||yt==="key"||yt==="__self"||yt==="__source"||yt==="ref"&&J.ref===void 0||(Y[yt]=J[yt]);var yt=arguments.length-2;if(yt===1)Y.children=ht;else if(1<yt){for(var At=Array(yt),Vt=0;Vt<yt;Vt++)At[Vt]=arguments[Vt+2];Y.children=At}return L(N.type,lt,Y)},re.createContext=function(N){return N={$$typeof:h,_currentValue:N,_currentValue2:N,_threadCount:0,Provider:null,Consumer:null},N.Provider=N,N.Consumer={$$typeof:c,_context:N},N},re.createElement=function(N,J,ht){var Y,lt={},yt=null;if(J!=null)for(Y in J.key!==void 0&&(yt=""+J.key),J)V.call(J,Y)&&Y!=="key"&&Y!=="__self"&&Y!=="__source"&&(lt[Y]=J[Y]);var At=arguments.length-2;if(At===1)lt.children=ht;else if(1<At){for(var Vt=Array(At),Ht=0;Ht<At;Ht++)Vt[Ht]=arguments[Ht+2];lt.children=Vt}if(N&&N.defaultProps)for(Y in At=N.defaultProps,At)lt[Y]===void 0&&(lt[Y]=At[Y]);return L(N,yt,lt)},re.createRef=function(){return{current:null}},re.forwardRef=function(N){return{$$typeof:d,render:N}},re.isValidElement=z,re.lazy=function(N){return{$$typeof:g,_payload:{_status:-1,_result:N},_init:q}},re.memo=function(N,J){return{$$typeof:p,type:N,compare:J===void 0?null:J}},re.startTransition=function(N){var J=P.T,ht={};P.T=ht;try{var Y=N(),lt=P.S;lt!==null&&lt(ht,Y),typeof Y=="object"&&Y!==null&&typeof Y.then=="function"&&Y.then(B,_t)}catch(yt){_t(yt)}finally{J!==null&&ht.types!==null&&(J.types=ht.types),P.T=J}},re.unstable_useCacheRefresh=function(){return P.H.useCacheRefresh()},re.use=function(N){return P.H.use(N)},re.useActionState=function(N,J,ht){return P.H.useActionState(N,J,ht)},re.useCallback=function(N,J){return P.H.useCallback(N,J)},re.useContext=function(N){return P.H.useContext(N)},re.useDebugValue=function(){},re.useDeferredValue=function(N,J){return P.H.useDeferredValue(N,J)},re.useEffect=function(N,J){return P.H.useEffect(N,J)},re.useEffectEvent=function(N){return P.H.useEffectEvent(N)},re.useId=function(){return P.H.useId()},re.useImperativeHandle=function(N,J,ht){return P.H.useImperativeHandle(N,J,ht)},re.useInsertionEffect=function(N,J){return P.H.useInsertionEffect(N,J)},re.useLayoutEffect=function(N,J){return P.H.useLayoutEffect(N,J)},re.useMemo=function(N,J){return P.H.useMemo(N,J)},re.useOptimistic=function(N,J){return P.H.useOptimistic(N,J)},re.useReducer=function(N,J,ht){return P.H.useReducer(N,J,ht)},re.useRef=function(N){return P.H.useRef(N)},re.useState=function(N){return P.H.useState(N)},re.useSyncExternalStore=function(N,J,ht){return P.H.useSyncExternalStore(N,J,ht)},re.useTransition=function(){return P.H.useTransition()},re.version="19.2.4",re}var v_;function vp(){return v_||(v_=1,Ph.exports=YM()),Ph.exports}var pt=vp(),Ih={exports:{}},jo={},Bh={exports:{}},Fh={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var S_;function WM(){return S_||(S_=1,(function(r){function t(I,k){var q=I.length;I.push(k);t:for(;0<q;){var _t=q-1>>>1,Tt=I[_t];if(0<l(Tt,k))I[_t]=k,I[q]=Tt,q=_t;else break t}}function i(I){return I.length===0?null:I[0]}function s(I){if(I.length===0)return null;var k=I[0],q=I.pop();if(q!==k){I[0]=q;t:for(var _t=0,Tt=I.length,N=Tt>>>1;_t<N;){var J=2*(_t+1)-1,ht=I[J],Y=J+1,lt=I[Y];if(0>l(ht,q))Y<Tt&&0>l(lt,ht)?(I[_t]=lt,I[Y]=q,_t=Y):(I[_t]=ht,I[J]=q,_t=J);else if(Y<Tt&&0>l(lt,q))I[_t]=lt,I[Y]=q,_t=Y;else break t}}return k}function l(I,k){var q=I.sortIndex-k.sortIndex;return q!==0?q:I.id-k.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var h=Date,d=h.now();r.unstable_now=function(){return h.now()-d}}var m=[],p=[],g=1,_=null,S=3,E=!1,y=!1,T=!1,A=!1,v=typeof setTimeout=="function"?setTimeout:null,U=typeof clearTimeout=="function"?clearTimeout:null,D=typeof setImmediate<"u"?setImmediate:null;function O(I){for(var k=i(p);k!==null;){if(k.callback===null)s(p);else if(k.startTime<=I)s(p),k.sortIndex=k.expirationTime,t(m,k);else break;k=i(p)}}function H(I){if(T=!1,O(I),!y)if(i(m)!==null)y=!0,B||(B=!0,nt());else{var k=i(p);k!==null&&ft(H,k.startTime-I)}}var B=!1,P=-1,V=5,L=-1;function C(){return A?!0:!(r.unstable_now()-L<V)}function z(){if(A=!1,B){var I=r.unstable_now();L=I;var k=!0;try{t:{y=!1,T&&(T=!1,U(P),P=-1),E=!0;var q=S;try{e:{for(O(I),_=i(m);_!==null&&!(_.expirationTime>I&&C());){var _t=_.callback;if(typeof _t=="function"){_.callback=null,S=_.priorityLevel;var Tt=_t(_.expirationTime<=I);if(I=r.unstable_now(),typeof Tt=="function"){_.callback=Tt,O(I),k=!0;break e}_===i(m)&&s(m),O(I)}else s(m);_=i(m)}if(_!==null)k=!0;else{var N=i(p);N!==null&&ft(H,N.startTime-I),k=!1}}break t}finally{_=null,S=q,E=!1}k=void 0}}finally{k?nt():B=!1}}}var nt;if(typeof D=="function")nt=function(){D(z)};else if(typeof MessageChannel<"u"){var $=new MessageChannel,ct=$.port2;$.port1.onmessage=z,nt=function(){ct.postMessage(null)}}else nt=function(){v(z,0)};function ft(I,k){P=v(function(){I(r.unstable_now())},k)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(I){I.callback=null},r.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):V=0<I?Math.floor(1e3/I):5},r.unstable_getCurrentPriorityLevel=function(){return S},r.unstable_next=function(I){switch(S){case 1:case 2:case 3:var k=3;break;default:k=S}var q=S;S=k;try{return I()}finally{S=q}},r.unstable_requestPaint=function(){A=!0},r.unstable_runWithPriority=function(I,k){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var q=S;S=I;try{return k()}finally{S=q}},r.unstable_scheduleCallback=function(I,k,q){var _t=r.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?_t+q:_t):q=_t,I){case 1:var Tt=-1;break;case 2:Tt=250;break;case 5:Tt=1073741823;break;case 4:Tt=1e4;break;default:Tt=5e3}return Tt=q+Tt,I={id:g++,callback:k,priorityLevel:I,startTime:q,expirationTime:Tt,sortIndex:-1},q>_t?(I.sortIndex=q,t(p,I),i(m)===null&&I===i(p)&&(T?(U(P),P=-1):T=!0,ft(H,q-_t))):(I.sortIndex=Tt,t(m,I),y||E||(y=!0,B||(B=!0,nt()))),I},r.unstable_shouldYield=C,r.unstable_wrapCallback=function(I){var k=S;return function(){var q=S;S=k;try{return I.apply(this,arguments)}finally{S=q}}}})(Fh)),Fh}var M_;function qM(){return M_||(M_=1,Bh.exports=WM()),Bh.exports}var zh={exports:{}},Dn={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var A_;function KM(){if(A_)return Dn;A_=1;var r=vp();function t(m){var p="https://react.dev/errors/"+m;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var g=2;g<arguments.length;g++)p+="&args[]="+encodeURIComponent(arguments[g])}return"Minified React error #"+m+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,p,g){var _=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:_==null?null:""+_,children:m,containerInfo:p,implementation:g}}var h=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(m,p){if(m==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return Dn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Dn.createPortal=function(m,p){var g=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(t(299));return c(m,p,null,g)},Dn.flushSync=function(m){var p=h.T,g=s.p;try{if(h.T=null,s.p=2,m)return m()}finally{h.T=p,s.p=g,s.d.f()}},Dn.preconnect=function(m,p){typeof m=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,s.d.C(m,p))},Dn.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},Dn.preinit=function(m,p){if(typeof m=="string"&&p&&typeof p.as=="string"){var g=p.as,_=d(g,p.crossOrigin),S=typeof p.integrity=="string"?p.integrity:void 0,E=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;g==="style"?s.d.S(m,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:_,integrity:S,fetchPriority:E}):g==="script"&&s.d.X(m,{crossOrigin:_,integrity:S,fetchPriority:E,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},Dn.preinitModule=function(m,p){if(typeof m=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var g=d(p.as,p.crossOrigin);s.d.M(m,{crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&s.d.M(m)},Dn.preload=function(m,p){if(typeof m=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var g=p.as,_=d(g,p.crossOrigin);s.d.L(m,g,{crossOrigin:_,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},Dn.preloadModule=function(m,p){if(typeof m=="string")if(p){var g=d(p.as,p.crossOrigin);s.d.m(m,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else s.d.m(m)},Dn.requestFormReset=function(m){s.d.r(m)},Dn.unstable_batchedUpdates=function(m,p){return m(p)},Dn.useFormState=function(m,p,g){return h.H.useFormState(m,p,g)},Dn.useFormStatus=function(){return h.H.useHostTransitionStatus()},Dn.version="19.2.4",Dn}var E_;function jM(){if(E_)return zh.exports;E_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),zh.exports=KM(),zh.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y_;function ZM(){if(y_)return jo;y_=1;var r=qM(),t=vp(),i=jM();function s(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function c(e){var n=e,a=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,(n.flags&4098)!==0&&(a=n.return),e=n.return;while(e)}return n.tag===3?a:null}function h(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function d(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function m(e){if(c(e)!==e)throw Error(s(188))}function p(e){var n=e.alternate;if(!n){if(n=c(e),n===null)throw Error(s(188));return n!==e?null:e}for(var a=e,o=n;;){var u=a.return;if(u===null)break;var f=u.alternate;if(f===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===f.child){for(f=u.child;f;){if(f===a)return m(u),e;if(f===o)return m(u),n;f=f.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=f;else{for(var M=!1,R=u.child;R;){if(R===a){M=!0,a=u,o=f;break}if(R===o){M=!0,o=u,a=f;break}R=R.sibling}if(!M){for(R=f.child;R;){if(R===a){M=!0,a=f,o=u;break}if(R===o){M=!0,o=f,a=u;break}R=R.sibling}if(!M)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?e:n}function g(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=g(e),n!==null)return n;e=e.sibling}return null}var _=Object.assign,S=Symbol.for("react.element"),E=Symbol.for("react.transitional.element"),y=Symbol.for("react.portal"),T=Symbol.for("react.fragment"),A=Symbol.for("react.strict_mode"),v=Symbol.for("react.profiler"),U=Symbol.for("react.consumer"),D=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),H=Symbol.for("react.suspense"),B=Symbol.for("react.suspense_list"),P=Symbol.for("react.memo"),V=Symbol.for("react.lazy"),L=Symbol.for("react.activity"),C=Symbol.for("react.memo_cache_sentinel"),z=Symbol.iterator;function nt(e){return e===null||typeof e!="object"?null:(e=z&&e[z]||e["@@iterator"],typeof e=="function"?e:null)}var $=Symbol.for("react.client.reference");function ct(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===$?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case T:return"Fragment";case v:return"Profiler";case A:return"StrictMode";case H:return"Suspense";case B:return"SuspenseList";case L:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case y:return"Portal";case D:return e.displayName||"Context";case U:return(e._context.displayName||"Context")+".Consumer";case O:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case P:return n=e.displayName||null,n!==null?n:ct(e.type)||"Memo";case V:n=e._payload,e=e._init;try{return ct(e(n))}catch{}}return null}var ft=Array.isArray,I=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,k=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q={pending:!1,data:null,method:null,action:null},_t=[],Tt=-1;function N(e){return{current:e}}function J(e){0>Tt||(e.current=_t[Tt],_t[Tt]=null,Tt--)}function ht(e,n){Tt++,_t[Tt]=e.current,e.current=n}var Y=N(null),lt=N(null),yt=N(null),At=N(null);function Vt(e,n){switch(ht(yt,n),ht(lt,e),ht(Y,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?Fg(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=Fg(n),e=zg(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}J(Y),ht(Y,e)}function Ht(){J(Y),J(lt),J(yt)}function te(e){e.memoizedState!==null&&ht(At,e);var n=Y.current,a=zg(n,e.type);n!==a&&(ht(lt,e),ht(Y,a))}function Ce(e){lt.current===e&&(J(Y),J(lt)),At.current===e&&(J(At),Xo._currentValue=q)}var fe,Be;function G(e){if(fe===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);fe=n&&n[1]||"",Be=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+fe+e+Be}var sn=!1;function le(e,n){if(!e||sn)return"";sn=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var Mt=function(){throw Error()};if(Object.defineProperty(Mt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Mt,[])}catch(ot){var at=ot}Reflect.construct(e,[],Mt)}else{try{Mt.call()}catch(ot){at=ot}e.call(Mt.prototype)}}else{try{throw Error()}catch(ot){at=ot}(Mt=e())&&typeof Mt.catch=="function"&&Mt.catch(function(){})}}catch(ot){if(ot&&at&&typeof ot.stack=="string")return[ot.stack,at.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=o.DetermineComponentFrameRoot(),M=f[0],R=f[1];if(M&&R){var F=M.split(`
`),et=R.split(`
`);for(u=o=0;o<F.length&&!F[o].includes("DetermineComponentFrameRoot");)o++;for(;u<et.length&&!et[u].includes("DetermineComponentFrameRoot");)u++;if(o===F.length||u===et.length)for(o=F.length-1,u=et.length-1;1<=o&&0<=u&&F[o]!==et[u];)u--;for(;1<=o&&0<=u;o--,u--)if(F[o]!==et[u]){if(o!==1||u!==1)do if(o--,u--,0>u||F[o]!==et[u]){var dt=`
`+F[o].replace(" at new "," at ");return e.displayName&&dt.includes("<anonymous>")&&(dt=dt.replace("<anonymous>",e.displayName)),dt}while(1<=o&&0<=u);break}}}finally{sn=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?G(a):""}function It(e,n){switch(e.tag){case 26:case 27:case 5:return G(e.type);case 16:return G("Lazy");case 13:return e.child!==n&&n!==null?G("Suspense Fallback"):G("Suspense");case 19:return G("SuspenseList");case 0:case 15:return le(e.type,!1);case 11:return le(e.type.render,!1);case 1:return le(e.type,!0);case 31:return G("Activity");default:return""}}function Dt(e){try{var n="",a=null;do n+=It(e,a),a=e,e=e.return;while(e);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var Te=Object.prototype.hasOwnProperty,xt=r.unstable_scheduleCallback,w=r.unstable_cancelCallback,x=r.unstable_shouldYield,it=r.unstable_requestPaint,mt=r.unstable_now,Rt=r.unstable_getCurrentPriorityLevel,St=r.unstable_ImmediatePriority,qt=r.unstable_UserBlockingPriority,wt=r.unstable_NormalPriority,kt=r.unstable_LowPriority,Se=r.unstable_IdlePriority,Ct=r.log,Xt=r.unstable_setDisableYieldValue,jt=null,Kt=null;function zt(e){if(typeof Ct=="function"&&Xt(e),Kt&&typeof Kt.setStrictMode=="function")try{Kt.setStrictMode(jt,e)}catch{}}var ee=Math.clz32?Math.clz32:j,ce=Math.log,Fe=Math.LN2;function j(e){return e>>>=0,e===0?32:31-(ce(e)/Fe|0)|0}var Ot=256,ut=262144,Et=4194304;function Lt(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Nt(e,n,a){var o=e.pendingLanes;if(o===0)return 0;var u=0,f=e.suspendedLanes,M=e.pingedLanes;e=e.warmLanes;var R=o&134217727;return R!==0?(o=R&~f,o!==0?u=Lt(o):(M&=R,M!==0?u=Lt(M):a||(a=R&~e,a!==0&&(u=Lt(a))))):(R=o&~f,R!==0?u=Lt(R):M!==0?u=Lt(M):a||(a=o&~e,a!==0&&(u=Lt(a)))),u===0?0:n!==0&&n!==u&&(n&f)===0&&(f=u&-u,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:u}function ne(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function je(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function fn(){var e=Et;return Et<<=1,(Et&62914560)===0&&(Et=4194304),e}function be(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function yn(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Ai(e,n,a,o,u,f){var M=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var R=e.entanglements,F=e.expirationTimes,et=e.hiddenUpdates;for(a=M&~a;0<a;){var dt=31-ee(a),Mt=1<<dt;R[dt]=0,F[dt]=-1;var at=et[dt];if(at!==null)for(et[dt]=null,dt=0;dt<at.length;dt++){var ot=at[dt];ot!==null&&(ot.lane&=-536870913)}a&=~Mt}o!==0&&eo(e,o,0),f!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=f&~(M&~n))}function eo(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var o=31-ee(n);e.entangledLanes|=n,e.entanglements[o]=e.entanglements[o]|1073741824|a&261930}function no(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var o=31-ee(a),u=1<<o;u&n|e[o]&n&&(e[o]|=n),a&=~u}}function Ni(e,n){var a=n&-n;return a=(a&42)!==0?1:as(a),(a&(e.suspendedLanes|n))!==0?0:a}function as(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Hs(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function io(){var e=k.p;return e!==0?e:(e=window.event,e===void 0?32:l_(e.type))}function ss(e,n){var a=k.p;try{return k.p=e,n()}finally{k.p=a}}var Ei=Math.random().toString(36).slice(2),Qe="__reactFiber$"+Ei,xn="__reactProps$"+Ei,Xi="__reactContainer$"+Ei,ao="__reactEvents$"+Ei,bu="__reactListeners$"+Ei,Cu="__reactHandles$"+Ei,pl="__reactResources$"+Ei,rs="__reactMarker$"+Ei;function so(e){delete e[Qe],delete e[xn],delete e[ao],delete e[bu],delete e[Cu]}function b(e){var n=e[Qe];if(n)return n;for(var a=e.parentNode;a;){if(n=a[Xi]||a[Qe]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=Wg(e);e!==null;){if(a=e[Qe])return a;e=Wg(e)}return n}e=a,a=e.parentNode}return null}function Z(e){if(e=e[Qe]||e[Xi]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function st(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(s(33))}function rt(e){var n=e[pl];return n||(n=e[pl]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function W(e){e[rs]=!0}var bt=new Set,Ut={};function Ft(e,n){Gt(e,n),Gt(e+"Capture",n)}function Gt(e,n){for(Ut[e]=n,e=0;e<n.length;e++)bt.add(n[e])}var ie=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ae={},Zt={};function Ee(e){return Te.call(Zt,e)?!0:Te.call(ae,e)?!1:ie.test(e)?Zt[e]=!0:(ae[e]=!0,!1)}function ye(e,n,a){if(Ee(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,""+a)}}function We(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,""+a)}}function Oe(e,n,a,o){if(o===null)e.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,""+o)}}function se(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Jt(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function hn(e,n,a){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,f=o.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return u.call(this)},set:function(M){a=""+M,f.call(this,M)}}),Object.defineProperty(e,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(M){a=""+M},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function Re(e){if(!e._valueTracker){var n=Jt(e)?"checked":"value";e._valueTracker=hn(e,n,""+e[n])}}function Vn(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return e&&(o=Jt(e)?e.checked?"true":"false":e.value),e=o,e!==a?(n.setValue(e),!0):!1}function yi(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Pn=/[\n"\\]/g;function _n(e){return e.replace(Pn,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function ze(e,n,a,o,u,f,M,R){e.name="",M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"?e.type=M:e.removeAttribute("type"),n!=null?M==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+se(n)):e.value!==""+se(n)&&(e.value=""+se(n)):M!=="submit"&&M!=="reset"||e.removeAttribute("value"),n!=null?wn(e,M,se(n)):a!=null?wn(e,M,se(a)):o!=null&&e.removeAttribute("value"),u==null&&f!=null&&(e.defaultChecked=!!f),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),R!=null&&typeof R!="function"&&typeof R!="symbol"&&typeof R!="boolean"?e.name=""+se(R):e.removeAttribute("name")}function In(e,n,a,o,u,f,M,R){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){Re(e);return}a=a!=null?""+se(a):"",n=n!=null?""+se(n):a,R||n===e.value||(e.value=n),e.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=R?e.checked:!!o,e.defaultChecked=!!o,M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"&&(e.name=M),Re(e)}function wn(e,n,a){n==="number"&&yi(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function Je(e,n,a,o){if(e=e.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<e.length;a++)u=n.hasOwnProperty("$"+e[a].value),e[a].selected!==u&&(e[a].selected=u),u&&o&&(e[a].defaultSelected=!0)}else{for(a=""+se(a),n=null,u=0;u<e.length;u++){if(e[u].value===a){e[u].selected=!0,o&&(e[u].defaultSelected=!0);return}n!==null||e[u].disabled||(n=e[u])}n!==null&&(n.selected=!0)}}function Tn(e,n,a){if(n!=null&&(n=""+se(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+se(a):""}function Gs(e,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(ft(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=se(n),e.defaultValue=a,o=e.textContent,o===a&&o!==""&&o!==null&&(e.value=o),Re(e)}function kn(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var I1=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Pp(e,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":o?e.setProperty(n,a):typeof a!="number"||a===0||I1.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Ip(e,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(e=e.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&Pp(e,u,o)}else for(var f in n)n.hasOwnProperty(f)&&Pp(e,f,n[f])}function Ou(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var B1=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),F1=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ml(e){return F1.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Yi(){}var Lu=null;function wu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Vs=null,ks=null;function Bp(e){var n=Z(e);if(n&&(e=n.stateNode)){var a=e[xn]||null;t:switch(e=n.stateNode,n.type){case"input":if(ze(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+_n(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==e&&o.form===e.form){var u=o[xn]||null;if(!u)throw Error(s(90));ze(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===e.form&&Vn(o)}break t;case"textarea":Tn(e,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&Je(e,!!a.multiple,n,!1)}}}var Du=!1;function Fp(e,n,a){if(Du)return e(n,a);Du=!0;try{var o=e(n);return o}finally{if(Du=!1,(Vs!==null||ks!==null)&&(nc(),Vs&&(n=Vs,e=ks,ks=Vs=null,Bp(n),e)))for(n=0;n<e.length;n++)Bp(e[n])}}function ro(e,n){var a=e.stateNode;if(a===null)return null;var o=a[xn]||null;if(o===null)return null;a=o[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break t;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var Wi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Nu=!1;if(Wi)try{var oo={};Object.defineProperty(oo,"passive",{get:function(){Nu=!0}}),window.addEventListener("test",oo,oo),window.removeEventListener("test",oo,oo)}catch{Nu=!1}var Aa=null,Uu=null,gl=null;function zp(){if(gl)return gl;var e,n=Uu,a=n.length,o,u="value"in Aa?Aa.value:Aa.textContent,f=u.length;for(e=0;e<a&&n[e]===u[e];e++);var M=a-e;for(o=1;o<=M&&n[a-o]===u[f-o];o++);return gl=u.slice(e,1<o?1-o:void 0)}function _l(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function vl(){return!0}function Hp(){return!1}function Xn(e){function n(a,o,u,f,M){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=f,this.target=M,this.currentTarget=null;for(var R in e)e.hasOwnProperty(R)&&(a=e[R],this[R]=a?a(f):f[R]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?vl:Hp,this.isPropagationStopped=Hp,this}return _(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=vl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=vl)},persist:function(){},isPersistent:vl}),n}var os={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Sl=Xn(os),lo=_({},os,{view:0,detail:0}),z1=Xn(lo),Pu,Iu,co,Ml=_({},lo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Fu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==co&&(co&&e.type==="mousemove"?(Pu=e.screenX-co.screenX,Iu=e.screenY-co.screenY):Iu=Pu=0,co=e),Pu)},movementY:function(e){return"movementY"in e?e.movementY:Iu}}),Gp=Xn(Ml),H1=_({},Ml,{dataTransfer:0}),G1=Xn(H1),V1=_({},lo,{relatedTarget:0}),Bu=Xn(V1),k1=_({},os,{animationName:0,elapsedTime:0,pseudoElement:0}),X1=Xn(k1),Y1=_({},os,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),W1=Xn(Y1),q1=_({},os,{data:0}),Vp=Xn(q1),K1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},j1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Z1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Q1(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=Z1[e])?!!n[e]:!1}function Fu(){return Q1}var J1=_({},lo,{key:function(e){if(e.key){var n=K1[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=_l(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?j1[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Fu,charCode:function(e){return e.type==="keypress"?_l(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?_l(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),$1=Xn(J1),tS=_({},Ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),kp=Xn(tS),eS=_({},lo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Fu}),nS=Xn(eS),iS=_({},os,{propertyName:0,elapsedTime:0,pseudoElement:0}),aS=Xn(iS),sS=_({},Ml,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),rS=Xn(sS),oS=_({},os,{newState:0,oldState:0}),lS=Xn(oS),cS=[9,13,27,32],zu=Wi&&"CompositionEvent"in window,uo=null;Wi&&"documentMode"in document&&(uo=document.documentMode);var uS=Wi&&"TextEvent"in window&&!uo,Xp=Wi&&(!zu||uo&&8<uo&&11>=uo),Yp=" ",Wp=!1;function qp(e,n){switch(e){case"keyup":return cS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Kp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Xs=!1;function fS(e,n){switch(e){case"compositionend":return Kp(n);case"keypress":return n.which!==32?null:(Wp=!0,Yp);case"textInput":return e=n.data,e===Yp&&Wp?null:e;default:return null}}function hS(e,n){if(Xs)return e==="compositionend"||!zu&&qp(e,n)?(e=zp(),gl=Uu=Aa=null,Xs=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Xp&&n.locale!=="ko"?null:n.data;default:return null}}var dS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function jp(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!dS[e.type]:n==="textarea"}function Zp(e,n,a,o){Vs?ks?ks.push(o):ks=[o]:Vs=o,n=cc(n,"onChange"),0<n.length&&(a=new Sl("onChange","change",null,a,o),e.push({event:a,listeners:n}))}var fo=null,ho=null;function pS(e){Dg(e,0)}function Al(e){var n=st(e);if(Vn(n))return e}function Qp(e,n){if(e==="change")return n}var Jp=!1;if(Wi){var Hu;if(Wi){var Gu="oninput"in document;if(!Gu){var $p=document.createElement("div");$p.setAttribute("oninput","return;"),Gu=typeof $p.oninput=="function"}Hu=Gu}else Hu=!1;Jp=Hu&&(!document.documentMode||9<document.documentMode)}function tm(){fo&&(fo.detachEvent("onpropertychange",em),ho=fo=null)}function em(e){if(e.propertyName==="value"&&Al(ho)){var n=[];Zp(n,ho,e,wu(e)),Fp(pS,n)}}function mS(e,n,a){e==="focusin"?(tm(),fo=n,ho=a,fo.attachEvent("onpropertychange",em)):e==="focusout"&&tm()}function gS(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Al(ho)}function _S(e,n){if(e==="click")return Al(n)}function vS(e,n){if(e==="input"||e==="change")return Al(n)}function SS(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var $n=typeof Object.is=="function"?Object.is:SS;function po(e,n){if($n(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!Te.call(n,u)||!$n(e[u],n[u]))return!1}return!0}function nm(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function im(e,n){var a=nm(e);e=0;for(var o;a;){if(a.nodeType===3){if(o=e+a.textContent.length,e<=n&&o>=n)return{node:a,offset:n-e};e=o}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=nm(a)}}function am(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?am(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function sm(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=yi(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=yi(e.document)}return n}function Vu(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var MS=Wi&&"documentMode"in document&&11>=document.documentMode,Ys=null,ku=null,mo=null,Xu=!1;function rm(e,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Xu||Ys==null||Ys!==yi(o)||(o=Ys,"selectionStart"in o&&Vu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),mo&&po(mo,o)||(mo=o,o=cc(ku,"onSelect"),0<o.length&&(n=new Sl("onSelect","select",null,n,a),e.push({event:n,listeners:o}),n.target=Ys)))}function ls(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var Ws={animationend:ls("Animation","AnimationEnd"),animationiteration:ls("Animation","AnimationIteration"),animationstart:ls("Animation","AnimationStart"),transitionrun:ls("Transition","TransitionRun"),transitionstart:ls("Transition","TransitionStart"),transitioncancel:ls("Transition","TransitionCancel"),transitionend:ls("Transition","TransitionEnd")},Yu={},om={};Wi&&(om=document.createElement("div").style,"AnimationEvent"in window||(delete Ws.animationend.animation,delete Ws.animationiteration.animation,delete Ws.animationstart.animation),"TransitionEvent"in window||delete Ws.transitionend.transition);function cs(e){if(Yu[e])return Yu[e];if(!Ws[e])return e;var n=Ws[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in om)return Yu[e]=n[a];return e}var lm=cs("animationend"),cm=cs("animationiteration"),um=cs("animationstart"),AS=cs("transitionrun"),ES=cs("transitionstart"),yS=cs("transitioncancel"),fm=cs("transitionend"),hm=new Map,Wu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Wu.push("scrollEnd");function xi(e,n){hm.set(e,n),Ft(n,[e])}var El=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ui=[],qs=0,qu=0;function yl(){for(var e=qs,n=qu=qs=0;n<e;){var a=ui[n];ui[n++]=null;var o=ui[n];ui[n++]=null;var u=ui[n];ui[n++]=null;var f=ui[n];if(ui[n++]=null,o!==null&&u!==null){var M=o.pending;M===null?u.next=u:(u.next=M.next,M.next=u),o.pending=u}f!==0&&dm(a,u,f)}}function xl(e,n,a,o){ui[qs++]=e,ui[qs++]=n,ui[qs++]=a,ui[qs++]=o,qu|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function Ku(e,n,a,o){return xl(e,n,a,o),Tl(e)}function us(e,n){return xl(e,null,null,n),Tl(e)}function dm(e,n,a){e.lanes|=a;var o=e.alternate;o!==null&&(o.lanes|=a);for(var u=!1,f=e.return;f!==null;)f.childLanes|=a,o=f.alternate,o!==null&&(o.childLanes|=a),f.tag===22&&(e=f.stateNode,e===null||e._visibility&1||(u=!0)),e=f,f=f.return;return e.tag===3?(f=e.stateNode,u&&n!==null&&(u=31-ee(a),e=f.hiddenUpdates,o=e[u],o===null?e[u]=[n]:o.push(n),n.lane=a|536870912),f):null}function Tl(e){if(50<Bo)throw Bo=0,ah=null,Error(s(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Ks={};function xS(e,n,a,o){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ti(e,n,a,o){return new xS(e,n,a,o)}function ju(e){return e=e.prototype,!(!e||!e.isReactComponent)}function qi(e,n){var a=e.alternate;return a===null?(a=ti(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function pm(e,n){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function Rl(e,n,a,o,u,f){var M=0;if(o=e,typeof e=="function")ju(e)&&(M=1);else if(typeof e=="string")M=OM(e,a,Y.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case L:return e=ti(31,a,n,u),e.elementType=L,e.lanes=f,e;case T:return fs(a.children,u,f,n);case A:M=8,u|=24;break;case v:return e=ti(12,a,n,u|2),e.elementType=v,e.lanes=f,e;case H:return e=ti(13,a,n,u),e.elementType=H,e.lanes=f,e;case B:return e=ti(19,a,n,u),e.elementType=B,e.lanes=f,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case D:M=10;break t;case U:M=9;break t;case O:M=11;break t;case P:M=14;break t;case V:M=16,o=null;break t}M=29,a=Error(s(130,e===null?"null":typeof e,"")),o=null}return n=ti(M,a,n,u),n.elementType=e,n.type=o,n.lanes=f,n}function fs(e,n,a,o){return e=ti(7,e,o,n),e.lanes=a,e}function Zu(e,n,a){return e=ti(6,e,null,n),e.lanes=a,e}function mm(e){var n=ti(18,null,null,0);return n.stateNode=e,n}function Qu(e,n,a){return n=ti(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var gm=new WeakMap;function fi(e,n){if(typeof e=="object"&&e!==null){var a=gm.get(e);return a!==void 0?a:(n={value:e,source:n,stack:Dt(n)},gm.set(e,n),n)}return{value:e,source:n,stack:Dt(n)}}var js=[],Zs=0,bl=null,go=0,hi=[],di=0,Ea=null,Ui=1,Pi="";function Ki(e,n){js[Zs++]=go,js[Zs++]=bl,bl=e,go=n}function _m(e,n,a){hi[di++]=Ui,hi[di++]=Pi,hi[di++]=Ea,Ea=e;var o=Ui;e=Pi;var u=32-ee(o)-1;o&=~(1<<u),a+=1;var f=32-ee(n)+u;if(30<f){var M=u-u%5;f=(o&(1<<M)-1).toString(32),o>>=M,u-=M,Ui=1<<32-ee(n)+u|a<<u|o,Pi=f+e}else Ui=1<<f|a<<u|o,Pi=e}function Ju(e){e.return!==null&&(Ki(e,1),_m(e,1,0))}function $u(e){for(;e===bl;)bl=js[--Zs],js[Zs]=null,go=js[--Zs],js[Zs]=null;for(;e===Ea;)Ea=hi[--di],hi[di]=null,Pi=hi[--di],hi[di]=null,Ui=hi[--di],hi[di]=null}function vm(e,n){hi[di++]=Ui,hi[di++]=Pi,hi[di++]=Ea,Ui=n.id,Pi=n.overflow,Ea=e}var Rn=null,qe=null,xe=!1,ya=null,pi=!1,tf=Error(s(519));function xa(e){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw _o(fi(n,e)),tf}function Sm(e){var n=e.stateNode,a=e.type,o=e.memoizedProps;switch(n[Qe]=e,n[xn]=o,a){case"dialog":ve("cancel",n),ve("close",n);break;case"iframe":case"object":case"embed":ve("load",n);break;case"video":case"audio":for(a=0;a<zo.length;a++)ve(zo[a],n);break;case"source":ve("error",n);break;case"img":case"image":case"link":ve("error",n),ve("load",n);break;case"details":ve("toggle",n);break;case"input":ve("invalid",n),In(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":ve("invalid",n);break;case"textarea":ve("invalid",n),Gs(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||Ig(n.textContent,a)?(o.popover!=null&&(ve("beforetoggle",n),ve("toggle",n)),o.onScroll!=null&&ve("scroll",n),o.onScrollEnd!=null&&ve("scrollend",n),o.onClick!=null&&(n.onclick=Yi),n=!0):n=!1,n||xa(e,!0)}function Mm(e){for(Rn=e.return;Rn;)switch(Rn.tag){case 5:case 31:case 13:pi=!1;return;case 27:case 3:pi=!0;return;default:Rn=Rn.return}}function Qs(e){if(e!==Rn)return!1;if(!xe)return Mm(e),xe=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||Sh(e.type,e.memoizedProps)),a=!a),a&&qe&&xa(e),Mm(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));qe=Yg(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));qe=Yg(e)}else n===27?(n=qe,Fa(e.type)?(e=xh,xh=null,qe=e):qe=n):qe=Rn?gi(e.stateNode.nextSibling):null;return!0}function hs(){qe=Rn=null,xe=!1}function ef(){var e=ya;return e!==null&&(Kn===null?Kn=e:Kn.push.apply(Kn,e),ya=null),e}function _o(e){ya===null?ya=[e]:ya.push(e)}var nf=N(null),ds=null,ji=null;function Ta(e,n,a){ht(nf,n._currentValue),n._currentValue=a}function Zi(e){e._currentValue=nf.current,J(nf)}function af(e,n,a){for(;e!==null;){var o=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),e===a)break;e=e.return}}function sf(e,n,a,o){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var f=u.dependencies;if(f!==null){var M=u.child;f=f.firstContext;t:for(;f!==null;){var R=f;f=u;for(var F=0;F<n.length;F++)if(R.context===n[F]){f.lanes|=a,R=f.alternate,R!==null&&(R.lanes|=a),af(f.return,a,e),o||(M=null);break t}f=R.next}}else if(u.tag===18){if(M=u.return,M===null)throw Error(s(341));M.lanes|=a,f=M.alternate,f!==null&&(f.lanes|=a),af(M,a,e),M=null}else M=u.child;if(M!==null)M.return=u;else for(M=u;M!==null;){if(M===e){M=null;break}if(u=M.sibling,u!==null){u.return=M.return,M=u;break}M=M.return}u=M}}function Js(e,n,a,o){e=null;for(var u=n,f=!1;u!==null;){if(!f){if((u.flags&524288)!==0)f=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var M=u.alternate;if(M===null)throw Error(s(387));if(M=M.memoizedProps,M!==null){var R=u.type;$n(u.pendingProps.value,M.value)||(e!==null?e.push(R):e=[R])}}else if(u===At.current){if(M=u.alternate,M===null)throw Error(s(387));M.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(Xo):e=[Xo])}u=u.return}e!==null&&sf(n,e,a,o),n.flags|=262144}function Cl(e){for(e=e.firstContext;e!==null;){if(!$n(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ps(e){ds=e,ji=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function bn(e){return Am(ds,e)}function Ol(e,n){return ds===null&&ps(e),Am(e,n)}function Am(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ji===null){if(e===null)throw Error(s(308));ji=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else ji=ji.next=n;return a}var TS=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,o){e.push(o)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},RS=r.unstable_scheduleCallback,bS=r.unstable_NormalPriority,rn={$$typeof:D,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function rf(){return{controller:new TS,data:new Map,refCount:0}}function vo(e){e.refCount--,e.refCount===0&&RS(bS,function(){e.controller.abort()})}var So=null,of=0,$s=0,tr=null;function CS(e,n){if(So===null){var a=So=[];of=0,$s=uh(),tr={status:"pending",value:void 0,then:function(o){a.push(o)}}}return of++,n.then(Em,Em),n}function Em(){if(--of===0&&So!==null){tr!==null&&(tr.status="fulfilled");var e=So;So=null,$s=0,tr=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function OS(e,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return e.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var ym=I.S;I.S=function(e,n){rg=mt(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&CS(e,n),ym!==null&&ym(e,n)};var ms=N(null);function lf(){var e=ms.current;return e!==null?e:Ye.pooledCache}function Ll(e,n){n===null?ht(ms,ms.current):ht(ms,n.pool)}function xm(){var e=lf();return e===null?null:{parent:rn._currentValue,pool:e}}var er=Error(s(460)),cf=Error(s(474)),wl=Error(s(542)),Dl={then:function(){}};function Tm(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Rm(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(Yi,Yi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Cm(e),e;default:if(typeof n.status=="string")n.then(Yi,Yi);else{if(e=Ye,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=n,e.status="pending",e.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Cm(e),e}throw _s=n,er}}function gs(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(_s=a,er):a}}var _s=null;function bm(){if(_s===null)throw Error(s(459));var e=_s;return _s=null,e}function Cm(e){if(e===er||e===wl)throw Error(s(483))}var nr=null,Mo=0;function Nl(e){var n=Mo;return Mo+=1,nr===null&&(nr=[]),Rm(nr,e,n)}function Ao(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function Ul(e,n){throw n.$$typeof===S?Error(s(525)):(e=Object.prototype.toString.call(n),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Om(e){function n(Q,X){if(e){var tt=Q.deletions;tt===null?(Q.deletions=[X],Q.flags|=16):tt.push(X)}}function a(Q,X){if(!e)return null;for(;X!==null;)n(Q,X),X=X.sibling;return null}function o(Q){for(var X=new Map;Q!==null;)Q.key!==null?X.set(Q.key,Q):X.set(Q.index,Q),Q=Q.sibling;return X}function u(Q,X){return Q=qi(Q,X),Q.index=0,Q.sibling=null,Q}function f(Q,X,tt){return Q.index=tt,e?(tt=Q.alternate,tt!==null?(tt=tt.index,tt<X?(Q.flags|=67108866,X):tt):(Q.flags|=67108866,X)):(Q.flags|=1048576,X)}function M(Q){return e&&Q.alternate===null&&(Q.flags|=67108866),Q}function R(Q,X,tt,gt){return X===null||X.tag!==6?(X=Zu(tt,Q.mode,gt),X.return=Q,X):(X=u(X,tt),X.return=Q,X)}function F(Q,X,tt,gt){var Qt=tt.type;return Qt===T?dt(Q,X,tt.props.children,gt,tt.key):X!==null&&(X.elementType===Qt||typeof Qt=="object"&&Qt!==null&&Qt.$$typeof===V&&gs(Qt)===X.type)?(X=u(X,tt.props),Ao(X,tt),X.return=Q,X):(X=Rl(tt.type,tt.key,tt.props,null,Q.mode,gt),Ao(X,tt),X.return=Q,X)}function et(Q,X,tt,gt){return X===null||X.tag!==4||X.stateNode.containerInfo!==tt.containerInfo||X.stateNode.implementation!==tt.implementation?(X=Qu(tt,Q.mode,gt),X.return=Q,X):(X=u(X,tt.children||[]),X.return=Q,X)}function dt(Q,X,tt,gt,Qt){return X===null||X.tag!==7?(X=fs(tt,Q.mode,gt,Qt),X.return=Q,X):(X=u(X,tt),X.return=Q,X)}function Mt(Q,X,tt){if(typeof X=="string"&&X!==""||typeof X=="number"||typeof X=="bigint")return X=Zu(""+X,Q.mode,tt),X.return=Q,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case E:return tt=Rl(X.type,X.key,X.props,null,Q.mode,tt),Ao(tt,X),tt.return=Q,tt;case y:return X=Qu(X,Q.mode,tt),X.return=Q,X;case V:return X=gs(X),Mt(Q,X,tt)}if(ft(X)||nt(X))return X=fs(X,Q.mode,tt,null),X.return=Q,X;if(typeof X.then=="function")return Mt(Q,Nl(X),tt);if(X.$$typeof===D)return Mt(Q,Ol(Q,X),tt);Ul(Q,X)}return null}function at(Q,X,tt,gt){var Qt=X!==null?X.key:null;if(typeof tt=="string"&&tt!==""||typeof tt=="number"||typeof tt=="bigint")return Qt!==null?null:R(Q,X,""+tt,gt);if(typeof tt=="object"&&tt!==null){switch(tt.$$typeof){case E:return tt.key===Qt?F(Q,X,tt,gt):null;case y:return tt.key===Qt?et(Q,X,tt,gt):null;case V:return tt=gs(tt),at(Q,X,tt,gt)}if(ft(tt)||nt(tt))return Qt!==null?null:dt(Q,X,tt,gt,null);if(typeof tt.then=="function")return at(Q,X,Nl(tt),gt);if(tt.$$typeof===D)return at(Q,X,Ol(Q,tt),gt);Ul(Q,tt)}return null}function ot(Q,X,tt,gt,Qt){if(typeof gt=="string"&&gt!==""||typeof gt=="number"||typeof gt=="bigint")return Q=Q.get(tt)||null,R(X,Q,""+gt,Qt);if(typeof gt=="object"&&gt!==null){switch(gt.$$typeof){case E:return Q=Q.get(gt.key===null?tt:gt.key)||null,F(X,Q,gt,Qt);case y:return Q=Q.get(gt.key===null?tt:gt.key)||null,et(X,Q,gt,Qt);case V:return gt=gs(gt),ot(Q,X,tt,gt,Qt)}if(ft(gt)||nt(gt))return Q=Q.get(tt)||null,dt(X,Q,gt,Qt,null);if(typeof gt.then=="function")return ot(Q,X,tt,Nl(gt),Qt);if(gt.$$typeof===D)return ot(Q,X,tt,Ol(X,gt),Qt);Ul(X,gt)}return null}function Yt(Q,X,tt,gt){for(var Qt=null,Le=null,Wt=X,he=X=0,Ae=null;Wt!==null&&he<tt.length;he++){Wt.index>he?(Ae=Wt,Wt=null):Ae=Wt.sibling;var we=at(Q,Wt,tt[he],gt);if(we===null){Wt===null&&(Wt=Ae);break}e&&Wt&&we.alternate===null&&n(Q,Wt),X=f(we,X,he),Le===null?Qt=we:Le.sibling=we,Le=we,Wt=Ae}if(he===tt.length)return a(Q,Wt),xe&&Ki(Q,he),Qt;if(Wt===null){for(;he<tt.length;he++)Wt=Mt(Q,tt[he],gt),Wt!==null&&(X=f(Wt,X,he),Le===null?Qt=Wt:Le.sibling=Wt,Le=Wt);return xe&&Ki(Q,he),Qt}for(Wt=o(Wt);he<tt.length;he++)Ae=ot(Wt,Q,he,tt[he],gt),Ae!==null&&(e&&Ae.alternate!==null&&Wt.delete(Ae.key===null?he:Ae.key),X=f(Ae,X,he),Le===null?Qt=Ae:Le.sibling=Ae,Le=Ae);return e&&Wt.forEach(function(ka){return n(Q,ka)}),xe&&Ki(Q,he),Qt}function $t(Q,X,tt,gt){if(tt==null)throw Error(s(151));for(var Qt=null,Le=null,Wt=X,he=X=0,Ae=null,we=tt.next();Wt!==null&&!we.done;he++,we=tt.next()){Wt.index>he?(Ae=Wt,Wt=null):Ae=Wt.sibling;var ka=at(Q,Wt,we.value,gt);if(ka===null){Wt===null&&(Wt=Ae);break}e&&Wt&&ka.alternate===null&&n(Q,Wt),X=f(ka,X,he),Le===null?Qt=ka:Le.sibling=ka,Le=ka,Wt=Ae}if(we.done)return a(Q,Wt),xe&&Ki(Q,he),Qt;if(Wt===null){for(;!we.done;he++,we=tt.next())we=Mt(Q,we.value,gt),we!==null&&(X=f(we,X,he),Le===null?Qt=we:Le.sibling=we,Le=we);return xe&&Ki(Q,he),Qt}for(Wt=o(Wt);!we.done;he++,we=tt.next())we=ot(Wt,Q,he,we.value,gt),we!==null&&(e&&we.alternate!==null&&Wt.delete(we.key===null?he:we.key),X=f(we,X,he),Le===null?Qt=we:Le.sibling=we,Le=we);return e&&Wt.forEach(function(HM){return n(Q,HM)}),xe&&Ki(Q,he),Qt}function Ve(Q,X,tt,gt){if(typeof tt=="object"&&tt!==null&&tt.type===T&&tt.key===null&&(tt=tt.props.children),typeof tt=="object"&&tt!==null){switch(tt.$$typeof){case E:t:{for(var Qt=tt.key;X!==null;){if(X.key===Qt){if(Qt=tt.type,Qt===T){if(X.tag===7){a(Q,X.sibling),gt=u(X,tt.props.children),gt.return=Q,Q=gt;break t}}else if(X.elementType===Qt||typeof Qt=="object"&&Qt!==null&&Qt.$$typeof===V&&gs(Qt)===X.type){a(Q,X.sibling),gt=u(X,tt.props),Ao(gt,tt),gt.return=Q,Q=gt;break t}a(Q,X);break}else n(Q,X);X=X.sibling}tt.type===T?(gt=fs(tt.props.children,Q.mode,gt,tt.key),gt.return=Q,Q=gt):(gt=Rl(tt.type,tt.key,tt.props,null,Q.mode,gt),Ao(gt,tt),gt.return=Q,Q=gt)}return M(Q);case y:t:{for(Qt=tt.key;X!==null;){if(X.key===Qt)if(X.tag===4&&X.stateNode.containerInfo===tt.containerInfo&&X.stateNode.implementation===tt.implementation){a(Q,X.sibling),gt=u(X,tt.children||[]),gt.return=Q,Q=gt;break t}else{a(Q,X);break}else n(Q,X);X=X.sibling}gt=Qu(tt,Q.mode,gt),gt.return=Q,Q=gt}return M(Q);case V:return tt=gs(tt),Ve(Q,X,tt,gt)}if(ft(tt))return Yt(Q,X,tt,gt);if(nt(tt)){if(Qt=nt(tt),typeof Qt!="function")throw Error(s(150));return tt=Qt.call(tt),$t(Q,X,tt,gt)}if(typeof tt.then=="function")return Ve(Q,X,Nl(tt),gt);if(tt.$$typeof===D)return Ve(Q,X,Ol(Q,tt),gt);Ul(Q,tt)}return typeof tt=="string"&&tt!==""||typeof tt=="number"||typeof tt=="bigint"?(tt=""+tt,X!==null&&X.tag===6?(a(Q,X.sibling),gt=u(X,tt),gt.return=Q,Q=gt):(a(Q,X),gt=Zu(tt,Q.mode,gt),gt.return=Q,Q=gt),M(Q)):a(Q,X)}return function(Q,X,tt,gt){try{Mo=0;var Qt=Ve(Q,X,tt,gt);return nr=null,Qt}catch(Wt){if(Wt===er||Wt===wl)throw Wt;var Le=ti(29,Wt,null,Q.mode);return Le.lanes=gt,Le.return=Q,Le}finally{}}}var vs=Om(!0),Lm=Om(!1),Ra=!1;function uf(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ff(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ba(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ca(e,n,a){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ne&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=Tl(e),dm(e,null,a),n}return xl(e,o,n,a),Tl(e)}function Eo(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,no(e,a)}}function hf(e,n){var a=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var M={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?u=f=M:f=f.next=M,a=a.next}while(a!==null);f===null?u=f=n:f=f.next=n}else u=f=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:f,shared:o.shared,callbacks:o.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var df=!1;function yo(){if(df){var e=tr;if(e!==null)throw e}}function xo(e,n,a,o){df=!1;var u=e.updateQueue;Ra=!1;var f=u.firstBaseUpdate,M=u.lastBaseUpdate,R=u.shared.pending;if(R!==null){u.shared.pending=null;var F=R,et=F.next;F.next=null,M===null?f=et:M.next=et,M=F;var dt=e.alternate;dt!==null&&(dt=dt.updateQueue,R=dt.lastBaseUpdate,R!==M&&(R===null?dt.firstBaseUpdate=et:R.next=et,dt.lastBaseUpdate=F))}if(f!==null){var Mt=u.baseState;M=0,dt=et=F=null,R=f;do{var at=R.lane&-536870913,ot=at!==R.lane;if(ot?(Me&at)===at:(o&at)===at){at!==0&&at===$s&&(df=!0),dt!==null&&(dt=dt.next={lane:0,tag:R.tag,payload:R.payload,callback:null,next:null});t:{var Yt=e,$t=R;at=n;var Ve=a;switch($t.tag){case 1:if(Yt=$t.payload,typeof Yt=="function"){Mt=Yt.call(Ve,Mt,at);break t}Mt=Yt;break t;case 3:Yt.flags=Yt.flags&-65537|128;case 0:if(Yt=$t.payload,at=typeof Yt=="function"?Yt.call(Ve,Mt,at):Yt,at==null)break t;Mt=_({},Mt,at);break t;case 2:Ra=!0}}at=R.callback,at!==null&&(e.flags|=64,ot&&(e.flags|=8192),ot=u.callbacks,ot===null?u.callbacks=[at]:ot.push(at))}else ot={lane:at,tag:R.tag,payload:R.payload,callback:R.callback,next:null},dt===null?(et=dt=ot,F=Mt):dt=dt.next=ot,M|=at;if(R=R.next,R===null){if(R=u.shared.pending,R===null)break;ot=R,R=ot.next,ot.next=null,u.lastBaseUpdate=ot,u.shared.pending=null}}while(!0);dt===null&&(F=Mt),u.baseState=F,u.firstBaseUpdate=et,u.lastBaseUpdate=dt,f===null&&(u.shared.lanes=0),Na|=M,e.lanes=M,e.memoizedState=Mt}}function wm(e,n){if(typeof e!="function")throw Error(s(191,e));e.call(n)}function Dm(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)wm(a[e],n)}var ir=N(null),Pl=N(0);function Nm(e,n){e=sa,ht(Pl,e),ht(ir,n),sa=e|n.baseLanes}function pf(){ht(Pl,sa),ht(ir,ir.current)}function mf(){sa=Pl.current,J(ir),J(Pl)}var ei=N(null),mi=null;function Oa(e){var n=e.alternate;ht(nn,nn.current&1),ht(ei,e),mi===null&&(n===null||ir.current!==null||n.memoizedState!==null)&&(mi=e)}function gf(e){ht(nn,nn.current),ht(ei,e),mi===null&&(mi=e)}function Um(e){e.tag===22?(ht(nn,nn.current),ht(ei,e),mi===null&&(mi=e)):La()}function La(){ht(nn,nn.current),ht(ei,ei.current)}function ni(e){J(ei),mi===e&&(mi=null),J(nn)}var nn=N(0);function Il(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Eh(a)||yh(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Qi=0,ue=null,He=null,on=null,Bl=!1,ar=!1,Ss=!1,Fl=0,To=0,sr=null,LS=0;function $e(){throw Error(s(321))}function _f(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!$n(e[a],n[a]))return!1;return!0}function vf(e,n,a,o,u,f){return Qi=f,ue=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,I.H=e===null||e.memoizedState===null?_0:Nf,Ss=!1,f=a(o,u),Ss=!1,ar&&(f=Im(n,a,o,u)),Pm(e),f}function Pm(e){I.H=Co;var n=He!==null&&He.next!==null;if(Qi=0,on=He=ue=null,Bl=!1,To=0,sr=null,n)throw Error(s(300));e===null||ln||(e=e.dependencies,e!==null&&Cl(e)&&(ln=!0))}function Im(e,n,a,o){ue=e;var u=0;do{if(ar&&(sr=null),To=0,ar=!1,25<=u)throw Error(s(301));if(u+=1,on=He=null,e.updateQueue!=null){var f=e.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}I.H=v0,f=n(a,o)}while(ar);return f}function wS(){var e=I.H,n=e.useState()[0];return n=typeof n.then=="function"?Ro(n):n,e=e.useState()[0],(He!==null?He.memoizedState:null)!==e&&(ue.flags|=1024),n}function Sf(){var e=Fl!==0;return Fl=0,e}function Mf(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function Af(e){if(Bl){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}Bl=!1}Qi=0,on=He=ue=null,ar=!1,To=Fl=0,sr=null}function Bn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return on===null?ue.memoizedState=on=e:on=on.next=e,on}function an(){if(He===null){var e=ue.alternate;e=e!==null?e.memoizedState:null}else e=He.next;var n=on===null?ue.memoizedState:on.next;if(n!==null)on=n,He=e;else{if(e===null)throw ue.alternate===null?Error(s(467)):Error(s(310));He=e,e={memoizedState:He.memoizedState,baseState:He.baseState,baseQueue:He.baseQueue,queue:He.queue,next:null},on===null?ue.memoizedState=on=e:on=on.next=e}return on}function zl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ro(e){var n=To;return To+=1,sr===null&&(sr=[]),e=Rm(sr,e,n),n=ue,(on===null?n.memoizedState:on.next)===null&&(n=n.alternate,I.H=n===null||n.memoizedState===null?_0:Nf),e}function Hl(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ro(e);if(e.$$typeof===D)return bn(e)}throw Error(s(438,String(e)))}function Ef(e){var n=null,a=ue.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=ue.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=zl(),ue.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),o=0;o<e;o++)a[o]=C;return n.index++,a}function Ji(e,n){return typeof n=="function"?n(e):n}function Gl(e){var n=an();return yf(n,He,e)}function yf(e,n,a){var o=e.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=e.baseQueue,f=o.pending;if(f!==null){if(u!==null){var M=u.next;u.next=f.next,f.next=M}n.baseQueue=u=f,o.pending=null}if(f=e.baseState,u===null)e.memoizedState=f;else{n=u.next;var R=M=null,F=null,et=n,dt=!1;do{var Mt=et.lane&-536870913;if(Mt!==et.lane?(Me&Mt)===Mt:(Qi&Mt)===Mt){var at=et.revertLane;if(at===0)F!==null&&(F=F.next={lane:0,revertLane:0,gesture:null,action:et.action,hasEagerState:et.hasEagerState,eagerState:et.eagerState,next:null}),Mt===$s&&(dt=!0);else if((Qi&at)===at){et=et.next,at===$s&&(dt=!0);continue}else Mt={lane:0,revertLane:et.revertLane,gesture:null,action:et.action,hasEagerState:et.hasEagerState,eagerState:et.eagerState,next:null},F===null?(R=F=Mt,M=f):F=F.next=Mt,ue.lanes|=at,Na|=at;Mt=et.action,Ss&&a(f,Mt),f=et.hasEagerState?et.eagerState:a(f,Mt)}else at={lane:Mt,revertLane:et.revertLane,gesture:et.gesture,action:et.action,hasEagerState:et.hasEagerState,eagerState:et.eagerState,next:null},F===null?(R=F=at,M=f):F=F.next=at,ue.lanes|=Mt,Na|=Mt;et=et.next}while(et!==null&&et!==n);if(F===null?M=f:F.next=R,!$n(f,e.memoizedState)&&(ln=!0,dt&&(a=tr,a!==null)))throw a;e.memoizedState=f,e.baseState=M,e.baseQueue=F,o.lastRenderedState=f}return u===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function xf(e){var n=an(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=e;var o=a.dispatch,u=a.pending,f=n.memoizedState;if(u!==null){a.pending=null;var M=u=u.next;do f=e(f,M.action),M=M.next;while(M!==u);$n(f,n.memoizedState)||(ln=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,o]}function Bm(e,n,a){var o=ue,u=an(),f=xe;if(f){if(a===void 0)throw Error(s(407));a=a()}else a=n();var M=!$n((He||u).memoizedState,a);if(M&&(u.memoizedState=a,ln=!0),u=u.queue,bf(Hm.bind(null,o,u,e),[e]),u.getSnapshot!==n||M||on!==null&&on.memoizedState.tag&1){if(o.flags|=2048,rr(9,{destroy:void 0},zm.bind(null,o,u,a,n),null),Ye===null)throw Error(s(349));f||(Qi&127)!==0||Fm(o,n,a)}return a}function Fm(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=ue.updateQueue,n===null?(n=zl(),ue.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function zm(e,n,a,o){n.value=a,n.getSnapshot=o,Gm(n)&&Vm(e)}function Hm(e,n,a){return a(function(){Gm(n)&&Vm(e)})}function Gm(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!$n(e,a)}catch{return!0}}function Vm(e){var n=us(e,2);n!==null&&jn(n,e,2)}function Tf(e){var n=Bn();if(typeof e=="function"){var a=e;if(e=a(),Ss){zt(!0);try{a()}finally{zt(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ji,lastRenderedState:e},n}function km(e,n,a,o){return e.baseState=a,yf(e,He,typeof o=="function"?o:Ji)}function DS(e,n,a,o,u){if(Xl(e))throw Error(s(485));if(e=n.action,e!==null){var f={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(M){f.listeners.push(M)}};I.T!==null?a(!0):f.isTransition=!1,o(f),a=n.pending,a===null?(f.next=n.pending=f,Xm(n,f)):(f.next=a.next,n.pending=a.next=f)}}function Xm(e,n){var a=n.action,o=n.payload,u=e.state;if(n.isTransition){var f=I.T,M={};I.T=M;try{var R=a(u,o),F=I.S;F!==null&&F(M,R),Ym(e,n,R)}catch(et){Rf(e,n,et)}finally{f!==null&&M.types!==null&&(f.types=M.types),I.T=f}}else try{f=a(u,o),Ym(e,n,f)}catch(et){Rf(e,n,et)}}function Ym(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){Wm(e,n,o)},function(o){return Rf(e,n,o)}):Wm(e,n,a)}function Wm(e,n,a){n.status="fulfilled",n.value=a,qm(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,Xm(e,a)))}function Rf(e,n,a){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,qm(n),n=n.next;while(n!==o)}e.action=null}function qm(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function Km(e,n){return n}function jm(e,n){if(xe){var a=Ye.formState;if(a!==null){t:{var o=ue;if(xe){if(qe){e:{for(var u=qe,f=pi;u.nodeType!==8;){if(!f){u=null;break e}if(u=gi(u.nextSibling),u===null){u=null;break e}}f=u.data,u=f==="F!"||f==="F"?u:null}if(u){qe=gi(u.nextSibling),o=u.data==="F!";break t}}xa(o)}o=!1}o&&(n=a[0])}}return a=Bn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Km,lastRenderedState:n},a.queue=o,a=p0.bind(null,ue,o),o.dispatch=a,o=Tf(!1),f=Df.bind(null,ue,!1,o.queue),o=Bn(),u={state:n,dispatch:null,action:e,pending:null},o.queue=u,a=DS.bind(null,ue,u,f,a),u.dispatch=a,o.memoizedState=e,[n,a,!1]}function Zm(e){var n=an();return Qm(n,He,e)}function Qm(e,n,a){if(n=yf(e,n,Km)[0],e=Gl(Ji)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=Ro(n)}catch(M){throw M===er?wl:M}else o=n;n=an();var u=n.queue,f=u.dispatch;return a!==n.memoizedState&&(ue.flags|=2048,rr(9,{destroy:void 0},NS.bind(null,u,a),null)),[o,f,e]}function NS(e,n){e.action=n}function Jm(e){var n=an(),a=He;if(a!==null)return Qm(n,a,e);an(),n=n.memoizedState,a=an();var o=a.queue.dispatch;return a.memoizedState=e,[n,o,!1]}function rr(e,n,a,o){return e={tag:e,create:a,deps:o,inst:n,next:null},n=ue.updateQueue,n===null&&(n=zl(),ue.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(o=a.next,a.next=e,e.next=o,n.lastEffect=e),e}function $m(){return an().memoizedState}function Vl(e,n,a,o){var u=Bn();ue.flags|=e,u.memoizedState=rr(1|n,{destroy:void 0},a,o===void 0?null:o)}function kl(e,n,a,o){var u=an();o=o===void 0?null:o;var f=u.memoizedState.inst;He!==null&&o!==null&&_f(o,He.memoizedState.deps)?u.memoizedState=rr(n,f,a,o):(ue.flags|=e,u.memoizedState=rr(1|n,f,a,o))}function t0(e,n){Vl(8390656,8,e,n)}function bf(e,n){kl(2048,8,e,n)}function US(e){ue.flags|=4;var n=ue.updateQueue;if(n===null)n=zl(),ue.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function e0(e){var n=an().memoizedState;return US({ref:n,nextImpl:e}),function(){if((Ne&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function n0(e,n){return kl(4,2,e,n)}function i0(e,n){return kl(4,4,e,n)}function a0(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function s0(e,n,a){a=a!=null?a.concat([e]):null,kl(4,4,a0.bind(null,n,e),a)}function Cf(){}function r0(e,n){var a=an();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&_f(n,o[1])?o[0]:(a.memoizedState=[e,n],e)}function o0(e,n){var a=an();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&_f(n,o[1]))return o[0];if(o=e(),Ss){zt(!0);try{e()}finally{zt(!1)}}return a.memoizedState=[o,n],o}function Of(e,n,a){return a===void 0||(Qi&1073741824)!==0&&(Me&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=lg(),ue.lanes|=e,Na|=e,a)}function l0(e,n,a,o){return $n(a,n)?a:ir.current!==null?(e=Of(e,a,o),$n(e,n)||(ln=!0),e):(Qi&42)===0||(Qi&1073741824)!==0&&(Me&261930)===0?(ln=!0,e.memoizedState=a):(e=lg(),ue.lanes|=e,Na|=e,n)}function c0(e,n,a,o,u){var f=k.p;k.p=f!==0&&8>f?f:8;var M=I.T,R={};I.T=R,Df(e,!1,n,a);try{var F=u(),et=I.S;if(et!==null&&et(R,F),F!==null&&typeof F=="object"&&typeof F.then=="function"){var dt=OS(F,o);bo(e,n,dt,si(e))}else bo(e,n,o,si(e))}catch(Mt){bo(e,n,{then:function(){},status:"rejected",reason:Mt},si())}finally{k.p=f,M!==null&&R.types!==null&&(M.types=R.types),I.T=M}}function PS(){}function Lf(e,n,a,o){if(e.tag!==5)throw Error(s(476));var u=u0(e).queue;c0(e,u,n,q,a===null?PS:function(){return f0(e),a(o)})}function u0(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:q,baseState:q,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ji,lastRenderedState:q},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ji,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function f0(e){var n=u0(e);n.next===null&&(n=e.alternate.memoizedState),bo(e,n.next.queue,{},si())}function wf(){return bn(Xo)}function h0(){return an().memoizedState}function d0(){return an().memoizedState}function IS(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=si();e=ba(a);var o=Ca(n,e,a);o!==null&&(jn(o,n,a),Eo(o,n,a)),n={cache:rf()},e.payload=n;return}n=n.return}}function BS(e,n,a){var o=si();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Xl(e)?m0(n,a):(a=Ku(e,n,a,o),a!==null&&(jn(a,e,o),g0(a,n,o)))}function p0(e,n,a){var o=si();bo(e,n,a,o)}function bo(e,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Xl(e))m0(n,u);else{var f=e.alternate;if(e.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var M=n.lastRenderedState,R=f(M,a);if(u.hasEagerState=!0,u.eagerState=R,$n(R,M))return xl(e,n,u,0),Ye===null&&yl(),!1}catch{}finally{}if(a=Ku(e,n,u,o),a!==null)return jn(a,e,o),g0(a,n,o),!0}return!1}function Df(e,n,a,o){if(o={lane:2,revertLane:uh(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Xl(e)){if(n)throw Error(s(479))}else n=Ku(e,a,o,2),n!==null&&jn(n,e,2)}function Xl(e){var n=e.alternate;return e===ue||n!==null&&n===ue}function m0(e,n){ar=Bl=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function g0(e,n,a){if((a&4194048)!==0){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,no(e,a)}}var Co={readContext:bn,use:Hl,useCallback:$e,useContext:$e,useEffect:$e,useImperativeHandle:$e,useLayoutEffect:$e,useInsertionEffect:$e,useMemo:$e,useReducer:$e,useRef:$e,useState:$e,useDebugValue:$e,useDeferredValue:$e,useTransition:$e,useSyncExternalStore:$e,useId:$e,useHostTransitionStatus:$e,useFormState:$e,useActionState:$e,useOptimistic:$e,useMemoCache:$e,useCacheRefresh:$e};Co.useEffectEvent=$e;var _0={readContext:bn,use:Hl,useCallback:function(e,n){return Bn().memoizedState=[e,n===void 0?null:n],e},useContext:bn,useEffect:t0,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,Vl(4194308,4,a0.bind(null,n,e),a)},useLayoutEffect:function(e,n){return Vl(4194308,4,e,n)},useInsertionEffect:function(e,n){Vl(4,2,e,n)},useMemo:function(e,n){var a=Bn();n=n===void 0?null:n;var o=e();if(Ss){zt(!0);try{e()}finally{zt(!1)}}return a.memoizedState=[o,n],o},useReducer:function(e,n,a){var o=Bn();if(a!==void 0){var u=a(n);if(Ss){zt(!0);try{a(n)}finally{zt(!1)}}}else u=n;return o.memoizedState=o.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},o.queue=e,e=e.dispatch=BS.bind(null,ue,e),[o.memoizedState,e]},useRef:function(e){var n=Bn();return e={current:e},n.memoizedState=e},useState:function(e){e=Tf(e);var n=e.queue,a=p0.bind(null,ue,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:Cf,useDeferredValue:function(e,n){var a=Bn();return Of(a,e,n)},useTransition:function(){var e=Tf(!1);return e=c0.bind(null,ue,e.queue,!0,!1),Bn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var o=ue,u=Bn();if(xe){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),Ye===null)throw Error(s(349));(Me&127)!==0||Fm(o,n,a)}u.memoizedState=a;var f={value:a,getSnapshot:n};return u.queue=f,t0(Hm.bind(null,o,f,e),[e]),o.flags|=2048,rr(9,{destroy:void 0},zm.bind(null,o,f,a,n),null),a},useId:function(){var e=Bn(),n=Ye.identifierPrefix;if(xe){var a=Pi,o=Ui;a=(o&~(1<<32-ee(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Fl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=LS++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:wf,useFormState:jm,useActionState:jm,useOptimistic:function(e){var n=Bn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=Df.bind(null,ue,!0,a),a.dispatch=n,[e,n]},useMemoCache:Ef,useCacheRefresh:function(){return Bn().memoizedState=IS.bind(null,ue)},useEffectEvent:function(e){var n=Bn(),a={impl:e};return n.memoizedState=a,function(){if((Ne&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},Nf={readContext:bn,use:Hl,useCallback:r0,useContext:bn,useEffect:bf,useImperativeHandle:s0,useInsertionEffect:n0,useLayoutEffect:i0,useMemo:o0,useReducer:Gl,useRef:$m,useState:function(){return Gl(Ji)},useDebugValue:Cf,useDeferredValue:function(e,n){var a=an();return l0(a,He.memoizedState,e,n)},useTransition:function(){var e=Gl(Ji)[0],n=an().memoizedState;return[typeof e=="boolean"?e:Ro(e),n]},useSyncExternalStore:Bm,useId:h0,useHostTransitionStatus:wf,useFormState:Zm,useActionState:Zm,useOptimistic:function(e,n){var a=an();return km(a,He,e,n)},useMemoCache:Ef,useCacheRefresh:d0};Nf.useEffectEvent=e0;var v0={readContext:bn,use:Hl,useCallback:r0,useContext:bn,useEffect:bf,useImperativeHandle:s0,useInsertionEffect:n0,useLayoutEffect:i0,useMemo:o0,useReducer:xf,useRef:$m,useState:function(){return xf(Ji)},useDebugValue:Cf,useDeferredValue:function(e,n){var a=an();return He===null?Of(a,e,n):l0(a,He.memoizedState,e,n)},useTransition:function(){var e=xf(Ji)[0],n=an().memoizedState;return[typeof e=="boolean"?e:Ro(e),n]},useSyncExternalStore:Bm,useId:h0,useHostTransitionStatus:wf,useFormState:Jm,useActionState:Jm,useOptimistic:function(e,n){var a=an();return He!==null?km(a,He,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Ef,useCacheRefresh:d0};v0.useEffectEvent=e0;function Uf(e,n,a,o){n=e.memoizedState,a=a(o,n),a=a==null?n:_({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Pf={enqueueSetState:function(e,n,a){e=e._reactInternals;var o=si(),u=ba(o);u.payload=n,a!=null&&(u.callback=a),n=Ca(e,u,o),n!==null&&(jn(n,e,o),Eo(n,e,o))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var o=si(),u=ba(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Ca(e,u,o),n!==null&&(jn(n,e,o),Eo(n,e,o))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=si(),o=ba(a);o.tag=2,n!=null&&(o.callback=n),n=Ca(e,o,a),n!==null&&(jn(n,e,a),Eo(n,e,a))}};function S0(e,n,a,o,u,f,M){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,f,M):n.prototype&&n.prototype.isPureReactComponent?!po(a,o)||!po(u,f):!0}function M0(e,n,a,o){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==e&&Pf.enqueueReplaceState(n,n.state,null)}function Ms(e,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(e=e.defaultProps){a===n&&(a=_({},a));for(var u in e)a[u]===void 0&&(a[u]=e[u])}return a}function A0(e){El(e)}function E0(e){console.error(e)}function y0(e){El(e)}function Yl(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function x0(e,n,a){try{var o=e.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function If(e,n,a){return a=ba(a),a.tag=3,a.payload={element:null},a.callback=function(){Yl(e,n)},a}function T0(e){return e=ba(e),e.tag=3,e}function R0(e,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var f=o.value;e.payload=function(){return u(f)},e.callback=function(){x0(n,a,o)}}var M=a.stateNode;M!==null&&typeof M.componentDidCatch=="function"&&(e.callback=function(){x0(n,a,o),typeof u!="function"&&(Ua===null?Ua=new Set([this]):Ua.add(this));var R=o.stack;this.componentDidCatch(o.value,{componentStack:R!==null?R:""})})}function FS(e,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&Js(n,a,u,!0),a=ei.current,a!==null){switch(a.tag){case 31:case 13:return mi===null?ic():a.alternate===null&&tn===0&&(tn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===Dl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),oh(e,o,u)),!1;case 22:return a.flags|=65536,o===Dl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),oh(e,o,u)),!1}throw Error(s(435,a.tag))}return oh(e,o,u),ic(),!1}if(xe)return n=ei.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==tf&&(e=Error(s(422),{cause:o}),_o(fi(e,a)))):(o!==tf&&(n=Error(s(423),{cause:o}),_o(fi(n,a))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,o=fi(o,a),u=If(e.stateNode,o,u),hf(e,u),tn!==4&&(tn=2)),!1;var f=Error(s(520),{cause:o});if(f=fi(f,a),Io===null?Io=[f]:Io.push(f),tn!==4&&(tn=2),n===null)return!0;o=fi(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=u&-u,a.lanes|=e,e=If(a.stateNode,o,e),hf(a,e),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Ua===null||!Ua.has(f))))return a.flags|=65536,u&=-u,a.lanes|=u,u=T0(u),R0(u,e,a,o),hf(a,u),!1}a=a.return}while(a!==null);return!1}var Bf=Error(s(461)),ln=!1;function Cn(e,n,a,o){n.child=e===null?Lm(n,null,a,o):vs(n,e.child,a,o)}function b0(e,n,a,o,u){a=a.render;var f=n.ref;if("ref"in o){var M={};for(var R in o)R!=="ref"&&(M[R]=o[R])}else M=o;return ps(n),o=vf(e,n,a,M,f,u),R=Sf(),e!==null&&!ln?(Mf(e,n,u),$i(e,n,u)):(xe&&R&&Ju(n),n.flags|=1,Cn(e,n,o,u),n.child)}function C0(e,n,a,o,u){if(e===null){var f=a.type;return typeof f=="function"&&!ju(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,O0(e,n,f,o,u)):(e=Rl(a.type,null,o,n,n.mode,u),e.ref=n.ref,e.return=n,n.child=e)}if(f=e.child,!Yf(e,u)){var M=f.memoizedProps;if(a=a.compare,a=a!==null?a:po,a(M,o)&&e.ref===n.ref)return $i(e,n,u)}return n.flags|=1,e=qi(f,o),e.ref=n.ref,e.return=n,n.child=e}function O0(e,n,a,o,u){if(e!==null){var f=e.memoizedProps;if(po(f,o)&&e.ref===n.ref)if(ln=!1,n.pendingProps=o=f,Yf(e,u))(e.flags&131072)!==0&&(ln=!0);else return n.lanes=e.lanes,$i(e,n,u)}return Ff(e,n,a,o,u)}function L0(e,n,a,o){var u=o.children,f=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,e!==null){for(o=n.child=e.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~f}else o=0,n.child=null;return w0(e,n,f,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ll(n,f!==null?f.cachePool:null),f!==null?Nm(n,f):pf(),Um(n);else return o=n.lanes=536870912,w0(e,n,f!==null?f.baseLanes|a:a,a,o)}else f!==null?(Ll(n,f.cachePool),Nm(n,f),La(),n.memoizedState=null):(e!==null&&Ll(n,null),pf(),La());return Cn(e,n,u,a),n.child}function Oo(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function w0(e,n,a,o,u){var f=lf();return f=f===null?null:{parent:rn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},e!==null&&Ll(n,null),pf(),Um(n),e!==null&&Js(e,n,o,!0),n.childLanes=u,null}function Wl(e,n){return n=Kl({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function D0(e,n,a){return vs(n,e.child,null,a),e=Wl(n,n.pendingProps),e.flags|=2,ni(n),n.memoizedState=null,e}function zS(e,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(xe){if(o.mode==="hidden")return e=Wl(n,o),n.lanes=536870912,Oo(null,e);if(gf(n),(e=qe)?(e=Xg(e,pi),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Ea!==null?{id:Ui,overflow:Pi}:null,retryLane:536870912,hydrationErrors:null},a=mm(e),a.return=n,n.child=a,Rn=n,qe=null)):e=null,e===null)throw xa(n);return n.lanes=536870912,null}return Wl(n,o)}var f=e.memoizedState;if(f!==null){var M=f.dehydrated;if(gf(n),u)if(n.flags&256)n.flags&=-257,n=D0(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(s(558));else if(ln||Js(e,n,a,!1),u=(a&e.childLanes)!==0,ln||u){if(o=Ye,o!==null&&(M=Ni(o,a),M!==0&&M!==f.retryLane))throw f.retryLane=M,us(e,M),jn(o,e,M),Bf;ic(),n=D0(e,n,a)}else e=f.treeContext,qe=gi(M.nextSibling),Rn=n,xe=!0,ya=null,pi=!1,e!==null&&vm(n,e),n=Wl(n,o),n.flags|=4096;return n}return e=qi(e.child,{mode:o.mode,children:o.children}),e.ref=n.ref,n.child=e,e.return=n,e}function ql(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function Ff(e,n,a,o,u){return ps(n),a=vf(e,n,a,o,void 0,u),o=Sf(),e!==null&&!ln?(Mf(e,n,u),$i(e,n,u)):(xe&&o&&Ju(n),n.flags|=1,Cn(e,n,a,u),n.child)}function N0(e,n,a,o,u,f){return ps(n),n.updateQueue=null,a=Im(n,o,a,u),Pm(e),o=Sf(),e!==null&&!ln?(Mf(e,n,f),$i(e,n,f)):(xe&&o&&Ju(n),n.flags|=1,Cn(e,n,a,f),n.child)}function U0(e,n,a,o,u){if(ps(n),n.stateNode===null){var f=Ks,M=a.contextType;typeof M=="object"&&M!==null&&(f=bn(M)),f=new a(o,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=Pf,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=o,f.state=n.memoizedState,f.refs={},uf(n),M=a.contextType,f.context=typeof M=="object"&&M!==null?bn(M):Ks,f.state=n.memoizedState,M=a.getDerivedStateFromProps,typeof M=="function"&&(Uf(n,a,M,o),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(M=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),M!==f.state&&Pf.enqueueReplaceState(f,f.state,null),xo(n,o,f,u),yo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(e===null){f=n.stateNode;var R=n.memoizedProps,F=Ms(a,R);f.props=F;var et=f.context,dt=a.contextType;M=Ks,typeof dt=="object"&&dt!==null&&(M=bn(dt));var Mt=a.getDerivedStateFromProps;dt=typeof Mt=="function"||typeof f.getSnapshotBeforeUpdate=="function",R=n.pendingProps!==R,dt||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(R||et!==M)&&M0(n,f,o,M),Ra=!1;var at=n.memoizedState;f.state=at,xo(n,o,f,u),yo(),et=n.memoizedState,R||at!==et||Ra?(typeof Mt=="function"&&(Uf(n,a,Mt,o),et=n.memoizedState),(F=Ra||S0(n,a,F,o,at,et,M))?(dt||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=et),f.props=o,f.state=et,f.context=M,o=F):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{f=n.stateNode,ff(e,n),M=n.memoizedProps,dt=Ms(a,M),f.props=dt,Mt=n.pendingProps,at=f.context,et=a.contextType,F=Ks,typeof et=="object"&&et!==null&&(F=bn(et)),R=a.getDerivedStateFromProps,(et=typeof R=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(M!==Mt||at!==F)&&M0(n,f,o,F),Ra=!1,at=n.memoizedState,f.state=at,xo(n,o,f,u),yo();var ot=n.memoizedState;M!==Mt||at!==ot||Ra||e!==null&&e.dependencies!==null&&Cl(e.dependencies)?(typeof R=="function"&&(Uf(n,a,R,o),ot=n.memoizedState),(dt=Ra||S0(n,a,dt,o,at,ot,F)||e!==null&&e.dependencies!==null&&Cl(e.dependencies))?(et||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(o,ot,F),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(o,ot,F)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||M===e.memoizedProps&&at===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||M===e.memoizedProps&&at===e.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=ot),f.props=o,f.state=ot,f.context=F,o=dt):(typeof f.componentDidUpdate!="function"||M===e.memoizedProps&&at===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||M===e.memoizedProps&&at===e.memoizedState||(n.flags|=1024),o=!1)}return f=o,ql(e,n),o=(n.flags&128)!==0,f||o?(f=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,e!==null&&o?(n.child=vs(n,e.child,null,u),n.child=vs(n,null,a,u)):Cn(e,n,a,u),n.memoizedState=f.state,e=n.child):e=$i(e,n,u),e}function P0(e,n,a,o){return hs(),n.flags|=256,Cn(e,n,a,o),n.child}var zf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Hf(e){return{baseLanes:e,cachePool:xm()}}function Gf(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=ai),e}function I0(e,n,a){var o=n.pendingProps,u=!1,f=(n.flags&128)!==0,M;if((M=f)||(M=e!==null&&e.memoizedState===null?!1:(nn.current&2)!==0),M&&(u=!0,n.flags&=-129),M=(n.flags&32)!==0,n.flags&=-33,e===null){if(xe){if(u?Oa(n):La(),(e=qe)?(e=Xg(e,pi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Ea!==null?{id:Ui,overflow:Pi}:null,retryLane:536870912,hydrationErrors:null},a=mm(e),a.return=n,n.child=a,Rn=n,qe=null)):e=null,e===null)throw xa(n);return yh(e)?n.lanes=32:n.lanes=536870912,null}var R=o.children;return o=o.fallback,u?(La(),u=n.mode,R=Kl({mode:"hidden",children:R},u),o=fs(o,u,a,null),R.return=n,o.return=n,R.sibling=o,n.child=R,o=n.child,o.memoizedState=Hf(a),o.childLanes=Gf(e,M,a),n.memoizedState=zf,Oo(null,o)):(Oa(n),Vf(n,R))}var F=e.memoizedState;if(F!==null&&(R=F.dehydrated,R!==null)){if(f)n.flags&256?(Oa(n),n.flags&=-257,n=kf(e,n,a)):n.memoizedState!==null?(La(),n.child=e.child,n.flags|=128,n=null):(La(),R=o.fallback,u=n.mode,o=Kl({mode:"visible",children:o.children},u),R=fs(R,u,a,null),R.flags|=2,o.return=n,R.return=n,o.sibling=R,n.child=o,vs(n,e.child,null,a),o=n.child,o.memoizedState=Hf(a),o.childLanes=Gf(e,M,a),n.memoizedState=zf,n=Oo(null,o));else if(Oa(n),yh(R)){if(M=R.nextSibling&&R.nextSibling.dataset,M)var et=M.dgst;M=et,o=Error(s(419)),o.stack="",o.digest=M,_o({value:o,source:null,stack:null}),n=kf(e,n,a)}else if(ln||Js(e,n,a,!1),M=(a&e.childLanes)!==0,ln||M){if(M=Ye,M!==null&&(o=Ni(M,a),o!==0&&o!==F.retryLane))throw F.retryLane=o,us(e,o),jn(M,e,o),Bf;Eh(R)||ic(),n=kf(e,n,a)}else Eh(R)?(n.flags|=192,n.child=e.child,n=null):(e=F.treeContext,qe=gi(R.nextSibling),Rn=n,xe=!0,ya=null,pi=!1,e!==null&&vm(n,e),n=Vf(n,o.children),n.flags|=4096);return n}return u?(La(),R=o.fallback,u=n.mode,F=e.child,et=F.sibling,o=qi(F,{mode:"hidden",children:o.children}),o.subtreeFlags=F.subtreeFlags&65011712,et!==null?R=qi(et,R):(R=fs(R,u,a,null),R.flags|=2),R.return=n,o.return=n,o.sibling=R,n.child=o,Oo(null,o),o=n.child,R=e.child.memoizedState,R===null?R=Hf(a):(u=R.cachePool,u!==null?(F=rn._currentValue,u=u.parent!==F?{parent:F,pool:F}:u):u=xm(),R={baseLanes:R.baseLanes|a,cachePool:u}),o.memoizedState=R,o.childLanes=Gf(e,M,a),n.memoizedState=zf,Oo(e.child,o)):(Oa(n),a=e.child,e=a.sibling,a=qi(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,e!==null&&(M=n.deletions,M===null?(n.deletions=[e],n.flags|=16):M.push(e)),n.child=a,n.memoizedState=null,a)}function Vf(e,n){return n=Kl({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Kl(e,n){return e=ti(22,e,null,n),e.lanes=0,e}function kf(e,n,a){return vs(n,e.child,null,a),e=Vf(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function B0(e,n,a){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n),af(e.return,n,a)}function Xf(e,n,a,o,u,f){var M=e.memoizedState;M===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:f}:(M.isBackwards=n,M.rendering=null,M.renderingStartTime=0,M.last=o,M.tail=a,M.tailMode=u,M.treeForkCount=f)}function F0(e,n,a){var o=n.pendingProps,u=o.revealOrder,f=o.tail;o=o.children;var M=nn.current,R=(M&2)!==0;if(R?(M=M&1|2,n.flags|=128):M&=1,ht(nn,M),Cn(e,n,o,a),o=xe?go:0,!R&&e!==null&&(e.flags&128)!==0)t:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&B0(e,a,n);else if(e.tag===19)B0(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break t;for(;e.sibling===null;){if(e.return===null||e.return===n)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)e=a.alternate,e!==null&&Il(e)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),Xf(n,!1,u,a,f,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(e=u.alternate,e!==null&&Il(e)===null){n.child=u;break}e=u.sibling,u.sibling=a,a=u,u=e}Xf(n,!0,a,null,f,o);break;case"together":Xf(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function $i(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),Na|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(Js(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(s(153));if(n.child!==null){for(e=n.child,a=qi(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=qi(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function Yf(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&Cl(e)))}function HS(e,n,a){switch(n.tag){case 3:Vt(n,n.stateNode.containerInfo),Ta(n,rn,e.memoizedState.cache),hs();break;case 27:case 5:te(n);break;case 4:Vt(n,n.stateNode.containerInfo);break;case 10:Ta(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,gf(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(Oa(n),n.flags|=128,null):(a&n.child.childLanes)!==0?I0(e,n,a):(Oa(n),e=$i(e,n,a),e!==null?e.sibling:null);Oa(n);break;case 19:var u=(e.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(Js(e,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return F0(e,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),ht(nn,nn.current),o)break;return null;case 22:return n.lanes=0,L0(e,n,a,n.pendingProps);case 24:Ta(n,rn,e.memoizedState.cache)}return $i(e,n,a)}function z0(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)ln=!0;else{if(!Yf(e,a)&&(n.flags&128)===0)return ln=!1,HS(e,n,a);ln=(e.flags&131072)!==0}else ln=!1,xe&&(n.flags&1048576)!==0&&_m(n,go,n.index);switch(n.lanes=0,n.tag){case 16:t:{var o=n.pendingProps;if(e=gs(n.elementType),n.type=e,typeof e=="function")ju(e)?(o=Ms(e,o),n.tag=1,n=U0(null,n,e,o,a)):(n.tag=0,n=Ff(null,n,e,o,a));else{if(e!=null){var u=e.$$typeof;if(u===O){n.tag=11,n=b0(null,n,e,o,a);break t}else if(u===P){n.tag=14,n=C0(null,n,e,o,a);break t}}throw n=ct(e)||e,Error(s(306,n,""))}}return n;case 0:return Ff(e,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=Ms(o,n.pendingProps),U0(e,n,o,u,a);case 3:t:{if(Vt(n,n.stateNode.containerInfo),e===null)throw Error(s(387));o=n.pendingProps;var f=n.memoizedState;u=f.element,ff(e,n),xo(n,o,null,a);var M=n.memoizedState;if(o=M.cache,Ta(n,rn,o),o!==f.cache&&sf(n,[rn],a,!0),yo(),o=M.element,f.isDehydrated)if(f={element:o,isDehydrated:!1,cache:M.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=P0(e,n,o,a);break t}else if(o!==u){u=fi(Error(s(424)),n),_o(u),n=P0(e,n,o,a);break t}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(qe=gi(e.firstChild),Rn=n,xe=!0,ya=null,pi=!0,a=Lm(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(hs(),o===u){n=$i(e,n,a);break t}Cn(e,n,o,a)}n=n.child}return n;case 26:return ql(e,n),e===null?(a=Zg(n.type,null,n.pendingProps,null))?n.memoizedState=a:xe||(a=n.type,e=n.pendingProps,o=uc(yt.current).createElement(a),o[Qe]=n,o[xn]=e,On(o,a,e),W(o),n.stateNode=o):n.memoizedState=Zg(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return te(n),e===null&&xe&&(o=n.stateNode=qg(n.type,n.pendingProps,yt.current),Rn=n,pi=!0,u=qe,Fa(n.type)?(xh=u,qe=gi(o.firstChild)):qe=u),Cn(e,n,n.pendingProps.children,a),ql(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&xe&&((u=o=qe)&&(o=gM(o,n.type,n.pendingProps,pi),o!==null?(n.stateNode=o,Rn=n,qe=gi(o.firstChild),pi=!1,u=!0):u=!1),u||xa(n)),te(n),u=n.type,f=n.pendingProps,M=e!==null?e.memoizedProps:null,o=f.children,Sh(u,f)?o=null:M!==null&&Sh(u,M)&&(n.flags|=32),n.memoizedState!==null&&(u=vf(e,n,wS,null,null,a),Xo._currentValue=u),ql(e,n),Cn(e,n,o,a),n.child;case 6:return e===null&&xe&&((e=a=qe)&&(a=_M(a,n.pendingProps,pi),a!==null?(n.stateNode=a,Rn=n,qe=null,e=!0):e=!1),e||xa(n)),null;case 13:return I0(e,n,a);case 4:return Vt(n,n.stateNode.containerInfo),o=n.pendingProps,e===null?n.child=vs(n,null,o,a):Cn(e,n,o,a),n.child;case 11:return b0(e,n,n.type,n.pendingProps,a);case 7:return Cn(e,n,n.pendingProps,a),n.child;case 8:return Cn(e,n,n.pendingProps.children,a),n.child;case 12:return Cn(e,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,Ta(n,n.type,o.value),Cn(e,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,ps(n),u=bn(u),o=o(u),n.flags|=1,Cn(e,n,o,a),n.child;case 14:return C0(e,n,n.type,n.pendingProps,a);case 15:return O0(e,n,n.type,n.pendingProps,a);case 19:return F0(e,n,a);case 31:return zS(e,n,a);case 22:return L0(e,n,a,n.pendingProps);case 24:return ps(n),o=bn(rn),e===null?(u=lf(),u===null&&(u=Ye,f=rf(),u.pooledCache=f,f.refCount++,f!==null&&(u.pooledCacheLanes|=a),u=f),n.memoizedState={parent:o,cache:u},uf(n),Ta(n,rn,u)):((e.lanes&a)!==0&&(ff(e,n),xo(n,null,null,a),yo()),u=e.memoizedState,f=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Ta(n,rn,o)):(o=f.cache,Ta(n,rn,o),o!==u.cache&&sf(n,[rn],a,!0))),Cn(e,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function ta(e){e.flags|=4}function Wf(e,n,a,o,u){if((n=(e.mode&32)!==0)&&(n=!1),n){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(hg())e.flags|=8192;else throw _s=Dl,cf}else e.flags&=-16777217}function H0(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!e_(n))if(hg())e.flags|=8192;else throw _s=Dl,cf}function jl(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?fn():536870912,e.lanes|=n,ur|=n)}function Lo(e,n){if(!xe)switch(e.tailMode){case"hidden":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ke(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,o=0;if(n)for(var u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=o,e.childLanes=a,n}function GS(e,n,a){var o=n.pendingProps;switch($u(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(n),null;case 1:return Ke(n),null;case 3:return a=n.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),Zi(rn),Ht(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Qs(n)?ta(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,ef())),Ke(n),null;case 26:var u=n.type,f=n.memoizedState;return e===null?(ta(n),f!==null?(Ke(n),H0(n,f)):(Ke(n),Wf(n,u,null,o,a))):f?f!==e.memoizedState?(ta(n),Ke(n),H0(n,f)):(Ke(n),n.flags&=-16777217):(e=e.memoizedProps,e!==o&&ta(n),Ke(n),Wf(n,u,e,o,a)),null;case 27:if(Ce(n),a=yt.current,u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&ta(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}e=Y.current,Qs(n)?Sm(n):(e=qg(u,o,a),n.stateNode=e,ta(n))}return Ke(n),null;case 5:if(Ce(n),u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&ta(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ke(n),null}if(f=Y.current,Qs(n))Sm(n);else{var M=uc(yt.current);switch(f){case 1:f=M.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:f=M.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":f=M.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":f=M.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":f=M.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof o.is=="string"?M.createElement("select",{is:o.is}):M.createElement("select"),o.multiple?f.multiple=!0:o.size&&(f.size=o.size);break;default:f=typeof o.is=="string"?M.createElement(u,{is:o.is}):M.createElement(u)}}f[Qe]=n,f[xn]=o;t:for(M=n.child;M!==null;){if(M.tag===5||M.tag===6)f.appendChild(M.stateNode);else if(M.tag!==4&&M.tag!==27&&M.child!==null){M.child.return=M,M=M.child;continue}if(M===n)break t;for(;M.sibling===null;){if(M.return===null||M.return===n)break t;M=M.return}M.sibling.return=M.return,M=M.sibling}n.stateNode=f;t:switch(On(f,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break t;case"img":o=!0;break t;default:o=!1}o&&ta(n)}}return Ke(n),Wf(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==o&&ta(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(e=yt.current,Qs(n)){if(e=n.stateNode,a=n.memoizedProps,o=null,u=Rn,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}e[Qe]=n,e=!!(e.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||Ig(e.nodeValue,a)),e||xa(n,!0)}else e=uc(e).createTextNode(o),e[Qe]=n,n.stateNode=e}return Ke(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(o=Qs(n),a!==null){if(e===null){if(!o)throw Error(s(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(557));e[Qe]=n}else hs(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),e=!1}else a=ef(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(ni(n),n):(ni(n),null);if((n.flags&128)!==0)throw Error(s(558))}return Ke(n),null;case 13:if(o=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=Qs(n),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[Qe]=n}else hs(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ke(n),u=!1}else u=ef(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(ni(n),n):(ni(n),null)}return ni(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,e=e!==null&&e.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),f=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(f=o.memoizedState.cachePool.pool),f!==u&&(o.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),jl(n,n.updateQueue),Ke(n),null);case 4:return Ht(),e===null&&ph(n.stateNode.containerInfo),Ke(n),null;case 10:return Zi(n.type),Ke(n),null;case 19:if(J(nn),o=n.memoizedState,o===null)return Ke(n),null;if(u=(n.flags&128)!==0,f=o.rendering,f===null)if(u)Lo(o,!1);else{if(tn!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(f=Il(e),f!==null){for(n.flags|=128,Lo(o,!1),e=f.updateQueue,n.updateQueue=e,jl(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)pm(a,e),a=a.sibling;return ht(nn,nn.current&1|2),xe&&Ki(n,o.treeForkCount),n.child}e=e.sibling}o.tail!==null&&mt()>tc&&(n.flags|=128,u=!0,Lo(o,!1),n.lanes=4194304)}else{if(!u)if(e=Il(f),e!==null){if(n.flags|=128,u=!0,e=e.updateQueue,n.updateQueue=e,jl(n,e),Lo(o,!0),o.tail===null&&o.tailMode==="hidden"&&!f.alternate&&!xe)return Ke(n),null}else 2*mt()-o.renderingStartTime>tc&&a!==536870912&&(n.flags|=128,u=!0,Lo(o,!1),n.lanes=4194304);o.isBackwards?(f.sibling=n.child,n.child=f):(e=o.last,e!==null?e.sibling=f:n.child=f,o.last=f)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=mt(),e.sibling=null,a=nn.current,ht(nn,u?a&1|2:a&1),xe&&Ki(n,o.treeForkCount),e):(Ke(n),null);case 22:case 23:return ni(n),mf(),o=n.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Ke(n),n.subtreeFlags&6&&(n.flags|=8192)):Ke(n),a=n.updateQueue,a!==null&&jl(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),e!==null&&J(ms),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Zi(rn),Ke(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function VS(e,n){switch($u(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Zi(rn),Ht(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return Ce(n),null;case 31:if(n.memoizedState!==null){if(ni(n),n.alternate===null)throw Error(s(340));hs()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(ni(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(s(340));hs()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return J(nn),null;case 4:return Ht(),null;case 10:return Zi(n.type),null;case 22:case 23:return ni(n),mf(),e!==null&&J(ms),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Zi(rn),null;case 25:return null;default:return null}}function G0(e,n){switch($u(n),n.tag){case 3:Zi(rn),Ht();break;case 26:case 27:case 5:Ce(n);break;case 4:Ht();break;case 31:n.memoizedState!==null&&ni(n);break;case 13:ni(n);break;case 19:J(nn);break;case 10:Zi(n.type);break;case 22:case 23:ni(n),mf(),e!==null&&J(ms);break;case 24:Zi(rn)}}function wo(e,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&e)===e){o=void 0;var f=a.create,M=a.inst;o=f(),M.destroy=o}a=a.next}while(a!==u)}}catch(R){Ie(n,n.return,R)}}function wa(e,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var f=u.next;o=f;do{if((o.tag&e)===e){var M=o.inst,R=M.destroy;if(R!==void 0){M.destroy=void 0,u=n;var F=a,et=R;try{et()}catch(dt){Ie(u,F,dt)}}}o=o.next}while(o!==f)}}catch(dt){Ie(n,n.return,dt)}}function V0(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{Dm(n,a)}catch(o){Ie(e,e.return,o)}}}function k0(e,n,a){a.props=Ms(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(o){Ie(e,n,o)}}function Do(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:o=e.stateNode;break;default:o=e.stateNode}typeof a=="function"?e.refCleanup=a(o):a.current=o}}catch(u){Ie(e,n,u)}}function Ii(e,n){var a=e.ref,o=e.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){Ie(e,n,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Ie(e,n,u)}else a.current=null}function X0(e){var n=e.type,a=e.memoizedProps,o=e.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break t;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){Ie(e,e.return,u)}}function qf(e,n,a){try{var o=e.stateNode;uM(o,e.type,a,n),o[xn]=n}catch(u){Ie(e,e.return,u)}}function Y0(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Fa(e.type)||e.tag===4}function Kf(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||Y0(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Fa(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function jf(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(e),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Yi));else if(o!==4&&(o===27&&Fa(e.type)&&(a=e.stateNode,n=null),e=e.child,e!==null))for(jf(e,n,a),e=e.sibling;e!==null;)jf(e,n,a),e=e.sibling}function Zl(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?a.insertBefore(e,n):a.appendChild(e);else if(o!==4&&(o===27&&Fa(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Zl(e,n,a),e=e.sibling;e!==null;)Zl(e,n,a),e=e.sibling}function W0(e){var n=e.stateNode,a=e.memoizedProps;try{for(var o=e.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);On(n,o,a),n[Qe]=e,n[xn]=a}catch(f){Ie(e,e.return,f)}}var ea=!1,cn=!1,Zf=!1,q0=typeof WeakSet=="function"?WeakSet:Set,vn=null;function kS(e,n){if(e=e.containerInfo,_h=_c,e=sm(e),Vu(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else t:{a=(a=e.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,f=o.focusNode;o=o.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break t}var M=0,R=-1,F=-1,et=0,dt=0,Mt=e,at=null;e:for(;;){for(var ot;Mt!==a||u!==0&&Mt.nodeType!==3||(R=M+u),Mt!==f||o!==0&&Mt.nodeType!==3||(F=M+o),Mt.nodeType===3&&(M+=Mt.nodeValue.length),(ot=Mt.firstChild)!==null;)at=Mt,Mt=ot;for(;;){if(Mt===e)break e;if(at===a&&++et===u&&(R=M),at===f&&++dt===o&&(F=M),(ot=Mt.nextSibling)!==null)break;Mt=at,at=Mt.parentNode}Mt=ot}a=R===-1||F===-1?null:{start:R,end:F}}else a=null}a=a||{start:0,end:0}}else a=null;for(vh={focusedElem:e,selectionRange:a},_c=!1,vn=n;vn!==null;)if(n=vn,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,vn=e;else for(;vn!==null;){switch(n=vn,f=n.alternate,e=n.flags,n.tag){case 0:if((e&4)!==0&&(e=n.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)u=e[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&f!==null){e=void 0,a=n,u=f.memoizedProps,f=f.memoizedState,o=a.stateNode;try{var Yt=Ms(a.type,u);e=o.getSnapshotBeforeUpdate(Yt,f),o.__reactInternalSnapshotBeforeUpdate=e}catch($t){Ie(a,a.return,$t)}}break;case 3:if((e&1024)!==0){if(e=n.stateNode.containerInfo,a=e.nodeType,a===9)Ah(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Ah(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(s(163))}if(e=n.sibling,e!==null){e.return=n.return,vn=e;break}vn=n.return}}function K0(e,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:ia(e,a),o&4&&wo(5,a);break;case 1:if(ia(e,a),o&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(M){Ie(a,a.return,M)}else{var u=Ms(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(u,n,e.__reactInternalSnapshotBeforeUpdate)}catch(M){Ie(a,a.return,M)}}o&64&&V0(a),o&512&&Do(a,a.return);break;case 3:if(ia(e,a),o&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Dm(e,n)}catch(M){Ie(a,a.return,M)}}break;case 27:n===null&&o&4&&W0(a);case 26:case 5:ia(e,a),n===null&&o&4&&X0(a),o&512&&Do(a,a.return);break;case 12:ia(e,a);break;case 31:ia(e,a),o&4&&Q0(e,a);break;case 13:ia(e,a),o&4&&J0(e,a),o&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=JS.bind(null,a),vM(e,a))));break;case 22:if(o=a.memoizedState!==null||ea,!o){n=n!==null&&n.memoizedState!==null||cn,u=ea;var f=cn;ea=o,(cn=n)&&!f?aa(e,a,(a.subtreeFlags&8772)!==0):ia(e,a),ea=u,cn=f}break;case 30:break;default:ia(e,a)}}function j0(e){var n=e.alternate;n!==null&&(e.alternate=null,j0(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&so(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ze=null,Yn=!1;function na(e,n,a){for(a=a.child;a!==null;)Z0(e,n,a),a=a.sibling}function Z0(e,n,a){if(Kt&&typeof Kt.onCommitFiberUnmount=="function")try{Kt.onCommitFiberUnmount(jt,a)}catch{}switch(a.tag){case 26:cn||Ii(a,n),na(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:cn||Ii(a,n);var o=Ze,u=Yn;Fa(a.type)&&(Ze=a.stateNode,Yn=!1),na(e,n,a),Go(a.stateNode),Ze=o,Yn=u;break;case 5:cn||Ii(a,n);case 6:if(o=Ze,u=Yn,Ze=null,na(e,n,a),Ze=o,Yn=u,Ze!==null)if(Yn)try{(Ze.nodeType===9?Ze.body:Ze.nodeName==="HTML"?Ze.ownerDocument.body:Ze).removeChild(a.stateNode)}catch(f){Ie(a,n,f)}else try{Ze.removeChild(a.stateNode)}catch(f){Ie(a,n,f)}break;case 18:Ze!==null&&(Yn?(e=Ze,Vg(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),vr(e)):Vg(Ze,a.stateNode));break;case 4:o=Ze,u=Yn,Ze=a.stateNode.containerInfo,Yn=!0,na(e,n,a),Ze=o,Yn=u;break;case 0:case 11:case 14:case 15:wa(2,a,n),cn||wa(4,a,n),na(e,n,a);break;case 1:cn||(Ii(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&k0(a,n,o)),na(e,n,a);break;case 21:na(e,n,a);break;case 22:cn=(o=cn)||a.memoizedState!==null,na(e,n,a),cn=o;break;default:na(e,n,a)}}function Q0(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{vr(e)}catch(a){Ie(n,n.return,a)}}}function J0(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{vr(e)}catch(a){Ie(n,n.return,a)}}function XS(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new q0),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new q0),n;default:throw Error(s(435,e.tag))}}function Ql(e,n){var a=XS(e);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=$S.bind(null,e,o);o.then(u,u)}})}function Wn(e,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],f=e,M=n,R=M;t:for(;R!==null;){switch(R.tag){case 27:if(Fa(R.type)){Ze=R.stateNode,Yn=!1;break t}break;case 5:Ze=R.stateNode,Yn=!1;break t;case 3:case 4:Ze=R.stateNode.containerInfo,Yn=!0;break t}R=R.return}if(Ze===null)throw Error(s(160));Z0(f,M,u),Ze=null,Yn=!1,f=u.alternate,f!==null&&(f.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)$0(n,e),n=n.sibling}var Ti=null;function $0(e,n){var a=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Wn(n,e),qn(e),o&4&&(wa(3,e,e.return),wo(3,e),wa(5,e,e.return));break;case 1:Wn(n,e),qn(e),o&512&&(cn||a===null||Ii(a,a.return)),o&64&&ea&&(e=e.updateQueue,e!==null&&(o=e.callbacks,o!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=Ti;if(Wn(n,e),qn(e),o&512&&(cn||a===null||Ii(a,a.return)),o&4){var f=a!==null?a.memoizedState:null;if(o=e.memoizedState,a===null)if(o===null)if(e.stateNode===null){t:{o=e.type,a=e.memoizedProps,u=u.ownerDocument||u;e:switch(o){case"title":f=u.getElementsByTagName("title")[0],(!f||f[rs]||f[Qe]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=u.createElement(o),u.head.insertBefore(f,u.querySelector("head > title"))),On(f,o,a),f[Qe]=e,W(f),o=f;break t;case"link":var M=$g("link","href",u).get(o+(a.href||""));if(M){for(var R=0;R<M.length;R++)if(f=M[R],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){M.splice(R,1);break e}}f=u.createElement(o),On(f,o,a),u.head.appendChild(f);break;case"meta":if(M=$g("meta","content",u).get(o+(a.content||""))){for(R=0;R<M.length;R++)if(f=M[R],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){M.splice(R,1);break e}}f=u.createElement(o),On(f,o,a),u.head.appendChild(f);break;default:throw Error(s(468,o))}f[Qe]=e,W(f),o=f}e.stateNode=o}else t_(u,e.type,e.stateNode);else e.stateNode=Jg(u,o,e.memoizedProps);else f!==o?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,o===null?t_(u,e.type,e.stateNode):Jg(u,o,e.memoizedProps)):o===null&&e.stateNode!==null&&qf(e,e.memoizedProps,a.memoizedProps)}break;case 27:Wn(n,e),qn(e),o&512&&(cn||a===null||Ii(a,a.return)),a!==null&&o&4&&qf(e,e.memoizedProps,a.memoizedProps);break;case 5:if(Wn(n,e),qn(e),o&512&&(cn||a===null||Ii(a,a.return)),e.flags&32){u=e.stateNode;try{kn(u,"")}catch(Yt){Ie(e,e.return,Yt)}}o&4&&e.stateNode!=null&&(u=e.memoizedProps,qf(e,u,a!==null?a.memoizedProps:u)),o&1024&&(Zf=!0);break;case 6:if(Wn(n,e),qn(e),o&4){if(e.stateNode===null)throw Error(s(162));o=e.memoizedProps,a=e.stateNode;try{a.nodeValue=o}catch(Yt){Ie(e,e.return,Yt)}}break;case 3:if(dc=null,u=Ti,Ti=fc(n.containerInfo),Wn(n,e),Ti=u,qn(e),o&4&&a!==null&&a.memoizedState.isDehydrated)try{vr(n.containerInfo)}catch(Yt){Ie(e,e.return,Yt)}Zf&&(Zf=!1,tg(e));break;case 4:o=Ti,Ti=fc(e.stateNode.containerInfo),Wn(n,e),qn(e),Ti=o;break;case 12:Wn(n,e),qn(e);break;case 31:Wn(n,e),qn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Ql(e,o)));break;case 13:Wn(n,e),qn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&($l=mt()),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Ql(e,o)));break;case 22:u=e.memoizedState!==null;var F=a!==null&&a.memoizedState!==null,et=ea,dt=cn;if(ea=et||u,cn=dt||F,Wn(n,e),cn=dt,ea=et,qn(e),o&8192)t:for(n=e.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||F||ea||cn||As(e)),a=null,n=e;;){if(n.tag===5||n.tag===26){if(a===null){F=a=n;try{if(f=F.stateNode,u)M=f.style,typeof M.setProperty=="function"?M.setProperty("display","none","important"):M.display="none";else{R=F.stateNode;var Mt=F.memoizedProps.style,at=Mt!=null&&Mt.hasOwnProperty("display")?Mt.display:null;R.style.display=at==null||typeof at=="boolean"?"":(""+at).trim()}}catch(Yt){Ie(F,F.return,Yt)}}}else if(n.tag===6){if(a===null){F=n;try{F.stateNode.nodeValue=u?"":F.memoizedProps}catch(Yt){Ie(F,F.return,Yt)}}}else if(n.tag===18){if(a===null){F=n;try{var ot=F.stateNode;u?kg(ot,!0):kg(F.stateNode,!1)}catch(Yt){Ie(F,F.return,Yt)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===e)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break t;for(;n.sibling===null;){if(n.return===null||n.return===e)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=e.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,Ql(e,a))));break;case 19:Wn(n,e),qn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,Ql(e,o)));break;case 30:break;case 21:break;default:Wn(n,e),qn(e)}}function qn(e){var n=e.flags;if(n&2){try{for(var a,o=e.return;o!==null;){if(Y0(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,f=Kf(e);Zl(e,f,u);break;case 5:var M=a.stateNode;a.flags&32&&(kn(M,""),a.flags&=-33);var R=Kf(e);Zl(e,R,M);break;case 3:case 4:var F=a.stateNode.containerInfo,et=Kf(e);jf(e,et,F);break;default:throw Error(s(161))}}catch(dt){Ie(e,e.return,dt)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function tg(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;tg(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),e=e.sibling}}function ia(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)K0(e,n.alternate,n),n=n.sibling}function As(e){for(e=e.child;e!==null;){var n=e;switch(n.tag){case 0:case 11:case 14:case 15:wa(4,n,n.return),As(n);break;case 1:Ii(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&k0(n,n.return,a),As(n);break;case 27:Go(n.stateNode);case 26:case 5:Ii(n,n.return),As(n);break;case 22:n.memoizedState===null&&As(n);break;case 30:As(n);break;default:As(n)}e=e.sibling}}function aa(e,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=e,f=n,M=f.flags;switch(f.tag){case 0:case 11:case 15:aa(u,f,a),wo(4,f);break;case 1:if(aa(u,f,a),o=f,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(et){Ie(o,o.return,et)}if(o=f,u=o.updateQueue,u!==null){var R=o.stateNode;try{var F=u.shared.hiddenCallbacks;if(F!==null)for(u.shared.hiddenCallbacks=null,u=0;u<F.length;u++)wm(F[u],R)}catch(et){Ie(o,o.return,et)}}a&&M&64&&V0(f),Do(f,f.return);break;case 27:W0(f);case 26:case 5:aa(u,f,a),a&&o===null&&M&4&&X0(f),Do(f,f.return);break;case 12:aa(u,f,a);break;case 31:aa(u,f,a),a&&M&4&&Q0(u,f);break;case 13:aa(u,f,a),a&&M&4&&J0(u,f);break;case 22:f.memoizedState===null&&aa(u,f,a),Do(f,f.return);break;case 30:break;default:aa(u,f,a)}n=n.sibling}}function Qf(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&vo(a))}function Jf(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&vo(e))}function Ri(e,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)eg(e,n,a,o),n=n.sibling}function eg(e,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:Ri(e,n,a,o),u&2048&&wo(9,n);break;case 1:Ri(e,n,a,o);break;case 3:Ri(e,n,a,o),u&2048&&(e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&vo(e)));break;case 12:if(u&2048){Ri(e,n,a,o),e=n.stateNode;try{var f=n.memoizedProps,M=f.id,R=f.onPostCommit;typeof R=="function"&&R(M,n.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(F){Ie(n,n.return,F)}}else Ri(e,n,a,o);break;case 31:Ri(e,n,a,o);break;case 13:Ri(e,n,a,o);break;case 23:break;case 22:f=n.stateNode,M=n.alternate,n.memoizedState!==null?f._visibility&2?Ri(e,n,a,o):No(e,n):f._visibility&2?Ri(e,n,a,o):(f._visibility|=2,or(e,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&Qf(M,n);break;case 24:Ri(e,n,a,o),u&2048&&Jf(n.alternate,n);break;default:Ri(e,n,a,o)}}function or(e,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=e,M=n,R=a,F=o,et=M.flags;switch(M.tag){case 0:case 11:case 15:or(f,M,R,F,u),wo(8,M);break;case 23:break;case 22:var dt=M.stateNode;M.memoizedState!==null?dt._visibility&2?or(f,M,R,F,u):No(f,M):(dt._visibility|=2,or(f,M,R,F,u)),u&&et&2048&&Qf(M.alternate,M);break;case 24:or(f,M,R,F,u),u&&et&2048&&Jf(M.alternate,M);break;default:or(f,M,R,F,u)}n=n.sibling}}function No(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,o=n,u=o.flags;switch(o.tag){case 22:No(a,o),u&2048&&Qf(o.alternate,o);break;case 24:No(a,o),u&2048&&Jf(o.alternate,o);break;default:No(a,o)}n=n.sibling}}var Uo=8192;function lr(e,n,a){if(e.subtreeFlags&Uo)for(e=e.child;e!==null;)ng(e,n,a),e=e.sibling}function ng(e,n,a){switch(e.tag){case 26:lr(e,n,a),e.flags&Uo&&e.memoizedState!==null&&LM(a,Ti,e.memoizedState,e.memoizedProps);break;case 5:lr(e,n,a);break;case 3:case 4:var o=Ti;Ti=fc(e.stateNode.containerInfo),lr(e,n,a),Ti=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=Uo,Uo=16777216,lr(e,n,a),Uo=o):lr(e,n,a));break;default:lr(e,n,a)}}function ig(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function Po(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];vn=o,sg(o,e)}ig(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)ag(e),e=e.sibling}function ag(e){switch(e.tag){case 0:case 11:case 15:Po(e),e.flags&2048&&wa(9,e,e.return);break;case 3:Po(e);break;case 12:Po(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,Jl(e)):Po(e);break;default:Po(e)}}function Jl(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];vn=o,sg(o,e)}ig(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:wa(8,n,n.return),Jl(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Jl(n));break;default:Jl(n)}e=e.sibling}}function sg(e,n){for(;vn!==null;){var a=vn;switch(a.tag){case 0:case 11:case 15:wa(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:vo(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,vn=o;else t:for(a=e;vn!==null;){o=vn;var u=o.sibling,f=o.return;if(j0(o),o===a){vn=null;break t}if(u!==null){u.return=f,vn=u;break t}vn=f}}}var YS={getCacheForType:function(e){var n=bn(rn),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return bn(rn).controller.signal}},WS=typeof WeakMap=="function"?WeakMap:Map,Ne=0,Ye=null,_e=null,Me=0,Pe=0,ii=null,Da=!1,cr=!1,$f=!1,sa=0,tn=0,Na=0,Es=0,th=0,ai=0,ur=0,Io=null,Kn=null,eh=!1,$l=0,rg=0,tc=1/0,ec=null,Ua=null,dn=0,Pa=null,fr=null,ra=0,nh=0,ih=null,og=null,Bo=0,ah=null;function si(){return(Ne&2)!==0&&Me!==0?Me&-Me:I.T!==null?uh():io()}function lg(){if(ai===0)if((Me&536870912)===0||xe){var e=ut;ut<<=1,(ut&3932160)===0&&(ut=262144),ai=e}else ai=536870912;return e=ei.current,e!==null&&(e.flags|=32),ai}function jn(e,n,a){(e===Ye&&(Pe===2||Pe===9)||e.cancelPendingCommit!==null)&&(hr(e,0),Ia(e,Me,ai,!1)),yn(e,a),((Ne&2)===0||e!==Ye)&&(e===Ye&&((Ne&2)===0&&(Es|=a),tn===4&&Ia(e,Me,ai,!1)),Bi(e))}function cg(e,n,a){if((Ne&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&e.expiredLanes)===0||ne(e,n),u=o?jS(e,n):rh(e,n,!0),f=o;do{if(u===0){cr&&!o&&Ia(e,n,0,!1);break}else{if(a=e.current.alternate,f&&!qS(a)){u=rh(e,n,!1),f=!1;continue}if(u===2){if(f=n,e.errorRecoveryDisabledLanes&f)var M=0;else M=e.pendingLanes&-536870913,M=M!==0?M:M&536870912?536870912:0;if(M!==0){n=M;t:{var R=e;u=Io;var F=R.current.memoizedState.isDehydrated;if(F&&(hr(R,M).flags|=256),M=rh(R,M,!1),M!==2){if($f&&!F){R.errorRecoveryDisabledLanes|=f,Es|=f,u=4;break t}f=Kn,Kn=u,f!==null&&(Kn===null?Kn=f:Kn.push.apply(Kn,f))}u=M}if(f=!1,u!==2)continue}}if(u===1){hr(e,0),Ia(e,n,0,!0);break}t:{switch(o=e,f=u,f){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:Ia(o,n,ai,!Da);break t;case 2:Kn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=$l+300-mt(),10<u)){if(Ia(o,n,ai,!Da),Nt(o,0,!0)!==0)break t;ra=n,o.timeoutHandle=Hg(ug.bind(null,o,a,Kn,ec,eh,n,ai,Es,ur,Da,f,"Throttled",-0,0),u);break t}ug(o,a,Kn,ec,eh,n,ai,Es,ur,Da,f,null,-0,0)}}break}while(!0);Bi(e)}function ug(e,n,a,o,u,f,M,R,F,et,dt,Mt,at,ot){if(e.timeoutHandle=-1,Mt=n.subtreeFlags,Mt&8192||(Mt&16785408)===16785408){Mt={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Yi},ng(n,f,Mt);var Yt=(f&62914560)===f?$l-mt():(f&4194048)===f?rg-mt():0;if(Yt=wM(Mt,Yt),Yt!==null){ra=f,e.cancelPendingCommit=Yt(vg.bind(null,e,n,f,a,o,u,M,R,F,dt,Mt,null,at,ot)),Ia(e,f,M,!et);return}}vg(e,n,f,a,o,u,M,R,F)}function qS(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],f=u.getSnapshot;u=u.value;try{if(!$n(f(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Ia(e,n,a,o){n&=~th,n&=~Es,e.suspendedLanes|=n,e.pingedLanes&=~n,o&&(e.warmLanes|=n),o=e.expirationTimes;for(var u=n;0<u;){var f=31-ee(u),M=1<<f;o[f]=-1,u&=~M}a!==0&&eo(e,a,n)}function nc(){return(Ne&6)===0?(Fo(0),!1):!0}function sh(){if(_e!==null){if(Pe===0)var e=_e.return;else e=_e,ji=ds=null,Af(e),nr=null,Mo=0,e=_e;for(;e!==null;)G0(e.alternate,e),e=e.return;_e=null}}function hr(e,n){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,dM(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ra=0,sh(),Ye=e,_e=a=qi(e.current,null),Me=n,Pe=0,ii=null,Da=!1,cr=ne(e,n),$f=!1,ur=ai=th=Es=Na=tn=0,Kn=Io=null,eh=!1,(n&8)!==0&&(n|=n&32);var o=e.entangledLanes;if(o!==0)for(e=e.entanglements,o&=n;0<o;){var u=31-ee(o),f=1<<u;n|=e[u],o&=~f}return sa=n,yl(),a}function fg(e,n){ue=null,I.H=Co,n===er||n===wl?(n=bm(),Pe=3):n===cf?(n=bm(),Pe=4):Pe=n===Bf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,ii=n,_e===null&&(tn=1,Yl(e,fi(n,e.current)))}function hg(){var e=ei.current;return e===null?!0:(Me&4194048)===Me?mi===null:(Me&62914560)===Me||(Me&536870912)!==0?e===mi:!1}function dg(){var e=I.H;return I.H=Co,e===null?Co:e}function pg(){var e=I.A;return I.A=YS,e}function ic(){tn=4,Da||(Me&4194048)!==Me&&ei.current!==null||(cr=!0),(Na&134217727)===0&&(Es&134217727)===0||Ye===null||Ia(Ye,Me,ai,!1)}function rh(e,n,a){var o=Ne;Ne|=2;var u=dg(),f=pg();(Ye!==e||Me!==n)&&(ec=null,hr(e,n)),n=!1;var M=tn;t:do try{if(Pe!==0&&_e!==null){var R=_e,F=ii;switch(Pe){case 8:sh(),M=6;break t;case 3:case 2:case 9:case 6:ei.current===null&&(n=!0);var et=Pe;if(Pe=0,ii=null,dr(e,R,F,et),a&&cr){M=0;break t}break;default:et=Pe,Pe=0,ii=null,dr(e,R,F,et)}}KS(),M=tn;break}catch(dt){fg(e,dt)}while(!0);return n&&e.shellSuspendCounter++,ji=ds=null,Ne=o,I.H=u,I.A=f,_e===null&&(Ye=null,Me=0,yl()),M}function KS(){for(;_e!==null;)mg(_e)}function jS(e,n){var a=Ne;Ne|=2;var o=dg(),u=pg();Ye!==e||Me!==n?(ec=null,tc=mt()+500,hr(e,n)):cr=ne(e,n);t:do try{if(Pe!==0&&_e!==null){n=_e;var f=ii;e:switch(Pe){case 1:Pe=0,ii=null,dr(e,n,f,1);break;case 2:case 9:if(Tm(f)){Pe=0,ii=null,gg(n);break}n=function(){Pe!==2&&Pe!==9||Ye!==e||(Pe=7),Bi(e)},f.then(n,n);break t;case 3:Pe=7;break t;case 4:Pe=5;break t;case 7:Tm(f)?(Pe=0,ii=null,gg(n)):(Pe=0,ii=null,dr(e,n,f,7));break;case 5:var M=null;switch(_e.tag){case 26:M=_e.memoizedState;case 5:case 27:var R=_e;if(M?e_(M):R.stateNode.complete){Pe=0,ii=null;var F=R.sibling;if(F!==null)_e=F;else{var et=R.return;et!==null?(_e=et,ac(et)):_e=null}break e}}Pe=0,ii=null,dr(e,n,f,5);break;case 6:Pe=0,ii=null,dr(e,n,f,6);break;case 8:sh(),tn=6;break t;default:throw Error(s(462))}}ZS();break}catch(dt){fg(e,dt)}while(!0);return ji=ds=null,I.H=o,I.A=u,Ne=a,_e!==null?0:(Ye=null,Me=0,yl(),tn)}function ZS(){for(;_e!==null&&!x();)mg(_e)}function mg(e){var n=z0(e.alternate,e,sa);e.memoizedProps=e.pendingProps,n===null?ac(e):_e=n}function gg(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=N0(a,n,n.pendingProps,n.type,void 0,Me);break;case 11:n=N0(a,n,n.pendingProps,n.type.render,n.ref,Me);break;case 5:Af(n);default:G0(a,n),n=_e=pm(n,sa),n=z0(a,n,sa)}e.memoizedProps=e.pendingProps,n===null?ac(e):_e=n}function dr(e,n,a,o){ji=ds=null,Af(n),nr=null,Mo=0;var u=n.return;try{if(FS(e,u,n,a,Me)){tn=1,Yl(e,fi(a,e.current)),_e=null;return}}catch(f){if(u!==null)throw _e=u,f;tn=1,Yl(e,fi(a,e.current)),_e=null;return}n.flags&32768?(xe||o===1?e=!0:cr||(Me&536870912)!==0?e=!1:(Da=e=!0,(o===2||o===9||o===3||o===6)&&(o=ei.current,o!==null&&o.tag===13&&(o.flags|=16384))),_g(n,e)):ac(n)}function ac(e){var n=e;do{if((n.flags&32768)!==0){_g(n,Da);return}e=n.return;var a=GS(n.alternate,n,sa);if(a!==null){_e=a;return}if(n=n.sibling,n!==null){_e=n;return}_e=n=e}while(n!==null);tn===0&&(tn=5)}function _g(e,n){do{var a=VS(e.alternate,e);if(a!==null){a.flags&=32767,_e=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){_e=e;return}_e=e=a}while(e!==null);tn=6,_e=null}function vg(e,n,a,o,u,f,M,R,F){e.cancelPendingCommit=null;do sc();while(dn!==0);if((Ne&6)!==0)throw Error(s(327));if(n!==null){if(n===e.current)throw Error(s(177));if(f=n.lanes|n.childLanes,f|=qu,Ai(e,a,f,M,R,F),e===Ye&&(_e=Ye=null,Me=0),fr=n,Pa=e,ra=a,nh=f,ih=u,og=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,tM(wt,function(){return yg(),null})):(e.callbackNode=null,e.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=I.T,I.T=null,u=k.p,k.p=2,M=Ne,Ne|=4;try{kS(e,n,a)}finally{Ne=M,k.p=u,I.T=o}}dn=1,Sg(),Mg(),Ag()}}function Sg(){if(dn===1){dn=0;var e=Pa,n=fr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=I.T,I.T=null;var o=k.p;k.p=2;var u=Ne;Ne|=4;try{$0(n,e);var f=vh,M=sm(e.containerInfo),R=f.focusedElem,F=f.selectionRange;if(M!==R&&R&&R.ownerDocument&&am(R.ownerDocument.documentElement,R)){if(F!==null&&Vu(R)){var et=F.start,dt=F.end;if(dt===void 0&&(dt=et),"selectionStart"in R)R.selectionStart=et,R.selectionEnd=Math.min(dt,R.value.length);else{var Mt=R.ownerDocument||document,at=Mt&&Mt.defaultView||window;if(at.getSelection){var ot=at.getSelection(),Yt=R.textContent.length,$t=Math.min(F.start,Yt),Ve=F.end===void 0?$t:Math.min(F.end,Yt);!ot.extend&&$t>Ve&&(M=Ve,Ve=$t,$t=M);var Q=im(R,$t),X=im(R,Ve);if(Q&&X&&(ot.rangeCount!==1||ot.anchorNode!==Q.node||ot.anchorOffset!==Q.offset||ot.focusNode!==X.node||ot.focusOffset!==X.offset)){var tt=Mt.createRange();tt.setStart(Q.node,Q.offset),ot.removeAllRanges(),$t>Ve?(ot.addRange(tt),ot.extend(X.node,X.offset)):(tt.setEnd(X.node,X.offset),ot.addRange(tt))}}}}for(Mt=[],ot=R;ot=ot.parentNode;)ot.nodeType===1&&Mt.push({element:ot,left:ot.scrollLeft,top:ot.scrollTop});for(typeof R.focus=="function"&&R.focus(),R=0;R<Mt.length;R++){var gt=Mt[R];gt.element.scrollLeft=gt.left,gt.element.scrollTop=gt.top}}_c=!!_h,vh=_h=null}finally{Ne=u,k.p=o,I.T=a}}e.current=n,dn=2}}function Mg(){if(dn===2){dn=0;var e=Pa,n=fr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=I.T,I.T=null;var o=k.p;k.p=2;var u=Ne;Ne|=4;try{K0(e,n.alternate,n)}finally{Ne=u,k.p=o,I.T=a}}dn=3}}function Ag(){if(dn===4||dn===3){dn=0,it();var e=Pa,n=fr,a=ra,o=og;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?dn=5:(dn=0,fr=Pa=null,Eg(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(Ua=null),Hs(a),n=n.stateNode,Kt&&typeof Kt.onCommitFiberRoot=="function")try{Kt.onCommitFiberRoot(jt,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=I.T,u=k.p,k.p=2,I.T=null;try{for(var f=e.onRecoverableError,M=0;M<o.length;M++){var R=o[M];f(R.value,{componentStack:R.stack})}}finally{I.T=n,k.p=u}}(ra&3)!==0&&sc(),Bi(e),u=e.pendingLanes,(a&261930)!==0&&(u&42)!==0?e===ah?Bo++:(Bo=0,ah=e):Bo=0,Fo(0)}}function Eg(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,vo(n)))}function sc(){return Sg(),Mg(),Ag(),yg()}function yg(){if(dn!==5)return!1;var e=Pa,n=nh;nh=0;var a=Hs(ra),o=I.T,u=k.p;try{k.p=32>a?32:a,I.T=null,a=ih,ih=null;var f=Pa,M=ra;if(dn=0,fr=Pa=null,ra=0,(Ne&6)!==0)throw Error(s(331));var R=Ne;if(Ne|=4,ag(f.current),eg(f,f.current,M,a),Ne=R,Fo(0,!1),Kt&&typeof Kt.onPostCommitFiberRoot=="function")try{Kt.onPostCommitFiberRoot(jt,f)}catch{}return!0}finally{k.p=u,I.T=o,Eg(e,n)}}function xg(e,n,a){n=fi(a,n),n=If(e.stateNode,n,2),e=Ca(e,n,2),e!==null&&(yn(e,2),Bi(e))}function Ie(e,n,a){if(e.tag===3)xg(e,e,a);else for(;n!==null;){if(n.tag===3){xg(n,e,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Ua===null||!Ua.has(o))){e=fi(a,e),a=T0(2),o=Ca(n,a,2),o!==null&&(R0(a,o,n,e),yn(o,2),Bi(o));break}}n=n.return}}function oh(e,n,a){var o=e.pingCache;if(o===null){o=e.pingCache=new WS;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||($f=!0,u.add(a),e=QS.bind(null,e,n,a),n.then(e,e))}function QS(e,n,a){var o=e.pingCache;o!==null&&o.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Ye===e&&(Me&a)===a&&(tn===4||tn===3&&(Me&62914560)===Me&&300>mt()-$l?(Ne&2)===0&&hr(e,0):th|=a,ur===Me&&(ur=0)),Bi(e)}function Tg(e,n){n===0&&(n=fn()),e=us(e,n),e!==null&&(yn(e,n),Bi(e))}function JS(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),Tg(e,a)}function $S(e,n){var a=0;switch(e.tag){case 31:case 13:var o=e.stateNode,u=e.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),Tg(e,a)}function tM(e,n){return xt(e,n)}var rc=null,pr=null,lh=!1,oc=!1,ch=!1,Ba=0;function Bi(e){e!==pr&&e.next===null&&(pr===null?rc=pr=e:pr=pr.next=e),oc=!0,lh||(lh=!0,nM())}function Fo(e,n){if(!ch&&oc){ch=!0;do for(var a=!1,o=rc;o!==null;){if(e!==0){var u=o.pendingLanes;if(u===0)var f=0;else{var M=o.suspendedLanes,R=o.pingedLanes;f=(1<<31-ee(42|e)+1)-1,f&=u&~(M&~R),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Og(o,f))}else f=Me,f=Nt(o,o===Ye?f:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(f&3)===0||ne(o,f)||(a=!0,Og(o,f));o=o.next}while(a);ch=!1}}function eM(){Rg()}function Rg(){oc=lh=!1;var e=0;Ba!==0&&hM()&&(e=Ba);for(var n=mt(),a=null,o=rc;o!==null;){var u=o.next,f=bg(o,n);f===0?(o.next=null,a===null?rc=u:a.next=u,u===null&&(pr=a)):(a=o,(e!==0||(f&3)!==0)&&(oc=!0)),o=u}dn!==0&&dn!==5||Fo(e),Ba!==0&&(Ba=0)}function bg(e,n){for(var a=e.suspendedLanes,o=e.pingedLanes,u=e.expirationTimes,f=e.pendingLanes&-62914561;0<f;){var M=31-ee(f),R=1<<M,F=u[M];F===-1?((R&a)===0||(R&o)!==0)&&(u[M]=je(R,n)):F<=n&&(e.expiredLanes|=R),f&=~R}if(n=Ye,a=Me,a=Nt(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,a===0||e===n&&(Pe===2||Pe===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&w(o),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||ne(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(o!==null&&w(o),Hs(a)){case 2:case 8:a=qt;break;case 32:a=wt;break;case 268435456:a=Se;break;default:a=wt}return o=Cg.bind(null,e),a=xt(a,o),e.callbackPriority=n,e.callbackNode=a,n}return o!==null&&o!==null&&w(o),e.callbackPriority=2,e.callbackNode=null,2}function Cg(e,n){if(dn!==0&&dn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(sc()&&e.callbackNode!==a)return null;var o=Me;return o=Nt(e,e===Ye?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(cg(e,o,n),bg(e,mt()),e.callbackNode!=null&&e.callbackNode===a?Cg.bind(null,e):null)}function Og(e,n){if(sc())return null;cg(e,n,!0)}function nM(){pM(function(){(Ne&6)!==0?xt(St,eM):Rg()})}function uh(){if(Ba===0){var e=$s;e===0&&(e=Ot,Ot<<=1,(Ot&261888)===0&&(Ot=256)),Ba=e}return Ba}function Lg(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:ml(""+e)}function wg(e,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,e.id&&a.setAttribute("form",e.id),n.parentNode.insertBefore(a,n),e=new FormData(e),a.parentNode.removeChild(a),e}function iM(e,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var f=Lg((u[xn]||null).action),M=o.submitter;M&&(n=(n=M[xn]||null)?Lg(n.formAction):M.getAttribute("formAction"),n!==null&&(f=n,M=null));var R=new Sl("action","action",null,o,u);e.push({event:R,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(Ba!==0){var F=M?wg(u,M):new FormData(u);Lf(a,{pending:!0,data:F,method:u.method,action:f},null,F)}}else typeof f=="function"&&(R.preventDefault(),F=M?wg(u,M):new FormData(u),Lf(a,{pending:!0,data:F,method:u.method,action:f},f,F))},currentTarget:u}]})}}for(var fh=0;fh<Wu.length;fh++){var hh=Wu[fh],aM=hh.toLowerCase(),sM=hh[0].toUpperCase()+hh.slice(1);xi(aM,"on"+sM)}xi(lm,"onAnimationEnd"),xi(cm,"onAnimationIteration"),xi(um,"onAnimationStart"),xi("dblclick","onDoubleClick"),xi("focusin","onFocus"),xi("focusout","onBlur"),xi(AS,"onTransitionRun"),xi(ES,"onTransitionStart"),xi(yS,"onTransitionCancel"),xi(fm,"onTransitionEnd"),Gt("onMouseEnter",["mouseout","mouseover"]),Gt("onMouseLeave",["mouseout","mouseover"]),Gt("onPointerEnter",["pointerout","pointerover"]),Gt("onPointerLeave",["pointerout","pointerover"]),Ft("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ft("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ft("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ft("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ft("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ft("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var zo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),rM=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zo));function Dg(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var o=e[a],u=o.event;o=o.listeners;t:{var f=void 0;if(n)for(var M=o.length-1;0<=M;M--){var R=o[M],F=R.instance,et=R.currentTarget;if(R=R.listener,F!==f&&u.isPropagationStopped())break t;f=R,u.currentTarget=et;try{f(u)}catch(dt){El(dt)}u.currentTarget=null,f=F}else for(M=0;M<o.length;M++){if(R=o[M],F=R.instance,et=R.currentTarget,R=R.listener,F!==f&&u.isPropagationStopped())break t;f=R,u.currentTarget=et;try{f(u)}catch(dt){El(dt)}u.currentTarget=null,f=F}}}}function ve(e,n){var a=n[ao];a===void 0&&(a=n[ao]=new Set);var o=e+"__bubble";a.has(o)||(Ng(n,e,2,!1),a.add(o))}function dh(e,n,a){var o=0;n&&(o|=4),Ng(a,e,o,n)}var lc="_reactListening"+Math.random().toString(36).slice(2);function ph(e){if(!e[lc]){e[lc]=!0,bt.forEach(function(a){a!=="selectionchange"&&(rM.has(a)||dh(a,!1,e),dh(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[lc]||(n[lc]=!0,dh("selectionchange",!1,n))}}function Ng(e,n,a,o){switch(l_(n)){case 2:var u=UM;break;case 8:u=PM;break;default:u=Oh}a=u.bind(null,n,a,e),u=void 0,!Nu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?e.addEventListener(n,a,{capture:!0,passive:u}):e.addEventListener(n,a,!0):u!==void 0?e.addEventListener(n,a,{passive:u}):e.addEventListener(n,a,!1)}function mh(e,n,a,o,u){var f=o;if((n&1)===0&&(n&2)===0&&o!==null)t:for(;;){if(o===null)return;var M=o.tag;if(M===3||M===4){var R=o.stateNode.containerInfo;if(R===u)break;if(M===4)for(M=o.return;M!==null;){var F=M.tag;if((F===3||F===4)&&M.stateNode.containerInfo===u)return;M=M.return}for(;R!==null;){if(M=b(R),M===null)return;if(F=M.tag,F===5||F===6||F===26||F===27){o=f=M;continue t}R=R.parentNode}}o=o.return}Fp(function(){var et=f,dt=wu(a),Mt=[];t:{var at=hm.get(e);if(at!==void 0){var ot=Sl,Yt=e;switch(e){case"keypress":if(_l(a)===0)break t;case"keydown":case"keyup":ot=$1;break;case"focusin":Yt="focus",ot=Bu;break;case"focusout":Yt="blur",ot=Bu;break;case"beforeblur":case"afterblur":ot=Bu;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ot=Gp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ot=G1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ot=nS;break;case lm:case cm:case um:ot=X1;break;case fm:ot=aS;break;case"scroll":case"scrollend":ot=z1;break;case"wheel":ot=rS;break;case"copy":case"cut":case"paste":ot=W1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ot=kp;break;case"toggle":case"beforetoggle":ot=lS}var $t=(n&4)!==0,Ve=!$t&&(e==="scroll"||e==="scrollend"),Q=$t?at!==null?at+"Capture":null:at;$t=[];for(var X=et,tt;X!==null;){var gt=X;if(tt=gt.stateNode,gt=gt.tag,gt!==5&&gt!==26&&gt!==27||tt===null||Q===null||(gt=ro(X,Q),gt!=null&&$t.push(Ho(X,gt,tt))),Ve)break;X=X.return}0<$t.length&&(at=new ot(at,Yt,null,a,dt),Mt.push({event:at,listeners:$t}))}}if((n&7)===0){t:{if(at=e==="mouseover"||e==="pointerover",ot=e==="mouseout"||e==="pointerout",at&&a!==Lu&&(Yt=a.relatedTarget||a.fromElement)&&(b(Yt)||Yt[Xi]))break t;if((ot||at)&&(at=dt.window===dt?dt:(at=dt.ownerDocument)?at.defaultView||at.parentWindow:window,ot?(Yt=a.relatedTarget||a.toElement,ot=et,Yt=Yt?b(Yt):null,Yt!==null&&(Ve=c(Yt),$t=Yt.tag,Yt!==Ve||$t!==5&&$t!==27&&$t!==6)&&(Yt=null)):(ot=null,Yt=et),ot!==Yt)){if($t=Gp,gt="onMouseLeave",Q="onMouseEnter",X="mouse",(e==="pointerout"||e==="pointerover")&&($t=kp,gt="onPointerLeave",Q="onPointerEnter",X="pointer"),Ve=ot==null?at:st(ot),tt=Yt==null?at:st(Yt),at=new $t(gt,X+"leave",ot,a,dt),at.target=Ve,at.relatedTarget=tt,gt=null,b(dt)===et&&($t=new $t(Q,X+"enter",Yt,a,dt),$t.target=tt,$t.relatedTarget=Ve,gt=$t),Ve=gt,ot&&Yt)e:{for($t=oM,Q=ot,X=Yt,tt=0,gt=Q;gt;gt=$t(gt))tt++;gt=0;for(var Qt=X;Qt;Qt=$t(Qt))gt++;for(;0<tt-gt;)Q=$t(Q),tt--;for(;0<gt-tt;)X=$t(X),gt--;for(;tt--;){if(Q===X||X!==null&&Q===X.alternate){$t=Q;break e}Q=$t(Q),X=$t(X)}$t=null}else $t=null;ot!==null&&Ug(Mt,at,ot,$t,!1),Yt!==null&&Ve!==null&&Ug(Mt,Ve,Yt,$t,!0)}}t:{if(at=et?st(et):window,ot=at.nodeName&&at.nodeName.toLowerCase(),ot==="select"||ot==="input"&&at.type==="file")var Le=Qp;else if(jp(at))if(Jp)Le=vS;else{Le=gS;var Wt=mS}else ot=at.nodeName,!ot||ot.toLowerCase()!=="input"||at.type!=="checkbox"&&at.type!=="radio"?et&&Ou(et.elementType)&&(Le=Qp):Le=_S;if(Le&&(Le=Le(e,et))){Zp(Mt,Le,a,dt);break t}Wt&&Wt(e,at,et),e==="focusout"&&et&&at.type==="number"&&et.memoizedProps.value!=null&&wn(at,"number",at.value)}switch(Wt=et?st(et):window,e){case"focusin":(jp(Wt)||Wt.contentEditable==="true")&&(Ys=Wt,ku=et,mo=null);break;case"focusout":mo=ku=Ys=null;break;case"mousedown":Xu=!0;break;case"contextmenu":case"mouseup":case"dragend":Xu=!1,rm(Mt,a,dt);break;case"selectionchange":if(MS)break;case"keydown":case"keyup":rm(Mt,a,dt)}var he;if(zu)t:{switch(e){case"compositionstart":var Ae="onCompositionStart";break t;case"compositionend":Ae="onCompositionEnd";break t;case"compositionupdate":Ae="onCompositionUpdate";break t}Ae=void 0}else Xs?qp(e,a)&&(Ae="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(Ae="onCompositionStart");Ae&&(Xp&&a.locale!=="ko"&&(Xs||Ae!=="onCompositionStart"?Ae==="onCompositionEnd"&&Xs&&(he=zp()):(Aa=dt,Uu="value"in Aa?Aa.value:Aa.textContent,Xs=!0)),Wt=cc(et,Ae),0<Wt.length&&(Ae=new Vp(Ae,e,null,a,dt),Mt.push({event:Ae,listeners:Wt}),he?Ae.data=he:(he=Kp(a),he!==null&&(Ae.data=he)))),(he=uS?fS(e,a):hS(e,a))&&(Ae=cc(et,"onBeforeInput"),0<Ae.length&&(Wt=new Vp("onBeforeInput","beforeinput",null,a,dt),Mt.push({event:Wt,listeners:Ae}),Wt.data=he)),iM(Mt,e,et,a,dt)}Dg(Mt,n)})}function Ho(e,n,a){return{instance:e,listener:n,currentTarget:a}}function cc(e,n){for(var a=n+"Capture",o=[];e!==null;){var u=e,f=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||f===null||(u=ro(e,a),u!=null&&o.unshift(Ho(e,u,f)),u=ro(e,n),u!=null&&o.push(Ho(e,u,f))),e.tag===3)return o;e=e.return}return[]}function oM(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Ug(e,n,a,o,u){for(var f=n._reactName,M=[];a!==null&&a!==o;){var R=a,F=R.alternate,et=R.stateNode;if(R=R.tag,F!==null&&F===o)break;R!==5&&R!==26&&R!==27||et===null||(F=et,u?(et=ro(a,f),et!=null&&M.unshift(Ho(a,et,F))):u||(et=ro(a,f),et!=null&&M.push(Ho(a,et,F)))),a=a.return}M.length!==0&&e.push({event:n,listeners:M})}var lM=/\r\n?/g,cM=/\u0000|\uFFFD/g;function Pg(e){return(typeof e=="string"?e:""+e).replace(lM,`
`).replace(cM,"")}function Ig(e,n){return n=Pg(n),Pg(e)===n}function Ge(e,n,a,o,u,f){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||kn(e,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&kn(e,""+o);break;case"className":We(e,"class",o);break;case"tabIndex":We(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":We(e,a,o);break;case"style":Ip(e,o,f);break;case"data":if(n!=="object"){We(e,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=ml(""+o),e.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Ge(e,n,"name",u.name,u,null),Ge(e,n,"formEncType",u.formEncType,u,null),Ge(e,n,"formMethod",u.formMethod,u,null),Ge(e,n,"formTarget",u.formTarget,u,null)):(Ge(e,n,"encType",u.encType,u,null),Ge(e,n,"method",u.method,u,null),Ge(e,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=ml(""+o),e.setAttribute(a,o);break;case"onClick":o!=null&&(e.onclick=Yi);break;case"onScroll":o!=null&&ve("scroll",e);break;case"onScrollEnd":o!=null&&ve("scrollend",e);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}a=ml(""+o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""+o):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":o===!0?e.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,o):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(a,o):e.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(a):e.setAttribute(a,o);break;case"popover":ve("beforetoggle",e),ve("toggle",e),ye(e,"popover",o);break;case"xlinkActuate":Oe(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Oe(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Oe(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Oe(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Oe(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Oe(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Oe(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Oe(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Oe(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":ye(e,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=B1.get(a)||a,ye(e,a,o))}}function gh(e,n,a,o,u,f){switch(a){case"style":Ip(e,o,f);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"children":typeof o=="string"?kn(e,o):(typeof o=="number"||typeof o=="bigint")&&kn(e,""+o);break;case"onScroll":o!=null&&ve("scroll",e);break;case"onScrollEnd":o!=null&&ve("scrollend",e);break;case"onClick":o!=null&&(e.onclick=Yi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Ut.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),f=e[xn]||null,f=f!=null?f[a]:null,typeof f=="function"&&e.removeEventListener(n,f,u),typeof o=="function")){typeof f!="function"&&f!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(n,o,u);break t}a in e?e[a]=o:o===!0?e.setAttribute(a,""):ye(e,a,o)}}}function On(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":ve("error",e),ve("load",e);var o=!1,u=!1,f;for(f in a)if(a.hasOwnProperty(f)){var M=a[f];if(M!=null)switch(f){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Ge(e,n,f,M,a,null)}}u&&Ge(e,n,"srcSet",a.srcSet,a,null),o&&Ge(e,n,"src",a.src,a,null);return;case"input":ve("invalid",e);var R=f=M=u=null,F=null,et=null;for(o in a)if(a.hasOwnProperty(o)){var dt=a[o];if(dt!=null)switch(o){case"name":u=dt;break;case"type":M=dt;break;case"checked":F=dt;break;case"defaultChecked":et=dt;break;case"value":f=dt;break;case"defaultValue":R=dt;break;case"children":case"dangerouslySetInnerHTML":if(dt!=null)throw Error(s(137,n));break;default:Ge(e,n,o,dt,a,null)}}In(e,f,R,F,et,M,u,!1);return;case"select":ve("invalid",e),o=M=f=null;for(u in a)if(a.hasOwnProperty(u)&&(R=a[u],R!=null))switch(u){case"value":f=R;break;case"defaultValue":M=R;break;case"multiple":o=R;default:Ge(e,n,u,R,a,null)}n=f,a=M,e.multiple=!!o,n!=null?Je(e,!!o,n,!1):a!=null&&Je(e,!!o,a,!0);return;case"textarea":ve("invalid",e),f=u=o=null;for(M in a)if(a.hasOwnProperty(M)&&(R=a[M],R!=null))switch(M){case"value":o=R;break;case"defaultValue":u=R;break;case"children":f=R;break;case"dangerouslySetInnerHTML":if(R!=null)throw Error(s(91));break;default:Ge(e,n,M,R,a,null)}Gs(e,o,u,f);return;case"option":for(F in a)if(a.hasOwnProperty(F)&&(o=a[F],o!=null))switch(F){case"selected":e.selected=o&&typeof o!="function"&&typeof o!="symbol";break;default:Ge(e,n,F,o,a,null)}return;case"dialog":ve("beforetoggle",e),ve("toggle",e),ve("cancel",e),ve("close",e);break;case"iframe":case"object":ve("load",e);break;case"video":case"audio":for(o=0;o<zo.length;o++)ve(zo[o],e);break;case"image":ve("error",e),ve("load",e);break;case"details":ve("toggle",e);break;case"embed":case"source":case"link":ve("error",e),ve("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(et in a)if(a.hasOwnProperty(et)&&(o=a[et],o!=null))switch(et){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Ge(e,n,et,o,a,null)}return;default:if(Ou(n)){for(dt in a)a.hasOwnProperty(dt)&&(o=a[dt],o!==void 0&&gh(e,n,dt,o,a,void 0));return}}for(R in a)a.hasOwnProperty(R)&&(o=a[R],o!=null&&Ge(e,n,R,o,a,null))}function uM(e,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,f=null,M=null,R=null,F=null,et=null,dt=null;for(ot in a){var Mt=a[ot];if(a.hasOwnProperty(ot)&&Mt!=null)switch(ot){case"checked":break;case"value":break;case"defaultValue":F=Mt;default:o.hasOwnProperty(ot)||Ge(e,n,ot,null,o,Mt)}}for(var at in o){var ot=o[at];if(Mt=a[at],o.hasOwnProperty(at)&&(ot!=null||Mt!=null))switch(at){case"type":f=ot;break;case"name":u=ot;break;case"checked":et=ot;break;case"defaultChecked":dt=ot;break;case"value":M=ot;break;case"defaultValue":R=ot;break;case"children":case"dangerouslySetInnerHTML":if(ot!=null)throw Error(s(137,n));break;default:ot!==Mt&&Ge(e,n,at,ot,o,Mt)}}ze(e,M,R,F,et,dt,f,u);return;case"select":ot=M=R=at=null;for(f in a)if(F=a[f],a.hasOwnProperty(f)&&F!=null)switch(f){case"value":break;case"multiple":ot=F;default:o.hasOwnProperty(f)||Ge(e,n,f,null,o,F)}for(u in o)if(f=o[u],F=a[u],o.hasOwnProperty(u)&&(f!=null||F!=null))switch(u){case"value":at=f;break;case"defaultValue":R=f;break;case"multiple":M=f;default:f!==F&&Ge(e,n,u,f,o,F)}n=R,a=M,o=ot,at!=null?Je(e,!!a,at,!1):!!o!=!!a&&(n!=null?Je(e,!!a,n,!0):Je(e,!!a,a?[]:"",!1));return;case"textarea":ot=at=null;for(R in a)if(u=a[R],a.hasOwnProperty(R)&&u!=null&&!o.hasOwnProperty(R))switch(R){case"value":break;case"children":break;default:Ge(e,n,R,null,o,u)}for(M in o)if(u=o[M],f=a[M],o.hasOwnProperty(M)&&(u!=null||f!=null))switch(M){case"value":at=u;break;case"defaultValue":ot=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==f&&Ge(e,n,M,u,o,f)}Tn(e,at,ot);return;case"option":for(var Yt in a)if(at=a[Yt],a.hasOwnProperty(Yt)&&at!=null&&!o.hasOwnProperty(Yt))switch(Yt){case"selected":e.selected=!1;break;default:Ge(e,n,Yt,null,o,at)}for(F in o)if(at=o[F],ot=a[F],o.hasOwnProperty(F)&&at!==ot&&(at!=null||ot!=null))switch(F){case"selected":e.selected=at&&typeof at!="function"&&typeof at!="symbol";break;default:Ge(e,n,F,at,o,ot)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var $t in a)at=a[$t],a.hasOwnProperty($t)&&at!=null&&!o.hasOwnProperty($t)&&Ge(e,n,$t,null,o,at);for(et in o)if(at=o[et],ot=a[et],o.hasOwnProperty(et)&&at!==ot&&(at!=null||ot!=null))switch(et){case"children":case"dangerouslySetInnerHTML":if(at!=null)throw Error(s(137,n));break;default:Ge(e,n,et,at,o,ot)}return;default:if(Ou(n)){for(var Ve in a)at=a[Ve],a.hasOwnProperty(Ve)&&at!==void 0&&!o.hasOwnProperty(Ve)&&gh(e,n,Ve,void 0,o,at);for(dt in o)at=o[dt],ot=a[dt],!o.hasOwnProperty(dt)||at===ot||at===void 0&&ot===void 0||gh(e,n,dt,at,o,ot);return}}for(var Q in a)at=a[Q],a.hasOwnProperty(Q)&&at!=null&&!o.hasOwnProperty(Q)&&Ge(e,n,Q,null,o,at);for(Mt in o)at=o[Mt],ot=a[Mt],!o.hasOwnProperty(Mt)||at===ot||at==null&&ot==null||Ge(e,n,Mt,at,o,ot)}function Bg(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function fM(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],f=u.transferSize,M=u.initiatorType,R=u.duration;if(f&&R&&Bg(M)){for(M=0,R=u.responseEnd,o+=1;o<a.length;o++){var F=a[o],et=F.startTime;if(et>R)break;var dt=F.transferSize,Mt=F.initiatorType;dt&&Bg(Mt)&&(F=F.responseEnd,M+=dt*(F<R?1:(R-et)/(F-et)))}if(--o,n+=8*(f+M)/(u.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var _h=null,vh=null;function uc(e){return e.nodeType===9?e:e.ownerDocument}function Fg(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function zg(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function Sh(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Mh=null;function hM(){var e=window.event;return e&&e.type==="popstate"?e===Mh?!1:(Mh=e,!0):(Mh=null,!1)}var Hg=typeof setTimeout=="function"?setTimeout:void 0,dM=typeof clearTimeout=="function"?clearTimeout:void 0,Gg=typeof Promise=="function"?Promise:void 0,pM=typeof queueMicrotask=="function"?queueMicrotask:typeof Gg<"u"?function(e){return Gg.resolve(null).then(e).catch(mM)}:Hg;function mM(e){setTimeout(function(){throw e})}function Fa(e){return e==="head"}function Vg(e,n){var a=n,o=0;do{var u=a.nextSibling;if(e.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){e.removeChild(u),vr(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Go(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Go(a);for(var f=a.firstChild;f;){var M=f.nextSibling,R=f.nodeName;f[rs]||R==="SCRIPT"||R==="STYLE"||R==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=M}}else a==="body"&&Go(e.ownerDocument.body);a=u}while(a);vr(n)}function kg(e,n){var a=e;e=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=o}while(a)}function Ah(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Ah(a),so(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function gM(e,n,a,o){for(;e.nodeType===1;){var u=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[rs])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(f=e.getAttribute("rel"),f==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(f!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(f=e.getAttribute("src"),(f!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&f&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var f=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===f)return e}else return e;if(e=gi(e.nextSibling),e===null)break}return null}function _M(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=gi(e.nextSibling),e===null))return null;return e}function Xg(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=gi(e.nextSibling),e===null))return null;return e}function Eh(e){return e.data==="$?"||e.data==="$~"}function yh(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function vM(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function gi(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var xh=null;function Yg(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return gi(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function Wg(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function qg(e,n,a){switch(n=uc(a),e){case"html":if(e=n.documentElement,!e)throw Error(s(452));return e;case"head":if(e=n.head,!e)throw Error(s(453));return e;case"body":if(e=n.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function Go(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);so(e)}var _i=new Map,Kg=new Set;function fc(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var oa=k.d;k.d={f:SM,r:MM,D:AM,C:EM,L:yM,m:xM,X:RM,S:TM,M:bM};function SM(){var e=oa.f(),n=nc();return e||n}function MM(e){var n=Z(e);n!==null&&n.tag===5&&n.type==="form"?f0(n):oa.r(e)}var mr=typeof document>"u"?null:document;function jg(e,n,a){var o=mr;if(o&&typeof n=="string"&&n){var u=_n(n);u='link[rel="'+e+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),Kg.has(u)||(Kg.add(u),e={rel:e,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),On(n,"link",e),W(n),o.head.appendChild(n)))}}function AM(e){oa.D(e),jg("dns-prefetch",e,null)}function EM(e,n){oa.C(e,n),jg("preconnect",e,n)}function yM(e,n,a){oa.L(e,n,a);var o=mr;if(o&&e&&n){var u='link[rel="preload"][as="'+_n(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+_n(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+_n(a.imageSizes)+'"]')):u+='[href="'+_n(e)+'"]';var f=u;switch(n){case"style":f=gr(e);break;case"script":f=_r(e)}_i.has(f)||(e=_({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),_i.set(f,e),o.querySelector(u)!==null||n==="style"&&o.querySelector(Vo(f))||n==="script"&&o.querySelector(ko(f))||(n=o.createElement("link"),On(n,"link",e),W(n),o.head.appendChild(n)))}}function xM(e,n){oa.m(e,n);var a=mr;if(a&&e){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+_n(o)+'"][href="'+_n(e)+'"]',f=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=_r(e)}if(!_i.has(f)&&(e=_({rel:"modulepreload",href:e},n),_i.set(f,e),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(ko(f)))return}o=a.createElement("link"),On(o,"link",e),W(o),a.head.appendChild(o)}}}function TM(e,n,a){oa.S(e,n,a);var o=mr;if(o&&e){var u=rt(o).hoistableStyles,f=gr(e);n=n||"default";var M=u.get(f);if(!M){var R={loading:0,preload:null};if(M=o.querySelector(Vo(f)))R.loading=5;else{e=_({rel:"stylesheet",href:e,"data-precedence":n},a),(a=_i.get(f))&&Th(e,a);var F=M=o.createElement("link");W(F),On(F,"link",e),F._p=new Promise(function(et,dt){F.onload=et,F.onerror=dt}),F.addEventListener("load",function(){R.loading|=1}),F.addEventListener("error",function(){R.loading|=2}),R.loading|=4,hc(M,n,o)}M={type:"stylesheet",instance:M,count:1,state:R},u.set(f,M)}}}function RM(e,n){oa.X(e,n);var a=mr;if(a&&e){var o=rt(a).hoistableScripts,u=_r(e),f=o.get(u);f||(f=a.querySelector(ko(u)),f||(e=_({src:e,async:!0},n),(n=_i.get(u))&&Rh(e,n),f=a.createElement("script"),W(f),On(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function bM(e,n){oa.M(e,n);var a=mr;if(a&&e){var o=rt(a).hoistableScripts,u=_r(e),f=o.get(u);f||(f=a.querySelector(ko(u)),f||(e=_({src:e,async:!0,type:"module"},n),(n=_i.get(u))&&Rh(e,n),f=a.createElement("script"),W(f),On(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function Zg(e,n,a,o){var u=(u=yt.current)?fc(u):null;if(!u)throw Error(s(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=gr(a.href),a=rt(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=gr(a.href);var f=rt(u).hoistableStyles,M=f.get(e);if(M||(u=u.ownerDocument||u,M={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(e,M),(f=u.querySelector(Vo(e)))&&!f._p&&(M.instance=f,M.state.loading=5),_i.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},_i.set(e,a),f||CM(u,e,a,M.state))),n&&o===null)throw Error(s(528,""));return M}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=_r(a),a=rt(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,e))}}function gr(e){return'href="'+_n(e)+'"'}function Vo(e){return'link[rel="stylesheet"]['+e+"]"}function Qg(e){return _({},e,{"data-precedence":e.precedence,precedence:null})}function CM(e,n,a,o){e.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=e.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),On(n,"link",a),W(n),e.head.appendChild(n))}function _r(e){return'[src="'+_n(e)+'"]'}function ko(e){return"script[async]"+e}function Jg(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=e.querySelector('style[data-href~="'+_n(a.href)+'"]');if(o)return n.instance=o,W(o),o;var u=_({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),W(o),On(o,"style",u),hc(o,a.precedence,e),n.instance=o;case"stylesheet":u=gr(a.href);var f=e.querySelector(Vo(u));if(f)return n.state.loading|=4,n.instance=f,W(f),f;o=Qg(a),(u=_i.get(u))&&Th(o,u),f=(e.ownerDocument||e).createElement("link"),W(f);var M=f;return M._p=new Promise(function(R,F){M.onload=R,M.onerror=F}),On(f,"link",o),n.state.loading|=4,hc(f,a.precedence,e),n.instance=f;case"script":return f=_r(a.src),(u=e.querySelector(ko(f)))?(n.instance=u,W(u),u):(o=a,(u=_i.get(f))&&(o=_({},a),Rh(o,u)),e=e.ownerDocument||e,u=e.createElement("script"),W(u),On(u,"link",o),e.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,hc(o,a.precedence,e));return n.instance}function hc(e,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,f=u,M=0;M<o.length;M++){var R=o[M];if(R.dataset.precedence===n)f=R;else if(f!==u)break}f?f.parentNode.insertBefore(e,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Th(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Rh(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var dc=null;function $g(e,n,a){if(dc===null){var o=new Map,u=dc=new Map;u.set(a,o)}else u=dc,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(e))return o;for(o.set(e,null),a=a.getElementsByTagName(e),u=0;u<a.length;u++){var f=a[u];if(!(f[rs]||f[Qe]||e==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var M=f.getAttribute(n)||"";M=e+M;var R=o.get(M);R?R.push(f):o.set(M,[f])}}return o}function t_(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function OM(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function e_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function LM(e,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=gr(o.href),f=n.querySelector(Vo(u));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=pc.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=f,W(f);return}f=n.ownerDocument||n,o=Qg(o),(u=_i.get(u))&&Th(o,u),f=f.createElement("link"),W(f);var M=f;M._p=new Promise(function(R,F){M.onload=R,M.onerror=F}),On(f,"link",o),a.instance=f}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=pc.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var bh=0;function wM(e,n){return e.stylesheets&&e.count===0&&gc(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var o=setTimeout(function(){if(e.stylesheets&&gc(e,e.stylesheets),e.unsuspend){var f=e.unsuspend;e.unsuspend=null,f()}},6e4+n);0<e.imgBytes&&bh===0&&(bh=62500*fM());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&gc(e,e.stylesheets),e.unsuspend)){var f=e.unsuspend;e.unsuspend=null,f()}},(e.imgBytes>bh?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function pc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)gc(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var mc=null;function gc(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,mc=new Map,n.forEach(DM,e),mc=null,pc.call(e))}function DM(e,n){if(!(n.state.loading&4)){var a=mc.get(e);if(a)var o=a.get(null);else{a=new Map,mc.set(e,a);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<u.length;f++){var M=u[f];(M.nodeName==="LINK"||M.getAttribute("media")!=="not all")&&(a.set(M.dataset.precedence,M),o=M)}o&&a.set(null,o)}u=n.instance,M=u.getAttribute("data-precedence"),f=a.get(M)||o,f===o&&a.set(null,u),a.set(M,u),this.count++,o=pc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),f?f.parentNode.insertBefore(u,f.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),n.state.loading|=4}}var Xo={$$typeof:D,Provider:null,Consumer:null,_currentValue:q,_currentValue2:q,_threadCount:0};function NM(e,n,a,o,u,f,M,R,F){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=be(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=be(0),this.hiddenUpdates=be(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=f,this.onRecoverableError=M,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=F,this.incompleteTransitions=new Map}function n_(e,n,a,o,u,f,M,R,F,et,dt,Mt){return e=new NM(e,n,a,M,F,et,dt,Mt,R),n=1,f===!0&&(n|=24),f=ti(3,null,null,n),e.current=f,f.stateNode=e,n=rf(),n.refCount++,e.pooledCache=n,n.refCount++,f.memoizedState={element:o,isDehydrated:a,cache:n},uf(f),e}function i_(e){return e?(e=Ks,e):Ks}function a_(e,n,a,o,u,f){u=i_(u),o.context===null?o.context=u:o.pendingContext=u,o=ba(n),o.payload={element:a},f=f===void 0?null:f,f!==null&&(o.callback=f),a=Ca(e,o,n),a!==null&&(jn(a,e,n),Eo(a,e,n))}function s_(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function Ch(e,n){s_(e,n),(e=e.alternate)&&s_(e,n)}function r_(e){if(e.tag===13||e.tag===31){var n=us(e,67108864);n!==null&&jn(n,e,67108864),Ch(e,67108864)}}function o_(e){if(e.tag===13||e.tag===31){var n=si();n=as(n);var a=us(e,n);a!==null&&jn(a,e,n),Ch(e,n)}}var _c=!0;function UM(e,n,a,o){var u=I.T;I.T=null;var f=k.p;try{k.p=2,Oh(e,n,a,o)}finally{k.p=f,I.T=u}}function PM(e,n,a,o){var u=I.T;I.T=null;var f=k.p;try{k.p=8,Oh(e,n,a,o)}finally{k.p=f,I.T=u}}function Oh(e,n,a,o){if(_c){var u=Lh(o);if(u===null)mh(e,n,o,vc,a),c_(e,o);else if(BM(u,e,n,a,o))o.stopPropagation();else if(c_(e,o),n&4&&-1<IM.indexOf(e)){for(;u!==null;){var f=Z(u);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var M=Lt(f.pendingLanes);if(M!==0){var R=f;for(R.pendingLanes|=2,R.entangledLanes|=2;M;){var F=1<<31-ee(M);R.entanglements[1]|=F,M&=~F}Bi(f),(Ne&6)===0&&(tc=mt()+500,Fo(0))}}break;case 31:case 13:R=us(f,2),R!==null&&jn(R,f,2),nc(),Ch(f,2)}if(f=Lh(o),f===null&&mh(e,n,o,vc,a),f===u)break;u=f}u!==null&&o.stopPropagation()}else mh(e,n,o,null,a)}}function Lh(e){return e=wu(e),wh(e)}var vc=null;function wh(e){if(vc=null,e=b(e),e!==null){var n=c(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=h(n),e!==null)return e;e=null}else if(a===31){if(e=d(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return vc=e,null}function l_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Rt()){case St:return 2;case qt:return 8;case wt:case kt:return 32;case Se:return 268435456;default:return 32}default:return 32}}var Dh=!1,za=null,Ha=null,Ga=null,Yo=new Map,Wo=new Map,Va=[],IM="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function c_(e,n){switch(e){case"focusin":case"focusout":za=null;break;case"dragenter":case"dragleave":Ha=null;break;case"mouseover":case"mouseout":Ga=null;break;case"pointerover":case"pointerout":Yo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Wo.delete(n.pointerId)}}function qo(e,n,a,o,u,f){return e===null||e.nativeEvent!==f?(e={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:f,targetContainers:[u]},n!==null&&(n=Z(n),n!==null&&r_(n)),e):(e.eventSystemFlags|=o,n=e.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),e)}function BM(e,n,a,o,u){switch(n){case"focusin":return za=qo(za,e,n,a,o,u),!0;case"dragenter":return Ha=qo(Ha,e,n,a,o,u),!0;case"mouseover":return Ga=qo(Ga,e,n,a,o,u),!0;case"pointerover":var f=u.pointerId;return Yo.set(f,qo(Yo.get(f)||null,e,n,a,o,u)),!0;case"gotpointercapture":return f=u.pointerId,Wo.set(f,qo(Wo.get(f)||null,e,n,a,o,u)),!0}return!1}function u_(e){var n=b(e.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){e.blockedOn=n,ss(e.priority,function(){o_(a)});return}}else if(n===31){if(n=d(a),n!==null){e.blockedOn=n,ss(e.priority,function(){o_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Sc(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=Lh(e.nativeEvent);if(a===null){a=e.nativeEvent;var o=new a.constructor(a.type,a);Lu=o,a.target.dispatchEvent(o),Lu=null}else return n=Z(a),n!==null&&r_(n),e.blockedOn=a,!1;n.shift()}return!0}function f_(e,n,a){Sc(e)&&a.delete(n)}function FM(){Dh=!1,za!==null&&Sc(za)&&(za=null),Ha!==null&&Sc(Ha)&&(Ha=null),Ga!==null&&Sc(Ga)&&(Ga=null),Yo.forEach(f_),Wo.forEach(f_)}function Mc(e,n){e.blockedOn===n&&(e.blockedOn=null,Dh||(Dh=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,FM)))}var Ac=null;function h_(e){Ac!==e&&(Ac=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){Ac===e&&(Ac=null);for(var n=0;n<e.length;n+=3){var a=e[n],o=e[n+1],u=e[n+2];if(typeof o!="function"){if(wh(o||a)===null)continue;break}var f=Z(a);f!==null&&(e.splice(n,3),n-=3,Lf(f,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function vr(e){function n(F){return Mc(F,e)}za!==null&&Mc(za,e),Ha!==null&&Mc(Ha,e),Ga!==null&&Mc(Ga,e),Yo.forEach(n),Wo.forEach(n);for(var a=0;a<Va.length;a++){var o=Va[a];o.blockedOn===e&&(o.blockedOn=null)}for(;0<Va.length&&(a=Va[0],a.blockedOn===null);)u_(a),a.blockedOn===null&&Va.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],f=a[o+1],M=u[xn]||null;if(typeof f=="function")M||h_(a);else if(M){var R=null;if(f&&f.hasAttribute("formAction")){if(u=f,M=f[xn]||null)R=M.formAction;else if(wh(u)!==null)continue}else R=M.action;typeof R=="function"?a[o+1]=R:(a.splice(o,3),o-=3),h_(a)}}}function d_(){function e(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(M){return u=M})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function Nh(e){this._internalRoot=e}Ec.prototype.render=Nh.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=si();a_(a,o,e,n,null,null)},Ec.prototype.unmount=Nh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;a_(e.current,2,null,e,null,null),nc(),n[Xi]=null}};function Ec(e){this._internalRoot=e}Ec.prototype.unstable_scheduleHydration=function(e){if(e){var n=io();e={blockedOn:null,target:e,priority:n};for(var a=0;a<Va.length&&n!==0&&n<Va[a].priority;a++);Va.splice(a,0,e),a===0&&u_(e)}};var p_=t.version;if(p_!=="19.2.4")throw Error(s(527,p_,"19.2.4"));k.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=p(n),e=e!==null?g(e):null,e=e===null?null:e.stateNode,e};var zM={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:I,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var yc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yc.isDisabled&&yc.supportsFiber)try{jt=yc.inject(zM),Kt=yc}catch{}}return jo.createRoot=function(e,n){if(!l(e))throw Error(s(299));var a=!1,o="",u=A0,f=E0,M=y0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(M=n.onRecoverableError)),n=n_(e,1,!1,null,null,a,o,null,u,f,M,d_),e[Xi]=n.current,ph(e),new Nh(n)},jo.hydrateRoot=function(e,n,a){if(!l(e))throw Error(s(299));var o=!1,u="",f=A0,M=E0,R=y0,F=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(M=a.onCaughtError),a.onRecoverableError!==void 0&&(R=a.onRecoverableError),a.formState!==void 0&&(F=a.formState)),n=n_(e,1,!0,n,a??null,o,u,F,f,M,R,d_),n.context=i_(null),a=n.current,o=si(),o=as(o),u=ba(o),u.callback=null,Ca(a,u,o),a=o,n.current.lanes=a,yn(n,a),Bi(n),e[Xi]=n.current,ph(e),new Ec(n)},jo.version="19.2.4",jo}var x_;function QM(){if(x_)return Ih.exports;x_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),Ih.exports=ZM(),Ih.exports}var JM=QM();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sp="172",Hr={ROTATE:0,DOLLY:1,PAN:2},Br={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},$M=0,T_=1,tA=2,Kv=1,eA=2,pa=3,is=0,Jn=1,ma=2,es=0,Gr=1,R_=2,b_=3,C_=4,nA=5,ws=100,iA=101,aA=102,sA=103,rA=104,oA=200,lA=201,cA=202,uA=203,yd=204,xd=205,fA=206,hA=207,dA=208,pA=209,mA=210,gA=211,_A=212,vA=213,SA=214,Td=0,Rd=1,bd=2,Xr=3,Cd=4,Od=5,Ld=6,wd=7,jv=0,MA=1,AA=2,ns=0,EA=1,yA=2,xA=3,TA=4,RA=5,bA=6,CA=7,Zv=300,Yr=301,Wr=302,Dd=303,Nd=304,Eu=306,Ud=1e3,Ns=1001,Pd=1002,li=1003,OA=1004,xc=1005,Hi=1006,Hh=1007,Us=1008,Sa=1009,Qv=1010,Jv=1011,ul=1012,Mp=1013,Ps=1014,Gi=1015,fl=1016,Ap=1017,Ep=1018,qr=1020,$v=35902,t1=1021,e1=1022,wi=1023,n1=1024,i1=1025,Vr=1026,Kr=1027,yp=1028,xp=1029,a1=1030,Tp=1031,Rp=1033,$c=33776,tu=33777,eu=33778,nu=33779,Id=35840,Bd=35841,Fd=35842,zd=35843,Hd=36196,Gd=37492,Vd=37496,kd=37808,Xd=37809,Yd=37810,Wd=37811,qd=37812,Kd=37813,jd=37814,Zd=37815,Qd=37816,Jd=37817,$d=37818,tp=37819,ep=37820,np=37821,iu=36492,ip=36494,ap=36495,s1=36283,sp=36284,rp=36285,op=36286,LA=3200,wA=3201,r1=0,DA=1,$a="",Si="srgb",jr="srgb-linear",ou="linear",ke="srgb",Sr=7680,O_=519,NA=512,UA=513,PA=514,o1=515,IA=516,BA=517,FA=518,zA=519,lu=35044,Fr=35048,L_="300 es",_a=2e3,cu=2001;class Fs{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[t]===void 0&&(s[t]=[]),s[t].indexOf(i)===-1&&s[t].push(i)}hasEventListener(t,i){if(this._listeners===void 0)return!1;const s=this._listeners;return s[t]!==void 0&&s[t].indexOf(i)!==-1}removeEventListener(t,i){if(this._listeners===void 0)return;const l=this._listeners[t];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const s=this._listeners[t.type];if(s!==void 0){t.target=this;const l=s.slice(0);for(let c=0,h=l.length;c<h;c++)l[c].call(this,t);t.target=null}}}const Nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],au=Math.PI/180,lp=180/Math.PI;function hl(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(Nn[r&255]+Nn[r>>8&255]+Nn[r>>16&255]+Nn[r>>24&255]+"-"+Nn[t&255]+Nn[t>>8&255]+"-"+Nn[t>>16&15|64]+Nn[t>>24&255]+"-"+Nn[i&63|128]+Nn[i>>8&255]+"-"+Nn[i>>16&255]+Nn[i>>24&255]+Nn[s&255]+Nn[s>>8&255]+Nn[s>>16&255]+Nn[s>>24&255]).toLowerCase()}function ge(r,t,i){return Math.max(t,Math.min(i,r))}function HA(r,t){return(r%t+t)%t}function Gh(r,t,i){return(1-i)*r+i*t}function Zo(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Zn(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const GA={DEG2RAD:au};class oe{constructor(t=0,i=0){oe.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,s=this.y,l=t.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=ge(this.x,t.x,i.x),this.y=ge(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=ge(this.x,t,i),this.y=ge(this.y,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ge(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(ge(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y;return i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-t.x,h=this.y-t.y;return this.x=c*s-h*l+t.x,this.y=c*l+h*s+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class de{constructor(t,i,s,l,c,h,d,m,p){de.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,h,d,m,p)}set(t,i,s,l,c,h,d,m,p){const g=this.elements;return g[0]=t,g[1]=l,g[2]=d,g[3]=i,g[4]=c,g[5]=m,g[6]=s,g[7]=h,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(t,i,s){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,h=s[0],d=s[3],m=s[6],p=s[1],g=s[4],_=s[7],S=s[2],E=s[5],y=s[8],T=l[0],A=l[3],v=l[6],U=l[1],D=l[4],O=l[7],H=l[2],B=l[5],P=l[8];return c[0]=h*T+d*U+m*H,c[3]=h*A+d*D+m*B,c[6]=h*v+d*O+m*P,c[1]=p*T+g*U+_*H,c[4]=p*A+g*D+_*B,c[7]=p*v+g*O+_*P,c[2]=S*T+E*U+y*H,c[5]=S*A+E*D+y*B,c[8]=S*v+E*O+y*P,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],d=t[5],m=t[6],p=t[7],g=t[8];return i*h*g-i*d*p-s*c*g+s*d*m+l*c*p-l*h*m}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],d=t[5],m=t[6],p=t[7],g=t[8],_=g*h-d*p,S=d*m-g*c,E=p*c-h*m,y=i*_+s*S+l*E;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/y;return t[0]=_*T,t[1]=(l*p-g*s)*T,t[2]=(d*s-l*h)*T,t[3]=S*T,t[4]=(g*i-l*m)*T,t[5]=(l*c-d*i)*T,t[6]=E*T,t[7]=(s*m-p*i)*T,t[8]=(h*i-s*c)*T,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,s,l,c,h,d){const m=Math.cos(c),p=Math.sin(c);return this.set(s*m,s*p,-s*(m*h+p*d)+h+t,-l*p,l*m,-l*(-p*h+m*d)+d+i,0,0,1),this}scale(t,i){return this.premultiply(Vh.makeScale(t,i)),this}rotate(t){return this.premultiply(Vh.makeRotation(-t)),this}translate(t,i){return this.premultiply(Vh.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<9;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Vh=new de;function l1(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function uu(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function VA(){const r=uu("canvas");return r.style.display="block",r}const w_={};function Ir(r){r in w_||(w_[r]=!0,console.warn(r))}function kA(r,t,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}function XA(r){const t=r.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function YA(r){const t=r.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const D_=new de().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),N_=new de().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function WA(){const r={enabled:!0,workingColorSpace:jr,spaces:{},convert:function(l,c,h){return this.enabled===!1||c===h||!c||!h||(this.spaces[c].transfer===ke&&(l.r=va(l.r),l.g=va(l.g),l.b=va(l.b)),this.spaces[c].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===ke&&(l.r=kr(l.r),l.g=kr(l.g),l.b=kr(l.b))),l},fromWorkingColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},toWorkingColorSpace:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===$a?ou:this.spaces[l].transfer},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,h){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[jr]:{primaries:t,whitePoint:s,transfer:ou,toXYZ:D_,fromXYZ:N_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Si},outputColorSpaceConfig:{drawingBufferColorSpace:Si}},[Si]:{primaries:t,whitePoint:s,transfer:ke,toXYZ:D_,fromXYZ:N_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Si}}}),r}const De=WA();function va(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function kr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Mr;class qA{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Mr===void 0&&(Mr=uu("canvas")),Mr.width=t.width,Mr.height=t.height;const s=Mr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Mr}return i.width>2048||i.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),i.toDataURL("image/jpeg",.6)):i.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=uu("canvas");i.width=t.width,i.height=t.height;const s=i.getContext("2d");s.drawImage(t,0,0,t.width,t.height);const l=s.getImageData(0,0,t.width,t.height),c=l.data;for(let h=0;h<c.length;h++)c[h]=va(c[h]/255)*255;return s.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(va(i[s]/255)*255):i[s]=va(i[s]);return{data:i,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let KA=0;class c1{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:KA++}),this.uuid=hl(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let h=0,d=l.length;h<d;h++)l[h].isDataTexture?c.push(kh(l[h].image)):c.push(kh(l[h]))}else c=kh(l);s.url=c}return i||(t.images[this.uuid]=s),s}}function kh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?qA.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let jA=0;class Hn extends Fs{constructor(t=Hn.DEFAULT_IMAGE,i=Hn.DEFAULT_MAPPING,s=Ns,l=Ns,c=Hi,h=Us,d=wi,m=Sa,p=Hn.DEFAULT_ANISOTROPY,g=$a){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jA++}),this.uuid=hl(),this.name="",this.source=new c1(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=h,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=m,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new de,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(t.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Zv)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ud:t.x=t.x-Math.floor(t.x);break;case Ns:t.x=t.x<0?0:1;break;case Pd:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ud:t.y=t.y-Math.floor(t.y);break;case Ns:t.y=t.y<0?0:1;break;case Pd:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Hn.DEFAULT_IMAGE=null;Hn.DEFAULT_MAPPING=Zv;Hn.DEFAULT_ANISOTROPY=1;class en{constructor(t=0,i=0,s=0,l=1){en.prototype.isVector4=!0,this.x=t,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,s,l){return this.x=t,this.y=i,this.z=s,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=this.w,h=t.elements;return this.x=h[0]*i+h[4]*s+h[8]*l+h[12]*c,this.y=h[1]*i+h[5]*s+h[9]*l+h[13]*c,this.z=h[2]*i+h[6]*s+h[10]*l+h[14]*c,this.w=h[3]*i+h[7]*s+h[11]*l+h[15]*c,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,s,l,c;const m=t.elements,p=m[0],g=m[4],_=m[8],S=m[1],E=m[5],y=m[9],T=m[2],A=m[6],v=m[10];if(Math.abs(g-S)<.01&&Math.abs(_-T)<.01&&Math.abs(y-A)<.01){if(Math.abs(g+S)<.1&&Math.abs(_+T)<.1&&Math.abs(y+A)<.1&&Math.abs(p+E+v-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const D=(p+1)/2,O=(E+1)/2,H=(v+1)/2,B=(g+S)/4,P=(_+T)/4,V=(y+A)/4;return D>O&&D>H?D<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(D),l=B/s,c=P/s):O>H?O<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(O),s=B/l,c=V/l):H<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(H),s=P/c,l=V/c),this.set(s,l,c,i),this}let U=Math.sqrt((A-y)*(A-y)+(_-T)*(_-T)+(S-g)*(S-g));return Math.abs(U)<.001&&(U=1),this.x=(A-y)/U,this.y=(_-T)/U,this.z=(S-g)/U,this.w=Math.acos((p+E+v-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=ge(this.x,t.x,i.x),this.y=ge(this.y,t.y,i.y),this.z=ge(this.z,t.z,i.z),this.w=ge(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=ge(this.x,t,i),this.y=ge(this.y,t,i),this.z=ge(this.z,t,i),this.w=ge(this.w,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ge(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this.w=t.w+(i.w-t.w)*s,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ZA extends Fs{constructor(t=1,i=1,s={}){super(),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=1,this.scissor=new en(0,0,t,i),this.scissorTest=!1,this.viewport=new en(0,0,t,i);const l={width:t,height:i,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Hi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const c=new Hn(l,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);c.flipY=!1,c.generateMipmaps=s.generateMipmaps,c.internalFormat=s.internalFormat,this.textures=[];const h=s.count;for(let d=0;d<h;d++)this.textures[d]=c.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,s=1){if(this.width!==t||this.height!==i||this.depth!==s){this.width=t,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=s;this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let s=0,l=t.textures.length;s<l;s++)this.textures[s]=t.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;const i=Object.assign({},t.texture.image);return this.texture.source=new c1(i),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Is extends ZA{constructor(t=1,i=1,s={}){super(t,i,s),this.isWebGLRenderTarget=!0}}class u1 extends Hn{constructor(t=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=li,this.minFilter=li,this.wrapR=Ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class QA extends Hn{constructor(t=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=li,this.minFilter=li,this.wrapR=Ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vi{constructor(t=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=s,this._w=l}static slerpFlat(t,i,s,l,c,h,d){let m=s[l+0],p=s[l+1],g=s[l+2],_=s[l+3];const S=c[h+0],E=c[h+1],y=c[h+2],T=c[h+3];if(d===0){t[i+0]=m,t[i+1]=p,t[i+2]=g,t[i+3]=_;return}if(d===1){t[i+0]=S,t[i+1]=E,t[i+2]=y,t[i+3]=T;return}if(_!==T||m!==S||p!==E||g!==y){let A=1-d;const v=m*S+p*E+g*y+_*T,U=v>=0?1:-1,D=1-v*v;if(D>Number.EPSILON){const H=Math.sqrt(D),B=Math.atan2(H,v*U);A=Math.sin(A*B)/H,d=Math.sin(d*B)/H}const O=d*U;if(m=m*A+S*O,p=p*A+E*O,g=g*A+y*O,_=_*A+T*O,A===1-d){const H=1/Math.sqrt(m*m+p*p+g*g+_*_);m*=H,p*=H,g*=H,_*=H}}t[i]=m,t[i+1]=p,t[i+2]=g,t[i+3]=_}static multiplyQuaternionsFlat(t,i,s,l,c,h){const d=s[l],m=s[l+1],p=s[l+2],g=s[l+3],_=c[h],S=c[h+1],E=c[h+2],y=c[h+3];return t[i]=d*y+g*_+m*E-p*S,t[i+1]=m*y+g*S+p*_-d*E,t[i+2]=p*y+g*E+d*S-m*_,t[i+3]=g*y-d*_-m*S-p*E,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,s,l){return this._x=t,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const s=t._x,l=t._y,c=t._z,h=t._order,d=Math.cos,m=Math.sin,p=d(s/2),g=d(l/2),_=d(c/2),S=m(s/2),E=m(l/2),y=m(c/2);switch(h){case"XYZ":this._x=S*g*_+p*E*y,this._y=p*E*_-S*g*y,this._z=p*g*y+S*E*_,this._w=p*g*_-S*E*y;break;case"YXZ":this._x=S*g*_+p*E*y,this._y=p*E*_-S*g*y,this._z=p*g*y-S*E*_,this._w=p*g*_+S*E*y;break;case"ZXY":this._x=S*g*_-p*E*y,this._y=p*E*_+S*g*y,this._z=p*g*y+S*E*_,this._w=p*g*_-S*E*y;break;case"ZYX":this._x=S*g*_-p*E*y,this._y=p*E*_+S*g*y,this._z=p*g*y-S*E*_,this._w=p*g*_+S*E*y;break;case"YZX":this._x=S*g*_+p*E*y,this._y=p*E*_+S*g*y,this._z=p*g*y-S*E*_,this._w=p*g*_-S*E*y;break;case"XZY":this._x=S*g*_-p*E*y,this._y=p*E*_-S*g*y,this._z=p*g*y+S*E*_,this._w=p*g*_+S*E*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const s=i/2,l=Math.sin(s);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,s=i[0],l=i[4],c=i[8],h=i[1],d=i[5],m=i[9],p=i[2],g=i[6],_=i[10],S=s+d+_;if(S>0){const E=.5/Math.sqrt(S+1);this._w=.25/E,this._x=(g-m)*E,this._y=(c-p)*E,this._z=(h-l)*E}else if(s>d&&s>_){const E=2*Math.sqrt(1+s-d-_);this._w=(g-m)/E,this._x=.25*E,this._y=(l+h)/E,this._z=(c+p)/E}else if(d>_){const E=2*Math.sqrt(1+d-s-_);this._w=(c-p)/E,this._x=(l+h)/E,this._y=.25*E,this._z=(m+g)/E}else{const E=2*Math.sqrt(1+_-s-d);this._w=(h-l)/E,this._x=(c+p)/E,this._y=(m+g)/E,this._z=.25*E}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let s=t.dot(i)+1;return s<Number.EPSILON?(s=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=s):(this._x=0,this._y=-t.z,this._z=t.y,this._w=s)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=s),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ge(this.dot(t),-1,1)))}rotateTowards(t,i){const s=this.angleTo(t);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const s=t._x,l=t._y,c=t._z,h=t._w,d=i._x,m=i._y,p=i._z,g=i._w;return this._x=s*g+h*d+l*p-c*m,this._y=l*g+h*m+c*d-s*p,this._z=c*g+h*p+s*m-l*d,this._w=h*g-s*d-l*m-c*p,this._onChangeCallback(),this}slerp(t,i){if(i===0)return this;if(i===1)return this.copy(t);const s=this._x,l=this._y,c=this._z,h=this._w;let d=h*t._w+s*t._x+l*t._y+c*t._z;if(d<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,d=-d):this.copy(t),d>=1)return this._w=h,this._x=s,this._y=l,this._z=c,this;const m=1-d*d;if(m<=Number.EPSILON){const E=1-i;return this._w=E*h+i*this._w,this._x=E*s+i*this._x,this._y=E*l+i*this._y,this._z=E*c+i*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,d),_=Math.sin((1-i)*g)/p,S=Math.sin(i*g)/p;return this._w=h*_+this._w*S,this._x=s*_+this._x*S,this._y=l*_+this._y*S,this._z=c*_+this._z*S,this._onChangeCallback(),this}slerpQuaternions(t,i,s){return this.copy(t).slerp(i,s)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(t),l*Math.cos(t),c*Math.sin(i),c*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class K{constructor(t=0,i=0,s=0){K.prototype.isVector3=!0,this.x=t,this.y=i,this.z=s}set(t,i,s){return s===void 0&&(s=this.z),this.x=t,this.y=i,this.z=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(U_.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(U_.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=t.elements,h=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*h,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*h,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*h,this}applyQuaternion(t){const i=this.x,s=this.y,l=this.z,c=t.x,h=t.y,d=t.z,m=t.w,p=2*(h*l-d*s),g=2*(d*i-c*l),_=2*(c*s-h*i);return this.x=i+m*p+h*_-d*g,this.y=s+m*g+d*p-c*_,this.z=l+m*_+c*g-h*p,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=ge(this.x,t.x,i.x),this.y=ge(this.y,t.y,i.y),this.z=ge(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=ge(this.x,t,i),this.y=ge(this.y,t,i),this.z=ge(this.z,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ge(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const s=t.x,l=t.y,c=t.z,h=i.x,d=i.y,m=i.z;return this.x=l*m-c*d,this.y=c*h-s*m,this.z=s*d-l*h,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const s=t.dot(this)/i;return this.copy(t).multiplyScalar(s)}projectOnPlane(t){return Xh.copy(this).projectOnVector(t),this.sub(Xh)}reflect(t){return this.sub(Xh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(ge(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y,l=this.z-t.z;return i*i+s*s+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,s){const l=Math.sin(i)*t;return this.x=l*Math.sin(s),this.y=Math.cos(i)*t,this.z=l*Math.cos(s),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,s){return this.x=t*Math.sin(i),this.y=s,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),s=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(t),this.y=i,this.z=s*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xh=new K,U_=new Vi;class zs{constructor(t=new K(1/0,1/0,1/0),i=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i+=3)this.expandByPoint(bi.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,s=t.count;i<s;i++)this.expandByPoint(bi.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const s=bi.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(s),this.max.copy(t).add(s),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const s=t.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&t.isInstancedMesh!==!0)for(let h=0,d=c.count;h<d;h++)t.isMesh===!0?t.getVertexPosition(h,bi):bi.fromBufferAttribute(c,h),bi.applyMatrix4(t.matrixWorld),this.expandByPoint(bi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Tc.copy(t.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),Tc.copy(s.boundingBox)),Tc.applyMatrix4(t.matrixWorld),this.union(Tc)}const l=t.children;for(let c=0,h=l.length;c<h;c++)this.expandByObject(l[c],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,bi),bi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,s;return t.normal.x>0?(i=t.normal.x*this.min.x,s=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,s=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,s+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,s+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,s+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,s+=t.normal.z*this.min.z),i<=-t.constant&&s>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qo),Rc.subVectors(this.max,Qo),Ar.subVectors(t.a,Qo),Er.subVectors(t.b,Qo),yr.subVectors(t.c,Qo),Xa.subVectors(Er,Ar),Ya.subVectors(yr,Er),ys.subVectors(Ar,yr);let i=[0,-Xa.z,Xa.y,0,-Ya.z,Ya.y,0,-ys.z,ys.y,Xa.z,0,-Xa.x,Ya.z,0,-Ya.x,ys.z,0,-ys.x,-Xa.y,Xa.x,0,-Ya.y,Ya.x,0,-ys.y,ys.x,0];return!Yh(i,Ar,Er,yr,Rc)||(i=[1,0,0,0,1,0,0,0,1],!Yh(i,Ar,Er,yr,Rc))?!1:(bc.crossVectors(Xa,Ya),i=[bc.x,bc.y,bc.z],Yh(i,Ar,Er,yr,Rc))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,bi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(bi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(la[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),la[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),la[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),la[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),la[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),la[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),la[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),la[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(la),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const la=[new K,new K,new K,new K,new K,new K,new K,new K],bi=new K,Tc=new zs,Ar=new K,Er=new K,yr=new K,Xa=new K,Ya=new K,ys=new K,Qo=new K,Rc=new K,bc=new K,xs=new K;function Yh(r,t,i,s,l){for(let c=0,h=r.length-3;c<=h;c+=3){xs.fromArray(r,c);const d=l.x*Math.abs(xs.x)+l.y*Math.abs(xs.y)+l.z*Math.abs(xs.z),m=t.dot(xs),p=i.dot(xs),g=s.dot(xs);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>d)return!1}return!0}const JA=new zs,Jo=new K,Wh=new K;class Qr{constructor(t=new K,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const s=this.center;i!==void 0?s.copy(i):JA.setFromPoints(t).getCenter(s);let l=0;for(let c=0,h=t.length;c<h;c++)l=Math.max(l,s.distanceToSquared(t[c]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const s=this.center.distanceToSquared(t);return i.copy(t),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Jo.subVectors(t,this.center);const i=Jo.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Jo,l/s),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Wh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Jo.copy(t.center).add(Wh)),this.expandByPoint(Jo.copy(t.center).sub(Wh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ca=new K,qh=new K,Cc=new K,Wa=new K,Kh=new K,Oc=new K,jh=new K;class yu{constructor(t=new K,i=new K(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ca)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=ca.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(ca.copy(this.origin).addScaledVector(this.direction,i),ca.distanceToSquared(t))}distanceSqToSegment(t,i,s,l){qh.copy(t).add(i).multiplyScalar(.5),Cc.copy(i).sub(t).normalize(),Wa.copy(this.origin).sub(qh);const c=t.distanceTo(i)*.5,h=-this.direction.dot(Cc),d=Wa.dot(this.direction),m=-Wa.dot(Cc),p=Wa.lengthSq(),g=Math.abs(1-h*h);let _,S,E,y;if(g>0)if(_=h*m-d,S=h*d-m,y=c*g,_>=0)if(S>=-y)if(S<=y){const T=1/g;_*=T,S*=T,E=_*(_+h*S+2*d)+S*(h*_+S+2*m)+p}else S=c,_=Math.max(0,-(h*S+d)),E=-_*_+S*(S+2*m)+p;else S=-c,_=Math.max(0,-(h*S+d)),E=-_*_+S*(S+2*m)+p;else S<=-y?(_=Math.max(0,-(-h*c+d)),S=_>0?-c:Math.min(Math.max(-c,-m),c),E=-_*_+S*(S+2*m)+p):S<=y?(_=0,S=Math.min(Math.max(-c,-m),c),E=S*(S+2*m)+p):(_=Math.max(0,-(h*c+d)),S=_>0?c:Math.min(Math.max(-c,-m),c),E=-_*_+S*(S+2*m)+p);else S=h>0?-c:c,_=Math.max(0,-(h*S+d)),E=-_*_+S*(S+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,_),l&&l.copy(qh).addScaledVector(Cc,S),E}intersectSphere(t,i){ca.subVectors(t.center,this.origin);const s=ca.dot(this.direction),l=ca.dot(ca)-s*s,c=t.radius*t.radius;if(l>c)return null;const h=Math.sqrt(c-l),d=s-h,m=s+h;return m<0?null:d<0?this.at(m,i):this.at(d,i)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(t.normal)+t.constant)/i;return s>=0?s:null}intersectPlane(t,i){const s=this.distanceToPlane(t);return s===null?null:this.at(s,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let s,l,c,h,d,m;const p=1/this.direction.x,g=1/this.direction.y,_=1/this.direction.z,S=this.origin;return p>=0?(s=(t.min.x-S.x)*p,l=(t.max.x-S.x)*p):(s=(t.max.x-S.x)*p,l=(t.min.x-S.x)*p),g>=0?(c=(t.min.y-S.y)*g,h=(t.max.y-S.y)*g):(c=(t.max.y-S.y)*g,h=(t.min.y-S.y)*g),s>h||c>l||((c>s||isNaN(s))&&(s=c),(h<l||isNaN(l))&&(l=h),_>=0?(d=(t.min.z-S.z)*_,m=(t.max.z-S.z)*_):(d=(t.max.z-S.z)*_,m=(t.min.z-S.z)*_),s>m||d>l)||((d>s||s!==s)&&(s=d),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(t){return this.intersectBox(t,ca)!==null}intersectTriangle(t,i,s,l,c){Kh.subVectors(i,t),Oc.subVectors(s,t),jh.crossVectors(Kh,Oc);let h=this.direction.dot(jh),d;if(h>0){if(l)return null;d=1}else if(h<0)d=-1,h=-h;else return null;Wa.subVectors(this.origin,t);const m=d*this.direction.dot(Oc.crossVectors(Wa,Oc));if(m<0)return null;const p=d*this.direction.dot(Kh.cross(Wa));if(p<0||m+p>h)return null;const g=-d*Wa.dot(jh);return g<0?null:this.at(g/h,c)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ue{constructor(t,i,s,l,c,h,d,m,p,g,_,S,E,y,T,A){Ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,h,d,m,p,g,_,S,E,y,T,A)}set(t,i,s,l,c,h,d,m,p,g,_,S,E,y,T,A){const v=this.elements;return v[0]=t,v[4]=i,v[8]=s,v[12]=l,v[1]=c,v[5]=h,v[9]=d,v[13]=m,v[2]=p,v[6]=g,v[10]=_,v[14]=S,v[3]=E,v[7]=y,v[11]=T,v[15]=A,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ue().fromArray(this.elements)}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(t){const i=this.elements,s=t.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,s){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(t,i,s){return this.set(t.x,i.x,s.x,0,t.y,i.y,s.y,0,t.z,i.z,s.z,0,0,0,0,1),this}extractRotation(t){const i=this.elements,s=t.elements,l=1/xr.setFromMatrixColumn(t,0).length(),c=1/xr.setFromMatrixColumn(t,1).length(),h=1/xr.setFromMatrixColumn(t,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*h,i[9]=s[9]*h,i[10]=s[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,s=t.x,l=t.y,c=t.z,h=Math.cos(s),d=Math.sin(s),m=Math.cos(l),p=Math.sin(l),g=Math.cos(c),_=Math.sin(c);if(t.order==="XYZ"){const S=h*g,E=h*_,y=d*g,T=d*_;i[0]=m*g,i[4]=-m*_,i[8]=p,i[1]=E+y*p,i[5]=S-T*p,i[9]=-d*m,i[2]=T-S*p,i[6]=y+E*p,i[10]=h*m}else if(t.order==="YXZ"){const S=m*g,E=m*_,y=p*g,T=p*_;i[0]=S+T*d,i[4]=y*d-E,i[8]=h*p,i[1]=h*_,i[5]=h*g,i[9]=-d,i[2]=E*d-y,i[6]=T+S*d,i[10]=h*m}else if(t.order==="ZXY"){const S=m*g,E=m*_,y=p*g,T=p*_;i[0]=S-T*d,i[4]=-h*_,i[8]=y+E*d,i[1]=E+y*d,i[5]=h*g,i[9]=T-S*d,i[2]=-h*p,i[6]=d,i[10]=h*m}else if(t.order==="ZYX"){const S=h*g,E=h*_,y=d*g,T=d*_;i[0]=m*g,i[4]=y*p-E,i[8]=S*p+T,i[1]=m*_,i[5]=T*p+S,i[9]=E*p-y,i[2]=-p,i[6]=d*m,i[10]=h*m}else if(t.order==="YZX"){const S=h*m,E=h*p,y=d*m,T=d*p;i[0]=m*g,i[4]=T-S*_,i[8]=y*_+E,i[1]=_,i[5]=h*g,i[9]=-d*g,i[2]=-p*g,i[6]=E*_+y,i[10]=S-T*_}else if(t.order==="XZY"){const S=h*m,E=h*p,y=d*m,T=d*p;i[0]=m*g,i[4]=-_,i[8]=p*g,i[1]=S*_+T,i[5]=h*g,i[9]=E*_-y,i[2]=y*_-E,i[6]=d*g,i[10]=T*_+S}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose($A,t,tE)}lookAt(t,i,s){const l=this.elements;return ri.subVectors(t,i),ri.lengthSq()===0&&(ri.z=1),ri.normalize(),qa.crossVectors(s,ri),qa.lengthSq()===0&&(Math.abs(s.z)===1?ri.x+=1e-4:ri.z+=1e-4,ri.normalize(),qa.crossVectors(s,ri)),qa.normalize(),Lc.crossVectors(ri,qa),l[0]=qa.x,l[4]=Lc.x,l[8]=ri.x,l[1]=qa.y,l[5]=Lc.y,l[9]=ri.y,l[2]=qa.z,l[6]=Lc.z,l[10]=ri.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,h=s[0],d=s[4],m=s[8],p=s[12],g=s[1],_=s[5],S=s[9],E=s[13],y=s[2],T=s[6],A=s[10],v=s[14],U=s[3],D=s[7],O=s[11],H=s[15],B=l[0],P=l[4],V=l[8],L=l[12],C=l[1],z=l[5],nt=l[9],$=l[13],ct=l[2],ft=l[6],I=l[10],k=l[14],q=l[3],_t=l[7],Tt=l[11],N=l[15];return c[0]=h*B+d*C+m*ct+p*q,c[4]=h*P+d*z+m*ft+p*_t,c[8]=h*V+d*nt+m*I+p*Tt,c[12]=h*L+d*$+m*k+p*N,c[1]=g*B+_*C+S*ct+E*q,c[5]=g*P+_*z+S*ft+E*_t,c[9]=g*V+_*nt+S*I+E*Tt,c[13]=g*L+_*$+S*k+E*N,c[2]=y*B+T*C+A*ct+v*q,c[6]=y*P+T*z+A*ft+v*_t,c[10]=y*V+T*nt+A*I+v*Tt,c[14]=y*L+T*$+A*k+v*N,c[3]=U*B+D*C+O*ct+H*q,c[7]=U*P+D*z+O*ft+H*_t,c[11]=U*V+D*nt+O*I+H*Tt,c[15]=U*L+D*$+O*k+H*N,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[4],l=t[8],c=t[12],h=t[1],d=t[5],m=t[9],p=t[13],g=t[2],_=t[6],S=t[10],E=t[14],y=t[3],T=t[7],A=t[11],v=t[15];return y*(+c*m*_-l*p*_-c*d*S+s*p*S+l*d*E-s*m*E)+T*(+i*m*E-i*p*S+c*h*S-l*h*E+l*p*g-c*m*g)+A*(+i*p*_-i*d*E-c*h*_+s*h*E+c*d*g-s*p*g)+v*(-l*d*g-i*m*_+i*d*S+l*h*_-s*h*S+s*m*g)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,s){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=s),this}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],d=t[5],m=t[6],p=t[7],g=t[8],_=t[9],S=t[10],E=t[11],y=t[12],T=t[13],A=t[14],v=t[15],U=_*A*p-T*S*p+T*m*E-d*A*E-_*m*v+d*S*v,D=y*S*p-g*A*p-y*m*E+h*A*E+g*m*v-h*S*v,O=g*T*p-y*_*p+y*d*E-h*T*E-g*d*v+h*_*v,H=y*_*m-g*T*m-y*d*S+h*T*S+g*d*A-h*_*A,B=i*U+s*D+l*O+c*H;if(B===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/B;return t[0]=U*P,t[1]=(T*S*c-_*A*c-T*l*E+s*A*E+_*l*v-s*S*v)*P,t[2]=(d*A*c-T*m*c+T*l*p-s*A*p-d*l*v+s*m*v)*P,t[3]=(_*m*c-d*S*c-_*l*p+s*S*p+d*l*E-s*m*E)*P,t[4]=D*P,t[5]=(g*A*c-y*S*c+y*l*E-i*A*E-g*l*v+i*S*v)*P,t[6]=(y*m*c-h*A*c-y*l*p+i*A*p+h*l*v-i*m*v)*P,t[7]=(h*S*c-g*m*c+g*l*p-i*S*p-h*l*E+i*m*E)*P,t[8]=O*P,t[9]=(y*_*c-g*T*c-y*s*E+i*T*E+g*s*v-i*_*v)*P,t[10]=(h*T*c-y*d*c+y*s*p-i*T*p-h*s*v+i*d*v)*P,t[11]=(g*d*c-h*_*c-g*s*p+i*_*p+h*s*E-i*d*E)*P,t[12]=H*P,t[13]=(g*T*l-y*_*l+y*s*S-i*T*S-g*s*A+i*_*A)*P,t[14]=(y*d*l-h*T*l-y*s*m+i*T*m+h*s*A-i*d*A)*P,t[15]=(h*_*l-g*d*l+g*s*m-i*_*m-h*s*S+i*d*S)*P,this}scale(t){const i=this.elements,s=t.x,l=t.y,c=t.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],s=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(t,i,s){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),s=Math.sin(t);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,h=t.x,d=t.y,m=t.z,p=c*h,g=c*d;return this.set(p*h+s,p*d-l*m,p*m+l*d,0,p*d+l*m,g*d+s,g*m-l*h,0,p*m-l*d,g*m+l*h,c*m*m+s,0,0,0,0,1),this}makeScale(t,i,s){return this.set(t,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(t,i,s,l,c,h){return this.set(1,s,c,0,t,1,h,0,i,l,1,0,0,0,0,1),this}compose(t,i,s){const l=this.elements,c=i._x,h=i._y,d=i._z,m=i._w,p=c+c,g=h+h,_=d+d,S=c*p,E=c*g,y=c*_,T=h*g,A=h*_,v=d*_,U=m*p,D=m*g,O=m*_,H=s.x,B=s.y,P=s.z;return l[0]=(1-(T+v))*H,l[1]=(E+O)*H,l[2]=(y-D)*H,l[3]=0,l[4]=(E-O)*B,l[5]=(1-(S+v))*B,l[6]=(A+U)*B,l[7]=0,l[8]=(y+D)*P,l[9]=(A-U)*P,l[10]=(1-(S+T))*P,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,s){const l=this.elements;let c=xr.set(l[0],l[1],l[2]).length();const h=xr.set(l[4],l[5],l[6]).length(),d=xr.set(l[8],l[9],l[10]).length();this.determinant()<0&&(c=-c),t.x=l[12],t.y=l[13],t.z=l[14],Ci.copy(this);const p=1/c,g=1/h,_=1/d;return Ci.elements[0]*=p,Ci.elements[1]*=p,Ci.elements[2]*=p,Ci.elements[4]*=g,Ci.elements[5]*=g,Ci.elements[6]*=g,Ci.elements[8]*=_,Ci.elements[9]*=_,Ci.elements[10]*=_,i.setFromRotationMatrix(Ci),s.x=c,s.y=h,s.z=d,this}makePerspective(t,i,s,l,c,h,d=_a){const m=this.elements,p=2*c/(i-t),g=2*c/(s-l),_=(i+t)/(i-t),S=(s+l)/(s-l);let E,y;if(d===_a)E=-(h+c)/(h-c),y=-2*h*c/(h-c);else if(d===cu)E=-h/(h-c),y=-h*c/(h-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return m[0]=p,m[4]=0,m[8]=_,m[12]=0,m[1]=0,m[5]=g,m[9]=S,m[13]=0,m[2]=0,m[6]=0,m[10]=E,m[14]=y,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(t,i,s,l,c,h,d=_a){const m=this.elements,p=1/(i-t),g=1/(s-l),_=1/(h-c),S=(i+t)*p,E=(s+l)*g;let y,T;if(d===_a)y=(h+c)*_,T=-2*_;else if(d===cu)y=c*_,T=-1*_;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-S,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-E,m[2]=0,m[6]=0,m[10]=T,m[14]=-y,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<16;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t[i+9]=s[9],t[i+10]=s[10],t[i+11]=s[11],t[i+12]=s[12],t[i+13]=s[13],t[i+14]=s[14],t[i+15]=s[15],t}}const xr=new K,Ci=new Ue,$A=new K(0,0,0),tE=new K(1,1,1),qa=new K,Lc=new K,ri=new K,P_=new Ue,I_=new Vi;class ki{constructor(t=0,i=0,s=0,l=ki.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,s,l=this._order){return this._x=t,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,s=!0){const l=t.elements,c=l[0],h=l[4],d=l[8],m=l[1],p=l[5],g=l[9],_=l[2],S=l[6],E=l[10];switch(i){case"XYZ":this._y=Math.asin(ge(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,E),this._z=Math.atan2(-h,c)):(this._x=Math.atan2(S,p),this._z=0);break;case"YXZ":this._x=Math.asin(-ge(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,E),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-_,c),this._z=0);break;case"ZXY":this._x=Math.asin(ge(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-_,E),this._z=Math.atan2(-h,p)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-ge(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(S,E),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-h,p));break;case"YZX":this._z=Math.asin(ge(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-_,c)):(this._x=0,this._y=Math.atan2(d,E));break;case"XZY":this._z=Math.asin(-ge(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(S,p),this._y=Math.atan2(d,c)):(this._x=Math.atan2(-g,E),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,s){return P_.makeRotationFromQuaternion(t),this.setFromRotationMatrix(P_,i,s)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return I_.setFromEuler(this),this.setFromQuaternion(I_,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ki.DEFAULT_ORDER="XYZ";class bp{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let eE=0;const B_=new K,Tr=new Vi,ua=new Ue,wc=new K,$o=new K,nE=new K,iE=new Vi,F_=new K(1,0,0),z_=new K(0,1,0),H_=new K(0,0,1),G_={type:"added"},aE={type:"removed"},Rr={type:"childadded",child:null},Zh={type:"childremoved",child:null};class En extends Fs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:eE++}),this.uuid=hl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=En.DEFAULT_UP.clone();const t=new K,i=new ki,s=new Vi,l=new K(1,1,1);function c(){s.setFromEuler(i,!1)}function h(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new Ue},normalMatrix:{value:new de}}),this.matrix=new Ue,this.matrixWorld=new Ue,this.matrixAutoUpdate=En.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=En.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return Tr.setFromAxisAngle(t,i),this.quaternion.multiply(Tr),this}rotateOnWorldAxis(t,i){return Tr.setFromAxisAngle(t,i),this.quaternion.premultiply(Tr),this}rotateX(t){return this.rotateOnAxis(F_,t)}rotateY(t){return this.rotateOnAxis(z_,t)}rotateZ(t){return this.rotateOnAxis(H_,t)}translateOnAxis(t,i){return B_.copy(t).applyQuaternion(this.quaternion),this.position.add(B_.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(F_,t)}translateY(t){return this.translateOnAxis(z_,t)}translateZ(t){return this.translateOnAxis(H_,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ua.copy(this.matrixWorld).invert())}lookAt(t,i,s){t.isVector3?wc.copy(t):wc.set(t,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),$o.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ua.lookAt($o,wc,this.up):ua.lookAt(wc,$o,this.up),this.quaternion.setFromRotationMatrix(ua),l&&(ua.extractRotation(l.matrixWorld),Tr.setFromRotationMatrix(ua),this.quaternion.premultiply(Tr.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(G_),Rr.child=t,this.dispatchEvent(Rr),Rr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(aE),Zh.child=t,this.dispatchEvent(Zh),Zh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ua.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ua.multiply(t.parent.matrixWorld)),t.applyMatrix4(ua),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(G_),Rr.child=t,this.dispatchEvent(Rr),Rr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const h=this.children[s].getObjectByProperty(t,i);if(h!==void 0)return h}}getObjectsByProperty(t,i,s=[]){this[t]===i&&s.push(this);const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].getObjectsByProperty(t,i,s);return s}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($o,t,nE),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($o,iE,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(t)}updateWorldMatrix(t,i){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",s={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function c(d,m){return d[m.uuid]===void 0&&(d[m.uuid]=m.toJSON(t)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(t.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const m=d.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const _=m[p];c(t.shapes,_)}else c(t.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let m=0,p=this.material.length;m<p;m++)d.push(c(t.materials,this.material[m]));l.material=d}else l.material=c(t.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const m=this.animations[d];l.animations.push(c(t.animations,m))}}if(i){const d=h(t.geometries),m=h(t.materials),p=h(t.textures),g=h(t.images),_=h(t.shapes),S=h(t.skeletons),E=h(t.animations),y=h(t.nodes);d.length>0&&(s.geometries=d),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),g.length>0&&(s.images=g),_.length>0&&(s.shapes=_),S.length>0&&(s.skeletons=S),E.length>0&&(s.animations=E),y.length>0&&(s.nodes=y)}return s.object=l,s;function h(d){const m=[];for(const p in d){const g=d[p];delete g.metadata,m.push(g)}return m}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let s=0;s<t.children.length;s++){const l=t.children[s];this.add(l.clone())}return this}}En.DEFAULT_UP=new K(0,1,0);En.DEFAULT_MATRIX_AUTO_UPDATE=!0;En.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Oi=new K,fa=new K,Qh=new K,ha=new K,br=new K,Cr=new K,V_=new K,Jh=new K,$h=new K,td=new K,ed=new en,nd=new en,id=new en;class Li{constructor(t=new K,i=new K,s=new K){this.a=t,this.b=i,this.c=s}static getNormal(t,i,s,l){l.subVectors(s,i),Oi.subVectors(t,i),l.cross(Oi);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(t,i,s,l,c){Oi.subVectors(l,i),fa.subVectors(s,i),Qh.subVectors(t,i);const h=Oi.dot(Oi),d=Oi.dot(fa),m=Oi.dot(Qh),p=fa.dot(fa),g=fa.dot(Qh),_=h*p-d*d;if(_===0)return c.set(0,0,0),null;const S=1/_,E=(p*m-d*g)*S,y=(h*g-d*m)*S;return c.set(1-E-y,y,E)}static containsPoint(t,i,s,l){return this.getBarycoord(t,i,s,l,ha)===null?!1:ha.x>=0&&ha.y>=0&&ha.x+ha.y<=1}static getInterpolation(t,i,s,l,c,h,d,m){return this.getBarycoord(t,i,s,l,ha)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,ha.x),m.addScaledVector(h,ha.y),m.addScaledVector(d,ha.z),m)}static getInterpolatedAttribute(t,i,s,l,c,h){return ed.setScalar(0),nd.setScalar(0),id.setScalar(0),ed.fromBufferAttribute(t,i),nd.fromBufferAttribute(t,s),id.fromBufferAttribute(t,l),h.setScalar(0),h.addScaledVector(ed,c.x),h.addScaledVector(nd,c.y),h.addScaledVector(id,c.z),h}static isFrontFacing(t,i,s,l){return Oi.subVectors(s,i),fa.subVectors(t,i),Oi.cross(fa).dot(l)<0}set(t,i,s){return this.a.copy(t),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(t,i,s,l){return this.a.copy(t[i]),this.b.copy(t[s]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,s,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,s),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Oi.subVectors(this.c,this.b),fa.subVectors(this.a,this.b),Oi.cross(fa).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Li.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Li.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,s,l,c){return Li.getInterpolation(t,this.a,this.b,this.c,i,s,l,c)}containsPoint(t){return Li.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Li.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const s=this.a,l=this.b,c=this.c;let h,d;br.subVectors(l,s),Cr.subVectors(c,s),Jh.subVectors(t,s);const m=br.dot(Jh),p=Cr.dot(Jh);if(m<=0&&p<=0)return i.copy(s);$h.subVectors(t,l);const g=br.dot($h),_=Cr.dot($h);if(g>=0&&_<=g)return i.copy(l);const S=m*_-g*p;if(S<=0&&m>=0&&g<=0)return h=m/(m-g),i.copy(s).addScaledVector(br,h);td.subVectors(t,c);const E=br.dot(td),y=Cr.dot(td);if(y>=0&&E<=y)return i.copy(c);const T=E*p-m*y;if(T<=0&&p>=0&&y<=0)return d=p/(p-y),i.copy(s).addScaledVector(Cr,d);const A=g*y-E*_;if(A<=0&&_-g>=0&&E-y>=0)return V_.subVectors(c,l),d=(_-g)/(_-g+(E-y)),i.copy(l).addScaledVector(V_,d);const v=1/(A+T+S);return h=T*v,d=S*v,i.copy(s).addScaledVector(br,h).addScaledVector(Cr,d)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const f1={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ka={h:0,s:0,l:0},Dc={h:0,s:0,l:0};function ad(r,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(t-r)*6*i:i<1/2?t:i<2/3?r+(t-r)*6*(2/3-i):r}class me{constructor(t,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,s)}set(t,i,s){if(i===void 0&&s===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,s);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=Si){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,De.toWorkingColorSpace(this,i),this}setRGB(t,i,s,l=De.workingColorSpace){return this.r=t,this.g=i,this.b=s,De.toWorkingColorSpace(this,l),this}setHSL(t,i,s,l=De.workingColorSpace){if(t=HA(t,1),i=ge(i,0,1),s=ge(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,h=2*s-c;this.r=ad(h,c,t+1/3),this.g=ad(h,c,t),this.b=ad(h,c,t-1/3)}return De.toWorkingColorSpace(this,l),this}setStyle(t,i=Si){function s(c){c!==void 0&&parseFloat(c)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let c;const h=l[1],d=l[2];switch(h){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const c=l[1],h=c.length;if(h===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(c,16),i);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=Si){const s=f1[t.toLowerCase()];return s!==void 0?this.setHex(s,i):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=va(t.r),this.g=va(t.g),this.b=va(t.b),this}copyLinearToSRGB(t){return this.r=kr(t.r),this.g=kr(t.g),this.b=kr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Si){return De.fromWorkingColorSpace(Un.copy(this),t),Math.round(ge(Un.r*255,0,255))*65536+Math.round(ge(Un.g*255,0,255))*256+Math.round(ge(Un.b*255,0,255))}getHexString(t=Si){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=De.workingColorSpace){De.fromWorkingColorSpace(Un.copy(this),i);const s=Un.r,l=Un.g,c=Un.b,h=Math.max(s,l,c),d=Math.min(s,l,c);let m,p;const g=(d+h)/2;if(d===h)m=0,p=0;else{const _=h-d;switch(p=g<=.5?_/(h+d):_/(2-h-d),h){case s:m=(l-c)/_+(l<c?6:0);break;case l:m=(c-s)/_+2;break;case c:m=(s-l)/_+4;break}m/=6}return t.h=m,t.s=p,t.l=g,t}getRGB(t,i=De.workingColorSpace){return De.fromWorkingColorSpace(Un.copy(this),i),t.r=Un.r,t.g=Un.g,t.b=Un.b,t}getStyle(t=Si){De.fromWorkingColorSpace(Un.copy(this),t);const i=Un.r,s=Un.g,l=Un.b;return t!==Si?`color(${t} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(t,i,s){return this.getHSL(Ka),this.setHSL(Ka.h+t,Ka.s+i,Ka.l+s)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,s){return this.r=t.r+(i.r-t.r)*s,this.g=t.g+(i.g-t.g)*s,this.b=t.b+(i.b-t.b)*s,this}lerpHSL(t,i){this.getHSL(Ka),t.getHSL(Dc);const s=Gh(Ka.h,Dc.h,i),l=Gh(Ka.s,Dc.s,i),c=Gh(Ka.l,Dc.l,i);return this.setHSL(s,l,c),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,s=this.g,l=this.b,c=t.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Un=new me;me.NAMES=f1;let sE=0;class Jr extends Fs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sE++}),this.uuid=hl(),this.name="",this.type="Material",this.blending=Gr,this.side=is,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yd,this.blendDst=xd,this.blendEquation=ws,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new me(0,0,0),this.blendAlpha=0,this.depthFunc=Xr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=O_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Sr,this.stencilZFail=Sr,this.stencilZPass=Sr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const s=t[i];if(s===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(t).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(t).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(t).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(t).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(t).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Gr&&(s.blending=this.blending),this.side!==is&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==yd&&(s.blendSrc=this.blendSrc),this.blendDst!==xd&&(s.blendDst=this.blendDst),this.blendEquation!==ws&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==Xr&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==O_&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Sr&&(s.stencilFail=this.stencilFail),this.stencilZFail!==Sr&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==Sr&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const h=[];for(const d in c){const m=c[d];delete m.metadata,h.push(m)}return h}if(i){const c=l(t.textures),h=l(t.images);c.length>0&&(s.textures=c),h.length>0&&(s.images=h)}return s}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Cp extends Jr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ki,this.combine=jv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const un=new K,Nc=new oe;class Ln{constructor(t,i,s=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=s,this.usage=lu,this.updateRanges=[],this.gpuType=Gi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,s){t*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[t+l]=i.array[s+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)Nc.fromBufferAttribute(this,i),Nc.applyMatrix3(t),this.setXY(i,Nc.x,Nc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)un.fromBufferAttribute(this,i),un.applyMatrix3(t),this.setXYZ(i,un.x,un.y,un.z);return this}applyMatrix4(t){for(let i=0,s=this.count;i<s;i++)un.fromBufferAttribute(this,i),un.applyMatrix4(t),this.setXYZ(i,un.x,un.y,un.z);return this}applyNormalMatrix(t){for(let i=0,s=this.count;i<s;i++)un.fromBufferAttribute(this,i),un.applyNormalMatrix(t),this.setXYZ(i,un.x,un.y,un.z);return this}transformDirection(t){for(let i=0,s=this.count;i<s;i++)un.fromBufferAttribute(this,i),un.transformDirection(t),this.setXYZ(i,un.x,un.y,un.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let s=this.array[t*this.itemSize+i];return this.normalized&&(s=Zo(s,this.array)),s}setComponent(t,i,s){return this.normalized&&(s=Zn(s,this.array)),this.array[t*this.itemSize+i]=s,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Zo(i,this.array)),i}setX(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Zo(i,this.array)),i}setY(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Zo(i,this.array)),i}setZ(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Zo(i,this.array)),i}setW(t,i){return this.normalized&&(i=Zn(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,s){return t*=this.itemSize,this.normalized&&(i=Zn(i,this.array),s=Zn(s,this.array)),this.array[t+0]=i,this.array[t+1]=s,this}setXYZ(t,i,s,l){return t*=this.itemSize,this.normalized&&(i=Zn(i,this.array),s=Zn(s,this.array),l=Zn(l,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this}setXYZW(t,i,s,l,c){return t*=this.itemSize,this.normalized&&(i=Zn(i,this.array),s=Zn(s,this.array),l=Zn(l,this.array),c=Zn(c,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this.array[t+3]=c,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==lu&&(t.usage=this.usage),t}}class h1 extends Ln{constructor(t,i,s){super(new Uint16Array(t),i,s)}}class d1 extends Ln{constructor(t,i,s){super(new Uint32Array(t),i,s)}}class Gn extends Ln{constructor(t,i,s){super(new Float32Array(t),i,s)}}let rE=0;const vi=new Ue,sd=new En,Or=new K,oi=new zs,tl=new zs,Sn=new K;class ci extends Fs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rE++}),this.uuid=hl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(l1(t)?d1:h1)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,s=0){this.groups.push({start:t,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new de().getNormalMatrix(t);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return vi.makeRotationFromQuaternion(t),this.applyMatrix4(vi),this}rotateX(t){return vi.makeRotationX(t),this.applyMatrix4(vi),this}rotateY(t){return vi.makeRotationY(t),this.applyMatrix4(vi),this}rotateZ(t){return vi.makeRotationZ(t),this.applyMatrix4(vi),this}translate(t,i,s){return vi.makeTranslation(t,i,s),this.applyMatrix4(vi),this}scale(t,i,s){return vi.makeScale(t,i,s),this.applyMatrix4(vi),this}lookAt(t){return sd.lookAt(t),sd.updateMatrix(),this.applyMatrix4(sd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Or).negate(),this.translate(Or.x,Or.y,Or.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=t.length;l<c;l++){const h=t[l];s.push(h.x,h.y,h.z||0)}this.setAttribute("position",new Gn(s,3))}else{const s=Math.min(t.length,i.count);for(let l=0;l<s;l++){const c=t[l];i.setXYZ(l,c.x,c.y,c.z||0)}t.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zs);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];oi.setFromBufferAttribute(c),this.morphTargetsRelative?(Sn.addVectors(this.boundingBox.min,oi.min),this.boundingBox.expandByPoint(Sn),Sn.addVectors(this.boundingBox.max,oi.max),this.boundingBox.expandByPoint(Sn)):(this.boundingBox.expandByPoint(oi.min),this.boundingBox.expandByPoint(oi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qr);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new K,1/0);return}if(t){const s=this.boundingSphere.center;if(oi.setFromBufferAttribute(t),i)for(let c=0,h=i.length;c<h;c++){const d=i[c];tl.setFromBufferAttribute(d),this.morphTargetsRelative?(Sn.addVectors(oi.min,tl.min),oi.expandByPoint(Sn),Sn.addVectors(oi.max,tl.max),oi.expandByPoint(Sn)):(oi.expandByPoint(tl.min),oi.expandByPoint(tl.max))}oi.getCenter(s);let l=0;for(let c=0,h=t.count;c<h;c++)Sn.fromBufferAttribute(t,c),l=Math.max(l,s.distanceToSquared(Sn));if(i)for(let c=0,h=i.length;c<h;c++){const d=i[c],m=this.morphTargetsRelative;for(let p=0,g=d.count;p<g;p++)Sn.fromBufferAttribute(d,p),m&&(Or.fromBufferAttribute(t,p),Sn.add(Or)),l=Math.max(l,s.distanceToSquared(Sn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ln(new Float32Array(4*s.count),4));const h=this.getAttribute("tangent"),d=[],m=[];for(let V=0;V<s.count;V++)d[V]=new K,m[V]=new K;const p=new K,g=new K,_=new K,S=new oe,E=new oe,y=new oe,T=new K,A=new K;function v(V,L,C){p.fromBufferAttribute(s,V),g.fromBufferAttribute(s,L),_.fromBufferAttribute(s,C),S.fromBufferAttribute(c,V),E.fromBufferAttribute(c,L),y.fromBufferAttribute(c,C),g.sub(p),_.sub(p),E.sub(S),y.sub(S);const z=1/(E.x*y.y-y.x*E.y);isFinite(z)&&(T.copy(g).multiplyScalar(y.y).addScaledVector(_,-E.y).multiplyScalar(z),A.copy(_).multiplyScalar(E.x).addScaledVector(g,-y.x).multiplyScalar(z),d[V].add(T),d[L].add(T),d[C].add(T),m[V].add(A),m[L].add(A),m[C].add(A))}let U=this.groups;U.length===0&&(U=[{start:0,count:t.count}]);for(let V=0,L=U.length;V<L;++V){const C=U[V],z=C.start,nt=C.count;for(let $=z,ct=z+nt;$<ct;$+=3)v(t.getX($+0),t.getX($+1),t.getX($+2))}const D=new K,O=new K,H=new K,B=new K;function P(V){H.fromBufferAttribute(l,V),B.copy(H);const L=d[V];D.copy(L),D.sub(H.multiplyScalar(H.dot(L))).normalize(),O.crossVectors(B,L);const z=O.dot(m[V])<0?-1:1;h.setXYZW(V,D.x,D.y,D.z,z)}for(let V=0,L=U.length;V<L;++V){const C=U[V],z=C.start,nt=C.count;for(let $=z,ct=z+nt;$<ct;$+=3)P(t.getX($+0)),P(t.getX($+1)),P(t.getX($+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Ln(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let S=0,E=s.count;S<E;S++)s.setXYZ(S,0,0,0);const l=new K,c=new K,h=new K,d=new K,m=new K,p=new K,g=new K,_=new K;if(t)for(let S=0,E=t.count;S<E;S+=3){const y=t.getX(S+0),T=t.getX(S+1),A=t.getX(S+2);l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,A),g.subVectors(h,c),_.subVectors(l,c),g.cross(_),d.fromBufferAttribute(s,y),m.fromBufferAttribute(s,T),p.fromBufferAttribute(s,A),d.add(g),m.add(g),p.add(g),s.setXYZ(y,d.x,d.y,d.z),s.setXYZ(T,m.x,m.y,m.z),s.setXYZ(A,p.x,p.y,p.z)}else for(let S=0,E=i.count;S<E;S+=3)l.fromBufferAttribute(i,S+0),c.fromBufferAttribute(i,S+1),h.fromBufferAttribute(i,S+2),g.subVectors(h,c),_.subVectors(l,c),g.cross(_),s.setXYZ(S+0,g.x,g.y,g.z),s.setXYZ(S+1,g.x,g.y,g.z),s.setXYZ(S+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,s=t.count;i<s;i++)Sn.fromBufferAttribute(t,i),Sn.normalize(),t.setXYZ(i,Sn.x,Sn.y,Sn.z)}toNonIndexed(){function t(d,m){const p=d.array,g=d.itemSize,_=d.normalized,S=new p.constructor(m.length*g);let E=0,y=0;for(let T=0,A=m.length;T<A;T++){d.isInterleavedBufferAttribute?E=m[T]*d.data.stride+d.offset:E=m[T]*g;for(let v=0;v<g;v++)S[y++]=p[E++]}return new Ln(S,g,_)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new ci,s=this.index.array,l=this.attributes;for(const d in l){const m=l[d],p=t(m,s);i.setAttribute(d,p)}const c=this.morphAttributes;for(const d in c){const m=[],p=c[d];for(let g=0,_=p.length;g<_;g++){const S=p[g],E=t(S,s);m.push(E)}i.morphAttributes[d]=m}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let d=0,m=h.length;d<m;d++){const p=h[d];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(t[p]=m[p]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const p=s[m];t.data.attributes[m]=p.toJSON(t.data)}const l={};let c=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let _=0,S=p.length;_<S;_++){const E=p[_];g.push(E.toJSON(t.data))}g.length>0&&(l[m]=g,c=!0)}c&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(t.data.groups=JSON.parse(JSON.stringify(h)));const d=this.boundingSphere;return d!==null&&(t.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const s=t.index;s!==null&&this.setIndex(s.clone(i));const l=t.attributes;for(const p in l){const g=l[p];this.setAttribute(p,g.clone(i))}const c=t.morphAttributes;for(const p in c){const g=[],_=c[p];for(let S=0,E=_.length;S<E;S++)g.push(_[S].clone(i));this.morphAttributes[p]=g}this.morphTargetsRelative=t.morphTargetsRelative;const h=t.groups;for(let p=0,g=h.length;p<g;p++){const _=h[p];this.addGroup(_.start,_.count,_.materialIndex)}const d=t.boundingBox;d!==null&&(this.boundingBox=d.clone());const m=t.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const k_=new Ue,Ts=new yu,Uc=new Qr,X_=new K,Pc=new K,Ic=new K,Bc=new K,rd=new K,Fc=new K,Y_=new K,zc=new K;class zn extends En{constructor(t=new ci,i=new Cp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}getVertexPosition(t,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,h=s.morphTargetsRelative;i.fromBufferAttribute(l,t);const d=this.morphTargetInfluences;if(c&&d){Fc.set(0,0,0);for(let m=0,p=c.length;m<p;m++){const g=d[m],_=c[m];g!==0&&(rd.fromBufferAttribute(_,t),h?Fc.addScaledVector(rd,g):Fc.addScaledVector(rd.sub(i),g))}i.add(Fc)}return i}raycast(t,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Uc.copy(s.boundingSphere),Uc.applyMatrix4(c),Ts.copy(t.ray).recast(t.near),!(Uc.containsPoint(Ts.origin)===!1&&(Ts.intersectSphere(Uc,X_)===null||Ts.origin.distanceToSquared(X_)>(t.far-t.near)**2))&&(k_.copy(c).invert(),Ts.copy(t.ray).applyMatrix4(k_),!(s.boundingBox!==null&&Ts.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(t,i,Ts)))}_computeIntersections(t,i,s){let l;const c=this.geometry,h=this.material,d=c.index,m=c.attributes.position,p=c.attributes.uv,g=c.attributes.uv1,_=c.attributes.normal,S=c.groups,E=c.drawRange;if(d!==null)if(Array.isArray(h))for(let y=0,T=S.length;y<T;y++){const A=S[y],v=h[A.materialIndex],U=Math.max(A.start,E.start),D=Math.min(d.count,Math.min(A.start+A.count,E.start+E.count));for(let O=U,H=D;O<H;O+=3){const B=d.getX(O),P=d.getX(O+1),V=d.getX(O+2);l=Hc(this,v,t,s,p,g,_,B,P,V),l&&(l.faceIndex=Math.floor(O/3),l.face.materialIndex=A.materialIndex,i.push(l))}}else{const y=Math.max(0,E.start),T=Math.min(d.count,E.start+E.count);for(let A=y,v=T;A<v;A+=3){const U=d.getX(A),D=d.getX(A+1),O=d.getX(A+2);l=Hc(this,h,t,s,p,g,_,U,D,O),l&&(l.faceIndex=Math.floor(A/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(h))for(let y=0,T=S.length;y<T;y++){const A=S[y],v=h[A.materialIndex],U=Math.max(A.start,E.start),D=Math.min(m.count,Math.min(A.start+A.count,E.start+E.count));for(let O=U,H=D;O<H;O+=3){const B=O,P=O+1,V=O+2;l=Hc(this,v,t,s,p,g,_,B,P,V),l&&(l.faceIndex=Math.floor(O/3),l.face.materialIndex=A.materialIndex,i.push(l))}}else{const y=Math.max(0,E.start),T=Math.min(m.count,E.start+E.count);for(let A=y,v=T;A<v;A+=3){const U=A,D=A+1,O=A+2;l=Hc(this,h,t,s,p,g,_,U,D,O),l&&(l.faceIndex=Math.floor(A/3),i.push(l))}}}}function oE(r,t,i,s,l,c,h,d){let m;if(t.side===Jn?m=s.intersectTriangle(h,c,l,!0,d):m=s.intersectTriangle(l,c,h,t.side===is,d),m===null)return null;zc.copy(d),zc.applyMatrix4(r.matrixWorld);const p=i.ray.origin.distanceTo(zc);return p<i.near||p>i.far?null:{distance:p,point:zc.clone(),object:r}}function Hc(r,t,i,s,l,c,h,d,m,p){r.getVertexPosition(d,Pc),r.getVertexPosition(m,Ic),r.getVertexPosition(p,Bc);const g=oE(r,t,i,s,Pc,Ic,Bc,Y_);if(g){const _=new K;Li.getBarycoord(Y_,Pc,Ic,Bc,_),l&&(g.uv=Li.getInterpolatedAttribute(l,d,m,p,_,new oe)),c&&(g.uv1=Li.getInterpolatedAttribute(c,d,m,p,_,new oe)),h&&(g.normal=Li.getInterpolatedAttribute(h,d,m,p,_,new K),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const S={a:d,b:m,c:p,normal:new K,materialIndex:0};Li.getNormal(Pc,Ic,Bc,S.normal),g.face=S,g.barycoord=_}return g}class dl extends ci{constructor(t=1,i=1,s=1,l=1,c=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:h};const d=this;l=Math.floor(l),c=Math.floor(c),h=Math.floor(h);const m=[],p=[],g=[],_=[];let S=0,E=0;y("z","y","x",-1,-1,s,i,t,h,c,0),y("z","y","x",1,-1,s,i,-t,h,c,1),y("x","z","y",1,1,t,s,i,l,h,2),y("x","z","y",1,-1,t,s,-i,l,h,3),y("x","y","z",1,-1,t,i,s,l,c,4),y("x","y","z",-1,-1,t,i,-s,l,c,5),this.setIndex(m),this.setAttribute("position",new Gn(p,3)),this.setAttribute("normal",new Gn(g,3)),this.setAttribute("uv",new Gn(_,2));function y(T,A,v,U,D,O,H,B,P,V,L){const C=O/P,z=H/V,nt=O/2,$=H/2,ct=B/2,ft=P+1,I=V+1;let k=0,q=0;const _t=new K;for(let Tt=0;Tt<I;Tt++){const N=Tt*z-$;for(let J=0;J<ft;J++){const ht=J*C-nt;_t[T]=ht*U,_t[A]=N*D,_t[v]=ct,p.push(_t.x,_t.y,_t.z),_t[T]=0,_t[A]=0,_t[v]=B>0?1:-1,g.push(_t.x,_t.y,_t.z),_.push(J/P),_.push(1-Tt/V),k+=1}}for(let Tt=0;Tt<V;Tt++)for(let N=0;N<P;N++){const J=S+N+ft*Tt,ht=S+N+ft*(Tt+1),Y=S+(N+1)+ft*(Tt+1),lt=S+(N+1)+ft*Tt;m.push(J,ht,lt),m.push(ht,Y,lt),q+=6}d.addGroup(E,q,L),E+=q,S+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dl(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Zr(r){const t={};for(const i in r){t[i]={};for(const s in r[i]){const l=r[i][s];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][s]=null):t[i][s]=l.clone():Array.isArray(l)?t[i][s]=l.slice():t[i][s]=l}}return t}function Fn(r){const t={};for(let i=0;i<r.length;i++){const s=Zr(r[i]);for(const l in s)t[l]=s[l]}return t}function lE(r){const t=[];for(let i=0;i<r.length;i++)t.push(r[i].clone());return t}function p1(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:De.workingColorSpace}const cE={clone:Zr,merge:Fn};var uE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ma extends Jr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uE,this.fragmentShader=fE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Zr(t.uniforms),this.uniformsGroups=lE(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(t).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}}class m1 extends En{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ue,this.projectionMatrix=new Ue,this.projectionMatrixInverse=new Ue,this.coordinateSystem=_a}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ja=new K,W_=new oe,q_=new oe;class Mi extends m1{constructor(t=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=lp*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(au*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lp*2*Math.atan(Math.tan(au*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,s){ja.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ja.x,ja.y).multiplyScalar(-t/ja.z),ja.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(ja.x,ja.y).multiplyScalar(-t/ja.z)}getViewSize(t,i){return this.getViewBounds(t,W_,q_),i.subVectors(q_,W_)}setViewOffset(t,i,s,l,c,h){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(au*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const m=h.fullWidth,p=h.fullHeight;c+=h.offsetX*l/m,i-=h.offsetY*s/p,l*=h.width/m,s*=h.height/p}const d=this.filmOffset;d!==0&&(c+=t*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const Lr=-90,wr=1;class hE extends En{constructor(t,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Mi(Lr,wr,t,i);l.layers=this.layers,this.add(l);const c=new Mi(Lr,wr,t,i);c.layers=this.layers,this.add(c);const h=new Mi(Lr,wr,t,i);h.layers=this.layers,this.add(h);const d=new Mi(Lr,wr,t,i);d.layers=this.layers,this.add(d);const m=new Mi(Lr,wr,t,i);m.layers=this.layers,this.add(m);const p=new Mi(Lr,wr,t,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[s,l,c,h,d,m]=i;for(const p of i)this.remove(p);if(t===_a)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(t===cu)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const p of i)this.add(p),p.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[c,h,d,m,p,g]=this.children,_=t.getRenderTarget(),S=t.getActiveCubeFace(),E=t.getActiveMipmapLevel(),y=t.xr.enabled;t.xr.enabled=!1;const T=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,t.setRenderTarget(s,0,l),t.render(i,c),t.setRenderTarget(s,1,l),t.render(i,h),t.setRenderTarget(s,2,l),t.render(i,d),t.setRenderTarget(s,3,l),t.render(i,m),t.setRenderTarget(s,4,l),t.render(i,p),s.texture.generateMipmaps=T,t.setRenderTarget(s,5,l),t.render(i,g),t.setRenderTarget(_,S,E),t.xr.enabled=y,s.texture.needsPMREMUpdate=!0}}class g1 extends Hn{constructor(t,i,s,l,c,h,d,m,p,g){t=t!==void 0?t:[],i=i!==void 0?i:Yr,super(t,i,s,l,c,h,d,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class dE extends Is{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const s={width:t,height:t,depth:1},l=[s,s,s,s,s,s];this.texture=new g1(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:Hi}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new dl(5,5,5),c=new Ma({name:"CubemapFromEquirect",uniforms:Zr(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Jn,blending:es});c.uniforms.tEquirect.value=i;const h=new zn(l,c),d=i.minFilter;return i.minFilter===Us&&(i.minFilter=Hi),new hE(1,10,this).update(t,h),i.minFilter=d,h.geometry.dispose(),h.material.dispose(),this}clear(t,i,s,l){const c=t.getRenderTarget();for(let h=0;h<6;h++)t.setRenderTarget(this,h),t.clear(i,s,l);t.setRenderTarget(c)}}class pE extends En{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ki,this.environmentIntensity=1,this.environmentRotation=new ki,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}class mE extends Hn{constructor(t=null,i=1,s=1,l,c,h,d,m,p=li,g=li,_,S){super(null,h,d,m,p,g,l,c,_,S),this.isDataTexture=!0,this.image={data:t,width:i,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class An extends Ln{constructor(t,i,s,l=1){super(t,i,s),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=l}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Dr=new Ue,K_=new Ue,Gc=[],j_=new zs,gE=new Ue,el=new zn,nl=new Qr;class _1 extends zn{constructor(t,i,s){super(t,i),this.isInstancedMesh=!0,this.instanceMatrix=new An(new Float32Array(s*16),16),this.instanceColor=null,this.morphTexture=null,this.count=s,this.boundingBox=null,this.boundingSphere=null;for(let l=0;l<s;l++)this.setMatrixAt(l,gE)}computeBoundingBox(){const t=this.geometry,i=this.count;this.boundingBox===null&&(this.boundingBox=new zs),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let s=0;s<i;s++)this.getMatrixAt(s,Dr),j_.copy(t.boundingBox).applyMatrix4(Dr),this.boundingBox.union(j_)}computeBoundingSphere(){const t=this.geometry,i=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qr),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let s=0;s<i;s++)this.getMatrixAt(s,Dr),nl.copy(t.boundingSphere).applyMatrix4(Dr),this.boundingSphere.union(nl)}copy(t,i){return super.copy(t,i),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,i){i.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,i){i.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,i){const s=i.morphTargetInfluences,l=this.morphTexture.source.data.data,c=s.length+1,h=t*c+1;for(let d=0;d<s.length;d++)s[d]=l[h+d]}raycast(t,i){const s=this.matrixWorld,l=this.count;if(el.geometry=this.geometry,el.material=this.material,el.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),nl.copy(this.boundingSphere),nl.applyMatrix4(s),t.ray.intersectsSphere(nl)!==!1))for(let c=0;c<l;c++){this.getMatrixAt(c,Dr),K_.multiplyMatrices(s,Dr),el.matrixWorld=K_,el.raycast(t,Gc);for(let h=0,d=Gc.length;h<d;h++){const m=Gc[h];m.instanceId=c,m.object=this,i.push(m)}Gc.length=0}}setColorAt(t,i){this.instanceColor===null&&(this.instanceColor=new An(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),i.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,i){i.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,i){const s=i.morphTargetInfluences,l=s.length+1;this.morphTexture===null&&(this.morphTexture=new mE(new Float32Array(l*this.count),l,this.count,yp,Gi));const c=this.morphTexture.source.data.data;let h=0;for(let p=0;p<s.length;p++)h+=s[p];const d=this.geometry.morphTargetsRelative?1:1-h,m=l*t;c[m]=d,c.set(s,m+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const od=new K,_E=new K,vE=new de;class Ja{constructor(t=new K(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,s,l){return this.normal.set(t,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,s){const l=od.subVectors(s,i).cross(_E.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const s=t.delta(od),l=this.normal.dot(s);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const c=-(t.start.dot(this.normal)+this.constant)/l;return c<0||c>1?null:i.copy(t.start).addScaledVector(s,c)}intersectsLine(t){const i=this.distanceToPoint(t.start),s=this.distanceToPoint(t.end);return i<0&&s>0||s<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const s=i||vE.getNormalMatrix(t),l=this.coplanarPoint(od).applyMatrix4(t),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Rs=new Qr,Vc=new K;class Op{constructor(t=new Ja,i=new Ja,s=new Ja,l=new Ja,c=new Ja,h=new Ja){this.planes=[t,i,s,l,c,h]}set(t,i,s,l,c,h){const d=this.planes;return d[0].copy(t),d[1].copy(i),d[2].copy(s),d[3].copy(l),d[4].copy(c),d[5].copy(h),this}copy(t){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(t.planes[s]);return this}setFromProjectionMatrix(t,i=_a){const s=this.planes,l=t.elements,c=l[0],h=l[1],d=l[2],m=l[3],p=l[4],g=l[5],_=l[6],S=l[7],E=l[8],y=l[9],T=l[10],A=l[11],v=l[12],U=l[13],D=l[14],O=l[15];if(s[0].setComponents(m-c,S-p,A-E,O-v).normalize(),s[1].setComponents(m+c,S+p,A+E,O+v).normalize(),s[2].setComponents(m+h,S+g,A+y,O+U).normalize(),s[3].setComponents(m-h,S-g,A-y,O-U).normalize(),s[4].setComponents(m-d,S-_,A-T,O-D).normalize(),i===_a)s[5].setComponents(m+d,S+_,A+T,O+D).normalize();else if(i===cu)s[5].setComponents(d,_,T,D).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Rs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Rs.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Rs)}intersectsSprite(t){return Rs.center.set(0,0,0),Rs.radius=.7071067811865476,Rs.applyMatrix4(t.matrixWorld),this.intersectsSphere(Rs)}intersectsSphere(t){const i=this.planes,s=t.center,l=-t.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Vc.x=l.normal.x>0?t.max.x:t.min.x,Vc.y=l.normal.y>0?t.max.y:t.min.y,Vc.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Vc)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Lp extends Jr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const fu=new K,hu=new K,Z_=new Ue,il=new yu,kc=new Qr,ld=new K,Q_=new K;class cp extends En{constructor(t=new ci,i=new Lp){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=i,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,s=[0];for(let l=1,c=i.count;l<c;l++)fu.fromBufferAttribute(i,l-1),hu.fromBufferAttribute(i,l),s[l]=s[l-1],s[l]+=fu.distanceTo(hu);t.setAttribute("lineDistance",new Gn(s,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,i){const s=this.geometry,l=this.matrixWorld,c=t.params.Line.threshold,h=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),kc.copy(s.boundingSphere),kc.applyMatrix4(l),kc.radius+=c,t.ray.intersectsSphere(kc)===!1)return;Z_.copy(l).invert(),il.copy(t.ray).applyMatrix4(Z_);const d=c/((this.scale.x+this.scale.y+this.scale.z)/3),m=d*d,p=this.isLineSegments?2:1,g=s.index,S=s.attributes.position;if(g!==null){const E=Math.max(0,h.start),y=Math.min(g.count,h.start+h.count);for(let T=E,A=y-1;T<A;T+=p){const v=g.getX(T),U=g.getX(T+1),D=Xc(this,t,il,m,v,U);D&&i.push(D)}if(this.isLineLoop){const T=g.getX(y-1),A=g.getX(E),v=Xc(this,t,il,m,T,A);v&&i.push(v)}}else{const E=Math.max(0,h.start),y=Math.min(S.count,h.start+h.count);for(let T=E,A=y-1;T<A;T+=p){const v=Xc(this,t,il,m,T,T+1);v&&i.push(v)}if(this.isLineLoop){const T=Xc(this,t,il,m,y-1,E);T&&i.push(T)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}}function Xc(r,t,i,s,l,c){const h=r.geometry.attributes.position;if(fu.fromBufferAttribute(h,l),hu.fromBufferAttribute(h,c),i.distanceSqToSegment(fu,hu,ld,Q_)>s)return;ld.applyMatrix4(r.matrixWorld);const m=t.ray.origin.distanceTo(ld);if(!(m<t.near||m>t.far))return{distance:m,point:Q_.clone().applyMatrix4(r.matrixWorld),index:l,face:null,faceIndex:null,barycoord:null,object:r}}const J_=new K,$_=new K;class SE extends cp{constructor(t,i){super(t,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,s=[];for(let l=0,c=i.count;l<c;l+=2)J_.fromBufferAttribute(i,l),$_.fromBufferAttribute(i,l+1),s[l]=l===0?0:s[l-1],s[l+1]=s[l]+J_.distanceTo($_);t.setAttribute("lineDistance",new Gn(s,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class rl extends En{constructor(){super(),this.isGroup=!0,this.type="Group"}}class v1 extends Hn{constructor(t,i,s,l,c,h,d,m,p,g=Vr){if(g!==Vr&&g!==Kr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&g===Vr&&(s=Ps),s===void 0&&g===Kr&&(s=qr),super(null,l,c,h,d,m,g,s,p),this.isDepthTexture=!0,this.image={width:t,height:i},this.magFilter=d!==void 0?d:li,this.minFilter=m!==void 0?m:li,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class wp extends ci{constructor(t=1,i=1,s=1,l=32,c=1,h=!1,d=0,m=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:i,height:s,radialSegments:l,heightSegments:c,openEnded:h,thetaStart:d,thetaLength:m};const p=this;l=Math.floor(l),c=Math.floor(c);const g=[],_=[],S=[],E=[];let y=0;const T=[],A=s/2;let v=0;U(),h===!1&&(t>0&&D(!0),i>0&&D(!1)),this.setIndex(g),this.setAttribute("position",new Gn(_,3)),this.setAttribute("normal",new Gn(S,3)),this.setAttribute("uv",new Gn(E,2));function U(){const O=new K,H=new K;let B=0;const P=(i-t)/s;for(let V=0;V<=c;V++){const L=[],C=V/c,z=C*(i-t)+t;for(let nt=0;nt<=l;nt++){const $=nt/l,ct=$*m+d,ft=Math.sin(ct),I=Math.cos(ct);H.x=z*ft,H.y=-C*s+A,H.z=z*I,_.push(H.x,H.y,H.z),O.set(ft,P,I).normalize(),S.push(O.x,O.y,O.z),E.push($,1-C),L.push(y++)}T.push(L)}for(let V=0;V<l;V++)for(let L=0;L<c;L++){const C=T[L][V],z=T[L+1][V],nt=T[L+1][V+1],$=T[L][V+1];(t>0||L!==0)&&(g.push(C,z,$),B+=3),(i>0||L!==c-1)&&(g.push(z,nt,$),B+=3)}p.addGroup(v,B,0),v+=B}function D(O){const H=y,B=new oe,P=new K;let V=0;const L=O===!0?t:i,C=O===!0?1:-1;for(let nt=1;nt<=l;nt++)_.push(0,A*C,0),S.push(0,C,0),E.push(.5,.5),y++;const z=y;for(let nt=0;nt<=l;nt++){const ct=nt/l*m+d,ft=Math.cos(ct),I=Math.sin(ct);P.x=L*I,P.y=A*C,P.z=L*ft,_.push(P.x,P.y,P.z),S.push(0,C,0),B.x=ft*.5+.5,B.y=I*.5*C+.5,E.push(B.x,B.y),y++}for(let nt=0;nt<l;nt++){const $=H+nt,ct=z+nt;O===!0?g.push(ct,ct+1,$):g.push(ct+1,ct,$),V+=3}p.addGroup(v,V,O===!0?1:2),v+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wp(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class xu extends ci{constructor(t=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:s,heightSegments:l};const c=t/2,h=i/2,d=Math.floor(s),m=Math.floor(l),p=d+1,g=m+1,_=t/d,S=i/m,E=[],y=[],T=[],A=[];for(let v=0;v<g;v++){const U=v*S-h;for(let D=0;D<p;D++){const O=D*_-c;y.push(O,-U,0),T.push(0,0,1),A.push(D/d),A.push(1-v/m)}}for(let v=0;v<m;v++)for(let U=0;U<d;U++){const D=U+p*v,O=U+p*(v+1),H=U+1+p*(v+1),B=U+1+p*v;E.push(D,O,B),E.push(O,H,B)}this.setIndex(E),this.setAttribute("position",new Gn(y,3)),this.setAttribute("normal",new Gn(T,3)),this.setAttribute("uv",new Gn(A,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xu(t.width,t.height,t.widthSegments,t.heightSegments)}}class Tu extends ci{constructor(t=1,i=32,s=16,l=0,c=Math.PI*2,h=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:i,heightSegments:s,phiStart:l,phiLength:c,thetaStart:h,thetaLength:d},i=Math.max(3,Math.floor(i)),s=Math.max(2,Math.floor(s));const m=Math.min(h+d,Math.PI);let p=0;const g=[],_=new K,S=new K,E=[],y=[],T=[],A=[];for(let v=0;v<=s;v++){const U=[],D=v/s;let O=0;v===0&&h===0?O=.5/i:v===s&&m===Math.PI&&(O=-.5/i);for(let H=0;H<=i;H++){const B=H/i;_.x=-t*Math.cos(l+B*c)*Math.sin(h+D*d),_.y=t*Math.cos(h+D*d),_.z=t*Math.sin(l+B*c)*Math.sin(h+D*d),y.push(_.x,_.y,_.z),S.copy(_).normalize(),T.push(S.x,S.y,S.z),A.push(B+O,1-D),U.push(p++)}g.push(U)}for(let v=0;v<s;v++)for(let U=0;U<i;U++){const D=g[v][U+1],O=g[v][U],H=g[v+1][U],B=g[v+1][U+1];(v!==0||h>0)&&E.push(D,O,B),(v!==s-1||m<Math.PI)&&E.push(O,H,B)}this.setIndex(E),this.setAttribute("position",new Gn(y,3)),this.setAttribute("normal",new Gn(T,3)),this.setAttribute("uv",new Gn(A,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tu(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class S1 extends Ma{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ME extends Jr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=r1,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ki,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class M1 extends ME{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new oe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ge(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(i){this.ior=(1+.4*i)/(1-.4*i)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class AE extends Jr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=LA,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class EE extends Jr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class A1 extends En{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new me(t),this.intensity=i}dispose(){}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}class yE extends A1{constructor(t,i,s){super(t,s),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(En.DEFAULT_UP),this.updateMatrix(),this.groundColor=new me(i)}copy(t,i){return super.copy(t,i),this.groundColor.copy(t.groundColor),this}}const cd=new Ue,tv=new K,ev=new K;class xE{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.map=null,this.mapPass=null,this.matrix=new Ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Op,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new en(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,s=this.matrix;tv.setFromMatrixPosition(t.matrixWorld),i.position.copy(tv),ev.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(ev),i.updateMatrixWorld(),cd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(cd),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(cd)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class E1 extends m1{constructor(t=-1,i=1,s=1,l=-1,c=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=h,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,s,l,c,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-t,h=s+t,d=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=p*this.view.offsetX,h=c+p*this.view.width,d-=g*this.view.offsetY,m=d-g*this.view.height}this.projectionMatrix.makeOrthographic(c,h,d,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class TE extends xE{constructor(){super(new E1(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ud extends A1{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(En.DEFAULT_UP),this.updateMatrix(),this.target=new En,this.shadow=new TE}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class y1 extends ci{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class RE extends Mi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}const nv=new Ue;class bE{constructor(t,i,s=0,l=1/0){this.ray=new yu(t,i),this.near=s,this.far=l,this.camera=null,this.layers=new bp,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,i){this.ray.set(t,i)}setFromCamera(t,i){i.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(i.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(i).sub(this.ray.origin).normalize(),this.camera=i):i.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(i.near+i.far)/(i.near-i.far)).unproject(i),this.ray.direction.set(0,0,-1).transformDirection(i.matrixWorld),this.camera=i):console.error("THREE.Raycaster: Unsupported camera type: "+i.type)}setFromXRController(t){return nv.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nv),this}intersectObject(t,i=!0,s=[]){return up(t,this,s,i),s.sort(iv),s}intersectObjects(t,i=!0,s=[]){for(let l=0,c=t.length;l<c;l++)up(t[l],this,s,i);return s.sort(iv),s}}function iv(r,t){return r.distance-t.distance}function up(r,t,i,s){let l=!0;if(r.layers.test(t.layers)&&r.raycast(t,i)===!1&&(l=!1),l===!0&&s===!0){const c=r.children;for(let h=0,d=c.length;h<d;h++)up(c[h],t,i,!0)}}class av{constructor(t=1,i=0,s=0){return this.radius=t,this.phi=i,this.theta=s,this}set(t,i,s){return this.radius=t,this.phi=i,this.theta=s,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=ge(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,i,s){return this.radius=Math.sqrt(t*t+i*i+s*s),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,s),this.phi=Math.acos(ge(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class CE extends Fs{constructor(t,i=null){super(),this.object=t,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function sv(r,t,i,s){const l=OE(s);switch(i){case t1:return r*t;case n1:return r*t;case i1:return r*t*2;case yp:return r*t/l.components*l.byteLength;case xp:return r*t/l.components*l.byteLength;case a1:return r*t*2/l.components*l.byteLength;case Tp:return r*t*2/l.components*l.byteLength;case e1:return r*t*3/l.components*l.byteLength;case wi:return r*t*4/l.components*l.byteLength;case Rp:return r*t*4/l.components*l.byteLength;case $c:case tu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case eu:case nu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Bd:case zd:return Math.max(r,16)*Math.max(t,8)/4;case Id:case Fd:return Math.max(r,8)*Math.max(t,8)/2;case Hd:case Gd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Vd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case kd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Xd:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Yd:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case Wd:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case qd:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case Kd:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case jd:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case Zd:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Qd:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case Jd:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case $d:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case tp:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case ep:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case np:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case iu:case ip:case ap:return Math.ceil(r/4)*Math.ceil(t/4)*16;case s1:case sp:return Math.ceil(r/4)*Math.ceil(t/4)*8;case rp:case op:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function OE(r){switch(r){case Sa:case Qv:return{byteLength:1,components:1};case ul:case Jv:case fl:return{byteLength:2,components:1};case Ap:case Ep:return{byteLength:2,components:4};case Ps:case Mp:case Gi:return{byteLength:4,components:1};case $v:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sp}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sp);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function x1(){let r=null,t=!1,i=null,s=null;function l(c,h){i(c,h),s=r.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(s=r.requestAnimationFrame(l),t=!0)},stop:function(){r.cancelAnimationFrame(s),t=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function LE(r){const t=new WeakMap;function i(d,m){const p=d.array,g=d.usage,_=p.byteLength,S=r.createBuffer();r.bindBuffer(m,S),r.bufferData(m,p,g),d.onUploadCallback();let E;if(p instanceof Float32Array)E=r.FLOAT;else if(p instanceof Uint16Array)d.isFloat16BufferAttribute?E=r.HALF_FLOAT:E=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)E=r.SHORT;else if(p instanceof Uint32Array)E=r.UNSIGNED_INT;else if(p instanceof Int32Array)E=r.INT;else if(p instanceof Int8Array)E=r.BYTE;else if(p instanceof Uint8Array)E=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)E=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:S,type:E,bytesPerElement:p.BYTES_PER_ELEMENT,version:d.version,size:_}}function s(d,m,p){const g=m.array,_=m.updateRanges;if(r.bindBuffer(p,d),_.length===0)r.bufferSubData(p,0,g);else{_.sort((E,y)=>E.start-y.start);let S=0;for(let E=1;E<_.length;E++){const y=_[S],T=_[E];T.start<=y.start+y.count+1?y.count=Math.max(y.count,T.start+T.count-y.start):(++S,_[S]=T)}_.length=S+1;for(let E=0,y=_.length;E<y;E++){const T=_[E];r.bufferSubData(p,T.start*g.BYTES_PER_ELEMENT,g,T.start,T.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),t.get(d)}function c(d){d.isInterleavedBufferAttribute&&(d=d.data);const m=t.get(d);m&&(r.deleteBuffer(m.buffer),t.delete(d))}function h(d,m){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const g=t.get(d);(!g||g.version<d.version)&&t.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const p=t.get(d);if(p===void 0)t.set(d,i(d,m));else if(p.version<d.version){if(p.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,d,m),p.version=d.version}}return{get:l,remove:c,update:h}}var wE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,DE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,NE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,UE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,PE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,IE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,BE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,FE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zE=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,HE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,GE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,VE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,kE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,XE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,YE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,WE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,KE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ZE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,QE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,JE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$E=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ty=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ey=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ny=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,iy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ay=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ry=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,oy="gl_FragColor = linearToOutputTexel( gl_FragColor );",ly=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,uy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,fy=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,hy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,py=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,my=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_y=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Sy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,My=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ay=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ey=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,yy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,xy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ty=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ry=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,by=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Oy=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ly=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,wy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Dy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ny=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Uy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Py=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Iy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,By=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Hy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Vy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ky=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Yy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,qy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ky=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,jy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Zy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$y=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,tx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ex=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ix=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ax=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,rx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ox=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ux=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,dx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,px=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_x=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,vx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Mx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ax=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ex=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,xx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Tx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Rx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ox=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Lx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ux=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Px=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ix=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Bx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Fx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,zx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Hx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Gx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Yx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,jx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Qx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Jx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$x=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tT=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,eT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,iT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,sT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rT=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,oT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,lT=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,pe={alphahash_fragment:wE,alphahash_pars_fragment:DE,alphamap_fragment:NE,alphamap_pars_fragment:UE,alphatest_fragment:PE,alphatest_pars_fragment:IE,aomap_fragment:BE,aomap_pars_fragment:FE,batching_pars_vertex:zE,batching_vertex:HE,begin_vertex:GE,beginnormal_vertex:VE,bsdfs:kE,iridescence_fragment:XE,bumpmap_pars_fragment:YE,clipping_planes_fragment:WE,clipping_planes_pars_fragment:qE,clipping_planes_pars_vertex:KE,clipping_planes_vertex:jE,color_fragment:ZE,color_pars_fragment:QE,color_pars_vertex:JE,color_vertex:$E,common:ty,cube_uv_reflection_fragment:ey,defaultnormal_vertex:ny,displacementmap_pars_vertex:iy,displacementmap_vertex:ay,emissivemap_fragment:sy,emissivemap_pars_fragment:ry,colorspace_fragment:oy,colorspace_pars_fragment:ly,envmap_fragment:cy,envmap_common_pars_fragment:uy,envmap_pars_fragment:fy,envmap_pars_vertex:hy,envmap_physical_pars_fragment:yy,envmap_vertex:dy,fog_vertex:py,fog_pars_vertex:my,fog_fragment:gy,fog_pars_fragment:_y,gradientmap_pars_fragment:vy,lightmap_pars_fragment:Sy,lights_lambert_fragment:My,lights_lambert_pars_fragment:Ay,lights_pars_begin:Ey,lights_toon_fragment:xy,lights_toon_pars_fragment:Ty,lights_phong_fragment:Ry,lights_phong_pars_fragment:by,lights_physical_fragment:Cy,lights_physical_pars_fragment:Oy,lights_fragment_begin:Ly,lights_fragment_maps:wy,lights_fragment_end:Dy,logdepthbuf_fragment:Ny,logdepthbuf_pars_fragment:Uy,logdepthbuf_pars_vertex:Py,logdepthbuf_vertex:Iy,map_fragment:By,map_pars_fragment:Fy,map_particle_fragment:zy,map_particle_pars_fragment:Hy,metalnessmap_fragment:Gy,metalnessmap_pars_fragment:Vy,morphinstance_vertex:ky,morphcolor_vertex:Xy,morphnormal_vertex:Yy,morphtarget_pars_vertex:Wy,morphtarget_vertex:qy,normal_fragment_begin:Ky,normal_fragment_maps:jy,normal_pars_fragment:Zy,normal_pars_vertex:Qy,normal_vertex:Jy,normalmap_pars_fragment:$y,clearcoat_normal_fragment_begin:tx,clearcoat_normal_fragment_maps:ex,clearcoat_pars_fragment:nx,iridescence_pars_fragment:ix,opaque_fragment:ax,packing:sx,premultiplied_alpha_fragment:rx,project_vertex:ox,dithering_fragment:lx,dithering_pars_fragment:cx,roughnessmap_fragment:ux,roughnessmap_pars_fragment:fx,shadowmap_pars_fragment:hx,shadowmap_pars_vertex:dx,shadowmap_vertex:px,shadowmask_pars_fragment:mx,skinbase_vertex:gx,skinning_pars_vertex:_x,skinning_vertex:vx,skinnormal_vertex:Sx,specularmap_fragment:Mx,specularmap_pars_fragment:Ax,tonemapping_fragment:Ex,tonemapping_pars_fragment:yx,transmission_fragment:xx,transmission_pars_fragment:Tx,uv_pars_fragment:Rx,uv_pars_vertex:bx,uv_vertex:Cx,worldpos_vertex:Ox,background_vert:Lx,background_frag:wx,backgroundCube_vert:Dx,backgroundCube_frag:Nx,cube_vert:Ux,cube_frag:Px,depth_vert:Ix,depth_frag:Bx,distanceRGBA_vert:Fx,distanceRGBA_frag:zx,equirect_vert:Hx,equirect_frag:Gx,linedashed_vert:Vx,linedashed_frag:kx,meshbasic_vert:Xx,meshbasic_frag:Yx,meshlambert_vert:Wx,meshlambert_frag:qx,meshmatcap_vert:Kx,meshmatcap_frag:jx,meshnormal_vert:Zx,meshnormal_frag:Qx,meshphong_vert:Jx,meshphong_frag:$x,meshphysical_vert:tT,meshphysical_frag:eT,meshtoon_vert:nT,meshtoon_frag:iT,points_vert:aT,points_frag:sT,shadow_vert:rT,shadow_frag:oT,sprite_vert:lT,sprite_frag:cT},Pt={common:{diffuse:{value:new me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new de},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new de}},envmap:{envMap:{value:null},envMapRotation:{value:new de},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new de}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new de}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new de},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new de},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new de},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new de}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new de}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new de}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0},uvTransform:{value:new de}},sprite:{diffuse:{value:new me(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new de},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0}}},zi={basic:{uniforms:Fn([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.fog]),vertexShader:pe.meshbasic_vert,fragmentShader:pe.meshbasic_frag},lambert:{uniforms:Fn([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new me(0)}}]),vertexShader:pe.meshlambert_vert,fragmentShader:pe.meshlambert_frag},phong:{uniforms:Fn([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new me(0)},specular:{value:new me(1118481)},shininess:{value:30}}]),vertexShader:pe.meshphong_vert,fragmentShader:pe.meshphong_frag},standard:{uniforms:Fn([Pt.common,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.roughnessmap,Pt.metalnessmap,Pt.fog,Pt.lights,{emissive:{value:new me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag},toon:{uniforms:Fn([Pt.common,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.gradientmap,Pt.fog,Pt.lights,{emissive:{value:new me(0)}}]),vertexShader:pe.meshtoon_vert,fragmentShader:pe.meshtoon_frag},matcap:{uniforms:Fn([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,{matcap:{value:null}}]),vertexShader:pe.meshmatcap_vert,fragmentShader:pe.meshmatcap_frag},points:{uniforms:Fn([Pt.points,Pt.fog]),vertexShader:pe.points_vert,fragmentShader:pe.points_frag},dashed:{uniforms:Fn([Pt.common,Pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pe.linedashed_vert,fragmentShader:pe.linedashed_frag},depth:{uniforms:Fn([Pt.common,Pt.displacementmap]),vertexShader:pe.depth_vert,fragmentShader:pe.depth_frag},normal:{uniforms:Fn([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,{opacity:{value:1}}]),vertexShader:pe.meshnormal_vert,fragmentShader:pe.meshnormal_frag},sprite:{uniforms:Fn([Pt.sprite,Pt.fog]),vertexShader:pe.sprite_vert,fragmentShader:pe.sprite_frag},background:{uniforms:{uvTransform:{value:new de},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pe.background_vert,fragmentShader:pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new de}},vertexShader:pe.backgroundCube_vert,fragmentShader:pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pe.cube_vert,fragmentShader:pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pe.equirect_vert,fragmentShader:pe.equirect_frag},distanceRGBA:{uniforms:Fn([Pt.common,Pt.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pe.distanceRGBA_vert,fragmentShader:pe.distanceRGBA_frag},shadow:{uniforms:Fn([Pt.lights,Pt.fog,{color:{value:new me(0)},opacity:{value:1}}]),vertexShader:pe.shadow_vert,fragmentShader:pe.shadow_frag}};zi.physical={uniforms:Fn([zi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new de},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new de},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new de},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new de},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new de},sheen:{value:0},sheenColor:{value:new me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new de},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new de},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new de},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new de},attenuationDistance:{value:0},attenuationColor:{value:new me(0)},specularColor:{value:new me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new de},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new de},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new de}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag};const Yc={r:0,b:0,g:0},bs=new ki,uT=new Ue;function fT(r,t,i,s,l,c,h){const d=new me(0);let m=c===!0?0:1,p,g,_=null,S=0,E=null;function y(D){let O=D.isScene===!0?D.background:null;return O&&O.isTexture&&(O=(D.backgroundBlurriness>0?i:t).get(O)),O}function T(D){let O=!1;const H=y(D);H===null?v(d,m):H&&H.isColor&&(v(H,1),O=!0);const B=r.xr.getEnvironmentBlendMode();B==="additive"?s.buffers.color.setClear(0,0,0,1,h):B==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,h),(r.autoClear||O)&&(s.buffers.depth.setTest(!0),s.buffers.depth.setMask(!0),s.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function A(D,O){const H=y(O);H&&(H.isCubeTexture||H.mapping===Eu)?(g===void 0&&(g=new zn(new dl(1,1,1),new Ma({name:"BackgroundCubeMaterial",uniforms:Zr(zi.backgroundCube.uniforms),vertexShader:zi.backgroundCube.vertexShader,fragmentShader:zi.backgroundCube.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(B,P,V){this.matrixWorld.copyPosition(V.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(g)),bs.copy(O.backgroundRotation),bs.x*=-1,bs.y*=-1,bs.z*=-1,H.isCubeTexture&&H.isRenderTargetTexture===!1&&(bs.y*=-1,bs.z*=-1),g.material.uniforms.envMap.value=H,g.material.uniforms.flipEnvMap.value=H.isCubeTexture&&H.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=O.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=O.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(uT.makeRotationFromEuler(bs)),g.material.toneMapped=De.getTransfer(H.colorSpace)!==ke,(_!==H||S!==H.version||E!==r.toneMapping)&&(g.material.needsUpdate=!0,_=H,S=H.version,E=r.toneMapping),g.layers.enableAll(),D.unshift(g,g.geometry,g.material,0,0,null)):H&&H.isTexture&&(p===void 0&&(p=new zn(new xu(2,2),new Ma({name:"BackgroundMaterial",uniforms:Zr(zi.background.uniforms),vertexShader:zi.background.vertexShader,fragmentShader:zi.background.fragmentShader,side:is,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=H,p.material.uniforms.backgroundIntensity.value=O.backgroundIntensity,p.material.toneMapped=De.getTransfer(H.colorSpace)!==ke,H.matrixAutoUpdate===!0&&H.updateMatrix(),p.material.uniforms.uvTransform.value.copy(H.matrix),(_!==H||S!==H.version||E!==r.toneMapping)&&(p.material.needsUpdate=!0,_=H,S=H.version,E=r.toneMapping),p.layers.enableAll(),D.unshift(p,p.geometry,p.material,0,0,null))}function v(D,O){D.getRGB(Yc,p1(r)),s.buffers.color.setClear(Yc.r,Yc.g,Yc.b,O,h)}function U(){g!==void 0&&(g.geometry.dispose(),g.material.dispose()),p!==void 0&&(p.geometry.dispose(),p.material.dispose())}return{getClearColor:function(){return d},setClearColor:function(D,O=1){d.set(D),m=O,v(d,m)},getClearAlpha:function(){return m},setClearAlpha:function(D){m=D,v(d,m)},render:T,addToRenderList:A,dispose:U}}function hT(r,t){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=S(null);let c=l,h=!1;function d(C,z,nt,$,ct){let ft=!1;const I=_($,nt,z);c!==I&&(c=I,p(c.object)),ft=E(C,$,nt,ct),ft&&y(C,$,nt,ct),ct!==null&&t.update(ct,r.ELEMENT_ARRAY_BUFFER),(ft||h)&&(h=!1,O(C,z,nt,$),ct!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(ct).buffer))}function m(){return r.createVertexArray()}function p(C){return r.bindVertexArray(C)}function g(C){return r.deleteVertexArray(C)}function _(C,z,nt){const $=nt.wireframe===!0;let ct=s[C.id];ct===void 0&&(ct={},s[C.id]=ct);let ft=ct[z.id];ft===void 0&&(ft={},ct[z.id]=ft);let I=ft[$];return I===void 0&&(I=S(m()),ft[$]=I),I}function S(C){const z=[],nt=[],$=[];for(let ct=0;ct<i;ct++)z[ct]=0,nt[ct]=0,$[ct]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:nt,attributeDivisors:$,object:C,attributes:{},index:null}}function E(C,z,nt,$){const ct=c.attributes,ft=z.attributes;let I=0;const k=nt.getAttributes();for(const q in k)if(k[q].location>=0){const Tt=ct[q];let N=ft[q];if(N===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(N=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(N=C.instanceColor)),Tt===void 0||Tt.attribute!==N||N&&Tt.data!==N.data)return!0;I++}return c.attributesNum!==I||c.index!==$}function y(C,z,nt,$){const ct={},ft=z.attributes;let I=0;const k=nt.getAttributes();for(const q in k)if(k[q].location>=0){let Tt=ft[q];Tt===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(Tt=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(Tt=C.instanceColor));const N={};N.attribute=Tt,Tt&&Tt.data&&(N.data=Tt.data),ct[q]=N,I++}c.attributes=ct,c.attributesNum=I,c.index=$}function T(){const C=c.newAttributes;for(let z=0,nt=C.length;z<nt;z++)C[z]=0}function A(C){v(C,0)}function v(C,z){const nt=c.newAttributes,$=c.enabledAttributes,ct=c.attributeDivisors;nt[C]=1,$[C]===0&&(r.enableVertexAttribArray(C),$[C]=1),ct[C]!==z&&(r.vertexAttribDivisor(C,z),ct[C]=z)}function U(){const C=c.newAttributes,z=c.enabledAttributes;for(let nt=0,$=z.length;nt<$;nt++)z[nt]!==C[nt]&&(r.disableVertexAttribArray(nt),z[nt]=0)}function D(C,z,nt,$,ct,ft,I){I===!0?r.vertexAttribIPointer(C,z,nt,ct,ft):r.vertexAttribPointer(C,z,nt,$,ct,ft)}function O(C,z,nt,$){T();const ct=$.attributes,ft=nt.getAttributes(),I=z.defaultAttributeValues;for(const k in ft){const q=ft[k];if(q.location>=0){let _t=ct[k];if(_t===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(_t=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(_t=C.instanceColor)),_t!==void 0){const Tt=_t.normalized,N=_t.itemSize,J=t.get(_t);if(J===void 0)continue;const ht=J.buffer,Y=J.type,lt=J.bytesPerElement,yt=Y===r.INT||Y===r.UNSIGNED_INT||_t.gpuType===Mp;if(_t.isInterleavedBufferAttribute){const At=_t.data,Vt=At.stride,Ht=_t.offset;if(At.isInstancedInterleavedBuffer){for(let te=0;te<q.locationSize;te++)v(q.location+te,At.meshPerAttribute);C.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=At.meshPerAttribute*At.count)}else for(let te=0;te<q.locationSize;te++)A(q.location+te);r.bindBuffer(r.ARRAY_BUFFER,ht);for(let te=0;te<q.locationSize;te++)D(q.location+te,N/q.locationSize,Y,Tt,Vt*lt,(Ht+N/q.locationSize*te)*lt,yt)}else{if(_t.isInstancedBufferAttribute){for(let At=0;At<q.locationSize;At++)v(q.location+At,_t.meshPerAttribute);C.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let At=0;At<q.locationSize;At++)A(q.location+At);r.bindBuffer(r.ARRAY_BUFFER,ht);for(let At=0;At<q.locationSize;At++)D(q.location+At,N/q.locationSize,Y,Tt,N*lt,N/q.locationSize*At*lt,yt)}}else if(I!==void 0){const Tt=I[k];if(Tt!==void 0)switch(Tt.length){case 2:r.vertexAttrib2fv(q.location,Tt);break;case 3:r.vertexAttrib3fv(q.location,Tt);break;case 4:r.vertexAttrib4fv(q.location,Tt);break;default:r.vertexAttrib1fv(q.location,Tt)}}}}U()}function H(){V();for(const C in s){const z=s[C];for(const nt in z){const $=z[nt];for(const ct in $)g($[ct].object),delete $[ct];delete z[nt]}delete s[C]}}function B(C){if(s[C.id]===void 0)return;const z=s[C.id];for(const nt in z){const $=z[nt];for(const ct in $)g($[ct].object),delete $[ct];delete z[nt]}delete s[C.id]}function P(C){for(const z in s){const nt=s[z];if(nt[C.id]===void 0)continue;const $=nt[C.id];for(const ct in $)g($[ct].object),delete $[ct];delete nt[C.id]}}function V(){L(),h=!0,c!==l&&(c=l,p(c.object))}function L(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:V,resetDefaultState:L,dispose:H,releaseStatesOfGeometry:B,releaseStatesOfProgram:P,initAttributes:T,enableAttribute:A,disableUnusedAttributes:U}}function dT(r,t,i){let s;function l(p){s=p}function c(p,g){r.drawArrays(s,p,g),i.update(g,s,1)}function h(p,g,_){_!==0&&(r.drawArraysInstanced(s,p,g,_),i.update(g,s,_))}function d(p,g,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,p,0,g,0,_);let E=0;for(let y=0;y<_;y++)E+=g[y];i.update(E,s,1)}function m(p,g,_,S){if(_===0)return;const E=t.get("WEBGL_multi_draw");if(E===null)for(let y=0;y<p.length;y++)h(p[y],g[y],S[y]);else{E.multiDrawArraysInstancedWEBGL(s,p,0,g,0,S,0,_);let y=0;for(let T=0;T<_;T++)y+=g[T]*S[T];i.update(y,s,1)}}this.setMode=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=m}function pT(r,t,i,s){let l;function c(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");l=r.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(P){return!(P!==wi&&s.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(P){const V=P===fl&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==Sa&&s.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Gi&&!V)}function m(P){if(P==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=i.precision!==void 0?i.precision:"highp";const g=m(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const _=i.logarithmicDepthBuffer===!0,S=i.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),E=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),y=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=r.getParameter(r.MAX_TEXTURE_SIZE),A=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),v=r.getParameter(r.MAX_VERTEX_ATTRIBS),U=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),D=r.getParameter(r.MAX_VARYING_VECTORS),O=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),H=y>0,B=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:h,textureTypeReadable:d,precision:p,logarithmicDepthBuffer:_,reverseDepthBuffer:S,maxTextures:E,maxVertexTextures:y,maxTextureSize:T,maxCubemapSize:A,maxAttributes:v,maxVertexUniforms:U,maxVaryings:D,maxFragmentUniforms:O,vertexTextures:H,maxSamples:B}}function mT(r){const t=this;let i=null,s=0,l=!1,c=!1;const h=new Ja,d=new de,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(_,S){const E=_.length!==0||S||s!==0||l;return l=S,s=_.length,E},this.beginShadows=function(){c=!0,g(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(_,S){i=g(_,S,0)},this.setState=function(_,S,E){const y=_.clippingPlanes,T=_.clipIntersection,A=_.clipShadows,v=r.get(_);if(!l||y===null||y.length===0||c&&!A)c?g(null):p();else{const U=c?0:s,D=U*4;let O=v.clippingState||null;m.value=O,O=g(y,S,D,E);for(let H=0;H!==D;++H)O[H]=i[H];v.clippingState=O,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=U}};function p(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),t.numPlanes=s,t.numIntersection=0}function g(_,S,E,y){const T=_!==null?_.length:0;let A=null;if(T!==0){if(A=m.value,y!==!0||A===null){const v=E+T*4,U=S.matrixWorldInverse;d.getNormalMatrix(U),(A===null||A.length<v)&&(A=new Float32Array(v));for(let D=0,O=E;D!==T;++D,O+=4)h.copy(_[D]).applyMatrix4(U,d),h.normal.toArray(A,O),A[O+3]=h.constant}m.value=A,m.needsUpdate=!0}return t.numPlanes=T,t.numIntersection=0,A}}function gT(r){let t=new WeakMap;function i(h,d){return d===Dd?h.mapping=Yr:d===Nd&&(h.mapping=Wr),h}function s(h){if(h&&h.isTexture){const d=h.mapping;if(d===Dd||d===Nd)if(t.has(h)){const m=t.get(h).texture;return i(m,h.mapping)}else{const m=h.image;if(m&&m.height>0){const p=new dE(m.height);return p.fromEquirectangularTexture(r,h),t.set(h,p),h.addEventListener("dispose",l),i(p.texture,h.mapping)}else return null}}return h}function l(h){const d=h.target;d.removeEventListener("dispose",l);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function c(){t=new WeakMap}return{get:s,dispose:c}}const zr=4,rv=[.125,.215,.35,.446,.526,.582],Ds=20,fd=new E1,ov=new me;let hd=null,dd=0,pd=0,md=!1;const Ls=(1+Math.sqrt(5))/2,Nr=1/Ls,lv=[new K(-Ls,Nr,0),new K(Ls,Nr,0),new K(-Nr,0,Ls),new K(Nr,0,Ls),new K(0,Ls,-Nr),new K(0,Ls,Nr),new K(-1,1,-1),new K(1,1,-1),new K(-1,1,1),new K(1,1,1)];class cv{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,i=0,s=.1,l=100){hd=this._renderer.getRenderTarget(),dd=this._renderer.getActiveCubeFace(),pd=this._renderer.getActiveMipmapLevel(),md=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,s,l,c),i>0&&this._blur(c,0,0,i),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(hd,dd,pd),this._renderer.xr.enabled=md,t.scissorTest=!1,Wc(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Yr||t.mapping===Wr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),hd=this._renderer.getRenderTarget(),dd=this._renderer.getActiveCubeFace(),pd=this._renderer.getActiveMipmapLevel(),md=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(t,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:Hi,minFilter:Hi,generateMipmaps:!1,type:fl,format:wi,colorSpace:jr,depthBuffer:!1},l=uv(t,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uv(t,i,s);const{_lodMax:c}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_T(c)),this._blurMaterial=vT(c,t,i)}return l}_compileMaterial(t){const i=new zn(this._lodPlanes[0],t);this._renderer.compile(i,fd)}_sceneToCubeUV(t,i,s,l){const d=new Mi(90,1,i,s),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,_=g.autoClear,S=g.toneMapping;g.getClearColor(ov),g.toneMapping=ns,g.autoClear=!1;const E=new Cp({name:"PMREM.Background",side:Jn,depthWrite:!1,depthTest:!1}),y=new zn(new dl,E);let T=!1;const A=t.background;A?A.isColor&&(E.color.copy(A),t.background=null,T=!0):(E.color.copy(ov),T=!0);for(let v=0;v<6;v++){const U=v%3;U===0?(d.up.set(0,m[v],0),d.lookAt(p[v],0,0)):U===1?(d.up.set(0,0,m[v]),d.lookAt(0,p[v],0)):(d.up.set(0,m[v],0),d.lookAt(0,0,p[v]));const D=this._cubeSize;Wc(l,U*D,v>2?D:0,D,D),g.setRenderTarget(l),T&&g.render(y,d),g.render(t,d)}y.geometry.dispose(),y.material.dispose(),g.toneMapping=S,g.autoClear=_,t.background=A}_textureToCubeUV(t,i){const s=this._renderer,l=t.mapping===Yr||t.mapping===Wr;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=hv()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fv());const c=l?this._cubemapMaterial:this._equirectMaterial,h=new zn(this._lodPlanes[0],c),d=c.uniforms;d.envMap.value=t;const m=this._cubeSize;Wc(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(h,fd)}_applyPMREM(t){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let c=1;c<l;c++){const h=Math.sqrt(this._sigmas[c]*this._sigmas[c]-this._sigmas[c-1]*this._sigmas[c-1]),d=lv[(l-c-1)%lv.length];this._blur(t,c-1,c,h,d)}i.autoClear=s}_blur(t,i,s,l,c){const h=this._pingPongRenderTarget;this._halfBlur(t,h,i,s,l,"latitudinal",c),this._halfBlur(h,t,s,s,l,"longitudinal",c)}_halfBlur(t,i,s,l,c,h,d){const m=this._renderer,p=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,_=new zn(this._lodPlanes[l],p),S=p.uniforms,E=this._sizeLods[s]-1,y=isFinite(c)?Math.PI/(2*E):2*Math.PI/(2*Ds-1),T=c/y,A=isFinite(c)?1+Math.floor(g*T):Ds;A>Ds&&console.warn(`sigmaRadians, ${c}, is too large and will clip, as it requested ${A} samples when the maximum is set to ${Ds}`);const v=[];let U=0;for(let P=0;P<Ds;++P){const V=P/T,L=Math.exp(-V*V/2);v.push(L),P===0?U+=L:P<A&&(U+=2*L)}for(let P=0;P<v.length;P++)v[P]=v[P]/U;S.envMap.value=t.texture,S.samples.value=A,S.weights.value=v,S.latitudinal.value=h==="latitudinal",d&&(S.poleAxis.value=d);const{_lodMax:D}=this;S.dTheta.value=y,S.mipInt.value=D-s;const O=this._sizeLods[l],H=3*O*(l>D-zr?l-D+zr:0),B=4*(this._cubeSize-O);Wc(i,H,B,3*O,2*O),m.setRenderTarget(i),m.render(_,fd)}}function _T(r){const t=[],i=[],s=[];let l=r;const c=r-zr+1+rv.length;for(let h=0;h<c;h++){const d=Math.pow(2,l);i.push(d);let m=1/d;h>r-zr?m=rv[h-r+zr-1]:h===0&&(m=0),s.push(m);const p=1/(d-2),g=-p,_=1+p,S=[g,g,_,g,_,_,g,g,_,_,g,_],E=6,y=6,T=3,A=2,v=1,U=new Float32Array(T*y*E),D=new Float32Array(A*y*E),O=new Float32Array(v*y*E);for(let B=0;B<E;B++){const P=B%3*2/3-1,V=B>2?0:-1,L=[P,V,0,P+2/3,V,0,P+2/3,V+1,0,P,V,0,P+2/3,V+1,0,P,V+1,0];U.set(L,T*y*B),D.set(S,A*y*B);const C=[B,B,B,B,B,B];O.set(C,v*y*B)}const H=new ci;H.setAttribute("position",new Ln(U,T)),H.setAttribute("uv",new Ln(D,A)),H.setAttribute("faceIndex",new Ln(O,v)),t.push(H),l>zr&&l--}return{lodPlanes:t,sizeLods:i,sigmas:s}}function uv(r,t,i){const s=new Is(r,t,i);return s.texture.mapping=Eu,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Wc(r,t,i,s,l){r.viewport.set(t,i,s,l),r.scissor.set(t,i,s,l)}function vT(r,t,i){const s=new Float32Array(Ds),l=new K(0,1,0);return new Ma({name:"SphericalGaussianBlur",defines:{n:Ds,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Dp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:es,depthTest:!1,depthWrite:!1})}function fv(){return new Ma({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Dp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:es,depthTest:!1,depthWrite:!1})}function hv(){return new Ma({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Dp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:es,depthTest:!1,depthWrite:!1})}function Dp(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ST(r){let t=new WeakMap,i=null;function s(d){if(d&&d.isTexture){const m=d.mapping,p=m===Dd||m===Nd,g=m===Yr||m===Wr;if(p||g){let _=t.get(d);const S=_!==void 0?_.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==S)return i===null&&(i=new cv(r)),_=p?i.fromEquirectangular(d,_):i.fromCubemap(d,_),_.texture.pmremVersion=d.pmremVersion,t.set(d,_),_.texture;if(_!==void 0)return _.texture;{const E=d.image;return p&&E&&E.height>0||g&&E&&l(E)?(i===null&&(i=new cv(r)),_=p?i.fromEquirectangular(d):i.fromCubemap(d),_.texture.pmremVersion=d.pmremVersion,t.set(d,_),d.addEventListener("dispose",c),_.texture):null}}}return d}function l(d){let m=0;const p=6;for(let g=0;g<p;g++)d[g]!==void 0&&m++;return m===p}function c(d){const m=d.target;m.removeEventListener("dispose",c);const p=t.get(m);p!==void 0&&(t.delete(m),p.dispose())}function h(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function MT(r){const t={};function i(s){if(t[s]!==void 0)return t[s];let l;switch(s){case"WEBGL_depth_texture":l=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=r.getExtension(s)}return t[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&Ir("THREE.WebGLRenderer: "+s+" extension not supported."),l}}}function AT(r,t,i,s){const l={},c=new WeakMap;function h(_){const S=_.target;S.index!==null&&t.remove(S.index);for(const y in S.attributes)t.remove(S.attributes[y]);S.removeEventListener("dispose",h),delete l[S.id];const E=c.get(S);E&&(t.remove(E),c.delete(S)),s.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,i.memory.geometries--}function d(_,S){return l[S.id]===!0||(S.addEventListener("dispose",h),l[S.id]=!0,i.memory.geometries++),S}function m(_){const S=_.attributes;for(const E in S)t.update(S[E],r.ARRAY_BUFFER)}function p(_){const S=[],E=_.index,y=_.attributes.position;let T=0;if(E!==null){const U=E.array;T=E.version;for(let D=0,O=U.length;D<O;D+=3){const H=U[D+0],B=U[D+1],P=U[D+2];S.push(H,B,B,P,P,H)}}else if(y!==void 0){const U=y.array;T=y.version;for(let D=0,O=U.length/3-1;D<O;D+=3){const H=D+0,B=D+1,P=D+2;S.push(H,B,B,P,P,H)}}else return;const A=new(l1(S)?d1:h1)(S,1);A.version=T;const v=c.get(_);v&&t.remove(v),c.set(_,A)}function g(_){const S=c.get(_);if(S){const E=_.index;E!==null&&S.version<E.version&&p(_)}else p(_);return c.get(_)}return{get:d,update:m,getWireframeAttribute:g}}function ET(r,t,i){let s;function l(S){s=S}let c,h;function d(S){c=S.type,h=S.bytesPerElement}function m(S,E){r.drawElements(s,E,c,S*h),i.update(E,s,1)}function p(S,E,y){y!==0&&(r.drawElementsInstanced(s,E,c,S*h,y),i.update(E,s,y))}function g(S,E,y){if(y===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,E,0,c,S,0,y);let A=0;for(let v=0;v<y;v++)A+=E[v];i.update(A,s,1)}function _(S,E,y,T){if(y===0)return;const A=t.get("WEBGL_multi_draw");if(A===null)for(let v=0;v<S.length;v++)p(S[v]/h,E[v],T[v]);else{A.multiDrawElementsInstancedWEBGL(s,E,0,c,S,0,T,0,y);let v=0;for(let U=0;U<y;U++)v+=E[U]*T[U];i.update(v,s,1)}}this.setMode=l,this.setIndex=d,this.render=m,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=_}function yT(r){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,h,d){switch(i.calls++,h){case r.TRIANGLES:i.triangles+=d*(c/3);break;case r.LINES:i.lines+=d*(c/2);break;case r.LINE_STRIP:i.lines+=d*(c-1);break;case r.LINE_LOOP:i.lines+=d*c;break;case r.POINTS:i.points+=d*c;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:s}}function xT(r,t,i){const s=new WeakMap,l=new en;function c(h,d,m){const p=h.morphTargetInfluences,g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=g!==void 0?g.length:0;let S=s.get(d);if(S===void 0||S.count!==_){let C=function(){V.dispose(),s.delete(d),d.removeEventListener("dispose",C)};var E=C;S!==void 0&&S.texture.dispose();const y=d.morphAttributes.position!==void 0,T=d.morphAttributes.normal!==void 0,A=d.morphAttributes.color!==void 0,v=d.morphAttributes.position||[],U=d.morphAttributes.normal||[],D=d.morphAttributes.color||[];let O=0;y===!0&&(O=1),T===!0&&(O=2),A===!0&&(O=3);let H=d.attributes.position.count*O,B=1;H>t.maxTextureSize&&(B=Math.ceil(H/t.maxTextureSize),H=t.maxTextureSize);const P=new Float32Array(H*B*4*_),V=new u1(P,H,B,_);V.type=Gi,V.needsUpdate=!0;const L=O*4;for(let z=0;z<_;z++){const nt=v[z],$=U[z],ct=D[z],ft=H*B*4*z;for(let I=0;I<nt.count;I++){const k=I*L;y===!0&&(l.fromBufferAttribute(nt,I),P[ft+k+0]=l.x,P[ft+k+1]=l.y,P[ft+k+2]=l.z,P[ft+k+3]=0),T===!0&&(l.fromBufferAttribute($,I),P[ft+k+4]=l.x,P[ft+k+5]=l.y,P[ft+k+6]=l.z,P[ft+k+7]=0),A===!0&&(l.fromBufferAttribute(ct,I),P[ft+k+8]=l.x,P[ft+k+9]=l.y,P[ft+k+10]=l.z,P[ft+k+11]=ct.itemSize===4?l.w:1)}}S={count:_,texture:V,size:new oe(H,B)},s.set(d,S),d.addEventListener("dispose",C)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",h.morphTexture,i);else{let y=0;for(let A=0;A<p.length;A++)y+=p[A];const T=d.morphTargetsRelative?1:1-y;m.getUniforms().setValue(r,"morphTargetBaseInfluence",T),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",S.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",S.size)}return{update:c}}function TT(r,t,i,s){let l=new WeakMap;function c(m){const p=s.render.frame,g=m.geometry,_=t.get(m,g);if(l.get(_)!==p&&(t.update(_),l.set(_,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",d)===!1&&m.addEventListener("dispose",d),l.get(m)!==p&&(i.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,r.ARRAY_BUFFER),l.set(m,p))),m.isSkinnedMesh){const S=m.skeleton;l.get(S)!==p&&(S.update(),l.set(S,p))}return _}function h(){l=new WeakMap}function d(m){const p=m.target;p.removeEventListener("dispose",d),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:c,dispose:h}}const T1=new Hn,dv=new v1(1,1),R1=new u1,b1=new QA,C1=new g1,pv=[],mv=[],gv=new Float32Array(16),_v=new Float32Array(9),vv=new Float32Array(4);function $r(r,t,i){const s=r[0];if(s<=0||s>0)return r;const l=t*i;let c=pv[l];if(c===void 0&&(c=new Float32Array(l),pv[l]=c),t!==0){s.toArray(c,0);for(let h=1,d=0;h!==t;++h)d+=i,r[h].toArray(c,d)}return c}function mn(r,t){if(r.length!==t.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==t[i])return!1;return!0}function gn(r,t){for(let i=0,s=t.length;i<s;i++)r[i]=t[i]}function Ru(r,t){let i=mv[t];i===void 0&&(i=new Int32Array(t),mv[t]=i);for(let s=0;s!==t;++s)i[s]=r.allocateTextureUnit();return i}function RT(r,t){const i=this.cache;i[0]!==t&&(r.uniform1f(this.addr,t),i[0]=t)}function bT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(mn(i,t))return;r.uniform2fv(this.addr,t),gn(i,t)}}function CT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(mn(i,t))return;r.uniform3fv(this.addr,t),gn(i,t)}}function OT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(mn(i,t))return;r.uniform4fv(this.addr,t),gn(i,t)}}function LT(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(mn(i,t))return;r.uniformMatrix2fv(this.addr,!1,t),gn(i,t)}else{if(mn(i,s))return;vv.set(s),r.uniformMatrix2fv(this.addr,!1,vv),gn(i,s)}}function wT(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(mn(i,t))return;r.uniformMatrix3fv(this.addr,!1,t),gn(i,t)}else{if(mn(i,s))return;_v.set(s),r.uniformMatrix3fv(this.addr,!1,_v),gn(i,s)}}function DT(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(mn(i,t))return;r.uniformMatrix4fv(this.addr,!1,t),gn(i,t)}else{if(mn(i,s))return;gv.set(s),r.uniformMatrix4fv(this.addr,!1,gv),gn(i,s)}}function NT(r,t){const i=this.cache;i[0]!==t&&(r.uniform1i(this.addr,t),i[0]=t)}function UT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(mn(i,t))return;r.uniform2iv(this.addr,t),gn(i,t)}}function PT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(mn(i,t))return;r.uniform3iv(this.addr,t),gn(i,t)}}function IT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(mn(i,t))return;r.uniform4iv(this.addr,t),gn(i,t)}}function BT(r,t){const i=this.cache;i[0]!==t&&(r.uniform1ui(this.addr,t),i[0]=t)}function FT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(mn(i,t))return;r.uniform2uiv(this.addr,t),gn(i,t)}}function zT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(mn(i,t))return;r.uniform3uiv(this.addr,t),gn(i,t)}}function HT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(mn(i,t))return;r.uniform4uiv(this.addr,t),gn(i,t)}}function GT(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(dv.compareFunction=o1,c=dv):c=T1,i.setTexture2D(t||c,l)}function VT(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(t||b1,l)}function kT(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(t||C1,l)}function XT(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(t||R1,l)}function YT(r){switch(r){case 5126:return RT;case 35664:return bT;case 35665:return CT;case 35666:return OT;case 35674:return LT;case 35675:return wT;case 35676:return DT;case 5124:case 35670:return NT;case 35667:case 35671:return UT;case 35668:case 35672:return PT;case 35669:case 35673:return IT;case 5125:return BT;case 36294:return FT;case 36295:return zT;case 36296:return HT;case 35678:case 36198:case 36298:case 36306:case 35682:return GT;case 35679:case 36299:case 36307:return VT;case 35680:case 36300:case 36308:case 36293:return kT;case 36289:case 36303:case 36311:case 36292:return XT}}function WT(r,t){r.uniform1fv(this.addr,t)}function qT(r,t){const i=$r(t,this.size,2);r.uniform2fv(this.addr,i)}function KT(r,t){const i=$r(t,this.size,3);r.uniform3fv(this.addr,i)}function jT(r,t){const i=$r(t,this.size,4);r.uniform4fv(this.addr,i)}function ZT(r,t){const i=$r(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function QT(r,t){const i=$r(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function JT(r,t){const i=$r(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function $T(r,t){r.uniform1iv(this.addr,t)}function tR(r,t){r.uniform2iv(this.addr,t)}function eR(r,t){r.uniform3iv(this.addr,t)}function nR(r,t){r.uniform4iv(this.addr,t)}function iR(r,t){r.uniform1uiv(this.addr,t)}function aR(r,t){r.uniform2uiv(this.addr,t)}function sR(r,t){r.uniform3uiv(this.addr,t)}function rR(r,t){r.uniform4uiv(this.addr,t)}function oR(r,t,i){const s=this.cache,l=t.length,c=Ru(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));for(let h=0;h!==l;++h)i.setTexture2D(t[h]||T1,c[h])}function lR(r,t,i){const s=this.cache,l=t.length,c=Ru(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));for(let h=0;h!==l;++h)i.setTexture3D(t[h]||b1,c[h])}function cR(r,t,i){const s=this.cache,l=t.length,c=Ru(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));for(let h=0;h!==l;++h)i.setTextureCube(t[h]||C1,c[h])}function uR(r,t,i){const s=this.cache,l=t.length,c=Ru(i,l);mn(s,c)||(r.uniform1iv(this.addr,c),gn(s,c));for(let h=0;h!==l;++h)i.setTexture2DArray(t[h]||R1,c[h])}function fR(r){switch(r){case 5126:return WT;case 35664:return qT;case 35665:return KT;case 35666:return jT;case 35674:return ZT;case 35675:return QT;case 35676:return JT;case 5124:case 35670:return $T;case 35667:case 35671:return tR;case 35668:case 35672:return eR;case 35669:case 35673:return nR;case 5125:return iR;case 36294:return aR;case 36295:return sR;case 36296:return rR;case 35678:case 36198:case 36298:case 36306:case 35682:return oR;case 35679:case 36299:case 36307:return lR;case 35680:case 36300:case 36308:case 36293:return cR;case 36289:case 36303:case 36311:case 36292:return uR}}class hR{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.setValue=YT(i.type)}}class dR{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=fR(i.type)}}class pR{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,s){const l=this.seq;for(let c=0,h=l.length;c!==h;++c){const d=l[c];d.setValue(t,i[d.id],s)}}}const gd=/(\w+)(\])?(\[|\.)?/g;function Sv(r,t){r.seq.push(t),r.map[t.id]=t}function mR(r,t,i){const s=r.name,l=s.length;for(gd.lastIndex=0;;){const c=gd.exec(s),h=gd.lastIndex;let d=c[1];const m=c[2]==="]",p=c[3];if(m&&(d=d|0),p===void 0||p==="["&&h+2===l){Sv(i,p===void 0?new hR(d,r,t):new dR(d,r,t));break}else{let _=i.map[d];_===void 0&&(_=new pR(d),Sv(i,_)),i=_}}}class su{constructor(t,i){this.seq=[],this.map={};const s=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let l=0;l<s;++l){const c=t.getActiveUniform(i,l),h=t.getUniformLocation(i,c.name);mR(c,h,this)}}setValue(t,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(t,s,l)}setOptional(t,i,s){const l=i[s];l!==void 0&&this.setValue(t,s,l)}static upload(t,i,s,l){for(let c=0,h=i.length;c!==h;++c){const d=i[c],m=s[d.id];m.needsUpdate!==!1&&d.setValue(t,m.value,l)}}static seqWithValue(t,i){const s=[];for(let l=0,c=t.length;l!==c;++l){const h=t[l];h.id in i&&s.push(h)}return s}}function Mv(r,t,i){const s=r.createShader(t);return r.shaderSource(s,i),r.compileShader(s),s}const gR=37297;let _R=0;function vR(r,t){const i=r.split(`
`),s=[],l=Math.max(t-6,0),c=Math.min(t+6,i.length);for(let h=l;h<c;h++){const d=h+1;s.push(`${d===t?">":" "} ${d}: ${i[h]}`)}return s.join(`
`)}const Av=new de;function SR(r){De._getMatrix(Av,De.workingColorSpace,r);const t=`mat3( ${Av.elements.map(i=>i.toFixed(4))} )`;switch(De.getTransfer(r)){case ou:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function Ev(r,t,i){const s=r.getShaderParameter(t,r.COMPILE_STATUS),l=r.getShaderInfoLog(t).trim();if(s&&l==="")return"";const c=/ERROR: 0:(\d+)/.exec(l);if(c){const h=parseInt(c[1]);return i.toUpperCase()+`

`+l+`

`+vR(r.getShaderSource(t),h)}else return l}function MR(r,t){const i=SR(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function AR(r,t){let i;switch(t){case EA:i="Linear";break;case yA:i="Reinhard";break;case xA:i="Cineon";break;case TA:i="ACESFilmic";break;case bA:i="AgX";break;case CA:i="Neutral";break;case RA:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),i="Linear"}return"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const qc=new K;function ER(){De.getLuminanceCoefficients(qc);const r=qc.x.toFixed(4),t=qc.y.toFixed(4),i=qc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yR(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ol).join(`
`)}function xR(r){const t=[];for(const i in r){const s=r[i];s!==!1&&t.push("#define "+i+" "+s)}return t.join(`
`)}function TR(r,t){const i={},s=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(t,l),h=c.name;let d=1;c.type===r.FLOAT_MAT2&&(d=2),c.type===r.FLOAT_MAT3&&(d=3),c.type===r.FLOAT_MAT4&&(d=4),i[h]={type:c.type,location:r.getAttribLocation(t,h),locationSize:d}}return i}function ol(r){return r!==""}function yv(r,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xv(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const RR=/^[ \t]*#include +<([\w\d./]+)>/gm;function fp(r){return r.replace(RR,CR)}const bR=new Map;function CR(r,t){let i=pe[t];if(i===void 0){const s=bR.get(t);if(s!==void 0)i=pe[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,s);else throw new Error("Can not resolve #include <"+t+">")}return fp(i)}const OR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tv(r){return r.replace(OR,LR)}function LR(r,t,i,s){let l="";for(let c=parseInt(t);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function Rv(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function wR(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Kv?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===eA?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===pa&&(t="SHADOWMAP_TYPE_VSM"),t}function DR(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Yr:case Wr:t="ENVMAP_TYPE_CUBE";break;case Eu:t="ENVMAP_TYPE_CUBE_UV";break}return t}function NR(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Wr:t="ENVMAP_MODE_REFRACTION";break}return t}function UR(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case jv:t="ENVMAP_BLENDING_MULTIPLY";break;case MA:t="ENVMAP_BLENDING_MIX";break;case AA:t="ENVMAP_BLENDING_ADD";break}return t}function PR(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,s=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function IR(r,t,i,s){const l=r.getContext(),c=i.defines;let h=i.vertexShader,d=i.fragmentShader;const m=wR(i),p=DR(i),g=NR(i),_=UR(i),S=PR(i),E=yR(i),y=xR(c),T=l.createProgram();let A,v,U=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(A=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,y].filter(ol).join(`
`),A.length>0&&(A+=`
`),v=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,y].filter(ol).join(`
`),v.length>0&&(v+=`
`)):(A=[Rv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,y,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ol).join(`
`),v=[Rv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,y,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+g:"",i.envMap?"#define "+_:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==ns?"#define TONE_MAPPING":"",i.toneMapping!==ns?pe.tonemapping_pars_fragment:"",i.toneMapping!==ns?AR("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",pe.colorspace_pars_fragment,MR("linearToOutputTexel",i.outputColorSpace),ER(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(ol).join(`
`)),h=fp(h),h=yv(h,i),h=xv(h,i),d=fp(d),d=yv(d,i),d=xv(d,i),h=Tv(h),d=Tv(d),i.isRawShaderMaterial!==!0&&(U=`#version 300 es
`,A=[E,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+A,v=["#define varying in",i.glslVersion===L_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===L_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const D=U+A+h,O=U+v+d,H=Mv(l,l.VERTEX_SHADER,D),B=Mv(l,l.FRAGMENT_SHADER,O);l.attachShader(T,H),l.attachShader(T,B),i.index0AttributeName!==void 0?l.bindAttribLocation(T,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(T,0,"position"),l.linkProgram(T);function P(z){if(r.debug.checkShaderErrors){const nt=l.getProgramInfoLog(T).trim(),$=l.getShaderInfoLog(H).trim(),ct=l.getShaderInfoLog(B).trim();let ft=!0,I=!0;if(l.getProgramParameter(T,l.LINK_STATUS)===!1)if(ft=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,T,H,B);else{const k=Ev(l,H,"vertex"),q=Ev(l,B,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(T,l.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+nt+`
`+k+`
`+q)}else nt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",nt):($===""||ct==="")&&(I=!1);I&&(z.diagnostics={runnable:ft,programLog:nt,vertexShader:{log:$,prefix:A},fragmentShader:{log:ct,prefix:v}})}l.deleteShader(H),l.deleteShader(B),V=new su(l,T),L=TR(l,T)}let V;this.getUniforms=function(){return V===void 0&&P(this),V};let L;this.getAttributes=function(){return L===void 0&&P(this),L};let C=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=l.getProgramParameter(T,gR)),C},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(T),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=_R++,this.cacheKey=t,this.usedTimes=1,this.program=T,this.vertexShader=H,this.fragmentShader=B,this}let BR=0;class FR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,s=t.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(s),h=this._getShaderCacheForMaterial(t);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(c)===!1&&(h.add(c),c.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let s=i.get(t);return s===void 0&&(s=new Set,i.set(t,s)),s}_getShaderStage(t){const i=this.shaderCache;let s=i.get(t);return s===void 0&&(s=new zR(t),i.set(t,s)),s}}class zR{constructor(t){this.id=BR++,this.code=t,this.usedTimes=0}}function HR(r,t,i,s,l,c,h){const d=new bp,m=new FR,p=new Set,g=[],_=l.logarithmicDepthBuffer,S=l.vertexTextures;let E=l.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(L){return p.add(L),L===0?"uv":`uv${L}`}function A(L,C,z,nt,$){const ct=nt.fog,ft=$.geometry,I=L.isMeshStandardMaterial?nt.environment:null,k=(L.isMeshStandardMaterial?i:t).get(L.envMap||I),q=k&&k.mapping===Eu?k.image.height:null,_t=y[L.type];L.precision!==null&&(E=l.getMaxPrecision(L.precision),E!==L.precision&&console.warn("THREE.WebGLProgram.getParameters:",L.precision,"not supported, using",E,"instead."));const Tt=ft.morphAttributes.position||ft.morphAttributes.normal||ft.morphAttributes.color,N=Tt!==void 0?Tt.length:0;let J=0;ft.morphAttributes.position!==void 0&&(J=1),ft.morphAttributes.normal!==void 0&&(J=2),ft.morphAttributes.color!==void 0&&(J=3);let ht,Y,lt,yt;if(_t){const be=zi[_t];ht=be.vertexShader,Y=be.fragmentShader}else ht=L.vertexShader,Y=L.fragmentShader,m.update(L),lt=m.getVertexShaderID(L),yt=m.getFragmentShaderID(L);const At=r.getRenderTarget(),Vt=r.state.buffers.depth.getReversed(),Ht=$.isInstancedMesh===!0,te=$.isBatchedMesh===!0,Ce=!!L.map,fe=!!L.matcap,Be=!!k,G=!!L.aoMap,sn=!!L.lightMap,le=!!L.bumpMap,It=!!L.normalMap,Dt=!!L.displacementMap,Te=!!L.emissiveMap,xt=!!L.metalnessMap,w=!!L.roughnessMap,x=L.anisotropy>0,it=L.clearcoat>0,mt=L.dispersion>0,Rt=L.iridescence>0,St=L.sheen>0,qt=L.transmission>0,wt=x&&!!L.anisotropyMap,kt=it&&!!L.clearcoatMap,Se=it&&!!L.clearcoatNormalMap,Ct=it&&!!L.clearcoatRoughnessMap,Xt=Rt&&!!L.iridescenceMap,jt=Rt&&!!L.iridescenceThicknessMap,Kt=St&&!!L.sheenColorMap,zt=St&&!!L.sheenRoughnessMap,ee=!!L.specularMap,ce=!!L.specularColorMap,Fe=!!L.specularIntensityMap,j=qt&&!!L.transmissionMap,Ot=qt&&!!L.thicknessMap,ut=!!L.gradientMap,Et=!!L.alphaMap,Lt=L.alphaTest>0,Nt=!!L.alphaHash,ne=!!L.extensions;let je=ns;L.toneMapped&&(At===null||At.isXRRenderTarget===!0)&&(je=r.toneMapping);const fn={shaderID:_t,shaderType:L.type,shaderName:L.name,vertexShader:ht,fragmentShader:Y,defines:L.defines,customVertexShaderID:lt,customFragmentShaderID:yt,isRawShaderMaterial:L.isRawShaderMaterial===!0,glslVersion:L.glslVersion,precision:E,batching:te,batchingColor:te&&$._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&$.instanceColor!==null,instancingMorph:Ht&&$.morphTexture!==null,supportsVertexTextures:S,outputColorSpace:At===null?r.outputColorSpace:At.isXRRenderTarget===!0?At.texture.colorSpace:jr,alphaToCoverage:!!L.alphaToCoverage,map:Ce,matcap:fe,envMap:Be,envMapMode:Be&&k.mapping,envMapCubeUVHeight:q,aoMap:G,lightMap:sn,bumpMap:le,normalMap:It,displacementMap:S&&Dt,emissiveMap:Te,normalMapObjectSpace:It&&L.normalMapType===DA,normalMapTangentSpace:It&&L.normalMapType===r1,metalnessMap:xt,roughnessMap:w,anisotropy:x,anisotropyMap:wt,clearcoat:it,clearcoatMap:kt,clearcoatNormalMap:Se,clearcoatRoughnessMap:Ct,dispersion:mt,iridescence:Rt,iridescenceMap:Xt,iridescenceThicknessMap:jt,sheen:St,sheenColorMap:Kt,sheenRoughnessMap:zt,specularMap:ee,specularColorMap:ce,specularIntensityMap:Fe,transmission:qt,transmissionMap:j,thicknessMap:Ot,gradientMap:ut,opaque:L.transparent===!1&&L.blending===Gr&&L.alphaToCoverage===!1,alphaMap:Et,alphaTest:Lt,alphaHash:Nt,combine:L.combine,mapUv:Ce&&T(L.map.channel),aoMapUv:G&&T(L.aoMap.channel),lightMapUv:sn&&T(L.lightMap.channel),bumpMapUv:le&&T(L.bumpMap.channel),normalMapUv:It&&T(L.normalMap.channel),displacementMapUv:Dt&&T(L.displacementMap.channel),emissiveMapUv:Te&&T(L.emissiveMap.channel),metalnessMapUv:xt&&T(L.metalnessMap.channel),roughnessMapUv:w&&T(L.roughnessMap.channel),anisotropyMapUv:wt&&T(L.anisotropyMap.channel),clearcoatMapUv:kt&&T(L.clearcoatMap.channel),clearcoatNormalMapUv:Se&&T(L.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ct&&T(L.clearcoatRoughnessMap.channel),iridescenceMapUv:Xt&&T(L.iridescenceMap.channel),iridescenceThicknessMapUv:jt&&T(L.iridescenceThicknessMap.channel),sheenColorMapUv:Kt&&T(L.sheenColorMap.channel),sheenRoughnessMapUv:zt&&T(L.sheenRoughnessMap.channel),specularMapUv:ee&&T(L.specularMap.channel),specularColorMapUv:ce&&T(L.specularColorMap.channel),specularIntensityMapUv:Fe&&T(L.specularIntensityMap.channel),transmissionMapUv:j&&T(L.transmissionMap.channel),thicknessMapUv:Ot&&T(L.thicknessMap.channel),alphaMapUv:Et&&T(L.alphaMap.channel),vertexTangents:!!ft.attributes.tangent&&(It||x),vertexColors:L.vertexColors,vertexAlphas:L.vertexColors===!0&&!!ft.attributes.color&&ft.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!ft.attributes.uv&&(Ce||Et),fog:!!ct,useFog:L.fog===!0,fogExp2:!!ct&&ct.isFogExp2,flatShading:L.flatShading===!0,sizeAttenuation:L.sizeAttenuation===!0,logarithmicDepthBuffer:_,reverseDepthBuffer:Vt,skinning:$.isSkinnedMesh===!0,morphTargets:ft.morphAttributes.position!==void 0,morphNormals:ft.morphAttributes.normal!==void 0,morphColors:ft.morphAttributes.color!==void 0,morphTargetsCount:N,morphTextureStride:J,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:L.dithering,shadowMapEnabled:r.shadowMap.enabled&&z.length>0,shadowMapType:r.shadowMap.type,toneMapping:je,decodeVideoTexture:Ce&&L.map.isVideoTexture===!0&&De.getTransfer(L.map.colorSpace)===ke,decodeVideoTextureEmissive:Te&&L.emissiveMap.isVideoTexture===!0&&De.getTransfer(L.emissiveMap.colorSpace)===ke,premultipliedAlpha:L.premultipliedAlpha,doubleSided:L.side===ma,flipSided:L.side===Jn,useDepthPacking:L.depthPacking>=0,depthPacking:L.depthPacking||0,index0AttributeName:L.index0AttributeName,extensionClipCullDistance:ne&&L.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ne&&L.extensions.multiDraw===!0||te)&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:L.customProgramCacheKey()};return fn.vertexUv1s=p.has(1),fn.vertexUv2s=p.has(2),fn.vertexUv3s=p.has(3),p.clear(),fn}function v(L){const C=[];if(L.shaderID?C.push(L.shaderID):(C.push(L.customVertexShaderID),C.push(L.customFragmentShaderID)),L.defines!==void 0)for(const z in L.defines)C.push(z),C.push(L.defines[z]);return L.isRawShaderMaterial===!1&&(U(C,L),D(C,L),C.push(r.outputColorSpace)),C.push(L.customProgramCacheKey),C.join()}function U(L,C){L.push(C.precision),L.push(C.outputColorSpace),L.push(C.envMapMode),L.push(C.envMapCubeUVHeight),L.push(C.mapUv),L.push(C.alphaMapUv),L.push(C.lightMapUv),L.push(C.aoMapUv),L.push(C.bumpMapUv),L.push(C.normalMapUv),L.push(C.displacementMapUv),L.push(C.emissiveMapUv),L.push(C.metalnessMapUv),L.push(C.roughnessMapUv),L.push(C.anisotropyMapUv),L.push(C.clearcoatMapUv),L.push(C.clearcoatNormalMapUv),L.push(C.clearcoatRoughnessMapUv),L.push(C.iridescenceMapUv),L.push(C.iridescenceThicknessMapUv),L.push(C.sheenColorMapUv),L.push(C.sheenRoughnessMapUv),L.push(C.specularMapUv),L.push(C.specularColorMapUv),L.push(C.specularIntensityMapUv),L.push(C.transmissionMapUv),L.push(C.thicknessMapUv),L.push(C.combine),L.push(C.fogExp2),L.push(C.sizeAttenuation),L.push(C.morphTargetsCount),L.push(C.morphAttributeCount),L.push(C.numDirLights),L.push(C.numPointLights),L.push(C.numSpotLights),L.push(C.numSpotLightMaps),L.push(C.numHemiLights),L.push(C.numRectAreaLights),L.push(C.numDirLightShadows),L.push(C.numPointLightShadows),L.push(C.numSpotLightShadows),L.push(C.numSpotLightShadowsWithMaps),L.push(C.numLightProbes),L.push(C.shadowMapType),L.push(C.toneMapping),L.push(C.numClippingPlanes),L.push(C.numClipIntersection),L.push(C.depthPacking)}function D(L,C){d.disableAll(),C.supportsVertexTextures&&d.enable(0),C.instancing&&d.enable(1),C.instancingColor&&d.enable(2),C.instancingMorph&&d.enable(3),C.matcap&&d.enable(4),C.envMap&&d.enable(5),C.normalMapObjectSpace&&d.enable(6),C.normalMapTangentSpace&&d.enable(7),C.clearcoat&&d.enable(8),C.iridescence&&d.enable(9),C.alphaTest&&d.enable(10),C.vertexColors&&d.enable(11),C.vertexAlphas&&d.enable(12),C.vertexUv1s&&d.enable(13),C.vertexUv2s&&d.enable(14),C.vertexUv3s&&d.enable(15),C.vertexTangents&&d.enable(16),C.anisotropy&&d.enable(17),C.alphaHash&&d.enable(18),C.batching&&d.enable(19),C.dispersion&&d.enable(20),C.batchingColor&&d.enable(21),L.push(d.mask),d.disableAll(),C.fog&&d.enable(0),C.useFog&&d.enable(1),C.flatShading&&d.enable(2),C.logarithmicDepthBuffer&&d.enable(3),C.reverseDepthBuffer&&d.enable(4),C.skinning&&d.enable(5),C.morphTargets&&d.enable(6),C.morphNormals&&d.enable(7),C.morphColors&&d.enable(8),C.premultipliedAlpha&&d.enable(9),C.shadowMapEnabled&&d.enable(10),C.doubleSided&&d.enable(11),C.flipSided&&d.enable(12),C.useDepthPacking&&d.enable(13),C.dithering&&d.enable(14),C.transmission&&d.enable(15),C.sheen&&d.enable(16),C.opaque&&d.enable(17),C.pointsUvs&&d.enable(18),C.decodeVideoTexture&&d.enable(19),C.decodeVideoTextureEmissive&&d.enable(20),C.alphaToCoverage&&d.enable(21),L.push(d.mask)}function O(L){const C=y[L.type];let z;if(C){const nt=zi[C];z=cE.clone(nt.uniforms)}else z=L.uniforms;return z}function H(L,C){let z;for(let nt=0,$=g.length;nt<$;nt++){const ct=g[nt];if(ct.cacheKey===C){z=ct,++z.usedTimes;break}}return z===void 0&&(z=new IR(r,C,L,c),g.push(z)),z}function B(L){if(--L.usedTimes===0){const C=g.indexOf(L);g[C]=g[g.length-1],g.pop(),L.destroy()}}function P(L){m.remove(L)}function V(){m.dispose()}return{getParameters:A,getProgramCacheKey:v,getUniforms:O,acquireProgram:H,releaseProgram:B,releaseShaderCache:P,programs:g,dispose:V}}function GR(){let r=new WeakMap;function t(h){return r.has(h)}function i(h){let d=r.get(h);return d===void 0&&(d={},r.set(h,d)),d}function s(h){r.delete(h)}function l(h,d,m){r.get(h)[d]=m}function c(){r=new WeakMap}return{has:t,get:i,remove:s,update:l,dispose:c}}function VR(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function bv(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Cv(){const r=[];let t=0;const i=[],s=[],l=[];function c(){t=0,i.length=0,s.length=0,l.length=0}function h(_,S,E,y,T,A){let v=r[t];return v===void 0?(v={id:_.id,object:_,geometry:S,material:E,groupOrder:y,renderOrder:_.renderOrder,z:T,group:A},r[t]=v):(v.id=_.id,v.object=_,v.geometry=S,v.material=E,v.groupOrder=y,v.renderOrder=_.renderOrder,v.z=T,v.group=A),t++,v}function d(_,S,E,y,T,A){const v=h(_,S,E,y,T,A);E.transmission>0?s.push(v):E.transparent===!0?l.push(v):i.push(v)}function m(_,S,E,y,T,A){const v=h(_,S,E,y,T,A);E.transmission>0?s.unshift(v):E.transparent===!0?l.unshift(v):i.unshift(v)}function p(_,S){i.length>1&&i.sort(_||VR),s.length>1&&s.sort(S||bv),l.length>1&&l.sort(S||bv)}function g(){for(let _=t,S=r.length;_<S;_++){const E=r[_];if(E.id===null)break;E.id=null,E.object=null,E.geometry=null,E.material=null,E.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:d,unshift:m,finish:g,sort:p}}function kR(){let r=new WeakMap;function t(s,l){const c=r.get(s);let h;return c===void 0?(h=new Cv,r.set(s,[h])):l>=c.length?(h=new Cv,c.push(h)):h=c[l],h}function i(){r=new WeakMap}return{get:t,dispose:i}}function XR(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new K,color:new me};break;case"SpotLight":i={position:new K,direction:new K,color:new me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new K,color:new me,distance:0,decay:0};break;case"HemisphereLight":i={direction:new K,skyColor:new me,groundColor:new me};break;case"RectAreaLight":i={color:new me,position:new K,halfWidth:new K,halfHeight:new K};break}return r[t.id]=i,i}}}function YR(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=i,i}}}let WR=0;function qR(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function KR(r){const t=new XR,i=YR(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new K);const l=new K,c=new Ue,h=new Ue;function d(p){let g=0,_=0,S=0;for(let L=0;L<9;L++)s.probe[L].set(0,0,0);let E=0,y=0,T=0,A=0,v=0,U=0,D=0,O=0,H=0,B=0,P=0;p.sort(qR);for(let L=0,C=p.length;L<C;L++){const z=p[L],nt=z.color,$=z.intensity,ct=z.distance,ft=z.shadow&&z.shadow.map?z.shadow.map.texture:null;if(z.isAmbientLight)g+=nt.r*$,_+=nt.g*$,S+=nt.b*$;else if(z.isLightProbe){for(let I=0;I<9;I++)s.probe[I].addScaledVector(z.sh.coefficients[I],$);P++}else if(z.isDirectionalLight){const I=t.get(z);if(I.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){const k=z.shadow,q=i.get(z);q.shadowIntensity=k.intensity,q.shadowBias=k.bias,q.shadowNormalBias=k.normalBias,q.shadowRadius=k.radius,q.shadowMapSize=k.mapSize,s.directionalShadow[E]=q,s.directionalShadowMap[E]=ft,s.directionalShadowMatrix[E]=z.shadow.matrix,U++}s.directional[E]=I,E++}else if(z.isSpotLight){const I=t.get(z);I.position.setFromMatrixPosition(z.matrixWorld),I.color.copy(nt).multiplyScalar($),I.distance=ct,I.coneCos=Math.cos(z.angle),I.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),I.decay=z.decay,s.spot[T]=I;const k=z.shadow;if(z.map&&(s.spotLightMap[H]=z.map,H++,k.updateMatrices(z),z.castShadow&&B++),s.spotLightMatrix[T]=k.matrix,z.castShadow){const q=i.get(z);q.shadowIntensity=k.intensity,q.shadowBias=k.bias,q.shadowNormalBias=k.normalBias,q.shadowRadius=k.radius,q.shadowMapSize=k.mapSize,s.spotShadow[T]=q,s.spotShadowMap[T]=ft,O++}T++}else if(z.isRectAreaLight){const I=t.get(z);I.color.copy(nt).multiplyScalar($),I.halfWidth.set(z.width*.5,0,0),I.halfHeight.set(0,z.height*.5,0),s.rectArea[A]=I,A++}else if(z.isPointLight){const I=t.get(z);if(I.color.copy(z.color).multiplyScalar(z.intensity),I.distance=z.distance,I.decay=z.decay,z.castShadow){const k=z.shadow,q=i.get(z);q.shadowIntensity=k.intensity,q.shadowBias=k.bias,q.shadowNormalBias=k.normalBias,q.shadowRadius=k.radius,q.shadowMapSize=k.mapSize,q.shadowCameraNear=k.camera.near,q.shadowCameraFar=k.camera.far,s.pointShadow[y]=q,s.pointShadowMap[y]=ft,s.pointShadowMatrix[y]=z.shadow.matrix,D++}s.point[y]=I,y++}else if(z.isHemisphereLight){const I=t.get(z);I.skyColor.copy(z.color).multiplyScalar($),I.groundColor.copy(z.groundColor).multiplyScalar($),s.hemi[v]=I,v++}}A>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Pt.LTC_FLOAT_1,s.rectAreaLTC2=Pt.LTC_FLOAT_2):(s.rectAreaLTC1=Pt.LTC_HALF_1,s.rectAreaLTC2=Pt.LTC_HALF_2)),s.ambient[0]=g,s.ambient[1]=_,s.ambient[2]=S;const V=s.hash;(V.directionalLength!==E||V.pointLength!==y||V.spotLength!==T||V.rectAreaLength!==A||V.hemiLength!==v||V.numDirectionalShadows!==U||V.numPointShadows!==D||V.numSpotShadows!==O||V.numSpotMaps!==H||V.numLightProbes!==P)&&(s.directional.length=E,s.spot.length=T,s.rectArea.length=A,s.point.length=y,s.hemi.length=v,s.directionalShadow.length=U,s.directionalShadowMap.length=U,s.pointShadow.length=D,s.pointShadowMap.length=D,s.spotShadow.length=O,s.spotShadowMap.length=O,s.directionalShadowMatrix.length=U,s.pointShadowMatrix.length=D,s.spotLightMatrix.length=O+H-B,s.spotLightMap.length=H,s.numSpotLightShadowsWithMaps=B,s.numLightProbes=P,V.directionalLength=E,V.pointLength=y,V.spotLength=T,V.rectAreaLength=A,V.hemiLength=v,V.numDirectionalShadows=U,V.numPointShadows=D,V.numSpotShadows=O,V.numSpotMaps=H,V.numLightProbes=P,s.version=WR++)}function m(p,g){let _=0,S=0,E=0,y=0,T=0;const A=g.matrixWorldInverse;for(let v=0,U=p.length;v<U;v++){const D=p[v];if(D.isDirectionalLight){const O=s.directional[_];O.direction.setFromMatrixPosition(D.matrixWorld),l.setFromMatrixPosition(D.target.matrixWorld),O.direction.sub(l),O.direction.transformDirection(A),_++}else if(D.isSpotLight){const O=s.spot[E];O.position.setFromMatrixPosition(D.matrixWorld),O.position.applyMatrix4(A),O.direction.setFromMatrixPosition(D.matrixWorld),l.setFromMatrixPosition(D.target.matrixWorld),O.direction.sub(l),O.direction.transformDirection(A),E++}else if(D.isRectAreaLight){const O=s.rectArea[y];O.position.setFromMatrixPosition(D.matrixWorld),O.position.applyMatrix4(A),h.identity(),c.copy(D.matrixWorld),c.premultiply(A),h.extractRotation(c),O.halfWidth.set(D.width*.5,0,0),O.halfHeight.set(0,D.height*.5,0),O.halfWidth.applyMatrix4(h),O.halfHeight.applyMatrix4(h),y++}else if(D.isPointLight){const O=s.point[S];O.position.setFromMatrixPosition(D.matrixWorld),O.position.applyMatrix4(A),S++}else if(D.isHemisphereLight){const O=s.hemi[T];O.direction.setFromMatrixPosition(D.matrixWorld),O.direction.transformDirection(A),T++}}}return{setup:d,setupView:m,state:s}}function Ov(r){const t=new KR(r),i=[],s=[];function l(g){p.camera=g,i.length=0,s.length=0}function c(g){i.push(g)}function h(g){s.push(g)}function d(){t.setup(i)}function m(g){t.setupView(i,g)}const p={lightsArray:i,shadowsArray:s,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:p,setupLights:d,setupLightsView:m,pushLight:c,pushShadow:h}}function jR(r){let t=new WeakMap;function i(l,c=0){const h=t.get(l);let d;return h===void 0?(d=new Ov(r),t.set(l,[d])):c>=h.length?(d=new Ov(r),h.push(d)):d=h[c],d}function s(){t=new WeakMap}return{get:i,dispose:s}}const ZR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,QR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function JR(r,t,i){let s=new Op;const l=new oe,c=new oe,h=new en,d=new AE({depthPacking:wA}),m=new EE,p={},g=i.maxTextureSize,_={[is]:Jn,[Jn]:is,[ma]:ma},S=new Ma({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:ZR,fragmentShader:QR}),E=S.clone();E.defines.HORIZONTAL_PASS=1;const y=new ci;y.setAttribute("position",new Ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new zn(y,S),A=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kv;let v=this.type;this.render=function(B,P,V){if(A.enabled===!1||A.autoUpdate===!1&&A.needsUpdate===!1||B.length===0)return;const L=r.getRenderTarget(),C=r.getActiveCubeFace(),z=r.getActiveMipmapLevel(),nt=r.state;nt.setBlending(es),nt.buffers.color.setClear(1,1,1,1),nt.buffers.depth.setTest(!0),nt.setScissorTest(!1);const $=v!==pa&&this.type===pa,ct=v===pa&&this.type!==pa;for(let ft=0,I=B.length;ft<I;ft++){const k=B[ft],q=k.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",k,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;l.copy(q.mapSize);const _t=q.getFrameExtents();if(l.multiply(_t),c.copy(q.mapSize),(l.x>g||l.y>g)&&(l.x>g&&(c.x=Math.floor(g/_t.x),l.x=c.x*_t.x,q.mapSize.x=c.x),l.y>g&&(c.y=Math.floor(g/_t.y),l.y=c.y*_t.y,q.mapSize.y=c.y)),q.map===null||$===!0||ct===!0){const N=this.type!==pa?{minFilter:li,magFilter:li}:{};q.map!==null&&q.map.dispose(),q.map=new Is(l.x,l.y,N),q.map.texture.name=k.name+".shadowMap",q.camera.updateProjectionMatrix()}r.setRenderTarget(q.map),r.clear();const Tt=q.getViewportCount();for(let N=0;N<Tt;N++){const J=q.getViewport(N);h.set(c.x*J.x,c.y*J.y,c.x*J.z,c.y*J.w),nt.viewport(h),q.updateMatrices(k,N),s=q.getFrustum(),O(P,V,q.camera,k,this.type)}q.isPointLightShadow!==!0&&this.type===pa&&U(q,V),q.needsUpdate=!1}v=this.type,A.needsUpdate=!1,r.setRenderTarget(L,C,z)};function U(B,P){const V=t.update(T);S.defines.VSM_SAMPLES!==B.blurSamples&&(S.defines.VSM_SAMPLES=B.blurSamples,E.defines.VSM_SAMPLES=B.blurSamples,S.needsUpdate=!0,E.needsUpdate=!0),B.mapPass===null&&(B.mapPass=new Is(l.x,l.y)),S.uniforms.shadow_pass.value=B.map.texture,S.uniforms.resolution.value=B.mapSize,S.uniforms.radius.value=B.radius,r.setRenderTarget(B.mapPass),r.clear(),r.renderBufferDirect(P,null,V,S,T,null),E.uniforms.shadow_pass.value=B.mapPass.texture,E.uniforms.resolution.value=B.mapSize,E.uniforms.radius.value=B.radius,r.setRenderTarget(B.map),r.clear(),r.renderBufferDirect(P,null,V,E,T,null)}function D(B,P,V,L){let C=null;const z=V.isPointLight===!0?B.customDistanceMaterial:B.customDepthMaterial;if(z!==void 0)C=z;else if(C=V.isPointLight===!0?m:d,r.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const nt=C.uuid,$=P.uuid;let ct=p[nt];ct===void 0&&(ct={},p[nt]=ct);let ft=ct[$];ft===void 0&&(ft=C.clone(),ct[$]=ft,P.addEventListener("dispose",H)),C=ft}if(C.visible=P.visible,C.wireframe=P.wireframe,L===pa?C.side=P.shadowSide!==null?P.shadowSide:P.side:C.side=P.shadowSide!==null?P.shadowSide:_[P.side],C.alphaMap=P.alphaMap,C.alphaTest=P.alphaTest,C.map=P.map,C.clipShadows=P.clipShadows,C.clippingPlanes=P.clippingPlanes,C.clipIntersection=P.clipIntersection,C.displacementMap=P.displacementMap,C.displacementScale=P.displacementScale,C.displacementBias=P.displacementBias,C.wireframeLinewidth=P.wireframeLinewidth,C.linewidth=P.linewidth,V.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const nt=r.properties.get(C);nt.light=V}return C}function O(B,P,V,L,C){if(B.visible===!1)return;if(B.layers.test(P.layers)&&(B.isMesh||B.isLine||B.isPoints)&&(B.castShadow||B.receiveShadow&&C===pa)&&(!B.frustumCulled||s.intersectsObject(B))){B.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,B.matrixWorld);const $=t.update(B),ct=B.material;if(Array.isArray(ct)){const ft=$.groups;for(let I=0,k=ft.length;I<k;I++){const q=ft[I],_t=ct[q.materialIndex];if(_t&&_t.visible){const Tt=D(B,_t,L,C);B.onBeforeShadow(r,B,P,V,$,Tt,q),r.renderBufferDirect(V,null,$,Tt,B,q),B.onAfterShadow(r,B,P,V,$,Tt,q)}}}else if(ct.visible){const ft=D(B,ct,L,C);B.onBeforeShadow(r,B,P,V,$,ft,null),r.renderBufferDirect(V,null,$,ft,B,null),B.onAfterShadow(r,B,P,V,$,ft,null)}}const nt=B.children;for(let $=0,ct=nt.length;$<ct;$++)O(nt[$],P,V,L,C)}function H(B){B.target.removeEventListener("dispose",H);for(const V in p){const L=p[V],C=B.target.uuid;C in L&&(L[C].dispose(),delete L[C])}}}const $R={[Td]:Rd,[bd]:Ld,[Cd]:wd,[Xr]:Od,[Rd]:Td,[Ld]:bd,[wd]:Cd,[Od]:Xr};function tb(r,t){function i(){let j=!1;const Ot=new en;let ut=null;const Et=new en(0,0,0,0);return{setMask:function(Lt){ut!==Lt&&!j&&(r.colorMask(Lt,Lt,Lt,Lt),ut=Lt)},setLocked:function(Lt){j=Lt},setClear:function(Lt,Nt,ne,je,fn){fn===!0&&(Lt*=je,Nt*=je,ne*=je),Ot.set(Lt,Nt,ne,je),Et.equals(Ot)===!1&&(r.clearColor(Lt,Nt,ne,je),Et.copy(Ot))},reset:function(){j=!1,ut=null,Et.set(-1,0,0,0)}}}function s(){let j=!1,Ot=!1,ut=null,Et=null,Lt=null;return{setReversed:function(Nt){if(Ot!==Nt){const ne=t.get("EXT_clip_control");Ot?ne.clipControlEXT(ne.LOWER_LEFT_EXT,ne.ZERO_TO_ONE_EXT):ne.clipControlEXT(ne.LOWER_LEFT_EXT,ne.NEGATIVE_ONE_TO_ONE_EXT);const je=Lt;Lt=null,this.setClear(je)}Ot=Nt},getReversed:function(){return Ot},setTest:function(Nt){Nt?At(r.DEPTH_TEST):Vt(r.DEPTH_TEST)},setMask:function(Nt){ut!==Nt&&!j&&(r.depthMask(Nt),ut=Nt)},setFunc:function(Nt){if(Ot&&(Nt=$R[Nt]),Et!==Nt){switch(Nt){case Td:r.depthFunc(r.NEVER);break;case Rd:r.depthFunc(r.ALWAYS);break;case bd:r.depthFunc(r.LESS);break;case Xr:r.depthFunc(r.LEQUAL);break;case Cd:r.depthFunc(r.EQUAL);break;case Od:r.depthFunc(r.GEQUAL);break;case Ld:r.depthFunc(r.GREATER);break;case wd:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Et=Nt}},setLocked:function(Nt){j=Nt},setClear:function(Nt){Lt!==Nt&&(Ot&&(Nt=1-Nt),r.clearDepth(Nt),Lt=Nt)},reset:function(){j=!1,ut=null,Et=null,Lt=null,Ot=!1}}}function l(){let j=!1,Ot=null,ut=null,Et=null,Lt=null,Nt=null,ne=null,je=null,fn=null;return{setTest:function(be){j||(be?At(r.STENCIL_TEST):Vt(r.STENCIL_TEST))},setMask:function(be){Ot!==be&&!j&&(r.stencilMask(be),Ot=be)},setFunc:function(be,yn,Ai){(ut!==be||Et!==yn||Lt!==Ai)&&(r.stencilFunc(be,yn,Ai),ut=be,Et=yn,Lt=Ai)},setOp:function(be,yn,Ai){(Nt!==be||ne!==yn||je!==Ai)&&(r.stencilOp(be,yn,Ai),Nt=be,ne=yn,je=Ai)},setLocked:function(be){j=be},setClear:function(be){fn!==be&&(r.clearStencil(be),fn=be)},reset:function(){j=!1,Ot=null,ut=null,Et=null,Lt=null,Nt=null,ne=null,je=null,fn=null}}}const c=new i,h=new s,d=new l,m=new WeakMap,p=new WeakMap;let g={},_={},S=new WeakMap,E=[],y=null,T=!1,A=null,v=null,U=null,D=null,O=null,H=null,B=null,P=new me(0,0,0),V=0,L=!1,C=null,z=null,nt=null,$=null,ct=null;const ft=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,k=0;const q=r.getParameter(r.VERSION);q.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(q)[1]),I=k>=1):q.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),I=k>=2);let _t=null,Tt={};const N=r.getParameter(r.SCISSOR_BOX),J=r.getParameter(r.VIEWPORT),ht=new en().fromArray(N),Y=new en().fromArray(J);function lt(j,Ot,ut,Et){const Lt=new Uint8Array(4),Nt=r.createTexture();r.bindTexture(j,Nt),r.texParameteri(j,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(j,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ne=0;ne<ut;ne++)j===r.TEXTURE_3D||j===r.TEXTURE_2D_ARRAY?r.texImage3D(Ot,0,r.RGBA,1,1,Et,0,r.RGBA,r.UNSIGNED_BYTE,Lt):r.texImage2D(Ot+ne,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Lt);return Nt}const yt={};yt[r.TEXTURE_2D]=lt(r.TEXTURE_2D,r.TEXTURE_2D,1),yt[r.TEXTURE_CUBE_MAP]=lt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),yt[r.TEXTURE_2D_ARRAY]=lt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),yt[r.TEXTURE_3D]=lt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),h.setClear(1),d.setClear(0),At(r.DEPTH_TEST),h.setFunc(Xr),le(!1),It(T_),At(r.CULL_FACE),G(es);function At(j){g[j]!==!0&&(r.enable(j),g[j]=!0)}function Vt(j){g[j]!==!1&&(r.disable(j),g[j]=!1)}function Ht(j,Ot){return _[j]!==Ot?(r.bindFramebuffer(j,Ot),_[j]=Ot,j===r.DRAW_FRAMEBUFFER&&(_[r.FRAMEBUFFER]=Ot),j===r.FRAMEBUFFER&&(_[r.DRAW_FRAMEBUFFER]=Ot),!0):!1}function te(j,Ot){let ut=E,Et=!1;if(j){ut=S.get(Ot),ut===void 0&&(ut=[],S.set(Ot,ut));const Lt=j.textures;if(ut.length!==Lt.length||ut[0]!==r.COLOR_ATTACHMENT0){for(let Nt=0,ne=Lt.length;Nt<ne;Nt++)ut[Nt]=r.COLOR_ATTACHMENT0+Nt;ut.length=Lt.length,Et=!0}}else ut[0]!==r.BACK&&(ut[0]=r.BACK,Et=!0);Et&&r.drawBuffers(ut)}function Ce(j){return y!==j?(r.useProgram(j),y=j,!0):!1}const fe={[ws]:r.FUNC_ADD,[iA]:r.FUNC_SUBTRACT,[aA]:r.FUNC_REVERSE_SUBTRACT};fe[sA]=r.MIN,fe[rA]=r.MAX;const Be={[oA]:r.ZERO,[lA]:r.ONE,[cA]:r.SRC_COLOR,[yd]:r.SRC_ALPHA,[mA]:r.SRC_ALPHA_SATURATE,[dA]:r.DST_COLOR,[fA]:r.DST_ALPHA,[uA]:r.ONE_MINUS_SRC_COLOR,[xd]:r.ONE_MINUS_SRC_ALPHA,[pA]:r.ONE_MINUS_DST_COLOR,[hA]:r.ONE_MINUS_DST_ALPHA,[gA]:r.CONSTANT_COLOR,[_A]:r.ONE_MINUS_CONSTANT_COLOR,[vA]:r.CONSTANT_ALPHA,[SA]:r.ONE_MINUS_CONSTANT_ALPHA};function G(j,Ot,ut,Et,Lt,Nt,ne,je,fn,be){if(j===es){T===!0&&(Vt(r.BLEND),T=!1);return}if(T===!1&&(At(r.BLEND),T=!0),j!==nA){if(j!==A||be!==L){if((v!==ws||O!==ws)&&(r.blendEquation(r.FUNC_ADD),v=ws,O=ws),be)switch(j){case Gr:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case R_:r.blendFunc(r.ONE,r.ONE);break;case b_:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case C_:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case Gr:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case R_:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case b_:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case C_:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}U=null,D=null,H=null,B=null,P.set(0,0,0),V=0,A=j,L=be}return}Lt=Lt||Ot,Nt=Nt||ut,ne=ne||Et,(Ot!==v||Lt!==O)&&(r.blendEquationSeparate(fe[Ot],fe[Lt]),v=Ot,O=Lt),(ut!==U||Et!==D||Nt!==H||ne!==B)&&(r.blendFuncSeparate(Be[ut],Be[Et],Be[Nt],Be[ne]),U=ut,D=Et,H=Nt,B=ne),(je.equals(P)===!1||fn!==V)&&(r.blendColor(je.r,je.g,je.b,fn),P.copy(je),V=fn),A=j,L=!1}function sn(j,Ot){j.side===ma?Vt(r.CULL_FACE):At(r.CULL_FACE);let ut=j.side===Jn;Ot&&(ut=!ut),le(ut),j.blending===Gr&&j.transparent===!1?G(es):G(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),h.setFunc(j.depthFunc),h.setTest(j.depthTest),h.setMask(j.depthWrite),c.setMask(j.colorWrite);const Et=j.stencilWrite;d.setTest(Et),Et&&(d.setMask(j.stencilWriteMask),d.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),d.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Te(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?At(r.SAMPLE_ALPHA_TO_COVERAGE):Vt(r.SAMPLE_ALPHA_TO_COVERAGE)}function le(j){C!==j&&(j?r.frontFace(r.CW):r.frontFace(r.CCW),C=j)}function It(j){j!==$M?(At(r.CULL_FACE),j!==z&&(j===T_?r.cullFace(r.BACK):j===tA?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Vt(r.CULL_FACE),z=j}function Dt(j){j!==nt&&(I&&r.lineWidth(j),nt=j)}function Te(j,Ot,ut){j?(At(r.POLYGON_OFFSET_FILL),($!==Ot||ct!==ut)&&(r.polygonOffset(Ot,ut),$=Ot,ct=ut)):Vt(r.POLYGON_OFFSET_FILL)}function xt(j){j?At(r.SCISSOR_TEST):Vt(r.SCISSOR_TEST)}function w(j){j===void 0&&(j=r.TEXTURE0+ft-1),_t!==j&&(r.activeTexture(j),_t=j)}function x(j,Ot,ut){ut===void 0&&(_t===null?ut=r.TEXTURE0+ft-1:ut=_t);let Et=Tt[ut];Et===void 0&&(Et={type:void 0,texture:void 0},Tt[ut]=Et),(Et.type!==j||Et.texture!==Ot)&&(_t!==ut&&(r.activeTexture(ut),_t=ut),r.bindTexture(j,Ot||yt[j]),Et.type=j,Et.texture=Ot)}function it(){const j=Tt[_t];j!==void 0&&j.type!==void 0&&(r.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function mt(){try{r.compressedTexImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Rt(){try{r.compressedTexImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function St(){try{r.texSubImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function qt(){try{r.texSubImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function wt(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function kt(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Se(){try{r.texStorage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ct(){try{r.texStorage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Xt(){try{r.texImage2D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function jt(){try{r.texImage3D.apply(r,arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Kt(j){ht.equals(j)===!1&&(r.scissor(j.x,j.y,j.z,j.w),ht.copy(j))}function zt(j){Y.equals(j)===!1&&(r.viewport(j.x,j.y,j.z,j.w),Y.copy(j))}function ee(j,Ot){let ut=p.get(Ot);ut===void 0&&(ut=new WeakMap,p.set(Ot,ut));let Et=ut.get(j);Et===void 0&&(Et=r.getUniformBlockIndex(Ot,j.name),ut.set(j,Et))}function ce(j,Ot){const Et=p.get(Ot).get(j);m.get(Ot)!==Et&&(r.uniformBlockBinding(Ot,Et,j.__bindingPointIndex),m.set(Ot,Et))}function Fe(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),h.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),g={},_t=null,Tt={},_={},S=new WeakMap,E=[],y=null,T=!1,A=null,v=null,U=null,D=null,O=null,H=null,B=null,P=new me(0,0,0),V=0,L=!1,C=null,z=null,nt=null,$=null,ct=null,ht.set(0,0,r.canvas.width,r.canvas.height),Y.set(0,0,r.canvas.width,r.canvas.height),c.reset(),h.reset(),d.reset()}return{buffers:{color:c,depth:h,stencil:d},enable:At,disable:Vt,bindFramebuffer:Ht,drawBuffers:te,useProgram:Ce,setBlending:G,setMaterial:sn,setFlipSided:le,setCullFace:It,setLineWidth:Dt,setPolygonOffset:Te,setScissorTest:xt,activeTexture:w,bindTexture:x,unbindTexture:it,compressedTexImage2D:mt,compressedTexImage3D:Rt,texImage2D:Xt,texImage3D:jt,updateUBOMapping:ee,uniformBlockBinding:ce,texStorage2D:Se,texStorage3D:Ct,texSubImage2D:St,texSubImage3D:qt,compressedTexSubImage2D:wt,compressedTexSubImage3D:kt,scissor:Kt,viewport:zt,reset:Fe}}function eb(r,t,i,s,l,c,h){const d=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new oe,g=new WeakMap;let _;const S=new WeakMap;let E=!1;try{E=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(w,x){return E?new OffscreenCanvas(w,x):uu("canvas")}function T(w,x,it){let mt=1;const Rt=xt(w);if((Rt.width>it||Rt.height>it)&&(mt=it/Math.max(Rt.width,Rt.height)),mt<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const St=Math.floor(mt*Rt.width),qt=Math.floor(mt*Rt.height);_===void 0&&(_=y(St,qt));const wt=x?y(St,qt):_;return wt.width=St,wt.height=qt,wt.getContext("2d").drawImage(w,0,0,St,qt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Rt.width+"x"+Rt.height+") to ("+St+"x"+qt+")."),wt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Rt.width+"x"+Rt.height+")."),w;return w}function A(w){return w.generateMipmaps}function v(w){r.generateMipmap(w)}function U(w){return w.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?r.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function D(w,x,it,mt,Rt=!1){if(w!==null){if(r[w]!==void 0)return r[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let St=x;if(x===r.RED&&(it===r.FLOAT&&(St=r.R32F),it===r.HALF_FLOAT&&(St=r.R16F),it===r.UNSIGNED_BYTE&&(St=r.R8)),x===r.RED_INTEGER&&(it===r.UNSIGNED_BYTE&&(St=r.R8UI),it===r.UNSIGNED_SHORT&&(St=r.R16UI),it===r.UNSIGNED_INT&&(St=r.R32UI),it===r.BYTE&&(St=r.R8I),it===r.SHORT&&(St=r.R16I),it===r.INT&&(St=r.R32I)),x===r.RG&&(it===r.FLOAT&&(St=r.RG32F),it===r.HALF_FLOAT&&(St=r.RG16F),it===r.UNSIGNED_BYTE&&(St=r.RG8)),x===r.RG_INTEGER&&(it===r.UNSIGNED_BYTE&&(St=r.RG8UI),it===r.UNSIGNED_SHORT&&(St=r.RG16UI),it===r.UNSIGNED_INT&&(St=r.RG32UI),it===r.BYTE&&(St=r.RG8I),it===r.SHORT&&(St=r.RG16I),it===r.INT&&(St=r.RG32I)),x===r.RGB_INTEGER&&(it===r.UNSIGNED_BYTE&&(St=r.RGB8UI),it===r.UNSIGNED_SHORT&&(St=r.RGB16UI),it===r.UNSIGNED_INT&&(St=r.RGB32UI),it===r.BYTE&&(St=r.RGB8I),it===r.SHORT&&(St=r.RGB16I),it===r.INT&&(St=r.RGB32I)),x===r.RGBA_INTEGER&&(it===r.UNSIGNED_BYTE&&(St=r.RGBA8UI),it===r.UNSIGNED_SHORT&&(St=r.RGBA16UI),it===r.UNSIGNED_INT&&(St=r.RGBA32UI),it===r.BYTE&&(St=r.RGBA8I),it===r.SHORT&&(St=r.RGBA16I),it===r.INT&&(St=r.RGBA32I)),x===r.RGB&&it===r.UNSIGNED_INT_5_9_9_9_REV&&(St=r.RGB9_E5),x===r.RGBA){const qt=Rt?ou:De.getTransfer(mt);it===r.FLOAT&&(St=r.RGBA32F),it===r.HALF_FLOAT&&(St=r.RGBA16F),it===r.UNSIGNED_BYTE&&(St=qt===ke?r.SRGB8_ALPHA8:r.RGBA8),it===r.UNSIGNED_SHORT_4_4_4_4&&(St=r.RGBA4),it===r.UNSIGNED_SHORT_5_5_5_1&&(St=r.RGB5_A1)}return(St===r.R16F||St===r.R32F||St===r.RG16F||St===r.RG32F||St===r.RGBA16F||St===r.RGBA32F)&&t.get("EXT_color_buffer_float"),St}function O(w,x){let it;return w?x===null||x===Ps||x===qr?it=r.DEPTH24_STENCIL8:x===Gi?it=r.DEPTH32F_STENCIL8:x===ul&&(it=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Ps||x===qr?it=r.DEPTH_COMPONENT24:x===Gi?it=r.DEPTH_COMPONENT32F:x===ul&&(it=r.DEPTH_COMPONENT16),it}function H(w,x){return A(w)===!0||w.isFramebufferTexture&&w.minFilter!==li&&w.minFilter!==Hi?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function B(w){const x=w.target;x.removeEventListener("dispose",B),V(x),x.isVideoTexture&&g.delete(x)}function P(w){const x=w.target;x.removeEventListener("dispose",P),C(x)}function V(w){const x=s.get(w);if(x.__webglInit===void 0)return;const it=w.source,mt=S.get(it);if(mt){const Rt=mt[x.__cacheKey];Rt.usedTimes--,Rt.usedTimes===0&&L(w),Object.keys(mt).length===0&&S.delete(it)}s.remove(w)}function L(w){const x=s.get(w);r.deleteTexture(x.__webglTexture);const it=w.source,mt=S.get(it);delete mt[x.__cacheKey],h.memory.textures--}function C(w){const x=s.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),s.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let mt=0;mt<6;mt++){if(Array.isArray(x.__webglFramebuffer[mt]))for(let Rt=0;Rt<x.__webglFramebuffer[mt].length;Rt++)r.deleteFramebuffer(x.__webglFramebuffer[mt][Rt]);else r.deleteFramebuffer(x.__webglFramebuffer[mt]);x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer[mt])}else{if(Array.isArray(x.__webglFramebuffer))for(let mt=0;mt<x.__webglFramebuffer.length;mt++)r.deleteFramebuffer(x.__webglFramebuffer[mt]);else r.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&r.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let mt=0;mt<x.__webglColorRenderbuffer.length;mt++)x.__webglColorRenderbuffer[mt]&&r.deleteRenderbuffer(x.__webglColorRenderbuffer[mt]);x.__webglDepthRenderbuffer&&r.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const it=w.textures;for(let mt=0,Rt=it.length;mt<Rt;mt++){const St=s.get(it[mt]);St.__webglTexture&&(r.deleteTexture(St.__webglTexture),h.memory.textures--),s.remove(it[mt])}s.remove(w)}let z=0;function nt(){z=0}function $(){const w=z;return w>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+l.maxTextures),z+=1,w}function ct(w){const x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function ft(w,x){const it=s.get(w);if(w.isVideoTexture&&Dt(w),w.isRenderTargetTexture===!1&&w.version>0&&it.__version!==w.version){const mt=w.image;if(mt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(mt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(it,w,x);return}}i.bindTexture(r.TEXTURE_2D,it.__webglTexture,r.TEXTURE0+x)}function I(w,x){const it=s.get(w);if(w.version>0&&it.__version!==w.version){Y(it,w,x);return}i.bindTexture(r.TEXTURE_2D_ARRAY,it.__webglTexture,r.TEXTURE0+x)}function k(w,x){const it=s.get(w);if(w.version>0&&it.__version!==w.version){Y(it,w,x);return}i.bindTexture(r.TEXTURE_3D,it.__webglTexture,r.TEXTURE0+x)}function q(w,x){const it=s.get(w);if(w.version>0&&it.__version!==w.version){lt(it,w,x);return}i.bindTexture(r.TEXTURE_CUBE_MAP,it.__webglTexture,r.TEXTURE0+x)}const _t={[Ud]:r.REPEAT,[Ns]:r.CLAMP_TO_EDGE,[Pd]:r.MIRRORED_REPEAT},Tt={[li]:r.NEAREST,[OA]:r.NEAREST_MIPMAP_NEAREST,[xc]:r.NEAREST_MIPMAP_LINEAR,[Hi]:r.LINEAR,[Hh]:r.LINEAR_MIPMAP_NEAREST,[Us]:r.LINEAR_MIPMAP_LINEAR},N={[NA]:r.NEVER,[zA]:r.ALWAYS,[UA]:r.LESS,[o1]:r.LEQUAL,[PA]:r.EQUAL,[FA]:r.GEQUAL,[IA]:r.GREATER,[BA]:r.NOTEQUAL};function J(w,x){if(x.type===Gi&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Hi||x.magFilter===Hh||x.magFilter===xc||x.magFilter===Us||x.minFilter===Hi||x.minFilter===Hh||x.minFilter===xc||x.minFilter===Us)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(w,r.TEXTURE_WRAP_S,_t[x.wrapS]),r.texParameteri(w,r.TEXTURE_WRAP_T,_t[x.wrapT]),(w===r.TEXTURE_3D||w===r.TEXTURE_2D_ARRAY)&&r.texParameteri(w,r.TEXTURE_WRAP_R,_t[x.wrapR]),r.texParameteri(w,r.TEXTURE_MAG_FILTER,Tt[x.magFilter]),r.texParameteri(w,r.TEXTURE_MIN_FILTER,Tt[x.minFilter]),x.compareFunction&&(r.texParameteri(w,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(w,r.TEXTURE_COMPARE_FUNC,N[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===li||x.minFilter!==xc&&x.minFilter!==Us||x.type===Gi&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||s.get(x).__currentAnisotropy){const it=t.get("EXT_texture_filter_anisotropic");r.texParameterf(w,it.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,l.getMaxAnisotropy())),s.get(x).__currentAnisotropy=x.anisotropy}}}function ht(w,x){let it=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",B));const mt=x.source;let Rt=S.get(mt);Rt===void 0&&(Rt={},S.set(mt,Rt));const St=ct(x);if(St!==w.__cacheKey){Rt[St]===void 0&&(Rt[St]={texture:r.createTexture(),usedTimes:0},h.memory.textures++,it=!0),Rt[St].usedTimes++;const qt=Rt[w.__cacheKey];qt!==void 0&&(Rt[w.__cacheKey].usedTimes--,qt.usedTimes===0&&L(x)),w.__cacheKey=St,w.__webglTexture=Rt[St].texture}return it}function Y(w,x,it){let mt=r.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(mt=r.TEXTURE_2D_ARRAY),x.isData3DTexture&&(mt=r.TEXTURE_3D);const Rt=ht(w,x),St=x.source;i.bindTexture(mt,w.__webglTexture,r.TEXTURE0+it);const qt=s.get(St);if(St.version!==qt.__version||Rt===!0){i.activeTexture(r.TEXTURE0+it);const wt=De.getPrimaries(De.workingColorSpace),kt=x.colorSpace===$a?null:De.getPrimaries(x.colorSpace),Se=x.colorSpace===$a||wt===kt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let Ct=T(x.image,!1,l.maxTextureSize);Ct=Te(x,Ct);const Xt=c.convert(x.format,x.colorSpace),jt=c.convert(x.type);let Kt=D(x.internalFormat,Xt,jt,x.colorSpace,x.isVideoTexture);J(mt,x);let zt;const ee=x.mipmaps,ce=x.isVideoTexture!==!0,Fe=qt.__version===void 0||Rt===!0,j=St.dataReady,Ot=H(x,Ct);if(x.isDepthTexture)Kt=O(x.format===Kr,x.type),Fe&&(ce?i.texStorage2D(r.TEXTURE_2D,1,Kt,Ct.width,Ct.height):i.texImage2D(r.TEXTURE_2D,0,Kt,Ct.width,Ct.height,0,Xt,jt,null));else if(x.isDataTexture)if(ee.length>0){ce&&Fe&&i.texStorage2D(r.TEXTURE_2D,Ot,Kt,ee[0].width,ee[0].height);for(let ut=0,Et=ee.length;ut<Et;ut++)zt=ee[ut],ce?j&&i.texSubImage2D(r.TEXTURE_2D,ut,0,0,zt.width,zt.height,Xt,jt,zt.data):i.texImage2D(r.TEXTURE_2D,ut,Kt,zt.width,zt.height,0,Xt,jt,zt.data);x.generateMipmaps=!1}else ce?(Fe&&i.texStorage2D(r.TEXTURE_2D,Ot,Kt,Ct.width,Ct.height),j&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Ct.width,Ct.height,Xt,jt,Ct.data)):i.texImage2D(r.TEXTURE_2D,0,Kt,Ct.width,Ct.height,0,Xt,jt,Ct.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){ce&&Fe&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ot,Kt,ee[0].width,ee[0].height,Ct.depth);for(let ut=0,Et=ee.length;ut<Et;ut++)if(zt=ee[ut],x.format!==wi)if(Xt!==null)if(ce){if(j)if(x.layerUpdates.size>0){const Lt=sv(zt.width,zt.height,x.format,x.type);for(const Nt of x.layerUpdates){const ne=zt.data.subarray(Nt*Lt/zt.data.BYTES_PER_ELEMENT,(Nt+1)*Lt/zt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ut,0,0,Nt,zt.width,zt.height,1,Xt,ne)}x.clearLayerUpdates()}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ut,0,0,0,zt.width,zt.height,Ct.depth,Xt,zt.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ut,Kt,zt.width,zt.height,Ct.depth,0,zt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ce?j&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,ut,0,0,0,zt.width,zt.height,Ct.depth,Xt,jt,zt.data):i.texImage3D(r.TEXTURE_2D_ARRAY,ut,Kt,zt.width,zt.height,Ct.depth,0,Xt,jt,zt.data)}else{ce&&Fe&&i.texStorage2D(r.TEXTURE_2D,Ot,Kt,ee[0].width,ee[0].height);for(let ut=0,Et=ee.length;ut<Et;ut++)zt=ee[ut],x.format!==wi?Xt!==null?ce?j&&i.compressedTexSubImage2D(r.TEXTURE_2D,ut,0,0,zt.width,zt.height,Xt,zt.data):i.compressedTexImage2D(r.TEXTURE_2D,ut,Kt,zt.width,zt.height,0,zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ce?j&&i.texSubImage2D(r.TEXTURE_2D,ut,0,0,zt.width,zt.height,Xt,jt,zt.data):i.texImage2D(r.TEXTURE_2D,ut,Kt,zt.width,zt.height,0,Xt,jt,zt.data)}else if(x.isDataArrayTexture)if(ce){if(Fe&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ot,Kt,Ct.width,Ct.height,Ct.depth),j)if(x.layerUpdates.size>0){const ut=sv(Ct.width,Ct.height,x.format,x.type);for(const Et of x.layerUpdates){const Lt=Ct.data.subarray(Et*ut/Ct.data.BYTES_PER_ELEMENT,(Et+1)*ut/Ct.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Et,Ct.width,Ct.height,1,Xt,jt,Lt)}x.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Ct.width,Ct.height,Ct.depth,Xt,jt,Ct.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,Kt,Ct.width,Ct.height,Ct.depth,0,Xt,jt,Ct.data);else if(x.isData3DTexture)ce?(Fe&&i.texStorage3D(r.TEXTURE_3D,Ot,Kt,Ct.width,Ct.height,Ct.depth),j&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Ct.width,Ct.height,Ct.depth,Xt,jt,Ct.data)):i.texImage3D(r.TEXTURE_3D,0,Kt,Ct.width,Ct.height,Ct.depth,0,Xt,jt,Ct.data);else if(x.isFramebufferTexture){if(Fe)if(ce)i.texStorage2D(r.TEXTURE_2D,Ot,Kt,Ct.width,Ct.height);else{let ut=Ct.width,Et=Ct.height;for(let Lt=0;Lt<Ot;Lt++)i.texImage2D(r.TEXTURE_2D,Lt,Kt,ut,Et,0,Xt,jt,null),ut>>=1,Et>>=1}}else if(ee.length>0){if(ce&&Fe){const ut=xt(ee[0]);i.texStorage2D(r.TEXTURE_2D,Ot,Kt,ut.width,ut.height)}for(let ut=0,Et=ee.length;ut<Et;ut++)zt=ee[ut],ce?j&&i.texSubImage2D(r.TEXTURE_2D,ut,0,0,Xt,jt,zt):i.texImage2D(r.TEXTURE_2D,ut,Kt,Xt,jt,zt);x.generateMipmaps=!1}else if(ce){if(Fe){const ut=xt(Ct);i.texStorage2D(r.TEXTURE_2D,Ot,Kt,ut.width,ut.height)}j&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Xt,jt,Ct)}else i.texImage2D(r.TEXTURE_2D,0,Kt,Xt,jt,Ct);A(x)&&v(mt),qt.__version=St.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function lt(w,x,it){if(x.image.length!==6)return;const mt=ht(w,x),Rt=x.source;i.bindTexture(r.TEXTURE_CUBE_MAP,w.__webglTexture,r.TEXTURE0+it);const St=s.get(Rt);if(Rt.version!==St.__version||mt===!0){i.activeTexture(r.TEXTURE0+it);const qt=De.getPrimaries(De.workingColorSpace),wt=x.colorSpace===$a?null:De.getPrimaries(x.colorSpace),kt=x.colorSpace===$a||qt===wt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);const Se=x.isCompressedTexture||x.image[0].isCompressedTexture,Ct=x.image[0]&&x.image[0].isDataTexture,Xt=[];for(let Et=0;Et<6;Et++)!Se&&!Ct?Xt[Et]=T(x.image[Et],!0,l.maxCubemapSize):Xt[Et]=Ct?x.image[Et].image:x.image[Et],Xt[Et]=Te(x,Xt[Et]);const jt=Xt[0],Kt=c.convert(x.format,x.colorSpace),zt=c.convert(x.type),ee=D(x.internalFormat,Kt,zt,x.colorSpace),ce=x.isVideoTexture!==!0,Fe=St.__version===void 0||mt===!0,j=Rt.dataReady;let Ot=H(x,jt);J(r.TEXTURE_CUBE_MAP,x);let ut;if(Se){ce&&Fe&&i.texStorage2D(r.TEXTURE_CUBE_MAP,Ot,ee,jt.width,jt.height);for(let Et=0;Et<6;Et++){ut=Xt[Et].mipmaps;for(let Lt=0;Lt<ut.length;Lt++){const Nt=ut[Lt];x.format!==wi?Kt!==null?ce?j&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt,0,0,Nt.width,Nt.height,Kt,Nt.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt,ee,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ce?j&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt,0,0,Nt.width,Nt.height,Kt,zt,Nt.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt,ee,Nt.width,Nt.height,0,Kt,zt,Nt.data)}}}else{if(ut=x.mipmaps,ce&&Fe){ut.length>0&&Ot++;const Et=xt(Xt[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,Ot,ee,Et.width,Et.height)}for(let Et=0;Et<6;Et++)if(Ct){ce?j&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,Xt[Et].width,Xt[Et].height,Kt,zt,Xt[Et].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,ee,Xt[Et].width,Xt[Et].height,0,Kt,zt,Xt[Et].data);for(let Lt=0;Lt<ut.length;Lt++){const ne=ut[Lt].image[Et].image;ce?j&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt+1,0,0,ne.width,ne.height,Kt,zt,ne.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt+1,ee,ne.width,ne.height,0,Kt,zt,ne.data)}}else{ce?j&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,0,0,Kt,zt,Xt[Et]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,ee,Kt,zt,Xt[Et]);for(let Lt=0;Lt<ut.length;Lt++){const Nt=ut[Lt];ce?j&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt+1,0,0,Kt,zt,Nt.image[Et]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Lt+1,ee,Kt,zt,Nt.image[Et])}}}A(x)&&v(r.TEXTURE_CUBE_MAP),St.__version=Rt.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function yt(w,x,it,mt,Rt,St){const qt=c.convert(it.format,it.colorSpace),wt=c.convert(it.type),kt=D(it.internalFormat,qt,wt,it.colorSpace),Se=s.get(x),Ct=s.get(it);if(Ct.__renderTarget=x,!Se.__hasExternalTextures){const Xt=Math.max(1,x.width>>St),jt=Math.max(1,x.height>>St);Rt===r.TEXTURE_3D||Rt===r.TEXTURE_2D_ARRAY?i.texImage3D(Rt,St,kt,Xt,jt,x.depth,0,qt,wt,null):i.texImage2D(Rt,St,kt,Xt,jt,0,qt,wt,null)}i.bindFramebuffer(r.FRAMEBUFFER,w),It(x)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,mt,Rt,Ct.__webglTexture,0,le(x)):(Rt===r.TEXTURE_2D||Rt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Rt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,mt,Rt,Ct.__webglTexture,St),i.bindFramebuffer(r.FRAMEBUFFER,null)}function At(w,x,it){if(r.bindRenderbuffer(r.RENDERBUFFER,w),x.depthBuffer){const mt=x.depthTexture,Rt=mt&&mt.isDepthTexture?mt.type:null,St=O(x.stencilBuffer,Rt),qt=x.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,wt=le(x);It(x)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,wt,St,x.width,x.height):it?r.renderbufferStorageMultisample(r.RENDERBUFFER,wt,St,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,St,x.width,x.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,qt,r.RENDERBUFFER,w)}else{const mt=x.textures;for(let Rt=0;Rt<mt.length;Rt++){const St=mt[Rt],qt=c.convert(St.format,St.colorSpace),wt=c.convert(St.type),kt=D(St.internalFormat,qt,wt,St.colorSpace),Se=le(x);it&&It(x)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Se,kt,x.width,x.height):It(x)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Se,kt,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,kt,x.width,x.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Vt(w,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(r.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const mt=s.get(x.depthTexture);mt.__renderTarget=x,(!mt.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),ft(x.depthTexture,0);const Rt=mt.__webglTexture,St=le(x);if(x.depthTexture.format===Vr)It(x)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Rt,0,St):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Rt,0);else if(x.depthTexture.format===Kr)It(x)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Rt,0,St):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Rt,0);else throw new Error("Unknown depthTexture format")}function Ht(w){const x=s.get(w),it=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){const mt=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),mt){const Rt=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,mt.removeEventListener("dispose",Rt)};mt.addEventListener("dispose",Rt),x.__depthDisposeCallback=Rt}x.__boundDepthTexture=mt}if(w.depthTexture&&!x.__autoAllocateDepthBuffer){if(it)throw new Error("target.depthTexture not supported in Cube render targets");Vt(x.__webglFramebuffer,w)}else if(it){x.__webglDepthbuffer=[];for(let mt=0;mt<6;mt++)if(i.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[mt]),x.__webglDepthbuffer[mt]===void 0)x.__webglDepthbuffer[mt]=r.createRenderbuffer(),At(x.__webglDepthbuffer[mt],w,!1);else{const Rt=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,St=x.__webglDepthbuffer[mt];r.bindRenderbuffer(r.RENDERBUFFER,St),r.framebufferRenderbuffer(r.FRAMEBUFFER,Rt,r.RENDERBUFFER,St)}}else if(i.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=r.createRenderbuffer(),At(x.__webglDepthbuffer,w,!1);else{const mt=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Rt=x.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,Rt),r.framebufferRenderbuffer(r.FRAMEBUFFER,mt,r.RENDERBUFFER,Rt)}i.bindFramebuffer(r.FRAMEBUFFER,null)}function te(w,x,it){const mt=s.get(w);x!==void 0&&yt(mt.__webglFramebuffer,w,w.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),it!==void 0&&Ht(w)}function Ce(w){const x=w.texture,it=s.get(w),mt=s.get(x);w.addEventListener("dispose",P);const Rt=w.textures,St=w.isWebGLCubeRenderTarget===!0,qt=Rt.length>1;if(qt||(mt.__webglTexture===void 0&&(mt.__webglTexture=r.createTexture()),mt.__version=x.version,h.memory.textures++),St){it.__webglFramebuffer=[];for(let wt=0;wt<6;wt++)if(x.mipmaps&&x.mipmaps.length>0){it.__webglFramebuffer[wt]=[];for(let kt=0;kt<x.mipmaps.length;kt++)it.__webglFramebuffer[wt][kt]=r.createFramebuffer()}else it.__webglFramebuffer[wt]=r.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){it.__webglFramebuffer=[];for(let wt=0;wt<x.mipmaps.length;wt++)it.__webglFramebuffer[wt]=r.createFramebuffer()}else it.__webglFramebuffer=r.createFramebuffer();if(qt)for(let wt=0,kt=Rt.length;wt<kt;wt++){const Se=s.get(Rt[wt]);Se.__webglTexture===void 0&&(Se.__webglTexture=r.createTexture(),h.memory.textures++)}if(w.samples>0&&It(w)===!1){it.__webglMultisampledFramebuffer=r.createFramebuffer(),it.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,it.__webglMultisampledFramebuffer);for(let wt=0;wt<Rt.length;wt++){const kt=Rt[wt];it.__webglColorRenderbuffer[wt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,it.__webglColorRenderbuffer[wt]);const Se=c.convert(kt.format,kt.colorSpace),Ct=c.convert(kt.type),Xt=D(kt.internalFormat,Se,Ct,kt.colorSpace,w.isXRRenderTarget===!0),jt=le(w);r.renderbufferStorageMultisample(r.RENDERBUFFER,jt,Xt,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+wt,r.RENDERBUFFER,it.__webglColorRenderbuffer[wt])}r.bindRenderbuffer(r.RENDERBUFFER,null),w.depthBuffer&&(it.__webglDepthRenderbuffer=r.createRenderbuffer(),At(it.__webglDepthRenderbuffer,w,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(St){i.bindTexture(r.TEXTURE_CUBE_MAP,mt.__webglTexture),J(r.TEXTURE_CUBE_MAP,x);for(let wt=0;wt<6;wt++)if(x.mipmaps&&x.mipmaps.length>0)for(let kt=0;kt<x.mipmaps.length;kt++)yt(it.__webglFramebuffer[wt][kt],w,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+wt,kt);else yt(it.__webglFramebuffer[wt],w,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+wt,0);A(x)&&v(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(qt){for(let wt=0,kt=Rt.length;wt<kt;wt++){const Se=Rt[wt],Ct=s.get(Se);i.bindTexture(r.TEXTURE_2D,Ct.__webglTexture),J(r.TEXTURE_2D,Se),yt(it.__webglFramebuffer,w,Se,r.COLOR_ATTACHMENT0+wt,r.TEXTURE_2D,0),A(Se)&&v(r.TEXTURE_2D)}i.unbindTexture()}else{let wt=r.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(wt=w.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(wt,mt.__webglTexture),J(wt,x),x.mipmaps&&x.mipmaps.length>0)for(let kt=0;kt<x.mipmaps.length;kt++)yt(it.__webglFramebuffer[kt],w,x,r.COLOR_ATTACHMENT0,wt,kt);else yt(it.__webglFramebuffer,w,x,r.COLOR_ATTACHMENT0,wt,0);A(x)&&v(wt),i.unbindTexture()}w.depthBuffer&&Ht(w)}function fe(w){const x=w.textures;for(let it=0,mt=x.length;it<mt;it++){const Rt=x[it];if(A(Rt)){const St=U(w),qt=s.get(Rt).__webglTexture;i.bindTexture(St,qt),v(St),i.unbindTexture()}}}const Be=[],G=[];function sn(w){if(w.samples>0){if(It(w)===!1){const x=w.textures,it=w.width,mt=w.height;let Rt=r.COLOR_BUFFER_BIT;const St=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,qt=s.get(w),wt=x.length>1;if(wt)for(let kt=0;kt<x.length;kt++)i.bindFramebuffer(r.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+kt,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,qt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+kt,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,qt.__webglMultisampledFramebuffer),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,qt.__webglFramebuffer);for(let kt=0;kt<x.length;kt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(Rt|=r.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(Rt|=r.STENCIL_BUFFER_BIT)),wt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,qt.__webglColorRenderbuffer[kt]);const Se=s.get(x[kt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Se,0)}r.blitFramebuffer(0,0,it,mt,0,0,it,mt,Rt,r.NEAREST),m===!0&&(Be.length=0,G.length=0,Be.push(r.COLOR_ATTACHMENT0+kt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Be.push(St),G.push(St),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,G)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Be))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),wt)for(let kt=0;kt<x.length;kt++){i.bindFramebuffer(r.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+kt,r.RENDERBUFFER,qt.__webglColorRenderbuffer[kt]);const Se=s.get(x[kt]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,qt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+kt,r.TEXTURE_2D,Se,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,qt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&m){const x=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[x])}}}function le(w){return Math.min(l.maxSamples,w.samples)}function It(w){const x=s.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Dt(w){const x=h.render.frame;g.get(w)!==x&&(g.set(w,x),w.update())}function Te(w,x){const it=w.colorSpace,mt=w.format,Rt=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||it!==jr&&it!==$a&&(De.getTransfer(it)===ke?(mt!==wi||Rt!==Sa)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",it)),x}function xt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(p.width=w.naturalWidth||w.width,p.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(p.width=w.displayWidth,p.height=w.displayHeight):(p.width=w.width,p.height=w.height),p}this.allocateTextureUnit=$,this.resetTextureUnits=nt,this.setTexture2D=ft,this.setTexture2DArray=I,this.setTexture3D=k,this.setTextureCube=q,this.rebindTextures=te,this.setupRenderTarget=Ce,this.updateRenderTargetMipmap=fe,this.updateMultisampleRenderTarget=sn,this.setupDepthRenderbuffer=Ht,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=It}function nb(r,t){function i(s,l=$a){let c;const h=De.getTransfer(l);if(s===Sa)return r.UNSIGNED_BYTE;if(s===Ap)return r.UNSIGNED_SHORT_4_4_4_4;if(s===Ep)return r.UNSIGNED_SHORT_5_5_5_1;if(s===$v)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===Qv)return r.BYTE;if(s===Jv)return r.SHORT;if(s===ul)return r.UNSIGNED_SHORT;if(s===Mp)return r.INT;if(s===Ps)return r.UNSIGNED_INT;if(s===Gi)return r.FLOAT;if(s===fl)return r.HALF_FLOAT;if(s===t1)return r.ALPHA;if(s===e1)return r.RGB;if(s===wi)return r.RGBA;if(s===n1)return r.LUMINANCE;if(s===i1)return r.LUMINANCE_ALPHA;if(s===Vr)return r.DEPTH_COMPONENT;if(s===Kr)return r.DEPTH_STENCIL;if(s===yp)return r.RED;if(s===xp)return r.RED_INTEGER;if(s===a1)return r.RG;if(s===Tp)return r.RG_INTEGER;if(s===Rp)return r.RGBA_INTEGER;if(s===$c||s===tu||s===eu||s===nu)if(h===ke)if(c=t.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===$c)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===tu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===eu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===nu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=t.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===$c)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===tu)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===eu)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===nu)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Id||s===Bd||s===Fd||s===zd)if(c=t.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===Id)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Bd)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Fd)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===zd)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Hd||s===Gd||s===Vd)if(c=t.get("WEBGL_compressed_texture_etc"),c!==null){if(s===Hd||s===Gd)return h===ke?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===Vd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===kd||s===Xd||s===Yd||s===Wd||s===qd||s===Kd||s===jd||s===Zd||s===Qd||s===Jd||s===$d||s===tp||s===ep||s===np)if(c=t.get("WEBGL_compressed_texture_astc"),c!==null){if(s===kd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Xd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Yd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Wd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===qd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Kd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===jd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Zd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Qd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===Jd)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===$d)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===tp)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===ep)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===np)return h===ke?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===iu||s===ip||s===ap)if(c=t.get("EXT_texture_compression_bptc"),c!==null){if(s===iu)return h===ke?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===ip)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===ap)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===s1||s===sp||s===rp||s===op)if(c=t.get("EXT_texture_compression_rgtc"),c!==null){if(s===iu)return c.COMPRESSED_RED_RGTC1_EXT;if(s===sp)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===rp)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===op)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===qr?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}const ib={type:"move"};class _d{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rl,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rl,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rl,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const s of t.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,s){let l=null,c=null,h=null;const d=this._targetRay,m=this._grip,p=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(p&&t.hand){h=!0;for(const T of t.hand.values()){const A=i.getJointPose(T,s),v=this._getHandJoint(p,T);A!==null&&(v.matrix.fromArray(A.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=A.radius),v.visible=A!==null}const g=p.joints["index-finger-tip"],_=p.joints["thumb-tip"],S=g.position.distanceTo(_.position),E=.02,y=.005;p.inputState.pinching&&S>E+y?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!p.inputState.pinching&&S<=E-y&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else m!==null&&t.gripSpace&&(c=i.getPose(t.gripSpace,s),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1));d!==null&&(l=i.getPose(t.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(ib)))}return d!==null&&(d.visible=l!==null),m!==null&&(m.visible=c!==null),p!==null&&(p.visible=h!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const s=new rl;s.matrixAutoUpdate=!1,s.visible=!1,t.joints[i.jointName]=s,t.add(s)}return t.joints[i.jointName]}}const ab=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class rb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i,s){if(this.texture===null){const l=new Hn,c=t.properties.get(l);c.__webglTexture=i.texture,(i.depthNear!==s.depthNear||i.depthFar!==s.depthFar)&&(this.depthNear=i.depthNear,this.depthFar=i.depthFar),this.texture=l}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,s=new Ma({vertexShader:ab,fragmentShader:sb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new zn(new xu(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ob extends Fs{constructor(t,i){super();const s=this;let l=null,c=1,h=null,d="local-floor",m=1,p=null,g=null,_=null,S=null,E=null,y=null;const T=new rb,A=i.getContextAttributes();let v=null,U=null;const D=[],O=[],H=new oe;let B=null;const P=new Mi;P.viewport=new en;const V=new Mi;V.viewport=new en;const L=[P,V],C=new RE;let z=null,nt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let lt=D[Y];return lt===void 0&&(lt=new _d,D[Y]=lt),lt.getTargetRaySpace()},this.getControllerGrip=function(Y){let lt=D[Y];return lt===void 0&&(lt=new _d,D[Y]=lt),lt.getGripSpace()},this.getHand=function(Y){let lt=D[Y];return lt===void 0&&(lt=new _d,D[Y]=lt),lt.getHandSpace()};function $(Y){const lt=O.indexOf(Y.inputSource);if(lt===-1)return;const yt=D[lt];yt!==void 0&&(yt.update(Y.inputSource,Y.frame,p||h),yt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function ct(){l.removeEventListener("select",$),l.removeEventListener("selectstart",$),l.removeEventListener("selectend",$),l.removeEventListener("squeeze",$),l.removeEventListener("squeezestart",$),l.removeEventListener("squeezeend",$),l.removeEventListener("end",ct),l.removeEventListener("inputsourceschange",ft);for(let Y=0;Y<D.length;Y++){const lt=O[Y];lt!==null&&(O[Y]=null,D[Y].disconnect(lt))}z=null,nt=null,T.reset(),t.setRenderTarget(v),E=null,S=null,_=null,l=null,U=null,ht.stop(),s.isPresenting=!1,t.setPixelRatio(B),t.setSize(H.width,H.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){c=Y,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){d=Y,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||h},this.setReferenceSpace=function(Y){p=Y},this.getBaseLayer=function(){return S!==null?S:E},this.getBinding=function(){return _},this.getFrame=function(){return y},this.getSession=function(){return l},this.setSession=async function(Y){if(l=Y,l!==null){if(v=t.getRenderTarget(),l.addEventListener("select",$),l.addEventListener("selectstart",$),l.addEventListener("selectend",$),l.addEventListener("squeeze",$),l.addEventListener("squeezestart",$),l.addEventListener("squeezeend",$),l.addEventListener("end",ct),l.addEventListener("inputsourceschange",ft),A.xrCompatible!==!0&&await i.makeXRCompatible(),B=t.getPixelRatio(),t.getSize(H),l.enabledFeatures!==void 0&&l.enabledFeatures.includes("layers")){let yt=null,At=null,Vt=null;A.depth&&(Vt=A.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,yt=A.stencil?Kr:Vr,At=A.stencil?qr:Ps);const Ht={colorFormat:i.RGBA8,depthFormat:Vt,scaleFactor:c};_=new XRWebGLBinding(l,i),S=_.createProjectionLayer(Ht),l.updateRenderState({layers:[S]}),t.setPixelRatio(1),t.setSize(S.textureWidth,S.textureHeight,!1),U=new Is(S.textureWidth,S.textureHeight,{format:wi,type:Sa,depthTexture:new v1(S.textureWidth,S.textureHeight,At,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:A.stencil,colorSpace:t.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1})}else{const yt={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:c};E=new XRWebGLLayer(l,i,yt),l.updateRenderState({baseLayer:E}),t.setPixelRatio(1),t.setSize(E.framebufferWidth,E.framebufferHeight,!1),U=new Is(E.framebufferWidth,E.framebufferHeight,{format:wi,type:Sa,colorSpace:t.outputColorSpace,stencilBuffer:A.stencil})}U.isXRRenderTarget=!0,this.setFoveation(m),p=null,h=await l.requestReferenceSpace(d),ht.setContext(l),ht.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return T.getDepthTexture()};function ft(Y){for(let lt=0;lt<Y.removed.length;lt++){const yt=Y.removed[lt],At=O.indexOf(yt);At>=0&&(O[At]=null,D[At].disconnect(yt))}for(let lt=0;lt<Y.added.length;lt++){const yt=Y.added[lt];let At=O.indexOf(yt);if(At===-1){for(let Ht=0;Ht<D.length;Ht++)if(Ht>=O.length){O.push(yt),At=Ht;break}else if(O[Ht]===null){O[Ht]=yt,At=Ht;break}if(At===-1)break}const Vt=D[At];Vt&&Vt.connect(yt)}}const I=new K,k=new K;function q(Y,lt,yt){I.setFromMatrixPosition(lt.matrixWorld),k.setFromMatrixPosition(yt.matrixWorld);const At=I.distanceTo(k),Vt=lt.projectionMatrix.elements,Ht=yt.projectionMatrix.elements,te=Vt[14]/(Vt[10]-1),Ce=Vt[14]/(Vt[10]+1),fe=(Vt[9]+1)/Vt[5],Be=(Vt[9]-1)/Vt[5],G=(Vt[8]-1)/Vt[0],sn=(Ht[8]+1)/Ht[0],le=te*G,It=te*sn,Dt=At/(-G+sn),Te=Dt*-G;if(lt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Te),Y.translateZ(Dt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Vt[10]===-1)Y.projectionMatrix.copy(lt.projectionMatrix),Y.projectionMatrixInverse.copy(lt.projectionMatrixInverse);else{const xt=te+Dt,w=Ce+Dt,x=le-Te,it=It+(At-Te),mt=fe*Ce/w*xt,Rt=Be*Ce/w*xt;Y.projectionMatrix.makePerspective(x,it,mt,Rt,xt,w),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function _t(Y,lt){lt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(lt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(l===null)return;let lt=Y.near,yt=Y.far;T.texture!==null&&(T.depthNear>0&&(lt=T.depthNear),T.depthFar>0&&(yt=T.depthFar)),C.near=V.near=P.near=lt,C.far=V.far=P.far=yt,(z!==C.near||nt!==C.far)&&(l.updateRenderState({depthNear:C.near,depthFar:C.far}),z=C.near,nt=C.far),P.layers.mask=Y.layers.mask|2,V.layers.mask=Y.layers.mask|4,C.layers.mask=P.layers.mask|V.layers.mask;const At=Y.parent,Vt=C.cameras;_t(C,At);for(let Ht=0;Ht<Vt.length;Ht++)_t(Vt[Ht],At);Vt.length===2?q(C,P,V):C.projectionMatrix.copy(P.projectionMatrix),Tt(Y,C,At)};function Tt(Y,lt,yt){yt===null?Y.matrix.copy(lt.matrixWorld):(Y.matrix.copy(yt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(lt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(lt.projectionMatrix),Y.projectionMatrixInverse.copy(lt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=lp*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(S===null&&E===null))return m},this.setFoveation=function(Y){m=Y,S!==null&&(S.fixedFoveation=Y),E!==null&&E.fixedFoveation!==void 0&&(E.fixedFoveation=Y)},this.hasDepthSensing=function(){return T.texture!==null},this.getDepthSensingMesh=function(){return T.getMesh(C)};let N=null;function J(Y,lt){if(g=lt.getViewerPose(p||h),y=lt,g!==null){const yt=g.views;E!==null&&(t.setRenderTargetFramebuffer(U,E.framebuffer),t.setRenderTarget(U));let At=!1;yt.length!==C.cameras.length&&(C.cameras.length=0,At=!0);for(let Ht=0;Ht<yt.length;Ht++){const te=yt[Ht];let Ce=null;if(E!==null)Ce=E.getViewport(te);else{const Be=_.getViewSubImage(S,te);Ce=Be.viewport,Ht===0&&(t.setRenderTargetTextures(U,Be.colorTexture,S.ignoreDepthValues?void 0:Be.depthStencilTexture),t.setRenderTarget(U))}let fe=L[Ht];fe===void 0&&(fe=new Mi,fe.layers.enable(Ht),fe.viewport=new en,L[Ht]=fe),fe.matrix.fromArray(te.transform.matrix),fe.matrix.decompose(fe.position,fe.quaternion,fe.scale),fe.projectionMatrix.fromArray(te.projectionMatrix),fe.projectionMatrixInverse.copy(fe.projectionMatrix).invert(),fe.viewport.set(Ce.x,Ce.y,Ce.width,Ce.height),Ht===0&&(C.matrix.copy(fe.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),At===!0&&C.cameras.push(fe)}const Vt=l.enabledFeatures;if(Vt&&Vt.includes("depth-sensing")){const Ht=_.getDepthInformation(yt[0]);Ht&&Ht.isValid&&Ht.texture&&T.init(t,Ht,l.renderState)}}for(let yt=0;yt<D.length;yt++){const At=O[yt],Vt=D[yt];At!==null&&Vt!==void 0&&Vt.update(At,lt,p||h)}N&&N(Y,lt),lt.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:lt}),y=null}const ht=new x1;ht.setAnimationLoop(J),this.setAnimationLoop=function(Y){N=Y},this.dispose=function(){}}}const Cs=new ki,lb=new Ue;function cb(r,t){function i(A,v){A.matrixAutoUpdate===!0&&A.updateMatrix(),v.value.copy(A.matrix)}function s(A,v){v.color.getRGB(A.fogColor.value,p1(r)),v.isFog?(A.fogNear.value=v.near,A.fogFar.value=v.far):v.isFogExp2&&(A.fogDensity.value=v.density)}function l(A,v,U,D,O){v.isMeshBasicMaterial||v.isMeshLambertMaterial?c(A,v):v.isMeshToonMaterial?(c(A,v),_(A,v)):v.isMeshPhongMaterial?(c(A,v),g(A,v)):v.isMeshStandardMaterial?(c(A,v),S(A,v),v.isMeshPhysicalMaterial&&E(A,v,O)):v.isMeshMatcapMaterial?(c(A,v),y(A,v)):v.isMeshDepthMaterial?c(A,v):v.isMeshDistanceMaterial?(c(A,v),T(A,v)):v.isMeshNormalMaterial?c(A,v):v.isLineBasicMaterial?(h(A,v),v.isLineDashedMaterial&&d(A,v)):v.isPointsMaterial?m(A,v,U,D):v.isSpriteMaterial?p(A,v):v.isShadowMaterial?(A.color.value.copy(v.color),A.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function c(A,v){A.opacity.value=v.opacity,v.color&&A.diffuse.value.copy(v.color),v.emissive&&A.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(A.map.value=v.map,i(v.map,A.mapTransform)),v.alphaMap&&(A.alphaMap.value=v.alphaMap,i(v.alphaMap,A.alphaMapTransform)),v.bumpMap&&(A.bumpMap.value=v.bumpMap,i(v.bumpMap,A.bumpMapTransform),A.bumpScale.value=v.bumpScale,v.side===Jn&&(A.bumpScale.value*=-1)),v.normalMap&&(A.normalMap.value=v.normalMap,i(v.normalMap,A.normalMapTransform),A.normalScale.value.copy(v.normalScale),v.side===Jn&&A.normalScale.value.negate()),v.displacementMap&&(A.displacementMap.value=v.displacementMap,i(v.displacementMap,A.displacementMapTransform),A.displacementScale.value=v.displacementScale,A.displacementBias.value=v.displacementBias),v.emissiveMap&&(A.emissiveMap.value=v.emissiveMap,i(v.emissiveMap,A.emissiveMapTransform)),v.specularMap&&(A.specularMap.value=v.specularMap,i(v.specularMap,A.specularMapTransform)),v.alphaTest>0&&(A.alphaTest.value=v.alphaTest);const U=t.get(v),D=U.envMap,O=U.envMapRotation;D&&(A.envMap.value=D,Cs.copy(O),Cs.x*=-1,Cs.y*=-1,Cs.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Cs.y*=-1,Cs.z*=-1),A.envMapRotation.value.setFromMatrix4(lb.makeRotationFromEuler(Cs)),A.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,A.reflectivity.value=v.reflectivity,A.ior.value=v.ior,A.refractionRatio.value=v.refractionRatio),v.lightMap&&(A.lightMap.value=v.lightMap,A.lightMapIntensity.value=v.lightMapIntensity,i(v.lightMap,A.lightMapTransform)),v.aoMap&&(A.aoMap.value=v.aoMap,A.aoMapIntensity.value=v.aoMapIntensity,i(v.aoMap,A.aoMapTransform))}function h(A,v){A.diffuse.value.copy(v.color),A.opacity.value=v.opacity,v.map&&(A.map.value=v.map,i(v.map,A.mapTransform))}function d(A,v){A.dashSize.value=v.dashSize,A.totalSize.value=v.dashSize+v.gapSize,A.scale.value=v.scale}function m(A,v,U,D){A.diffuse.value.copy(v.color),A.opacity.value=v.opacity,A.size.value=v.size*U,A.scale.value=D*.5,v.map&&(A.map.value=v.map,i(v.map,A.uvTransform)),v.alphaMap&&(A.alphaMap.value=v.alphaMap,i(v.alphaMap,A.alphaMapTransform)),v.alphaTest>0&&(A.alphaTest.value=v.alphaTest)}function p(A,v){A.diffuse.value.copy(v.color),A.opacity.value=v.opacity,A.rotation.value=v.rotation,v.map&&(A.map.value=v.map,i(v.map,A.mapTransform)),v.alphaMap&&(A.alphaMap.value=v.alphaMap,i(v.alphaMap,A.alphaMapTransform)),v.alphaTest>0&&(A.alphaTest.value=v.alphaTest)}function g(A,v){A.specular.value.copy(v.specular),A.shininess.value=Math.max(v.shininess,1e-4)}function _(A,v){v.gradientMap&&(A.gradientMap.value=v.gradientMap)}function S(A,v){A.metalness.value=v.metalness,v.metalnessMap&&(A.metalnessMap.value=v.metalnessMap,i(v.metalnessMap,A.metalnessMapTransform)),A.roughness.value=v.roughness,v.roughnessMap&&(A.roughnessMap.value=v.roughnessMap,i(v.roughnessMap,A.roughnessMapTransform)),v.envMap&&(A.envMapIntensity.value=v.envMapIntensity)}function E(A,v,U){A.ior.value=v.ior,v.sheen>0&&(A.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),A.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(A.sheenColorMap.value=v.sheenColorMap,i(v.sheenColorMap,A.sheenColorMapTransform)),v.sheenRoughnessMap&&(A.sheenRoughnessMap.value=v.sheenRoughnessMap,i(v.sheenRoughnessMap,A.sheenRoughnessMapTransform))),v.clearcoat>0&&(A.clearcoat.value=v.clearcoat,A.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(A.clearcoatMap.value=v.clearcoatMap,i(v.clearcoatMap,A.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(A.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,i(v.clearcoatRoughnessMap,A.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(A.clearcoatNormalMap.value=v.clearcoatNormalMap,i(v.clearcoatNormalMap,A.clearcoatNormalMapTransform),A.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Jn&&A.clearcoatNormalScale.value.negate())),v.dispersion>0&&(A.dispersion.value=v.dispersion),v.iridescence>0&&(A.iridescence.value=v.iridescence,A.iridescenceIOR.value=v.iridescenceIOR,A.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],A.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(A.iridescenceMap.value=v.iridescenceMap,i(v.iridescenceMap,A.iridescenceMapTransform)),v.iridescenceThicknessMap&&(A.iridescenceThicknessMap.value=v.iridescenceThicknessMap,i(v.iridescenceThicknessMap,A.iridescenceThicknessMapTransform))),v.transmission>0&&(A.transmission.value=v.transmission,A.transmissionSamplerMap.value=U.texture,A.transmissionSamplerSize.value.set(U.width,U.height),v.transmissionMap&&(A.transmissionMap.value=v.transmissionMap,i(v.transmissionMap,A.transmissionMapTransform)),A.thickness.value=v.thickness,v.thicknessMap&&(A.thicknessMap.value=v.thicknessMap,i(v.thicknessMap,A.thicknessMapTransform)),A.attenuationDistance.value=v.attenuationDistance,A.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(A.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(A.anisotropyMap.value=v.anisotropyMap,i(v.anisotropyMap,A.anisotropyMapTransform))),A.specularIntensity.value=v.specularIntensity,A.specularColor.value.copy(v.specularColor),v.specularColorMap&&(A.specularColorMap.value=v.specularColorMap,i(v.specularColorMap,A.specularColorMapTransform)),v.specularIntensityMap&&(A.specularIntensityMap.value=v.specularIntensityMap,i(v.specularIntensityMap,A.specularIntensityMapTransform))}function y(A,v){v.matcap&&(A.matcap.value=v.matcap)}function T(A,v){const U=t.get(v).light;A.referencePosition.value.setFromMatrixPosition(U.matrixWorld),A.nearDistance.value=U.shadow.camera.near,A.farDistance.value=U.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function ub(r,t,i,s){let l={},c={},h=[];const d=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(U,D){const O=D.program;s.uniformBlockBinding(U,O)}function p(U,D){let O=l[U.id];O===void 0&&(y(U),O=g(U),l[U.id]=O,U.addEventListener("dispose",A));const H=D.program;s.updateUBOMapping(U,H);const B=t.render.frame;c[U.id]!==B&&(S(U),c[U.id]=B)}function g(U){const D=_();U.__bindingPointIndex=D;const O=r.createBuffer(),H=U.__size,B=U.usage;return r.bindBuffer(r.UNIFORM_BUFFER,O),r.bufferData(r.UNIFORM_BUFFER,H,B),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,D,O),O}function _(){for(let U=0;U<d;U++)if(h.indexOf(U)===-1)return h.push(U),U;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(U){const D=l[U.id],O=U.uniforms,H=U.__cache;r.bindBuffer(r.UNIFORM_BUFFER,D);for(let B=0,P=O.length;B<P;B++){const V=Array.isArray(O[B])?O[B]:[O[B]];for(let L=0,C=V.length;L<C;L++){const z=V[L];if(E(z,B,L,H)===!0){const nt=z.__offset,$=Array.isArray(z.value)?z.value:[z.value];let ct=0;for(let ft=0;ft<$.length;ft++){const I=$[ft],k=T(I);typeof I=="number"||typeof I=="boolean"?(z.__data[0]=I,r.bufferSubData(r.UNIFORM_BUFFER,nt+ct,z.__data)):I.isMatrix3?(z.__data[0]=I.elements[0],z.__data[1]=I.elements[1],z.__data[2]=I.elements[2],z.__data[3]=0,z.__data[4]=I.elements[3],z.__data[5]=I.elements[4],z.__data[6]=I.elements[5],z.__data[7]=0,z.__data[8]=I.elements[6],z.__data[9]=I.elements[7],z.__data[10]=I.elements[8],z.__data[11]=0):(I.toArray(z.__data,ct),ct+=k.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,nt,z.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function E(U,D,O,H){const B=U.value,P=D+"_"+O;if(H[P]===void 0)return typeof B=="number"||typeof B=="boolean"?H[P]=B:H[P]=B.clone(),!0;{const V=H[P];if(typeof B=="number"||typeof B=="boolean"){if(V!==B)return H[P]=B,!0}else if(V.equals(B)===!1)return V.copy(B),!0}return!1}function y(U){const D=U.uniforms;let O=0;const H=16;for(let P=0,V=D.length;P<V;P++){const L=Array.isArray(D[P])?D[P]:[D[P]];for(let C=0,z=L.length;C<z;C++){const nt=L[C],$=Array.isArray(nt.value)?nt.value:[nt.value];for(let ct=0,ft=$.length;ct<ft;ct++){const I=$[ct],k=T(I),q=O%H,_t=q%k.boundary,Tt=q+_t;O+=_t,Tt!==0&&H-Tt<k.storage&&(O+=H-Tt),nt.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),nt.__offset=O,O+=k.storage}}}const B=O%H;return B>0&&(O+=H-B),U.__size=O,U.__cache={},this}function T(U){const D={boundary:0,storage:0};return typeof U=="number"||typeof U=="boolean"?(D.boundary=4,D.storage=4):U.isVector2?(D.boundary=8,D.storage=8):U.isVector3||U.isColor?(D.boundary=16,D.storage=12):U.isVector4?(D.boundary=16,D.storage=16):U.isMatrix3?(D.boundary=48,D.storage=48):U.isMatrix4?(D.boundary=64,D.storage=64):U.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",U),D}function A(U){const D=U.target;D.removeEventListener("dispose",A);const O=h.indexOf(D.__bindingPointIndex);h.splice(O,1),r.deleteBuffer(l[D.id]),delete l[D.id],delete c[D.id]}function v(){for(const U in l)r.deleteBuffer(l[U]);h=[],l={},c={}}return{bind:m,update:p,dispose:v}}class fb{constructor(t={}){const{canvas:i=VA(),context:s=null,depth:l=!0,stencil:c=!1,alpha:h=!1,antialias:d=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:_=!1,reverseDepthBuffer:S=!1}=t;this.isWebGLRenderer=!0;let E;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");E=s.getContextAttributes().alpha}else E=h;const y=new Uint32Array(4),T=new Int32Array(4);let A=null,v=null;const U=[],D=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Si,this.toneMapping=ns,this.toneMappingExposure=1;const O=this;let H=!1,B=0,P=0,V=null,L=-1,C=null;const z=new en,nt=new en;let $=null;const ct=new me(0);let ft=0,I=i.width,k=i.height,q=1,_t=null,Tt=null;const N=new en(0,0,I,k),J=new en(0,0,I,k);let ht=!1;const Y=new Op;let lt=!1,yt=!1;this.transmissionResolutionScale=1;const At=new Ue,Vt=new Ue,Ht=new K,te=new en,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let fe=!1;function Be(){return V===null?q:1}let G=s;function sn(b,Z){return i.getContext(b,Z)}try{const b={alpha:!0,depth:l,stencil:c,antialias:d,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:_};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Sp}`),i.addEventListener("webglcontextlost",Et,!1),i.addEventListener("webglcontextrestored",Lt,!1),i.addEventListener("webglcontextcreationerror",Nt,!1),G===null){const Z="webgl2";if(G=sn(Z,b),G===null)throw sn(Z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let le,It,Dt,Te,xt,w,x,it,mt,Rt,St,qt,wt,kt,Se,Ct,Xt,jt,Kt,zt,ee,ce,Fe,j;function Ot(){le=new MT(G),le.init(),ce=new nb(G,le),It=new pT(G,le,t,ce),Dt=new tb(G,le),It.reverseDepthBuffer&&S&&Dt.buffers.depth.setReversed(!0),Te=new yT(G),xt=new GR,w=new eb(G,le,Dt,xt,It,ce,Te),x=new gT(O),it=new ST(O),mt=new LE(G),Fe=new hT(G,mt),Rt=new AT(G,mt,Te,Fe),St=new TT(G,Rt,mt,Te),Kt=new xT(G,It,w),Ct=new mT(xt),qt=new HR(O,x,it,le,It,Fe,Ct),wt=new cb(O,xt),kt=new kR,Se=new jR(le),jt=new fT(O,x,it,Dt,St,E,m),Xt=new JR(O,St,It),j=new ub(G,Te,It,Dt),zt=new dT(G,le,Te),ee=new ET(G,le,Te),Te.programs=qt.programs,O.capabilities=It,O.extensions=le,O.properties=xt,O.renderLists=kt,O.shadowMap=Xt,O.state=Dt,O.info=Te}Ot();const ut=new ob(O,G);this.xr=ut,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const b=le.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=le.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(b){b!==void 0&&(q=b,this.setSize(I,k,!1))},this.getSize=function(b){return b.set(I,k)},this.setSize=function(b,Z,st=!0){if(ut.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=b,k=Z,i.width=Math.floor(b*q),i.height=Math.floor(Z*q),st===!0&&(i.style.width=b+"px",i.style.height=Z+"px"),this.setViewport(0,0,b,Z)},this.getDrawingBufferSize=function(b){return b.set(I*q,k*q).floor()},this.setDrawingBufferSize=function(b,Z,st){I=b,k=Z,q=st,i.width=Math.floor(b*st),i.height=Math.floor(Z*st),this.setViewport(0,0,b,Z)},this.getCurrentViewport=function(b){return b.copy(z)},this.getViewport=function(b){return b.copy(N)},this.setViewport=function(b,Z,st,rt){b.isVector4?N.set(b.x,b.y,b.z,b.w):N.set(b,Z,st,rt),Dt.viewport(z.copy(N).multiplyScalar(q).round())},this.getScissor=function(b){return b.copy(J)},this.setScissor=function(b,Z,st,rt){b.isVector4?J.set(b.x,b.y,b.z,b.w):J.set(b,Z,st,rt),Dt.scissor(nt.copy(J).multiplyScalar(q).round())},this.getScissorTest=function(){return ht},this.setScissorTest=function(b){Dt.setScissorTest(ht=b)},this.setOpaqueSort=function(b){_t=b},this.setTransparentSort=function(b){Tt=b},this.getClearColor=function(b){return b.copy(jt.getClearColor())},this.setClearColor=function(){jt.setClearColor.apply(jt,arguments)},this.getClearAlpha=function(){return jt.getClearAlpha()},this.setClearAlpha=function(){jt.setClearAlpha.apply(jt,arguments)},this.clear=function(b=!0,Z=!0,st=!0){let rt=0;if(b){let W=!1;if(V!==null){const bt=V.texture.format;W=bt===Rp||bt===Tp||bt===xp}if(W){const bt=V.texture.type,Ut=bt===Sa||bt===Ps||bt===ul||bt===qr||bt===Ap||bt===Ep,Ft=jt.getClearColor(),Gt=jt.getClearAlpha(),ie=Ft.r,ae=Ft.g,Zt=Ft.b;Ut?(y[0]=ie,y[1]=ae,y[2]=Zt,y[3]=Gt,G.clearBufferuiv(G.COLOR,0,y)):(T[0]=ie,T[1]=ae,T[2]=Zt,T[3]=Gt,G.clearBufferiv(G.COLOR,0,T))}else rt|=G.COLOR_BUFFER_BIT}Z&&(rt|=G.DEPTH_BUFFER_BIT),st&&(rt|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(rt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",Et,!1),i.removeEventListener("webglcontextrestored",Lt,!1),i.removeEventListener("webglcontextcreationerror",Nt,!1),jt.dispose(),kt.dispose(),Se.dispose(),xt.dispose(),x.dispose(),it.dispose(),St.dispose(),Fe.dispose(),j.dispose(),qt.dispose(),ut.dispose(),ut.removeEventListener("sessionstart",eo),ut.removeEventListener("sessionend",no),Ni.stop()};function Et(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),H=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),H=!1;const b=Te.autoReset,Z=Xt.enabled,st=Xt.autoUpdate,rt=Xt.needsUpdate,W=Xt.type;Ot(),Te.autoReset=b,Xt.enabled=Z,Xt.autoUpdate=st,Xt.needsUpdate=rt,Xt.type=W}function Nt(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function ne(b){const Z=b.target;Z.removeEventListener("dispose",ne),je(Z)}function je(b){fn(b),xt.remove(b)}function fn(b){const Z=xt.get(b).programs;Z!==void 0&&(Z.forEach(function(st){qt.releaseProgram(st)}),b.isShaderMaterial&&qt.releaseShaderCache(b))}this.renderBufferDirect=function(b,Z,st,rt,W,bt){Z===null&&(Z=Ce);const Ut=W.isMesh&&W.matrixWorld.determinant()<0,Ft=ao(b,Z,st,rt,W);Dt.setMaterial(rt,Ut);let Gt=st.index,ie=1;if(rt.wireframe===!0){if(Gt=Rt.getWireframeAttribute(st),Gt===void 0)return;ie=2}const ae=st.drawRange,Zt=st.attributes.position;let Ee=ae.start*ie,ye=(ae.start+ae.count)*ie;bt!==null&&(Ee=Math.max(Ee,bt.start*ie),ye=Math.min(ye,(bt.start+bt.count)*ie)),Gt!==null?(Ee=Math.max(Ee,0),ye=Math.min(ye,Gt.count)):Zt!=null&&(Ee=Math.max(Ee,0),ye=Math.min(ye,Zt.count));const We=ye-Ee;if(We<0||We===1/0)return;Fe.setup(W,rt,Ft,st,Gt);let Oe,se=zt;if(Gt!==null&&(Oe=mt.get(Gt),se=ee,se.setIndex(Oe)),W.isMesh)rt.wireframe===!0?(Dt.setLineWidth(rt.wireframeLinewidth*Be()),se.setMode(G.LINES)):se.setMode(G.TRIANGLES);else if(W.isLine){let Jt=rt.linewidth;Jt===void 0&&(Jt=1),Dt.setLineWidth(Jt*Be()),W.isLineSegments?se.setMode(G.LINES):W.isLineLoop?se.setMode(G.LINE_LOOP):se.setMode(G.LINE_STRIP)}else W.isPoints?se.setMode(G.POINTS):W.isSprite&&se.setMode(G.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)se.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(le.get("WEBGL_multi_draw"))se.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Jt=W._multiDrawStarts,hn=W._multiDrawCounts,Re=W._multiDrawCount,Vn=Gt?mt.get(Gt).bytesPerElement:1,yi=xt.get(rt).currentProgram.getUniforms();for(let Pn=0;Pn<Re;Pn++)yi.setValue(G,"_gl_DrawID",Pn),se.render(Jt[Pn]/Vn,hn[Pn])}else if(W.isInstancedMesh)se.renderInstances(Ee,We,W.count);else if(st.isInstancedBufferGeometry){const Jt=st._maxInstanceCount!==void 0?st._maxInstanceCount:1/0,hn=Math.min(st.instanceCount,Jt);se.renderInstances(Ee,We,hn)}else se.render(Ee,We)};function be(b,Z,st){b.transparent===!0&&b.side===ma&&b.forceSinglePass===!1?(b.side=Jn,b.needsUpdate=!0,Qe(b,Z,st),b.side=is,b.needsUpdate=!0,Qe(b,Z,st),b.side=ma):Qe(b,Z,st)}this.compile=function(b,Z,st=null){st===null&&(st=b),v=Se.get(st),v.init(Z),D.push(v),st.traverseVisible(function(W){W.isLight&&W.layers.test(Z.layers)&&(v.pushLight(W),W.castShadow&&v.pushShadow(W))}),b!==st&&b.traverseVisible(function(W){W.isLight&&W.layers.test(Z.layers)&&(v.pushLight(W),W.castShadow&&v.pushShadow(W))}),v.setupLights();const rt=new Set;return b.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const bt=W.material;if(bt)if(Array.isArray(bt))for(let Ut=0;Ut<bt.length;Ut++){const Ft=bt[Ut];be(Ft,st,W),rt.add(Ft)}else be(bt,st,W),rt.add(bt)}),D.pop(),v=null,rt},this.compileAsync=function(b,Z,st=null){const rt=this.compile(b,Z,st);return new Promise(W=>{function bt(){if(rt.forEach(function(Ut){xt.get(Ut).currentProgram.isReady()&&rt.delete(Ut)}),rt.size===0){W(b);return}setTimeout(bt,10)}le.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let yn=null;function Ai(b){yn&&yn(b)}function eo(){Ni.stop()}function no(){Ni.start()}const Ni=new x1;Ni.setAnimationLoop(Ai),typeof self<"u"&&Ni.setContext(self),this.setAnimationLoop=function(b){yn=b,ut.setAnimationLoop(b),b===null?Ni.stop():Ni.start()},ut.addEventListener("sessionstart",eo),ut.addEventListener("sessionend",no),this.render=function(b,Z){if(Z!==void 0&&Z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(H===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),Z.parent===null&&Z.matrixWorldAutoUpdate===!0&&Z.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(Z),Z=ut.getCamera()),b.isScene===!0&&b.onBeforeRender(O,b,Z,V),v=Se.get(b,D.length),v.init(Z),D.push(v),Vt.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),Y.setFromProjectionMatrix(Vt),yt=this.localClippingEnabled,lt=Ct.init(this.clippingPlanes,yt),A=kt.get(b,U.length),A.init(),U.push(A),ut.enabled===!0&&ut.isPresenting===!0){const bt=O.xr.getDepthSensingMesh();bt!==null&&as(bt,Z,-1/0,O.sortObjects)}as(b,Z,0,O.sortObjects),A.finish(),O.sortObjects===!0&&A.sort(_t,Tt),fe=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,fe&&jt.addToRenderList(A,b),this.info.render.frame++,lt===!0&&Ct.beginShadows();const st=v.state.shadowsArray;Xt.render(st,b,Z),lt===!0&&Ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const rt=A.opaque,W=A.transmissive;if(v.setupLights(),Z.isArrayCamera){const bt=Z.cameras;if(W.length>0)for(let Ut=0,Ft=bt.length;Ut<Ft;Ut++){const Gt=bt[Ut];io(rt,W,b,Gt)}fe&&jt.render(b);for(let Ut=0,Ft=bt.length;Ut<Ft;Ut++){const Gt=bt[Ut];Hs(A,b,Gt,Gt.viewport)}}else W.length>0&&io(rt,W,b,Z),fe&&jt.render(b),Hs(A,b,Z);V!==null&&P===0&&(w.updateMultisampleRenderTarget(V),w.updateRenderTargetMipmap(V)),b.isScene===!0&&b.onAfterRender(O,b,Z),Fe.resetDefaultState(),L=-1,C=null,D.pop(),D.length>0?(v=D[D.length-1],lt===!0&&Ct.setGlobalState(O.clippingPlanes,v.state.camera)):v=null,U.pop(),U.length>0?A=U[U.length-1]:A=null};function as(b,Z,st,rt){if(b.visible===!1)return;if(b.layers.test(Z.layers)){if(b.isGroup)st=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(Z);else if(b.isLight)v.pushLight(b),b.castShadow&&v.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Y.intersectsSprite(b)){rt&&te.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Vt);const Ut=St.update(b),Ft=b.material;Ft.visible&&A.push(b,Ut,Ft,st,te.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Y.intersectsObject(b))){const Ut=St.update(b),Ft=b.material;if(rt&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),te.copy(b.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),te.copy(Ut.boundingSphere.center)),te.applyMatrix4(b.matrixWorld).applyMatrix4(Vt)),Array.isArray(Ft)){const Gt=Ut.groups;for(let ie=0,ae=Gt.length;ie<ae;ie++){const Zt=Gt[ie],Ee=Ft[Zt.materialIndex];Ee&&Ee.visible&&A.push(b,Ut,Ee,st,te.z,Zt)}}else Ft.visible&&A.push(b,Ut,Ft,st,te.z,null)}}const bt=b.children;for(let Ut=0,Ft=bt.length;Ut<Ft;Ut++)as(bt[Ut],Z,st,rt)}function Hs(b,Z,st,rt){const W=b.opaque,bt=b.transmissive,Ut=b.transparent;v.setupLightsView(st),lt===!0&&Ct.setGlobalState(O.clippingPlanes,st),rt&&Dt.viewport(z.copy(rt)),W.length>0&&ss(W,Z,st),bt.length>0&&ss(bt,Z,st),Ut.length>0&&ss(Ut,Z,st),Dt.buffers.depth.setTest(!0),Dt.buffers.depth.setMask(!0),Dt.buffers.color.setMask(!0),Dt.setPolygonOffset(!1)}function io(b,Z,st,rt){if((st.isScene===!0?st.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[rt.id]===void 0&&(v.state.transmissionRenderTarget[rt.id]=new Is(1,1,{generateMipmaps:!0,type:le.has("EXT_color_buffer_half_float")||le.has("EXT_color_buffer_float")?fl:Sa,minFilter:Us,samples:4,stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:De.workingColorSpace}));const bt=v.state.transmissionRenderTarget[rt.id],Ut=rt.viewport||z;bt.setSize(Ut.z*O.transmissionResolutionScale,Ut.w*O.transmissionResolutionScale);const Ft=O.getRenderTarget();O.setRenderTarget(bt),O.getClearColor(ct),ft=O.getClearAlpha(),ft<1&&O.setClearColor(16777215,.5),O.clear(),fe&&jt.render(st);const Gt=O.toneMapping;O.toneMapping=ns;const ie=rt.viewport;if(rt.viewport!==void 0&&(rt.viewport=void 0),v.setupLightsView(rt),lt===!0&&Ct.setGlobalState(O.clippingPlanes,rt),ss(b,st,rt),w.updateMultisampleRenderTarget(bt),w.updateRenderTargetMipmap(bt),le.has("WEBGL_multisampled_render_to_texture")===!1){let ae=!1;for(let Zt=0,Ee=Z.length;Zt<Ee;Zt++){const ye=Z[Zt],We=ye.object,Oe=ye.geometry,se=ye.material,Jt=ye.group;if(se.side===ma&&We.layers.test(rt.layers)){const hn=se.side;se.side=Jn,se.needsUpdate=!0,Ei(We,st,rt,Oe,se,Jt),se.side=hn,se.needsUpdate=!0,ae=!0}}ae===!0&&(w.updateMultisampleRenderTarget(bt),w.updateRenderTargetMipmap(bt))}O.setRenderTarget(Ft),O.setClearColor(ct,ft),ie!==void 0&&(rt.viewport=ie),O.toneMapping=Gt}function ss(b,Z,st){const rt=Z.isScene===!0?Z.overrideMaterial:null;for(let W=0,bt=b.length;W<bt;W++){const Ut=b[W],Ft=Ut.object,Gt=Ut.geometry,ie=rt===null?Ut.material:rt,ae=Ut.group;Ft.layers.test(st.layers)&&Ei(Ft,Z,st,Gt,ie,ae)}}function Ei(b,Z,st,rt,W,bt){b.onBeforeRender(O,Z,st,rt,W,bt),b.modelViewMatrix.multiplyMatrices(st.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),W.onBeforeRender(O,Z,st,rt,b,bt),W.transparent===!0&&W.side===ma&&W.forceSinglePass===!1?(W.side=Jn,W.needsUpdate=!0,O.renderBufferDirect(st,Z,rt,W,b,bt),W.side=is,W.needsUpdate=!0,O.renderBufferDirect(st,Z,rt,W,b,bt),W.side=ma):O.renderBufferDirect(st,Z,rt,W,b,bt),b.onAfterRender(O,Z,st,rt,W,bt)}function Qe(b,Z,st){Z.isScene!==!0&&(Z=Ce);const rt=xt.get(b),W=v.state.lights,bt=v.state.shadowsArray,Ut=W.state.version,Ft=qt.getParameters(b,W.state,bt,Z,st),Gt=qt.getProgramCacheKey(Ft);let ie=rt.programs;rt.environment=b.isMeshStandardMaterial?Z.environment:null,rt.fog=Z.fog,rt.envMap=(b.isMeshStandardMaterial?it:x).get(b.envMap||rt.environment),rt.envMapRotation=rt.environment!==null&&b.envMap===null?Z.environmentRotation:b.envMapRotation,ie===void 0&&(b.addEventListener("dispose",ne),ie=new Map,rt.programs=ie);let ae=ie.get(Gt);if(ae!==void 0){if(rt.currentProgram===ae&&rt.lightsStateVersion===Ut)return Xi(b,Ft),ae}else Ft.uniforms=qt.getUniforms(b),b.onBeforeCompile(Ft,O),ae=qt.acquireProgram(Ft,Gt),ie.set(Gt,ae),rt.uniforms=Ft.uniforms;const Zt=rt.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Zt.clippingPlanes=Ct.uniform),Xi(b,Ft),rt.needsLights=Cu(b),rt.lightsStateVersion=Ut,rt.needsLights&&(Zt.ambientLightColor.value=W.state.ambient,Zt.lightProbe.value=W.state.probe,Zt.directionalLights.value=W.state.directional,Zt.directionalLightShadows.value=W.state.directionalShadow,Zt.spotLights.value=W.state.spot,Zt.spotLightShadows.value=W.state.spotShadow,Zt.rectAreaLights.value=W.state.rectArea,Zt.ltc_1.value=W.state.rectAreaLTC1,Zt.ltc_2.value=W.state.rectAreaLTC2,Zt.pointLights.value=W.state.point,Zt.pointLightShadows.value=W.state.pointShadow,Zt.hemisphereLights.value=W.state.hemi,Zt.directionalShadowMap.value=W.state.directionalShadowMap,Zt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Zt.spotShadowMap.value=W.state.spotShadowMap,Zt.spotLightMatrix.value=W.state.spotLightMatrix,Zt.spotLightMap.value=W.state.spotLightMap,Zt.pointShadowMap.value=W.state.pointShadowMap,Zt.pointShadowMatrix.value=W.state.pointShadowMatrix),rt.currentProgram=ae,rt.uniformsList=null,ae}function xn(b){if(b.uniformsList===null){const Z=b.currentProgram.getUniforms();b.uniformsList=su.seqWithValue(Z.seq,b.uniforms)}return b.uniformsList}function Xi(b,Z){const st=xt.get(b);st.outputColorSpace=Z.outputColorSpace,st.batching=Z.batching,st.batchingColor=Z.batchingColor,st.instancing=Z.instancing,st.instancingColor=Z.instancingColor,st.instancingMorph=Z.instancingMorph,st.skinning=Z.skinning,st.morphTargets=Z.morphTargets,st.morphNormals=Z.morphNormals,st.morphColors=Z.morphColors,st.morphTargetsCount=Z.morphTargetsCount,st.numClippingPlanes=Z.numClippingPlanes,st.numIntersection=Z.numClipIntersection,st.vertexAlphas=Z.vertexAlphas,st.vertexTangents=Z.vertexTangents,st.toneMapping=Z.toneMapping}function ao(b,Z,st,rt,W){Z.isScene!==!0&&(Z=Ce),w.resetTextureUnits();const bt=Z.fog,Ut=rt.isMeshStandardMaterial?Z.environment:null,Ft=V===null?O.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:jr,Gt=(rt.isMeshStandardMaterial?it:x).get(rt.envMap||Ut),ie=rt.vertexColors===!0&&!!st.attributes.color&&st.attributes.color.itemSize===4,ae=!!st.attributes.tangent&&(!!rt.normalMap||rt.anisotropy>0),Zt=!!st.morphAttributes.position,Ee=!!st.morphAttributes.normal,ye=!!st.morphAttributes.color;let We=ns;rt.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(We=O.toneMapping);const Oe=st.morphAttributes.position||st.morphAttributes.normal||st.morphAttributes.color,se=Oe!==void 0?Oe.length:0,Jt=xt.get(rt),hn=v.state.lights;if(lt===!0&&(yt===!0||b!==C)){const Je=b===C&&rt.id===L;Ct.setState(rt,b,Je)}let Re=!1;rt.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==hn.state.version||Jt.outputColorSpace!==Ft||W.isBatchedMesh&&Jt.batching===!1||!W.isBatchedMesh&&Jt.batching===!0||W.isBatchedMesh&&Jt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Jt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Jt.instancing===!1||!W.isInstancedMesh&&Jt.instancing===!0||W.isSkinnedMesh&&Jt.skinning===!1||!W.isSkinnedMesh&&Jt.skinning===!0||W.isInstancedMesh&&Jt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Jt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Jt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Jt.instancingMorph===!1&&W.morphTexture!==null||Jt.envMap!==Gt||rt.fog===!0&&Jt.fog!==bt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==Ct.numPlanes||Jt.numIntersection!==Ct.numIntersection)||Jt.vertexAlphas!==ie||Jt.vertexTangents!==ae||Jt.morphTargets!==Zt||Jt.morphNormals!==Ee||Jt.morphColors!==ye||Jt.toneMapping!==We||Jt.morphTargetsCount!==se)&&(Re=!0):(Re=!0,Jt.__version=rt.version);let Vn=Jt.currentProgram;Re===!0&&(Vn=Qe(rt,Z,W));let yi=!1,Pn=!1,_n=!1;const ze=Vn.getUniforms(),In=Jt.uniforms;if(Dt.useProgram(Vn.program)&&(yi=!0,Pn=!0,_n=!0),rt.id!==L&&(L=rt.id,Pn=!0),yi||C!==b){Dt.buffers.depth.getReversed()?(At.copy(b.projectionMatrix),XA(At),YA(At),ze.setValue(G,"projectionMatrix",At)):ze.setValue(G,"projectionMatrix",b.projectionMatrix),ze.setValue(G,"viewMatrix",b.matrixWorldInverse);const Tn=ze.map.cameraPosition;Tn!==void 0&&Tn.setValue(G,Ht.setFromMatrixPosition(b.matrixWorld)),It.logarithmicDepthBuffer&&ze.setValue(G,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(rt.isMeshPhongMaterial||rt.isMeshToonMaterial||rt.isMeshLambertMaterial||rt.isMeshBasicMaterial||rt.isMeshStandardMaterial||rt.isShaderMaterial)&&ze.setValue(G,"isOrthographic",b.isOrthographicCamera===!0),C!==b&&(C=b,Pn=!0,_n=!0)}if(W.isSkinnedMesh){ze.setOptional(G,W,"bindMatrix"),ze.setOptional(G,W,"bindMatrixInverse");const Je=W.skeleton;Je&&(Je.boneTexture===null&&Je.computeBoneTexture(),ze.setValue(G,"boneTexture",Je.boneTexture,w))}W.isBatchedMesh&&(ze.setOptional(G,W,"batchingTexture"),ze.setValue(G,"batchingTexture",W._matricesTexture,w),ze.setOptional(G,W,"batchingIdTexture"),ze.setValue(G,"batchingIdTexture",W._indirectTexture,w),ze.setOptional(G,W,"batchingColorTexture"),W._colorsTexture!==null&&ze.setValue(G,"batchingColorTexture",W._colorsTexture,w));const wn=st.morphAttributes;if((wn.position!==void 0||wn.normal!==void 0||wn.color!==void 0)&&Kt.update(W,st,Vn),(Pn||Jt.receiveShadow!==W.receiveShadow)&&(Jt.receiveShadow=W.receiveShadow,ze.setValue(G,"receiveShadow",W.receiveShadow)),rt.isMeshGouraudMaterial&&rt.envMap!==null&&(In.envMap.value=Gt,In.flipEnvMap.value=Gt.isCubeTexture&&Gt.isRenderTargetTexture===!1?-1:1),rt.isMeshStandardMaterial&&rt.envMap===null&&Z.environment!==null&&(In.envMapIntensity.value=Z.environmentIntensity),Pn&&(ze.setValue(G,"toneMappingExposure",O.toneMappingExposure),Jt.needsLights&&bu(In,_n),bt&&rt.fog===!0&&wt.refreshFogUniforms(In,bt),wt.refreshMaterialUniforms(In,rt,q,k,v.state.transmissionRenderTarget[b.id]),su.upload(G,xn(Jt),In,w)),rt.isShaderMaterial&&rt.uniformsNeedUpdate===!0&&(su.upload(G,xn(Jt),In,w),rt.uniformsNeedUpdate=!1),rt.isSpriteMaterial&&ze.setValue(G,"center",W.center),ze.setValue(G,"modelViewMatrix",W.modelViewMatrix),ze.setValue(G,"normalMatrix",W.normalMatrix),ze.setValue(G,"modelMatrix",W.matrixWorld),rt.isShaderMaterial||rt.isRawShaderMaterial){const Je=rt.uniformsGroups;for(let Tn=0,Gs=Je.length;Tn<Gs;Tn++){const kn=Je[Tn];j.update(kn,Vn),j.bind(kn,Vn)}}return Vn}function bu(b,Z){b.ambientLightColor.needsUpdate=Z,b.lightProbe.needsUpdate=Z,b.directionalLights.needsUpdate=Z,b.directionalLightShadows.needsUpdate=Z,b.pointLights.needsUpdate=Z,b.pointLightShadows.needsUpdate=Z,b.spotLights.needsUpdate=Z,b.spotLightShadows.needsUpdate=Z,b.rectAreaLights.needsUpdate=Z,b.hemisphereLights.needsUpdate=Z}function Cu(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(b,Z,st){xt.get(b.texture).__webglTexture=Z,xt.get(b.depthTexture).__webglTexture=st;const rt=xt.get(b);rt.__hasExternalTextures=!0,rt.__autoAllocateDepthBuffer=st===void 0,rt.__autoAllocateDepthBuffer||le.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),rt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,Z){const st=xt.get(b);st.__webglFramebuffer=Z,st.__useDefaultFramebuffer=Z===void 0};const pl=G.createFramebuffer();this.setRenderTarget=function(b,Z=0,st=0){V=b,B=Z,P=st;let rt=!0,W=null,bt=!1,Ut=!1;if(b){const Gt=xt.get(b);if(Gt.__useDefaultFramebuffer!==void 0)Dt.bindFramebuffer(G.FRAMEBUFFER,null),rt=!1;else if(Gt.__webglFramebuffer===void 0)w.setupRenderTarget(b);else if(Gt.__hasExternalTextures)w.rebindTextures(b,xt.get(b.texture).__webglTexture,xt.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Zt=b.depthTexture;if(Gt.__boundDepthTexture!==Zt){if(Zt!==null&&xt.has(Zt)&&(b.width!==Zt.image.width||b.height!==Zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(b)}}const ie=b.texture;(ie.isData3DTexture||ie.isDataArrayTexture||ie.isCompressedArrayTexture)&&(Ut=!0);const ae=xt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ae[Z])?W=ae[Z][st]:W=ae[Z],bt=!0):b.samples>0&&w.useMultisampledRTT(b)===!1?W=xt.get(b).__webglMultisampledFramebuffer:Array.isArray(ae)?W=ae[st]:W=ae,z.copy(b.viewport),nt.copy(b.scissor),$=b.scissorTest}else z.copy(N).multiplyScalar(q).floor(),nt.copy(J).multiplyScalar(q).floor(),$=ht;if(st!==0&&(W=pl),Dt.bindFramebuffer(G.FRAMEBUFFER,W)&&rt&&Dt.drawBuffers(b,W),Dt.viewport(z),Dt.scissor(nt),Dt.setScissorTest($),bt){const Gt=xt.get(b.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Gt.__webglTexture,st)}else if(Ut){const Gt=xt.get(b.texture),ie=Z;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Gt.__webglTexture,st,ie)}else if(b!==null&&st!==0){const Gt=xt.get(b.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Gt.__webglTexture,st)}L=-1},this.readRenderTargetPixels=function(b,Z,st,rt,W,bt,Ut){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=xt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ut!==void 0&&(Ft=Ft[Ut]),Ft){Dt.bindFramebuffer(G.FRAMEBUFFER,Ft);try{const Gt=b.texture,ie=Gt.format,ae=Gt.type;if(!It.textureFormatReadable(ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable(ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Z>=0&&Z<=b.width-rt&&st>=0&&st<=b.height-W&&G.readPixels(Z,st,rt,W,ce.convert(ie),ce.convert(ae),bt)}finally{const Gt=V!==null?xt.get(V).__webglFramebuffer:null;Dt.bindFramebuffer(G.FRAMEBUFFER,Gt)}}},this.readRenderTargetPixelsAsync=async function(b,Z,st,rt,W,bt,Ut){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ft=xt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ut!==void 0&&(Ft=Ft[Ut]),Ft){const Gt=b.texture,ie=Gt.format,ae=Gt.type;if(!It.textureFormatReadable(ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable(ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Z>=0&&Z<=b.width-rt&&st>=0&&st<=b.height-W){Dt.bindFramebuffer(G.FRAMEBUFFER,Ft);const Zt=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,Zt),G.bufferData(G.PIXEL_PACK_BUFFER,bt.byteLength,G.STREAM_READ),G.readPixels(Z,st,rt,W,ce.convert(ie),ce.convert(ae),0);const Ee=V!==null?xt.get(V).__webglFramebuffer:null;Dt.bindFramebuffer(G.FRAMEBUFFER,Ee);const ye=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await kA(G,ye,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,Zt),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,bt),G.deleteBuffer(Zt),G.deleteSync(ye),bt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,Z=null,st=0){b.isTexture!==!0&&(Ir("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Z=arguments[0]||null,b=arguments[1]);const rt=Math.pow(2,-st),W=Math.floor(b.image.width*rt),bt=Math.floor(b.image.height*rt),Ut=Z!==null?Z.x:0,Ft=Z!==null?Z.y:0;w.setTexture2D(b,0),G.copyTexSubImage2D(G.TEXTURE_2D,st,0,0,Ut,Ft,W,bt),Dt.unbindTexture()};const rs=G.createFramebuffer(),so=G.createFramebuffer();this.copyTextureToTexture=function(b,Z,st=null,rt=null,W=0,bt=null){b.isTexture!==!0&&(Ir("WebGLRenderer: copyTextureToTexture function signature has changed."),rt=arguments[0]||null,b=arguments[1],Z=arguments[2],bt=arguments[3]||0,st=null),bt===null&&(W!==0?(Ir("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),bt=W,W=0):bt=0);let Ut,Ft,Gt,ie,ae,Zt,Ee,ye,We;const Oe=b.isCompressedTexture?b.mipmaps[bt]:b.image;if(st!==null)Ut=st.max.x-st.min.x,Ft=st.max.y-st.min.y,Gt=st.isBox3?st.max.z-st.min.z:1,ie=st.min.x,ae=st.min.y,Zt=st.isBox3?st.min.z:0;else{const wn=Math.pow(2,-W);Ut=Math.floor(Oe.width*wn),Ft=Math.floor(Oe.height*wn),b.isDataArrayTexture?Gt=Oe.depth:b.isData3DTexture?Gt=Math.floor(Oe.depth*wn):Gt=1,ie=0,ae=0,Zt=0}rt!==null?(Ee=rt.x,ye=rt.y,We=rt.z):(Ee=0,ye=0,We=0);const se=ce.convert(Z.format),Jt=ce.convert(Z.type);let hn;Z.isData3DTexture?(w.setTexture3D(Z,0),hn=G.TEXTURE_3D):Z.isDataArrayTexture||Z.isCompressedArrayTexture?(w.setTexture2DArray(Z,0),hn=G.TEXTURE_2D_ARRAY):(w.setTexture2D(Z,0),hn=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,Z.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,Z.unpackAlignment);const Re=G.getParameter(G.UNPACK_ROW_LENGTH),Vn=G.getParameter(G.UNPACK_IMAGE_HEIGHT),yi=G.getParameter(G.UNPACK_SKIP_PIXELS),Pn=G.getParameter(G.UNPACK_SKIP_ROWS),_n=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,Oe.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Oe.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,ie),G.pixelStorei(G.UNPACK_SKIP_ROWS,ae),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Zt);const ze=b.isDataArrayTexture||b.isData3DTexture,In=Z.isDataArrayTexture||Z.isData3DTexture;if(b.isDepthTexture){const wn=xt.get(b),Je=xt.get(Z),Tn=xt.get(wn.__renderTarget),Gs=xt.get(Je.__renderTarget);Dt.bindFramebuffer(G.READ_FRAMEBUFFER,Tn.__webglFramebuffer),Dt.bindFramebuffer(G.DRAW_FRAMEBUFFER,Gs.__webglFramebuffer);for(let kn=0;kn<Gt;kn++)ze&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,xt.get(b).__webglTexture,W,Zt+kn),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,xt.get(Z).__webglTexture,bt,We+kn)),G.blitFramebuffer(ie,ae,Ut,Ft,Ee,ye,Ut,Ft,G.DEPTH_BUFFER_BIT,G.NEAREST);Dt.bindFramebuffer(G.READ_FRAMEBUFFER,null),Dt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(W!==0||b.isRenderTargetTexture||xt.has(b)){const wn=xt.get(b),Je=xt.get(Z);Dt.bindFramebuffer(G.READ_FRAMEBUFFER,rs),Dt.bindFramebuffer(G.DRAW_FRAMEBUFFER,so);for(let Tn=0;Tn<Gt;Tn++)ze?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,wn.__webglTexture,W,Zt+Tn):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,wn.__webglTexture,W),In?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Je.__webglTexture,bt,We+Tn):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Je.__webglTexture,bt),W!==0?G.blitFramebuffer(ie,ae,Ut,Ft,Ee,ye,Ut,Ft,G.COLOR_BUFFER_BIT,G.NEAREST):In?G.copyTexSubImage3D(hn,bt,Ee,ye,We+Tn,ie,ae,Ut,Ft):G.copyTexSubImage2D(hn,bt,Ee,ye,ie,ae,Ut,Ft);Dt.bindFramebuffer(G.READ_FRAMEBUFFER,null),Dt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else In?b.isDataTexture||b.isData3DTexture?G.texSubImage3D(hn,bt,Ee,ye,We,Ut,Ft,Gt,se,Jt,Oe.data):Z.isCompressedArrayTexture?G.compressedTexSubImage3D(hn,bt,Ee,ye,We,Ut,Ft,Gt,se,Oe.data):G.texSubImage3D(hn,bt,Ee,ye,We,Ut,Ft,Gt,se,Jt,Oe):b.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,bt,Ee,ye,Ut,Ft,se,Jt,Oe.data):b.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,bt,Ee,ye,Oe.width,Oe.height,se,Oe.data):G.texSubImage2D(G.TEXTURE_2D,bt,Ee,ye,Ut,Ft,se,Jt,Oe);G.pixelStorei(G.UNPACK_ROW_LENGTH,Re),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Vn),G.pixelStorei(G.UNPACK_SKIP_PIXELS,yi),G.pixelStorei(G.UNPACK_SKIP_ROWS,Pn),G.pixelStorei(G.UNPACK_SKIP_IMAGES,_n),bt===0&&Z.generateMipmaps&&G.generateMipmap(hn),Dt.unbindTexture()},this.copyTextureToTexture3D=function(b,Z,st=null,rt=null,W=0){return b.isTexture!==!0&&(Ir("WebGLRenderer: copyTextureToTexture3D function signature has changed."),st=arguments[0]||null,rt=arguments[1]||null,b=arguments[2],Z=arguments[3],W=arguments[4]||0),Ir('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,Z,st,rt,W)},this.initRenderTarget=function(b){xt.get(b).__webglFramebuffer===void 0&&w.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?w.setTextureCube(b,0):b.isData3DTexture?w.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?w.setTexture2DArray(b,0):w.setTexture2D(b,0),Dt.unbindTexture()},this.resetState=function(){B=0,P=0,V=null,Dt.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _a}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorspace=De._getDrawingBufferColorSpace(t),i.unpackColorSpace=De._getUnpackColorSpace()}}const Lv={type:"change"},Np={type:"start"},O1={type:"end"},Kc=new yu,wv=new Ja,hb=Math.cos(70*GA.DEG2RAD),pn=new K,Qn=2*Math.PI,Xe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},vd=1e-6;class db extends CE{constructor(t,i=null){super(t,i),this.state=Xe.NONE,this.enabled=!0,this.target=new K,this.cursor=new K,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Hr.ROTATE,MIDDLE:Hr.DOLLY,RIGHT:Hr.PAN},this.touches={ONE:Br.ROTATE,TWO:Br.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new K,this._lastQuaternion=new Vi,this._lastTargetPosition=new K,this._quat=new Vi().setFromUnitVectors(t.up,new K(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new av,this._sphericalDelta=new av,this._scale=1,this._panOffset=new K,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new K,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=mb.bind(this),this._onPointerDown=pb.bind(this),this._onPointerUp=gb.bind(this),this._onContextMenu=yb.bind(this),this._onMouseWheel=Sb.bind(this),this._onKeyDown=Mb.bind(this),this._onTouchStart=Ab.bind(this),this._onTouchMove=Eb.bind(this),this._onMouseDown=_b.bind(this),this._onMouseMove=vb.bind(this),this._interceptControlDown=xb.bind(this),this._interceptControlUp=Tb.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Lv),this.update(),this.state=Xe.NONE}update(t=null){const i=this.object.position;pn.copy(i).sub(this.target),pn.applyQuaternion(this._quat),this._spherical.setFromVector3(pn),this.autoRotate&&this.state===Xe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let s=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(s)&&isFinite(l)&&(s<-Math.PI?s+=Qn:s>Math.PI&&(s-=Qn),l<-Math.PI?l+=Qn:l>Math.PI&&(l-=Qn),s<=l?this._spherical.theta=Math.max(s,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(s+l)/2?Math.max(s,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let c=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const h=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),c=h!=this._spherical.radius}if(pn.setFromSpherical(this._spherical),pn.applyQuaternion(this._quatInverse),i.copy(this.target).add(pn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let h=null;if(this.object.isPerspectiveCamera){const d=pn.length();h=this._clampDistance(d*this._scale);const m=d-h;this.object.position.addScaledVector(this._dollyDirection,m),this.object.updateMatrixWorld(),c=!!m}else if(this.object.isOrthographicCamera){const d=new K(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const m=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),c=m!==this.object.zoom;const p=new K(this._mouse.x,this._mouse.y,0);p.unproject(this.object),this.object.position.sub(p).add(d),this.object.updateMatrixWorld(),h=pn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;h!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(h).add(this.object.position):(Kc.origin.copy(this.object.position),Kc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Kc.direction))<hb?this.object.lookAt(this.target):(wv.setFromNormalAndCoplanarPoint(this.object.up,this.target),Kc.intersectPlane(wv,this.target))))}else if(this.object.isOrthographicCamera){const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),h!==this.object.zoom&&(this.object.updateProjectionMatrix(),c=!0)}return this._scale=1,this._performCursorZoom=!1,c||this._lastPosition.distanceToSquared(this.object.position)>vd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>vd||this._lastTargetPosition.distanceToSquared(this.target)>vd?(this.dispatchEvent(Lv),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Qn/60*this.autoRotateSpeed*t:Qn/60/60*this.autoRotateSpeed}_getZoomScale(t){const i=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,i){pn.setFromMatrixColumn(i,0),pn.multiplyScalar(-t),this._panOffset.add(pn)}_panUp(t,i){this.screenSpacePanning===!0?pn.setFromMatrixColumn(i,1):(pn.setFromMatrixColumn(i,0),pn.crossVectors(this.object.up,pn)),pn.multiplyScalar(t),this._panOffset.add(pn)}_pan(t,i){const s=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;pn.copy(l).sub(this.target);let c=pn.length();c*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*c/s.clientHeight,this.object.matrix),this._panUp(2*i*c/s.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/s.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/s.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const s=this.domElement.getBoundingClientRect(),l=t-s.left,c=i-s.top,h=s.width,d=s.height;this._mouse.x=l/h*2-1,this._mouse.y=-(c/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Qn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Qn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let i=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._rotateStart.set(s,l)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._panStart.set(s,l)}}_handleTouchStartDolly(t){const i=this._getSecondPointerPosition(t),s=t.pageX-i.x,l=t.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyStart.set(0,c)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const s=this._getSecondPointerPosition(t),l=.5*(t.pageX+s.x),c=.5*(t.pageY+s.y);this._rotateEnd.set(l,c)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Qn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Qn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._panEnd.set(s,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const i=this._getSecondPointerPosition(t),s=t.pageX-i.x,l=t.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyEnd.set(0,c),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const h=(t.pageX+i.x)*.5,d=(t.pageY+i.y)*.5;this._updateZoomParameters(h,d)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==t.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(t){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==t.pointerId)return!0;return!1}_trackPointer(t){let i=this._pointerPositions[t.pointerId];i===void 0&&(i=new oe,this._pointerPositions[t.pointerId]=i),i.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const i=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(t){const i=t.deltaMode,s={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(i){case 1:s.deltaY*=16;break;case 2:s.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(s.deltaY*=10),s}}function pb(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r)))}function mb(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function gb(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(O1),this.state=Xe.NONE;break;case 1:const t=this._pointers[0],i=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:i.x,pageY:i.y});break}}function _b(r){let t;switch(r.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Hr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=Xe.DOLLY;break;case Hr.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Xe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Xe.ROTATE}break;case Hr.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Xe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Xe.PAN}break;default:this.state=Xe.NONE}this.state!==Xe.NONE&&this.dispatchEvent(Np)}function vb(r){switch(this.state){case Xe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case Xe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case Xe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function Sb(r){this.enabled===!1||this.enableZoom===!1||this.state!==Xe.NONE||(r.preventDefault(),this.dispatchEvent(Np),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(O1))}function Mb(r){this.enabled!==!1&&this._handleKeyDown(r)}function Ab(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case Br.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=Xe.TOUCH_ROTATE;break;case Br.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=Xe.TOUCH_PAN;break;default:this.state=Xe.NONE}break;case 2:switch(this.touches.TWO){case Br.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=Xe.TOUCH_DOLLY_PAN;break;case Br.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=Xe.TOUCH_DOLLY_ROTATE;break;default:this.state=Xe.NONE}break;default:this.state=Xe.NONE}this.state!==Xe.NONE&&this.dispatchEvent(Np)}function Eb(r){switch(this._trackPointer(r),this.state){case Xe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case Xe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case Xe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case Xe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=Xe.NONE}}function yb(r){this.enabled!==!1&&r.preventDefault()}function xb(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Tb(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Rb={1:[1,1,1],2:[.851,1,1],5:[1,.71,.71],6:[.565,.565,.565],7:[.188,.314,.973],8:[1,.051,.051],9:[.565,.878,.314],11:[.671,.361,.949],12:[.541,1,0],13:[.749,.651,.651],14:[.941,.784,.627],15:[1,.502,0],16:[1,1,.188],17:[.122,.941,.122],18:[.502,.82,.89],19:[.561,.251,.831],20:[.239,1,0],26:[.878,.4,.2],29:[.784,.502,.2],30:[.49,.502,.69],34:[1,.631,0],35:[.651,.161,.161],53:[.58,0,.58]},bb=[.75,.4,.75],Cb={1:1.2,6:1.7,7:1.55,8:1.52,9:1.47,11:2.27,12:1.73,15:1.8,16:1.8,17:1.75,19:2.75,20:2.31,26:2.04,29:1.4,30:1.39},Ob=1.5,du=.3,pu=.15,hp=1,dp=2,pp=3,mp=4,ts=.18,mu=.1,gu=.2,_u=.08,vu=.1,Su=.06,Lb={1:"H",6:"C",7:"N",8:"O",9:"F",11:"Na",12:"Mg",15:"P",16:"S",17:"Cl",19:"K",20:"Ca",26:"Fe",29:"Cu",30:"Zn"},wb={1:"Single",2:"Double",3:"Triple",4:"Aromatic"};function Bs(r){return Rb[r]??bb}function Mu(r){return Cb[r]??Ob}function Up(r){return Lb[r]??`#${r}`}const da=new Ue,jc=new Ue,al=new K,Dv=new Vi,sl=new K,Nv=new me,Uv=32;class Db{constructor(t=5e3){Bt(this,"mesh");Bt(this,"material");Bt(this,"nAtoms",0);Bt(this,"elements",null);Bt(this,"scaleFactor",1);const i=new Tu(1,Uv,Uv);this.material=new M1({roughness:.35,metalness:.05,clearcoat:.1,envMapIntensity:.4}),this.mesh=new _1(i,this.material,t),this.mesh.count=0,this.mesh.frustumCulled=!1}loadSnapshot(t){const{nAtoms:i,positions:s,elements:l}=t;this.nAtoms=i,this.elements=l,this.mesh.count=i;for(let c=0;c<i;c++){const h=s[c*3],d=s[c*3+1],m=s[c*3+2],p=Mu(l[c])*du*this.scaleFactor;da.makeScale(p,p,p),da.setPosition(h,d,m),this.mesh.setMatrixAt(c,da);const[g,_,S]=Bs(l[c]);Nv.setRGB(g,_,S),this.mesh.setColorAt(c,Nv)}this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(t){for(let i=0;i<this.nAtoms;i++){const s=t[i*3],l=t[i*3+1],c=t[i*3+2];this.mesh.getMatrixAt(i,jc),jc.decompose(al,Dv,sl),da.makeScale(sl.x,sl.y,sl.z),da.setPosition(s,l,c),this.mesh.setMatrixAt(i,da)}this.mesh.instanceMatrix.needsUpdate=!0}setScale(t,i){this.scaleFactor=t;const{nAtoms:s,elements:l}=i;for(let c=0;c<s;c++){this.mesh.getMatrixAt(c,jc),jc.decompose(al,Dv,sl);const h=Mu(l[c])*du*t;da.makeScale(h,h,h),da.setPosition(al.x,al.y,al.z),this.mesh.setMatrixAt(c,da)}this.mesh.instanceMatrix.needsUpdate=!0}setOpacity(t){this.material.opacity=t,this.material.transparent=t<1,this.material.depthWrite=t>=1,this.material.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const Ur=new K,Pr=new K,Pv=new K,Za=new K,Os=new K,Iv=new K(0,1,0),Nb=new K(1,0,0),Bv=new Vi,Fv=new Ue,Fi=new me,zv=new K,Sd=new K;class Ub{constructor(t=3e6){Bt(this,"mesh");Bt(this,"visualBonds",[]);Bt(this,"scaleFactor",1);const i=new wp(1,1,1,6,1),s=new M1({roughness:.35,metalness:.05,clearcoat:.1,envMapIntensity:.4});this.mesh=new _1(i,s,t),this.mesh.count=0,this.mesh.frustumCulled=!1}loadSnapshot(t){const{nBonds:i,positions:s,elements:l,bonds:c,bondOrders:h}=t;this.visualBonds.length=0;let d=0;for(let m=0;m<i;m++){const p=c[m*2],g=c[m*2+1],_=h?h[m]:hp;Ur.set(s[p*3],s[p*3+1],s[p*3+2]),Pr.set(s[g*3],s[g*3+1],s[g*3+2]),Za.subVectors(Pr,Ur).normalize(),Os.crossVectors(Za,Iv),Os.lengthSq()<.001&&Os.crossVectors(Za,Nb),Os.normalize();const[S,E,y]=Bs(l[p]),[T,A,v]=Bs(l[g]),U=(S+T)/2,D=(E+A)/2,O=(y+v)/2;if(_===dp)for(const H of[-1,1]){const B=Os.clone();this.visualBonds.push({ai:p,bi:g,radius:mu,offsetDir:B,offsetMag:H*ts}),this.setCylinderAt(d,s,p,g,mu,B,H*ts),Fi.setRGB(U,D,O),this.mesh.setColorAt(d,Fi),d++}else if(_===pp){const H=[0,2*Math.PI/3,4*Math.PI/3],B=Os.clone(),P=new K().crossVectors(Za,B).normalize();for(const V of H){const L=B.clone().multiplyScalar(Math.cos(V)).addScaledVector(P,Math.sin(V));this.visualBonds.push({ai:p,bi:g,radius:_u,offsetDir:L,offsetMag:gu}),this.setCylinderAt(d,s,p,g,_u,L,gu),Fi.setRGB(U,D,O),this.mesh.setColorAt(d,Fi),d++}}else if(_===mp){const H=new K(0,0,0);this.visualBonds.push({ai:p,bi:g,radius:vu,offsetDir:H,offsetMag:0}),this.setCylinderAt(d,s,p,g,vu,H,0),Fi.setRGB(U,D,O),this.mesh.setColorAt(d,Fi),d++;const B=Os.clone();this.visualBonds.push({ai:p,bi:g,radius:Su,offsetDir:B,offsetMag:ts}),this.setCylinderAt(d,s,p,g,Su,B,ts),Fi.setRGB(Math.min(1,U+.3),Math.min(1,D+.3),Math.min(1,O+.3)),this.mesh.setColorAt(d,Fi),d++}else{const H=new K(0,0,0);this.visualBonds.push({ai:p,bi:g,radius:pu,offsetDir:H,offsetMag:0}),this.setCylinderAt(d,s,p,g,pu,H,0),Fi.setRGB(U,D,O),this.mesh.setColorAt(d,Fi),d++}}this.mesh.count=d,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(t,i,s){for(let l=0;l<this.visualBonds.length;l++){const c=this.visualBonds[l];this.setCylinderAt(l,t,c.ai,c.bi,c.radius,c.offsetDir,c.offsetMag)}this.mesh.instanceMatrix.needsUpdate=!0}setCylinderAt(t,i,s,l,c,h,d){Ur.set(i[s*3],i[s*3+1],i[s*3+2]),Pr.set(i[l*3],i[l*3+1],i[l*3+2]),d!==0&&(Sd.copy(h).multiplyScalar(d),Ur.add(Sd),Pr.add(Sd)),Pv.addVectors(Ur,Pr).multiplyScalar(.5),Za.subVectors(Pr,Ur);const m=Za.length();Za.normalize(),Bv.setFromUnitVectors(Iv,Za),zv.set(c*this.scaleFactor,m,c*this.scaleFactor),Fv.compose(Pv,Bv,zv),this.mesh.setMatrixAt(t,Fv)}setOpacity(t){const i=this.mesh.material;i.opacity=t,i.transparent=t<1,i.depthWrite=t>=1,i.needsUpdate=!0}setScale(t){this.scaleFactor=t;const i=new Ue,s=new K,l=new Vi,c=new K;for(let h=0;h<this.visualBonds.length;h++){this.mesh.getMatrixAt(h,i),i.decompose(s,l,c);const d=this.visualBonds[h].radius*t;c.x=d,c.z=d,i.compose(s,l,c),this.mesh.setMatrixAt(h,i)}this.mesh.instanceMatrix.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Pb=`#version 300 es
  precision highp float;

  // Three.js built-in uniforms (must declare explicitly for RawShaderMaterial)
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uScaleMultiplier;

  // Per-vertex (quad corners)
  in vec3 position;

  // Per-instance
  in vec3 instanceCenter;
  in float instanceRadius;
  in vec3 instanceColor;

  out vec3 vColor;
  out vec2 vUv;
  out float vRadius;
  out vec3 vViewCenter;

  void main() {
    vColor = instanceColor;
    vUv = position.xy;
    float scaledRadius = instanceRadius * uScaleMultiplier;
    vRadius = scaledRadius;

    vec4 viewCenter = modelViewMatrix * vec4(instanceCenter, 1.0);
    vViewCenter = viewCenter.xyz;

    vec3 viewPos = viewCenter.xyz;
    viewPos.xy += position.xy * scaledRadius;

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`,Ib=`#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vUv;
  in float vRadius;
  in vec3 vViewCenter;

  uniform mat4 projectionMatrix;
  uniform float uOpacity;

  out vec4 fragColor;

  void main() {
    float dist2 = dot(vUv, vUv);
    if (dist2 > 1.0) discard;

    float z = sqrt(1.0 - dist2);
    vec3 normal = vec3(vUv, z);

    // Correct depth
    vec3 fragViewPos = vViewCenter + normal * vRadius;
    vec4 clipPos = projectionMatrix * vec4(fragViewPos, 1.0);
    float ndcDepth = clipPos.z / clipPos.w;
    gl_FragDepth = ndcDepth * 0.5 + 0.5;

    // Hemisphere ambient: sky blue on top, warm brown on bottom
    vec3 skyColor = vec3(0.87, 0.92, 1.0);
    vec3 groundColor = vec3(0.6, 0.47, 0.27);
    float hemiMix = normal.y * 0.5 + 0.5;
    vec3 ambient = mix(groundColor, skyColor, hemiMix) * 0.35;

    // Dual-light diffuse
    vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.3, 0.3, 0.8));
    float diffuse1 = max(dot(normal, lightDir1), 0.0);
    float diffuse2 = max(dot(normal, lightDir2), 0.0);
    float diffuse = diffuse1 * 0.55 + diffuse2 * 0.2;

    // Specular (Blinn-Phong)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

    // Fresnel rim
    float fresnel = pow(1.0 - z, 3.0) * 0.15;

    // Edge darkening (stronger for Speck-like depth)
    float edgeFactor = mix(0.7, 1.0, z);

    vec3 color = vColor * (ambient + diffuse) * edgeFactor
               + vec3(1.0) * spec * 0.3
               + vec3(0.15) * fresnel;
    fragColor = vec4(color, uOpacity);
  }
`,Bb=`#version 300 es
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uBondScaleMultiplier;

  in vec3 position;
  in vec2 uv;

  in vec3 instanceStart;
  in vec3 instanceEnd;
  in vec3 instanceColor;
  in float instanceRadius;
  in float instanceDashed;

  out vec3 vColor;
  out vec2 vCylUv;
  out float vDashed;

  void main() {
    vColor = instanceColor;
    vCylUv = uv;
    vDashed = instanceDashed;

    vec4 viewStart = modelViewMatrix * vec4(instanceStart, 1.0);
    vec4 viewEnd = modelViewMatrix * vec4(instanceEnd, 1.0);

    vec3 viewMid = (viewStart.xyz + viewEnd.xyz) * 0.5;
    vec3 axis = viewEnd.xyz - viewStart.xyz;
    float len = length(axis);
    vec3 dir = axis / max(len, 0.0001);

    vec3 side = normalize(cross(dir, vec3(0.0, 0.0, 1.0)));

    vec3 viewPos = viewMid
      + dir * (position.y * len * 0.5)
      + side * (position.x * instanceRadius * uBondScaleMultiplier);

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`,Fb=`#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vCylUv;
  in float vDashed;

  uniform float uOpacity;

  out vec4 fragColor;

  void main() {
    // Dashed bond: discard alternate segments along bond length
    if (vDashed > 0.5) {
      if (sin(vCylUv.y * 30.0) < 0.0) discard;
    }

    float nx = vCylUv.x;
    float nz = sqrt(max(0.0, 1.0 - nx * nx));
    vec3 normal = vec3(nx, 0.0, nz);

    // Hemisphere ambient
    vec3 skyColor = vec3(0.87, 0.92, 1.0);
    vec3 groundColor = vec3(0.6, 0.47, 0.27);
    float hemiMix = normal.y * 0.5 + 0.5;
    vec3 ambient = mix(groundColor, skyColor, hemiMix) * 0.35;

    // Dual-light diffuse
    vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.3, 0.3, 0.8));
    float diffuse1 = max(dot(normal, lightDir1), 0.0);
    float diffuse2 = max(dot(normal, lightDir2), 0.0);
    float diffuse = diffuse1 * 0.55 + diffuse2 * 0.2;

    // Specular
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

    // Fresnel rim
    float fresnel = pow(1.0 - nz, 3.0) * 0.1;

    vec3 color = vColor * (ambient + diffuse)
               + vec3(1.0) * spec * 0.2
               + vec3(0.1) * fresnel;
    fragColor = vec4(color, uOpacity);
  }
`;class zb{constructor(t=1e6){Bt(this,"mesh");Bt(this,"geo");Bt(this,"material");Bt(this,"centerAttr");Bt(this,"radiusAttr");Bt(this,"colorAttr");Bt(this,"centerBuf");Bt(this,"radiusBuf");Bt(this,"colorBuf");Bt(this,"nAtoms",0);Bt(this,"capacity");this.capacity=t,this.geo=new y1;const i=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),s=new Uint16Array([0,1,2,0,2,3]);this.geo.setAttribute("position",new Ln(i,3)),this.geo.setIndex(new Ln(s,1)),this.geo.instanceCount=0,this.centerBuf=new Float32Array(t*3),this.radiusBuf=new Float32Array(t),this.colorBuf=new Float32Array(t*3),this.centerAttr=new An(this.centerBuf,3),this.radiusAttr=new An(this.radiusBuf,1),this.colorAttr=new An(this.colorBuf,3),this.centerAttr.setUsage(Fr),this.radiusAttr.setUsage(lu),this.colorAttr.setUsage(lu),this.geo.setAttribute("instanceCenter",this.centerAttr),this.geo.setAttribute("instanceRadius",this.radiusAttr),this.geo.setAttribute("instanceColor",this.colorAttr),this.material=new S1({vertexShader:Pb,fragmentShader:Ib,uniforms:{uScaleMultiplier:{value:1},uOpacity:{value:1}},depthWrite:!0,depthTest:!0}),this.mesh=new zn(this.geo,this.material),this.mesh.frustumCulled=!1}loadSnapshot(t){const{nAtoms:i,positions:s,elements:l}=t;this.nAtoms=i,i>this.capacity&&this.grow(i);for(let c=0;c<i;c++){const h=c*3;this.centerBuf[h]=s[h],this.centerBuf[h+1]=s[h+1],this.centerBuf[h+2]=s[h+2],this.radiusBuf[c]=Mu(l[c])*du;const[d,m,p]=Bs(l[c]);this.colorBuf[h]=d,this.colorBuf[h+1]=m,this.colorBuf[h+2]=p}this.centerAttr.needsUpdate=!0,this.radiusAttr.needsUpdate=!0,this.colorAttr.needsUpdate=!0,this.geo.instanceCount=i}updatePositions(t){this.centerBuf.set(t.subarray(0,this.nAtoms*3)),this.centerAttr.needsUpdate=!0}setScale(t,i){this.material.uniforms.uScaleMultiplier.value=t}setOpacity(t){this.material.uniforms.uOpacity.value=t,this.material.transparent=t<1,this.material.depthWrite=t>=1,this.material.needsUpdate=!0}grow(t){this.capacity=Math.max(t,this.capacity*2),this.centerBuf=new Float32Array(this.capacity*3),this.radiusBuf=new Float32Array(this.capacity),this.colorBuf=new Float32Array(this.capacity*3),this.centerAttr=new An(this.centerBuf,3),this.radiusAttr=new An(this.radiusBuf,1),this.colorAttr=new An(this.colorBuf,3),this.centerAttr.setUsage(Fr),this.geo.setAttribute("instanceCenter",this.centerAttr),this.geo.setAttribute("instanceRadius",this.radiusAttr),this.geo.setAttribute("instanceColor",this.colorAttr)}dispose(){this.geo.dispose(),this.material.dispose()}}const Qa=new K,Mn=new K,Hv=new K(0,1,0),Gv=new K(1,0,0);class Hb{constructor(t=3e6){Bt(this,"mesh");Bt(this,"geo");Bt(this,"bondMaterial");Bt(this,"startAttr");Bt(this,"endAttr");Bt(this,"colorAttr");Bt(this,"radiusAttr");Bt(this,"dashedAttr");Bt(this,"startBuf");Bt(this,"endBuf");Bt(this,"colorBuf");Bt(this,"radiusBuf");Bt(this,"dashedBuf");Bt(this,"visualBonds",[]);Bt(this,"capacity");this.capacity=t,this.geo=new y1;const i=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),s=new Float32Array([-1,-1,1,-1,1,1,-1,1]),l=new Uint16Array([0,1,2,0,2,3]);this.geo.setAttribute("position",new Ln(i,3)),this.geo.setAttribute("uv",new Ln(s,2)),this.geo.setIndex(new Ln(l,1)),this.geo.instanceCount=0,this.startBuf=new Float32Array(t*3),this.endBuf=new Float32Array(t*3),this.colorBuf=new Float32Array(t*3),this.radiusBuf=new Float32Array(t),this.dashedBuf=new Float32Array(t),this.startAttr=new An(this.startBuf,3),this.endAttr=new An(this.endBuf,3),this.colorAttr=new An(this.colorBuf,3),this.radiusAttr=new An(this.radiusBuf,1),this.dashedAttr=new An(this.dashedBuf,1),this.startAttr.setUsage(Fr),this.endAttr.setUsage(Fr),this.geo.setAttribute("instanceStart",this.startAttr),this.geo.setAttribute("instanceEnd",this.endAttr),this.geo.setAttribute("instanceColor",this.colorAttr),this.geo.setAttribute("instanceRadius",this.radiusAttr),this.geo.setAttribute("instanceDashed",this.dashedAttr),this.bondMaterial=new S1({vertexShader:Bb,fragmentShader:Fb,uniforms:{uOpacity:{value:1},uBondScaleMultiplier:{value:1}},depthWrite:!0,depthTest:!0}),this.mesh=new zn(this.geo,this.bondMaterial),this.mesh.frustumCulled=!1}loadSnapshot(t){const{nBonds:i,positions:s,elements:l,bonds:c,bondOrders:h}=t;this.visualBonds=[];let d=0;for(let p=0;p<i;p++){const g=h?h[p]:hp;g===dp?d+=2:g===pp?d+=3:g===mp?d+=2:d+=1}d>this.capacity&&this.grow(d);let m=0;for(let p=0;p<i;p++){const g=c[p*2],_=c[p*2+1],S=h?h[p]:hp;Qa.set(s[_*3]-s[g*3],s[_*3+1]-s[g*3+1],s[_*3+2]-s[g*3+2]).normalize(),Mn.crossVectors(Qa,Hv),Mn.lengthSq()<.001&&Mn.crossVectors(Qa,Gv),Mn.normalize();const[E,y,T]=Bs(l[g]),[A,v,U]=Bs(l[_]),D=(E+A)*.5,O=(y+v)*.5,H=(T+U)*.5;if(S===dp)for(const B of[-1,1])this.visualBonds.push({ai:g,bi:_,radius:mu,offsetX:B*ts,offsetY:0,dashed:0}),this.setInstance(m,s,g,_,mu,Mn,B*ts,D,O,H,0),m++;else if(S===pp){const B=new K().crossVectors(Qa,Mn).normalize(),P=[0,2*Math.PI/3,4*Math.PI/3];for(const V of P){const L=Math.cos(V)*gu,C=Math.sin(V)*gu;this.visualBonds.push({ai:g,bi:_,radius:_u,offsetX:L,offsetY:C,dashed:0});const z=Mn.clone().multiplyScalar(L).addScaledVector(B,C);this.setInstanceWithOffset(m,s,g,_,_u,z,D,O,H,0),m++}}else S===mp?(this.visualBonds.push({ai:g,bi:_,radius:vu,offsetX:0,offsetY:0,dashed:0}),this.setInstance(m,s,g,_,vu,Mn,0,D,O,H,0),m++,this.visualBonds.push({ai:g,bi:_,radius:Su,offsetX:ts,offsetY:0,dashed:1}),this.setInstance(m,s,g,_,Su,Mn,ts,D,O,H,1),m++):(this.visualBonds.push({ai:g,bi:_,radius:pu,offsetX:0,offsetY:0,dashed:0}),this.setInstance(m,s,g,_,pu,Mn,0,D,O,H,0),m++)}this.startAttr.needsUpdate=!0,this.endAttr.needsUpdate=!0,this.colorAttr.needsUpdate=!0,this.radiusAttr.needsUpdate=!0,this.dashedAttr.needsUpdate=!0,this.geo.instanceCount=m}updatePositions(t,i,s){for(let l=0;l<this.visualBonds.length;l++){const c=this.visualBonds[l],h=c.ai,d=c.bi,m=h*3,p=d*3,g=l*3;if(Qa.set(t[p]-t[m],t[p+1]-t[m+1],t[p+2]-t[m+2]).normalize(),Mn.crossVectors(Qa,Hv),Mn.lengthSq()<.001&&Mn.crossVectors(Qa,Gv),Mn.normalize(),c.offsetX===0&&c.offsetY===0)this.startBuf[g]=t[m],this.startBuf[g+1]=t[m+1],this.startBuf[g+2]=t[m+2],this.endBuf[g]=t[p],this.endBuf[g+1]=t[p+1],this.endBuf[g+2]=t[p+2];else{const _=new K().crossVectors(Qa,Mn).normalize(),S=Mn.x*c.offsetX+_.x*c.offsetY,E=Mn.y*c.offsetX+_.y*c.offsetY,y=Mn.z*c.offsetX+_.z*c.offsetY;this.startBuf[g]=t[m]+S,this.startBuf[g+1]=t[m+1]+E,this.startBuf[g+2]=t[m+2]+y,this.endBuf[g]=t[p]+S,this.endBuf[g+1]=t[p+1]+E,this.endBuf[g+2]=t[p+2]+y}}this.startAttr.needsUpdate=!0,this.endAttr.needsUpdate=!0}setInstance(t,i,s,l,c,h,d,m,p,g,_){const S=s*3,E=l*3,y=t*3,T=h.x*d,A=h.y*d,v=h.z*d;this.startBuf[y]=i[S]+T,this.startBuf[y+1]=i[S+1]+A,this.startBuf[y+2]=i[S+2]+v,this.endBuf[y]=i[E]+T,this.endBuf[y+1]=i[E+1]+A,this.endBuf[y+2]=i[E+2]+v,this.colorBuf[y]=m,this.colorBuf[y+1]=p,this.colorBuf[y+2]=g,this.radiusBuf[t]=c,this.dashedBuf[t]=_}setInstanceWithOffset(t,i,s,l,c,h,d,m,p,g){const _=s*3,S=l*3,E=t*3;this.startBuf[E]=i[_]+h.x,this.startBuf[E+1]=i[_+1]+h.y,this.startBuf[E+2]=i[_+2]+h.z,this.endBuf[E]=i[S]+h.x,this.endBuf[E+1]=i[S+1]+h.y,this.endBuf[E+2]=i[S+2]+h.z,this.colorBuf[E]=d,this.colorBuf[E+1]=m,this.colorBuf[E+2]=p,this.radiusBuf[t]=c,this.dashedBuf[t]=g}grow(t){this.capacity=Math.max(t,this.capacity*2),this.startBuf=new Float32Array(this.capacity*3),this.endBuf=new Float32Array(this.capacity*3),this.colorBuf=new Float32Array(this.capacity*3),this.radiusBuf=new Float32Array(this.capacity),this.dashedBuf=new Float32Array(this.capacity),this.startAttr=new An(this.startBuf,3),this.endAttr=new An(this.endBuf,3),this.colorAttr=new An(this.colorBuf,3),this.radiusAttr=new An(this.radiusBuf,1),this.dashedAttr=new An(this.dashedBuf,1),this.startAttr.setUsage(Fr),this.endAttr.setUsage(Fr),this.geo.setAttribute("instanceStart",this.startAttr),this.geo.setAttribute("instanceEnd",this.endAttr),this.geo.setAttribute("instanceColor",this.colorAttr),this.geo.setAttribute("instanceRadius",this.radiusAttr),this.geo.setAttribute("instanceDashed",this.dashedAttr)}setOpacity(t){this.bondMaterial.uniforms.uOpacity.value=t,this.bondMaterial.transparent=t<1,this.bondMaterial.depthWrite=t>=1,this.bondMaterial.needsUpdate=!0}setScale(t){this.bondMaterial.uniforms.uBondScaleMultiplier.value=t}dispose(){this.geo.dispose(),this.bondMaterial.dispose()}}class Gb{constructor(){Bt(this,"mesh");Bt(this,"geometry");this.geometry=new ci;const t=new Float32Array(72);this.geometry.setAttribute("position",new Ln(t,3));const i=new Lp({color:6710886,transparent:!0,opacity:.5});this.mesh=new SE(this.geometry,i),this.mesh.frustumCulled=!1,this.mesh.visible=!1}loadBox(t){const i=new K(t[0],t[1],t[2]),s=new K(t[3],t[4],t[5]),l=new K(t[6],t[7],t[8]),c=new K(0,0,0),h=i.clone(),d=s.clone(),m=l.clone(),p=i.clone().add(s),g=i.clone().add(l),_=s.clone().add(l),S=i.clone().add(s).add(l),E=[[c,h],[c,d],[h,p],[d,p],[m,g],[m,_],[g,S],[_,S],[c,m],[h,g],[d,_],[p,S]],y=this.geometry.getAttribute("position"),T=y.array;for(let A=0;A<12;A++){const[v,U]=E[A];T[A*6]=v.x,T[A*6+1]=v.y,T[A*6+2]=v.z,T[A*6+3]=U.x,T[A*6+4]=U.y,T[A*6+5]=U.z}y.needsUpdate=!0,this.geometry.computeBoundingSphere(),this.mesh.visible=!0}setVisible(t){this.mesh.visible=t}dispose(){this.geometry.dispose(),this.mesh.material.dispose()}}const Vb=500,kb="bold 11px sans-serif",Vv=-8;class Xb{constructor(){Bt(this,"canvas");Bt(this,"ctx");Bt(this,"labels",null);Bt(this,"elements",null);Bt(this,"nAtoms",0);Bt(this,"positions",null);Bt(this,"tmpVec",new K);this.canvas=document.createElement("canvas"),this.canvas.style.position="absolute",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.pointerEvents="none",this.ctx=this.canvas.getContext("2d")}getCanvas(){return this.canvas}setLabels(t){this.labels=t}setAtomData(t,i){this.elements=t,this.nAtoms=i}setPositions(t){this.positions=t}resize(t,i,s){this.canvas.width=t*s,this.canvas.height=i*s,this.canvas.style.width=`${t}px`,this.canvas.style.height=`${i}px`,this.ctx.setTransform(s,0,0,s,0,0)}render(t,i,s){if(this.ctx.clearRect(0,0,i,s),!this.labels||!this.positions||!this.elements||this.nAtoms===0)return;const l=i/2,c=s/2,h=[];for(let m=0;m<this.nAtoms;m++){if(!this.labels[m]||(this.tmpVec.set(this.positions[m*3],this.positions[m*3+1],this.positions[m*3+2]),this.tmpVec.project(t),this.tmpVec.z<-1||this.tmpVec.z>1))continue;const g=this.tmpVec.x*l+l,_=-(this.tmpVec.y*c)+c;g<-50||g>i+50||_<-20||_>s+20||h.push({sx:g,sy:_,z:this.tmpVec.z,idx:m})}h.sort((m,p)=>m.z-p.z);const d=Math.min(h.length,Vb);this.ctx.font=kb,this.ctx.textAlign="center",this.ctx.textBaseline="bottom";for(let m=0;m<d;m++){const{sx:p,sy:g,idx:_}=h[m],S=this.labels[_],E=this.elements[_],[y,T,A]=Bs(E),v=.299*y+.587*T+.114*A,U=v>.5?"#000000":"#ffffff",D=v>.5?"#ffffff":"#000000";this.ctx.strokeStyle=D,this.ctx.lineWidth=2.5,this.ctx.lineJoin="round",this.ctx.strokeText(S,p,g+Vv),this.ctx.fillStyle=U,this.ctx.fillText(S,p,g+Vv)}}dispose(){this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}}const Yb=5e3;class Wb{constructor(){Bt(this,"container",null);Bt(this,"renderer");Bt(this,"scene");Bt(this,"camera");Bt(this,"controls");Bt(this,"atomRenderer",null);Bt(this,"bondRenderer",null);Bt(this,"cellRenderer",null);Bt(this,"labelOverlay",null);Bt(this,"useImpostor",!1);Bt(this,"animationId",null);Bt(this,"snapshot",null);Bt(this,"lastExtent",1);Bt(this,"currentPositions",null);Bt(this,"atomScale",1);Bt(this,"atomOpacity",1);Bt(this,"bondScale",1);Bt(this,"bondOpacity",1);Bt(this,"raycaster",new bE);Bt(this,"mouse",new oe);Bt(this,"selectedAtoms",[]);Bt(this,"selectionGroup",new rl);Bt(this,"animate",()=>{this.animationId=requestAnimationFrame(this.animate),this.controls.update(),this.renderer.render(this.scene,this.camera),this.labelOverlay&&this.container&&this.labelOverlay.render(this.camera,this.container.clientWidth,this.container.clientHeight)})}mount(t){this.container=t,this.renderer=new fb({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t.clientWidth,t.clientHeight),this.renderer.setClearColor(16777215,1),t.appendChild(this.renderer.domElement),this.labelOverlay=new Xb,t.appendChild(this.labelOverlay.getCanvas()),this.labelOverlay.resize(t.clientWidth,t.clientHeight,Math.min(window.devicePixelRatio,2)),this.scene=new pE,this.scene.background=new me(16777215),this.camera=new Mi(50,t.clientWidth/t.clientHeight,.1,1e4),this.camera.position.set(0,0,50),this.controls=new db(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.1,this.controls.rotateSpeed=.8,this.controls.zoomSpeed=1.2;const i=new yE(14544639,10057540,.4);this.scene.add(i);const s=new ud(16777215,.8);s.position.set(50,50,50),this.scene.add(s);const l=new ud(16777215,.4);l.position.set(-30,20,-20),this.scene.add(l);const c=new ud(16777215,.3);c.position.set(0,-30,-50),this.scene.add(c),this.scene.add(this.selectionGroup),new ResizeObserver(()=>this.onResize()).observe(t),this.animate()}loadSnapshot(t){this.snapshot=t,this.currentPositions=new Float32Array(t.positions);const i=t.nAtoms>Yb;(this.atomRenderer===null||i!==this.useImpostor)&&this.swapRenderers(i),this.atomRenderer.loadSnapshot(t),this.bondRenderer.loadSnapshot(t),this.atomScale!==1&&this.atomRenderer.setScale&&this.atomRenderer.setScale(this.atomScale,t),this.bondScale!==1&&this.bondRenderer.setScale&&this.bondRenderer.setScale(this.bondScale,t),this.labelOverlay&&(this.labelOverlay.setAtomData(t.elements,t.nAtoms),this.labelOverlay.setPositions(t.positions)),t.box&&t.box.some(l=>l!==0)&&(this.cellRenderer||(this.cellRenderer=new Gb,this.scene.add(this.cellRenderer.mesh)),this.cellRenderer.loadBox(t.box)),this.fitToView(t)}updateFrame(t){var i;!this.snapshot||!this.atomRenderer||!this.bondRenderer||(this.currentPositions=new Float32Array(t.positions),this.atomRenderer.updatePositions(t.positions),(i=this.labelOverlay)==null||i.setPositions(t.positions),this.bondRenderer.updatePositions(t.positions,this.snapshot.bonds,this.snapshot.nBonds),this.selectedAtoms.length>0&&this.updateSelectionVisuals())}setLabels(t){var i;(i=this.labelOverlay)==null||i.setLabels(t)}setAtomScale(t){var i;this.atomScale=t,(i=this.atomRenderer)!=null&&i.setScale&&this.snapshot&&this.atomRenderer.setScale(t,this.snapshot)}setAtomOpacity(t){var i,s;this.atomOpacity=t,(s=(i=this.atomRenderer)==null?void 0:i.setOpacity)==null||s.call(i,t)}setBondScale(t){var i;this.bondScale=t,(i=this.bondRenderer)!=null&&i.setScale&&this.snapshot&&this.bondRenderer.setScale(t,this.snapshot)}setBondOpacity(t){var i,s;this.bondOpacity=t,(s=(i=this.bondRenderer)==null?void 0:i.setOpacity)==null||s.call(i,t)}setBondsVisible(t){this.bondRenderer&&(this.bondRenderer.mesh.visible=t)}setCellVisible(t){this.cellRenderer&&this.cellRenderer.setVisible(t)}hasCell(){return this.cellRenderer!==null&&this.cellRenderer.mesh.visible}swapRenderers(t){var i,s,l,c;if(this.atomRenderer&&(this.scene.remove(this.atomRenderer.mesh),this.atomRenderer.dispose()),this.bondRenderer&&(this.scene.remove(this.bondRenderer.mesh),this.bondRenderer.dispose()),this.useImpostor=t,t){const h=new zb,d=new Hb;this.atomRenderer=h,this.bondRenderer=d}else{const h=new Db,d=new Ub;this.atomRenderer=h,this.bondRenderer=d}this.scene.add(this.atomRenderer.mesh),this.scene.add(this.bondRenderer.mesh),this.atomOpacity!==1&&((s=(i=this.atomRenderer).setOpacity)==null||s.call(i,this.atomOpacity)),this.bondOpacity!==1&&((c=(l=this.bondRenderer).setOpacity)==null||c.call(l,this.bondOpacity))}fitToView(t){const{positions:i,nAtoms:s}=t;let l=1/0,c=1/0,h=1/0,d=-1/0,m=-1/0,p=-1/0;for(let T=0;T<s;T++){const A=i[T*3],v=i[T*3+1],U=i[T*3+2];l=Math.min(l,A),c=Math.min(c,v),h=Math.min(h,U),d=Math.max(d,A),m=Math.max(m,v),p=Math.max(p,U)}const g=(l+d)/2,_=(c+m)/2,S=(h+p)/2,E=Math.max(d-l,m-c,p-h);this.lastExtent=E,this.controls.target.set(g,_,S);const y=E*1.2;this.camera.position.set(g,_,S+y),this.camera.near=y*.01,this.camera.far=y*10,this.camera.updateProjectionMatrix(),this.controls.update()}resetView(){this.snapshot&&this.fitToView(this.snapshot)}getCanvas(){var t;return((t=this.renderer)==null?void 0:t.domElement)??null}getCurrentPositions(){return this.currentPositions??this.snapshot.positions}raycastAtPixel(t,i){if(!this.container||!this.snapshot)return null;const s=this.container.getBoundingClientRect();if(this.mouse.x=(t-s.left)/s.width*2-1,this.mouse.y=-((i-s.top)/s.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera),this.atomRenderer&&!this.useImpostor){const l=this.raycaster.intersectObject(this.atomRenderer.mesh,!1);if(l.length>0&&l[0].instanceId!==void 0){const c=l[0].instanceId,h=this.getCurrentPositions(),d=this.snapshot.elements[c];return{kind:"atom",atomIndex:c,elementSymbol:Up(d),atomicNumber:d,position:[h[c*3],h[c*3+1],h[c*3+2]],screenX:t,screenY:i}}}if(this.bondRenderer&&!this.useImpostor){const l=this.raycaster.intersectObject(this.bondRenderer.mesh,!1);if(l.length>0&&l[0].instanceId!==void 0){const c=this.getBondInfoFromInstance(l[0].instanceId);if(c)return{kind:"bond",...c,screenX:t,screenY:i}}}return null}getBondInfoFromInstance(t){if(!this.snapshot||!this.bondRenderer||this.useImpostor)return null;const i=this.bondRenderer;if(t>=i.visualBonds.length)return null;const s=i.visualBonds[t],l=this.getCurrentPositions(),c=l[s.bi*3]-l[s.ai*3],h=l[s.bi*3+1]-l[s.ai*3+1],d=l[s.bi*3+2]-l[s.ai*3+2],m=Math.sqrt(c*c+h*h+d*d);let p=1;if(this.snapshot.bondOrders){const g=this.snapshot.bonds;for(let _=0;_<this.snapshot.nBonds;_++){const S=g[_*2],E=g[_*2+1];if(S===s.ai&&E===s.bi||S===s.bi&&E===s.ai){p=this.snapshot.bondOrders[_];break}}}return{atomA:s.ai,atomB:s.bi,bondOrder:p,bondLength:m}}toggleAtomSelection(t){const i=this.selectedAtoms.indexOf(t);return i>=0?this.selectedAtoms.splice(i,1):(this.selectedAtoms.length>=4&&this.selectedAtoms.shift(),this.selectedAtoms.push(t)),this.updateSelectionVisuals(),{atoms:[...this.selectedAtoms]}}clearSelection(){this.selectedAtoms=[],this.updateSelectionVisuals()}getMeasurement(){if(!this.snapshot||this.selectedAtoms.length<2)return null;const t=this.getCurrentPositions(),i=this.selectedAtoms;if(i.length===2){const s=this.computeDistance(t,i[0],i[1]);return{atoms:[...i],type:"distance",value:s,label:`${s.toFixed(3)} Å`}}if(i.length===3){const s=this.computeAngle(t,i[0],i[1],i[2]);return{atoms:[...i],type:"angle",value:s,label:`${s.toFixed(1)}°`}}if(i.length===4){const s=this.computeDihedral(t,i[0],i[1],i[2],i[3]);return{atoms:[...i],type:"dihedral",value:s,label:`${s.toFixed(1)}°`}}return null}computeDistance(t,i,s){const l=t[s*3]-t[i*3],c=t[s*3+1]-t[i*3+1],h=t[s*3+2]-t[i*3+2];return Math.sqrt(l*l+c*c+h*h)}computeAngle(t,i,s,l){const c=t[i*3]-t[s*3],h=t[i*3+1]-t[s*3+1],d=t[i*3+2]-t[s*3+2],m=t[l*3]-t[s*3],p=t[l*3+1]-t[s*3+1],g=t[l*3+2]-t[s*3+2],_=c*m+h*p+d*g,S=Math.sqrt(c*c+h*h+d*d),E=Math.sqrt(m*m+p*p+g*g);return Math.acos(Math.max(-1,Math.min(1,_/(S*E))))*(180/Math.PI)}computeDihedral(t,i,s,l,c){const h=t[s*3]-t[i*3],d=t[s*3+1]-t[i*3+1],m=t[s*3+2]-t[i*3+2],p=t[l*3]-t[s*3],g=t[l*3+1]-t[s*3+1],_=t[l*3+2]-t[s*3+2],S=t[c*3]-t[l*3],E=t[c*3+1]-t[l*3+1],y=t[c*3+2]-t[l*3+2],T=d*_-m*g,A=m*p-h*_,v=h*g-d*p,U=g*y-_*E,D=_*S-p*y,O=p*E-g*S,H=Math.sqrt(p*p+g*g+_*_),B=p/H,P=g/H,V=_/H,L=A*V-v*P,C=v*B-T*V,z=T*P-A*B,nt=T*U+A*D+v*O,$=L*U+C*D+z*O;return Math.atan2($,nt)*(180/Math.PI)}updateSelectionVisuals(){for(;this.selectionGroup.children.length>0;){const s=this.selectionGroup.children[0];this.selectionGroup.remove(s),(s instanceof zn||s instanceof cp)&&(s.geometry.dispose(),Array.isArray(s.material)?s.material.forEach(l=>l.dispose()):s.material.dispose())}if(!this.snapshot||this.selectedAtoms.length===0)return;const t=this.getCurrentPositions(),i=this.snapshot.elements;for(const s of this.selectedAtoms){const l=Mu(i[s])*du*1.6,c=new Tu(l,16,16),h=new Cp({color:4359668,transparent:!0,opacity:.35,depthWrite:!1}),d=new zn(c,h);d.position.set(t[s*3],t[s*3+1],t[s*3+2]),this.selectionGroup.add(d)}if(this.selectedAtoms.length>=2){const s=this.selectedAtoms.map(d=>new K(t[d*3],t[d*3+1],t[d*3+2])),l=new ci().setFromPoints(s),c=new Lp({color:4359668,depthTest:!1}),h=new cp(l,c);h.renderOrder=999,this.selectionGroup.add(h)}}onResize(){var s;if(!this.container)return;const t=this.container.clientWidth,i=this.container.clientHeight;this.camera.aspect=t/i,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,i),(s=this.labelOverlay)==null||s.resize(t,i,Math.min(window.devicePixelRatio,2))}dispose(){this.animationId!==null&&cancelAnimationFrame(this.animationId),this.clearSelection(),this.atomRenderer&&this.atomRenderer.dispose(),this.bondRenderer&&this.bondRenderer.dispose(),this.cellRenderer&&this.cellRenderer.dispose(),this.labelOverlay&&this.labelOverlay.dispose(),this.controls.dispose(),this.renderer.dispose(),this.container&&this.renderer.domElement.parentNode&&this.container.removeChild(this.renderer.domElement)}}function qb({snapshot:r,frame:t,atomLabels:i,onRendererReady:s,onHover:l,onAtomRightClick:c,onFrameUpdated:h}){const d=pt.useRef(null),m=pt.useRef(null),p=pt.useRef(l),g=pt.useRef(c),_=pt.useRef(h);return p.current=l,g.current=c,_.current=h,pt.useEffect(()=>{if(!d.current)return;const S=new Wb;return S.mount(d.current),m.current=S,s==null||s(S),()=>{S.dispose(),m.current=null}},[]),pt.useEffect(()=>{const S=m.current,E=S==null?void 0:S.getCanvas();if(!E||!S)return;let y=null;const T=U=>{y===null&&(y=requestAnimationFrame(()=>{var O;const D=S.raycastAtPixel(U.clientX,U.clientY);(O=p.current)==null||O.call(p,D),y=null}))},A=U=>{var O;U.preventDefault();const D=S.raycastAtPixel(U.clientX,U.clientY);D&&D.kind==="atom"&&((O=g.current)==null||O.call(g,D.atomIndex))},v=()=>{var U;(U=p.current)==null||U.call(p,null)};return E.addEventListener("mousemove",T),E.addEventListener("contextmenu",A),E.addEventListener("mouseleave",v),()=>{E.removeEventListener("mousemove",T),E.removeEventListener("contextmenu",A),E.removeEventListener("mouseleave",v),y!==null&&cancelAnimationFrame(y)}},[]),pt.useEffect(()=>{r&&m.current&&m.current.loadSnapshot(r)},[r]),pt.useEffect(()=>{var S;t&&m.current&&(m.current.updateFrame(t),(S=_.current)==null||S.call(_))},[t]),pt.useEffect(()=>{var S;(S=m.current)==null||S.setLabels(i??null)},[i]),vt.jsx("div",{ref:d,style:{width:"100%",height:"100%",position:"relative",background:"#ffffff"}})}const ga={fontSize:10,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6},Au={background:"none",border:"1px solid #e2e8f0",borderRadius:5,padding:"2px 10px",cursor:"pointer",fontSize:11,fontWeight:500,color:"#64748b",transition:"all 0.15s"},Kb={...Au,background:"rgba(59, 130, 246, 0.08)",borderColor:"rgba(59, 130, 246, 0.25)",color:"#3b82f6"},ll={fontSize:13,fontWeight:600,color:"#1e293b",wordBreak:"break-all"},Zc={fontSize:11,color:"#94a3b8",marginTop:2},Md={fontSize:12,color:"#94a3b8",fontStyle:"italic"};function kv(r,t){const i=r.toLowerCase();return t.some(s=>i.endsWith(s))}function ru({accept:r,exts:t,onFile:i,label:s,children:l}){const c=pt.useRef(null),h=pt.useCallback(p=>{p.preventDefault(),p.stopPropagation();const _=Array.from(p.dataTransfer.files).find(S=>kv(S.name,t));_&&i(_)},[t,i]),d=pt.useCallback(p=>{p.preventDefault(),p.stopPropagation()},[]),m=pt.useCallback(p=>{const g=p.target.files;if(!g)return;const _=Array.from(g).find(S=>kv(S.name,t));_&&i(_),p.target.value=""},[t,i]);return vt.jsxs("div",{onDrop:h,onDragOver:d,style:{minHeight:0},children:[l,vt.jsx("button",{onClick:()=>{var p;return(p=c.current)==null?void 0:p.click()},style:{...Au,marginTop:6},children:s}),vt.jsx("input",{ref:c,type:"file",accept:r,onChange:m,style:{display:"none"}})]})}function gp({options:r,value:t,onChange:i,disabledOptions:s}){return vt.jsx("div",{style:{display:"flex",borderRadius:6,overflow:"hidden",border:"1px solid #e2e8f0",marginBottom:6},children:r.map((l,c)=>{const h=l.value===t,d=(s==null?void 0:s.has(l.value))??!1;return vt.jsx("button",{onClick:h||d?void 0:()=>i(l.value),style:{flex:1,background:h?"rgba(59,130,246,0.08)":"none",border:"none",borderRight:c<r.length-1?"1px solid #e2e8f0":"none",padding:"4px 0",cursor:h||d?"default":"pointer",fontSize:11,fontWeight:500,color:d?"#cbd5e1":h?"#3b82f6":"#94a3b8",transition:"all 0.15s"},disabled:d,children:l.label},l.value)})})}const jb=".pdb,.gro,.xyz,.mol,.sdf",Zb=[".pdb",".gro",".xyz",".mol",".sdf"],Qb=".pdb,.top",Jb=[".pdb",".top"];function $b({mode:r,onToggleMode:t,structure:i,bonds:s,trajectory:l,onUploadStructure:c,onResetView:h,hasCell:d,cellVisible:m,onToggleCell:p,collapsed:g,onToggleCollapse:_}){return g?vt.jsx("div",{style:{position:"absolute",top:12,left:12,zIndex:10},children:vt.jsxs("button",{onClick:_,style:{background:"rgba(255, 255, 255, 0.88)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(226,232,240,0.6)",borderRadius:10,padding:"8px 12px",cursor:"pointer",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:700,color:"#1e293b",letterSpacing:"-0.02em"},title:"Open sidebar",children:["megane",vt.jsx("span",{style:{fontSize:11,color:"#94a3b8",fontWeight:400},children:"▶"})]})}):vt.jsxs("div",{style:{position:"absolute",top:12,left:12,bottom:60,width:240,zIndex:10,background:"rgba(255, 255, 255, 0.92)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:12,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",border:"1px solid rgba(226,232,240,0.6)",display:"flex",flexDirection:"column",overflow:"hidden"},children:[vt.jsxs("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(226,232,240,0.6)",flexShrink:0},children:[vt.jsx("span",{style:{fontWeight:700,color:"#1e293b",fontSize:14,letterSpacing:"-0.02em"},children:"megane"}),vt.jsx("button",{onClick:_,style:{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#94a3b8",padding:"2px 4px"},title:"Collapse sidebar",children:"◀"})]}),vt.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"10px 14px",display:"flex",flexDirection:"column",gap:14},children:[vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Mode"}),vt.jsxs("div",{style:{display:"flex",borderRadius:6,overflow:"hidden",border:"1px solid #e2e8f0"},children:[vt.jsx("button",{onClick:r==="local"?void 0:t,style:{flex:1,background:r==="local"?"rgba(59,130,246,0.08)":"none",border:"none",borderRight:"1px solid #e2e8f0",padding:"4px 0",cursor:r==="local"?"default":"pointer",fontSize:12,fontWeight:500,color:r==="local"?"#3b82f6":"#94a3b8",transition:"all 0.15s"},children:"Local"}),vt.jsx("button",{onClick:r==="streaming"?void 0:t,style:{flex:1,background:r==="streaming"?"rgba(59,130,246,0.08)":"none",border:"none",padding:"4px 0",cursor:r==="streaming"?"default":"pointer",fontSize:12,fontWeight:500,color:r==="streaming"?"#3b82f6":"#94a3b8",transition:"all 0.15s"},children:"Stream"})]})]}),vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Structure"}),vt.jsx(ru,{accept:jb,exts:Zb,onFile:c,label:"Change...",children:i.fileName?vt.jsxs(vt.Fragment,{children:[vt.jsx("div",{style:ll,children:i.fileName}),i.atomCount>0&&vt.jsxs("div",{style:Zc,children:[i.atomCount.toLocaleString()," atoms"]})]}):vt.jsx("div",{style:Md,children:"No structure loaded"})})]}),vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Bonds"}),vt.jsx(gp,{options:[{value:"none",label:"None"},{value:"structure",label:"Structure"},{value:"file",label:"File"},{value:"distance",label:"Distance"}],value:s.source,onChange:s.onSourceChange}),s.source==="file"&&vt.jsx(ru,{accept:Qb,exts:Jb,onFile:s.onUploadFile,label:"Load PDB/TOP...",children:s.fileName&&vt.jsx("div",{style:ll,children:s.fileName})}),s.source!=="none"&&vt.jsxs("div",{style:Zc,children:[s.count.toLocaleString()," bonds"]})]}),vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Trajectory"}),vt.jsx(gp,{options:[{value:"structure",label:"Structure"},{value:"file",label:"File"}],value:l.source,onChange:l.onSourceChange,disabledOptions:new Set([...l.hasStructureFrames?[]:["structure"],...l.hasFileFrames?[]:["file"]])}),l.source==="file"&&vt.jsx(ru,{accept:".xtc",exts:[".xtc"],onFile:l.onUploadXtc,label:"Load XTC...",children:l.fileName?vt.jsxs(vt.Fragment,{children:[vt.jsx("div",{style:ll,children:l.fileName}),vt.jsxs("div",{style:Zc,children:[l.totalFrames.toLocaleString()," frames",l.timestepPs>0&&` · ${l.timestepPs.toFixed(1)} ps/frame`]})]}):vt.jsx("div",{style:Md,children:"No trajectory loaded"})}),l.source==="structure"&&(l.fileName?vt.jsxs(vt.Fragment,{children:[vt.jsx("div",{style:ll,children:l.fileName}),vt.jsxs("div",{style:Zc,children:[l.totalFrames.toLocaleString()," frames"]})]}):vt.jsx("div",{style:Md,children:"No multi-model data"}))]})]}),vt.jsxs("div",{style:{padding:"8px 14px",borderTop:"1px solid rgba(226,232,240,0.6)",display:"flex",gap:6,flexShrink:0},children:[vt.jsx("button",{onClick:h,style:Au,title:"Reset view",children:"Reset"}),d&&vt.jsx("button",{onClick:p,style:m?Kb:Au,title:"Toggle simulation cell",children:"Cell"})]})]})}const t2=".pdb,.gro,.xyz,.txt",e2=[".pdb",".gro",".xyz",".txt"],Qc={width:"100%",height:4,cursor:"pointer",appearance:"none",WebkitAppearance:"none",borderRadius:2,outline:"none"},Jc={fontSize:11,fontWeight:500,color:"#3b82f6",minWidth:36,textAlign:"right"};function n2({atomScale:r,onAtomScaleChange:t,atomOpacity:i,onAtomOpacityChange:s,bondScale:l,onBondScaleChange:c,bondOpacity:h,onBondOpacityChange:d,labels:m,collapsed:p,onToggleCollapse:g}){return p?vt.jsx("div",{style:{position:"absolute",top:12,right:12,zIndex:10},children:vt.jsxs("button",{onClick:g,style:{background:"rgba(255, 255, 255, 0.88)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(226,232,240,0.6)",borderRadius:10,padding:"8px 12px",cursor:"pointer",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600,color:"#1e293b",letterSpacing:"-0.02em"},title:"Open appearance panel",children:[vt.jsx("span",{style:{fontSize:11,color:"#94a3b8",fontWeight:400},children:"◀"}),"Appearance"]})}):vt.jsxs("div",{style:{position:"absolute",top:12,right:12,bottom:60,width:220,zIndex:10,background:"rgba(255, 255, 255, 0.92)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:12,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",border:"1px solid rgba(226,232,240,0.6)",display:"flex",flexDirection:"column",overflow:"hidden"},children:[vt.jsxs("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(226,232,240,0.6)",flexShrink:0},children:[vt.jsx("span",{style:{fontWeight:600,color:"#1e293b",fontSize:13,letterSpacing:"-0.02em"},children:"Appearance"}),vt.jsx("button",{onClick:g,style:{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#94a3b8",padding:"2px 4px"},title:"Collapse panel",children:"▶"})]}),vt.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"10px 14px",display:"flex",flexDirection:"column",gap:14},children:[vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Atom Radius"}),vt.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[vt.jsx("input",{type:"range",min:"0.1",max:"2.0",step:"0.01",value:r,onChange:_=>t(parseFloat(_.target.value)),style:Qc}),vt.jsx("span",{style:Jc,children:r.toFixed(2)})]})]}),vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Atom Opacity"}),vt.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[vt.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:i,onChange:_=>s(parseFloat(_.target.value)),style:Qc}),vt.jsxs("span",{style:Jc,children:[Math.round(i*100),"%"]})]})]}),vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Bond Thickness"}),vt.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[vt.jsx("input",{type:"range",min:"0.1",max:"3.0",step:"0.01",value:l,onChange:_=>c(parseFloat(_.target.value)),style:Qc}),vt.jsx("span",{style:Jc,children:l.toFixed(2)})]})]}),vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Bond Opacity"}),vt.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[vt.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:h,onChange:_=>d(parseFloat(_.target.value)),style:Qc}),vt.jsxs("span",{style:Jc,children:[Math.round(h*100),"%"]})]})]}),vt.jsxs("div",{children:[vt.jsx("div",{style:ga,children:"Labels"}),vt.jsx(gp,{options:[{value:"none",label:"None"},{value:"structure",label:"Structure"},{value:"file",label:"File"}],value:m.source,onChange:m.onSourceChange,disabledOptions:new Set([...m.hasStructureLabels?[]:["structure"]])}),m.source==="file"&&vt.jsx(ru,{accept:t2,exts:e2,onFile:m.onUploadFile,label:"Load labels...",children:m.fileName&&vt.jsx("div",{style:ll,children:m.fileName})})]})]})]})}function i2({currentFrame:r,totalFrames:t,playing:i,fps:s,onSeek:l,onPlayPause:c,onFpsChange:h}){return t<=1?null:vt.jsxs("div",{style:{position:"absolute",bottom:0,left:0,right:0,padding:"10px 20px 14px",background:"rgba(255, 255, 255, 0.88)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderTop:"1px solid rgba(226,232,240,0.6)",boxShadow:"0 -1px 8px rgba(0,0,0,0.04)",display:"flex",alignItems:"center",gap:12,zIndex:10,fontSize:13,color:"#64748b"},children:[vt.jsx("button",{onClick:c,style:{background:"none",border:"1px solid #e2e8f0",borderRadius:8,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:500,color:"#64748b",flexShrink:0,transition:"all 0.15s"},title:i?"Pause":"Play",children:i?"⏸":"▶"}),vt.jsxs("span",{style:{minWidth:80,textAlign:"center",fontVariantNumeric:"tabular-nums",fontWeight:500,color:"#64748b",flexShrink:0},children:[r+1," / ",t]}),vt.jsx("input",{type:"range",min:0,max:t-1,value:r,onChange:d=>l(parseInt(d.target.value,10)),style:{flex:1,height:4,cursor:"pointer",accentColor:"#3b82f6"}}),vt.jsxs("select",{value:s,onChange:d=>h(parseInt(d.target.value,10)),style:{background:"rgba(255,255,255,0.8)",border:"1px solid #e2e8f0",borderRadius:6,padding:"2px 6px",fontSize:12,fontWeight:500,color:"#64748b",cursor:"pointer",flexShrink:0},children:[vt.jsx("option",{value:10,children:"10 fps"}),vt.jsx("option",{value:20,children:"20 fps"}),vt.jsx("option",{value:30,children:"30 fps"}),vt.jsx("option",{value:60,children:"60 fps"})]})]})}function a2({info:r}){if(!r)return null;const t={position:"fixed",left:r.screenX+14,top:r.screenY-14,background:"rgba(15, 23, 42, 0.92)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:"#fff",padding:"8px 12px",borderRadius:8,fontSize:12,fontFamily:"system-ui, -apple-system, monospace",pointerEvents:"none",zIndex:100,whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(0,0,0,0.2)"};return r.kind==="atom"?vt.jsxs("div",{style:t,children:[vt.jsxs("div",{style:{fontWeight:600},children:[r.elementSymbol," (#",r.atomIndex,")"]}),vt.jsxs("div",{style:{opacity:.7,fontSize:11},children:["(",r.position[0].toFixed(2),", ",r.position[1].toFixed(2),","," ",r.position[2].toFixed(2),") ","Å"]})]}):vt.jsxs("div",{style:t,children:[vt.jsx("div",{style:{fontWeight:600},children:Up(0)?`Atom ${r.atomA} — Atom ${r.atomB}`:`${r.atomA} — ${r.atomB}`}),vt.jsxs("div",{style:{opacity:.7,fontSize:11},children:[wb[r.bondOrder]??"Bond"," |"," ",r.bondLength.toFixed(2)," ","Å"]})]})}const s2={distance:"Distance",angle:"Angle",dihedral:"Dihedral"};function r2({selection:r,measurement:t,elements:i,onClear:s}){return r.atoms.length===0?null:vt.jsxs("div",{style:{position:"absolute",bottom:60,right:12,background:"rgba(255, 255, 255, 0.92)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderRadius:10,padding:"12px 16px",fontSize:13,color:"#1e293b",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",border:"1px solid rgba(226,232,240,0.6)",zIndex:15,minWidth:180},children:[vt.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6},children:[vt.jsx("strong",{style:{letterSpacing:"-0.01em"},children:"Selection"}),vt.jsx("button",{onClick:s,style:{background:"none",border:"none",cursor:"pointer",color:"#3b82f6",fontSize:12,fontWeight:500,padding:"2px 4px"},children:"Clear"})]}),vt.jsx("div",{style:{marginBottom:6,fontSize:12,color:"#64748b"},children:r.atoms.map((l,c)=>vt.jsxs("span",{children:[c>0&&" — ",vt.jsx("strong",{children:i?Up(i[l]):"?"}),l]},l))}),t&&vt.jsxs("div",{style:{padding:"6px 0",borderTop:"1px solid #e2e8f0",fontSize:14,fontWeight:600,color:"#3b82f6"},children:[s2[t.type],": ",t.label]}),vt.jsx("div",{style:{fontSize:11,color:"#94a3b8",marginTop:4},children:"Right-click atoms to select (max 4)"})]})}function o2({snapshot:r,frame:t=null,currentFrame:i=0,totalFrames:s=0,playing:l=!1,fps:c=30,onSeek:h,onPlayPause:d,onFpsChange:m,onUploadStructure:p,mode:g,onToggleMode:_,pdbFileName:S,bonds:E,trajectory:y,labels:T,atomLabels:A,width:v="100%",height:U="100%"}){const D=pt.useRef(null),[O,H]=pt.useState(!0),[B,P]=pt.useState(null),[V,L]=pt.useState({atoms:[]}),[C,z]=pt.useState(null),[nt,$]=pt.useState(!1),[ct,ft]=pt.useState(!1),[I,k]=pt.useState(1),[q,_t]=pt.useState(1),[Tt,N]=pt.useState(1),[J,ht]=pt.useState(1),Y=pt.useCallback(It=>{D.current=It},[]),lt=pt.useCallback(()=>{var It;(It=D.current)==null||It.resetView()},[]),yt=pt.useCallback(()=>{H(It=>{var Te;const Dt=!It;return(Te=D.current)==null||Te.setCellVisible(Dt),Dt})},[]),At=pt.useCallback(It=>{if(!D.current)return;const Dt=D.current.toggleAtomSelection(It);L(Dt),z(D.current.getMeasurement())},[]),Vt=pt.useCallback(()=>{var It;(It=D.current)==null||It.clearSelection(),L({atoms:[]}),z(null)},[]),Ht=pt.useCallback(()=>{if(!D.current)return;const It=D.current.getMeasurement();It&&z(It)},[]),te=pt.useCallback(()=>{$(It=>!It)},[]),Ce=pt.useCallback(()=>{ft(It=>!It)},[]),fe=pt.useCallback(It=>{var Dt;k(It),(Dt=D.current)==null||Dt.setAtomScale(It)},[]),Be=pt.useCallback(It=>{var Dt;_t(It),(Dt=D.current)==null||Dt.setAtomOpacity(It)},[]),G=pt.useCallback(It=>{var Dt;N(It),(Dt=D.current)==null||Dt.setBondScale(It)},[]),sn=pt.useCallback(It=>{var Dt;ht(It),(Dt=D.current)==null||Dt.setBondOpacity(It)},[]);pt.useEffect(()=>{var It;(It=D.current)==null||It.setBondsVisible(E.source!=="none")},[E.source]);const le=(r==null?void 0:r.box)!=null&&r.box.some(It=>It!==0);return vt.jsxs("div",{style:{width:v,height:U,position:"relative",overflow:"hidden"},children:[vt.jsx(qb,{snapshot:r,frame:t,atomLabels:A,onRendererReady:Y,onHover:P,onAtomRightClick:At,onFrameUpdated:Ht}),vt.jsx($b,{mode:g,onToggleMode:_,structure:{atomCount:(r==null?void 0:r.nAtoms)??0,fileName:S},bonds:E,trajectory:y,onUploadStructure:p,onResetView:lt,hasCell:le,cellVisible:O,onToggleCell:yt,collapsed:nt,onToggleCollapse:te}),vt.jsx(n2,{atomScale:I,onAtomScaleChange:fe,atomOpacity:q,onAtomOpacityChange:Be,bondScale:Tt,onBondScaleChange:G,bondOpacity:J,onBondOpacityChange:sn,labels:T,collapsed:ct,onToggleCollapse:Ce}),h&&d&&m&&vt.jsx(i2,{currentFrame:i,totalFrames:s,playing:l,fps:c,onSeek:h,onPlayPause:d,onFpsChange:m}),vt.jsx(a2,{info:B}),vt.jsx(r2,{selection:V,measurement:C,elements:(r==null?void 0:r.elements)??null,onClear:Vt})]})}const Xv=1e3,l2=3e4;class c2{constructor(t,i,s){Bt(this,"ws",null);Bt(this,"onMessage");Bt(this,"onStatus");Bt(this,"url");Bt(this,"shouldReconnect",!1);Bt(this,"reconnectDelay",Xv);Bt(this,"reconnectTimer",null);this.url=t,this.onMessage=i,this.onStatus=s??null}connect(){this.shouldReconnect=!0,this._connect()}_connect(){this.ws||(this.ws=new WebSocket(this.url),this.ws.binaryType="arraybuffer",this.ws.onopen=()=>{var t;this.reconnectDelay=Xv,(t=this.onStatus)==null||t.call(this,!0)},this.ws.onmessage=t=>{t.data instanceof ArrayBuffer&&this.onMessage(t.data)},this.ws.onerror=t=>{console.error("[megane] WebSocket error:",t)},this.ws.onclose=()=>{var t;this.ws=null,(t=this.onStatus)==null||t.call(this,!1),this._scheduleReconnect()})}_scheduleReconnect(){this.shouldReconnect&&(this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this._connect()},this.reconnectDelay),this.reconnectDelay=Math.min(this.reconnectDelay*2,l2))}send(t){this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(t))}disconnect(){this.shouldReconnect=!1,this.reconnectTimer!==null&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.ws&&(this.ws.close(),this.ws=null)}get connected(){return this.ws!==null&&this.ws.readyState===WebSocket.OPEN}}const Yv=1313293645,u2=0,f2=1,h2=2,d2=1,p2=2;function m2(r){const t=new DataView(r),i=t.getUint32(0,!0);if(i!==Yv)throw new Error(`Invalid magic: 0x${i.toString(16)}, expected 0x${Yv.toString(16)}`);return{msgType:t.getUint8(4),flags:t.getUint8(5)}}function g2(r){const t=new DataView(r),i=t.getUint8(5);let s=8;const l=t.getUint32(s,!0);s+=4;const c=t.getUint32(s,!0);s+=4;const h=new Float32Array(r,s,l*3);s+=l*3*4;const d=new Uint8Array(r,s,l);s+=l,s+=(4-s%4)%4;const m=new Uint32Array(r,s,c*2);s+=c*2*4;let p=null;i&d2&&(p=new Uint8Array(r,s,c),s+=c,s+=(4-s%4)%4);let g=null;return i&p2&&(g=new Float32Array(r,s,9),s+=36),{nAtoms:l,nBonds:c,nFileBonds:c,positions:h,elements:d,bonds:m,bondOrders:p,box:g}}function _2(r){const t=new DataView(r);let i=8;const s=t.getUint32(i,!0);i+=4;const l=t.getUint32(i,!0);i+=4;const c=new Float32Array(r,i,l*3);return{frameId:s,nAtoms:l,positions:c}}function v2(r){const t=new DataView(r),i=8,s=t.getUint32(i,!0),l=t.getFloat32(i+4,!0),c=t.getUint32(i+8,!0);let h,d;if(r.byteLength>20){const m=new TextDecoder;let p=20;const g=t.getUint16(p,!0);p+=2,g>0&&(h=m.decode(new Uint8Array(r,p,g))),p+=g;const _=t.getUint16(p,!0);p+=2,_>0&&(d=m.decode(new Uint8Array(r,p,_)))}return{nFrames:s,timestepPs:l,nAtoms:c,pdbName:h,xtcName:d}}const S2="modulepreload",M2=function(r){return"/"+r},Wv={},L1=function(t,i,s){let l=Promise.resolve();if(i&&i.length>0){let h=function(p){return Promise.all(p.map(g=>Promise.resolve(g).then(_=>({status:"fulfilled",value:_}),_=>({status:"rejected",reason:_}))))};document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),m=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));l=h(i.map(p=>{if(p=M2(p),p in Wv)return;Wv[p]=!0;const g=p.endsWith(".css"),_=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${_}`))return;const S=document.createElement("link");if(S.rel=g?"stylesheet":S2,g||(S.as="script"),S.crossOrigin="",S.href=p,m&&S.setAttribute("nonce",m),document.head.appendChild(S),g)return new Promise((E,y)=>{S.addEventListener("load",E),S.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${p}`)))})}))}function c(h){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=h,window.dispatchEvent(d),!d.defaultPrevented)throw h}return l.then(h=>{for(const d of h||[])d.status==="rejected"&&c(d.reason);return t().catch(c)})};let Ad=null,Di=null;async function to(){Di||(Ad||(Ad=(async()=>{const r=await L1(()=>import("./megane_pdb_wasm-C6jPrYzk.js"),[]);await r.default(),Di={parse_pdb:r.parse_pdb,parse_gro:r.parse_gro,parse_xyz:r.parse_xyz,parse_mol:r.parse_mol,infer_bonds_vdw:r.infer_bonds_vdw,parse_top_bonds:r.parse_top_bonds,parse_pdb_bonds:r.parse_pdb_bonds,extract_labels:r.extract_labels}})()),await Ad)}function A2(r){switch(r){case".gro":return Di.parse_gro;case".xyz":return Di.parse_xyz;case".mol":case".sdf":return Di.parse_mol;default:return Di.parse_pdb}}async function E2(r){return await to(),w1(Di.parse_pdb,r)}async function y2(r){var l;await to();const t=await r.text(),i=((l=r.name.toLowerCase().match(/\.[^.]+$/))==null?void 0:l[0])??".pdb",s=A2(i);return w1(s,t)}function w1(r,t){const i=r(t),s={nAtoms:i.n_atoms,nBonds:i.n_bonds,nFileBonds:i.n_file_bonds,positions:i.positions(),elements:i.elements(),bonds:i.bonds(),bondOrders:i.bond_orders(),box:i.has_box?i.box_matrix():null},l=[];if(i.n_frames>0){const d=i.frame_data(),m=i.n_atoms*3;for(let p=0;p<i.n_frames;p++)l.push({frameId:p+1,nAtoms:i.n_atoms,positions:d.slice(p*m,(p+1)*m)})}const c=i.has_atom_labels?i.atom_labels.split(`
`):null;i.free();const h=l.length>0?{nFrames:l.length+1,timestepPs:1,nAtoms:s.nAtoms}:null;return{snapshot:s,frames:l,meta:h,labels:c}}async function x2(r,t,i){return await to(),Di.infer_bonds_vdw(r,t,i)}async function T2(r,t){return await to(),Di.parse_top_bonds(r,t)}async function R2(r,t){return await to(),Di.parse_pdb_bonds(r,t)}async function b2(r,t){var c;const i=await r.text(),s=((c=r.name.toLowerCase().match(/\.[^.]+$/))==null?void 0:c[0])??"";let l;if(s===".txt")l=i.split(`
`).map(h=>h.trim());else{await to();const h=s===".gro"?"gro":s===".xyz"?"xyz":"pdb",d=Di.extract_labels(i,h);l=d?d.split(`
`):[]}for(l.length>t&&(l=l.slice(0,t));l.length<t;)l.push("");return l}function cl(r,t,i){return{...r,nBonds:t.length/2,bonds:t,bondOrders:i}}async function D1(r,t){const i=t.baseSnapshot;if(!i||r==="none")return null;switch(r){case"structure":return i;case"file":return t.fileBonds?cl(i,t.fileBonds,null):cl(i,new Uint32Array(0),null);case"distance":return t.vdwBonds||(t.vdwBonds=await x2(i.positions,i.elements,i.nAtoms)),cl(i,t.vdwBonds,null)}}async function N1(r,t){var c;const i=await r.text(),s=((c=r.name.toLowerCase().match(/\.[^.]+$/))==null?void 0:c[0])??"";let l;return s===".top"?l=await T2(i,t):l=await R2(i,t),{bonds:l,fileName:r.name}}function U1(r,t,i){switch(r){case"none":return null;case"structure":return t.structureLabels?t.structureLabels:Array.from({length:i},(s,l)=>String(l+1));case"file":return t.fileLabels}}async function P1(r,t){return{labels:await b2(r,t),fileName:r.name}}function C2(r){const[t,i]=pt.useState(null),[s,l]=pt.useState(null),[c,h]=pt.useState(null),[d,m]=pt.useState(!1),[p,g]=pt.useState(0),[_,S]=pt.useState("structure"),[E,y]=pt.useState("file"),[T,A]=pt.useState(null),[v,U]=pt.useState(!1),[D,O]=pt.useState("none"),[H,B]=pt.useState(null),[P,V]=pt.useState(null),L=pt.useRef(null),C=pt.useRef(0),z=pt.useRef(null),nt=pt.useRef(null),$=pt.useRef(null),ct=pt.useRef(null),ft=pt.useCallback(async(J,ht)=>{const Y=await D1(J,{baseSnapshot:ht,fileBonds:nt.current,vdwBonds:$.current});J==="distance"&&Y&&($.current=Y.bonds),Y&&i(Y)},[]);pt.useEffect(()=>{if(!r)return;const J=new c2(r,ht=>{const{msgType:Y}=m2(ht);if(Y===u2){const lt=g2(ht);z.current=lt,U(lt.nFileBonds>0),nt.current=null,$.current=null,A(null),S("structure"),ct.current=null,B(null),O("none"),V(null),i(lt)}else if(Y===f2){const lt=_2(ht);l(lt),g(lt.frameId),C.current=lt.frameId}else Y===h2&&h(v2(ht))},m);return J.connect(),L.current=J,()=>{J.disconnect()}},[r]);const I=pt.useCallback(async J=>{S(J);const ht=z.current;ht&&await ft(J,ht)},[ft]),k=pt.useCallback(J=>{y(J)},[]),q=pt.useCallback(async J=>{const ht=z.current;if(!ht)return;const{bonds:Y,fileName:lt}=await N1(J,ht.nAtoms);nt.current=Y,A(lt),S("file"),i(cl(ht,Y,null))},[]),_t=pt.useCallback(J=>{O(J);const ht=z.current;if(!ht){V(null);return}const Y=U1(J,{structureLabels:null,fileLabels:ct.current},ht.nAtoms);V(Y)},[]),Tt=pt.useCallback(async J=>{const ht=z.current;if(!ht)return;const{labels:Y,fileName:lt}=await P1(J,ht.nAtoms);ct.current=Y,B(lt),O("file"),V(Y)},[]),N=c!=null&&c.nFrames>0;return{snapshot:t,frame:s,meta:c,connected:d,currentFrame:p,setCurrentFrame:g,currentFrameRef:C,clientRef:L,bondSource:_,setBondSource:I,trajectorySource:E,setTrajectorySource:k,loadBondFile:q,bondFileName:T,hasStructureBonds:v,hasStructureFrames:!1,hasFileFrames:N,labelSource:D,setLabelSource:_t,loadLabelFile:Tt,labelFileName:H,hasStructureLabels:!1,atomLabels:P}}let Ed=null,_p=null;async function O2(){_p||(Ed||(Ed=(async()=>{const r=await L1(()=>import("./megane_pdb_wasm-C6jPrYzk.js"),[]);await r.default(),_p=r.parse_xtc_file})()),await Ed)}async function L2(r,t){await O2();const i=await r.arrayBuffer(),s=new Uint8Array(i),l=_p(s);if(l.n_atoms!==t){const p=`XTC atom count (${l.n_atoms}) does not match structure (${t})`;throw l.free(),new Error(p)}const c=l.frame_data(),h=l.n_atoms*3,d=[];for(let p=0;p<l.n_frames;p++)d.push({frameId:p,nAtoms:l.n_atoms,positions:c.slice(p*h,(p+1)*h)});const m={nFrames:l.n_frames,timestepPs:l.timestep_ps,nAtoms:l.n_atoms};return l.free(),{frames:d,meta:m}}function w2(){const[r,t]=pt.useState(null),[i,s]=pt.useState(null),[l,c]=pt.useState(null),[h,d]=pt.useState(0),[m,p]=pt.useState(null),[g,_]=pt.useState(null),[S,E]=pt.useState("structure"),[y,T]=pt.useState("structure"),[A,v]=pt.useState(null),[U,D]=pt.useState(!1),[O,H]=pt.useState(!1),[B,P]=pt.useState(!1),[V,L]=pt.useState("none"),[C,z]=pt.useState(null),[nt,$]=pt.useState(!1),[ct,ft]=pt.useState(null),I=pt.useRef(0),k=pt.useRef([]),q=pt.useRef([]),_t=pt.useRef(null),Tt=pt.useRef(null),N=pt.useRef(null),J=pt.useRef(null),ht=pt.useRef(null),Y=pt.useRef("structure"),lt=pt.useRef(null),yt=pt.useRef(null),At=pt.useCallback(()=>{s(null),d(0),I.current=0},[]),Vt=pt.useCallback(async xt=>{const w=await D1(xt,{baseSnapshot:_t.current,fileBonds:Tt.current,vdwBonds:N.current});xt==="distance"&&w&&(N.current=w.bonds),w&&t(w)},[]),Ht=pt.useCallback(xt=>{const w=_t.current;if(w)if(xt==="file"){const x=ht.current;x&&q.current.length>0?c(x):c(null)}else k.current.length>0?c({nFrames:k.current.length+1,timestepPs:1,nAtoms:w.nAtoms}):c(null)},[]),te=pt.useCallback(xt=>{_t.current=xt.snapshot,k.current=xt.frames,q.current=[],Tt.current=null,N.current=null,ht.current=null,J.current=null,v(null),lt.current=xt.labels,yt.current=null,z(null),$(xt.labels!=null),L("none"),ft(null),D(xt.snapshot.nFileBonds>0),H(xt.frames.length>0),P(!1),Y.current="structure",E("structure"),T("structure"),t(xt.snapshot),c(xt.meta),At()},[At]),Ce=pt.useCallback(async xt=>{const w=await y2(xt);te(w),p(xt.name),_(w.meta?"PDB models":null)},[te]),fe=pt.useCallback(async xt=>{const w=await E2(xt);te(w),p("1crn.pdb"),_(w.meta?"PDB models":null)},[te]),Be=pt.useCallback(async xt=>{if(!_t.current)throw new Error("Load a structure before loading a trajectory");const{frames:w,meta:x}=await L2(xt,_t.current.nAtoms);q.current=w,ht.current=x,J.current=xt.name,P(!0),Y.current="file",T("file"),c(x),At(),_(xt.name)},[At]),G=pt.useCallback(xt=>{const w=Y.current==="file"?q.current:k.current;if(xt===0)_t.current&&s({frameId:0,nAtoms:_t.current.nAtoms,positions:_t.current.positions});else{const x=w[xt-1];x&&s(x)}d(xt),I.current=xt},[]),sn=pt.useCallback(async xt=>{E(xt),await Vt(xt)},[Vt]),le=pt.useCallback(xt=>{Y.current=xt,T(xt),Ht(xt),At(),_(xt==="file"?J.current:k.current.length>0?"PDB models":null)},[Ht,At]),It=pt.useCallback(async xt=>{const w=_t.current;if(!w)return;const{bonds:x,fileName:it}=await N1(xt,w.nAtoms);Tt.current=x,v(it),E("file"),t(cl(w,x,null))},[]),Dt=pt.useCallback(xt=>{L(xt);const w=_t.current;if(!w){ft(null);return}const x=U1(xt,{structureLabels:lt.current,fileLabels:yt.current},w.nAtoms);ft(x)},[]),Te=pt.useCallback(async xt=>{const w=_t.current;if(!w)return;const{labels:x,fileName:it}=await P1(xt,w.nAtoms);yt.current=x,z(it),L("file"),ft(x)},[]);return{snapshot:r,frame:i,meta:l,connected:!0,currentFrame:h,currentFrameRef:I,pdbFileName:m,xtcFileName:g,loadFile:Ce,loadText:fe,loadXtc:Be,seekFrame:G,bondSource:S,setBondSource:sn,trajectorySource:y,setTrajectorySource:le,loadBondFile:It,bondFileName:A,hasStructureBonds:U,hasStructureFrames:O,hasFileFrames:B,labelSource:V,setLabelSource:Dt,loadLabelFile:Te,labelFileName:C,hasStructureLabels:nt,atomLabels:ct}}const D2=`HEADER    PLANT PROTEIN                           30-APR-81   1CRN              
TITLE     WATER STRUCTURE OF A HYDROPHOBIC PROTEIN AT ATOMIC RESOLUTION.        
TITLE    2 PENTAGON RINGS OF WATER MOLECULES IN CRYSTALS OF CRAMBIN             
COMPND    MOL_ID: 1;                                                            
COMPND   2 MOLECULE: CRAMBIN;                                                   
COMPND   3 CHAIN: A;                                                            
COMPND   4 ENGINEERED: YES                                                      
SOURCE    MOL_ID: 1;                                                            
SOURCE   2 ORGANISM_SCIENTIFIC: CRAMBE HISPANICA SUBSP. ABYSSINICA;             
SOURCE   3 ORGANISM_TAXID: 3721;                                                
SOURCE   4 STRAIN: SUBSP. ABYSSINICA                                            
KEYWDS    PLANT SEED PROTEIN, PLANT PROTEIN                                     
EXPDTA    X-RAY DIFFRACTION                                                     
AUTHOR    W.A.HENDRICKSON,M.M.TEETER                                            
REVDAT   9   30-OCT-24 1CRN    1       REMARK                                   
REVDAT   8   29-NOV-17 1CRN    1       HELIX                                    
REVDAT   7   11-JUL-12 1CRN    1       SCALE1 VERSN  HEADER                     
REVDAT   6   24-FEB-09 1CRN    1       VERSN                                    
REVDAT   5   16-APR-87 1CRN    1       HEADER                                   
REVDAT   4   04-MAR-85 1CRN    1       REMARK                                   
REVDAT   3   30-SEP-83 1CRN    1       REVDAT                                   
REVDAT   2   03-DEC-81 1CRN    1       SHEET                                    
REVDAT   1   28-JUL-81 1CRN    0                                                
JRNL        AUTH   M.M.TEETER                                                   
JRNL        TITL   WATER STRUCTURE OF A HYDROPHOBIC PROTEIN AT ATOMIC           
JRNL        TITL 2 RESOLUTION: PENTAGON RINGS OF WATER MOLECULES IN CRYSTALS OF 
JRNL        TITL 3 CRAMBIN.                                                     
JRNL        REF    PROC.NATL.ACAD.SCI.USA        V.  81  6014 1984              
JRNL        REFN                   ISSN 0027-8424                               
JRNL        PMID   16593516                                                     
JRNL        DOI    10.1073/PNAS.81.19.6014                                      
REMARK   1                                                                      
REMARK   1 REFERENCE 1                                                          
REMARK   1  AUTH   W.A.HENDRICKSON,M.M.TEETER                                   
REMARK   1  TITL   STRUCTURE OF THE HYDROPHOBIC PROTEIN CRAMBIN DETERMINED      
REMARK   1  TITL 2 DIRECTLY FROM THE ANOMALOUS SCATTERING OF SULPHUR            
REMARK   1  REF    NATURE                        V. 290   107 1981              
REMARK   1  REFN                   ISSN 0028-0836                               
REMARK   1 REFERENCE 2                                                          
REMARK   1  AUTH   M.M.TEETER,W.A.HENDRICKSON                                   
REMARK   1  TITL   HIGHLY ORDERED CRYSTALS OF THE PLANT SEED PROTEIN CRAMBIN    
REMARK   1  REF    J.MOL.BIOL.                   V. 127   219 1979              
REMARK   1  REFN                   ISSN 0022-2836                               
REMARK   2                                                                      
REMARK   2 RESOLUTION.    1.50 ANGSTROMS.                                       
REMARK   3                                                                      
REMARK   3 REFINEMENT.                                                          
REMARK   3   PROGRAM     : PROLSQ                                               
REMARK   3   AUTHORS     : KONNERT,HENDRICKSON                                  
REMARK   3                                                                      
REMARK   3  DATA USED IN REFINEMENT.                                            
REMARK   3   RESOLUTION RANGE HIGH (ANGSTROMS) : 1.50                           
REMARK   3   RESOLUTION RANGE LOW  (ANGSTROMS) : NULL                           
REMARK   3   DATA CUTOFF            (SIGMA(F)) : NULL                           
REMARK   3   COMPLETENESS FOR RANGE        (%) : NULL                           
REMARK   3   NUMBER OF REFLECTIONS             : NULL                           
REMARK   3                                                                      
REMARK   3  FIT TO DATA USED IN REFINEMENT.                                     
REMARK   3   CROSS-VALIDATION METHOD          : NULL                            
REMARK   3   FREE R VALUE TEST SET SELECTION  : NULL                            
REMARK   3   R VALUE     (WORKING + TEST SET) : NULL                            
REMARK   3   R VALUE            (WORKING SET) : NULL                            
REMARK   3   FREE R VALUE                     : NULL                            
REMARK   3   FREE R VALUE TEST SET SIZE   (%) : NULL                            
REMARK   3   FREE R VALUE TEST SET COUNT      : NULL                            
REMARK   3                                                                      
REMARK   3  FIT/AGREEMENT OF MODEL WITH ALL DATA.                               
REMARK   3   R VALUE   (WORKING + TEST SET, NO CUTOFF) : NULL                   
REMARK   3   R VALUE          (WORKING SET, NO CUTOFF) : NULL                   
REMARK   3   FREE R VALUE                  (NO CUTOFF) : NULL                   
REMARK   3   FREE R VALUE TEST SET SIZE (%, NO CUTOFF) : NULL                   
REMARK   3   FREE R VALUE TEST SET COUNT   (NO CUTOFF) : NULL                   
REMARK   3   TOTAL NUMBER OF REFLECTIONS   (NO CUTOFF) : NULL                   
REMARK   3                                                                      
REMARK   3  NUMBER OF NON-HYDROGEN ATOMS USED IN REFINEMENT.                    
REMARK   3   PROTEIN ATOMS            : 327                                     
REMARK   3   NUCLEIC ACID ATOMS       : 0                                       
REMARK   3   HETEROGEN ATOMS          : 0                                       
REMARK   3   SOLVENT ATOMS            : 0                                       
REMARK   3                                                                      
REMARK   3  B VALUES.                                                           
REMARK   3   FROM WILSON PLOT           (A**2) : NULL                           
REMARK   3   MEAN B VALUE      (OVERALL, A**2) : NULL                           
REMARK   3   OVERALL ANISOTROPIC B VALUE.                                       
REMARK   3    B11 (A**2) : NULL                                                 
REMARK   3    B22 (A**2) : NULL                                                 
REMARK   3    B33 (A**2) : NULL                                                 
REMARK   3    B12 (A**2) : NULL                                                 
REMARK   3    B13 (A**2) : NULL                                                 
REMARK   3    B23 (A**2) : NULL                                                 
REMARK   3                                                                      
REMARK   3  ESTIMATED COORDINATE ERROR.                                         
REMARK   3   ESD FROM LUZZATI PLOT        (A) : NULL                            
REMARK   3   ESD FROM SIGMAA              (A) : NULL                            
REMARK   3   LOW RESOLUTION CUTOFF        (A) : NULL                            
REMARK   3                                                                      
REMARK   3  RMS DEVIATIONS FROM IDEAL VALUES.                                   
REMARK   3   DISTANCE RESTRAINTS.                    RMS    SIGMA               
REMARK   3    BOND LENGTH                     (A) : NULL  ; NULL                
REMARK   3    ANGLE DISTANCE                  (A) : NULL  ; NULL                
REMARK   3    INTRAPLANAR 1-4 DISTANCE        (A) : NULL  ; NULL                
REMARK   3    H-BOND OR METAL COORDINATION    (A) : NULL  ; NULL                
REMARK   3                                                                      
REMARK   3   PLANE RESTRAINT                  (A) : NULL  ; NULL                
REMARK   3   CHIRAL-CENTER RESTRAINT       (A**3) : NULL  ; NULL                
REMARK   3                                                                      
REMARK   3   NON-BONDED CONTACT RESTRAINTS.                                     
REMARK   3    SINGLE TORSION                  (A) : NULL  ; NULL                
REMARK   3    MULTIPLE TORSION                (A) : NULL  ; NULL                
REMARK   3    H-BOND (X...Y)                  (A) : NULL  ; NULL                
REMARK   3    H-BOND (X-H...Y)                (A) : NULL  ; NULL                
REMARK   3                                                                      
REMARK   3   CONFORMATIONAL TORSION ANGLE RESTRAINTS.                           
REMARK   3    SPECIFIED                 (DEGREES) : NULL  ; NULL                
REMARK   3    PLANAR                    (DEGREES) : NULL  ; NULL                
REMARK   3    STAGGERED                 (DEGREES) : NULL  ; NULL                
REMARK   3    TRANSVERSE                (DEGREES) : NULL  ; NULL                
REMARK   3                                                                      
REMARK   3  ISOTROPIC THERMAL FACTOR RESTRAINTS.    RMS    SIGMA                
REMARK   3   MAIN-CHAIN BOND               (A**2) : NULL  ; NULL                
REMARK   3   MAIN-CHAIN ANGLE              (A**2) : NULL  ; NULL                
REMARK   3   SIDE-CHAIN BOND               (A**2) : NULL  ; NULL                
REMARK   3   SIDE-CHAIN ANGLE              (A**2) : NULL  ; NULL                
REMARK   3                                                                      
REMARK   3  OTHER REFINEMENT REMARKS: NULL                                      
REMARK   4                                                                      
REMARK   4 1CRN COMPLIES WITH FORMAT V. 3.30, 13-JUL-11                         
REMARK 100                                                                      
REMARK 100 THIS ENTRY HAS BEEN PROCESSED BY BNL.                                
REMARK 100 THE DEPOSITION ID IS D_1000172485.                                   
REMARK 200                                                                      
REMARK 200 EXPERIMENTAL DETAILS                                                 
REMARK 200  EXPERIMENT TYPE                : X-RAY DIFFRACTION                  
REMARK 200  DATE OF DATA COLLECTION        : NULL                               
REMARK 200  TEMPERATURE           (KELVIN) : NULL                               
REMARK 200  PH                             : NULL                               
REMARK 200  NUMBER OF CRYSTALS USED        : NULL                               
REMARK 200                                                                      
REMARK 200  SYNCHROTRON              (Y/N) : NULL                               
REMARK 200  RADIATION SOURCE               : NULL                               
REMARK 200  BEAMLINE                       : NULL                               
REMARK 200  X-RAY GENERATOR MODEL          : NULL                               
REMARK 200  MONOCHROMATIC OR LAUE    (M/L) : NULL                               
REMARK 200  WAVELENGTH OR RANGE        (A) : NULL                               
REMARK 200  MONOCHROMATOR                  : NULL                               
REMARK 200  OPTICS                         : NULL                               
REMARK 200                                                                      
REMARK 200  DETECTOR TYPE                  : NULL                               
REMARK 200  DETECTOR MANUFACTURER          : NULL                               
REMARK 200  INTENSITY-INTEGRATION SOFTWARE : NULL                               
REMARK 200  DATA SCALING SOFTWARE          : NULL                               
REMARK 200                                                                      
REMARK 200  NUMBER OF UNIQUE REFLECTIONS   : NULL                               
REMARK 200  RESOLUTION RANGE HIGH      (A) : NULL                               
REMARK 200  RESOLUTION RANGE LOW       (A) : NULL                               
REMARK 200  REJECTION CRITERIA  (SIGMA(I)) : NULL                               
REMARK 200                                                                      
REMARK 200 OVERALL.                                                             
REMARK 200  COMPLETENESS FOR RANGE     (%) : NULL                               
REMARK 200  DATA REDUNDANCY                : NULL                               
REMARK 200  R MERGE                    (I) : NULL                               
REMARK 200  R SYM                      (I) : NULL                               
REMARK 200  <I/SIGMA(I)> FOR THE DATA SET  : NULL                               
REMARK 200                                                                      
REMARK 200 IN THE HIGHEST RESOLUTION SHELL.                                     
REMARK 200  HIGHEST RESOLUTION SHELL, RANGE HIGH (A) : NULL                     
REMARK 200  HIGHEST RESOLUTION SHELL, RANGE LOW  (A) : NULL                     
REMARK 200  COMPLETENESS FOR SHELL     (%) : NULL                               
REMARK 200  DATA REDUNDANCY IN SHELL       : NULL                               
REMARK 200  R MERGE FOR SHELL          (I) : NULL                               
REMARK 200  R SYM FOR SHELL            (I) : NULL                               
REMARK 200  <I/SIGMA(I)> FOR SHELL         : NULL                               
REMARK 200                                                                      
REMARK 200 DIFFRACTION PROTOCOL: NULL                                           
REMARK 200 METHOD USED TO DETERMINE THE STRUCTURE: NULL                         
REMARK 200 SOFTWARE USED: NULL                                                  
REMARK 200 STARTING MODEL: NULL                                                 
REMARK 200                                                                      
REMARK 200 REMARK: NULL                                                         
REMARK 280                                                                      
REMARK 280 CRYSTAL                                                              
REMARK 280 SOLVENT CONTENT, VS   (%): 32.16                                     
REMARK 280 MATTHEWS COEFFICIENT, VM (ANGSTROMS**3/DA): 1.81                     
REMARK 280                                                                      
REMARK 280 CRYSTALLIZATION CONDITIONS: NULL                                     
REMARK 290                                                                      
REMARK 290 CRYSTALLOGRAPHIC SYMMETRY                                            
REMARK 290 SYMMETRY OPERATORS FOR SPACE GROUP: P 1 21 1                         
REMARK 290                                                                      
REMARK 290      SYMOP   SYMMETRY                                                
REMARK 290     NNNMMM   OPERATOR                                                
REMARK 290       1555   X,Y,Z                                                   
REMARK 290       2555   -X,Y+1/2,-Z                                             
REMARK 290                                                                      
REMARK 290     WHERE NNN -> OPERATOR NUMBER                                     
REMARK 290           MMM -> TRANSLATION VECTOR                                  
REMARK 290                                                                      
REMARK 290 CRYSTALLOGRAPHIC SYMMETRY TRANSFORMATIONS                            
REMARK 290 THE FOLLOWING TRANSFORMATIONS OPERATE ON THE ATOM/HETATM             
REMARK 290 RECORDS IN THIS ENTRY TO PRODUCE CRYSTALLOGRAPHICALLY                
REMARK 290 RELATED MOLECULES.                                                   
REMARK 290   SMTRY1   1  1.000000  0.000000  0.000000        0.00000            
REMARK 290   SMTRY2   1  0.000000  1.000000  0.000000        0.00000            
REMARK 290   SMTRY3   1  0.000000  0.000000  1.000000        0.00000            
REMARK 290   SMTRY1   2 -1.000000  0.000000  0.000000        0.00000            
REMARK 290   SMTRY2   2  0.000000  1.000000  0.000000        9.32500            
REMARK 290   SMTRY3   2  0.000000  0.000000 -1.000000        0.00000            
REMARK 290                                                                      
REMARK 290 REMARK: NULL                                                         
REMARK 300                                                                      
REMARK 300 BIOMOLECULE: 1                                                       
REMARK 300 SEE REMARK 350 FOR THE AUTHOR PROVIDED AND/OR PROGRAM                
REMARK 300 GENERATED ASSEMBLY INFORMATION FOR THE STRUCTURE IN                  
REMARK 300 THIS ENTRY. THE REMARK MAY ALSO PROVIDE INFORMATION ON               
REMARK 300 BURIED SURFACE AREA.                                                 
REMARK 350                                                                      
REMARK 350 COORDINATES FOR A COMPLETE MULTIMER REPRESENTING THE KNOWN           
REMARK 350 BIOLOGICALLY SIGNIFICANT OLIGOMERIZATION STATE OF THE                
REMARK 350 MOLECULE CAN BE GENERATED BY APPLYING BIOMT TRANSFORMATIONS          
REMARK 350 GIVEN BELOW.  BOTH NON-CRYSTALLOGRAPHIC AND                          
REMARK 350 CRYSTALLOGRAPHIC OPERATIONS ARE GIVEN.                               
REMARK 350                                                                      
REMARK 350 BIOMOLECULE: 1                                                       
REMARK 350 AUTHOR DETERMINED BIOLOGICAL UNIT: MONOMERIC                         
REMARK 350 APPLY THE FOLLOWING TO CHAINS: A                                     
REMARK 350   BIOMT1   1  1.000000  0.000000  0.000000        0.00000            
REMARK 350   BIOMT2   1  0.000000  1.000000  0.000000        0.00000            
REMARK 350   BIOMT3   1  0.000000  0.000000  1.000000        0.00000            
REMARK 400                                                                      
REMARK 400 COMPOUND                                                             
REMARK 400 THE SECONDARY STRUCTURE SPECIFICATIONS ARE THOSE DEFINED             
REMARK 400 IN REFERENCE 1 ABOVE AND DEPEND ON PARTICULAR DEFINITIONS            
REMARK 400 THAT MAY AFFECT THE DETERMINATION OF END POINTS.  PLEASE             
REMARK 400 CONSULT THE PRIMARY REFERENCE AND EXAMINE STRUCTURAL                 
REMARK 400 DETAILS SUCH AS HYDROGEN BONDING AND CONFORMATION ANGLES             
REMARK 400 WHEN MAKING USE OF THE SPECIFICATIONS.                               
REMARK 500                                                                      
REMARK 500 GEOMETRY AND STEREOCHEMISTRY                                         
REMARK 500 SUBTOPIC: COVALENT BOND ANGLES                                       
REMARK 500                                                                      
REMARK 500 THE STEREOCHEMICAL PARAMETERS OF THE FOLLOWING RESIDUES              
REMARK 500 HAVE VALUES WHICH DEVIATE FROM EXPECTED VALUES BY MORE               
REMARK 500 THAN 6*RMSD (M=MODEL NUMBER; RES=RESIDUE NAME; C=CHAIN               
REMARK 500 IDENTIFIER; SSEQ=SEQUENCE NUMBER; I=INSERTION CODE).                 
REMARK 500                                                                      
REMARK 500 STANDARD TABLE:                                                      
REMARK 500 FORMAT: (10X,I3,1X,A3,1X,A1,I4,A1,3(1X,A4,2X),12X,F5.1)              
REMARK 500                                                                      
REMARK 500 EXPECTED VALUES PROTEIN: ENGH AND HUBER, 1999                        
REMARK 500 EXPECTED VALUES NUCLEIC ACID: CLOWNEY ET AL 1996                     
REMARK 500                                                                      
REMARK 500  M RES CSSEQI ATM1   ATM2   ATM3                                     
REMARK 500    ARG A  10   NE  -  CZ  -  NH2 ANGL. DEV. =  -3.6 DEGREES          
REMARK 500    TYR A  29   CB  -  CG  -  CD1 ANGL. DEV. =  -4.7 DEGREES          
REMARK 500                                                                      
REMARK 500 REMARK: NULL                                                         
DBREF  1CRN A    1    46  UNP    P01542   CRAM_CRAAB       1     46             
SEQRES   1 A   46  THR THR CYS CYS PRO SER ILE VAL ALA ARG SER ASN PHE          
SEQRES   2 A   46  ASN VAL CYS ARG LEU PRO GLY THR PRO GLU ALA ILE CYS          
SEQRES   3 A   46  ALA THR TYR THR GLY CYS ILE ILE ILE PRO GLY ALA THR          
SEQRES   4 A   46  CYS PRO GLY ASP TYR ALA ASN                                  
HELIX    1  H1 ILE A    7  PRO A   19  13/10 CONFORMATION RES 17,19       13    
HELIX    2  H2 GLU A   23  THR A   30  1DISTORTED 3/10 AT RES 30           8    
SHEET    1  S1 2 THR A   1  CYS A   4  0                                        
SHEET    2  S1 2 CYS A  32  ILE A  35 -1                                        
SSBOND   1 CYS A    3    CYS A   40                          1555   1555  2.00  
SSBOND   2 CYS A    4    CYS A   32                          1555   1555  2.04  
SSBOND   3 CYS A   16    CYS A   26                          1555   1555  2.05  
CRYST1   40.960   18.650   22.520  90.00  90.77  90.00 P 1 21 1      2          
ORIGX1      1.000000  0.000000  0.000000        0.00000                         
ORIGX2      0.000000  1.000000  0.000000        0.00000                         
ORIGX3      0.000000  0.000000  1.000000        0.00000                         
SCALE1      0.024414  0.000000  0.000328        0.00000                         
SCALE2      0.000000  0.053619  0.000000        0.00000                         
SCALE3      0.000000  0.000000  0.044409        0.00000                         
ATOM      1  N   THR A   1      17.047  14.099   3.625  1.00 13.79           N  
ATOM      2  CA  THR A   1      16.967  12.784   4.338  1.00 10.80           C  
ATOM      3  C   THR A   1      15.685  12.755   5.133  1.00  9.19           C  
ATOM      4  O   THR A   1      15.268  13.825   5.594  1.00  9.85           O  
ATOM      5  CB  THR A   1      18.170  12.703   5.337  1.00 13.02           C  
ATOM      6  OG1 THR A   1      19.334  12.829   4.463  1.00 15.06           O  
ATOM      7  CG2 THR A   1      18.150  11.546   6.304  1.00 14.23           C  
ATOM      8  N   THR A   2      15.115  11.555   5.265  1.00  7.81           N  
ATOM      9  CA  THR A   2      13.856  11.469   6.066  1.00  8.31           C  
ATOM     10  C   THR A   2      14.164  10.785   7.379  1.00  5.80           C  
ATOM     11  O   THR A   2      14.993   9.862   7.443  1.00  6.94           O  
ATOM     12  CB  THR A   2      12.732  10.711   5.261  1.00 10.32           C  
ATOM     13  OG1 THR A   2      13.308   9.439   4.926  1.00 12.81           O  
ATOM     14  CG2 THR A   2      12.484  11.442   3.895  1.00 11.90           C  
ATOM     15  N   CYS A   3      13.488  11.241   8.417  1.00  5.24           N  
ATOM     16  CA  CYS A   3      13.660  10.707   9.787  1.00  5.39           C  
ATOM     17  C   CYS A   3      12.269  10.431  10.323  1.00  4.45           C  
ATOM     18  O   CYS A   3      11.393  11.308  10.185  1.00  6.54           O  
ATOM     19  CB  CYS A   3      14.368  11.748  10.691  1.00  5.99           C  
ATOM     20  SG  CYS A   3      15.885  12.426  10.016  1.00  7.01           S  
ATOM     21  N   CYS A   4      12.019   9.272  10.928  1.00  3.90           N  
ATOM     22  CA  CYS A   4      10.646   8.991  11.408  1.00  4.24           C  
ATOM     23  C   CYS A   4      10.654   8.793  12.919  1.00  3.72           C  
ATOM     24  O   CYS A   4      11.659   8.296  13.491  1.00  5.30           O  
ATOM     25  CB  CYS A   4      10.057   7.752  10.682  1.00  4.41           C  
ATOM     26  SG  CYS A   4       9.837   8.018   8.904  1.00  4.72           S  
ATOM     27  N   PRO A   5       9.561   9.108  13.563  1.00  3.96           N  
ATOM     28  CA  PRO A   5       9.448   9.034  15.012  1.00  4.25           C  
ATOM     29  C   PRO A   5       9.288   7.670  15.606  1.00  4.96           C  
ATOM     30  O   PRO A   5       9.490   7.519  16.819  1.00  7.44           O  
ATOM     31  CB  PRO A   5       8.230   9.957  15.345  1.00  5.11           C  
ATOM     32  CG  PRO A   5       7.338   9.786  14.114  1.00  5.24           C  
ATOM     33  CD  PRO A   5       8.366   9.804  12.958  1.00  5.20           C  
ATOM     34  N   SER A   6       8.875   6.686  14.796  1.00  4.83           N  
ATOM     35  CA  SER A   6       8.673   5.314  15.279  1.00  4.45           C  
ATOM     36  C   SER A   6       8.753   4.376  14.083  1.00  4.99           C  
ATOM     37  O   SER A   6       8.726   4.858  12.923  1.00  4.61           O  
ATOM     38  CB  SER A   6       7.340   5.121  15.996  1.00  5.05           C  
ATOM     39  OG  SER A   6       6.274   5.220  15.031  1.00  6.39           O  
ATOM     40  N   ILE A   7       8.881   3.075  14.358  1.00  4.94           N  
ATOM     41  CA  ILE A   7       8.912   2.083  13.258  1.00  6.33           C  
ATOM     42  C   ILE A   7       7.581   2.090  12.506  1.00  5.32           C  
ATOM     43  O   ILE A   7       7.670   2.031  11.245  1.00  6.85           O  
ATOM     44  CB  ILE A   7       9.207   0.677  13.924  1.00  8.43           C  
ATOM     45  CG1 ILE A   7      10.714   0.702  14.312  1.00  9.78           C  
ATOM     46  CG2 ILE A   7       8.811  -0.477  12.969  1.00 11.70           C  
ATOM     47  CD1 ILE A   7      11.185  -0.516  15.142  1.00  9.92           C  
ATOM     48  N   VAL A   8       6.458   2.162  13.159  1.00  5.02           N  
ATOM     49  CA  VAL A   8       5.145   2.209  12.453  1.00  6.93           C  
ATOM     50  C   VAL A   8       5.115   3.379  11.461  1.00  5.39           C  
ATOM     51  O   VAL A   8       4.664   3.268  10.343  1.00  6.30           O  
ATOM     52  CB  VAL A   8       3.995   2.354  13.478  1.00  9.64           C  
ATOM     53  CG1 VAL A   8       2.716   2.891  12.869  1.00 13.85           C  
ATOM     54  CG2 VAL A   8       3.758   1.032  14.208  1.00 11.97           C  
ATOM     55  N   ALA A   9       5.606   4.546  11.941  1.00  3.73           N  
ATOM     56  CA  ALA A   9       5.598   5.767  11.082  1.00  3.56           C  
ATOM     57  C   ALA A   9       6.441   5.527   9.850  1.00  4.13           C  
ATOM     58  O   ALA A   9       6.052   5.933   8.744  1.00  4.36           O  
ATOM     59  CB  ALA A   9       6.022   6.977  11.891  1.00  4.80           C  
ATOM     60  N   ARG A  10       7.647   4.909  10.005  1.00  3.73           N  
ATOM     61  CA  ARG A  10       8.496   4.609   8.837  1.00  3.38           C  
ATOM     62  C   ARG A  10       7.798   3.609   7.876  1.00  3.47           C  
ATOM     63  O   ARG A  10       7.878   3.778   6.651  1.00  4.67           O  
ATOM     64  CB  ARG A  10       9.847   4.020   9.305  1.00  3.95           C  
ATOM     65  CG  ARG A  10      10.752   3.607   8.149  1.00  4.55           C  
ATOM     66  CD  ARG A  10      11.226   4.699   7.244  1.00  5.89           C  
ATOM     67  NE  ARG A  10      12.143   5.571   8.035  1.00  6.20           N  
ATOM     68  CZ  ARG A  10      12.758   6.609   7.443  1.00  7.52           C  
ATOM     69  NH1 ARG A  10      12.539   6.932   6.158  1.00 10.68           N  
ATOM     70  NH2 ARG A  10      13.601   7.322   8.202  1.00  9.48           N  
ATOM     71  N   SER A  11       7.186   2.582   8.445  1.00  5.19           N  
ATOM     72  CA  SER A  11       6.500   1.584   7.565  1.00  4.60           C  
ATOM     73  C   SER A  11       5.382   2.313   6.773  1.00  4.84           C  
ATOM     74  O   SER A  11       5.213   2.016   5.557  1.00  5.84           O  
ATOM     75  CB  SER A  11       5.908   0.462   8.400  1.00  5.91           C  
ATOM     76  OG  SER A  11       6.990  -0.272   9.012  1.00  8.38           O  
ATOM     77  N   ASN A  12       4.648   3.182   7.446  1.00  3.54           N  
ATOM     78  CA  ASN A  12       3.545   3.935   6.751  1.00  4.57           C  
ATOM     79  C   ASN A  12       4.107   4.851   5.691  1.00  4.14           C  
ATOM     80  O   ASN A  12       3.536   5.001   4.617  1.00  5.52           O  
ATOM     81  CB  ASN A  12       2.663   4.677   7.748  1.00  6.42           C  
ATOM     82  CG  ASN A  12       1.802   3.735   8.610  1.00  8.25           C  
ATOM     83  OD1 ASN A  12       1.567   2.613   8.165  1.00 12.72           O  
ATOM     84  ND2 ASN A  12       1.394   4.252   9.767  1.00  9.92           N  
ATOM     85  N   PHE A  13       5.259   5.498   6.005  1.00  3.43           N  
ATOM     86  CA  PHE A  13       5.929   6.358   5.055  1.00  3.49           C  
ATOM     87  C   PHE A  13       6.304   5.578   3.799  1.00  3.40           C  
ATOM     88  O   PHE A  13       6.136   6.072   2.653  1.00  4.07           O  
ATOM     89  CB  PHE A  13       7.183   6.994   5.754  1.00  5.48           C  
ATOM     90  CG  PHE A  13       7.884   8.006   4.883  1.00  5.57           C  
ATOM     91  CD1 PHE A  13       8.906   7.586   4.027  1.00  6.99           C  
ATOM     92  CD2 PHE A  13       7.532   9.373   4.983  1.00  6.52           C  
ATOM     93  CE1 PHE A  13       9.560   8.539   3.194  1.00  8.20           C  
ATOM     94  CE2 PHE A  13       8.176  10.281   4.145  1.00  6.34           C  
ATOM     95  CZ  PHE A  13       9.141   9.845   3.292  1.00  6.84           C  
ATOM     96  N   ASN A  14       6.900   4.390   3.989  1.00  3.64           N  
ATOM     97  CA  ASN A  14       7.331   3.607   2.791  1.00  4.31           C  
ATOM     98  C   ASN A  14       6.116   3.210   1.915  1.00  3.98           C  
ATOM     99  O   ASN A  14       6.240   3.144   0.684  1.00  6.22           O  
ATOM    100  CB  ASN A  14       8.145   2.404   3.240  1.00  5.81           C  
ATOM    101  CG  ASN A  14       9.555   2.856   3.730  1.00  6.82           C  
ATOM    102  OD1 ASN A  14      10.013   3.895   3.323  1.00  9.43           O  
ATOM    103  ND2 ASN A  14      10.120   1.956   4.539  1.00  8.21           N  
ATOM    104  N   VAL A  15       4.993   2.927   2.571  1.00  3.76           N  
ATOM    105  CA  VAL A  15       3.782   2.599   1.742  1.00  3.98           C  
ATOM    106  C   VAL A  15       3.296   3.871   1.004  1.00  3.80           C  
ATOM    107  O   VAL A  15       2.947   3.817  -0.189  1.00  4.85           O  
ATOM    108  CB  VAL A  15       2.698   1.953   2.608  1.00  4.71           C  
ATOM    109  CG1 VAL A  15       1.384   1.826   1.806  1.00  6.67           C  
ATOM    110  CG2 VAL A  15       3.174   0.533   3.005  1.00  6.26           C  
ATOM    111  N   CYS A  16       3.321   4.987   1.720  1.00  3.79           N  
ATOM    112  CA  CYS A  16       2.890   6.285   1.126  1.00  3.54           C  
ATOM    113  C   CYS A  16       3.687   6.597  -0.111  1.00  3.48           C  
ATOM    114  O   CYS A  16       3.200   7.147  -1.103  1.00  4.63           O  
ATOM    115  CB  CYS A  16       3.039   7.369   2.240  1.00  4.58           C  
ATOM    116  SG  CYS A  16       2.559   9.014   1.649  1.00  5.66           S  
ATOM    117  N   ARG A  17       4.997   6.227  -0.100  1.00  3.99           N  
ATOM    118  CA  ARG A  17       5.895   6.489  -1.213  1.00  3.83           C  
ATOM    119  C   ARG A  17       5.738   5.560  -2.409  1.00  3.79           C  
ATOM    120  O   ARG A  17       6.228   5.901  -3.507  1.00  5.39           O  
ATOM    121  CB  ARG A  17       7.370   6.507  -0.731  1.00  4.11           C  
ATOM    122  CG  ARG A  17       7.717   7.687   0.206  1.00  4.69           C  
ATOM    123  CD  ARG A  17       7.949   8.947  -0.615  1.00  5.10           C  
ATOM    124  NE  ARG A  17       9.212   8.856  -1.337  1.00  4.71           N  
ATOM    125  CZ  ARG A  17       9.537   9.533  -2.431  1.00  5.28           C  
ATOM    126  NH1 ARG A  17       8.659  10.350  -3.032  1.00  6.67           N  
ATOM    127  NH2 ARG A  17      10.793   9.491  -2.899  1.00  6.41           N  
ATOM    128  N   LEU A  18       5.051   4.411  -2.204  1.00  4.70           N  
ATOM    129  CA  LEU A  18       4.933   3.431  -3.326  1.00  5.46           C  
ATOM    130  C   LEU A  18       4.397   4.014  -4.620  1.00  5.13           C  
ATOM    131  O   LEU A  18       4.988   3.755  -5.687  1.00  5.55           O  
ATOM    132  CB  LEU A  18       4.196   2.184  -2.863  1.00  6.47           C  
ATOM    133  CG  LEU A  18       4.960   1.178  -1.991  1.00  7.43           C  
ATOM    134  CD1 LEU A  18       3.907   0.097  -1.634  1.00  8.70           C  
ATOM    135  CD2 LEU A  18       6.129   0.606  -2.768  1.00  9.39           C  
ATOM    136  N   PRO A  19       3.329   4.795  -4.543  1.00  4.28           N  
ATOM    137  CA  PRO A  19       2.792   5.376  -5.797  1.00  5.38           C  
ATOM    138  C   PRO A  19       3.573   6.540  -6.322  1.00  6.30           C  
ATOM    139  O   PRO A  19       3.260   7.045  -7.422  1.00  9.62           O  
ATOM    140  CB  PRO A  19       1.358   5.766  -5.472  1.00  5.87           C  
ATOM    141  CG  PRO A  19       1.223   5.694  -3.993  1.00  6.47           C  
ATOM    142  CD  PRO A  19       2.421   4.941  -3.408  1.00  6.45           C  
ATOM    143  N   GLY A  20       4.565   7.047  -5.559  1.00  4.94           N  
ATOM    144  CA  GLY A  20       5.366   8.191  -6.018  1.00  5.39           C  
ATOM    145  C   GLY A  20       5.007   9.481  -5.280  1.00  5.03           C  
ATOM    146  O   GLY A  20       5.535  10.510  -5.730  1.00  7.34           O  
ATOM    147  N   THR A  21       4.181   9.438  -4.262  1.00  4.10           N  
ATOM    148  CA  THR A  21       3.767  10.609  -3.513  1.00  3.94           C  
ATOM    149  C   THR A  21       5.017  11.397  -3.042  1.00  3.96           C  
ATOM    150  O   THR A  21       5.947  10.757  -2.523  1.00  5.82           O  
ATOM    151  CB  THR A  21       2.992  10.188  -2.225  1.00  4.13           C  
ATOM    152  OG1 THR A  21       2.051   9.144  -2.623  1.00  5.45           O  
ATOM    153  CG2 THR A  21       2.260  11.349  -1.551  1.00  5.41           C  
ATOM    154  N   PRO A  22       4.971  12.703  -3.176  1.00  5.04           N  
ATOM    155  CA  PRO A  22       6.143  13.513  -2.696  1.00  4.69           C  
ATOM    156  C   PRO A  22       6.400  13.233  -1.225  1.00  4.19           C  
ATOM    157  O   PRO A  22       5.485  13.061  -0.382  1.00  4.47           O  
ATOM    158  CB  PRO A  22       5.703  14.969  -2.920  1.00  7.12           C  
ATOM    159  CG  PRO A  22       4.676  14.893  -3.996  1.00  7.03           C  
ATOM    160  CD  PRO A  22       3.964  13.567  -3.811  1.00  4.90           C  
ATOM    161  N   GLU A  23       7.728  13.297  -0.921  1.00  5.16           N  
ATOM    162  CA  GLU A  23       8.114  13.103   0.500  1.00  5.31           C  
ATOM    163  C   GLU A  23       7.427  14.073   1.410  1.00  4.11           C  
ATOM    164  O   GLU A  23       7.036  13.682   2.540  1.00  5.11           O  
ATOM    165  CB  GLU A  23       9.648  13.285   0.660  1.00  6.16           C  
ATOM    166  CG  GLU A  23      10.440  12.093   0.063  1.00  7.48           C  
ATOM    167  CD  GLU A  23      11.941  12.170   0.391  1.00  9.40           C  
ATOM    168  OE1 GLU A  23      12.416  13.225   0.681  1.00 10.40           O  
ATOM    169  OE2 GLU A  23      12.539  11.070   0.292  1.00 13.32           O  
ATOM    170  N   ALA A  24       7.212  15.334   0.966  1.00  4.56           N  
ATOM    171  CA  ALA A  24       6.614  16.317   1.913  1.00  4.49           C  
ATOM    172  C   ALA A  24       5.212  15.936   2.350  1.00  4.10           C  
ATOM    173  O   ALA A  24       4.782  16.166   3.495  1.00  5.64           O  
ATOM    174  CB  ALA A  24       6.605  17.695   1.246  1.00  5.80           C  
ATOM    175  N   ILE A  25       4.445  15.318   1.405  1.00  4.37           N  
ATOM    176  CA  ILE A  25       3.074  14.894   1.756  1.00  5.44           C  
ATOM    177  C   ILE A  25       3.085  13.643   2.645  1.00  4.32           C  
ATOM    178  O   ILE A  25       2.315  13.523   3.578  1.00  4.72           O  
ATOM    179  CB  ILE A  25       2.204  14.637   0.462  1.00  6.42           C  
ATOM    180  CG1 ILE A  25       1.815  16.048  -0.129  1.00  7.50           C  
ATOM    181  CG2 ILE A  25       0.903  13.864   0.811  1.00  7.65           C  
ATOM    182  CD1 ILE A  25       0.756  16.761   0.757  1.00  7.80           C  
ATOM    183  N   CYS A  26       4.032  12.764   2.313  1.00  3.92           N  
ATOM    184  CA  CYS A  26       4.180  11.549   3.187  1.00  4.37           C  
ATOM    185  C   CYS A  26       4.632  11.944   4.596  1.00  3.95           C  
ATOM    186  O   CYS A  26       4.227  11.252   5.547  1.00  4.74           O  
ATOM    187  CB  CYS A  26       5.038  10.518   2.539  1.00  4.63           C  
ATOM    188  SG  CYS A  26       4.349   9.794   1.022  1.00  5.61           S  
ATOM    189  N   ALA A  27       5.408  13.012   4.694  1.00  3.89           N  
ATOM    190  CA  ALA A  27       5.879  13.502   6.026  1.00  4.43           C  
ATOM    191  C   ALA A  27       4.696  13.908   6.882  1.00  4.26           C  
ATOM    192  O   ALA A  27       4.528  13.422   8.025  1.00  5.44           O  
ATOM    193  CB  ALA A  27       6.880  14.615   5.830  1.00  5.36           C  
ATOM    194  N   THR A  28       3.827  14.802   6.358  1.00  4.53           N  
ATOM    195  CA  THR A  28       2.691  15.221   7.194  1.00  5.08           C  
ATOM    196  C   THR A  28       1.672  14.132   7.434  1.00  4.62           C  
ATOM    197  O   THR A  28       0.947  14.112   8.468  1.00  7.80           O  
ATOM    198  CB  THR A  28       1.986  16.520   6.614  1.00  6.03           C  
ATOM    199  OG1 THR A  28       1.664  16.221   5.230  1.00  7.19           O  
ATOM    200  CG2 THR A  28       2.914  17.739   6.700  1.00  7.34           C  
ATOM    201  N   TYR A  29       1.621  13.190   6.511  1.00  5.01           N  
ATOM    202  CA  TYR A  29       0.715  12.045   6.657  1.00  6.60           C  
ATOM    203  C   TYR A  29       1.125  11.125   7.815  1.00  4.92           C  
ATOM    204  O   TYR A  29       0.286  10.632   8.545  1.00  7.13           O  
ATOM    205  CB  TYR A  29       0.755  11.229   5.322  1.00  9.66           C  
ATOM    206  CG  TYR A  29      -0.203  10.044   5.354  1.00 11.56           C  
ATOM    207  CD1 TYR A  29      -1.547  10.337   5.645  1.00 12.85           C  
ATOM    208  CD2 TYR A  29       0.193   8.750   5.100  1.00 14.44           C  
ATOM    209  CE1 TYR A  29      -2.496   9.329   5.673  1.00 16.61           C  
ATOM    210  CE2 TYR A  29      -0.801   7.705   5.156  1.00 17.11           C  
ATOM    211  CZ  TYR A  29      -2.079   8.031   5.430  1.00 19.99           C  
ATOM    212  OH  TYR A  29      -3.097   7.057   5.458  1.00 28.98           O  
ATOM    213  N   THR A  30       2.470  10.984   7.995  1.00  5.31           N  
ATOM    214  CA  THR A  30       2.986   9.994   8.950  1.00  5.70           C  
ATOM    215  C   THR A  30       3.609  10.505  10.230  1.00  6.28           C  
ATOM    216  O   THR A  30       3.766   9.715  11.186  1.00  8.77           O  
ATOM    217  CB  THR A  30       4.076   9.103   8.225  1.00  6.55           C  
ATOM    218  OG1 THR A  30       5.125  10.027   7.824  1.00  6.57           O  
ATOM    219  CG2 THR A  30       3.493   8.324   7.035  1.00  7.29           C  
ATOM    220  N   GLY A  31       3.984  11.764  10.241  1.00  4.99           N  
ATOM    221  CA  GLY A  31       4.769  12.336  11.360  1.00  5.50           C  
ATOM    222  C   GLY A  31       6.255  12.243  11.106  1.00  4.19           C  
ATOM    223  O   GLY A  31       7.037  12.750  11.954  1.00  6.12           O  
ATOM    224  N   CYS A  32       6.710  11.631   9.992  1.00  4.30           N  
ATOM    225  CA  CYS A  32       8.140  11.694   9.635  1.00  4.89           C  
ATOM    226  C   CYS A  32       8.500  13.141   9.206  1.00  5.50           C  
ATOM    227  O   CYS A  32       7.581  13.949   8.944  1.00  5.82           O  
ATOM    228  CB  CYS A  32       8.504  10.686   8.530  1.00  4.66           C  
ATOM    229  SG  CYS A  32       8.048   8.987   8.881  1.00  5.33           S  
ATOM    230  N   ILE A  33       9.793  13.410   9.173  1.00  6.02           N  
ATOM    231  CA  ILE A  33      10.280  14.760   8.823  1.00  5.24           C  
ATOM    232  C   ILE A  33      11.346  14.658   7.743  1.00  5.16           C  
ATOM    233  O   ILE A  33      11.971  13.583   7.552  1.00  7.19           O  
ATOM    234  CB  ILE A  33      10.790  15.535  10.085  1.00  5.49           C  
ATOM    235  CG1 ILE A  33      12.059  14.803  10.671  1.00  6.85           C  
ATOM    236  CG2 ILE A  33       9.684  15.686  11.138  1.00  6.45           C  
ATOM    237  CD1 ILE A  33      12.733  15.676  11.781  1.00  8.94           C  
ATOM    238  N   ILE A  34      11.490  15.773   7.038  1.00  5.52           N  
ATOM    239  CA  ILE A  34      12.552  15.877   6.036  1.00  6.82           C  
ATOM    240  C   ILE A  34      13.590  16.917   6.560  1.00  6.92           C  
ATOM    241  O   ILE A  34      13.168  18.006   6.945  1.00  9.22           O  
ATOM    242  CB  ILE A  34      11.987  16.360   4.681  1.00  8.11           C  
ATOM    243  CG1 ILE A  34      10.914  15.338   4.163  1.00  9.59           C  
ATOM    244  CG2 ILE A  34      13.131  16.517   3.629  1.00  9.73           C  
ATOM    245  CD1 ILE A  34      10.151  16.024   2.938  1.00 13.41           C  
ATOM    246  N   ILE A  35      14.856  16.493   6.536  1.00  7.06           N  
ATOM    247  CA  ILE A  35      15.930  17.454   6.941  1.00  7.52           C  
ATOM    248  C   ILE A  35      16.913  17.550   5.819  1.00  6.63           C  
ATOM    249  O   ILE A  35      17.097  16.660   4.970  1.00  7.90           O  
ATOM    250  CB  ILE A  35      16.622  16.995   8.285  1.00  8.07           C  
ATOM    251  CG1 ILE A  35      17.360  15.651   8.067  1.00  9.41           C  
ATOM    252  CG2 ILE A  35      15.592  16.974   9.434  1.00  9.46           C  
ATOM    253  CD1 ILE A  35      18.298  15.206   9.219  1.00  9.85           C  
ATOM    254  N   PRO A  36      17.664  18.669   5.806  1.00  8.07           N  
ATOM    255  CA  PRO A  36      18.635  18.861   4.738  1.00  8.78           C  
ATOM    256  C   PRO A  36      19.925  18.042   4.949  1.00  8.31           C  
ATOM    257  O   PRO A  36      20.593  17.742   3.945  1.00  9.09           O  
ATOM    258  CB  PRO A  36      18.945  20.364   4.783  1.00  9.67           C  
ATOM    259  CG  PRO A  36      18.238  20.937   5.908  1.00 10.15           C  
ATOM    260  CD  PRO A  36      17.371  19.900   6.596  1.00  9.53           C  
ATOM    261  N   GLY A  37      20.172  17.730   6.217  1.00  8.48           N  
ATOM    262  CA  GLY A  37      21.452  16.969   6.513  1.00  9.20           C  
ATOM    263  C   GLY A  37      21.143  15.478   6.427  1.00 10.41           C  
ATOM    264  O   GLY A  37      20.138  15.023   5.878  1.00 12.06           O  
ATOM    265  N   ALA A  38      22.055  14.701   7.032  1.00  9.24           N  
ATOM    266  CA  ALA A  38      22.019  13.242   7.020  1.00  9.24           C  
ATOM    267  C   ALA A  38      21.944  12.628   8.396  1.00  9.60           C  
ATOM    268  O   ALA A  38      21.869  11.387   8.435  1.00 13.65           O  
ATOM    269  CB  ALA A  38      23.246  12.697   6.275  1.00 10.43           C  
ATOM    270  N   THR A  39      21.894  13.435   9.436  1.00  8.70           N  
ATOM    271  CA  THR A  39      21.936  12.911  10.809  1.00  9.46           C  
ATOM    272  C   THR A  39      20.615  13.191  11.521  1.00  8.32           C  
ATOM    273  O   THR A  39      20.357  14.317  11.948  1.00  9.89           O  
ATOM    274  CB  THR A  39      23.131  13.601  11.593  1.00 10.72           C  
ATOM    275  OG1 THR A  39      24.284  13.401  10.709  1.00 11.66           O  
ATOM    276  CG2 THR A  39      23.340  12.935  12.962  1.00 11.81           C  
ATOM    277  N   CYS A  40      19.827  12.110  11.642  1.00  7.64           N  
ATOM    278  CA  CYS A  40      18.504  12.312  12.298  1.00  8.05           C  
ATOM    279  C   CYS A  40      18.684  12.451  13.784  1.00  7.63           C  
ATOM    280  O   CYS A  40      19.533  11.718  14.362  1.00  9.64           O  
ATOM    281  CB  CYS A  40      17.582  11.117  11.996  1.00  7.80           C  
ATOM    282  SG  CYS A  40      17.199  10.929  10.237  1.00  7.30           S  
ATOM    283  N   PRO A  41      17.880  13.266  14.426  1.00  8.00           N  
ATOM    284  CA  PRO A  41      17.924  13.421  15.877  1.00  8.96           C  
ATOM    285  C   PRO A  41      17.392  12.206  16.594  1.00  9.06           C  
ATOM    286  O   PRO A  41      16.652  11.368  16.033  1.00  8.82           O  
ATOM    287  CB  PRO A  41      17.076  14.658  16.145  1.00 10.39           C  
ATOM    288  CG  PRO A  41      16.098  14.689  14.997  1.00 10.99           C  
ATOM    289  CD  PRO A  41      16.859  14.150  13.779  1.00 10.49           C  
ATOM    290  N   GLY A  42      17.728  12.124  17.884  1.00  7.55           N  
ATOM    291  CA  GLY A  42      17.334  10.956  18.691  1.00  8.00           C  
ATOM    292  C   GLY A  42      15.875  10.688  18.871  1.00  7.22           C  
ATOM    293  O   GLY A  42      15.434   9.550  19.166  1.00  8.41           O  
ATOM    294  N   ASP A  43      15.036  11.747  18.715  1.00  5.54           N  
ATOM    295  CA  ASP A  43      13.564  11.573  18.836  1.00  5.85           C  
ATOM    296  C   ASP A  43      12.936  11.227  17.470  1.00  5.87           C  
ATOM    297  O   ASP A  43      11.720  11.040  17.428  1.00  7.29           O  
ATOM    298  CB  ASP A  43      12.933  12.737  19.580  1.00  6.72           C  
ATOM    299  CG  ASP A  43      13.140  14.094  18.958  1.00  8.59           C  
ATOM    300  OD1 ASP A  43      14.109  14.303  18.212  1.00  9.59           O  
ATOM    301  OD2 ASP A  43      12.267  14.963  19.265  1.00 11.45           O  
ATOM    302  N   TYR A  44      13.725  11.174  16.425  1.00  5.22           N  
ATOM    303  CA  TYR A  44      13.257  10.745  15.081  1.00  5.56           C  
ATOM    304  C   TYR A  44      14.275   9.687  14.612  1.00  4.61           C  
ATOM    305  O   TYR A  44      14.930   9.862  13.568  1.00  6.04           O  
ATOM    306  CB  TYR A  44      13.200  11.914  14.071  1.00  5.41           C  
ATOM    307  CG  TYR A  44      12.000  12.819  14.399  1.00  5.34           C  
ATOM    308  CD1 TYR A  44      12.119  13.853  15.332  1.00  6.59           C  
ATOM    309  CD2 TYR A  44      10.775  12.617  13.762  1.00  5.94           C  
ATOM    310  CE1 TYR A  44      11.045  14.675  15.610  1.00  5.97           C  
ATOM    311  CE2 TYR A  44       9.676  13.433  14.048  1.00  5.17           C  
ATOM    312  CZ  TYR A  44       9.802  14.456  14.996  1.00  5.96           C  
ATOM    313  OH  TYR A  44       8.740  15.265  15.269  1.00  8.60           O  
ATOM    314  N   ALA A  45      14.342   8.640  15.422  1.00  4.76           N  
ATOM    315  CA  ALA A  45      15.445   7.667  15.246  1.00  5.89           C  
ATOM    316  C   ALA A  45      15.171   6.533  14.280  1.00  6.67           C  
ATOM    317  O   ALA A  45      16.093   5.705  14.039  1.00  7.56           O  
ATOM    318  CB  ALA A  45      15.680   7.099  16.682  1.00  6.82           C  
ATOM    319  N   ASN A  46      13.966   6.502  13.739  1.00  5.80           N  
ATOM    320  CA  ASN A  46      13.512   5.395  12.878  1.00  6.15           C  
ATOM    321  C   ASN A  46      13.311   5.853  11.455  1.00  6.61           C  
ATOM    322  O   ASN A  46      13.733   6.929  11.026  1.00  7.18           O  
ATOM    323  CB  ASN A  46      12.266   4.769  13.501  1.00  7.27           C  
ATOM    324  CG  ASN A  46      12.538   4.304  14.922  1.00  7.98           C  
ATOM    325  OD1 ASN A  46      11.982   4.849  15.886  1.00 11.00           O  
ATOM    326  ND2 ASN A  46      13.407   3.298  15.015  1.00 10.32           N  
ATOM    327  OXT ASN A  46      12.703   4.973  10.746  1.00  7.86           O  
TER     328      ASN A  46                                                      
CONECT   20  282                                                                
CONECT   26  229                                                                
CONECT  116  188                                                                
CONECT  188  116                                                                
CONECT  229   26                                                                
CONECT  282   20                                                                
MASTER      225    0    0    2    2    0    0    6  327    1    6    4          
END                                                                             
`,N2="/assets/1crn_vibration-9Q5UZQpF.xtc";async function qv(r,t){const i=new FormData;i.append("pdb",r),t&&i.append("xtc",t),await fetch("/api/upload",{method:"POST",body:i})}function U2(){var ft,I;const[r,t]=pt.useState("local"),i=r==="streaming"?`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/ws`:null,s=C2(i),l=w2();pt.useEffect(()=>{(async()=>{await l.loadText(D2);const q=await(await fetch(N2)).arrayBuffer(),_t=new File([q],"1crn_vibration.xtc");await l.loadXtc(_t)})().catch(()=>{})},[]);const c=r==="streaming"?s.snapshot:l.snapshot,h=r==="streaming"?s.frame:l.frame,d=r==="streaming"?s.meta:l.meta,m=r==="streaming"?s.currentFrame:l.currentFrame,p=r==="streaming"?s.currentFrameRef:l.currentFrameRef,[g,_]=pt.useState(null),[S,E]=pt.useState(null),[y,T]=pt.useState(!1),[A,v]=pt.useState(30),U=pt.useRef(!1);pt.useEffect(()=>{if(U.current=y,!y||!d)return;const k=setInterval(()=>{if(!U.current)return;const q=(p.current+1)%d.nFrames;r==="streaming"&&s.clientRef.current?s.clientRef.current.send({type:"request_frame",frame:q}):r==="local"&&l.seekFrame(q)},1e3/A);return()=>clearInterval(k)},[y,d,A,r,s.clientRef,p,l.seekFrame]);const D=pt.useCallback(k=>{var q;r==="streaming"?(s.currentFrameRef.current=k,(q=s.clientRef.current)==null||q.send({type:"request_frame",frame:k})):l.seekFrame(k)},[r,s.currentFrameRef,s.clientRef,l.seekFrame]),O=pt.useCallback(()=>{T(k=>!k)},[]),H=pt.useCallback(k=>{v(k)},[]),B=pt.useCallback(k=>{T(!1),r==="streaming"?(qv(k),_(k.name),E(null)):l.loadFile(k)},[r,l.loadFile]),P=pt.useCallback(k=>{T(!1),r==="streaming"?(qv(void 0,k),E(k.name)):l.loadXtc(k)},[r,l.loadXtc]),V=pt.useCallback(()=>{T(!1),t(k=>k==="streaming"?"local":"streaming")},[]),L=r==="streaming"?g||((ft=s.meta)==null?void 0:ft.pdbName)||null:l.pdbFileName,C=r==="streaming"?S||((I=s.meta)==null?void 0:I.xtcName)||null:l.xtcFileName,z=pt.useMemo(()=>({source:r==="streaming"?s.bondSource:l.bondSource,onSourceChange:r==="streaming"?s.setBondSource:l.setBondSource,onUploadFile:r==="streaming"?s.loadBondFile:l.loadBondFile,fileName:r==="streaming"?s.bondFileName:l.bondFileName,count:(c==null?void 0:c.nBonds)??0}),[r,c==null?void 0:c.nBonds,s.bondSource,s.setBondSource,s.loadBondFile,s.bondFileName,l.bondSource,l.setBondSource,l.loadBondFile,l.bondFileName]),nt=pt.useMemo(()=>({source:r==="streaming"?s.trajectorySource:l.trajectorySource,onSourceChange:r==="streaming"?s.setTrajectorySource:l.setTrajectorySource,hasStructureFrames:r==="streaming"?s.hasStructureFrames:l.hasStructureFrames,hasFileFrames:r==="streaming"?s.hasFileFrames:l.hasFileFrames,fileName:C,totalFrames:(d==null?void 0:d.nFrames)??0,timestepPs:(d==null?void 0:d.timestepPs)??0,onUploadXtc:P}),[r,C,d==null?void 0:d.nFrames,d==null?void 0:d.timestepPs,P,s.trajectorySource,s.setTrajectorySource,s.hasStructureFrames,s.hasFileFrames,l.trajectorySource,l.setTrajectorySource,l.hasStructureFrames,l.hasFileFrames]),$=pt.useMemo(()=>({source:r==="streaming"?s.labelSource:l.labelSource,onSourceChange:r==="streaming"?s.setLabelSource:l.setLabelSource,onUploadFile:r==="streaming"?s.loadLabelFile:l.loadLabelFile,fileName:r==="streaming"?s.labelFileName:l.labelFileName,hasStructureLabels:r==="streaming"?s.hasStructureLabels:l.hasStructureLabels}),[r,s.labelSource,s.setLabelSource,s.loadLabelFile,s.labelFileName,s.hasStructureLabels,l.labelSource,l.setLabelSource,l.loadLabelFile,l.labelFileName,l.hasStructureLabels]),ct=r==="streaming"?s.atomLabels:l.atomLabels;return vt.jsx(o2,{snapshot:c,frame:h,currentFrame:m,totalFrames:(d==null?void 0:d.nFrames)??0,playing:y,fps:A,onSeek:D,onPlayPause:O,onFpsChange:H,onUploadStructure:B,mode:r,onToggleMode:V,pdbFileName:L,bonds:z,trajectory:nt,labels:$,atomLabels:ct})}JM.createRoot(document.getElementById("root")).render(vt.jsx(pt.StrictMode,{children:vt.jsx(U2,{})}));
