<?php

switch($app_module_action)
{
    case 'save':      
                
        $font_family = strtolower(db_prepare_input($_POST['name']));
        
        $fontDir = CFG_PATH_TO_DOMPDF_FONTS;
        
        $fonts_list = require  CFG_PATH_TO_DOMPDF_FONTS . '/dompdf_font_family_cache.php';
        
        
        if(isset($fonts_list[$font_family]))
        {
            //remove font files
            foreach($fonts_list[$font_family] as $font_type)
            {
                if(is_file($font_type . '.ufm')) unlink($font_type . '.ufm');
                if(is_file($font_type . '.ufm.php')) unlink($font_type . '.ufm.php');
                if(is_file($font_type . '.ttf')) unlink($font_type . '.ttf');
            }
            
            //reset cache
            $cache = file_get_contents(CFG_PATH_TO_DOMPDF_FONTS . '/dompdf_font_family_cache.php');
            
            if(preg_match_all("/'arial' => array\([^)]+\),/", $cache, $matches))
            {
                $cache = str_replace($matches[0][0],'',$cache);
                print_rr($matches);
            }
            
            file_put_contents(CFG_PATH_TO_DOMPDF_FONTS . '/dompdf_font_family_cache.php', $cache);            
        }
                
        
        //upload 
        if(strlen($font_normal_filename = $_FILES['file_normal']['name'])>0 and substr($_FILES['file_normal']['name'],-4)=='.ttf')
        {                        
            move_uploaded_file($_FILES['file_normal']['tmp_name'], DIR_FS_TMP  . $font_normal_filename);                    
        } 
        
        if(strlen($font_italic_filename = $_FILES['file_italic']['name'])>0 and substr($_FILES['file_italic']['name'],-4)=='.ttf')
        {                        
            move_uploaded_file($_FILES['file_italic']['tmp_name'], DIR_FS_TMP  . $font_italic_filename);                    
        }
                
        if(strlen($font_bold_filename = $_FILES['file_bold']['name'])>0 and substr($_FILES['file_bold']['name'],-4)=='.ttf')
        {                        
            move_uploaded_file($_FILES['file_bold']['tmp_name'], DIR_FS_TMP  . $font_bold_filename);                    
        }
        
        if(strlen($font_bold_italic_filename = $_FILES['file_bold_italic']['name'])>0 and substr($_FILES['file_bold_italic']['name'],-4)=='.ttf')
        {                        
            move_uploaded_file($_FILES['file_bold_italic']['tmp_name'], DIR_FS_TMP  . $font_bold_italic_filename);                    
        }
           
        
     
      
      $html = '
      <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>            
            <style>               
             
            @font-face {
                font-family: \'' . $font_family . '\';
                src: url(tmp/' . $font_normal_filename . ') ;
                font-style: normal;
                font-weight: normal;
            }
           ' . (strlen($font_bold_filename) ? '
           @font-face {
                font-family: \'' . $font_family . '\';
                src: url(tmp/' . $font_bold_filename . ');                                
                font-weight: bold;
            }':'') . '
            
            ' . (strlen($font_italic_filename) ? '
            @font-face {
                font-family: \'' . $font_family . '\';
                src: url(tmp/' . $font_italic_filename . ');                
                font-style: italic;
            }':'') . '
             
            ' . (strlen($font_bold_italic_filename) ? '
            @font-face {
                font-family: \'' . $font_family . '\';
                src: url(tmp/' . $font_bold_italic_filename . ');                
                font-weight: bold;
                font-style: italic;
            }
            }':'') . '
                                               
              body { 
                font-family: ' . $font_family . ', sans-serif; 
               }                                            
            </style>
        </head>        
        <body>
            <center>
                <h1>' . $font_family . '</h1>
                <h2>' . CFG_APP_NAME . '</h2> 
                <span>Normal</span><br><br>    
                <b>Bold</b><br><br>    
                <i>Italic</i><br><br>    
                <b><i>Bold Italic</i></b>
            </center>
        </body>
        </html>
        ';
      
        //echo $html;
        //exit();

        require_once(CFG_PATH_TO_DOMPDF);    
	                              
        header('Content-Type: application/pdf');
        
        $dompdf = new Dompdf\Dompdf();      
        $dompdf->load_html($html);
        $dompdf->render();
        
        echo $dompdf->output();

        //$dompdf->stream($font_filename . '.pdf');
        
        if(is_file(DIR_FS_TMP . $font_normal_filename)) unlink(DIR_FS_TMP  . $font_normal_filename);
        if(is_file(DIR_FS_TMP . $font_bold_filename)) unlink(DIR_FS_TMP  . $font_bold_filename);
        if(is_file(DIR_FS_TMP . $font_italic_filename)) unlink(DIR_FS_TMP  . $font_italic_filename);
        if(is_file(DIR_FS_TMP . $font_bold_italic_filename)) unlink(DIR_FS_TMP  . $font_bold_italic_filename);        
        
        exit();
        break;
}