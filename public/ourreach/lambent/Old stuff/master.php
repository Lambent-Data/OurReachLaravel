<?php
  /*
  * This is the single non-ruko file linked from index.php.
  * From here we link all extra js files, according to the page and user data
  *
  * To extend this file: If you want to link a new file,
  * you can edit the switch statement at the bottom.
  * You may also need to edit get_module_name(), if it doesn't recognize 
  * the name of the page where you want to inject js.
  *
  *
  *
  *
  * User data is accessible in php:
  * application-top.php (around line 250) has the following definition regarding user data
  *
  * $app_user = array(
  *           'id'=>$user['id'],          
  *           'group_id'=>(int)$user['field_6'],
  *           'name'=> users::output_heading_from_item($user),
  *           'username'=>$user['field_12'],
  *           'email'=>$user['field_9'],
  *           'is_email_verified'=> $user['is_email_verified'],
  *           'photo'=>$photo,
  *           'language'=>$user['field_13'],
  *           'skin'=>$user['field_14'],
  *           'fields'=> $user,
  *                         ); 
  *
  * There is also a variable $user that stores the whole user record direct from the db. (See application-top.php line 241 for the definition.)
  */

  /* Now decide which js files, if any to include.
   * We decide based on the current module (i.e. page).
   * On all pages, include the following: */

echo '<script type="text/javascript" src="lambent/all-pages.js"></script>';

  /*
   * This function returns a string describing the name of the page.
   * The list is not comprehensive, and may be added to as needs change.
   */
  function get_module_name(){
    global $module_array, $app_path;
    switch($module_array[0]){
      case "items":
        // Check if we are looking at a particular milestone
        if (substr($app_path, 0, 3) == "83-"){
          return "Milestone Item Page";
        }
        switch($app_path){
          case "83": return "Milestones";
          case "35": return "Provider's Corner";
          case "84": return "Recurring Goals";
          case "1":  return "Users";
          case "52": return "SMS";
          case "57": return "Email";
          default: return "Unknown Item";
        }
      case "dashboard": return "Dashboard";
      case "reports": return "Reports";
    }
    return "Unknown";
  }  
  $module_name = get_module_name();

  /* For debugging */
  // echo "<script>console.log(\"$app_path\");</script>";
  // echo "<script>console.log(\"$module_name\");</script>";

  switch($module_name){
    case "Milestones": 
      break;
    case "Milestone Item Page":
      echo '<script src="lambent/rewards/animate-sprite-edited.js"></script>';
      echo '<script src="lambent/rewards/rewards.js"></script>';
      echo '<script src="lambent/milestone-item.js"></script>';
      break;
    case "Recurring Goals": 
      break;      
  }
