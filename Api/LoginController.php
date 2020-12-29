<?php

namespace App\Http\Controllers\Api;

use App\Models\Renting;
use App\Models\User;
use Faker\Provider\Base;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;

class loginController extends BaseController
{
    public function Login(Request $request)
    {
        $data = $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ], [
            'username.required' => '账号为必填',
            'password.required' => '密码为必填'
        ]);
        $user = User::where('username', $data['username'])->first();//根据用户名查询数据
        if ($user) { //判断用户名是否存在
            if (password_verify($data['password'], $user->password)) { //验证密码是否正确
                $token = self::setToken($user->id);//解密成token
                $user_id = self::getUserid($token); //解密成id
                return ['status' => 1, 'msg' => '登录成功', 'data' => $token];
                // return $user->id;
            } else {
                return ['status' => -1, 'msg' => '密码错误', 'data' => ''];
            }
        } else {
            return ['status' => -1, 'msg' => '没有该用户', 'data' => ''];
        }
    }

    /**
     * 获取使用者的 appid 和 appSecret
     * @param Request $request
     * @return array
     */
    public function wxLogin(Request $request)
    {
        $appid = 'wx8d6be19a42bab801';//小程序 appId
        $appsecret = 'eaaf2124d06afdfd069582720d0baa72';//	小程序 appSecret
        $code = $request['code'];//接收小程序传过来的code
        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=$appid&secret=$appsecret&js_code=$code&grant_type=authorization_code"; //登录凭证校验
        $json = file_get_contents($url);//获取openid 用户唯一标识  session_key 会话秘钥
        $data = json_decode($json, true);
        $openid = $data['openid'];
        if (!Renting::where('openid', $openid)->first()) {//当数据库中没有openid时选择存入
            Renting::create(['openid' => $openid]);//把该使用者的openID存入数据库
        }

        return ['status' => 200, 'msg' => '成功', 'data' => $data];
    }

}
