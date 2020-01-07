
/*
 * @Author: xxZhang
 * @Date: 2020-01-06 11:02:17
 * @Description: sdk管理器
 */

import { NativeWXLogin } from "./NativeWXLogin";
import { XiaoMiSDK } from "./XiaoMiSDK";
import { HuaweiSDK } from "./HuaweiSDK";

class SDKManager {
    public static readonly Instance = new SDKManager();

    private _wxLogin = new NativeWXLogin();
    private _quickGameSDK = null;

    constructor() {
        if(!cc.sys.isNative) {
            this._initQuickGameSDK();
        }
    }

    private _initQuickGameSDK() {
        switch(cc.sys.platform) {
            case cc.sys.XIAOMI_GAME:
                this._quickGameSDK = new XiaoMiSDK();
                break;
            case cc.sys.HUAWEI_GAME:
                this._quickGameSDK = new HuaweiSDK();
                break;
            default:
                break;
        }
    }

    // 原生的接口 begin
    public nativeWXLogin() {
        this._wxLogin.wechatLogin();
    }

    // 原生的接口 end

    // 快游戏接口 begin
    public quickGameLogin(INCallback) {
        this._quickGameSDK.quickGameLogin(INCallback);
    }

    // 快游戏接口 end

    // 微信登录回调，实际上这里应该是开始登录游戏服务器，在wx登录成功之后
    public wxLoginCallback(INCode) {
        console.log("wx login call back");
        cc.director.loadScene("Main");
    }

    public wxShareCallback(errCode, openId) {

    }

    // 手机验证码登录回调
    public mobileLoginCallback(errCode) {
        errCode = parseInt(errCode);
        if(errCode) {
            cc.director.loadScene("Main");
        }else {
            // error handle
        }
    }
}

export const SDKMgr = SDKManager.Instance;
