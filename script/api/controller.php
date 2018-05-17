
<?php

require_once('company.php');
require_once('customer.php');
header('Content-type:application/json; charset=utf8');


if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{
    // 動作を行う対象のクラスを生成
    $className = new $_POST['model'];

    // 動作、データを渡す
    $className->controller($_POST['action'], $_POST['data']);

}
?>