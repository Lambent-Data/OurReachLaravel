<div id="calendar_loading" class="loading_data"></div>
<div id="calendar" class="fc-public"></div>

<?php 
//highlighting_weekends
echo calendar::render_highlighting_weekends(CFG_PUBLIC_CALENDAR_HIGHLIGHTING_WEEKENDS);
?>

<?php if(calendar::user_has_public_full_access()): ?>

<script>

	<?php echo holidays::render_js_holidays() ?>
	
	$(document).ready(function() {
		
		$('#calendar').fullCalendar({
			minTime: '<?php echo (strlen(CFG_PUBLIC_CALENDAR_MIN_TIME) ? CFG_PUBLIC_CALENDAR_MIN_TIME:"00:00") ?>',
		  maxTime: '<?php echo (strlen(CFG_PUBLIC_CALENDAR_MAX_TIME) ? CFG_PUBLIC_CALENDAR_MAX_TIME:"24:00") ?>',
		  slotDuration: '<?php echo (strlen(CFG_PUBLIC_CALENDAR_TIME_SLOT_DURATION) ? CFG_PUBLIC_CALENDAR_TIME_SLOT_DURATION : '00:30:00') ?>',
			customButtons: {
        printButton: {
            text: '',
            icon: 'fa fa-print',            
            click: function() {
            	window.print();
            }
        },
        calendarButton: {            
          icon: 'fa fa-calendar',            
          click: function() {
          	
          }
      	}    
    	},
			header: {
				left: 'prev,next today calendarButton',
				center: 'title',
				right: '<?php echo calendar::get_view_modes(['view_modes'=>CFG_PUBLIC_CALENDAR_VIEW_MODES,'default_view'=>CFG_PUBLIC_CALENDAR_DEFAULT_VIEW]) ?>'
			},
			
			views: {
	      year: {
	        buttonText: '<?php echo TEXT_EXT_YEAR ?>',
	        type: 'timeline',
	        duration: { year: 1 },
	        slotDuration: { months: 1 }
	      }
			},

			schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
			
			defaultDate: '<?php echo date("Y-m-d")?>',
      firstDay: '<?php echo CFG_APP_FIRST_DAY_OF_WEEK ?>',
      defaultView: '<?php echo CFG_PUBLIC_CALENDAR_DEFAULT_VIEW ?>',
      timezone: false,
			selectable: true,
			selectHelper: true,
      editable: true,
			eventLimit: true, // allow "more" link when too many events
			select: function(start, end,jsEvent, view) {				
        open_dialog('<?php echo url_for("ext/calendar/public_form")?>'+'&start='+start+'&end='+end+'&view_name='+view.name) 
			},
      eventClick: function(calEvent, jsEvent, view) {
        if(calEvent.url.length>0)
        {
          open_dialog(calEvent.url)
        }   
                     
        return false;
      },
      eventResize: function(event, delta, revertFunc) {
        $.ajax({type: "POST",url: "<?php echo url_for('ext/calendar/public','action=resize')?>",data: {id:event.id,end:event.end.format()}});
      },
      eventDrop: function(event, delta, revertFunc) {
        if(event.end)
        {
          $.ajax({type: "POST",url: "<?php echo url_for('ext/calendar/public','action=drop')?>",data: {id:event.id,start:event.start.format(),end:event.end.format()}});
        }
        else
        {
          $.ajax({type: "POST",url: "<?php echo url_for('ext/calendar/public','action=drop')?>",data: {id:event.id,start:event.start.format()}});
        }

        $('.popover').remove();
      },
      eventMouseover: function(calEvent, jsEvent, view) {        
        if((calEvent.title.length>23 || calEvent.description.length>0) && $('.popover').length==0)
        {          
          $(this).popover({html:true,title:calEvent.title,content:calEvent.description,placement:'top',container:'body'}).popover('show');
        }               
      },
      eventMouseout:function(calEvent, jsEvent, view) {
        $(this).popover('hide');
      },			
			events: {
				url: '<?php echo url_for("ext/calendar/public","action=get_events")?>',
        error: function() {
				  alert('<?php echo TEXT_ERROR_LOADING_DATA ?>')
				}				
			},
      loading: function(bool) {
				$('#calendar_loading').toggle(bool);

				if(!bool)
				{						
					fc_calendar_button($(this).attr('id'))
				}

			},

			//handle holidays
			eventAfterAllRender: function (view) {
				for (var key in holidays)		 
				{														
					if (view.name == 'month') 
					{						
						$("td[data-date=" + key + "]").each(function(){
							$(this).addClass('holiday');
							$('span', this).attr('title',holidays[key])
						});
					} 
					else if (view.name =='listMonth')
					{
						$("tr[data-date=" + key + "]").each(function(){
							$(this).addClass('holiday');
							$('span', this).attr('title',holidays[key])
						});
					}	
					else  
					{
						$("th[data-date=" + key + "]").each(function(){
							$(this).addClass('holiday');
							$('span', this).attr('title',holidays[key])
						});
					} 									
				}
			}
			
      
		});
		
	});  

