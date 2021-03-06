<script>
  function load_items_listing(listing_container,page)
  {
    //parse listing id
    listing_data = listing_container.replace('entity_items_listing','').split('_');
    
    //set default redirect
    redirect_to = 'report_'+listing_data[0];
    
    //set default path
    path = listing_data[1];
        
    //replace default path by current path    
    if($('#entity_items_listing_path').length)
    {
      path = $('#entity_items_listing_path').val()
      redirect_to = '';
    }

    //replace default path by subentity path in info page       
    if($('#subentity'+parseInt(path)+'_items_listing_path').length)
    {
      path = $('#subentity'+path+'_items_listing_path').val()
      redirect_to = 'parent_item_info_page';      
    }

  	//force custom redirect       
    if($('#'+listing_container+'_redirect_to').length)
    {      
      redirect_to = $('#'+listing_container+'_redirect_to').val();      
    }
    
    //set redirect to dashboard if it's dashboard page    
    if($('#dashboard-reports-container').length)
    {      
      redirect_to = 'dashboard';
    }
    
    if($('#dashboard-reports-group-container').length)
    {
        redirect_to = 'reports_groups'+$('#dashboard-reports-group-container').attr('data_id');
    }
                    
    $('#'+listing_container).append('<div class="data_listing_processing"></div>');
    
    $('#'+listing_container).css("opacity", 0.5);
    
    //prepare search fields id
    var use_search_fields = [];
    $.each($("."+listing_container+"_use_search_fields:checked"), function(){            
        use_search_fields.push($(this).val());
    });
    
    $('#'+listing_container).load('<?php echo url_for("items/listing")?>',
      {
        redirect_to: redirect_to, 
        path:path,
        reports_entities_id:listing_data[1],
        reports_id:listing_data[0],
        listing_container:listing_container,
        page:page,
        search_keywords:$('#'+listing_container+'_search_keywords').val(),
        use_search_fields: use_search_fields.join(','), 
        search_in_comments: $('#'+listing_container+'_search_in_comments').prop('checked'),
        search_in_all: $('#'+listing_container+'_search_in_all').prop('checked'),
        search_type_and: $('#'+listing_container+'_search_type_and').prop('checked'),
        search_type_match: $('#'+listing_container+'_search_type_match').prop('checked'),
        search_reset:$('#'+listing_container+'_search_reset').val(),
        listing_order_fields:$('#'+listing_container+'_order_fields').val(),
        listing_order_fields_changed:$('#'+listing_container+'_order_fields').attr('is_changed'),
        has_with_selected:$('#'+listing_container+'_has_with_selected').val(),
        force_display_id:$('#'+listing_container+'_force_display_id').val(),
        force_popoup_fields:$('#'+listing_container+'_force_popoup_fields').val(),
        force_filter_by:$('#'+listing_container+'_force_filter_by').val(),
      },
      function(response, status, xhr) {
        if (status == "error") {                                 
           $(this).html('<div class="alert alert-error"><b>Error:</b> ' + xhr.status + ' ' + xhr.statusText+'<div>'+response +'</div></div>')                    
        }
        
        $('#'+listing_container).css("opacity", 1); 
        
        appHandleUniformInListing()
        
        //prevent double click on button
          $('.prevent-double-click').click(function(){
          	$(this).attr('disabled','disabled')
          })  
        
        handle_itmes_select(listing_container) 
        
        app_handle_listing_horisontal_scroll($(this))                                                                            

        app_handle_listing_fixed_table_header($(this),'<?php echo $app_module_path ?>')

        <?php
        	if(isset($reports_info))
        	{
        		echo '
  						app_handle_listing_resizer($(this),"' . url_for('reports/reports','action=set_listing_col_width&reports_id=' . $reports_info['id']) . '");
        
        			app_handle_listing_slimscroll($(this),"' . $app_module_path . '");
  					';
        	}	
        ?>                
      }
    );  



                 
  }   
  
  function handle_itmes_select(listing_container)
  {  
    $('#'+listing_container+' .items_checkbox').click(function(){   
    
      listing_data = listing_container.replace('entity_items_listing','').split('_');

      //set default path
      path = listing_data[1];
      
      if($('#entity_items_listing_path').length){
        listing_data[1] = $('#entity_items_listing_path').val()
      }
               
      $.ajax({type: "POST",url: '<?php echo url_for("items/select_items","action=select")?>',data: {id:$(this).val(),checked: $(this).attr('checked'),reports_id: listing_data[0],path:listing_data[1]}});
    })
    
    //force select all itesm if listing type is not table
    $('.' + listing_container +'_select_all_items_force').click(function(){
			data_conteiner = $(this).attr('data-container-id');			
			$('#'+data_conteiner+' .select_all_items').trigger( "click" );
			$(this).before('<div class="ajax-loading-small"></div>');
    })
        
    $('#'+listing_container+' .select_all_items').click(function(){

      listing_data = listing_container.replace('entity_items_listing','').split('_');

      //set default path
      path = listing_data[1];
            
      if($('#entity_items_listing_path').length){
      	path = $('#entity_items_listing_path').val()
      }
            
      //replace default path by subentity path in info page       
      if($('#subentity'+parseInt(path)+'_items_listing_path').length)
      {
        path = $('#subentity'+path+'_items_listing_path').val()                
      }
      
    //prepare search fields id
      var use_search_fields = [];
      $.each($("."+listing_container+"_use_search_fields:checked"), function(){            
          use_search_fields.push($(this).val());
      });


      //add loading      
      $(this).before('<div class="ajax-loading-small"></div>');

      var obj = $(this);      
            
      $.ajax({type: "POST",
        			url: '<?php echo url_for("items/select_items","action=select_all")?>',
        			data: {
          			id:$(this).val(),
          			checked: $(this).attr('checked'),
          			reports_id: $(this).val(),
          			path:path,
          			search_keywords:$('#'+listing_container+'_search_keywords').val(),
          			use_search_fields: use_search_fields.join(','), 
                search_in_comments: $('#'+listing_container+'_search_in_comments').prop('checked'),
                search_in_all: $('#'+listing_container+'_search_in_all').prop('checked'),
                search_type_and: $('#'+listing_container+'_search_type_and').prop('checked'),
                search_type_match: $('#'+listing_container+'_search_type_match').prop('checked'), 
          			listing_order_fields:$('#'+listing_container+'_order_fields').val(),
          			force_display_id:$('#'+listing_container+'_force_display_id').val(),
          			force_filter_by:$('#'+listing_container+'_force_filter_by').val(),
          			}}).done(function(){

          					$('.ajax-loading-small').remove()
          				
	          				if(obj.attr('checked'))
	          	      {	          	        
	          	        $('#'+listing_container+' .items_checkbox').each(function(){            
	          	          $(this).attr('checked',true)
	          	          $('#'+listing_container+' #uniform-items_'+$(this).val()+' span').addClass('checked')          
	          	        })
	          	      }
	          	      else
	          	      {
	          	        $('#'+listing_container+' .items_checkbox').each(function(){
	          	          $(this).attr('checked',false)
	          	          $('#'+listing_container+' #uniform-items_'+$(this).val()+' span').removeClass('checked')
	          	        })
	          	      }           				

            			});
      
                 
    })
  }            
</script> 