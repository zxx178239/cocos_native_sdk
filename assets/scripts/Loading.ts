/*
 * @Author: xxZhang
 * @Date: 2020-01-07 17:11:49
 * @Description: 加载场景
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    labelTitle: cc.Label            = null;

    start () {
        // this.checkLogin();
        this.initLoading();
    }

    initLoading() {
        let labelStr = "";
        if(cc.sys.isNative) {
            labelStr = "原生";
        }else {
            this.quickGameLogin();
            switch(cc.sys.platform) {
                case cc.sys.HUAWEI_GAME:
                    labelStr = "华为快游戏";
                    break;
                case cc.sys.XIAOMI_GAME:
                    labelStr = "小米快游戏";
                    break;
                default: 
                    break;
            }
        }
        this.labelTitle.string = labelStr;
    }

    quickGameLogin() {
        app.sdkMgr.quickGameLogin((...INParams) => {
            this.quickGameLoginCallback(INParams);
        });
    }

    quickGameLoginCallback(...INParams) {
        console.log("quick game login call back");
        for(let i = 0; i < INParams.length; ++ i) {
            console.log(INParams[i]);
        }
    }

    // checkLogin() {
    //     if(cc.sys.platform === cc.sys.XIAOMI_GAME) {
    //         console.log("xiaomi game");
            
    //     }
    // }
}
