/*
 * @Author: xxZhang
 * @Date: 2020-01-07 17:29:55
 * @Description: 
 */
import { QuickGameSDKBase } from "./QuickGameSDKBase";

export class XiaoMiSDK extends QuickGameSDKBase {

    public quickGameLogin(INCallback) {
        qg.login({
            success: function(res) {
                INCallback && INCallback(res);
            },
            fail: function(res) {
                INCallback && INCallback(res);
            }
        })
    }
}