</script>

<?php else: ?>


<script>

	<?php echo holidays::render_js_holidays() ?>

	$(document).ready(function() {
		
		$('#calendar').fullCalendar({
			minTime: '<?php echo (strlen(CFG_PUBLIC_CALENDAR_MIN_TIME) ? CFG_PUBLIC_CALENDAR_MIN_TIME:"00:00") ?>',
		  maxTime: '<?php echo (strlen(CFG_PUBLIC_CALENDAR_MAX_TIME) ? CFG_PUBLIC_CALENDAR_MAX_TIME:"24:00") ?>',
		  slotDuration: '<?php echo (strlen(CFG_PUBLIC_CALENDAR_TIME_SLOT_DURATION) ? CFG_PUBLIC_CALENDAR_TIME_SLOT_DURATION : '00:30:00') ?>',
			customButtons: {
        printButton: {
            text: '',
            icon: 'fa fa-print',            
            click: function() {
            	window.print();
            }
        },
        calendarButton: {            
          icon: 'fa fa-calendar',            
          click: function() {
          	
          }
      	}    
    	},
			header: {
				left: 'prev,next today calendarButton',
				center: 'title',
				right: '<?php echo calendar::get_view_modes(['view_modes'=>CFG_PUBLIC_CALENDAR_VIEW_MODES,'default_view'=>CFG_PUBLIC_CALENDAR_DEFAULT_VIEW]) ?>'
			},
			
			views: {
	      year: {
	        buttonText: '<?php echo TEXT_EXT_YEAR ?>',
	        type: 'timeline',
	        duration: { year: 1 },
	        slotDuration: { months: 1 }
	      }
			},

			schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
			
			defaultDate: '<?php echo date("Y-m-d")?>',
      firstDay: '<?php echo CFG_APP_FIRST_DAY_OF_WEEK ?>',
      defaultView: '<?php echo CFG_PUBLIC_CALENDAR_DEFAULT_VIEW ?>',
      timezone: false,
			selectable: false,
			selectHelper: false,
      editable: false,
			eventLimit: true, // allow "more" link when too many events
      eventMouseover: function(calEvent, jsEvent, view) {        
        if(calEvent.title.length>23 || calEvent.description.length>0)
          $(this).popover({html:true,title:calEvent.title,content:calEvent.description,placement:'top',container:'body'}).popover('show');        
      },
      eventMouseout:function(calEvent, jsEvent, view) {
        $(this).popover('hide');
      },			
			events: {
				url: '<?php echo url_for("ext/calendar/public","action=get_events")?>',
        error: function() {
				  alert('Error loading events...')
				}				
			},
      loading: function(bool) {
				$('#calendar_loading').toggle(bool);

				if(!bool)
				{	
					fc_calendar_button($(this).attr('id'))
				}
			},

		//handle holidays
			eventAfterAllRender: function (view) {
				for (var key in holidays)		 
				{														
					if (view.name == 'month') 
					{						
						$("td[data-date=" + key + "]").each(function(){
							$(this).addClass('holiday');
							$('span', this).attr('title',holidays[key])
						});
					} 
					else if (view.name =='listMonth')
					{
						$("tr[data-date=" + key + "]").each(function(){
							$(this).addClass('holiday');
							$('span', this).attr('title',holidays[key])
						});
					}	
					else  
					{
						$("th[data-date=" + key + "]").each(function(){
							$(this).addClass('holiday');
							$('span', this).attr('title',holidays[key])
						});
					} 									
				}
			}
      
		});
		
	});  

</script>

<?php endif ?>