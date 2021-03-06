<?php

switch($app_module_action)
{  
  case 'select':  
        if(isset($_POST['checked']))
        {
          $app_selected_items[$_POST['reports_id']][] = $_POST['id'];
        }
        else
        {
          $key = array_search($_POST['id'], $app_selected_items[$_POST['reports_id']]);
          if($key!==false)
          {
            unset($app_selected_items[$_POST['reports_id']][$key]);
          }
        }        
        
        $app_selected_items[$_POST['reports_id']] =  array_unique($app_selected_items[$_POST['reports_id']]);        
      exit();
    break;
  case 'select_all':
  
      if(isset($_POST['checked']))
      {
      	if(!isset($_POST['force_display_id'])) $_POST['force_display_id'] = '';
      	
      	$reports_info = db_find('app_reports',$_POST['reports_id']);
      	
      	$listing_sql_query_select = '';
        $listing_sql_query = '';
        $listing_sql_query_join = '';
        $listing_sql_query_having = '';
        $sql_query_having = array();
        
        //prepare forumulas query
        $listing_sql_query_select = fieldtype_formula::prepare_query_select($current_entity_id, $listing_sql_query_select,false,array('reports_id'=>$_POST['reports_id']));
        
        //prepare count of related items in listing
        $listing_sql_query_select = fieldtype_related_records::prepare_query_select($current_entity_id, $listing_sql_query_select, $reports_info);
        
        if(isset($_POST['search_keywords']) and strlen($_POST['search_keywords'])>0)
        {
          require(component_path('items/add_search_query'));
        }
        
        if((isset($_POST['search_keywords']) and strlen($_POST['search_keywords'])>0 and $_POST['search_in_all']=='true') or strlen($_POST['force_display_id']))
				{
					//skip filters if there is search keyworkds and option search_in_all in 
				}
				else
				{        
	        $listing_sql_query = reports::add_filters_query($_POST['reports_id'],$listing_sql_query);
	        
	        //prepare having query for formula fields
	        if(isset($sql_query_having[$current_entity_id]))
	        {
	        	$listing_sql_query_having  = reports::prepare_filters_having_query($sql_query_having[$current_entity_id]);
	        }
        }
                
        if($parent_entity_item_id>0)
        {
          $listing_sql_query .= " and e.parent_item_id='" . db_input($parent_entity_item_id) . "'";
        }
        
        //exclude admin users from listing for not admin users
        if($current_entity_id==1 and $app_user['group_id']>0)
        {
        	$listing_sql_query .= " and e.field_6>0";
        }
        
        //force display items by ID
        if(strlen($_POST['force_display_id']))
        {
        	$listing_sql_query .= " and e.id in (" . $_POST['force_display_id'] . ")";
        }
        
        //force extra filter
        if(isset($_POST['force_filter_by']))
        if(strlen($_POST['force_filter_by']))
        {
        	$listing_sql_query .= reports::force_filter_by($_POST['force_filter_by']);
        }
             
        //check access to action with assigned only
        $force_access_query = users::has_users_access_name_to_entity('action_with_assigned',$current_entity_id);
        
        $listing_sql_query = items::add_access_query($current_entity_id,$listing_sql_query,$force_access_query);
        
        //add having query
        $listing_sql_query .= $listing_sql_query_having;
        
	      if(strlen($_POST['listing_order_fields'])>0)
				{  
				  $info = reports::add_order_query($_POST['listing_order_fields'],$current_entity_id);
				      
				  $listing_order_fields_id = $info['listing_order_fields_id'];
				  $listing_order_fields = $info['listing_order_fields'];
				  $listing_order_clauses = $info['listing_order_clauses'];
				  
				  $listing_sql_query .= $info['listing_sql_query'];
				  $listing_sql_query_join .= $info['listing_sql_query_join'];
				}
        
        $app_selected_items[$_POST['reports_id']] = array();
        $listing_sql = "select e.* " . $listing_sql_query_select . " from app_entity_" . $current_entity_id . " e "  . $listing_sql_query_join . " where e.id>0 " . $listing_sql_query;        
        $items_query = db_query($listing_sql);
        while($item = db_fetch_array($items_query))
        {
          $app_selected_items[$_POST['reports_id']][] = $item['id'];
        }        
      }
      else
      {
        $app_selected_items[$_POST['reports_id']] = array();
      }
                  
    break;
    
}    