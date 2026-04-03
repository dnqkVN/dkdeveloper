<?php
$pass = "123456";

if (!isset($_GET['pass']) || $_GET['pass'] != $pass) {
    die("❌ Không có quyền");
}

echo "<h2>📊 Log truy cập</h2>";

$logs = file("log.txt");
foreach ($logs as $log) {
    echo "<p>$log</p>";
}
?>
