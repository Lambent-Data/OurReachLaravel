<?php echo ajax_modal_template_header(TEXT_HEADING_DELETE) ?>

<?php echo form_tag('login', url_for('ext/templates_docx/table_list_blocks','action=delete&id=' . $_GET['id'] . '&templates_id=' . $template_info['id'] . '&parent_block_id=' . $parent_block['id'])) ?>
    
<div class="modal-body">    
<?php echo TEXT_ARE_YOU_SURE ?>
</div> 
 
<?php echo ajax_modal_template_footer(TEXT_BUTTON_DELETE) ?>

</form>    