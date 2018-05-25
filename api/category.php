
<?php

require_once('databaseManager.php');
header('Content-type:application/json; charset=utf8');

class category {
    // データベース操作用クラス
    private $dbm;

    // コンストラクタ
    public function __construct() {
        $this->dbm = new DatabaseManager();
    }

    // カテゴリーの一覧
    public function info($data) {
        $return_list = null;

        $sql = 'SELECT * FROM categories';
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        // 取得したデータを配列に格納
        while ($row = $stmt->fetchObject())
        {
            $return_list[] = array(
                'id'   => $row->id,
                'name' => $row->name
            );
        }
        // jsonに変換して返す
        echo json_encode( $return_list );
    }
}

?>