<?php
// Check if the form was submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){
    // Check if file was uploaded without errors
    if(isset($_FILES["photo"]) && $_FILES["photo"]["error"] == 0){
        $allowed = array("jpg" => "image/jpg", "jpeg" => "image/jpeg",
            "gif" => "image/gif", "png" => "image/png");
        $filename = $_FILES["photo"]["name"];
        $filetype = $_FILES["photo"]["type"];
        $filesize = $_FILES["photo"]["size"];

        $API_KEY = 'b98282ece4bf916cd5496ca9afbb09fc';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.imgbb.com/1/upload?key='. $API_KEY);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);
    
        // Verify file extension
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        if(!array_key_exists($ext, $allowed)) die("Error: Please select a valid file format.");
    
        // Verify file size - 5MB maximum
        $maxsize = 5 * 1024 * 1024;
        if($filesize > $maxsize) die("Error: File size is larger than the allowed limit.");
    
        // Verify MYME type of the file
        if(in_array($filetype, $allowed)){
            // Check whether file exists before uploading it
            if(file_exists($filename)){
                echo $filename . " is already exists.";
            } else{
                $type = $_FILES['photo']['type'];
                $image_base64 = base64_encode(file_get_contents($_FILES['photo']['tmp_name']));
                $base64 = 'data:' . $type . ';base64,' . $image_base64;
                echo "Your file was uploaded successfully.";

                $data = http_build_query(array('image' => $image_base64));

                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

                $result = curl_exec($ch);
                if (curl_errno($ch)) {
                    echo 'Error:' . curl_error($ch);
                } else {
                    $return_data = json_decode($result, true);
                    echo "<p>The URL: " . $return_data['data']['url'] . "</p>";
                }
                curl_close($ch);
            }
        } else{
            echo "Error: There was a problem uploading your file. Please try again."; 
        }
    } else{
        echo "Error: " . $_FILES["photo"]["error"];
    }
}
?>