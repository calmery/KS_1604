<?php

$mysqli = new mysqli('SERVER', 'USER', 'PASS', 'DATABASE');
if ($mysqli->connect_error) {
    echo $mysqli->connect_error;
    exit();
} else {
    $mysqli->set_charset("utf8");
}

$sql = "SELECT DISTINCT * FROM key where id=". $_GET['name'];
if ($result = $mysqli->query($sql)) {
    $i = 0;
    echo "{";
    while ($row = $result->fetch_assoc()) {
        if( $i != 0 ) echo ',';
        echo '"'. $row["key"]. '": "'. $row["value"]. '"';
        $i++;
    }
    echo "}";
    $result->close();
}

$mysqli->close();
?>