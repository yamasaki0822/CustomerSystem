<?php

// データベース接続用クラス
class DatabaseManager {

    private $dsn;       // データソース名
    private $userName;  // ユーザー名
    private $password;  // パスワード
    public $dbh;        // オブジェクト

    // コンストラクタ
    public function __construct() {
        $this->dsn = 'mysql:host=localhost; dbname=customer_list; charset=utf8mb4';
        $this->userName = 'yamasaki';
        $this->password = 'Mk5STEcs';

        // DBに接続
        // データベースへの接続失敗で、例外を投げる
        try{
            $this->dbh = new PDO($this->dsn, $this->userName, $this->password);
        }catch (PDOException $e){
            print('Connection failed:'.$e->getMessage());
            die();
        }
    }
}
?>