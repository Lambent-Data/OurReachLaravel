<?php

//check if report exist
$reports_query = db_query("select * from app_ext_image_map where id='" . db_input(_get::int('id')) . "'");
if(!$reports = db_fetch_array($reports_query))
{
	redirect_to('dashboard/page_not_found');
}

//check access
if(!image_map::has_access($reports['users_groups']))
{
	redirect_to('dashboard/access_forbidden');
}