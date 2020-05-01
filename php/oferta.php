<!-- Faqja e ofertave -->

<?php 

    require_once('db_connect.php');

        $stmt = $conn->prepare('SELECT id, sale, start_date, end_date, description, image FROM Offer');
        $stmt->bind_param();

        
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id, $sale, $start_date, $end_date, $description, $image);
        $stmt->fetch();
        
        while ($s = $stmt->fetch()) {
            # code...
        }

    

?>