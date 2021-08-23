<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="<?php echo APP_LANGUAGE_SHORT_CODE ?>" dir="<?php echo APP_LANGUAGE_TEXT_DIRECTION ?>" class="no-js">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title><?php echo $app_title ?></title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport"/>
<meta content="" name="description"/>
<?php echo app_author_text() ?>
<meta name="MobileOptimized" content="320">

<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="template/plugins/font-awesome/css/font-awesome.min.css?v=4.7.0" rel="stylesheet" type="text/css"/>
<link href="template/plugins/line-awesome/css/line-awesome.min.css?v=1.3.0" rel="stylesheet" type="text/css"/>
<link href="template/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="template/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN PAGE LEVEL STYLES -->
<link href="template/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.css" rel="stylesheet"/>
<link href="template/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet" type="text/css"/>
<link href="template/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" href="template/plugins/bootstrap-datepicker/css/datepicker.css"/>
<link rel="stylesheet" type="text/css" href="template/plugins/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.css"/>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN THEME STYLES -->
<link href="template/css/style-conquer.css?v=2" rel="stylesheet" type="text/css"/>
<link href="template/css/style.css?v=<?php echo PROJECT_VERSION ?>" rel="stylesheet" type="text/css"/>
<link href="template/css/style-responsive.css?v=<?php echo PROJECT_VERSION ?>" rel="stylesheet" type="text/css"/>
<link href="template/css/plugins.css?v=<?php echo PROJECT_VERSION ?>" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" href="template/plugins/bootstrap-colorpicker/css/colorpicker.css"/>
<link rel="stylesheet" type="text/css" href="js/simple-color-picker/colorPicker.css"/>
<link href="js/uploadifive/uploadifive.css" rel="stylesheet" media="screen">
<link href="js/chosen/chosen.css" rel="stylesheet" media="screen">
<link rel="stylesheet" type="text/css" href="template/plugins/jquery-nestable/jquery.nestable.css"/>
<link rel="stylesheet" type="text/css" media="screen" href="template/plugins/ckeditor/plugins/codesnippet/lib/highlight/styles/default.css" />
<link rel="stylesheet" type="text/css" href="js/DataTables-1.10.15/media/css/dataTables.bootstrap.css" />
<link rel="stylesheet" type="text/css" href="js/select2/dist/css/select2.min.css" />
<link rel="stylesheet" type="text/css" href="js/multistep-indicator-master/css/style.css" />
<link rel="stylesheet" type="text/css" href="js/JalaliCalendar/jquery.Bootstrap-PersianDateTimePicker.css" />

<!-- LAMBENT DATA -->
<link rel="stylesheet" type="text/css" href="lambent/ld-integration.css" />


<?php require('js/mapbbcode-master/includes.css.php'); ?>

<link href="css/skins/<?php echo $app_skin . '?v=' . PROJECT_VERSION ?>" rel="stylesheet" type="text/css" />

<script src="template/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>   

<script src="js/jquery.ui.touch-punch/jquery.ui.touch-punch.min.js" type="text/javascript"></script>

<script type="text/javascript" src="js/validation/jquery.validate.min.js"></script>
<script type="text/javascript" src="js/validation/additional-methods.min.js"></script>
<?php require('js/validation/validator_messages.php'); ?> 

<!-- Add fancyBox -->
<link rel="stylesheet" href="js/fancybox/source/jquery.fancybox.css?v=2.1.5" type="text/css" media="screen" />
<script type="text/javascript" src="js/fancybox/source/jquery.fancybox.pack.js?v=2.1.5"></script>

<script type="text/javascript" src="js/main.js?v=<?php echo PROJECT_VERSION ?>"></script>

<script type="text/javascript">      
  var CKEDITOR = false;
  var CKEDITOR_holders = new Array();
   
  var app_key_ctrl_pressed = false;
  $(window).keydown(function(evt) {if (evt.which == 17) { app_key_ctrl_pressed = true; }}).keyup(function(evt) {if (evt.which == 17) { app_key_ctrl_pressed = false; }});
  
  function keep_session()
  {
    $.ajax({url: '<?php echo url_for("dashboard/","action=keep_session") ?>'});
  }
  
  $(function(){
     setInterval("keep_session()",600000);                                                                   
  }); 
    
  var app_cfg_first_day_of_week = <?php echo CFG_APP_FIRST_DAY_OF_WEEK ?>;
  var app_language_short_code = '<?php echo APP_LANGUAGE_SHORT_CODE ?>';
  var app_cfg_ckeditor_images = '<?php echo url_for("dashboard/ckeditor_image")?>';
  var app_language_text_direction = '<?php echo APP_LANGUAGE_TEXT_DIRECTION ?>'    
      
</script>

<?php plugins::include_part('layout_head') ?>

