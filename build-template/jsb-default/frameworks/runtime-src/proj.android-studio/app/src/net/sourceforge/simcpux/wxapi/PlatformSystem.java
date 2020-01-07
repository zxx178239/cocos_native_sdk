package net.sourceforge.simcpux.wxapi;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import net.sourceforge.simcpux.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import cn.smssdk.SMSSDK;

public class PlatformSystem extends AppActivity {

    // 供给cocos端调用的登录接口 begin
    // 微信登录
    public static void wechatLoginWithAppID(String appId) {
        if (appId == null || appId.length() == 0)
            return;
        IWXAPI api = WXAPIFactory.createWXAPI(PlatformSystem.getContext(), appId);
        api.registerApp(appId);

        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";              // 获取个人信息的权限
        req.state = "1244232323232";                // 防止攻击的一组随机数字
        api.sendReq(req);                           // 向微信发送请求
    }

    // 微信分享
    // 分享链接
    public static void wechatShareLink(String appId, String link, String title, String desc, String scene) {
        final IWXAPI api = WXAPIFactory.createWXAPI(PlatformSystem.getContext(), appId);
        api.registerApp(appId);

        WXWebpageObject webPage = new WXWebpageObject();
        webPage.webpageUrl = link;
        WXMediaMessage msg = new WXMediaMessage(webPage);
        msg.title = title;
        msg.description = desc;

        // 图标
        Bitmap bitmap = BitmapFactory.decodeResource(PlatformSystem.getContext().getResources(), R.mipmap.ic_launcher);
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bitmap, 80, 80, true);
        bitmap.recycle();

        // 位图转数组
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        thumbBmp.compress(Bitmap.CompressFormat.PNG, 100, stream);
        byte[] byteArray = stream.toByteArray();

        msg.thumbData = byteArray;

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("webpage");
        req.message = msg;
        req.scene = Integer.parseInt(scene);
//        if (type == 1) {
//            req.scene = SendMessageToWX.Req.WXSceneSession;
//        }else {
//            req.scene = SendMessageToWX.Req.WXSceneTimeline;
//        }
        api.sendReq(req);
    }

    public static String buildTransaction(String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    // 手机号获取验证码
    public static void onGetMobileCode(String mobileNum) {
        SMSSDK.getVerificationCode("86", mobileNum);
    }

    public static void onVerifyCodeToLogin(String mobileNum, String code) {
        SMSSDK.submitVerificationCode("86", mobileNum, code);
    }

    // 供给cocos端调用的登录接口 end

    // 用获取到的code进行操作，即微信登录成功的回调，处理一些其他操作
    public static void onWXLoginCode(final String code) {
        ((Cocos2dxActivity)Cocos2dxActivity.getContext()).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("app.sdkMgr.wxLoginCallback && app.sdkMgr.wxLoginCallback('" + code + "') ");
            }
        });
    }

    public static void onWXShareCallback(final int errCode, final String openId) {
        ((Cocos2dxActivity)Cocos2dxActivity.getContext()).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("app.sdkMgr.wxShareCallback && app.sdkMgr.wxShareCallback(" + errCode + ",'" + openId + "')");
            }
        });
    }

    public static void onMobileVerifyCallback(final int errCode) {
        ((Cocos2dxActivity)Cocos2dxActivity.getContext()).runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("app.sdkMgr.mobileLoginCallback && app.sdkMgr.mobileLoginCallback(" + errCode + "')");
            }
        });
    }
}
