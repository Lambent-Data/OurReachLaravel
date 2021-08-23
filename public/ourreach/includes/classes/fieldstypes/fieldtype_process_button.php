<?php

class fieldtype_process_button
{
    public $options;
    
    function __construct()
    {
        $this->options = array('title' => TEXT_FIELDTYPE_PROCESS_BUTTON_TITLE);
    }
    
    function get_configuration($params = array())
    {
        $cfg = array();
        
        if(is_ext_installed())
        {
            $choices = [];
            $choices[''] = '';
            $processes_query = db_query("select p.*, e.name as entities_name from app_ext_processes p, app_entities e where e.id=p.entities_id and e.id='" . $params['entities_id'] . "' order by p.sort_order, e.name, p.name");
            while($processes = db_fetch_array($processes_query))
            {
                $choices[$processes['id']] = (($processes['name']==$processes['button_title'] or strlen($processes['button_title'])==0) ? $processes['name'] : $processes['name'] . ' (' . $processes['button_title'] . ')');
            }
            
            $cfg[] = array(
                'title'=>TEXT_EXT_PROCESSES,
                'tooltip_icon'=>TEXT_EXT_SELECT_BUTTONS_TO_DISPLAY,
                'name'=>'process_button',
                'type'=>'dropdown',
                'choices'=>$choices,
                'params'=>array('class'=>'form-control chosen-select','multiple'=>'multiple'));
            
                        
            $cfg[] = array(
                'title'=>TEXT_DISPLAY_AS,
                'tooltip_icon' => TEXT_EXT_MULTIPLE_BUTTONS_DISPLAY_TYPE,
                'name'=>'display_as',
                'type'=>'dropdown',
                'choices'=>['inline'=>TEXT_INLINE_LIST,'inrow'=>TEXT_EXT_EXTRA_ROWS,'grouped'=>TEXT_EXT_BUTTON_GROUP],
                'params'=>array('class'=>'form-control input-medium'));
                        
        }
        else
        {
            $cfg[] = array('html'=>app_alert_warning(TEXT_EXTENSION_REQUIRED),'type'=>'html');
        }
        
        
        return $cfg;
    }
    
    function render($field,$obj,$params = array())
    {
        return '';
    }
    
    function process($options)
    {
        return '';
    }
    
    function output($options)
    {
        global $buttons_css_holder, $is_js_inserted;
        
        $cfg = new fields_types_cfg($options['field']['configuration']);
                
        $html = '';
        $buttons_css = '';        
        $buttons_links = [];
        
        if(is_array($cfg->get('process_button')) and count($cfg->get('process_button')))
        {
            $processes = new processes($options['field']['entities_id']);
            $processes->items_id = $options['item']['id'];
            $buttons_list = $processes->get_buttons_list('',implode(',',$cfg->get('process_button')));
                        
            foreach($buttons_list as $buttons)
            {
                //check buttons filters
                if(!$processes->check_buttons_filters($buttons)) continue;
                
                $is_dialog = ((strlen($buttons['confirmation_text']) or $buttons['allow_comments']==1 or $buttons['preview_prcess_actions']==1 or $processes->has_enter_manually_fields($buttons['id'])) ? true:false);                 
                $params = (!$is_dialog ? '&action=run':'') . ((isset($options['reports_id']) and isset($_POST['page'])) ? '&gotopage[' . $options['reports_id'] . ']=' . $_POST['page'] :'');
                $css = (!$is_dialog ? ' prevent-double-click':'');
                
                $rdirect_to = ((isset($options['redirect_to']) and strlen($options['redirect_to'])) ? $options['redirect_to']:'items');
                
                if(!isset($options['reports_id'])) $rdirect_to = 'items_info';
                
                $path = $options['path'];
                
                if(substr($path,-strlen('-' . $options['item']['id']))!='-' . $options['item']['id']) $path .= '-' . $options['item']['id'];
                
                if($rdirect_to=='parent_item_info_page')
                {
                    $path_info = items::parse_path($path);
                    $rdirect_to = 'item_info_page' .$path_info['parent_entity_id'] . '-' . $path_info['parent_entity_item_id'];
                }
                                             
                //buttons list
                $buttons_links[] = button_tag($buttons['button_title'],url_for('items/processes','id=' . $buttons['id'] .  '&path=' . $path . '&redirect_to=' . $rdirect_to . $params),$is_dialog,array('class'=>'btn btn-primary btn-sm btn-process-' . $buttons['id'] . $css),$buttons['button_icon']);
                
                //button csss
                if(!isset($buttons_css_holder[$buttons['id']]))
                {
                    $buttons_css_holder[$buttons['id']] = $processes->prepare_button_css($buttons);
                    $buttons_css .= $buttons_css_holder[$buttons['id']];
                }
            }
            
            switch($cfg->get('display_as'))
            {
                case 'inline': $html = implode(' ',$buttons_links);
                    break;
                case 'inrow': $html = implode('<br>',$buttons_links);
                    break; 
                case 'grouped': $html = '<div class="btn-group btn-group-sm" style="display: inline-flex">' . implode('',$buttons_links) . '</div>';
                    break;
            }
                                                    
            $html .= $buttons_css;            
        }
        
        return $html;
    }
}