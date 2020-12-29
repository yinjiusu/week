<?php

namespace App\Http\Controllers\Api;

use App\Models\Housattr;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HousattrController extends Controller
{
    //房源属性
    protected $config = [
        'fang_direction' => 1,//朝向
        'fang_rent_class' => 2,//租赁方式
        'fang_rent_type' => 3 //租期方式
    ];

    /**
     * 通过字段名找到子级
     * @param Request $request
     * @return array
     */
    public function getHousattrByFieldName(Request $request)
    {
        $field_name = $request['field_name'];//字段名
        $field_name_data = Housattr::where('field_name', $field_name)->first();//通过字段名找到id
        $data = Housattr::where('pid', $field_name_data->id)->limit(4)->get();//通过父级id找到四个子级
        if ($data) {
            return ['status' => 0, 'msg' => '成功', 'data' => $data];
        } else {
            return ['status' => -1, 'msg' => '失败', 'data' => ''];
        }
    }

    /**
     * 房源属性分组获取
     * @return array
     */
    public function getCondition()
    {
        $data = Housattr::whereIn('pid', $this->config)->get()->toArray();
        $condition = [];
        foreach ($this->config as $key => $value) {
            foreach ($data as $k => $v) {
                if ($v['pid'] == $value) {
                    $condition[$key][] = $v;
                }
            }
        }
        return $condition;
    }

}
