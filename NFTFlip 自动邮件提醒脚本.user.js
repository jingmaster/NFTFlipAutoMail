// ==UserScript==
// @name         NFTFlip 自动邮件提醒脚本
// @namespace    成都3年java开发找工作，要人的联系我啊！作者还没班上！！
// @version      0.0.1
// @description  基于nftflip.ai平台的自动发送邮件插件脚本代码透明无任何钱包秘钥问题。因为作者老是错过nft出货时间，这个脚本诞生了。后期会考虑加入其它发送邮件的条件
// @author       JingMaster  Twitter：@EEck16 群内昵称：靖靖靖
// @match        https://review.nftflip.ai/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nftflip.ai
// @grant        none
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// ==/UserScript==

(function() {
    //全局变量
    //定义时间对象
    let time = new Date();
    //定义上一封邮件发送的日期（别动）
    var startSendMailDate = '1990/1/1 00:00:00';
    //现在的日期（别动）
    var nowTime='';
    //定义是否需要发送邮件（别动）
    var isSend = false;
    //发送的间隔（别动）
    var timeInterval='';
    //定义发送短信排名(不包括 如设置6 排名12345 会邮件提醒)
    var rank = 6;
    //控制台输出前缀（自定义）
    var msg='您拥有的NFT 实时排名\n';
    //定义邮件时间间隔(分钟 推荐15分钟以上)
    var mailTime=30;
    //定义轮询间隔(毫秒，可自定义 推荐10000 1s=1000ms)
    var executeTime=10000;
    //接收者邮箱《需要用户更改》
    var to ='xx@xx.com';
    //发送者邮箱《需要用户更改》
    var from = 'xx@xx.com';
    //smtp服务秘钥（自行注册，自己用自己的最好 ）《需要用户更改》
    var secureToken='';
    //邮件主题(自定义)
    var subject= 'Nft出货自动提醒！！！';
    //邮件内容(自定义)
    var mailBody = `<span>该出货了，该出货了<br/>`+'文字都能自定义'+`<br/></span>`;
   //请不要修改以下代码
    var Email = {
        send: function (a)
        { return new Promise(function (n, e)
        { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) })
        }, ajaxPost: function (e, n, t)
        { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }
         , ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () {
        var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) {
        var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };



   setInterval(function () {
    var itemClass = document.getElementsByClassName("bar-t-green-c");
    var s=$(itemClass[0]).parent().parent().children("td").eq(0).text();
    if(itemClass.length==0){
        console.log(time.toLocaleString()+'\n没有监控到拥有的nft进入排行榜');
        console.log('上一次邮件提醒时间为'+startSendMailDate);
       return;
       }
    var itemArr = [];
    for(var i = 0; i< itemClass.length; i++){
			itemArr.push(itemClass[i]);
		}
	var numList = [];
    for(var j = 0; j< itemArr.length; j++){
			numList.push($(itemArr[j]).parent().parent().children("td").eq(0).text());
		}
       for(var  k= 0; k< itemArr.length; k++){
			msg+=numList[k]+'名\n';
           if(numList[k]<rank){
              isSend=true;
           }
		}
       console.log(msg+'\n上一次邮件提醒时间为'+startSendMailDate)
       if(isSend){
           let nowtime = new Date()
           nowTime=nowtime.toLocaleString();
           timeInterval = GetDateDiff(startSendMailDate,nowTime,'\/1000\/60')/1000/60;
           console.log('间隔时间'+timeInterval);
           if(timeInterval<mailTime){
               msg='您拥有的NFT 实时排名\n';
               isSend=false;
               return;
           }
           let aftertime = new Date()
           startSendMailDate = aftertime.toLocaleString();
           sendEmailToMe();
           console.log(startSendMailDate+'\n已发送到'+to+'邮件箱提醒')
           isSend=false;
       }
       msg='您拥有的NFT 实时排名\n';
}, executeTime);

function GetDateDiff(startTime, endTime, diffType) {
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    diffType = diffType.toLowerCase();
    var sTime =new Date(startTime);
    var eTime =new Date(endTime);
    var timeType =1;
    switch (diffType) {
        case"second":
            timeType =1000;
        break;
        case"minute":
            timeType =1000*60;
        break;
        case"hour":
            timeType =1000*3600;
        break;
        case"day":
            timeType =1000*3600*24;
        break;
        default:
        break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}

function sendEmailToMe() {
  Email.send({
  SecureToken:secureToken,
  To: to,
  From: from,
  Subject: subject,
  Body: mailBody
}).then(
  message => {
    if (message == 'OK') {
    } else {
		console.error(message)
	}
  }
);
 }

})();
