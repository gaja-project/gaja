try{
var s_Hrb=function(a){this.Fj=a};

}catch(e){_DumpException(e)}
try{
s_a("aLUfP");

var s_Vm=function(a){s_D.call(this,a.Ka);var b=this;this.window=a.service.window.get();this.wa=this.Fj();this.oa=window.orientation;this.ka=function(){var c=b.Fj(),d=b.T6a()&&90===Math.abs(window.orientation)&&b.oa===-1*window.orientation;b.oa=window.orientation;if(c!==b.wa||d){b.wa=c;d=s_e(b.Ud);for(var e=d.next();!e.done;e=d.next()){e=e.value;var f=new s_Hrb(c);try{e(f)}catch(g){s_ca(g)}}}};this.Ud=new Set;this.window.addEventListener("resize",this.ka);this.T6a()&&this.window.addEventListener("orientationchange",
this.ka)};s_o(s_Vm,s_D);s_Vm.hb=s_D.hb;s_Vm.Ea=function(){return{service:{window:s_cj}}};s_Vm.prototype.addListener=function(a){this.Ud.add(a)};s_Vm.prototype.removeListener=function(a){this.Ud.delete(a)};
s_Vm.prototype.Fj=function(){if(s_Irb()){var a=s_Xg(this.window);a=new s_Fg(a.width,Math.round(a.width*this.window.innerHeight/this.window.innerWidth))}else a=this.Yb()||(s_Ka()?s_Irb():this.window.visualViewport)?s_Xg(this.window):new s_Fg(this.window.innerWidth,this.window.innerHeight);return a.height<a.width};s_Vm.prototype.destroy=function(){this.window.removeEventListener("resize",this.ka);this.window.removeEventListener("orientationchange",this.ka)};
var s_Irb=function(){return s_Ka()&&s_6e.IB()&&!navigator.userAgent.includes("GSA")};s_Vm.prototype.Yb=function(){return s_Jrb};s_Vm.prototype.T6a=function(){return"orientation"in window};var s_Jrb=!1;s_dj(s_XBa,s_Vm);

s_Jrb=!0;

s_b();

}catch(e){_DumpException(e)}
// Google Inc.
