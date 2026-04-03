<?php
$ip = $_SERVER['REMOTE_ADDR'];
$ua = $_SERVER['HTTP_USER_AGENT'];
$time = date("Y-m-d H:i:s");

$data = "$time | $ip | $ua\n";

file_put_contents("log.txt", $data, FILE_APPEND);
?>
