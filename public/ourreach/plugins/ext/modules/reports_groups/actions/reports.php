<?php

if(!users::has_reports_access())
{
	redirect_to('dashboard/access_forbidden');
}

$app_title = app_set_title(TEXT_REPORTS_GROUPS);

switch($app_module_action)
{
	case 'save':
		$sql_data = array(
			'name'=>db_prepare_input($_POST['name']),		
			'menu_icon'=>$_POST['menu_icon'],
			'in_menu'=>(isset($_POST['in_menu']) ? $_POST['in_menu']:0),
			'sort_order'=>$_POST['sort_order'],	
			'created_by' => $app_user['id'],
			'is_common' =>1,
			'users_groups' => (isset($_POST['users_groups']) ? implode(',', $_POST['users_groups']) : ''),
		);

		if(isset($_GET['id']))
		{			
			db_perform('app_reports_groups',$sql_data,'update',"id='" . db_input($_GET['id']) . "'");
		}
		else
		{
			db_perform('app_reports_groups',$sql_data);					
		}

		redirect_to('ext/reports_groups/reports');
		break;
	case 'delete':
		if(isset($_GET['id']))
		{
			db_delete_row('app_reports_groups',$_GET['id']);
			
			redirect_to('ext/reports_groups/reports');
		}
		break;
}		
