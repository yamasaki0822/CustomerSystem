<?php
// データベース接続用クラス
class databaseManager {

    private $dsn;       // データソース名
    private $userName;  // ユーザー名
    private $password;  // パスワード
    public $dbh;        // オブジェクト

    // コンストラクタ
    public function __construct() {
        $this->dsn = 'mysql:host=localhost; dbname=dils_test; charset=utf8mb4';
        $this->userName = 'yamasaki';
        $this->password = 'Mk5STEcs';

        // DBに接続
        try{
            $this->dbh = new PDO($this->dsn, $this->userName, $this->password);
        }catch (PDOException $e){
            print('Connection failed:'.$e->getMessage());
            die();
        }
    }
}
?>