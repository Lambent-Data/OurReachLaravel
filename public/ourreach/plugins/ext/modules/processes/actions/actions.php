<?php

$app_process_info_query = db_query("select * from app_ext_processes where id='" . _get::int('process_id'). "'");
if(!$app_process_info = db_fetch_array($app_process_info_query))
{
	redirect_to('ext/processes/processes');
}


$app_title = app_set_title(TEXT_EXT_PROCESSES_ACTIONS);

switch($app_module_action)
{
	case 'save':
		$sql_data = array(
		'process_id'=>_get::int('process_id'),
		'type'=>$_POST['type'],
		'description'=>$_POST['description'],
		'sort_order'=>$_POST['sort_order'],	
		'settings' => (isset($_POST['settings']) ? json_encode($_POST['settings']) : ''),
		);

		if(isset($_GET['id']))
		{
			$actions_info = db_find('app_ext_processes_actions',$_GET['id']);

			//check type and if it's changed remove fileds action
			if($actions_info['type']!=$_POST['type'])
			{
				db_query("delete from app_ext_processes_actions_fields where actions_id='" . db_input($_GET['id']) . "'");
				db_query("delete from app_ext_processes_clone_subitems where actions_id='" . db_input($_GET['id']) . "'");
			}
			 
			db_perform('app_ext_processes_actions',$sql_data,'update',"id='" . db_input($_GET['id']) . "'");
		}
		else
		{
			db_perform('app_ext_processes_actions',$sql_data);

			$insert_id = db_insert_id();
		}

		redirect_to('ext/processes/actions','process_id=' . _get::int('process_id'));
		break;

	case 'delete':
		if(isset($_GET['id']))
		{
			$obj = db_find('app_ext_processes_actions',$_GET['id']);

			db_query("delete from app_ext_processes_actions where id='" . db_input($_GET['id']) . "'");
			db_query("delete from app_ext_processes_actions_fields where actions_id='" . db_input($_GET['id']) . "'");
			
			db_query("delete from app_ext_processes_clone_subitems where actions_id='" . db_input($_GET['id']) . "'");
			
			$reports_info_query = db_query("select * from app_reports where reports_type='process_action" . $_GET['id'] . "'");
			if($reports_info = db_fetch_array($reports_info_query))
			{
				db_query("delete from app_reports_filters where reports_id='" . db_input($reports_info['id']) . "'");
				db_query("delete from app_reports where id='" . db_input($reports_info['id']) . "'");
			}
			 
			redirect_to('ext/processes/actions','process_id=' . _get::int('process_id'));
		}
		break;
	case 'actions_type_settings':
						
		$entities_id = _get::int('entities_id');
		$entity_cfg = entities::get_cfg($entities_id);
		$type = $_POST['type'];
		$html = '';
		
		if(isset($_POST['id']))
		{
		  $obj = db_find('app_ext_processes_actions',_post::int('id'));  
		}
		else
		{
		  $obj = db_show_columns('app_ext_processes_actions');
		}
		
		$settigns = new settings($obj['settings']);
                
                		
		switch(true)
		{
                    case strstr($type,'save_export_template_entity_'):
                        
                        $save_export_template = $settigns->get('save_export_template');
                        
                        $choices = [''=>''];
                        $templates_query = db_query("select id, name, type from app_ext_export_templates where entities_id='" . $entities_id . "'");
                        while($templates = db_fetch_array($templates_query))
                        {
                            if($templates['type']=='docx')
                            {
                                $choices[$templates['id'] . '_pdf'] = $templates['name'] . ' (PDF)';
                                $choices[$templates['id'] . '_docx'] = $templates['name'] . ' (DOCX)';
                            }
                            else
                            {
                                $choices[$templates['id'] . '_pdf'] = $templates['name'] . ' (PDF)';
                            }
                        }
                        
                        $html .='
                                    <div class="form-group">
                                        <label class="col-md-3 control-label" ></label>
                                        <div class="col-md-9">
                                              ' . tooltip_text(TEXT_EXT_SELECT_TEMPLATES_TO_SAVE). '
                                        </div>
                                    </div>                                
                                ';
                        
                        $fields_query = db_query("select id, name, type from app_fields where entities_id='" . $entities_id . "' and type in ('fieldtype_input_file','fieldtype_attachments')");
                        while($fields = db_fetch_array($fields_query))
                        {
                            if($fields['type']=='fieldtype_input_file')
                            {
                                $html .='
                                    <div class="form-group">
                                        <label class="col-md-3 control-label" >' . $fields['name'] . '</label>
                                        <div class="col-md-9">
                                              ' . select_tag('settings[save_export_template][' . $fields['id']. ']',$choices,($save_export_template[$fields['id']] ?? ''),array('class'=>'form-control chosen-select')) . '
                                        </div>
                                    </div>                                
                                ';
                            }
                            elseif($fields['type']=='fieldtype_attachments')
                            {
                                $html .='
                                    <div class="form-group">
                                        <label class="col-md-3 control-label" >' . $fields['name'] . '</label>
                                        <div class="col-md-9">
                                              ' . select_tag('settings[save_export_template][' . $fields['id']. '][]',$choices,($save_export_template[$fields['id']] ?? ''),array('class'=>'form-control chosen-select','multiple'=>true)) . '
                                        </div>
                                    </div>                                
                                ';
                            }
                        }
                        break;
		    case strstr($type,'link_records_by_mysql_query_'):
		        $html .='
								<div class="form-group">
							  	<label class="col-md-3 control-label" for="settings_copy_comments">' . TEXT_FIELDTYPE_MYSQL_QUERY_WHERE_QUERY . '</label>
							    <div class="col-md-9">
							  	  ' . textarea_tag('settings[where_query]',$settigns->get('where_query'),array('class'=>'form-control required')) . '
							  	  ' . tooltip_text(TEXT_EXT_PROCESS_ACTION_LINK_RECORDS_BY_MYSQL_QUERY_INFO). '
							    </div>
							  </div>
								';
		        break;
			case strstr($type,'clone_item_entity_'):
				
				$choices = array();
				
				foreach(entities::get_tree(0,[],0,[],[1]) as $v)
				{
					$choices[$v['id']] = str_repeat('- ', $v['level']) . $v['name'];
				}
				
				$html .='
							<div class="form-group">
						  	<label class="col-md-3 control-label" for="settings_copy_sub_entities">' . TEXT_EXT_CLONE_TO_ENTITY . '</label>
						    <div class="col-md-9">
						  	  ' . select_tag('settings[clone_to_entity][]',$choices,$settigns->get('clone_to_entity'),array('class'=>'form-control chosen-select')) . '
						    </div>
						  </div>
							';
				break;
			case strstr($type,'copy_item_entity_'):
				
				//copy comment
				if($entity_cfg['use_comments']==1)
				{	
					$html .='
								<div class="form-group">
							  	<label class="col-md-3 control-label" for="settings_copy_comments">' . TEXT_EXT_COPY_COMMENTS . '</label>
							    <div class="col-md-9">
							  	  ' . select_tag('settings[copy_comments]',['0'=>TEXT_NO,'1'=>TEXT_YES],$settigns->get('copy_comments'),array('class'=>'form-control input-small')) . '
							    </div>
							  </div>
								';
				}
				
				//copy related items
				$choices = [];
				$fields_query = db_query("select f.id, f.name from app_fields f, app_forms_tabs t where f.type in ('fieldtype_related_records') and f.entities_id='" . db_input($entities_id) . "' and f.forms_tabs_id=t.id");
				while($field = db_fetch_array($fields_query))
				{
					$choices[$field['id']] = $field['name'];  
				}
				
				if(count($choices))
				{
					$html .='
							<div class="form-group">
						  	<label class="col-md-3 control-label" for="settings_copy_related_items">' . TEXT_EXT_COPY_RELATE_RECORDS . '</label>
						    <div class="col-md-9">	
						  	  ' . select_tag('settings[copy_related_items][]',$choices,$settigns->get('copy_related_items'),array('class'=>'form-control chosen-select','multiple'=>'multiple')) . '
						    </div>			
						  </div>
							';
				}
				
				//coy sub entities
				$choices = [];
				$entities_query = db_query("select * from app_entities where parent_id='" . db_input($entities_id) . "' order by sort_order,name");
				while($entities = db_fetch_array($entities_query))
				{
					$choices[$entities['id']] = $entities['name'];
				}
				
				if(count($choices))
				{
					$html .='
							<div class="form-group">
						  	<label class="col-md-3 control-label" for="settings_copy_sub_entities">' . TEXT_EXT_COPY_SUB_ENTITIES . '</label>
						    <div class="col-md-9">
						  	  ' . select_tag('settings[copy_sub_entities][]',$choices,$settigns->get('copy_sub_entities'),array('class'=>'form-control chosen-select','multiple'=>'multiple')) . '
						    </div>
						  </div>
							';
				}
				
				break;
		}
		
		echo $html;
		
		exit();
		break;
}