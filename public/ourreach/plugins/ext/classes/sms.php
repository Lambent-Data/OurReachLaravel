<?php

class sms
{
	public $entity_id;
	
	public $item_id;
	
	public $item_info;
	
	public $is_debug;
	
	public $module;
	
	public $module_id;
	
	public $send_to;
	
	function __construct($entity_id, $item_id)
	{
		$this->is_debug = false;
		
		$this->entity_id = $entity_id;
		
		$this->item_id = $item_id;	
		
		$this->send_to = array();
	}	
	
	function set_current_item_info()
	{
		$item_query = db_query("select e.* from app_entity_" . $this->entity_id . " e where id='" . $this->item_id . "'",false);
		if($item = db_fetch_array($item_query))
		{
			$this->item_info = $item;
		}		
	}
	
	static function get_action_type_choices()
	{
		$choices = array();
		$choices[TEXT_EXT_ADDING_NEW_RECORD]['insert_send_to_number'] = TEXT_EXT_SEND_TO_NUMBER;
		$choices[TEXT_EXT_ADDING_NEW_RECORD]['insert_send_to_record_number'] = TEXT_EXT_SEND_TO_RECORD_NUMBER;
		$choices[TEXT_EXT_ADDING_NEW_RECORD]['insert_send_to_user_number'] = TEXT_EXT_SEND_TO_USER_NUMBER;
		$choices[TEXT_EXT_ADDING_NEW_RECORD]['insert_send_to_number_in_entity'] = TEXT_EXT_SEND_TO_RELATED_ENTITY;
				
		$choices[TEXT_EXT_ADDITING_RECORD]['edit_send_to_number'] = TEXT_EXT_SEND_TO_NUMBER;
		$choices[TEXT_EXT_ADDITING_RECORD]['edit_send_to_record_number'] = TEXT_EXT_SEND_TO_RECORD_NUMBER;
		$choices[TEXT_EXT_ADDITING_RECORD]['edit_send_to_user_number'] = TEXT_EXT_SEND_TO_USER_NUMBER;
		$choices[TEXT_EXT_ADDITING_RECORD]['edit_send_to_number_in_entity'] = TEXT_EXT_SEND_TO_RELATED_ENTITY;
		
		return $choices;
	}
	
	static function get_action_type_name($type)
	{
		$text = '';
				
		switch($type)
		{
			case 'edit_send_to_number':
			case 'insert_send_to_number': 
				$text .= TEXT_EXT_SEND_TO_NUMBER;
				break;
			case 'edit_send_to_record_number':
			case 'insert_send_to_record_number':
				$text .= TEXT_EXT_SEND_TO_RECORD_NUMBER;
				break;
			case 'edit_send_to_user_number':
			case 'insert_send_to_user_number':
				$text .= TEXT_EXT_SEND_TO_USER_NUMBER;
				break;
			case 'insert_send_to_number_in_entity':
			case 'edit_send_to_number_in_entity':
			    $text .= TEXT_EXT_SEND_TO_RELATED_ENTITY;
			    break;
		}
		
		return $text;
	}
	
	function prepare_parent_value_field($entities_id, $fields_id, $value, $item_info)
	{
		global $app_fields_cache;
		
		if(isset($app_fields_cache[$entities_id][$fields_id]))
		{
			if($app_fields_cache[$entities_id][$fields_id]['type'] == 'fieldtype_parent_value')
			{
				$fieldtype_parent_value = new fieldtype_parent_value;
				
				$options = [
						'field' => ['entities_id'=>$entities_id,'configuration'=>$app_fields_cache[$entities_id][$fields_id]['configuration']],
						'item' => $item_info,
				];
				
				$value = $fieldtype_parent_value->output($options);
				
				return $value;
			}
		}
		
		return $value;
	}
	
