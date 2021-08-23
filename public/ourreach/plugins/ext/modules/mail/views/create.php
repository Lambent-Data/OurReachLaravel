<?php echo ajax_modal_template_header(TEXT_EXT_NEW_EMAIL) ?>

<?php echo form_tag('mail_form', url_for('ext/mail/create','action=send'  ),array('class'=>'form-horizontal')) ?>
<div class="modal-body">
  <div class="form-body ajax-modal-width-790">
  
  	<div class="form-group">
		 	<label class="col-md-2 control-label" for="is_active"><?php echo TEXT_EXT_EMAIL_FROM ?></label>
	    <div class="col-md-10">	
	  	  <?php echo select_tag('accounts_id',mail_accounts::get_choices_by_user('full',true) ,($app_mail_filters['accounts_id']>0 ? $app_mail_filters['accounts_id'] : mail_accounts::get_default()),array('class'=>'form-control required')) ?>
	    </div>			
	  </div>
	  	  	  
	  <div class="form-group">
		 	<label class="col-md-2 control-label" for="mail_to"><?php echo TEXT_EXT_EMAIL_TO ?></label>
	    <div class="col-md-10">	
	  	  <?php echo select_tag('mail_to[]',[],'',['class'=>'form-control required','multiple'=>'multiple']) ?>
	    </div>			
	  </div>
	  
	  <div class="form-group">
		 	<label class="col-md-2 control-label" for="subject"><?php echo TEXT_EXT_EMAIL_SUBJECT ?></label>
	    <div class="col-md-10">	
	  	  <?php echo input_tag('subject','',['class'=>'form-control required'])?>
	    </div>			
	  </div>
	  
<?php 
$body = '';
if(strlen($signature = mail_accounts_users::get_signature()))
{
	$body .= '<br><br>' . $signature;
}	
?>	  
	   	  	  	 
	  <div class="form-group">	
	  	<label class="col-md-2 control-label" for="is_active"><?php echo TEXT_EXT_MAIL_BODY ?></label>	 	
	    <div class="col-md-10">	
	  	  <?php echo textarea_tag('body',$body,array('class'=>'editor required')) ?>
	    </div>			
	  </div>
	  
	  <div class="form-group">	
	  	<label class="col-md-2 control-label" for="is_active"><?php echo TEXT_ATTACHMENTS ?></label>	 	
	    <div class="col-md-10">	
	  	  <?php require(component_path('ext/mail/attachments_button')); ?>
	    </div>			
	  </div>
	  	    
  </div>
</div> 
 
<?php echo ajax_modal_template_footer(TEXT_BUTTON_SEND) ?>

</form> 

<?php require(component_path('ext/mail/mail_to.js')); ?>