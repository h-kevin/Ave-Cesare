<!-- Verify account -->

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
            echo "<p>Llogaria juaj u verifikua me sukses.</p>";
            $stmt->close();
            $conn->close();
            exit(0);
        } else {
            echo "<p>Nuk mundemi te verifikojme llogarine tuaj.</p>";
            $stmt->close();
            $conn->close();
            exit(1);
        }
    } else {
        echo "<p>Verifikimi deshtoi. Llogaria mund te jete e verifikuar ose
            celesi i verifikimit nuk eshte i sakte. Ju lutem provoni me vone.</p>";
        $stmt->close();
        $conn->close();
        exit(1);
    }

?>