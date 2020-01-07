import { SDKMgr } from "../sdk/SDKManager";

/*
 * @Author: xxZhang
 * @Date: 2020-01-06 13:28:01
 * @Description: 微信登录按钮
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class WXLoginButton extends cc.Component {

    start () {

    }

    onPressButton() {
        if(cc.sys.isNative) {
            SDKMgr.nativeWXLogin();
        }else {

        }
    }
}
