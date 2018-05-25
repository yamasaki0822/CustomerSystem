
<?php
require_once('databaseManager.php');
header('Content-type:application/json; charset=utf8');

class user {
    // データベース操作用クラス
    private $dbm;

    // 登録できる拡張子
    private $exts = ['jpg', 'png', 'bmp'];

    // ================================================================
    // コンストラクタ
    // ================================================================
    public function __construct() {
        $this->dbm = new DatabaseManager();
    }

    // ================================================================
    // ユーザーの作品一覧
    // ================================================================
    public function illustIndex($data) {
        $result;

        $designerId = $data['id'];    // 表示するユーザーのID

        // ソート対象
        $target = "";
        if($data[1][value] == null) {
            $target = 'uploaded_at';
        } else {
            $target = $data[1][value];
        }

        // 検索条件
        $conditions = "";
        if($data[2][value] == null) {
            $conditions = "category_id IN (1,2,3)";
        } else {
            for($num = 2; $num < count($data) ; $num++) {
                if($conditions != "") {
                    $tmp = $conditions.' or ';
                    $conditions = $tmp;
                }
                $tmp = $conditions."category_id = ".$data[$num][value];
                $conditions = $tmp;
            }
        }

        // 条件確認
        if($conditions == "" && $target == "") {
            // ソート、対象の取得ミス
            $result = '条件ミス';
            echo json_encode( $result );
            return;
        }

        $sql = "SELECT des.name AS d_name, work.id, work.name "
              ."FROM designers AS des "
              ."INNER JOIN works AS work "
              ."WHERE des.id = work.designer_id "
              ."AND des.id = ".$designerId." "
              ."AND ".$conditions." "
              ."ORDER BY " .$target." DESC"
        ;
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetchObject())
        {
            $imageId = $row->id;
            $fileName = $designerId.'_'.$row->d_name;

            // 拡張子の確認
            foreach( $this->exts as $ext) {
                $imageName = $designerId.'_'.$imageId.'.'.$ext;
                $filePath = '../view/images/creator/'.$fileName.'/'.$imageName;

                if(is_file($filePath)) {
                    break;
                }
            }
            // 画像サイズの取得
            $size = getimagesize($filePath);

            // アイコン画像の取得
            $iconPath = '../view/images/creator/Share/default.png';
            foreach( $this->exts as $ext) {
                $imageTmpName = $id.'_icon.'.$ext;
                $tmpPath = '../view/images/creator/'.$fileName.'/'.$imageTmpName;
                if(is_file($tmpPath)) {
                    $iconPath = $tmpPath;
                    break;
                }
            }

            $result[] = array(
                'id'       => $imageId,     // 作品ID
                'img'      => $filePath,    // 作品のファイルパス
                'width'    => $size[0],     // 画像の横幅
                'height'   => $size[1],     // 画像の縦幅
                'imgname'  => $row->name,   // 作品名
                'userName' => $row->d_name, // 制作者名
                'iconPath' => $iconPath,    // アイコンパス
            );
        }


        $test = '';
        if($result == null) {
            $sql = "SELECT name FROM designers WHERE id = ".$designerId;
            $stmt = $this->dbm->dbh->prepare($sql);
            $stmt->execute();

            while ($row = $stmt->fetchObject())
            {
                $name = $row->name;
                $fileName = $designerId.'_'.$name;
                $iconPath = '../view/images/creator/Share/default.png';

                // $result = $fileName;

                foreach( $this->exts as $ext) {
                    $imageTmpName = $designerId.'_icon.'.$ext;
                    $tmpPath = '../view/images/creator/'.$fileName.'/'.$imageTmpName;
                    if(is_file($tmpPath)) {
                        $iconPath = $tmpPath;
                        break;
                    }
                }
                //$result = 'aaa';

                $result[] = array(
                    'id'       => -999,     // 作品ID
                    'img'      => '',    // 作品のファイルパス
                    'width'    => 0,     // 画像の横幅
                    'height'   => 0,     // 画像の縦幅
                    'imgname'  => '',   // 作品名
                    'userName' => $name, // 制作者名
                    'iconPath' => $iconPath,    // アイコンパス
                );
            }
        }

