
<?php

require_once('DatabaseManager.php');
header('Content-type:application/json; charset=utf8');

class Company {
    // データベース操作用クラス
    private $dbm;

    // コンストラクタ
    public function __construct() {
        $this->dbm = new DatabaseManager();
    }

    // 行う動作の識別
    public function controller($action) {
        if($action == 'get') {
            $this->getCompanies();
        }
    }

    // 所属会社選択のためにデータベースから所属会社を取得する
    private function getCompanies() {

        // 返却用の配列
        $return_list = null;

        $sql = 'select * from companies';

        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        // 取得したデータを配列に格納
        while ($row = $stmt->fetchObject())
        {
            $return_list[] = array(
                'id'=> $row->id,
                'name' => $row->name
            );
        }
        // jsonに変換して返す
        echo json_encode( $return_list );
    }

}


?>