<!-- Faqja e ofertave -->

<?php 

    require_once('db_connect.php');

    if (isset($_POST['offers'])) {
        $sale = $_POST['sale'];
        $pname = $_POST['product_name'];
        $start = $_POST['start_date'];
        $end = $_POST['end_date'];
        $img = $_POST['image'];
        $desc = $_POST['desc'];
        $ing = $_POST['ingredient_name'];
        $price = $_POST['price'];
        $newprice = $_POST['new_price'];

        $stmt = $conn->prepare('SELECT * FROM offer');

    }

?>