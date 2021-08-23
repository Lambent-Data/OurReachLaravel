<?php

//require('get_milestone_id.php');

/* page_override.php 
 * Defines functions to serve pages bodies and headers
 * 
 */
function is_milestone_listing_page($app_module, $app_path){
  return $app_module === "items" and $app_path === "83";
}

function is_milestone_info_page($app_module, $app_action, $current_entity_id){
  return $app_module === "items" and $app_action === "info" and $current_entity_id === 83;
}

function is_dashboard($app_module){
  return $app_module === "dashboard";
}

function is_lambent_page(){
  return (get_lambent_page_name() !== "none");
}

function get_lambent_page_name(){
  global $app_module, $app_action, $current_entity_id, $app_path, $app_user;
  if (is_milestone_info_page($app_module, $app_action, $current_entity_id)){
    return "milestone info";
  } elseif (is_milestone_listing_page($app_module, $app_path)){
    return "milestone listing";
  } elseif (is_dashboard($app_module)){
    if ($app_user['fields']['field_6'] == "6"){
      // User is a parent
      return "dashboard";
    }
  }
  return "none";
}