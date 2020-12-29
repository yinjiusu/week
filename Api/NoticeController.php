<?php

namespace App\Http\Controllers\Api;

use App\Models\Notice;
use App\Models\Renting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NoticeController extends Controller
{
    /**
     * 获取使用者的预约记录
     * @param Request $request
     * @return array
     */
    public function getNoticeByRenting(Request $request)
    {
        $openid = $request['openid'];
        $renting_id = Renting::where('openid', $openid)->value('id');
        $notices = Notice::where('renting_id', $renting_id)
            ->where('status','0')
            ->with('owner')
            ->get();
        return ['status' => 1, 'msg' => '成功', 'data' => $notices];
    }

    /**
     * 获取用户的看房记录
     * @param Request $request
     * @return array
     */
    public function getHousByseeout(Request $request)
    {
        $openid = $request['openid'];
        $renting_id = Renting::where('openid', $openid)->value('id');
        $notices = Notice::where('renting_id', $renting_id)
            ->where('status','1')
            ->with('owner')
            ->get();
        return ['status' => 1, 'msg' => '成功', 'data' => $notices];
    }
}