	function send_insert_msg()
	{
		//get current item info
		$this->set_current_item_info();
		
		$text_pattern = new fieldtype_text_pattern;
		
		$rules_query = db_query("select r.*, m.module from app_ext_sms_rules r, app_ext_modules m where r.entities_id='" . $this->entity_id . "' and length(description)>0 and (r.fields_id>0 or length(r.phone)>0) and m.id=r.modules_id and m.is_active=1");				
		while($rules = db_fetch_array($rules_query))
		{
			
			//check field
			if($rules['monitor_fields_id']>0)
			{
				//check fields choices
				if(strlen($rules['monitor_choices']))
				{
					if(!in_array($this->item_info['field_' . $rules['monitor_fields_id']], explode(',',$rules['monitor_choices'])))
					{
						continue;
					}
				}
			}
													
			$this->module = $rules['module'];
			$this->module_id = $rules['modules_id'];
			
			$text = $text_pattern->output_singe_text($rules['description'], $this->entity_id, $this->item_info);
			
			$send_to = array();
			
			switch($rules['action_type'])
			{				
				case 'insert_send_to_number':
					if(strlen($rules['phone']))
					{
						$send_to = explode(',',$rules['phone']);																	
					}
					break;				
				case 'insert_send_to_record_number':					
					if(isset($this->item_info['field_' . $rules['fields_id']]))
					{
						//check if field type 'parent_value' and get value
						$this->item_info['field_' . $rules['fields_id']] = $this->prepare_parent_value_field($this->entity_id, $rules['fields_id'], $this->item_info['field_' . $rules['fields_id']], $this->item_info); 
						
						if(strlen($this->item_info['field_' . $rules['fields_id']]))
						{
							$send_to = array($this->item_info['field_' . $rules['fields_id']]);																		
						}
					}
					
					break;				
				case 'insert_send_to_user_number':
					$this->send_to = array_unique($this->send_to);
					
					foreach($this->send_to as $user_id)
					{
						$user_info = db_find('app_entity_1',$user_id);
						if(isset($user_info['field_' . $rules['fields_id']]))
						{
							if(strlen($user_info['field_' . $rules['fields_id']]))
							{
								$send_to[] = $user_info['field_' . $rules['fields_id']];																								
							}
						}
					}
					break;
					
				case 'insert_send_to_number_in_entity':
				    $value = explode(':',$rules['phone']);
				    
				    $field_id = $value[0];
				    $send_to_field_id = $value[1];
				    
				    if(isset($this->item_info['field_' . $field_id]))
				    {
    				    $fields_query = db_query("select configuration from app_fields where id='" . $field_id . "'");
    				    if($fields = db_fetch_array($fields_query))
    				    {
    				        $cfg = new settings($fields['configuration']);
    				        $send_to_entity_id = $cfg->get('entity_id');
    				        
    				        $send_to = $this->get_set_to_from_entity($send_to_entity_id, $this->item_info['field_' . $field_id], $send_to_field_id);
    				    }
				    }
				    break;
			}
				
			if(count($send_to))
			{
				$this->send($send_to,$text);
			}
			
		}
				
	}
	
