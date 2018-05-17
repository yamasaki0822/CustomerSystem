<?php
require_once('DatabaseManager.php');
header('Content-type:application/json; charset=utf8');

class Customer {

    // データベース操作用クラス
    private $dbm;


    // コンストラクタ
    public function __construct() {
        $this->dbm = new DatabaseManager();
    }

    // 行う動作の識別
    public function controller($action, $data) {

        switch ($action) {
            // IDに対応する顧客情報の取得
            case 'get':
                $this->getData($data);
                break;

            // 検索条件に合致する顧客情報の取得
            // 並び替え、ページャー機能もここで行いたい
            // 名前の変更
            case 'serch':
                $this->serchData($data);
                break;

            // 顧客情報の追加
            case 'add':
                $this->addData($data);
                break;

            // 顧客情報の変更
            case 'edit':
                $this->editData($data);
                break;

            // 顧客情報の変更
            case 'delete':
                $this->deleteData($data);
                break;

            default:
                echo json_encode( 'default_error' );
                break;
        }
    }

    // ---------------------------------------------------------
    // IDと合致する顧客データを取得
    // ---------------------------------------------------------
    private function getData($id) {
        $sql = "SELECT cus.last_name, cus.first_name,"
              ." cus.last_kana_name, cus.first_kana_name,"
              ." cus.email, cus.phone,"
              ." cus.gender, cus.birthday,"
              ." cus.company_id, com.name"
              ." FROM customers AS cus"
              ." INNER JOIN companies AS com ON cus.company_id = com.id"
              ." WHERE cus.id = ".$id;
        ;

        // 情報の取得
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        // 返却用リスト
        $returnList = null;

        // 取得したデータを配列に格納
        while ($row = $stmt->fetchObject())
        {
            $returnList[] = array(
                'last_name'       => $row->last_name,
                'first_name'      => $row->first_name,
                'last_kana_name'  => $row->last_kana_name,
                'first_kana_name' => $row->first_kana_name,
                'email'           => $row->email,
                'phone'           => $row->phone,
                'gender'          => $row->gender,
                'birthday'        => $row->birthday,
                'company_id'      => $row->company_id,
                'company_name'    => $row->name
            );
        }
        echo json_encode( $returnList );
    }

    // ---------------------------------------------------------
    //
    // ---------------------------------------------------------


    // ---------------------------------------------------------
    // 条件に合う顧客データを取得
    // ---------------------------------------------------------
    private function serchData($data) {

        $returnList = null;
        $array = array(
            $data[param][0]['value'],
            $data[param][1]['value'],
            $data[param][2]['value'],
            $data[param][3]['value'],
            $data[param][4]['value'],
            $data[param][5]['value'],
        );

        $sortTarget = $data[target];
        $sortState = $data[state];

        // 検索条件
        $conditions;

        // 名前(性)
        if($array[0] != "") {
            $conditions = "last_kana_name like '%".$array[0]."%'";
        }

        // 名前(名)
        if($array[1] != "") {
            if($conditions != "") {
                $tmp = $conditions.' and ';
                $conditions = $tmp;
            }
            $tmp = $conditions."first_kana_name like '%".$array[1]."%'";
            $conditions = $tmp;
        }

        // 性別
        if($array[2] != 0) {
            if($conditions != "") {
                $tmp = $conditions.' and ';
                $conditions = $tmp;
            }
            $tmp = $conditions.'gender = '.$array[2];
            $conditions = $tmp;
        }

        // 生年月日(始まり)
        if($array[3] != "") {
            if($conditions != "") {
                $tmp = $conditions.' and ';
                $conditions = $tmp;
            }
            $min = str_replace("-", "", $array[3]);
            $tmp = $conditions.'birthday >= '.$min;
            $conditions = $tmp;
        }

        // 生年月日(終わり)
        if($array[4] != "") {
            if($conditions != "") {
                $tmp = $conditions.' and ';
                $conditions = $tmp;
            }
            $max = str_replace("-", "", $array[4]);
            $tmp = $conditions.'birthday <= '.$max;
            $conditions = $tmp;
        }

        // 所属会社
        if($array[5] != "") {
            if($conditions != "") {
                $tmp = $conditions.' and ';
                $conditions = $tmp;
            }
            $tmp = $conditions.'company_id = '.$array[5];
            $conditions = $tmp;
        }

        $sortData = $sortTarget.' '.$sortState;

        $sql = "SELECT cus.id, cus.last_name, cus.first_name, cus.last_kana_name,"
              ." cus.first_kana_name, cus.email, cus.phone,"
              ." com.name, cus.created_at, cus.updated_at"
              ." FROM customers AS cus"
              ." INNER JOIN companies AS com ON cus.company_id = com.id"
        ;

        if($conditions == "") {
            $tmp = $sql.' ORDER BY '.$sortData;
            $sql = $tmp;
        } else {
            $tmp = $sql.' WHERE '.$conditions.' ORDER BY '.$sortData;
            $sql = $tmp;
        }
        // 情報の取得
        $stmt = $this->dbm->dbh->query($sql);

        // 取得したデータを配列に格納
        while ($row = $stmt->fetchObject())
        {

            $returnList[] = array(
                'id'              => $row->id,
                'last_name'       => $row->last_name,
                'first_name'      => $row->first_name,
                'last_kana_name'  => $row->last_kana_name,
                'first_kana_name' => $row->first_kana_name,
                'email'           => $row->email,
                'phone'           => $row->phone,
                'company_name'    => $row->name,
                'created_at'      => $row->created_at,
                'updated_at'      => $row->updated_at,
            );
        }
        echo json_encode( $returnList );
    }

