<?php
//check access
if($app_user['group_id']>0)
{
	exit();
}

$obj = array();

if(isset($_GET['id']))
{
	$obj = db_find('app_ext_image_map',$_GET['id']);
}
else
{
	$obj = db_show_columns('app_ext_image_map');
	$obj['scale'] = 3;
}