	function send_edit_msg($previous_item_info)
	{		
		//get current item info
		$this->set_current_item_info();
		
		$text_pattern = new fieldtype_text_pattern;
		
		$rules_query = db_query("select r.*, m.module from app_ext_sms_rules r, app_ext_modules m where r.entities_id='" . $this->entity_id . "' and monitor_fields_id>0 and length(description)>0 and (r.fields_id>0 or length(r.phone)>0) and m.id=r.modules_id and m.is_active=1");
		while($rules = db_fetch_array($rules_query))
		{
			//check if field value changed and skip notification if not changed
			if($this->item_info['field_' . $rules['monitor_fields_id']]==$previous_item_info['field_' . $rules['monitor_fields_id']])
			{
				continue;
			}
			
			//check fields choices
			if(strlen($rules['monitor_choices']))
			{
				if(!in_array($this->item_info['field_' . $rules['monitor_fields_id']], explode(',',$rules['monitor_choices'])))
				{
					continue;
				}
			}
			
			$this->module = $rules['module'];
			$this->module_id = $rules['modules_id'];
				
			$text = $text_pattern->output_singe_text($rules['description'], $this->entity_id, $this->item_info);
				
			$send_to = array();
				
			switch($rules['action_type'])
			{
				case 'edit_send_to_number':
					if(strlen($rules['phone']))
					{
						$send_to = explode(',',$rules['phone']);
					}
					break;
				case 'edit_send_to_record_number':
					if(isset($this->item_info['field_' . $rules['fields_id']]))
					{
						//check if field type 'parent_value' and get value
						$this->item_info['field_' . $rules['fields_id']] = $this->prepare_parent_value_field($this->entity_id, $rules['fields_id'], $this->item_info['field_' . $rules['fields_id']], $previous_item_info);						
						
						if(strlen($this->item_info['field_' . $rules['fields_id']]))
						{
							$send_to = array($this->item_info['field_' . $rules['fields_id']]);
						}
					}
						
					break;
				case 'edit_send_to_user_number':
					
					if(!$this->send_to)
					{
						$this->send_to = users::get_assigned_users_by_item($this->entity_id, $this->item_info['id']);						
					}
					
					$this->send_to = array_unique($this->send_to);
															
					foreach($this->send_to as $user_id)
					{												
						$user_info = db_find('app_entity_1',$user_id);
						if(isset($user_info['field_' . $rules['fields_id']]))
						{
							if(strlen($user_info['field_' . $rules['fields_id']]))
							{
								$send_to[] = $user_info['field_' . $rules['fields_id']];
							}
						}
					}
					break;
				case 'edit_send_to_number_in_entity':
				    $value = explode(':',$rules['phone']);
				    
				    $field_id = $value[0];
				    $send_to_field_id = $value[1];
				    
				    if(isset($this->item_info['field_' . $field_id]))
				    {
				        $fields_query = db_query("select configuration from app_fields where id='" . $field_id . "'");
				        if($fields = db_fetch_array($fields_query))
				        {
				            $cfg = new settings($fields['configuration']);
				            $send_to_entity_id = $cfg->get('entity_id');
				            
				            $send_to = $this->get_set_to_from_entity($send_to_entity_id, $this->item_info['field_' . $field_id], $send_to_field_id);
				        }
				    }
				    break;
			}
		
			if(count($send_to))
			{
				$this->send($send_to,$text);
			}
			
		}
		
	}
	
	function send($send_to,$text)
	{
		if($this->is_debug)
		{
			$errfile=fopen("log/sms_" . date("M_Y"). ".txt","a+");
			foreach($send_to as $phone)
			{
				fputs($errfile,$time=date("d M Y H:i:s") . ' ' . $this->module_id .  ':' . $this->module .  ': ' .  $phone . " " . $text . "\n\n");
			}
			fclose($errfile);
		}
		else
		{						
			
			$module = new $this->module;
			$module->send($this->module_id,$send_to,$text);
									
		}
	}
		
	static function send_by_module($module_id, $send_to,$text)
	{		
		$is_debug = false;
		
		$module_info_query = db_query("select * from app_ext_modules where id='" . (int)$module_id . "' and type='sms' and is_active=1");
		if($module_info = db_fetch_array($module_info_query))
		{
			if($is_debug)
			{
				$errfile=fopen("log/sms_" . date("M_Y"). ".txt","a+");
				fputs($errfile,$time=date("d M Y H:i:s") . ' ' . $module_info['id'] .  ':' . $module_info['module'] .  ': ' .  $send_to . " " . $text . "\n\n");
				fclose($errfile);
			}
			else
			{												
				modules::include_module($module_info,'sms');
				
				$send_to = [$send_to];
			
				$module = new $module_info['module'];
				$module->send($module_info['id'],$send_to,$text);
			}
		}	
		
	}
	
	function get_set_to_from_entity($entities_id,$values,$phone_field_id)
	{
	    global $app_fields_cache;
	    
	    if(!strlen($values) or !isset($app_fields_cache[$entities_id][$phone_field_id])) return [];
	    
	    $send_to = [];
	    $items_query = db_query("select field_{$phone_field_id} from app_entity_{$entities_id} where id in ({$values})");
	    while($items = db_fetch_array($items_query))
	    {
	        $send_to[] = $items['field_' . $phone_field_id];
	    }
	    
	    //print_r($send_to);
	    //exit();
	    
	    return $send_to;
	}
	
}