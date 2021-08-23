<?php

if(!mail_accounts::user_has_access())
{
	redirect_to('dashboard/access_forbidden');
}


switch($app_module_action)
{
	case 'send':
		
		$accounts_id = _post::int('accounts_id');
		
		$mail_account = db_find('app_ext_mail_accounts',$accounts_id);
				
		$mail_to = $_POST['mail_to'];
		
		if(!count($mail_to)) redirect_to('ext/mail/accounts');
		
		$subject = db_prepare_html_input($_POST['subject']);
		$subject_cropped = mail_info::crop_subject($subject);
		$body = db_prepare_html_input($_POST['body']);
		
		$body = str_replace('<blockquote>','<blockquote style="margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204,204,204); padding-left: 1ex;">',$body);
		
		$attachments = [];
		
		if(isset($_POST['message_attachments']))		
		if(strlen($_POST['message_attachments']))
		{
			foreach(explode(',',$_POST['message_attachments']) as $file)
			{
				$file_info = mail_info::parse_attachment_filename($file);
				$attachments[$file_info['file_path']] = $file_info['name'];
			}
		}
		
		//print_r($attachments);
		//print_rr($mail_to);
		//exit();
		
		
		$send_check = true;
		$error_msg = [];
		$to_names = [];
		$to_emails = [];
		foreach($mail_to as $mail_to_value)
		{	
			if (preg_match('/([^<]+)<([^>]+)>/', $mail_to_value, $regs))
			{
				$to_name = trim($regs[1]);
				$to_email = trim($regs[2]);
				
				$to_names[] = trim($regs[1]);
				$to_emails[] = trim($regs[2]);
			}
			else
			{
				$to_name = '';
				$to_email = trim($mail_to_value);
				
				$to_names[] = '';
				$to_emails[] = trim($mail_to_value);
			}
			
			$options = [
			        'from' => (strlen($mail_account['email']) ? $mail_account['email'] : $mail_account['login']),
					'from_name' => $mail_account['name'],
					'to' => $to_email,
					'to_name' => $to_name,
					'subject' => $subject,
					'body' => $body,
					'attachments' =>$attachments,
			];
				
			//print_rr($options);
			//exit();
				
			$response = mail_accounts::send_mail($mail_account, $options);
			
			
			if($response['status']=='error')
			{
				$text = $to_email . ': ' . $response['text'];
				$alerts->add($text,'error');
				$error_msg[] = str_replace('https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting','',$text);
				$send_check = false;
			}				
		}
		
		//exit();
		
		if($send_check)
		{
			$alerts->add(TEXT_EXT_MESSAGE_SENT,'success');
		}
		
		

//create new email group		
		$data = [
				'accounts_id'=>$accounts_id,
				'subject_cropped'=>$subject_cropped,
		];
			
		db_perform('app_ext_mail_groups', $data);
			
		$mail_groups_id = db_insert_id();
		
//assign users to group		
		foreach($to_emails as $email)
		{
			$data = [
					'mail_groups_id'=>$mail_groups_id,
					'from_email'=>$email
			];
				
			db_perform('app_ext_mail_groups_from', $data);
		}
						
//create eamil						
		$mail_data = [
				'date_added' => time(),
				'is_new' =>0,
				'is_sent' => 1,
				'groups_id' => $mail_groups_id,
				'accounts_id' => $accounts_id,
				'subject' => $subject,
				'subject_cropped' => $subject_cropped,
				'body' => $body,
				'body_text' =>'',
				'attachments' =>(isset($_POST['message_attachments']) ? $_POST['message_attachments']:''),
				'to_name' => implode(',',$to_names),
				'to_email' => implode(',',$to_emails),
				'from_name' => $mail_account['name'],
				'from_email' => $mail_account['login'],
				'error_msg' =>implode('<br>',$error_msg),
		];
		
		db_perform('app_ext_mail', $mail_data);
		
		redirect_to('ext/mail/accounts');
		
		break;
}