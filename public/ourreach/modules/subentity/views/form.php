<?php

//prepare public form
if($app_items_form_name=='public_form')
{
    $app_user = array();
    $app_user['id'] = 0;
    $app_user['group_id'] = 0;
    $app_user['name'] = CFG_EMAIL_NAME_FROM;
    $app_user['email'] = CFG_EMAIL_ADDRESS_FROM;
    $app_user['language'] = CFG_APP_LANGUAGE;
    
    echo '
        <style>
        #sub-items-form .modal-header .close,
        #sub-items-form .modal-footer .btn-close{
            display:none;
        }               
        </style>        
        ';
}

echo '
    <style>
    #sub-items-form .form-group-fieldtype_subentity_form{
        display:none;
    }
    </style>
    ';

//get data
$subentity_form_params = explode('_',str_replace('subentity_form_','',$app_redirect_to));

$current_entity_id = _GET('current_entity_id');
$entity_cfg = new entities_cfg($current_entity_id);
$parent_entity_item_id = 0;

$obj = db_show_columns('app_entity_'. $current_entity_id);
 
//prepare exist data
if(isset($subentity_form_params[2]))
{    
    $row = $subentity_form_params[2];
    if(isset($app_subentity_form_items[$fields_id][$row]))
    {
        foreach($app_subentity_form_items[$fields_id][$row] as $field_id=>$field_value)
        {
            $obj['field_' . $field_id] = $field_value;
        }
        
    }
    
}

//include default items form
require('modules/items/views/form.php');