<link rel="stylesheet" type="text/css" href="css/default.css?v=<?php echo PROJECT_VERSION ?>"/>
<?php echo app_include_custom_css() ?>

<?php 
  $sidebar_pos_option = $app_users_cfg->get('sidebar-pos-option','');
  
  if(APP_LANGUAGE_TEXT_DIRECTION=='rtl')
  {
    require(component_path('dashboard/direction_rtl'));
  } 
?>
  
<!-- END THEME STYLES -->
<?php echo app_favicon() ?>

</head>
<!-- BEGIN BODY -->
<body class="page-header-fixed <?php echo $app_users_cfg->get('sidebar-option','') . ' ' . $sidebar_pos_option . ' ' . $app_users_cfg->get('page-scale-option','') . ' ' . $app_users_cfg->get('sidebar-status') ?>">

<!-- BEGIN HEADER -->
<?php require('template/header.php'); ?>
<!-- END HEADER -->

<div class="clearfix"></div>

<!-- BEGIN CONTAINER -->
<div class="page-container">

<!-- BEGIN SIDEBAR -->
<?php require('template/sidebar.php'); ?>
<!-- END SIDEBAR -->

<!-- BEGIN CONTENT -->
<div class="page-content-wrapper">
	<div class="page-content-wrapper">
		<div class="page-content">
			<div id="ajax-modal" class="modal fade" tabindex="-1" data-replace="true" data-keyboard="false" data-backdrop="static" data-focus-on=".autofocus"></div>			

				<!-- BEGIN LAMBENT DATA -->
				<div class="ld-iframe-wrapper">

					<iframe id="ld-iframe" src="<?php echo $new_backend_url ?>" title="View Milestone" class="ld-iframe"></iframe>
				</div>
				<!-- END LAMBENT DATA -->			

				<script>

					const iframe = document.getElementById('ld-iframe');
					
					/* Determine whether we are on a phone. For now, just going by screen size, later will do something better. */
					function inMobileView() {
						return $(window).width() <= 640;
					}
					let mobileView = undefined;

					/* Called to transition between mobile and desktob view */
					function setMobileOrDesktopView(){
						if (mobileView === inMobileView()) return; // Nothing has changed. Do nothing.

						// Else, set mobileView correctly.
						mobileView = inMobileView();

						iframe.contentWindow.scrollTo(0,0);
						window.scrollTo(0,0);
					}
					let messageBar;
					let pageContentDiv;

					$(window).resize(function () {
						if (messageBar && pageContentDiv){
							//console.log(messageBar.getBoundingClientRect().bottom);
							iframe.height = messageBar.getBoundingClientRect().bottom - pageContentDiv.getBoundingClientRect().top;
						}
						setMobileOrDesktopView();
					});

					$(document).ready(function () {
						messageBar = $('.app-chat-button').get(0);
						pageContentDiv = $('.page-content').get(0);
						if (messageBar && pageContentDiv){
							iframe.height = messageBar.getBoundingClientRect().bottom - pageContentDiv.getBoundingClientRect().top;
						}
						setMobileOrDesktopView();
					});

					setInterval(() => {
					  if (messageBar && pageContentDiv){
							iframe.height = messageBar.getBoundingClientRect().bottom - pageContentDiv.getBoundingClientRect().top;
						}
					}, 150);

					/* Listen for messages from the iframe */
					window.addEventListener("message", (event) => {
						if(!event.data) return;
						if(event.data.url){
							let dest = event.data.url;
							window.location.href = dest;
							return;
						}
						if(event.data.request){
							console.log("EVT", event);
							var xhttp = new XMLHttpRequest();
					    xhttp.onreadystatechange = function() {
					      if (this.readyState == 4 && this.status == 200) {
					      	event.ports[0].postMessage({response: this.response});
					       }
					     };

					    xhttp.open(event.data.request.type, event.data.request.url, true);
					    xhttp.setRequestHeader("Content-Type", "application/json");
					    xhttp.send(JSON.stringify(event.data.request.data));
						}
					}, false);

				</script>

<?php 
//check install dir
  if(is_dir('install'))
  {
    $alerts->add(TEXT_REMOVE_INSTALL_FOLDER,'warning');
  }

//output alerts if they exists.
  echo $alerts->output(); 
  
//output users alers
	echo users_alerts::output();

	//include module views    
	if(is_file($path = $app_plugin_path . 'modules/' . $app_module . '/views/' . $app_action . '.php'))
	{
		//require($path);
	}   
?>	

			<!-- END PAGE CONTENT-->
		</div>
	</div>
</div>
<!-- END CONTENT -->
</div>
<!-- END CONTAINER -->

<!-- BEGIN FOOTER -->
<?php require('template/footer.php'); ?>
<!-- END FOOTER -->

