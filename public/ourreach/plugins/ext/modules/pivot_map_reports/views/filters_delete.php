
<?php echo ajax_modal_template_header(TEXT_HEADING_DELETE) ?>

<?php echo form_tag('login', url_for('ext/pivot_map_reports/filters','action=delete&map_reports_id=' . _get::int('map_reports_id'). '&id=' . $_GET['id'] . '&reports_id=' . $_GET['reports_id']. (isset($_GET['parent_reports_id']) ? '&parent_reports_id=' . $_GET['parent_reports_id']:''))) ?>
<?php echo input_hidden_tag('redirect_to',$app_redirect_to) ?>
<div class="modal-body">    
<?php echo TEXT_ARE_YOU_SURE?>
</div> 
<?php echo ajax_modal_template_footer(TEXT_BUTTON_DELETE) ?>

</form>  
    
 
