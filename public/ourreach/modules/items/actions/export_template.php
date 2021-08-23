<?php

if(!export_templates::has_users_access($current_entity_id,_get::int('templates_id')))
{
  redirect_to('dashboard/access_forbidden');
}

$template_info_query = db_query("select * from app_ext_export_templates where id=" . _GET('templates_id'));
if(!$template_info = db_fetch_array($template_info_query))
{
    redirect_to('dashboard/page_not_found');
}

//download docx
if($template_info['type']=='docx' and in_array($app_module_action,['export','export_pdf','print']))
{
    require_once(CFG_PATH_TO_DOMPDF);    
    
    require_once('includes/libs/PHPWord/vendor/autoload.php');
    
    $docx = new export_templates_blocks($template_info);
    $filename = $docx->prepare_template_file($current_entity_id, $current_item_id);
    
    switch($app_module_action)
    {
        case 'print':
            $docx->print_pdf($filename);
            break;
        case 'export_pdf':            
            $docx->download_pdf($filename);
            break;
        case 'export':
            $docx->download($filename);
            break;
    }
        
    exit();
}



//hande current dates
$template_info['template_header'] = str_replace('{#current_date}',format_date(time()),$template_info['template_header']);
$template_info['template_header'] = str_replace('{#current_date_time}',format_date_time(time()),$template_info['template_header']);
$template_info['template_footer'] = str_replace('{#current_date}',format_date(time()),$template_info['template_footer']);
$template_info['template_footer'] = str_replace('{#current_date_time}',format_date_time(time()),$template_info['template_footer']);

switch($app_module_action)
{
  case 'print':
  
			$export_template = $template_info['template_header'] . export_templates::get_html($current_entity_id, $current_item_id,$_GET['templates_id']) . $template_info['template_footer'];
      
      $html = '
      <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            
            <style>               
              body { 
                  color: #000;
                  font-family: \'Open Sans\', sans-serif;
                  padding: 0px !important;
                  margin: 0px !important;                                   
               }
               
               body, table, td {
                font-size: 12px;
                font-style: normal;
               }
               
               table{
                 border-collapse: collapse;
                 border-spacing: 0px;                
               }
      		
      				' . $template_info['template_css'] . '	
               
            </style>
      						
						' . ($template_info['page_orientation']=='landscape' ? '<style type="text/css" media="print"> @page { size: landscape; } </style>':''). '      						
        </head>        
        <body>
         ' . $export_template . '
         <script>
            window.print();
         </script>            
        </body>
      </html>
      ';
                  
                             
      echo $html;
      
      exit();
        
    break;      
  case 'export':

      $export_template = $template_info['template_header'] . export_templates::get_html($current_entity_id, $current_item_id,$_GET['templates_id']) . $template_info['template_footer'];
      
      $html = '
      <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            
            <style>               
              body { 
                font-family:   DejaVu Sans, sans-serif;                 
               }
               
              body, table, td {
                font-size: 12px;
                font-style: normal;
              }
              
              table{
                border-collapse: collapse;
                border-spacing: 0px;                
              }
                                          
              c{
                font-family: STXihei;
                font-style: normal;
                font-weight: 400;
              }
      		
      				' . $template_info['template_css'] . '
            </style>
        </head>        
        <body>
         ' . $export_template . '            
        </body>
      </html>
      ';
                  
      //Handle Chinese & Japanese symbols
      $html = preg_replace('/[\x{4E00}-\x{9FBF}\x{3040}-\x{309F}\x{30A0}-\x{30FF}]/u', '<c>${0}</c>',$html);
      $html = str_replace('。','.',$html);
      
      //Handle Korean symbols 
      $html = preg_replace('/[\x{3130}-\x{318F}\x{AC00}-\x{D7AF}]/u', '<c>${0}</c>',$html);
      
                        
      //echo $html;
      //exit();          
      
      $filename = str_replace(' ','_',trim($_POST['filename']));
                              
      require_once(CFG_PATH_TO_DOMPDF);    
                                          
      $dompdf = new Dompdf\Dompdf(); 
      
      if($template_info['page_orientation']=='landscape')
      {
      	$dompdf->set_paper('letter', 'landscape');
      }
      
      $dompdf->load_html($html);
      $dompdf->render();
              
      //$dompdf->stream($filename);
      
          header('Content-Description: File Transfer');
          header('Content-Type: application/octet-stream');
          header('Content-Disposition: attachment; filename='.$filename . '.pdf');
          header('Content-Transfer-Encoding: binary');
          header('Expires: 0');
          header('Cache-Control: must-revalidate');
          header('Pragma: public');          
          
          flush();
          
          echo $dompdf->output();
        
      exit();
    break;
    
    
  case 'export_word':
    
    	$export_template = $template_info['template_header'] . export_templates::get_html($current_entity_id, $current_item_id,$_GET['templates_id']) . $template_info['template_footer'];
    
    	$html = '<html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    
            <style>
              body {
                  color: #000;
                  font-family: \'Open Sans\', sans-serif;
                  padding: 0px !important;
                  margin: 0px !important;
               }
        
               body, table, td {
                font-size: 12px;
                font-style: normal;
               }
        
               table{
                 border-collapse: collapse;
                 border-spacing: 0px;
               }
    			
    					' . $template_info['template_css'] . '
    							
    					' . ($template_info['page_orientation']=='landscape' ? '
    							@page section{ size:841.7pt 595.45pt;mso-page-orientation:landscape;margin:1.25in 1.0in 1.25in 1.0in;mso-header-margin:.5in;mso-footer-margin:.5in;mso-paper-source:0; }
    							div.section {page:section;}
    							':''). '
        
            </style>
        </head>
        <body>    							
         <div class="section">' . $export_template . '</div>         
        </body>
      </html>
      ';
    	
    	//prepare images
    	$html = str_replace('src="' . DIR_WS_UPLOADS, 'src="' . url_for_file('') . DIR_WS_UPLOADS, $html);
        	
    	$filename = str_replace(' ','_',trim($_POST['filename'])) . '.doc';
    	
    	header("Content-Type: application/vnd.ms-word");
    	header("Expires: 0");
    	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    	header("content-disposition: attachment;filename={$filename}");
    	
    	echo $html;
    	    
    	exit();
    
    	break;    
}  