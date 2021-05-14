/*------------------------------------------------------*/
/*                   修改控件的配置信息                                                                    */
/*------------------------------------------------------*/
//64位控件的calssid
var classidx64="A64E3073-2016-4baf-A89D-FFE1FAA10EE0";
//32位控件的classid
var classid="A64E3073-2016-4baf-A89D-FFE1FAA10EC0";
//32位控件包的路径
var codebase="OfficeControl/OfficeControl.cab#version=5,0,3,1";
//64位控件包的路径
var codebase64="OfficeControl/OfficeControlx64.cab#version=5,0,3,1";
//控件手动安装包路径
var codebaseExe="OfficeControl/评测专用演示版本EC05031.exe";
//设置高度
var height="100%";
//设置宽度
var width="100%";
//买断授权密钥如果不是买断可以不用写
var MakerCaption=""; 
//买断授权密钥如果不是买断可以不用写
var MakerKey="";
//密钥
var ProductCaption="";
//密钥
var ProductKey="";
 
/*------------------------------------------------------*/
/*             以下内容 请勿修改，否则可能出错                                                              */
/*------------------------------------------------------*/
var userAgent = navigator.userAgent, 
	rMsie = /(msie\s|trident.*rv:)([\w.]+)/, 
	rFirefox = /(firefox)\/([\w.]+)/, 
	rOpera = /(opera).+version\/([\w.]+)/, 
	rChrome = /(chrome)\/([\w.]+)/, 
	rSafari = /version\/([\w.]+).*(safari)/;
var browser;
var version;
var ua = userAgent.toLowerCase();
function uaMatch(ua) {
	var match = rMsie.exec(ua);
	if (match != null) {
		return { browser : "IE", version : match[2] || "0" };
	}
	var match = rFirefox.exec(ua);
	if (match != null) {
		return { browser : match[1] || "", version : match[2] || "0" };
	}
	var match = rOpera.exec(ua);
	if (match != null) {
		return { browser : match[1] || "", version : match[2] || "0" };
	}
	var match = rChrome.exec(ua);
	if (match != null) {
		return { browser : match[1] || "", version : match[2] || "0" };
	}
	var match = rSafari.exec(ua);
	if (match != null) {
		return { browser : match[2] || "", version : match[1] || "0" };
	}
	if (match != null) {
		return { browser : "", version : "0" };
	}
}
var browserMatch = uaMatch(userAgent.toLowerCase());
if (browserMatch.browser) {
	browser = browserMatch.browser;
	version = browserMatch.version;
}
//删除左右两端的空格
function trim(str){ 
 return str.replace(/(^\s*)|(\s*$)/g, "");
}
//document.write(browser);
/*
谷歌浏览器事件接管
*/
function OnComplete2(type,code,html)
{
	TANGER_OCX_OBJ.ShowTipMessage("提示",trim(html));
}
function OnBeginOpenFromURL(type,code)
{
	
}
function OnComplete3(str,doc)
{
	IsFileOpened=true;
}
function OnComplete4(str){
	//alert(str);
}
function publishashtml(type,code,html){
	//alert(html);
	//alert("Onpublishashtmltourl成功回调");
}
function publishaspdf(type,code,html){
//alert(html);
//alert("Onpublishaspdftourl成功回调");
}
function saveasotherurl(type,code,html){
//alert(html);
//alert("SaveAsOtherformattourl成功回调");
}
function dowebget(type,code,html){
//alert(html);
//alert("OnDoWebGet成功回调");
}
function webExecute(type,code,html){
//alert(html);
//alert("OnDoWebExecute成功回调");
}
function webExecute2(type,code,html){
//alert(html);
//alert("OnDoWebExecute2成功回调");
}
function FileCommand(TANGER_OCX_str,TANGER_OCX_obj){
	
}