    // ---------------------------------------------------------
    //
    // ---------------------------------------------------------



    // ---------------------------------------------------------
    // 顧客情報の追加
    // ---------------------------------------------------------
    private function addData($array) {

        $data = array(
            $array[0]['value'],
            $array[1]['value'],
            $array[2]['value'],
            $array[3]['value'],
            $array[4]['value'],
            $array[5]['value'],
            $array[6]['value'],
            $array[7]['value'],
            $array[8]['value'],
        );


        // 現在時刻の取得
        $date = date("Y/m/d H:i:s");

        // 生年月日の置換
        $day = str_replace("-", "", $data[7]);
        $data[7] = $day;

        // 電話番号が未入力の場合、nullを入れる
        if($data[5] == "") {
            $data[5] = "null";
        }

        // SQL
        $sql = "INSERT INTO customers (
                    last_name,
                    first_name,
                    last_kana_name,
                    first_kana_name,
                    email,
                    phone,
                    gender,
                    birthday,
                    company_id,
                    created_at,
                    updated_at)
                VALUES (
                    '".$data[0]."',
                    '".$data[1]."',
                    '".$data[2]."',
                    '".$data[3]."',
                    '".$data[4]."',
                    '".$data[5]."',
                    ".$data[6].",
                    ".$data[7].",
                    ".$data[8].",
                    '".$date."',
                    null
                )";

        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        if(!$flag) {
            $test = $stmt->error;
            echo json_encode($test);
        } else {
            echo json_encode('success');
        }
    }

    // ---------------------------------------------------------
    //
    // ---------------------------------------------------------


    // ---------------------------------------------------------
    // 所属会社選択のためにデータベースから所属会社を取得する
    // ---------------------------------------------------------
    private function editData($data) {

        // 情報を格納
        $id = $data[id];

        $list = array(
            $data[param][0]['value'],
            $data[param][1]['value'],
            $data[param][2]['value'],
            $data[param][3]['value'],
            $data[param][4]['value'],
            $data[param][5]['value'],
            $data[param][6]['value'],
            $data[param][7]['value'],
            $data[param][8]['value'],
        );


        // 現在時刻の取得
        $date = date("Y/m/d H:i:s");

        // 生年月日の置換
        $day = str_replace("-", "", $list[7]);

        // 電話番号がnull、0だったときの空白にする
        if($list[5] == "" || $list[5] == 0) {
            $list[5] = "null";
        }

        // SQL
        $sql = "update customers set
                    last_name       = '".$list[0]."',
                    first_name      = '".$list[1]."',
                    last_kana_name  = '".$list[2]."',
                    first_kana_name = '".$list[3]."',
                    email           = '".$list[4]."',
                    phone           =  '".$list[5]."',
                    gender          =  ".$list[6].",
                    birthday        = '".$day."',
                    company_id      = '".$list[8]."',
                    updated_at      = '".$date."'
                where
                    id = '".$id."'
                ";

        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        if(!$flag) {
            echo json_encode('faled');
        } else {
            echo json_encode('success');
        }
    }

    // ---------------------------------------------------------
    //
    // ---------------------------------------------------------


    // ---------------------------------------------------------
    // 顧客情報の削除
    // ---------------------------------------------------------
    private function deleteData($id) {
        $sql = "delete from customers where id = '".$id."'";
        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        if(!$flag) {
            echo json_encode('faled');
        } else {
            echo json_encode('success');
        }
    }

    // ---------------------------------------------------------
    //
    // ---------------------------------------------------------

}
?>