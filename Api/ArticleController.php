<?php

namespace App\Http\Controllers\Api;

use App\Models\Article;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Translation\Extractor\PhpStringTokenParser;

class ArticleController extends Controller
{
    /**
     * 获取全部文章
     * @return array
     */
    public function getArticlesAll()
    {
        $data = DB::table('articles')->orderby('created_at', 'desc')->get();//按添加时间倒序
        foreach ($data as &$value) {
            $value->created_at = date('Y-m-d',strtotime($value->created_at));//时间格式改为Y-m-d
            $value->image = env('APP_URL') . $value->image;//给图片加上路径
        }
        return ['status' => 0, 'msg' => '成功', 'data' => $data];
    }

    /**
     * 查看文章详情
     * @param Request $request
     * @return array
     */
    public function getArticlesOne(Request $request)
    {
        $id = $request['id'];
        $data = DB::table('articles')->where('id', $id)->first();
        $data->created_at = date('Y-m-d', strtotime($data->created_at));//时间格式改为Y-m-d
        $data->image = env('APP_URL') . $data->image;//给图片加上路径
        // $desn=$data[0];
        //$data[0]->desc=$this->shtm($data[0]->desc);
        return ['status' => 0, 'msg' => '成功', 'data' => $data];
    }
}
