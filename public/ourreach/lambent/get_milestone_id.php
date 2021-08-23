<?php
require('config/database.php'); // defines DB_SERVER and other constants

function get_milestone_id(){
  global $app_path;

  $parts = explode("-", $app_path);
  if (count($parts) < 2 or $parts[0] !== "83"){
    return null;
  }
  $id = $parts[1];

  // Attempt MySQL server connection. Assuming you are running MySQL server with default setting (user 'root' with no password)
  $conn = mysqli_connect(DB_SERVER, DB_SERVER_USERNAME, DB_SERVER_PASSWORD, DB_DATABASE, DB_SERVER_PORT);

  // Check connection
  if($conn === false){
    return "Failed to connect";
  }

  // Attempt select query execution
  $sql = 'SELECT field_1171 FROM app_entity_83 WHERE id='.$id;
  $result = mysqli_query($conn, $sql);
  if($result){
    if (mysqli_num_rows($result) > 0) {
      $row = mysqli_fetch_row($result);
      if(count($row) > 0){
        $milestone_id = $row[0];
        if(is_numeric($milestone_id)){
          return intval($milestone_id);
        }else{
          return "Fail 4";
        }
      }else{
        return "Fail 3";
      }
    }else{
      return "Fail 2";
    }
  }else{
    return "Fail 1";
  }
}
