<?php

require_once('user.php');
require_once('illustration.php');
require_once('evaluation.php');
require_once('category.php');
header('Content-type:application/json; charset=utf8');


if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
{

    // modelからクラスを生成
    $className = new $_POST['model'];
    $func = $_POST['action'];
    $data = $_POST['list'];

    $newData = explode(",", $data);
    $name = $newData[2];

    //echo json_encode( $data );
    //echo json_encode( $_FILES[$name]['name'].'___'.$name );

    if($_FILES[$name]['name'] == null){
        $className->$func($data);
    } else {
        $tmp = [$data, $_FILES[$name]];
        $className->$func(...$tmp);
    }
}
?>