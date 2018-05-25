
<?php

require_once('databaseManager.php');
header('Content-type:application/json; charset=utf8');
date_default_timezone_set('Asia/Tokyo');

class image {

    // データベース操作用クラス
    private $dbm;

    // 共通部分のファイルパス
    // private $filePath = '../view/images/creator/';


    // コンストラクタ
    public function __construct() {
        $this->dbm = new DatabaseManager();
    }

    // 画像のアップロード
    public function upload($fileData, $data) {
        $result;

        // $fileData = $_FILES['file'];
        $designerId = '4';
        $name = 'テスト';
        $categoryId = '1';

        if (dataUpload($fileData, $designerId, $name, $categoryId)) {
            $result = 'success';
        } else {
            $result = 'failure';
        }
        echo json_encode($result);
    }

    // アイコン画像の更新
    public function updateIcon($fileData, $data) {
        $result;

        // $fileData = $_FILES['file'];
        $designerId = '4';
        $name = 'テスト';
        $categoryId = '1';

        if (dataUpload($fileData, $designerId, $name, $categoryId)) {
            $result = 'success';
        } else {
            $result = 'failure';
        }
        echo json_encode($result);
    }

    // ファイルをサーバーに送信
    private function dataUpload($fileData, $designerId, $name, $categoryId)
    {
        // 画像ファイルの有無
        if(empty($fileData)) {
            return false;
        }

        $sql = "SELECT name FROM designeries WHERE id = ".$designerId;
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        $filePath;
        while ($row = $stmt->fetchObject())
        {
            $filePath = '../view/images/creator/'.$designerId.'_'.$row->name;
        }

        // ディレクトリの存在確認
        if (! file_exists($filePath)) {
            return false;
        }

        try {
            // 日時の取得
            $date = date("Y/m/d H:i:s");

            // 画像情報をデータベースに登録
            $sql = "INSERT INTO works(designer_id, name, uploaded_at, category_id)"
                ."VALUES ('".$designerId."', '".$name."', '".$date."', '".$categoryId."')";

            $stmt = $this->dbm->dbh->prepare($sql);
            $stmt->execute();

            // 最後に追加されたIDの取得
            $id = $this->dbm->dbh->lastInsertId();

            // ファイルの拡張子の取得
            $ext = substr($fileData[name], strrpos($fileData[name], '.') + 1);

            // ファイル名の設定
            $fileName = $designerId.'_'.$id;
            $newName = $fileName.'.'.$ext;

            /*$sql = "SELECT name FROM designeries WHERE id = ".$designerId;
            $stmt = $this->dbm->dbh->prepare($sql);
            $stmt->execute();

            while ($row = $stmt->fetchObject())
            {
                $tmp = $filePath;
                $filePath = $tmp.$row->name;
            }*/

            // アップロード後のファイルの移動先
            $destination = $filePath . $newName;

            // テンポラリからファイルを移動
            move_uploaded_file($fileData['tmp_name'], $destination);
        } catch (Exception $e) {
            return false;
        }

        return true;
    }
}

?>