<?php

$obj = array();

if(isset($_GET['id']))
{
  $obj = db_find('app_ext_pivot_tables',$_GET['id']);  
}
else
{
  $obj = db_show_columns('app_ext_pivot_tables');  
}