import {SDKMgr} from "../sdk/SDKManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AppManager extends cc.Component {

    sdkMgr: any = null;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        (<any>window).app = this;

        this.sdkMgr = SDKMgr;
    }

    start () {

    }
}
