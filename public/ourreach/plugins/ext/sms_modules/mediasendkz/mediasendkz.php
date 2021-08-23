<?php

class mediasendkz
{
	public $title;

	public $site;

	function __construct()
	{
		$this->title = TEXT_MODULE_MEDIASENDKZ_TITLE;
		$this->site = 'https://mediasend.kz';
		$this->api = 'https://mediasend.kz/api/';
		$this->version = '1.0';
	}

	public function configuration()
	{
		$cfg = array();

		$cfg[] = array(
				'key'	=> 'api_key',
				'type' => 'input',
				'default' => '',
				'title'	=> TEXT_EXT_API_KEY,				
				'params' =>array('class'=>'form-control input-large required'),
		);
		
		$cfg[] = array(
				'key'	=> 'appid',
				'type' => 'input',
				'default' => '',
				'title'	=> TEXT_MODULE_MEDIASENDKZ_APPID,
				'description' => TEXT_MODULE_MEDIASENDKZ_APPID_DESCRIPTION,
				'params' =>array('class'=>'form-control input-large required'),
		);
			

		return $cfg;
	}

	function send($module_id, $destination = array(),$text = '')
	{
		global $alerts;

		$cfg = modules::get_configuration($this->configuration(),$module_id);
		$url = "https://cp.mediasend.kz/api/sms/add?apiKey=" . $cfg['api_key'];

		foreach($destination as $phone)
		{
			$phone  = preg_replace('/\D/', '', $phone);
			
			$params=[
					'text' => $text,
					'phones' =>[
							['name' => '', 'surname' => '', 'phone' => $phone],							
					],
					'appid' => $cfg['appid']					
			];
							
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_HEADER, false);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params,'','&'));
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($ch, CURLOPT_TIMEOUT, 10);
			$result = curl_exec($ch);			
			curl_close($ch);
						
			//var_dump($result);
			//exit();
				
			if($result)
			{
				$result = json_decode($result,true);

				if($result['success']==false)
				{
					$alerts->add($this->title . ' ' . TEXT_ERROR . ' ' . $result['error'],'error');
				}
			}
		}
	}

}