<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src="template/plugins/respond.min.js"></script>
<script src="template/plugins/excanvas.min.js"></script> 
<![endif]-->
<script src="template/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui-1.10.3.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="template/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>
<script src="template/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="template/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.js?v=2.2.1" type="text/javascript"></script>
<script src="template/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="template/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="template/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="template/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script type="text/javascript" src="template/plugins/ckeditor/ckeditor.js?v=4.5.7.01"></script>
<script type="text/javascript" src="template/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
<script type="text/javascript" src="template/plugins/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="template/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript"></script>
<script type="text/javascript" src="template/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript"></script>
<script type="text/javascript" src="template/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js"></script>
<script type="text/javascript" src="template/plugins/jquery-nestable/jquery.nestable.js"></script>
<script type="text/javascript" src="js/simple-color-picker/jquery.colorPicker.js"></script>
<script type="text/javascript" src="js/uploadifive/jquery.uploadifive.js?v=1.2.2"></script>
<script type="text/javascript" src="js/chosen/chosen.jquery.js"></script>
<script type="text/javascript" src="js/chosen/jquery-chosen-sortable.min.js"></script>
<script type="text/javascript" src="js/chosen/chosen-order/chosen.order.jquery.min.js"></script>
<script type="text/javascript" src="js/maskedinput/jquery.maskedinput.js"></script>
<script type="text/javascript" src="js/totop/jquery.ui.totop.js" ></script>
<script type="text/javascript" src="js/jquery-number-master/jquery.number.min.js" ></script>
<script type="text/javascript" src="template/plugins/ckeditor/plugins/codesnippet/lib/highlight/highlight.pack.js"></script>
<script type="text/javascript" src="js/jquery-resizable/jquery-resizable.js" ></script>
<script type="text/javascript" src="js/select2/dist/js/select2.full.js" ></script>
<script type="text/javascript" src="js/jquery.taboverride-master/build/taboverride.min.js" ></script>
<script type="text/javascript" src="js/jquery.taboverride-master/build/jquery.taboverride.min.js" ></script>
<script type="text/javascript" src="js/JalaliCalendar/jalaali.js"></script>
<script type="text/javascript" src="js/JalaliCalendar/jquery.Bootstrap-PersianDateTimePicker.js"></script>
<script type="text/javascript" src="js/inputmask/5.0.5/jquery.inputmask.min.js" ></script>
<script type="text/javascript" src="js/scannerdetection/1.1.2/jquery.scannerdetection.js" ></script>

<!-- END PAGE LEVEL PLUGINS -->

<?php if($app_module_path=='items/info') require(component_path('dashboard/data_tables')); ?>

<?php require('js/mapbbcode-master/includes.js.php'); ?>

<?php 
	if(is_ext_installed())
	{
		echo smart_input::render_js_includes();	
	}
?>

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="template/scripts/app.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->

<?php plugins::include_part('layout_bottom') ?>

<script>
jQuery(document).ready(function() {     
    
	$.fn.datepicker.dates['en'] = {
	    days: [<?php echo TEXT_DATEPICKER_DAYS ?>],
	    daysShort: [<?php echo TEXT_DATEPICKER_DAYSSHORT ?>],
	    daysMin: [<?php echo TEXT_DATEPICKER_DAYSMIN ?>],
	    months: [<?php echo TEXT_DATEPICKER_MONTHS ?>],
	    monthsShort: [<?php echo TEXT_DATEPICKER_MONTHSSHORT ?>],
	    today: "<?php echo TEXT_DATEPICKER_TODAY ?>",
		  clear: "<?php echo TEXT_CLEAR ?>",    
	};  
	
	$.fn.datetimepicker.dates['en'] = {
	    days: [<?php echo TEXT_DATEPICKER_DAYS ?>],
	    daysShort: [<?php echo TEXT_DATEPICKER_DAYSSHORT ?>],
	    daysMin: [<?php echo TEXT_DATEPICKER_DAYSMIN ?>],
	    months: [<?php echo TEXT_DATEPICKER_MONTHS ?>],
	    monthsShort: [<?php echo TEXT_DATEPICKER_MONTHSSHORT ?>],
	    meridiem: ["am", "pm"],
			suffix: ["st", "nd", "rd", "th"],
	    today: "<?php echo TEXT_DATEPICKER_TODAY ?>",
	    clear: "<?php echo TEXT_CLEAR ?>",    
	};
	
	App.init();
	
	rukovoditel_app_init();

  <?php if(strlen($app_current_version)==0 and CFG_DISABLE_CHECK_FOR_UPDATES==0) echo "$.ajax({url: '" . url_for("dashboard/check_project_version") ."'});" ?>
});
</script>

<?php echo i18n_js() ?>

<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>
      