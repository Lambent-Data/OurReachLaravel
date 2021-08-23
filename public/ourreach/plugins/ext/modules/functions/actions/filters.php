<?php

$current_functions_info_query = db_query("select * from app_ext_functions where id='" . db_input($_GET['functions_id']). "'");
if(!$current_functions_info = db_fetch_array($current_functions_info_query))
{
  $alerts->add(TEXT_EXT_FUNCTION_NOT_FOUND,'error');
  redirect_to('ext/functions/functions');
}


$current_reports_info_query = db_query("select * from app_reports where id='" . db_input($current_functions_info['reports_id']). "'");
if(!$current_reports_info = db_fetch_array($current_reports_info_query))
{
  $alerts->add(TEXT_REPORT_NOT_FOUND,'error');
  redirect_to('ext/functions/functions');
}

switch($app_module_action)
{
  case 'save':
    
    $values = '';
    
    if(isset($_POST['values']))
    {
      if(is_array($_POST['values']))
      {
        $values = implode(',',$_POST['values']);
      }
      else
      {
        $values = $_POST['values'];
      }
    }
    $sql_data = array('reports_id'=>(isset($_GET['parent_reports_id']) ? $_GET['parent_reports_id']:$_GET['reports_id']),
                      'fields_id'=>$_POST['fields_id'],
                      'filters_condition'=>$_POST['filters_condition'],                                              
                      'filters_values'=>$values,
                      );
        
    if(isset($_GET['id']))
    {        
      db_perform('app_reports_filters',$sql_data,'update',"id='" . db_input($_GET['id']) . "'");       
    }
    else
    {               
      db_perform('app_reports_filters',$sql_data);                  
    }
    
    redirect_to('ext/functions/filters','functions_id=' . $_GET['functions_id']);
        
          
  break;
  case 'delete':
      if(isset($_GET['id']))
      {      
        db_query("delete from app_reports_filters where id='" . db_input($_GET['id']) . "'");
        
        redirect_to('ext/functions/filters','functions_id=' . $_GET['functions_id']);                  
      }
    break;   
}