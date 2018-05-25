
<?php

require_once('databaseManager.php');
header('Content-type:application/json; charset=utf8');
date_default_timezone_set('Asia/Tokyo');

class illustration {
    // データベース操作用クラス
    private $dbm;

    private $exts = ['jpg', 'png', 'bmp'];

    // ================================================================
    // コンストラクタ
    // ================================================================
    public function __construct() {
        $this->dbm = new DatabaseManager();
    }

    // ================================================================
    // クリックされた作品の情報を渡す
    // ================================================================
    public function selectIllust($data) {
        $result;

        // ユーザーID、作品ID
        $designerId = $data[0][value];
        $id = $data[0][value];

        // 現在のユーザー名の取得
        $sql = "SELECT name FROM designers WHERE id = ".$designerId;
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        // ファイルパスの取得
        $fileName = '';
        while ($row = $stmt->fetchObject())
        {
            // フォルダのファイルパスの作成
            $fileName = $designerId.'_'.$row->name;
        }

        // タイトル
        $sql = "SELECT name, category_id FROM works WHERE id = ".$id;
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        $filePath = '';
        while ($row = $stmt->fetchObject())
        {
            $imageName = $designerId.'_'.$id;
            foreach( $this->exts as $ext) {
                $filePath = '../view/images/creator/'.$fileName.'/'.$imageName.'.'.$ext;
                if(is_file($filePath)) {
                    break;
                }
            }

            $result[] = array(
                'id'       => $id,
                'img'      => $filePath,
                'name'     => $row->name,
                'category_id'  => $row->category_id,
            );
        }

        if($result == null) {
            $result = 999;
        }
        echo json_encode( $result );
    }

    // ================================================================
    // 作品一覧
    // ================================================================
    public function index($data) {
        $result;

        // ソート対象
        $target = $data[0][value];

        // 検索条件
        $conditions;
        for($num = 1; $num < count($data) ; $num++) {
            if($conditions != "") {
                $tmp = $conditions.' or ';
                $conditions = $tmp;
            }
            $tmp = $conditions."category_id = ".$data[$num][value];
            $conditions = $tmp;
        }

        $sql;
        if($conditions != "") {

            $sql = "SELECT work.id, work.designer_id, work.name AS image_name, des.name AS designer_name "
                  ."FROM works AS work "
                  ."INNER JOIN designers AS des ON work.designer_id = des.id "
                  ."WHERE ".$conditions." ORDER BY " .$target. " DESC"
            ;
            $stmt = $this->dbm->dbh->prepare($sql);
            $stmt->execute();

            while ($row = $stmt->fetchObject())
            {
                $d_id = $row->designer_id;
                $d_name = $row->designer_name;
                $id = $row->id;


                $filePath;
                $fileName = $d_id.'_'.$d_name;
                $imageName = $d_id.'_'.$id;
                foreach( $this->exts as $ext) {
                    $filePath = '../view/images/creator/'.$fileName.'/'.$imageName.'.'.$ext;
                    if(is_file($filePath)) {
                        break;
                    }
                }
                // 画像サイズの取得
                $size = getimagesize($filePath);

                $result[] = array(
                    'id'       => $id,
                    'img'      => $filePath,
                    'width'    => $size[0],
                    'height'   => $size[1],
                    'imgname'  => $row->image_name,
                );
            }
        }
        else {
            $result = -999;
        }
        echo json_encode( $result );
    }


    // ================================================================
    // 登録
    // ================================================================
    public function insert($data, $fileData = null) {
        $result = 'test';

        // ファイルデータの確認
        if($fileData == null) {
            $result = 'not file data';
            echo json_encode( $result );
            return;
        }

        // ユーザーID、カテゴリーID、作品名を取得
        $newData = explode(",", $data);
        $designerId = $newData[0];
        $name = $newData[1];
        //$categoryId = $newData[1];
        $categoryId = 1;

        // IDからユーザー名を取得
        $sql = "SELECT name FROM designers WHERE id = ".$designerId;
        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        $designerName = '';
        while ($row = $stmt->fetchObject())
        {
            $designerName = $row->name;
        }

        // SQLミス、ファイル名の取得ミス
        if(!$flag || $designerName == '') {
            $result = 'miss get file';
            echo json_encode( $result );
            return;
        }

        // ファイルパスの作成
        $fileName = $designerId.'_'.$designerName;
        $filePath = '../view/images/creator/'.$fileName;
        $date = date("Y/m/d H:i:s");

        $sql = "INSERT INTO works(designer_id, name, uploaded_at, category_id, average_point) "
              ."VALUES (".$designerId.", '".$name."', '".$date."', ".$categoryId.", 0)"
        ;
        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        if($flag) {
            $id = $this->dbm->dbh->lastInsertId();
            $imageName = $designerId.'_'.$id;

            if($this->uploadImage($fileData, $filePath, $imageName)) {
                $result = 'success';
            } else{
                // アップロードミス
                $result = 'miss upload';
            }
        } else {
            // SQL失敗
            $result = -999;
        }
        echo json_encode( $result );
    }

    // 画像を登録する
    private function uploadImage($fileData, $directoryPath, $name) {
        // 画像ファイルの有無
        if(empty($fileData)) {
            return false;
        }
        // ディレクトリの存在確認
        if (! file_exists($directoryPath)) {
            return false;
        }

        try {
            // ファイルの拡張子の取得
            $ext = substr($fileData['name'], strrpos($fileData['name'], '.') + 1);

            // ファイル名の設定
            $newName = $name.'.'.$ext;

            // アップロード後のファイルの移動先
            $destination = $directoryPath.'/'.$newName;

            // テンポラリからファイルを移動
            move_uploaded_file($fileData['tmp_name'], $destination);

        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    // ================================================================
    // 編集
    // ================================================================
    public function edit($data) {
        $result = -999;

        $id = $data[0][value];
        $name = $data[1][value];
        $categoryId = $data[2][value];

        // ユーザーをデータベースに登録
        $sql = "UPDATE works SET name = ".$name.", category_Id = ".$categoryId." WHERE id = ".$id;
        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        if($flag) {
            $result = 'success';
        }else{
            $result = -999;
        }
        echo json_encode( $result );
    }

    // ================================================================
    // 削除
    // ================================================================
    public function delete($data) {
        $result = -999;
        $id = $data[0][value];
        $name = $data[1][value];
        $designerId = $data[2][value];


        $fileName = $designerId.'_'.$name;
        $imageName = $designerId.'_'.$id;

        // ファイルパスの指定
        foreach( $this->exts as $ext) {
            $filePath = '../view/images/creator/'.$fileName.'/'.$imageName.'.'.$ext;

            if(is_file($filePath)) {

                // 画像の削除
                unlink($filePath);

                // DBから作品と評価の削除
                $sql = "DELETE works, evaluations FROM works "
                      ."INNER JOIN evaluations  AS eva ON works.id = eva.work_id "
                      ."WHERE works.id = ".$id
                ;
                $stmt = $this->dbm->dbh->prepare($sql);
                $flag = $stmt->execute();

                if($flag) {
                    $result = 'success';
                }else{
                    $result = -999;
                }
                break;
            } else {
                // 画像がない
                $result = -999;
            }
        }
        echo json_encode( $result );
    }
}

?>