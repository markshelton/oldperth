!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=10)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.loadInfoForLatLon=function(e){var t;t="pop"==e?o+"/popular.json":i+"/"+e.replace(",","")+".json";return $.getJSON(t).then(function(t){$.extend(r,t);var n=[];for(var o in t)n.push(o);return"pop"!=e&&(l[e]=function(e){for(var t in e){var n=e[t];if(n.original_title)return n.original_title}}(t)),n})},t.infoForPhotoId=a,t.descriptionForPhotoId=function(e){var t=a(e),n=t.title;n&&(n+=" ");var r=t.date.replace(/n\.d\.?/,"No Date");r||(r="No Date");return n+=r},t.libraryUrlForPhotoId=function(e){return"http://digitalcollections.nypl.org/items/image_id/"+e.replace(/-[a-z]$/,"")},t.backId=u,t.backOfCardUrlForPhotoId=function(e){return"http://images.nypl.org/?id="+u(e)+"&t=w"},t.nameForLatLon=function(e){return(l[e]||"").replace(/: | - | & /g,"\n")};var r={},o="",i=o+"/by-location";function a(e){return r[e]||{title:"",date:"",library_url:""}}function u(e){return e.replace("f","b").replace(/-[a-z]$/,"")}var l={}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.mapPromise=t.map=t.lat_lon_to_marker=void 0;var r=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();t.countPhotos=k,t.selectMarker=_,t.updateYears=P,t.initialize_map=function(){var e={zoom:15,maxZoom:18,minZoom:10,center:new google.maps.LatLng(-31.953512,115.857048),mapTypeId:google.maps.MapTypeId.ROADMAP,mapTypeControl:!1,streetViewControl:!0,panControl:!1,zoomControlOptions:{position:google.maps.ControlPosition.LEFT_TOP},styles:i.MAP_STYLE};t.map=m=new google.maps.Map($("#map").get(0),e);var n=$("<div/>").append($("<div/>").addClass("spacer")).get(0);n.index=-1,m.controls[google.maps.ControlPosition.TOP_LEFT].push(n);var r=m.getStreetView();google.maps.event.addListener(r,"visible_changed",function(){$(".streetview-hide").toggle(!r.getVisible())}),h.push(null),v.push(null);for(var o=0;o<100;o++){var a=o+1,u=1==a?9:13,l=1==a?15:21;h.push(new google.maps.MarkerImage("images/sprite-2014-08-29.png",new google.maps.Size(u,u),new google.maps.Point(o%10*39,39*Math.floor(o/10)),new google.maps.Point((u-1)/2,(u-1)/2))),v.push(new google.maps.MarkerImage("images/selected-2014-08-29.png",new google.maps.Size(l,l),new google.maps.Point(o%10*39,39*Math.floor(o/10)),new google.maps.Point((l-1)/2,(l-1)/2)))}var c=google.maps.event.addListener(m,"idle",function(){google.maps.event.removeListener(c),F(),b.resolve(m)});google.maps.event.addListener(m,"bounds_changed",function(){F()})},t.parseLatLon=O,t.createMarker=I,t.showExpanded=A,t.hideExpanded=M,t.getPopularPhotoIds=function(){return $(".popular-photo:visible a").map(function(e,t){return S(t)}).toArray()},t.fillPopularImagesPanel=function(){var e=(new Date).getTime()-new Date("2015/12/15").getTime(),t=Math.floor(e/86400/1e3)%l.popular_photos.length,n=l.popular_photos.slice(t).concat(l.popular_photos.slice(0,t)),r=$.map(n,function(e){var t=$("#popular-photo-template").clone().removeAttr("id");t.find("a").attr("href","#"+e.id),t.find("img").attr("border","0").attr("data-src",(n=e.id,"http://oldnyc-assets.nypl.org/600px/"+n+".jpg")).attr("height",e.height),t.find(".desc").text(e.desc),t.find(".loc").text(e.loc),e.date&&t.find(".date").text(" ("+e.date+")");var n;return t.get(0)});$("#popular").append($(r).show()),$(r).appear({force_process:!0}),$("#popular").on("appear",".popular-photo",function(){var e=$(this).find("img[data-src]");!function(e){if($(e).attr("src"))return;$(e).attr("src",$(e).attr("data-src")).removeAttr("data-src")}(e.get(0))})},t.showAbout=C,t.hideAbout=E;var o=n(0),i=n(9),a=n(8),u=n(3),l=n(7),c=n(2),s=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(6));var f,p,d=[],h=[],g=t.lat_lon_to_marker={},v=[],y=[1800,2e3],m=t.map=void 0,b=t.mapPromise=$.Deferred();function x(e){return"http://maps.googleapis.com/maps/api/staticmap?center="+e+"&zoom=15&size=150x150&maptype=roadmap&markers=color:red%7C"+e+"&style="+i.STATIC_MAP_STYLE}function w(e){return 1800===e[0]&&2e3===e[1]}function k(e){if(w(y))return s.reduce(e,function(e,t){return e+t});var t=r(y,2),n=t[0],o=t[1];return s.reduce(s.filter(e,function(e,t){return t>n&&t<=o}),function(e,t){return e+t})}function _(e,t){var n=k(t),r=0;f&&(r=f.getZIndex(),f.setIcon(p)),e&&(f=e,p=e.getIcon(),e.setIcon(v[n>100?100:n]),e.setZIndex(1e5+r))}function P(e,t){y=[e,t],s.forEach(g,function(e,t){var n=k(lat_lons[t]);n?(e.setIcon(h[Math.min(n,100)]),e.setVisible(!0)):e.setVisible(!1)}),F(),$("#time-range-labels").text(e+"–"+t)}function T(e,t,n){t&&_(t,lat_lons[e]),(0,o.loadInfoForLatLon)(e).done(function(t){var r=null;t.length<=10&&(r=t[0]),A(e,t,r),n&&r&&n(r)}).fail(function(){})}function j(e){var t=e.latLng.lat().toFixed(6)+","+e.latLng.lng().toFixed(6);T(t,g[t],function(e){$(window).trigger("openPreviewPanel"),$(window).trigger("showPhotoPreview",e)}),$(window).trigger("showGrid",t)}function F(){var e=m.getBounds();for(var t in lat_lons)if(!(t in g)){var n=O(t);e.contains(n)&&I(t,n)}}function O(e){var t=e.split(",");return new google.maps.LatLng(parseFloat(t[0]),parseFloat(t[1]))}function I(e,t){var n=k(lat_lons[e]);if(n){var r=new google.maps.Marker({position:t,map:m,flat:!0,visible:!0,icon:h[Math.min(n,100)],title:e});return d.push(r),g[e]=r,google.maps.event.addListener(r,"click",j),r}}function A(e,t,n){if(E(),m.set("keyboardShortcuts",!1),$("#expanded").show().data("grid-key",e),$(".location").text((0,o.nameForLatLon)(e)),w(y))$("#filtered-slideshow").hide();else{var i=r(y,2),a=i[0],u=i[1];$("#filtered-slideshow").show(),$("#slideshow-filter-first").text(a),$("#slideshow-filter-last").text(u)}var l=$.map(t,function(e){var t=(0,o.infoForPhotoId)(e);return function(e,t){if(w(t))return!0;for(var n=r(t,2),o=n[0],i=n[1],a=0;a<e.years.length;a++){var u=e.years[a];if(u&&u>=o&&u<=i)return!0}return!1}(t,y)?$.extend({id:e,largesrc:t.image_url,src:t.thumb_url,width:600,height:400},t):null});l=l.filter(function(e){return null!==e}),$("#preview-map").attr("src",x(e)),$("#grid-container").expandableGrid({rowHeight:200,speed:200},l),n&&$("#grid-container").expandableGrid("select",n)}function M(){$("#expanded").hide(),$(document).unbind("keyup"),m.set("keyboardShortcuts",!0)}function S(e){return $(e).attr("href").replace("#","")}function L(){$("#popular").hide(),$(".popular-link").show()}function C(){M(),$("#about-page").show();var e=$("#about-page .container"),t=e.width();t<parseInt(e.css("max-width"),0)&&e.css("margin-left","-"+t/2+"px")}function E(){$("#about-page").hide()}$.fn.scrollGuard=function(){return this.on("mousewheel",function(){var e=this.scrollHeight,t=$(this).height();return!(this.scrollTop===e-t&&event.deltaY<0||0===this.scrollTop&&event.deltaY>0)})},$(function(){$(document).on("click","#expanded .curtains, #expanded .exit",function(){M(),$(window).trigger("hideGrid")}),$("#grid-container, #expanded .header").on("click",function(e){(e.target==this||$(e.target).is(".og-grid"))&&(M(),$(window).trigger("hideGrid"))}),$("#grid-container").on("og-fill","li",function(e,t){var n,r,i,l=$(this).data("image-id");$(t).empty().append($("#image-details-template").clone().removeAttr("id").show()),$(t).parent().find(".og-details-left").empty().append($("#image-details-left-template").clone().removeAttr("id").show()),function(e,t){$(".description",t).html((0,o.descriptionForPhotoId)(e));var n=(0,o.infoForPhotoId)(e),r=(0,o.libraryUrlForPhotoId)(e);t.parent().find(".nypl-link a").attr("href",r),$(".nypl-logo a").attr("href",r);var i=(0,a.getCanonicalUrlForPhoto)(e);if((0,u.getFeedbackText)((0,o.backId)(e)).done(function(o){var i=o?o.text:n.text,a="/ocr.html#"+e,u=e.match("[0-9]f");if(i){var l=t.find(".text");l.text(i.replace(/\n*$/,"")),l.append($("<i>&nbsp; &nbsp; Typos? Help <a target=_blank href>fix them</a>.</i>")),l.find("a").attr("href",a)}else if(u){var c=t.find(".more-on-back");c.find("a.ocr-tool").attr("href",a),c.find("a.nypl").attr("href",r),c.show()}}),"undefined"!=typeof FB){var l=t.find(".comments"),c=l.parent().width();l.empty().append($('<fb:comments data-numposts="5" data-colorscheme="light"/>').attr("data-width",c).attr("data-href",i).attr("data-version","v2.3")),FB.XFBML.parse(l.get(0)),console.log(i)}var s=new ZeroClipboard(t.find(".copy-link"));if(s.on("ready",function(){s.on("copy",function(e){e.clipboardData.setData("text/plain",window.location.href)}),s.on("aftercopy",function(e){var t=$(e.target);t.css({width:t.get(0).offsetWidth}).addClass("clicked").text("Copied!")})}),"undefined"!=typeof twttr&&twttr.widgets.createShareButton(document.location.href,t.find(".tweet").get(0),{count:"none",text:(n.original_title||n.title)+" - "+n.date,via:"Old_NYC @NYPL"}),"undefined"!=typeof FB){var f=t.find(".facebook-holder");f.empty().append($("<fb:like>").attr({href:i,layout:"button",action:"like",show_faces:"false",share:"true"})),FB.XFBML.parse(f.get(0))}t.off("mousewheel").on("mousewheel",function(e){var n=t.height(),r=t.get(0).scrollHeight;return!(this.scrollTop===r-n&&e.deltaY<0||0===this.scrollTop&&e.deltaY>0)})}(l,$(t)),"pop"==$("#expanded").data("grid-key")&&(n=l,r="New York City",(i=(0,c.findLatLonForPhoto)(n))&&(r=i),$("#preview-map").attr("src",x(r)))}).on("click",".og-fullimg > img",function(){var e=$("#grid-container").expandableGrid("selectedId");window.open((0,o.libraryUrlForPhotoId)(e),"_blank")}),$("#grid-container").on("click",".rotate-image-button",function(e){e.preventDefault();var t=$(this).closest("li").find(".og-fullimg > img"),n=t.data("rotate")||0;n+=90,t.css("transform","rotate("+n+"deg)").data("rotate",n);var r=$("#grid-container").expandableGrid("selectedId");ga("send","event","link","rotate",{page:"#"+r+"("+n+")"}),(0,u.sendFeedback)(r,"rotate",{rotate:n,original:(0,o.infoForPhotoId)(r).rotation||null})}).on("click",".feedback-button",function(e){e.preventDefault(),$("#grid-container .details").fadeOut(),$("#grid-container .feedback").fadeIn()}).on("click","a.back",function(e){e.preventDefault(),$("#grid-container .feedback").fadeOut(),$("#grid-container .details").fadeIn()}),$(document).on("keyup","input, textarea",function(e){e.stopPropagation()}),$(".popular-photo").on("click","a",function(e){e.preventDefault();var t=S(this);(0,o.loadInfoForLatLon)("pop").done(function(e){A("pop",e,t),$(window).trigger("showGrid","pop"),$(window).trigger("openPreviewPanel"),$(window).trigger("showPhotoPreview",t)}).fail(function(){})}),$("#popular").on("scroll",function(){$(this).appear({force_process:!0})}),$("#popular .close").on("click",function(){(0,u.setCookie)("nopop","1"),L()}),$(".popular-link a").on("click",function(e){$("#popular").show(),$(".popular-link").hide(),$("#popular").appear({force_process:!0}),(0,u.deleteCookie)("nopop"),e.preventDefault()}),document.cookie.indexOf("nopop=")>=0&&L(),$("#about a").on("click",function(e){e.preventDefault(),C()}),$("#about-page .curtains, #about-page .exit").on("click",E);$("#grid-container").on("click",".feedback button[feedback]",function(){var e=$(this),t=!0;if(e.attr("feedback-param")){var n=e.siblings("input, textarea");if(""==(t=n.val()))return;n.prop("disabled",!0)}e.prop("disabled",!0);var r,o=$("#grid-container").expandableGrid("selectedId"),i=e.attr("feedback"),a={};a[i]=t,(0,u.sendFeedback)(o,i,a).then((r=e.get(0),function(){$(r).text("Thanks!")}))}),$("#grid-container").on("og-select","li",function(){var e=$(this).data("image-id");$(window).trigger("showPhotoPreview",e)}).on("og-deselect",function(){$(window).trigger("closePreviewPanel")}).on("og-openpreview",function(){$(window).trigger("openPreviewPanel")}),$("#time-slider").slider({range:!0,min:1800,max:2e3,values:y,slide:function(e,t){var n=r(t.values,2);P(n[0],n[1])},stop:function(e,t){var n=r(t.values,2),o=n[0],i=n[1];ga("send","event","link","time-slider",{page:"#"+o+"–"+i})}}),$("#time-range-summary").on("click",function(){$("#time-range").toggle()}),$("#slideshow-all").on("click",function(){P(1800,2e3),$("#time-slider").slider({values:y});var e=$("#expanded").data("grid-key");ga("send","event","link","time-slider-clear"),M(),T(e)})})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCurrentStateObject=i,t.hashToStateObject=a,t.stateObjectToHash=u,t.transitionToStateObject=function(e){var t=i();a(u(e),function(e){if(JSON.stringify(t)!=JSON.stringify(e))if("{}"==JSON.stringify(e)&&((0,r.hideAbout)(),(0,r.hideExpanded)()),t.g==e.g)t.photo_id&&!e.photo_id?$("#grid-container").expandableGrid("deselect"):$("#grid-container").expandableGrid("select",e.photo_id);else{var n=e.g,i=(0,r.countPhotos)(lat_lons[n]);if("pop"==e.g)i=(0,r.getPopularPhotoIds)().length;else{var a=r.lat_lon_to_marker[n],u=(0,r.parseLatLon)(n);a||(a=(0,r.createMarker)(n,u)),a&&((0,r.selectMarker)(a,i),r.map.getBounds().contains(u)||r.map.panTo(u))}(0,o.loadInfoForLatLon)(n).done(function(t){(0,r.showExpanded)(e.g,t,e.photo_id)})}})},t.findLatLonForPhoto=l;var r=n(1),o=n(0);function i(){if(!$("#expanded").is(":visible"))return{};var e=$("#expanded").data("grid-key"),t=$("#grid-container").expandableGrid("selectedId");return t?{photo_id:t,g:e}:{g:e}}function a(e,t){var n=e.match(/(.*),g:(.*)/);if(n)t({photo_id:n[1],g:n[2]});else if("g:"==e.substr(0,2))t({g:e.substr(2)});else if(e.length>0){l(e,function(n){t({photo_id:e,g:n})})}else t({})}function u(e){return e.photo_id?"pop"==e.g?e.photo_id+",g:pop":e.photo_id:e.g?"g:"+e.g:""}function l(e,t){var n=e.slice(0,4);$.ajax({dataType:"json",url:"/id4-to-location/"+n+".json",success:function(n){t(n[e])}})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.deleteCookie=function(e){document.cookie=e+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"},t.setCookie=a,t.getCookie=u,t.sendFeedback=function(e,t,n){ga("send","event","link","feedback",{page:"#"+e}),n.metadata={timestamp:Firebase.ServerValue.TIMESTAMP,user_agent:navigator.userAgent,user_ip:o?o.ip:"",location:o?o.location:"",cookie:l};var i="/feedback/"+e+"/"+t,a=r.child(i),u=$.Deferred();return a.push(n,function(e){e?(console.error("Error pushing",e),u.reject(e)):u.resolve()}),u},t.getFeedbackText=function(e){var t=$.Deferred();return i.then(function(n){r.child("/feedback/"+e+"/text").orderByKey().once("value",function(e){var r=null;e.forEach(function(e){var t=e.val();t.metadata.timestamp>n&&(r=t)}),t.resolve(r)})}),t};var r=null;"undefined"!=typeof Firebase&&(r=new Firebase("https://brilliant-heat-1088.firebaseio.com/"));var o=null;$.get("//ipinfo.io",function(e){o={ip:e.ip,location:e.country+"-"+e.region+"-"+e.city}},"jsonp");var i=$.get("/timestamps.json").then(function(e){return e.ocr_ms});function a(e,t){document.cookie=e+"="+t+"; path=/"}function u(e){var t;return(t=document.cookie.match("(^|;)\\s*"+e+"\\s*=\\s*([^;]+)"))?t.pop():""}var l=u("oldnycid");l||a("oldnycid",l="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){(function(e,n){var r;!function(){var o="object"==typeof self&&self.self===self&&self||"object"==typeof e&&e.global===e&&e||this||{},i=o._,a=Array.prototype,u=Object.prototype,l="undefined"!=typeof Symbol?Symbol.prototype:null,c=a.push,s=a.slice,f=u.toString,p=u.hasOwnProperty,d=Array.isArray,h=Object.keys,g=Object.create,v=function(){},y=function(e){return e instanceof y?e:this instanceof y?void(this._wrapped=e):new y(e)};void 0===t||t.nodeType?o._=y:(void 0!==n&&!n.nodeType&&n.exports&&(t=n.exports=y),t._=y),y.VERSION="1.9.0";var m,b=function(e,t,n){if(void 0===t)return e;switch(null==n?3:n){case 1:return function(n){return e.call(t,n)};case 3:return function(n,r,o){return e.call(t,n,r,o)};case 4:return function(n,r,o,i){return e.call(t,n,r,o,i)}}return function(){return e.apply(t,arguments)}},x=function(e,t,n){return y.iteratee!==m?y.iteratee(e,t):null==e?y.identity:y.isFunction(e)?b(e,t,n):y.isObject(e)&&!y.isArray(e)?y.matcher(e):y.property(e)};y.iteratee=m=function(e,t){return x(e,t,1/0)};var w=function(e,t){return t=null==t?e.length-1:+t,function(){for(var n=Math.max(arguments.length-t,0),r=Array(n),o=0;o<n;o++)r[o]=arguments[o+t];switch(t){case 0:return e.call(this,r);case 1:return e.call(this,arguments[0],r);case 2:return e.call(this,arguments[0],arguments[1],r)}var i=Array(t+1);for(o=0;o<t;o++)i[o]=arguments[o];return i[t]=r,e.apply(this,i)}},k=function(e){if(!y.isObject(e))return{};if(g)return g(e);v.prototype=e;var t=new v;return v.prototype=null,t},$=function(e){return function(t){return null==t?void 0:t[e]}},_=function(e,t){for(var n=t.length,r=0;r<n;r++){if(null==e)return;e=e[t[r]]}return n?e:void 0},P=Math.pow(2,53)-1,T=$("length"),j=function(e){var t=T(e);return"number"==typeof t&&t>=0&&t<=P};y.each=y.forEach=function(e,t,n){var r,o;if(t=b(t,n),j(e))for(r=0,o=e.length;r<o;r++)t(e[r],r,e);else{var i=y.keys(e);for(r=0,o=i.length;r<o;r++)t(e[i[r]],i[r],e)}return e},y.map=y.collect=function(e,t,n){t=x(t,n);for(var r=!j(e)&&y.keys(e),o=(r||e).length,i=Array(o),a=0;a<o;a++){var u=r?r[a]:a;i[a]=t(e[u],u,e)}return i};var F=function(e){return function(t,n,r,o){var i=arguments.length>=3;return function(t,n,r,o){var i=!j(t)&&y.keys(t),a=(i||t).length,u=e>0?0:a-1;for(o||(r=t[i?i[u]:u],u+=e);u>=0&&u<a;u+=e){var l=i?i[u]:u;r=n(r,t[l],l,t)}return r}(t,b(n,o,4),r,i)}};y.reduce=y.foldl=y.inject=F(1),y.reduceRight=y.foldr=F(-1),y.find=y.detect=function(e,t,n){var r=(j(e)?y.findIndex:y.findKey)(e,t,n);if(void 0!==r&&-1!==r)return e[r]},y.filter=y.select=function(e,t,n){var r=[];return t=x(t,n),y.each(e,function(e,n,o){t(e,n,o)&&r.push(e)}),r},y.reject=function(e,t,n){return y.filter(e,y.negate(x(t)),n)},y.every=y.all=function(e,t,n){t=x(t,n);for(var r=!j(e)&&y.keys(e),o=(r||e).length,i=0;i<o;i++){var a=r?r[i]:i;if(!t(e[a],a,e))return!1}return!0},y.some=y.any=function(e,t,n){t=x(t,n);for(var r=!j(e)&&y.keys(e),o=(r||e).length,i=0;i<o;i++){var a=r?r[i]:i;if(t(e[a],a,e))return!0}return!1},y.contains=y.includes=y.include=function(e,t,n,r){return j(e)||(e=y.values(e)),("number"!=typeof n||r)&&(n=0),y.indexOf(e,t,n)>=0},y.invoke=w(function(e,t,n){var r,o;return y.isFunction(t)?o=t:y.isArray(t)&&(r=t.slice(0,-1),t=t[t.length-1]),y.map(e,function(e){var i=o;if(!i){if(r&&r.length&&(e=_(e,r)),null==e)return;i=e[t]}return null==i?i:i.apply(e,n)})}),y.pluck=function(e,t){return y.map(e,y.property(t))},y.where=function(e,t){return y.filter(e,y.matcher(t))},y.findWhere=function(e,t){return y.find(e,y.matcher(t))},y.max=function(e,t,n){var r,o,i=-1/0,a=-1/0;if(null==t||"number"==typeof t&&"object"!=typeof e[0]&&null!=e)for(var u=0,l=(e=j(e)?e:y.values(e)).length;u<l;u++)null!=(r=e[u])&&r>i&&(i=r);else t=x(t,n),y.each(e,function(e,n,r){((o=t(e,n,r))>a||o===-1/0&&i===-1/0)&&(i=e,a=o)});return i},y.min=function(e,t,n){var r,o,i=1/0,a=1/0;if(null==t||"number"==typeof t&&"object"!=typeof e[0]&&null!=e)for(var u=0,l=(e=j(e)?e:y.values(e)).length;u<l;u++)null!=(r=e[u])&&r<i&&(i=r);else t=x(t,n),y.each(e,function(e,n,r){((o=t(e,n,r))<a||o===1/0&&i===1/0)&&(i=e,a=o)});return i},y.shuffle=function(e){return y.sample(e,1/0)},y.sample=function(e,t,n){if(null==t||n)return j(e)||(e=y.values(e)),e[y.random(e.length-1)];var r=j(e)?y.clone(e):y.values(e),o=T(r);t=Math.max(Math.min(t,o),0);for(var i=o-1,a=0;a<t;a++){var u=y.random(a,i),l=r[a];r[a]=r[u],r[u]=l}return r.slice(0,t)},y.sortBy=function(e,t,n){var r=0;return t=x(t,n),y.pluck(y.map(e,function(e,n,o){return{value:e,index:r++,criteria:t(e,n,o)}}).sort(function(e,t){var n=e.criteria,r=t.criteria;if(n!==r){if(n>r||void 0===n)return 1;if(n<r||void 0===r)return-1}return e.index-t.index}),"value")};var O=function(e,t){return function(n,r,o){var i=t?[[],[]]:{};return r=x(r,o),y.each(n,function(t,o){var a=r(t,o,n);e(i,t,a)}),i}};y.groupBy=O(function(e,t,n){y.has(e,n)?e[n].push(t):e[n]=[t]}),y.indexBy=O(function(e,t,n){e[n]=t}),y.countBy=O(function(e,t,n){y.has(e,n)?e[n]++:e[n]=1});var I=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;y.toArray=function(e){return e?y.isArray(e)?s.call(e):y.isString(e)?e.match(I):j(e)?y.map(e,y.identity):y.values(e):[]},y.size=function(e){return null==e?0:j(e)?e.length:y.keys(e).length},y.partition=O(function(e,t,n){e[n?0:1].push(t)},!0),y.first=y.head=y.take=function(e,t,n){if(!(null==e||e.length<1))return null==t||n?e[0]:y.initial(e,e.length-t)},y.initial=function(e,t,n){return s.call(e,0,Math.max(0,e.length-(null==t||n?1:t)))},y.last=function(e,t,n){if(!(null==e||e.length<1))return null==t||n?e[e.length-1]:y.rest(e,Math.max(0,e.length-t))},y.rest=y.tail=y.drop=function(e,t,n){return s.call(e,null==t||n?1:t)},y.compact=function(e){return y.filter(e,Boolean)};var A=function(e,t,n,r){for(var o=(r=r||[]).length,i=0,a=T(e);i<a;i++){var u=e[i];if(j(u)&&(y.isArray(u)||y.isArguments(u)))if(t)for(var l=0,c=u.length;l<c;)r[o++]=u[l++];else A(u,t,n,r),o=r.length;else n||(r[o++]=u)}return r};y.flatten=function(e,t){return A(e,t,!1)},y.without=w(function(e,t){return y.difference(e,t)}),y.uniq=y.unique=function(e,t,n,r){y.isBoolean(t)||(r=n,n=t,t=!1),null!=n&&(n=x(n,r));for(var o=[],i=[],a=0,u=T(e);a<u;a++){var l=e[a],c=n?n(l,a,e):l;t&&!n?(a&&i===c||o.push(l),i=c):n?y.contains(i,c)||(i.push(c),o.push(l)):y.contains(o,l)||o.push(l)}return o},y.union=w(function(e){return y.uniq(A(e,!0,!0))}),y.intersection=function(e){for(var t=[],n=arguments.length,r=0,o=T(e);r<o;r++){var i=e[r];if(!y.contains(t,i)){var a;for(a=1;a<n&&y.contains(arguments[a],i);a++);a===n&&t.push(i)}}return t},y.difference=w(function(e,t){return t=A(t,!0,!0),y.filter(e,function(e){return!y.contains(t,e)})}),y.unzip=function(e){for(var t=e&&y.max(e,T).length||0,n=Array(t),r=0;r<t;r++)n[r]=y.pluck(e,r);return n},y.zip=w(y.unzip),y.object=function(e,t){for(var n={},r=0,o=T(e);r<o;r++)t?n[e[r]]=t[r]:n[e[r][0]]=e[r][1];return n};var M=function(e){return function(t,n,r){n=x(n,r);for(var o=T(t),i=e>0?0:o-1;i>=0&&i<o;i+=e)if(n(t[i],i,t))return i;return-1}};y.findIndex=M(1),y.findLastIndex=M(-1),y.sortedIndex=function(e,t,n,r){for(var o=(n=x(n,r,1))(t),i=0,a=T(e);i<a;){var u=Math.floor((i+a)/2);n(e[u])<o?i=u+1:a=u}return i};var S=function(e,t,n){return function(r,o,i){var a=0,u=T(r);if("number"==typeof i)e>0?a=i>=0?i:Math.max(i+u,a):u=i>=0?Math.min(i+1,u):i+u+1;else if(n&&i&&u)return r[i=n(r,o)]===o?i:-1;if(o!=o)return(i=t(s.call(r,a,u),y.isNaN))>=0?i+a:-1;for(i=e>0?a:u-1;i>=0&&i<u;i+=e)if(r[i]===o)return i;return-1}};y.indexOf=S(1,y.findIndex,y.sortedIndex),y.lastIndexOf=S(-1,y.findLastIndex),y.range=function(e,t,n){null==t&&(t=e||0,e=0),n||(n=t<e?-1:1);for(var r=Math.max(Math.ceil((t-e)/n),0),o=Array(r),i=0;i<r;i++,e+=n)o[i]=e;return o},y.chunk=function(e,t){if(null==t||t<1)return[];for(var n=[],r=0,o=e.length;r<o;)n.push(s.call(e,r,r+=t));return n};var L=function(e,t,n,r,o){if(!(r instanceof t))return e.apply(n,o);var i=k(e.prototype),a=e.apply(i,o);return y.isObject(a)?a:i};y.bind=w(function(e,t,n){if(!y.isFunction(e))throw new TypeError("Bind must be called on a function");var r=w(function(o){return L(e,r,t,this,n.concat(o))});return r}),y.partial=w(function(e,t){var n=y.partial.placeholder,r=function(){for(var o=0,i=t.length,a=Array(i),u=0;u<i;u++)a[u]=t[u]===n?arguments[o++]:t[u];for(;o<arguments.length;)a.push(arguments[o++]);return L(e,r,this,this,a)};return r}),y.partial.placeholder=y,y.bindAll=w(function(e,t){var n=(t=A(t,!1,!1)).length;if(n<1)throw new Error("bindAll must be passed function names");for(;n--;){var r=t[n];e[r]=y.bind(e[r],e)}}),y.memoize=function(e,t){var n=function(r){var o=n.cache,i=""+(t?t.apply(this,arguments):r);return y.has(o,i)||(o[i]=e.apply(this,arguments)),o[i]};return n.cache={},n},y.delay=w(function(e,t,n){return setTimeout(function(){return e.apply(null,n)},t)}),y.defer=y.partial(y.delay,y,1),y.throttle=function(e,t,n){var r,o,i,a,u=0;n||(n={});var l=function(){u=!1===n.leading?0:y.now(),r=null,a=e.apply(o,i),r||(o=i=null)},c=function(){var c=y.now();u||!1!==n.leading||(u=c);var s=t-(c-u);return o=this,i=arguments,s<=0||s>t?(r&&(clearTimeout(r),r=null),u=c,a=e.apply(o,i),r||(o=i=null)):r||!1===n.trailing||(r=setTimeout(l,s)),a};return c.cancel=function(){clearTimeout(r),u=0,r=o=i=null},c},y.debounce=function(e,t,n){var r,o,i=function(t,n){r=null,n&&(o=e.apply(t,n))},a=w(function(a){if(r&&clearTimeout(r),n){var u=!r;r=setTimeout(i,t),u&&(o=e.apply(this,a))}else r=y.delay(i,t,this,a);return o});return a.cancel=function(){clearTimeout(r),r=null},a},y.wrap=function(e,t){return y.partial(t,e)},y.negate=function(e){return function(){return!e.apply(this,arguments)}},y.compose=function(){var e=arguments,t=e.length-1;return function(){for(var n=t,r=e[t].apply(this,arguments);n--;)r=e[n].call(this,r);return r}},y.after=function(e,t){return function(){if(--e<1)return t.apply(this,arguments)}},y.before=function(e,t){var n;return function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=null),n}},y.once=y.partial(y.before,2),y.restArguments=w;var C=!{toString:null}.propertyIsEnumerable("toString"),E=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],N=function(e,t){var n=E.length,r=e.constructor,o=y.isFunction(r)&&r.prototype||u,i="constructor";for(y.has(e,i)&&!y.contains(t,i)&&t.push(i);n--;)(i=E[n])in e&&e[i]!==o[i]&&!y.contains(t,i)&&t.push(i)};y.keys=function(e){if(!y.isObject(e))return[];if(h)return h(e);var t=[];for(var n in e)y.has(e,n)&&t.push(n);return C&&N(e,t),t},y.allKeys=function(e){if(!y.isObject(e))return[];var t=[];for(var n in e)t.push(n);return C&&N(e,t),t},y.values=function(e){for(var t=y.keys(e),n=t.length,r=Array(n),o=0;o<n;o++)r[o]=e[t[o]];return r},y.mapObject=function(e,t,n){t=x(t,n);for(var r=y.keys(e),o=r.length,i={},a=0;a<o;a++){var u=r[a];i[u]=t(e[u],u,e)}return i},y.pairs=function(e){for(var t=y.keys(e),n=t.length,r=Array(n),o=0;o<n;o++)r[o]=[t[o],e[t[o]]];return r},y.invert=function(e){for(var t={},n=y.keys(e),r=0,o=n.length;r<o;r++)t[e[n[r]]]=n[r];return t},y.functions=y.methods=function(e){var t=[];for(var n in e)y.isFunction(e[n])&&t.push(n);return t.sort()};var B=function(e,t){return function(n){var r=arguments.length;if(t&&(n=Object(n)),r<2||null==n)return n;for(var o=1;o<r;o++)for(var i=arguments[o],a=e(i),u=a.length,l=0;l<u;l++){var c=a[l];t&&void 0!==n[c]||(n[c]=i[c])}return n}};y.extend=B(y.allKeys),y.extendOwn=y.assign=B(y.keys),y.findKey=function(e,t,n){t=x(t,n);for(var r,o=y.keys(e),i=0,a=o.length;i<a;i++)if(t(e[r=o[i]],r,e))return r};var D,z,G=function(e,t,n){return t in n};y.pick=w(function(e,t){var n={},r=t[0];if(null==e)return n;y.isFunction(r)?(t.length>1&&(r=b(r,t[1])),t=y.allKeys(e)):(r=G,t=A(t,!1,!1),e=Object(e));for(var o=0,i=t.length;o<i;o++){var a=t[o],u=e[a];r(u,a,e)&&(n[a]=u)}return n}),y.omit=w(function(e,t){var n,r=t[0];return y.isFunction(r)?(r=y.negate(r),t.length>1&&(n=t[1])):(t=y.map(A(t,!1,!1),String),r=function(e,n){return!y.contains(t,n)}),y.pick(e,r,n)}),y.defaults=B(y.allKeys,!0),y.create=function(e,t){var n=k(e);return t&&y.extendOwn(n,t),n},y.clone=function(e){return y.isObject(e)?y.isArray(e)?e.slice():y.extend({},e):e},y.tap=function(e,t){return t(e),e},y.isMatch=function(e,t){var n=y.keys(t),r=n.length;if(null==e)return!r;for(var o=Object(e),i=0;i<r;i++){var a=n[i];if(t[a]!==o[a]||!(a in o))return!1}return!0},D=function(e,t,n,r){if(e===t)return 0!==e||1/e==1/t;if(null==e||null==t)return!1;if(e!=e)return t!=t;var o=typeof e;return("function"===o||"object"===o||"object"==typeof t)&&z(e,t,n,r)},z=function(e,t,n,r){e instanceof y&&(e=e._wrapped),t instanceof y&&(t=t._wrapped);var o=f.call(e);if(o!==f.call(t))return!1;switch(o){case"[object RegExp]":case"[object String]":return""+e==""+t;case"[object Number]":return+e!=+e?+t!=+t:0==+e?1/+e==1/t:+e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object Symbol]":return l.valueOf.call(e)===l.valueOf.call(t)}var i="[object Array]"===o;if(!i){if("object"!=typeof e||"object"!=typeof t)return!1;var a=e.constructor,u=t.constructor;if(a!==u&&!(y.isFunction(a)&&a instanceof a&&y.isFunction(u)&&u instanceof u)&&"constructor"in e&&"constructor"in t)return!1}n=n||[],r=r||[];for(var c=n.length;c--;)if(n[c]===e)return r[c]===t;if(n.push(e),r.push(t),i){if((c=e.length)!==t.length)return!1;for(;c--;)if(!D(e[c],t[c],n,r))return!1}else{var s,p=y.keys(e);if(c=p.length,y.keys(t).length!==c)return!1;for(;c--;)if(s=p[c],!y.has(t,s)||!D(e[s],t[s],n,r))return!1}return n.pop(),r.pop(),!0},y.isEqual=function(e,t){return D(e,t)},y.isEmpty=function(e){return null==e||(j(e)&&(y.isArray(e)||y.isString(e)||y.isArguments(e))?0===e.length:0===y.keys(e).length)},y.isElement=function(e){return!(!e||1!==e.nodeType)},y.isArray=d||function(e){return"[object Array]"===f.call(e)},y.isObject=function(e){var t=typeof e;return"function"===t||"object"===t&&!!e},y.each(["Arguments","Function","String","Number","Date","RegExp","Error","Symbol","Map","WeakMap","Set","WeakSet"],function(e){y["is"+e]=function(t){return f.call(t)==="[object "+e+"]"}}),y.isArguments(arguments)||(y.isArguments=function(e){return y.has(e,"callee")});var Y=o.document&&o.document.childNodes;"function"!=typeof/./&&"object"!=typeof Int8Array&&"function"!=typeof Y&&(y.isFunction=function(e){return"function"==typeof e||!1}),y.isFinite=function(e){return!y.isSymbol(e)&&isFinite(e)&&!isNaN(parseFloat(e))},y.isNaN=function(e){return y.isNumber(e)&&isNaN(e)},y.isBoolean=function(e){return!0===e||!1===e||"[object Boolean]"===f.call(e)},y.isNull=function(e){return null===e},y.isUndefined=function(e){return void 0===e},y.has=function(e,t){if(!y.isArray(t))return null!=e&&p.call(e,t);for(var n=t.length,r=0;r<n;r++){var o=t[r];if(null==e||!p.call(e,o))return!1;e=e[o]}return!!n},y.noConflict=function(){return o._=i,this},y.identity=function(e){return e},y.constant=function(e){return function(){return e}},y.noop=function(){},y.property=function(e){return y.isArray(e)?function(t){return _(t,e)}:$(e)},y.propertyOf=function(e){return null==e?function(){}:function(t){return y.isArray(t)?_(e,t):e[t]}},y.matcher=y.matches=function(e){return e=y.extendOwn({},e),function(t){return y.isMatch(t,e)}},y.times=function(e,t,n){var r=Array(Math.max(0,e));t=b(t,n,1);for(var o=0;o<e;o++)r[o]=t(o);return r},y.random=function(e,t){return null==t&&(t=e,e=0),e+Math.floor(Math.random()*(t-e+1))},y.now=Date.now||function(){return(new Date).getTime()};var U={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},H=y.invert(U),R=function(e){var t=function(t){return e[t]},n="(?:"+y.keys(e).join("|")+")",r=RegExp(n),o=RegExp(n,"g");return function(e){return e=null==e?"":""+e,r.test(e)?e.replace(o,t):e}};y.escape=R(U),y.unescape=R(H),y.result=function(e,t,n){y.isArray(t)||(t=[t]);var r=t.length;if(!r)return y.isFunction(n)?n.call(e):n;for(var o=0;o<r;o++){var i=null==e?void 0:e[t[o]];void 0===i&&(i=n,o=r),e=y.isFunction(i)?i.call(e):i}return e};var J=0;y.uniqueId=function(e){var t=++J+"";return e?e+t:t},y.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,V={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},q=/\\|'|\r|\n|\u2028|\u2029/g,Z=function(e){return"\\"+V[e]};y.template=function(e,t,n){!t&&n&&(t=n),t=y.defaults({},t,y.templateSettings);var r,o=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),i=0,a="__p+='";e.replace(o,function(t,n,r,o,u){return a+=e.slice(i,u).replace(q,Z),i=u+t.length,n?a+="'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'":r?a+="'+\n((__t=("+r+"))==null?'':__t)+\n'":o&&(a+="';\n"+o+"\n__p+='"),t}),a+="';\n",t.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{r=new Function(t.variable||"obj","_",a)}catch(e){throw e.source=a,e}var u=function(e){return r.call(this,e,y)},l=t.variable||"obj";return u.source="function("+l+"){\n"+a+"}",u},y.chain=function(e){var t=y(e);return t._chain=!0,t};var W=function(e,t){return e._chain?y(t).chain():t};y.mixin=function(e){return y.each(y.functions(e),function(t){var n=y[t]=e[t];y.prototype[t]=function(){var e=[this._wrapped];return c.apply(e,arguments),W(this,n.apply(y,e))}}),y},y.mixin(y),y.each(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=a[e];y.prototype[e]=function(){var n=this._wrapped;return t.apply(n,arguments),"shift"!==e&&"splice"!==e||0!==n.length||delete n[0],W(this,n)}}),y.each(["concat","join","slice"],function(e){var t=a[e];y.prototype[e]=function(){return W(this,t.apply(this._wrapped,arguments))}}),y.prototype.value=function(){return this._wrapped},y.prototype.valueOf=y.prototype.toJSON=y.prototype.value,y.prototype.toString=function(){return String(this._wrapped)},void 0===(r=function(){return y}.apply(t,[]))||(n.exports=r)}()}).call(this,n(5),n(4)(e))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.popular_photos=[{desc:"Hoyts Cinema 1 ticket office, City Arcade, Perth, 25 June 1979",id:"328919PD",loc:"Plaza Arcade, 650 Hay Street, Perth",height:760,date:"2018-04-01"},{desc:"Tamil House, 189 Brisbane Street, Northbridge, May 1984",id:"312755PD",loc:null,height:502,date:"1984-05-26"},{desc:"Bassendean Hotel, Old Perth Road, Bassendean, August 1987",id:"314834PD",loc:"Old Swan Barracks Bckpkrs, 2-8 Francis Street, Perth",height:505,date:"1987-08-26"}]},function(e,t,n){"use strict";function r(e){return"http://www.oldnyc.org/#"+e}Object.defineProperty(t,"__esModule",{value:!0}),t.getCanonicalUrlForPhoto=r,t.getCommentCount=function(e){return $.get("https://graph.facebook.com/",{ids:$.map(e,function(e){return r(e)}).join(",")}).then(function(e){var t={};return $.each(e,function(e,n){t[e.replace(/.*#/,"")]=n.comments||0}),t})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=t.MAP_STYLE=[{stylers:[{visibility:"off"}]},{featureType:"water",stylers:[{visibility:"simplified"}]},{featureType:"poi",stylers:[{visibility:"simplified"}]},{featureType:"transit",stylers:[{visibility:"off"}]},{featureType:"landscape",stylers:[{visibility:"simplified"}]},{featureType:"road",stylers:[{visibility:"simplified"}]},{featureType:"administrative",stylers:[{visibility:"simplified"}]},{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"administrative.country",elementType:"geometry.stroke",stylers:[{visibility:"off"}]},{featureType:"administrative.province",elementType:"geometry.stroke",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"geometry",stylers:[{visibility:"on"},{color:"#e3e3e3"}]},{featureType:"landscape.natural",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{color:"#cccccc"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#FFFFFF"}]},{featureType:"road",elementType:"labels",stylers:[{color:"#94989C"},{visibility:"simplified"}]},{featureType:"water",elementType:"labels",stylers:[{visibility:"off"}]}];t.STATIC_MAP_STYLE=function(e){for(var t="",n=0;n<e.length;n++){var r=e[n],o=[];if(null!=r.featureType&&o.push("feature:"+r.featureType),null!=r.elementType&&o.push("element:"+r.elementType),null!=r.stylers)for(var i=0;i<r.stylers.length;i++)for(var a in r.stylers[i])o.push(a+":"+r.stylers[i][a].replace(/#/,"0x"));t+="&style="+o.join("%7C")}return t}(r)},function(e,t,n){"use strict";var r=n(0),o=n(2),i=n(3);window.location.search.indexOf("thanks")>=0&&$("#thanks").show();var a,u=window.location.hash.slice(1);$('[name="photo_id"]').val(u),$("#back-link").attr("href","#"+u),$("#hi-res").attr("href",(0,r.libraryUrlForPhotoId)(u)),(0,o.findLatLonForPhoto)(u,function(e){var t=(0,r.loadInfoForLatLon)(e),n=(0,i.getFeedbackText)((0,r.backId)(u));$.when(t,n).done(function(e,t){console.log(e,t);var n=(0,r.infoForPhotoId)(u);a=e,$("img.back").attr("src",(0,r.backOfCardUrlForPhotoId)(u));var o=t?t.text:n.text;o&&$("#text").text(o),$("#submit").click(function(){c("text",{text:$("#text").val()})}),$("#notext").click(function(){c("notext",{notext:!0})}),$(".rotate-image-button").click(s)})});var l=$.getJSON("/notext.json");function c(e,t){(0,i.sendFeedback)((0,r.backId)(u),e,t).then(function(){return function(e){var t=$.Deferred();if(Math.random()<.5)for(var n=a.indexOf(e),o=0;o<a.length;o++){var i=a[(o+n)%a.length];if(i.match(/[0-9]f/)&&(0,r.backOfCardUrlForPhotoId)(i)!=(0,r.backOfCardUrlForPhotoId)(e))return t.resolve(i),t}return l.done(function(e){var n=e.photo_ids;console.log("Picking at random from "+n.length+" untranscribed photos."),t.resolve(n[Math.floor(Math.random()*n.length)])}),t}(u)}).then(function(e){var t=location.protocol+"//"+location.host+location.pathname+"?thanks&id="+e+"#"+e;ga("send","event","link","ocr-success",{page:"#"+u}),window.location=t})}function s(){var e=$("img.back"),t=e.data("rotate")||0;t+=90,e.css("transform","rotate("+t+"deg)").data("rotate",t),(0,i.sendFeedback)((0,r.backId)(u),{"rotate-backing":t})}}]);