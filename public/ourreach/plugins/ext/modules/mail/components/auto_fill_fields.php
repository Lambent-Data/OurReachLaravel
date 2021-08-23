<?php

$mail_groups_id = _get::int('mail_groups_id');

$accounts_query = db_query("select mae.* from app_ext_mail_accounts_entities mae, app_ext_mail_groups mg where mae.accounts_id=mg.accounts_id and mg.id='" . $mail_groups_id . "' and mae.entities_id='" . $current_entity_id . "'");
if($accounts = db_fetch_array($accounts_query))
{
	//print_r($accounts);
	
	$actions_fields_query = db_query("select af.id, af.fields_id, af.value, f.name, f.type as field_type from app_ext_mail_accounts_entities_fields af, app_fields f left join app_forms_tabs t on f.forms_tabs_id=t.id  where f.id=af.fields_id and af.account_entities_id='" . $accounts['id'] ."' order by t.sort_order, t.name, f.sort_order, f.name");		
	while($actions_fields = db_fetch_array($actions_fields_query))
	{		
		$obj['field_' . $actions_fields['fields_id']] = $actions_fields['value'];
	}
			
	$mail_query = db_query("select * from app_ext_mail where groups_id='" . $mail_groups_id. "' and is_sent=0 order by id desc limit 1");
	if($mail = db_fetch_array($mail_query))
	{
				
		foreach(['from_name','from_email','subject','body'] as $key)
		{
			if($accounts[$key])
			{								
				switch(true)
				{
					case $key=='subject':
						$value = $mail['subject_cropped'];
						break;
					case $key=='body':
						$value = (strlen($mail['body']) ? $mail['body'] : $mail['body_text']);
						break;
					default:
						$value = $mail[$key];
						break;
					
				}
				$obj['field_' . $accounts[$key]] = $value;
			}
		}
		
	}		
}