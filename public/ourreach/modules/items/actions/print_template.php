<?php

if (!export_templates::has_users_access($current_entity_id, $_GET['templates_id']))
{
    redirect_to('dashboard/access_forbidden');
}

$template_info_query = db_query("select * from app_ext_export_templates where id=" . _GET('templates_id'));
if (!$template_info = db_fetch_array($template_info_query))
{
    redirect_to('dashboard/page_not_found');
}

//download docx
if ($template_info['type'] == 'docx' and $app_module_action == 'print')
{
    require_once('includes/libs/PHPWord/vendor/autoload.php');

    $docx = new export_templates_blocks($template_info);

    if (!isset($app_selected_items[$_POST['reports_id']]))
        $app_selected_items[$_POST['reports_id']] = array();

    if (count($app_selected_items) == 0)
    {
        echo TEXT_PLEASE_SELECT_ITEMS;
        exit();
    }

    $selected_items_array = $app_selected_items[$_POST['reports_id']];

    $print_template = export_templates::get_template_extra($selected_items_array, $template_info, 'template_header');

    $selected_items = implode(',', $app_selected_items[$_POST['reports_id']]);

    $filenames = [];

    $listing_sql = "select e.* " . fieldtype_formula::prepare_query_select($current_entity_id, '') . " from app_entity_" . $current_entity_id . " e where e.id in (" . $selected_items . ") order by field(id," . $selected_items . ")";
    $items_query = db_query($listing_sql);
    while ($item = db_fetch_array($items_query))
    {
        $filenames[] = $docx->prepare_template_file($template_info['entities_id'], $item['id'], $item);
    }

    $docx->dowload_archive($filenames, $_POST['filename']);

    exit();
}

switch ($app_module_action)
{
    case 'export_word':
    case 'print':

        if (!isset($app_selected_items[$_POST['reports_id']]))
            $app_selected_items[$_POST['reports_id']] = array();

        if (count($app_selected_items) == 0)
        {
            echo TEXT_PLEASE_SELECT_ITEMS;
            exit();
        }

        $selected_items_array = $app_selected_items[$_POST['reports_id']];

        $print_template = export_templates::get_template_extra($selected_items_array, $template_info, 'template_header');

        $selected_items = implode(',', $app_selected_items[$_POST['reports_id']]);

        //prepare forumulas query
        $listing_sql_query_select = fieldtype_formula::prepare_query_select($current_entity_id, '');

        $listing_sql = "select e.* " . $listing_sql_query_select . " from app_entity_" . $current_entity_id . " e where e.id in (" . $selected_items . ") order by field(id," . $selected_items . ")";
        $items_query = db_query($listing_sql);
        $count_items = db_num_rows($items_query);
        $count = 1;
        
        if($template_info['type']=='label')
        {
            $labl_size = explode('x',$template_info['label_size']);
            
            while ($item = db_fetch_array($items_query))
            {
                $print_template .= '
                    <div style="width: ' . $labl_size[0] . 'mm; height: ' . $labl_size[1] . 'mm; float: left; margin: 5px;">' . 
                        export_templates::get_html($current_entity_id, $item['id'], $_GET['templates_id']) . 
                    '</div>'; 
                
                if ($count_items > 1 and $count_items != $count and $template_info['split_into_pages'] == 1)
                {
                    $print_template .= ($app_module_action == 'export_word' ? '<br style="clear: both; page-break-before: always">' : '<p style="clear: both; page-break-after: always;"></p>');
                }
                
                $count++;
            }
        }
        else
        {                    
            while ($item = db_fetch_array($items_query))
            {
                $print_template .= export_templates::get_html($current_entity_id, $item['id'], $_GET['templates_id']);

                if ($count_items > 1 and $count_items != $count and $template_info['split_into_pages'] == 1)
                {
                    $print_template .= export_templates::get_template_extra($selected_items_array, $template_info, 'template_footer');

                    $print_template .= ($app_module_action == 'export_word' ? '<br style="page-break-before: always">' : '<p style="page-break-after: always;"></p>');

                    $print_template .= export_templates::get_template_extra($selected_items_array, $template_info, 'template_header');
                }

                $count++;
            }

            $print_template .= export_templates::get_template_extra($selected_items_array, $template_info, 'template_footer');
        }



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
      						
      			' . ($template_info['page_orientation'] == 'landscape' ? '<style type="text/css" media="print"> @page { size: landscape; } </style>' : '') . '			
        </head>        
        <body>
         ' . $print_template . '
         <script>
            window.print();
         </script>            
        </body>
      </html>
      ';

        if ($app_module_action == 'export_word')
        {
            //prepare images
            $html = str_replace('src="' . DIR_WS_UPLOADS, 'src="' . url_for_file('') . DIR_WS_UPLOADS, $html);

            $filename = str_replace(' ', '_', trim($template_info['name'])) . '.doc';

            header("Content-Type: application/vnd.ms-word");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("content-disposition: attachment;filename={$filename}");
        }

        echo $html;

        exit();

        break;
}  