<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: X-Requested-With");

  require('includes/application_top.php');

  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: X-Requested-With");

  /* LAMBENT DATA ADDITION:
   * These files define functions to replace large pieces of certain pages served by Ruko.
   */
  require('lambent/page_override.php');

  if($app_module === "ldbackend"){
    $input = file_get_contents('php://input');
    $input_obj = json_decode($input, true);
    $input_obj['data']['ruko_user'] = $app_user['id'];
    //die(json_encode($input_obj['data']));
    require('lambent/curl_request.php');
    echo make_backend_request($input_obj['type'], $input_obj['url'], $input_obj['data']);
    die();
  }else{
    
    /* Include here a list of all pages that have been altered from vanilla Ruko. (Not including pages in lambent/.)
    *   On dev only: api/rest.php -- added header to allow cross-origin api queries. CS
    *   On dev only: plugins/ext/classes/api.php -- added functions to serve api queries using the "Remember me" info instead of the raw username and password. CS
    * 
    * -- Corey Sinnamon
    */

      
  //include available plugins
    require('includes/plugins.php');  
    
  //include overall action for whole module        
    if(is_file($path = $app_plugin_path . 'modules/' . $app_module . '/module_top.php'))
    {
      require($path);
    }
    
  //include plugins menu  
    require('includes/plugins_menu.php'); 
      

  //include module action      
    if(is_file($path = $app_plugin_path . 'modules/' . $app_module . '/actions/' . $app_action . '.php'))
    {
      require($path);
    }
    
    if(IS_AJAX)
    {
      if(is_file($path = $app_plugin_path . 'modules/' . $app_module . '/views/' . $app_action . '.php'))
      {    
        require($path);
      }
    }
    else
    {
      // LAMBENT DATA ADDITION: This is where we intercept certain pages and replace the content with our own page.
      if (is_lambent_page()){
        $backend_domain = '';
        switch(get_lambent_page_name()){
          case "milestone info":
            $parts = explode("-", $app_path);
            if (count($parts) < 2 or $parts[0] !== "83"){
              break;
            }
            $milestone_id = $parts[1];
            $new_backend_url = $backend_domain.'/ruko/milestone/'.$milestone_id.'?ruko_user='.$app_user['id'];
            break;
          case "milestone listing":
            $new_backend_url = $backend_domain.'/milestones?ruko_user='.$app_user['id'];
            break;
          case "dashboard":
            $new_backend_url = $backend_domain.'/dashboard?ruko_user='.$app_user['id'];
            break;
        }
        require('lambent/new_layout.php');
      }else{
        // Continue with regular Ruko output
        require('template/' . $app_layout);
      }
      // Add some custom js to every page.
      echo '<script type="text/javascript" src="lambent/all-pages.js"></script>';
    }

    require('includes/application_bottom.php');
  }