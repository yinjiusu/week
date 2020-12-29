<?php

namespace App\Http\Controllers\Api;

use App\Models\Hous;
use App\Models\Housattr;
use App\Models\Notice;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use QL\QueryList;
use App\Models\Collect;
use Elasticsearch\ClientBuilder;
class HousController extends Controller
{
    /**
     * 推荐房源
     * @return array
     */
    public function getRecommend()
    {
        $data=Hous::where('is_recommend','1')->select('id','fang_pic')->get();
        foreach($data as &$value){
            $fangpic=explode(',',$value['fang_pic']);//图片字符串转成数组
            $value['fang_pic']=env('APP_URL').$fangpic[1];//取首张
        }
        return ['status'=>0,'msg'=>'成功','data'=>$data];
    }

    /**
     * 获取房源列表
     * @return array
     */
    public function getHous(Request $request)
    {
        $attr=$request['attr'];//字段
        $id=$request['id'];//id
        $where=[];//空条件
        if($attr&&$id){//当字段名和id都不为空时
            if($attr=="fang_rent"){//时间段搜索
                $where['field']="fang_rent";
                $where['arr']=explode('-',$id);
            }else{
                $where[$attr]=$id;//配置条件查询
            }
        }
        $data=Hous::with('housattr')->when($where,function($query,$where){
            if(isset($where['field'])){//判断是否为时间段搜索
                return $query->whereBetween($where['field'],$where['arr']);
            }else{
                return $query->where($where);
            }
        })->select('fang_pic','fang_rent_class','id','fang_shi','fang_ting','fang_using_area','fang_name','fang_rent')->paginate(10);
        return ['status'=>0,'msg'=>'成功','data'=>$data];
    }

    /**
     * 获取房源详情
     * @param Request $request
     * @return array
     */
    public function getHousdetails(Request $request)
    {

        $hous_id=$request['hous_id'];//接收房源id
        if(!$hous_id){
            return ['status'=>-1,'msg'=>'出现未知错误','data'=>''];
        }
        try{
            $data=Hous::with('owner')->find($hous_id)->toArray();//获取房源信息
            $data['fang_direction']=Housattr::getHousattrByid($data['fang_direction']);//朝向
            $data['created_at']=date('Y-m-d', strtotime($data['created_at']));//创建时间
            $data['shi_ting_wei']=$data['shi_ting'].$data['fang_wei']."卫";//几室几厅几卫
            $fang_config_arr=explode(',',$data['fang_config']);
            foreach($fang_config_arr as &$item){
                $item=Housattr::getHousattrByid($item);
            }
            $data['fang_config']=$fang_config_arr;//房屋配套设施
            return ['status'=>0,'msg'=>'成功','data'=>$data];
        }catch (\Exception $e){
            return ['status'=>-1,'msg'=>$e->getMessage(),'data'=>''];
        }
    }

    /**
     * 获取三张轮播图
     * @return array
     */
    public function getHousViewpager()
    {
        $data=Hous::with('housattr')->where('is_recommend','1')->orderby('created_at','desc')->limit(3)->get();
        return ['status'=>0,'msg'=>'成功','data'=>$data];
    }


    /**
     * elasticsearch 搜索
     * @param Request $request
     */
    public function ElasticsearchBylike(Request $request)
    {
        $condition=$request['search'];//接收要搜索的条件
        $hosts = ['127.0.0.1:9200'];
        //实例化一个客户端
        $client=ClientBuilder::create()->setHosts($hosts)->build();
        $params = [
            'index' => 'fang',//数据库
            'type' => '_doc',//类型
            'body' => [
                'query' => [
                    'match' => [
                        'fang_desc'=>[//书写要搜索的字段
                            'query' => $condition//书写要搜索的内容
                        ]
                    ]
                ]
            ]
        ];
        $results = $client->search($params);//执行搜索
        $dataByelastic=$results['hits']['hits'];
        $id=[];
        foreach($dataByelastic as $item){
            $id[]=$item['_id'];
        }
        $data=Hous::whereIn('id',$id)->get()->toArray();
        return ['status'=>0,'msg'=>'成功','data'=>$data];
    }
}
