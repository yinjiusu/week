<?php

namespace App\Http\Controllers\Api;

use App\Models\Apiuser;
use App\Models\Article;
use App\Models\Collect;
use App\Models\Hous;
use App\Models\Renting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApiuserController extends Controller
{
    /**
     * 存入用户信息
     * @param Request $request
     */
    public function setUserInfo(Request $request)
    {
        $openid = $request['openid'];
        $userinfo = $request['userinfo'];
        $data['nickname'] = $userinfo['nickName'];
        $data['avatar'] = $userinfo['avatarUrl'];
        $data['sex'] = $userinfo['gender'] == '1' ? '先生' : '女士';
        $data['avatar'] = $userinfo['avatarUrl'];
        $res = Renting::where('openid', $openid)->update($data);
        if ($res) {
            return ['status' => 200, 'msg' => '成功', 'data' => ''];
        } else {
            return ['status' => 500, 'msg' => '失败', 'data' => ''];
        }
    }

    /**
     * 实名认证
     * @param Request $request
     * @return array
     */
    public function upCard(Request $request)
    {
        $data = $request->only('form_data')['form_data'];
        $data['is_auth'] = '1';
        $validate = Validator::make($data, [
            'truename' => 'required',
            'card' => 'required|size:18',
            'card_img' => 'required',
        ], [
            'truename.required' => '请填写真实姓名',
            'card.required' => '请填写身份证号',
            'card.size' => '请检查身份证号',
            'card_img.required' => '未选择手持身份证照片',
        ]);
        if ($validate->fails()) { //当有错误信息时 返回第一条错误
            return ['status' => -1, 'msg' => $validate->errors()->first(), 'data' => ''];
        }
        $openid = $request['openid'];
        Renting::where('openid', $openid)->update($data);
        return ['status' => 1, 'msg' => '成功', 'data' => ''];
    }

    /**
     * 修改用户信息
     * @param Request $request
     * @return array
     */
    public function editUserinfo(Request $request)
    {
        $form_data = $request['form_data'];
        $validate = Validator::make($form_data, [
            'nickname' => 'required',
            'phone' => 'required',
            'age' => 'required',
        ], [
            'nickname.required' => '昵称未填写',
            'phone.required' => '手机号未填写',
            'age.required' => '年龄未填写',
        ]);
        if ($validate->fails()) {
            return ['status' => 1, 'errmsg' => $validate->errors()->first(), 'data' => ''];
        }
        $openid = $request['openid'];
        $res = Renting::where('openid', $openid)->update($form_data);
        if ($res) {
            return ['status' => 1, 'msg' => '成功', 'data' => ''];
        } else {
            return ['status' => -1, 'msg' => '失败', 'data' => ''];
        }
    }

    /**
     * 获取用户信息
     * @param Request $request
     * @return array
     */
    public function getUserInfo(Request $request)
    {
        $openid = $request['openid'];
        if(!$openid){
            return ['status' => -1, 'msg' => '参数错误', 'data' => ''];
        }
        $data = Renting::where('openid', $openid)->first()->toArray();
        $data['avatar']=env('APP_URL'). $data['avatar'];
        if ($data['nickname']){
            return ['status' => 1, 'msg' => '成功', 'data' => $data];
        } else {
            return ['status' => -1, 'msg' => '失败', 'data' => ''];
        }
    }

    /**
     * 照片上传
     * @param Request $request
     */
    public function upFile(Request $request)
    {
//        $openid = $request['openid'];
        $path = $request->file('file')->store('idcard');
//        $idcard_url = "/idcard/" . $path;
        if ($path) {
            return "/".$path;//返回图片地址
        } else {
            return ['status' => -1, 'msg' => 'Sorry! ...... ', 'url' => ''];
        }
    }

    /**
     * 添加收藏
     * @param Request $request
     * @return array
     */
    public function addCollect(Request $request)
    {
        $typeid=$request['typeid'];//获取id
        $type=$request['type'];//获取收藏类型
        $openid=$request['openid'];//用户的openid
        if(!$type||!$typeid||!$openid){//判断参数为空时
            return ['status'=>-1,'msg'=>'参数出错','data'=>''];
        }
        try{
            $data['typeid']=$typeid;
            $data['type']=$type;
            $data['openid']=$openid;
            if($thisData=Collect::withTrashed()->where($data)->first()){//查询是否存在这条数据
                if($thisData->deleted_at){ //是否被软删除
                    Collect::withTrashed()->find($thisData->id)->restore();//恢复软删除
                    return ['status'=>1,'msg'=>'成功','data'=>''];
                }
                return ['status'=>-1,'msg'=>'已收藏','data'=>''];
            }
            $res=Collect::create($data);//没有这条数据则进行添加
            if($res){
                return ['status'=>1,'msg'=>'成功','data'=>''];
            }else{
                return ['status'=>-1,'msg'=>'失败','data'=>''];
            }
        }
        catch(\Exception $e){
            return ['status'=>-1,'msg'=>'发生未知错误','data'=>''];
        }
    }

    /**
     * 取消收藏
     * @param Request $request
     * @return array
     */
    public function offCollect(Request $request)
    {
        $typeid=$request['typeid'];
        $type=$request['type'];
        $openid=$request['openid'];
        if(!$type||!$typeid||!$openid){
            return ['status'=>-1,'msg'=>'参数出错','data'=>''];
        }
        try{
            $data['typeid']=$typeid;
            $data['type']=$type;
            $data['openid']=$openid;
            $res=Collect::where($data)->delete();
            if($res){
                return ['status'=>1,'msg'=>'成功','data'=>''];
            }else{
                return ['status'=>-1,'msg'=>'失败','data'=>''];
            }
        }
        catch(\Exception $e){
            return ['status'=>-1,'msg'=>'出现未知错误','data'=>''];
        }
    }

    /**
     * 获取用户收藏的内容
     * @param Request $request
     * @return array
     */
    public function getCollect(Request $request)
    {
        $openid=$request['openid'];
        if(!$openid){
            return ['status'=>-1,'msg'=>'参数错误','data'=>''];
        }
        try{
            $userinfo=Renting::where('openid',$openid)->first();
            $data['hous_collect_arr']=Hous::with('housattr')->whereIn('id',$userinfo['hous_collect'])->get();
            $data['article_collect_arr'] = DB::table('articles')->whereIn('id',$userinfo['article_collect'])->orderby('created_at', 'desc')->get();//按添加时间倒序
            foreach ($data['article_collect_arr'] as &$value) {
                $value->created_at = date('Y-m-d',strtotime($value->created_at));//时间格式改为Y-m-d
                $value->image = env('APP_URL') . $value->image;//给图片加上路径
            }
            return ['status'=>0,'msg'=>'成功','data'=>$data];
        }catch(\Exception $e){
            return ['status'=>-2,'msg'=>'发生未知错误','data'=>''];
        }
    }

    /**
     * 获取当前用户的地理坐标
     * @param Request $request
     * @return array
     */
    public function getUsercityBylocation(Request $request)
    {
        $longitude=$request['longitude'];//经度
        $latitude=$request['latitude'];//纬度
        if(!$latitude||!$longitude){
            return ['status'=>-1,'msg'=>'未携带参数','data'=>""];
        }
        $url="https://restapi.amap.com/v3/geocode/regeo?output=json&location=$longitude,$latitude&key=3a6befc92816f598da047545bad1a6ee&radius=1000&extensions=all";
        $data=file_get_contents($url);
        $data=json_decode($data,true);
        return ['status'=>1,'msg'=>'获取成功','province'=>$data['regeocode']['addressComponent']['province']];
    }
}
