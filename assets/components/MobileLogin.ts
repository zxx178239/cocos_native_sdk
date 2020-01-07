/*
 * @Author: xxZhang
 * @Date: 2020-01-07 10:56:37
 * @Description: 手机验证码登录
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class MobileLogin extends cc.Component {

    @property(cc.Button)
    buttonGetCode: cc.Button            = null;

    @property(cc.Button)
    buttonLogin: cc.Button              = null;

    @property(cc.EditBox)
    editBoxMobile: cc.EditBox           = null;

    @property(cc.EditBox)
    editBoxCode: cc.EditBox             = null;

    start () {
        this.schedule(this.checkButtons, 1);
    }

    onDestroy() {
        this.unschedule(this.checkButtons);
    }

    checkButtons() {

    }

    onPressGetCode() {
        let phoneNum = this.editBoxMobile.string;
        jsb.reflection.callStaticMethod("net/sourceforge/simcpux/wxapi/PlatformSystem", "onGetMobileCode", "(Ljava/lang/String;)V", phoneNum);
    }

    onPressLogin() {
        let phoneNum = this.editBoxMobile.string;
        let code = this.editBoxCode.string;
        jsb.reflection.callStaticMethod("net/sourceforge/simcpux/wxapi/PlatformSystem", "onVerifyCodeToLogin", "(Ljava/lang/String;Ljava/lang/String;)V", phoneNum, code);
    }
}
