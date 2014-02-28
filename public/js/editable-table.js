(function(){define(["jquery","util","B64","underscore","templates","angular","jquery.event.drag","jquery.bootstrap.contextmenu","html2canvas"],function(a,b,c){var d,e,f,g;return f=angular.module("editable-table",[]),f.directive("sortArrow",function(){return{template:templates.sortArrow(),restrict:"E",scope:{model:"=",sortBy:"&",compareFunction:"&",hideArrows:"@"},replace:!0,transclude:!0,link:function(a,b,c){return a.ascending=!1,a.sort=function(){c.sortBy!=null?a.model=_.sortBy(a.model,function(b){return a.sortBy({o:b})}):c.compareFunction!=null&&a.model.sort(function(b,c){return a.compareFunction({a:b,b:c})});if(!a.ascending)return a.model.reverse()},a.elementToString=function(a){return a.hasClass("sortarrow")?d(b.find(".sortarrow-content")):!1},a.toggleSort=function(){return a.ascending=!a.ascending,a.sort()}}}}),e=function(a,b){return!(a.hasClass("dont-export")||a.hasClass("dont-export-true")||b&&a.css("display")==="none")},d=function(b,c){var f,g,h;c==null&&(c=!1);if(!e(b,c))return"";h=angular.element(b).scope();if(h.elementToString){g=h.elementToString(b,c);if(g||typeof g=="string")return g}return f=!1,g="",b.children().each(function(){var b;return b=d(a(this),c),g+=b,f=!0}),f?g:b.text()},g=function(b,c){var f;return c==null&&(c=!1),f=[],b.children().each(function(){var b;b=a(this);if(!e(b,c))return;if(this.tagName!=="TD"&&this.tagName!=="TH")return;return f.push(d(b,c))}),f},f.directive("editableTable",["$parse",function(d){return{template:templates.editableTable(),restrict:"AE",replace:!0,transclude:!0,scope:{model:"=",addItem_:"&addItem",removeItem_:"&removeItem",canRemoveItem_:"&canRemoveItem",visible_:"@visible",reorders:"@reorders",tableClass_:"@tableClass",rowClicked_:"&rowClicked"},link:{post:function(f,h,i){var j,k,l,m,n,o,p,q,r;l=h.find("th").not(".controls"),o=l.length,j=a(templates.editableTcontext({id:f.tableId,n:o})).appendTo(a("body")),f.$watch(function(){return i.showGear},function(a){return f.showGear=a!=null?d(a)(f.$parent):!0}),f.$watch(function(){return i.tableClass},function(a){return f.tableClass=a!=null?a:"table table-striped table-bordered"}),f.$on("$destroy",function(){return j.remove()}),f.canRemoveItem=function(a,b){return i.canRemoveItem==null?i.removeItem!=null:f.canRemoveItem_({o:a,index:b})},m=function(b,d){var f,i,j,k,l,m,n,o,p,q,r,s;b==null&&(b=","),d==null&&(d="table.csv"),i=[],h.find("tr").each(function(){var b;b=a(this);if(!e(b,!0))return;return i.push(g(b,!0))}),o="";for(k=p=0,r=i.length;p<r;k=++p){n=i[k],k&&(o+="\r\n");for(l=q=0,s=n.length;q<s;l=++q)f=n[l],l&&(o+=b),/[\t\n,;"]/.test(f)?o+='"'+f.replace(/"/g,'""')+'"':o+=f}return j=c.encode(o),m=a('<a id="downloader" download="'+d+'" href="data:application/octet-stream;base64,'+j+'"></a>').appendTo(a("body")),m[0].click(),m.remove()},h.find("thead").contextmenu({target:".context-menu-"+f.tableId,before:function(b,c,d){var e;return e=g(c.find("tr")),j.find("li.hide-row").each(function(b,c){var d,g,h;return d=a(c),g=parseInt(d.data("index")),d.find(".item-label").html(e[g]),h=d.find("i"),f.visible[g]?(h.removeClass("fa-square-o"),h.addClass("fa-check-square-o")):(h.removeClass("fa-check-square-o"),h.addClass("fa-square-o"))}),!0},onItem:function(a,c){var d;d=parseInt(c.data("index")),isNaN(d)&&(d=parseInt(c.parents("li").data("index")));if(!isNaN(d))return b.safeApply(f,function(){f.visible[d]=!f.visible[d];if(!_.reduce(f.visible,function(a,b){return a||b},!1))return f.visible[d]=!f.visible[d]});if(c.hasClass("export-csv-comma")||c.parents(".export-csv-comma").length)return m(",","table-colons.csv");if(c.hasClass("export-csv-semicolon")||c.parents(".export-csv-semicolon").length)return m(";","table-semicolons.csv")}}),f.visible==null&&(f.visible=[]);while(f.visible.length<o)f.visible.push(!0);f.$watch("visible_",function(a){var b,c,e,g;c=d(a),e=f.$parent,g=c(e),!(g&&g instanceof Array)&&c.assign&&(b=[],c.assign(e,b),g=b);if(g){while(g.length<o)g.push(!0);return f.visible=g}}),f.clearAutoCell=function(b){return f.auto!==null&&a(b[f.auto]).removeClass("a-width"),f.auto=null},f.updateAutoCell=function(b){var c,d,e,g,h,i,j,k;h=1000001,c=null;for(g=j=0,k=b.length;j<k;g=++j){e=b[g];if(!f.visible[g])continue;d=a(e);if(d.hasClass("auto-width")){c=null;break}i=d.data("autoIndex"),isNaN(i)&&(i=1e6-d.width()),i<h&&(h=i,c=g)}return c!==null&&a(b[c]).addClass("a-width"),f.auto=c},r=[];for(n=p=0,q=l.length;p<q;n=++p)k=l[n],r.push(function(b,c){return f.$watch("visible["+b+"]",function(b,d){var e;return e=h.find("th").not(".controls"),f.clearAutoCell(e),f.updateAutoCell(e),b?a(c).removeClass("hidden-true"):a(c).addClass("hidden-true")}),f.$watch(function(){var d,e,g,h;if(!f.rowHovered)return 1;if(f.hover)return 1;if(a(c).css("display")==="none")return 1;for(d=e=g=b+1,h=l.length;g<=h?e<h:e>h;d=g<=h?++e:--e)if(a(l[d]).css("display")!=="none")return 1;return 2},function(a){return c.setAttribute("colspan",a)})}(n,k));return r}},controller:["$scope","$element",function(a,b){this.scope=a,a.tableId="tid"+Math.round(Math.random()*1e4),a.hover=!1,a.rowHovered=0}]}}]),f.directive("editableHeadTransclude",function(){return{require:"^editableTable",link:{post:function(c,d,e){return d.find("thead").hover(function(){return b.safeApply(c,function(){var b;if(!c.showGear)return;return c.hover=!0,c.rowHovered++,c.headId="id"+Math.round(Math.random()*1e4),b=d.find("th:visible:last"),b.addClass("squeezedElement"),a(templates.editableTh({id:c.headId,tableId:c.tableId,width:b.width()})).appendTo(d.find("thead tr")).find("i.close.fa-cog").click(function(a){return setTimeout(function(){return d.find("thead").contextmenu("show",a)},1)})})},function(){return b.safeApply(c,function(){if(!c.hover)return;return c.hover=!1,c.rowHovered--,d.find(".controls").hide(),d.find(".squeezedElement").removeClass("squeezedElement"),d.find("#"+c.headId).remove()})})}},controller:["$transclude","$element",function(a,b){return a(function(a){return b.append(a)})}]}}),f.directive("editableTbody",function(){return{template:templates.editableTbody(),transclude:!0,restrict:"AE",require:"^editableTable",link:function(a,c,d,e){return a.getScope=function(){return e.scope},a.removeItem=function(a){var b;return b=e.scope.removeItem_,b?b({index:a}):e.scope.model.splice(a,1)},a.$watch(function(){return d.addItemLabel},function(){return a.addLabel=d.addItemLabel}),a.addItem=function(){return e.scope.addItem_(),setTimeout(function(){var a;if(a=b.focusableElement(c.find("tr:nth-last-child(2)")))return a.focus()},1)},a.rowClicked=function(a){return e.scope.rowClicked_({$index:a})}}}}),f.directive("editableScriptTransclude",function(){return{require:"^editableTable",compile:function(c,d,e){return e(c,function(b){var d,e,f,g,h,i,j;d=a(b).filter("script").text().replace(/&lt;/gi,"<").replace(/&gt;/gi,">"),c.append(d),f=c.children("td").not(".controls"),j=[];for(g=h=0,i=f.length;h<i;g=++h)e=f[g],e.setAttribute("colspan","{{noColumns(hover, "+g+")}}"),j.push(a(e).addClass("hidden-{{!visible("+g+")}}"));return j}),{post:function(c,d,e,f){var g,h,i,j,k,l,m,n,o,p;return m=d.children("td").not(".controls"),c.noColumns=function(b,c){var d,e,g,h,i;if(b)return 1;if(!f.scope.rowHovered)return 1;d=m[c];if(a(d).css("display")==="none")return 1;for(e=g=h=c+1,i=m.length;h<=i?g<i:g>i;e=h<=i?++g:--g)if(a(m[e]).css("display")!=="none")return 1;return 2},c.visible=function(a){try{return f.scope.visible[a]}catch(b){return!0}},c.mouseEnter=function(){if(c.hover)return;if(!f.scope.canRemoveItem(c.o,c.$index))return;return c.hover=!0,f.scope.rowHovered++,c.id="id"+Math.round(Math.random()*1e4),setTimeout(function(){var e;return e=d.find("td:visible:last"),e.addClass("squeezedElement"),a(templates.editableTd({id:c.id,width:e.width(),tableId:f.scope.tableId})).appendTo(d).find("i.close").click(function(){return b.safeApply(c,function(){return c.removeItem(c.$index)})})},0)},c.mouseLeave=function(){if(!c.hover)return;return c.hover=!1,f.scope.rowHovered--,setTimeout(function(){return d.find(".squeezedElement").removeClass("squeezedElement"),d.find("#"+c.id).remove()},0)},i=null,n=function(b,c){var e,f,g,h,i,j,k,l,m,n;l=d.parent(),n=l.children(),k=n.length-1;if(!k)return null;h=a(n[k-1]),i=h.offset().top+h.outerHeight();if(c>i+10)return null;m=l.offset();if(c<m.top-10)return null;if(b<m.left||b>m.left+l.outerWidth())return null;e=0,f=k;while(e<f)j=e+f>>1,g=a(n[j]),c<g.offset().top+g.outerHeight()/2?f=j:e=j+1;return{index:f,y:f===k?i:a(n[f]).offset().top}},g=null,h=null,j=k=0,l=null,p=function(a){var b;g&&(g.css("left",a.pageX-j),g.css("top",a.pageY-k));if(h)return b=n(a.pageX,a.pageY),b&&(b.index===l||b.index===l+1)&&(b=null),i&&!b?h.css("display","none"):b&&!i&&h.css("display","block"),b&&h.css("top",b.y+"px"),i=b},o=f.scope,d.on("draginit",function(a){return o.reorders?d:!1}),d.on("dragstart",function(b){var c,e,f;return o.reorders?(f=d.parents("table"),l=d.index(),c=window.pageXOffset,e=window.pageYOffset,html2canvas(d[0],{scale:window.devicePixelRatio?window.devicePixelRatio:1,onrendered:function(f){var i,l,m,n,o,q,r,s,t,u,v;window.scrollTo(c,e),q=f.getContext("2d"),s=function(a){var b;return b=parseInt(a),isNaN(b)?0:b},v=d.find("td:visible"),i={left:s(v.css("border-left-width"))+s(d.css("border-left-width")),right:s(v.last().css("border-right-width"))+s(d.css("border-right-width")),top:s(v.css("border-top-width"))+s(d.css("border-top-width")),bottom:s(v.css("border-bottom-width"))+s(d.css("border-bottom-width"))},t=d.offset(),o=d.outerWidth(),n=d.outerHeight(),u={x:f.width/o,y:f.height/n},m={width:o-i.left-i.right,height:n-i.top-i.bottom},t.left=i.left*u.x,t.top=i.top*u.y,t.width=m.width*u.x,t.height=m.height*u.y,l=document.createElement("canvas"),g=a(l),g.attr("width",t.width),g.attr("height",t.height),g.css("width",m.width),g.css("height",m.height),l.getContext("2d").drawImage(f,-t.left,-t.top),g.css("border","1px solid #dddddd"),g.css("position","absolute"),g.css("opacity","0.6"),r=d.offset(),j=b.pageX-r.left,k=b.pageY-r.top,d.css("opacity","0.4"),h=a(document.createElement("div")),h.css("position","absolute"),h.css("border","1px solid #0088cc"),h.css("border-radius","1px"),h.css("width",d.outerWidth()),h.css("left",d.offset().left),h.css("display","none"),p(b),a(document.body).append(h),a(document.body).append(g)}}),h):!1}),d.on("drag",{distance:4},function(a){p(a)}),d.on("dragend",function(a){var c;g&&(g.remove(),g=null),d.css("opacity","1"),h&&(h.remove(),h=null),o.reorders&&i&&(c=i.index,c>l&&c--,c!==l&&b.safeApply(o,function(){var a,b;return a=o.model,b=a.splice(l,1)[0],a.splice(c,0,b)}))})}}}}})})}).call(this)