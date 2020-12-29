<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\ValidationData;
class BaseController extends Controller
{
    private static $_config=[
        'id'=>'4f1g23a12aa',//id 号
        'issuer'=>'http://www.house1.com/',//签发人
        'beuser'=>'http://www.house1.com/',//被授权人
        'signer'=>'98a7f27a6191fd56efa1a965573da919',//盐值
    ];

    /**
     * 获取token
     * @param $user_id
     * @return string
     */
    public static function setToken($user_id)
    {
        $signer = new Sha256();
        $time = time();
        $token = (new Builder())->issuedBy(self::$_config['issuer']) // Configures the issuer (iss claim)
        ->canOnlyBeUsedBy(self::$_config['beuser']) // Configures the audience (aud claim)
        ->identifiedBy(self::$_config['id'], true) // Configures the id (jti claim), replicating as a header item
        ->issuedAt($time) // Configures the time that the token was issue (iat claim)
        ->canOnlyBeUsedAfter($time -1) // Configures the time that the token can be used (nbf claim)
        ->expiresAt($time + 3600) // Configures the expiration time of the token (exp claim)
        ->with('uid', $user_id) // Configures a new claim, called "uid"
        ->sign($signer,self::$_config['signer']) // creates a signature using your private key
        ->getToken(); // Retrieves the generated token

        return (string)$token;
    }

    public static function getUserid($token)
    {
        $user_id=null;//先设定token为空
        $token=(new Parser())->parse((string)$token);
        $data = new ValidationData(); // It will use the current time to validate (iat, nbf and exp)
        $data->setIssuer(self::$_config['issuer']);//验证签发人
        $data->setAudience(self::$_config['beuser']);//验证授权人
        $data->setId(self::$_config['id']);//验证token标识
        if(!$token->validate($data)){
            //token验证失败
            return $user_id;
        }
        //验证签名
//        $signer = new Sha256();
//        if (!$token->verify($signer, self::$_config['signer'])) {
//            //签名验证失败
//            return $user_id;
//        }
        //从token中获取用户id
        return $token->getClaim('uid');
    }

}
