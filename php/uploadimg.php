<?php

/**
 * PHP file to handle image upload with api
 */

function uploadImage ($imgName) {
  // check if file was received without errors
  if (isset($_FILES[$imgName]) && $_FILES[$imgName]["error"] == 0) {
    $filename = $_FILES[$imgName]["name"];
    $filetype = $_FILES[$imgName]["type"];
    $filesize = $_FILES[$imgName]["size"];

    // set up curl
    $API_KEY = 'b98282ece4bf916cd5496ca9afbb09fc';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.imgbb.com/1/upload?key=' . $API_KEY);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);

    // peparing data to send
    $type = $_FILES[$imgName]['type'];
    $image_base64 = base64_encode(file_get_contents($_FILES[$imgName]['tmp_name']));
    $base64 = 'data:' . $type . ';base64,' . $image_base64;

    $data = http_build_query(array('image' => $image_base64));

    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    // executing curl and sending data
    $result = curl_exec($ch);

    // fetch url
    $url = '';

    if (curl_errno($ch)) {
      header('HTTP/1.1 500 Internal Server Error');
      exit("Problem ne ngarkimin e fotos..");
    } else {
      $return_data = json_decode($result, true);
      $url = $return_data['data']['url'];

      // close curl
      curl_close($ch);

      return $url;
    }
  }
}
