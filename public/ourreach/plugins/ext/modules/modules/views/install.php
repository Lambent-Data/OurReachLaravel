
<?php echo ajax_modal_template_header(TEXT_EXT_AVAILABLE_MODULES) ?>

<?php echo form_tag('install_form', url_for('ext/modules/modules','action=install&type=' . $_GET['type']),array('class'=>'form-horizontal')) ?>
<div class="modal-body">
  <div class="form-body">
     
<?php 
	$modules = new modules($_GET['type']);
	$available_modules = $modules->get_available_modules();
	
	if(count($available_modules))
	{
		$html = '<table class="table table-hover">';
		$count = 0;
		foreach($available_modules as $modules)
		{
			$params  = ($count==0 ? array('checked'=>'checked'):array());
			
			$params['id'] = 'module_' . $modules;
			
			$module = new $modules;
						
			$html .= '
	    		<tr >
	    			<td><label>' . input_radiobox_tag('module',$modules,$params)  . ' ' . $module->title . '</label></td>
	    			<td><a href="'  . $module->site . '" target="_blank">' . str_replace(array('http://','https://','www.'),'',$module->site) . '</a></td>
	    		</tr>	
	    			';
			
						
			$count++;
		}
		
		$html .= '</table>';
	}
	else
	{
		$html = TEXT_NO_RECORDS_FOUND;
	}
	
	echo $html;
?>    
     
   </div>
</div> 
 
<?php echo ajax_modal_template_footer((count($available_modules) ? TEXT_EXT_BUTTON_INSTALL_MODULE : 'hide-save-button')) ?>

</form> 

<script>
  $(function() { 
    $('#install_form').validate();                                                                                                   
  });  
</script>   