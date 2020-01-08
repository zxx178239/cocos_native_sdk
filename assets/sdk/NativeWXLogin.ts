
export class NativeWXLogin {

    wechatLogin() {
        jsb.reflection.callStaticMethod("net/sourceforge/simcpux/wxapi/PlatformSystem", "wechatLoginWithAppID", "(Ljava/lang/String;)V", "wxcea5692b6cc9ce2d");//调用java代码进行微信登录
        this.getAccessTokenByCode();    //根据java返回的code获得accessToken
    }

    //获取微信登录所必须的code
    getWechatCode() {
        var self = this;
        var isGetCode;
        var code;
        //发送获得code的请求
        return new Promise(function(resolve,reject){
            console.log("进入Promise");
            //java端微信请求是有延迟的在这里我们等待获取code的状态为true的时候在获取code
            setTimeout(() => {
                isGetCode = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getCodeSuccess", "()Z");
                console.log("isGetCode is " ,isGetCode);
                if(isGetCode){
                    console.log("------------>",isGetCode);
                    //取消所有计时器
                    // self.unscheduleAllCallbacks();
                    //如果获得code证明是成功获得微信的响应
                    code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getCode", "()Ljava/lang/String;");
                    console.log("==============>>code is " + code);
                    resolve(code);
                }
            }, 500);
        });
    }

    getAccessTokenByCode() {
        var self = this;
        this.getWechatCode().then(function(code){ //获取微信code的承诺返回了正常的结果
            console.log("已经获得code");
            console.log("in AccessTokenByCode " + code);
            self.getAccessToken(code);
        });
    }

    getAccessToken(code) {        //获取accessToken
        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxcea5692b6cc9ce2d&secret=0ba704036d3997d8dd881b5ee8363393&code=" + code + "&grant_type=authorization_code";
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log("response===>>>",response);
                var msg = JSON.parse(response);
                var access_token = msg.access_token;
                var refresh_token = msg.refresh_token;
                var openid = msg.openid;
                //如果超时进行重新刷新accessToken
                if(msg.expires_in >= 7200){
                    //刷新accesstoken
                    self.freshAccessToken(refresh_token).then(function(data){
                       console.log("刷新accessToken 是",data);
                       access_token = data;
                       self.getUserInfo(access_token,openid);
                       cc.director.loadScene("Main");
                    });
                    console.log("这个accessToken是刷新出来的token",access_token);
                }else{
                    self.getUserInfo(access_token,openid);
                    cc.director.loadScene("Main");
                }
                
            }
        };
        xhr.open("GET",url,true);
        xhr.send();
    }

    getUserInfo(access_token,openid) {       //获取用户信息
        console.log("accessToken is " + access_token);
        console.log("openid is " + openid);
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token="+access_token + "&openid="+openid;
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log("response===>>>",response);
                var msg = JSON.parse(response);
                console.log("msg is " , msg);
                console.log("nickName is " + msg.nickname);
                console.log("city is " + msg.city);
                console.log("country " + msg.country);
                console.log("sex is  " + msg.sex);
            }
        };
        xhr.open("GET",url,true);
        xhr.send();
 
    }

    freshAccessToken(refresh_token) {
        var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=wxcea5692b6cc9ce2d&grant_type=refresh_token&refresh_token="+refresh_token;
        var self = this;
        var xhr = new XMLHttpRequest();
        var ac;
        return new Promise(function(resolve,reject){
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log("response===>>>",response);
                    var msg = JSON.parse(response);
                    ac = msg.access_token;
                    console.log("ac is " + ac);
                    resolve(ac);
                }
            };
            xhr.open("GET",url,true);
            xhr.send();
        });
        
    }
}