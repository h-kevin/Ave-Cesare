<?php

    require_once('db_connect.php');

    echo '<table id="user_data" class="table table-bordered table-responsive">';
    echo '<thead>';
    echo '<tr>';
    echo '<th width="10%">IMAZH</th>';
    echo '<th width="30%">EMER</th>';
    echo '<th width="30%">MBIEMER</th>';
    echo '<th width="10%">ADMIN</th>';
    echo '<th width="10%">MODIFIKO</th>';
    echo '<th width="10%">FSHI</th>';
    
    $query = "SELECT * FROM User";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    foreach($result as $row){
    $prof_img = '';

    if($row["prof_img"] != ''){
    $prof_img = '<img src="' . $row["prof_img"] . '" class="rounded-circle" width="50" height="50" />';
    }

    else{
    $prof_img = '';
    }

    echo '<tr>';
    echo '<td>' . $prof_img . '</td>';
    echo '<td>' . $row["name"] . '</td>';
    echo '<td>' . $row["surname"] . '</td>';
    if($row["admin"] == 1){
        echo '<td>True</td>';
    }
    else{
    echo '<td>False</td>';
    }
    echo '<td><button type="button" name="update" id="'.$row["id"].'" data-target="#userModalUpdate" data-toggle="modal" class="btn btn-success btn-lg update">Modifiko</button></td>';
    echo '<td><button type="button" name="delete" id="'.$row["id"].'" data-target="#userModalDelete" data-toggle="modal" class="btn btn-danger btn-lg delete">Fshi</button></td>';
    echo '</tr>';
    }

    echo '</tr>';
    echo '</thead>';
    echo '</table>';

?>
   