if (browser=="IE"){
	//alert(window.navigator.platform);
	if(window.navigator.platform=="Win32"){
	
		document.write('<!-- 用来产生编辑状态的ActiveX控件的JS脚本-->   ');
		document.write('<!-- 因为微软的ActiveX新机制，需要一个外部引入的js-->   ');
		document.write('<object id="TANGER_OCX" classid="clsid:'+classid+'"');
		document.write('codebase="'+codebase+'" width="'+width+'" height="'+height+'">   ');		
		document.write('<param name="MakerCaption" value="'+MakerCaption+'">   ');
		document.write('<param name="MakerKey" value="'+MakerKey+'">   ');
		document.write('<param name="ProductCaption" value="'+ProductCaption+'">   ');
		document.write('<param name="ProductKey" value="'+ProductKey+'">   ');	
		document.write('<param name="IsUseUTF8URL" value="-1">   ');
		document.write('<param name="IsUseUTF8Data" value="-1">   ');
		document.write('<param name="Caption" value="NTKO OFFICE文档控件示例演示 http://www.ntko.com">   ');
		document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
		document.write('</object>');	
	}
	if(window.navigator.platform=="Win64"){

		document.write('<!-- 用来产生编辑状态的ActiveX控件的JS脚本-->   ');
		document.write('<!-- 因为微软的ActiveX新机制，需要一个外部引入的js-->   ');
		document.write('<object id="TANGER_OCX" classid="clsid:'+classidx64+'"');
		document.write('codebase="'+codebase64+'" width="'+width+'" height="'+height+'">   ');
		document.write('<param name="MakerCaption" value="'+MakerCaption+'">   ');
		document.write('<param name="MakerKey" value="'+MakerKey+'">   ');
		document.write('<param name="ProductCaption" value="'+ProductCaption+'">   ');
		document.write('<param name="ProductKey" value="'+ProductKey+'">   ');	
		document.write('<param name="IsUseUTF8URL" value="-1">   ');
		document.write('<param name="IsUseUTF8Data" value="-1">   ');
		document.write('<param name="Caption" value="NTKO OFFICE文档控件示例演示 http://www.ntko.com">   ');
		document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
		document.write('</object>');			
	}	
}
else if (browser=="firefox"){ 	
		document.write('<object id="TANGER_OCX" type="application/ntko-plug"  codebase="'+codebase+'" width="'+width+'" height="'+height+'" ForOnSaveToURL="ntkosavetourl"  ForOndocumentopened="ntkoondocumentopened"');		
		document.write('ForOnpublishAshtmltourl="ntkopublishashtml"');
		document.write('ForOnpublishAspdftourl="ntkopublishaspdf"');
		document.write('ForOnSaveAsOtherFormatToUrl="ntkosaveasotherurl"');	
		document.write('_MakerCaption="'+MakerCaption+'"  ');
		document.write('_MakerKey="'+MakerKey+'"  ');
		document.write('_ProductCaption="'+ProductCaption+'"  ');
		document.write('_ProductKey="'+ProductKey+'"   ');			
		document.write('clsid="{'+classid+'}" >');
		document.write('<SPAN STYLE="color:red">尚未安装NTKO Web FireFox跨浏览器插件</SPAN>   ');
		document.write('</object>   ');
}else if(browser=="chrome"){
		document.write('<object id="TANGER_OCX" clsid="{'+classid+'}"  ForOnSaveToURL="ntkosavetourl"  ForOndocumentopened="ntkoondocumentopened"');
		document.write('ForOnpublishAshtmltourl="ntkopublishashtml"');
		document.write('ForOnpublishAspdftourl="ntkopublishaspdf"');
		document.write('ForOnSaveAsOtherFormatToUrl="ntkosaveasotherurl"');
		document.write('_IsUseUTF8URL="-1"   ');
		document.write('_IsUseUTF8Data="-1"   ');
		document.write('_MakerCaption="'+MakerCaption+'"  ');
		document.write('_MakerKey="'+MakerKey+'"  ');
		document.write('_ProductCaption="'+ProductCaption+'"  ');
		document.write('_ProductKey="'+ProductKey+'"   ');	
		document.write('codebase="'+codebase+'" width="'+width+'" height="'+height+'" type="application/ntko-plug" ');
		document.write('<SPAN STYLE="color:red">尚未安装NTKO Web Chrome跨浏览器插件</SPAN>   ');
		document.write('</object>');
	}else if (Sys.opera){
		alert("sorry,ntko web印章暂时不支持opera!");
	}else if (Sys.safari){
		 alert("sorry,ntko web印章暂时不支持safari!");
	}