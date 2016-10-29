<?php
$mysqli = new mysqli('SERVER', 'USER', 'PASS', 'DATABASE');
if ($mysqli->connect_error) {
    echo $mysqli->connect_error;
    exit();
} else {
    $mysqli->set_charset("utf8");
}

$sql = "INSERT INTO `calmery_flowertalk`.`key` (`key`, `value`) VALUES ('". $_GET['key']. "', '". $_GET['value']. "');";
if ($result = $mysqli->query($sql)) {
    echo "true";
}

$mysqli->close();
?>