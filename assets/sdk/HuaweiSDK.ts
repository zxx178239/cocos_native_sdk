/*
 * @Author: xxZhang
 * @Date: 2020-01-07 17:30:05
 * @Description: 
 */
import { QuickGameSDKBase } from "./QuickGameSDKBase";

export class HuaweiSDK extends QuickGameSDKBase {
    public quickGameLogin(INCallback) {
        hbs.gameLogin({
            forceLogin: 1,      // 强制登录
            appid: "1234567",
            success: function(res) {
                console.log("on gamelogin success: " + res);
                INCallback && INCallback(res);
            },
            fail: function(data, code) {
                console.log("on gamelogin fail " + data + " " + code);
                INCallback && INCallback(data, code);
            },
            complete: function() {
                console.log("on gamelogin complete");
            }
        })
    }
}
