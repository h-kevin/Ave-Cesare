<!-- Verify account -->

<html>

    <head>
        <title>Ave Cesare!</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" type="image/png" href="../img/favicon.png" />
        <link rel="stylesheet" type="text/css" href="../css/index.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </head>

    <body id="verifyb">

        <img src="../img/email-verified.png">

<?php

require_once('db_connect.php');

$vkey = $_GET['vkey'];

$stmt = $conn->prepare("SELECT * FROM User WHERE vkey = ? AND verified = 0 LIMIT 1");
$stmt->bind_param('s', $vkey);

$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 1) {
    $stmt = $conn->prepare("UPDATE User SET verified = 1 WHERE vkey = ?");
    $stmt->bind_param('s', $vkey);

    $result = $stmt->execute();

    if ($result) {
        echo "<h1>Llogaria juaj u verifikua me sukses.</h1>";
        $stmt->close();
        $conn->close();
    } else {
        echo "<h1>Nuk mundemi te verifikojme llogarine tuaj.</h1>";
        $stmt->close();
        $conn->close();
    }
} else {
    echo "<h1>Verifikimi deshtoi. Llogaria mund te jete e verifikuar ose
celesi i verifikimit nuk eshte i sakte. Ju lutem provoni me vone.</h1>";
    $stmt->close();
    $conn->close();
}

?>

        <a href="../pages/login.php" class="btn btn-success btn-lg">Login</a>

        <script src="../vendors/jquery/jquery-3.4.1.min.js"></script>
        <script src="../vendors/popper/popper.min.js"></script>
        <script src="../vendors/bootstrap/js/bootstrap.min.js"></script>
    </body>

</html>