        echo json_encode( $result );
    }

    // ================================================================
    // ユーザー一覧
    // ================================================================
    public function index($data) {
        $result;

        $sql = "SELECT id, name FROM designers";
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetchObject())
        {
            $id = $row->id;
            $fileName = $id.'_'.$row->name;

            $filePath = '../view/images/creator/Share/default.png';
            $imageName = 'default.png';

            foreach( $this->exts as $ext) {
                $imageTmpName = $id.'_icon.'.$ext;
                $tmpPath = '../view/images/creator/'.$fileName.'/'.$imageTmpName;
                if(is_file($tmpPath)) {
                    $filePath = $tmpPath;
                    $imageName = $imageTmpName;
                    break;
                }
            }
            // 画像サイズの取得
            $size = getimagesize($filePath);

            $result[] = array(
                'id'        => $id,
                'userName'  => $row->name,
                'img'       => $filePath,
                'imgname'   => $imageName,
            );
        }
        echo json_encode( $result );
    }

    // ================================================================
    // ユーザーの登録
    // ================================================================
    public function register($data, $fileData = null) {
        $result = -999;

        // ユーザー名、パスワードを取得
        $newData = explode(",", $data);
        $name = $newData[0];
        $inputPassword = $newData[1];

        // 名前、パスワードがない場合
        if($name == null || $inputPassword == null) {
            $result = -999;
            echo json_encode( $result );
            return;
        }

        // パスワードの生成
        $options = [
            'cost' => 11,
            'salt' => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
        ];
        $password = password_hash($inputPassword, PASSWORD_BCRYPT, $options);

        $sql = "INSERT INTO designers(name, password) "
              ."VALUES ('".$name."', '".$password."')"
        ;
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        // 最後に追加されたIDの取得
        $id = $this->dbm->dbh->lastInsertId();

        // フォルダのファイルパスの作成
        $fileName = $id.'_'.$name;
        $directoryPath = '../view/images/creator/'.$fileName;

        //フォルダ作成
        if(mkdir($directoryPath, 0777)) {
            chmod($directoryPath, 0777);

            // アイコン画像を作成したフォルダに入れる
            if($fileData != null) {
                $iconName = $id.'_icon';
                if($this->uploadImage($fileData, $directoryPath, $iconName)) {
                    $result = 'success';
                }
                else{
                    $result = -999;
                }
            }
            else{
                // 画像なし
                $result = 'success';
            }
        }else{
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
    public function edit($data, $fileData = null) {
        $result = -999;

        // ID、ユーザー名の取得
        $newData = explode(",", $data);
        $id = $newData[0];
        $name = $newData[1];

        // 名前がない場合
        if($id == null || $name == null) {
            $result = -999;
            echo json_encode( $result );
            return;
        }

        // 現在のユーザー名の取得
        $sql = "SELECT name FROM designers WHERE id = ".$id;
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        $oldPath = '';
        $newPath = '';
        while ($row = $stmt->fetchObject())
        {
            // フォルダのファイルパスの作成
            $oldName = $row->name;
            $oldPath = '../view/images/creator/'.$id.'_'.$oldName;
            $newPath = '../view/images/creator/'.$id.'_'.$name;
        }

        // パスを確認し、ファイル名の変更
        if($oldPath == '' || $newPath == '') {
            $result = -999;
            echo json_encode( $result );
            return;
        }

        // ファイル名の変更
        rename( $oldPath, $newPath );

        // 情報登録
        $sql = "UPDATE designers SET name = ".$name." WHERE id = " .$id;
        $stmt = $this->dbm->dbh->prepare($sql);
        $stmt->execute();

        // アイコン画像の更新
        if($fileData == null) {
            // 新しいアイコンがない場合、現在あるアイコンを消す
            foreach( $this->exts as $ext) {
                $filePath = $newPath.'/'.$id.'_icon.'.$ext;
                if(is_file($filePath)) {
                    unlink($filePath);
                }
            }
        } else{
            $iconName = $id.'_icon';
            if($this->uploadImage($fileData, $newPath, $iconName)) {
                $result = 'success';
            }
            else{
                $result = -999;
            }
        }
        echo json_encode( $result );
    }


    // ================================================================
    // 削除
    // ================================================================
    public function delete($data) {

        $result = -999;

        // IDの取得
        $id = $data[0][value];

        // IDからユーザ名を取得
        $sql = "SELECT name FROM designers WHERE id = ".$id;
        $stmt = $dbm->dbh->prepare($sql);
        $stmt->execute();

        $fileName;
        while ($row = $stmt->fetchObject()) {
            $tmp = $id.'_'.$name;
            $fileName = $tmp;
        }

        // ファイルパスの指定
        $filePath = '../../view/images/creater/'.$fileName;
        if (is_dir($filePath)) {
            // フォルダの削除
            rmdir($filePath);

            // DB上のデータの削除
            // ユーザー
            $sql = "DELETE FROM designers WHERE id = '".$id."'";
            $stmt = $this->dbm->dbh->prepare($sql);
            $stmt->execute();

            $sql = "DELETE works, evaluations FROM works "
                  ."INNER JOIN evaluations  AS eva ON works.id = eva.work_id "
                  ."WHERE works.id = ".$id
            ;

            $stmt = $this->dbm->dbh->prepare($sql);
            $stmt->execute();
            $result = 'succes';
        } else {
            $result = -999;
        }
        echo json_encode( $result );
    }

    // ================================================================
    // ログイン
    // ================================================================
    public function login($data) {
        $result = -999;

        // ユーザー名、パスワードを取得
        $userName = $data[0][value];
        $password = $data[1][value];

        // ユーザー名に合致するデータの取得
        $sql = "SELECT * FROM designers WHERE name = '".$userName."' ";
        $stmt = $this->dbm->dbh->prepare($sql);
        $flag = $stmt->execute();

        if($flag) {
            $result = -999;
            while ($row = $stmt->fetchObject())
            {
                // データベースにあるデータとの比較
                $hash  = $row->password;
                if(password_verify($password, $hash)) {
                    $result = $row->id;
                    break;
                } else {
                    // 入力したパスワードが違う
                    $result = -999;
                }
            }
        }else{
            // SQLの失敗
            $result = -999;
        }
        echo json_encode( $result );
    }
}
?>