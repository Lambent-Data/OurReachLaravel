<?php
require(component_path('ext/map_reports/view_filters'));

$cfg = new fields_types_cfg($field_info['configuration']);

$map_reports = new map_reports($reports, $fiters_reports_id, $field_info);

if(strlen($reports['latlng']))
{
	$latlng = explode(',',$reports['latlng']);
	$center_map_js = '
				var myLatlng = new google.maps.LatLng(' . trim($latlng[0]) . ',' . trim($latlng[1]) . ');
				map.setCenter(myLatlng);
			';
}
else
{
	$center_map_js = 'map.setCenter(myLatlng);';
}	


$html = '';

$html .= '<script src="https://maps.googleapis.com/maps/api/js?key=' . $cfg->get('api_key') . '"></script>';

$html .= '
<script>
 
$(function(){

	var mapOptions = {
		zoom: ' . $reports['zoom'] . ',
	}

	var map = new google.maps.Map(document.getElementById("goolge_map_container"), mapOptions);
				
	' . $map_reports->render_google_js() . '
			
	//Got result, center the map and put it out there
	' . $center_map_js . '	
			
	set_goolge_map_height();
			
	$( window ).resize(function(){
		set_goolge_map_height();
	})		

})
			
function set_goolge_map_height()
{
	$("#goolge_map_container").height($( window ).height()-$(".portlet-filters-preview").height()-$(".header").height()-150);
}			
					
</script>
				
<div id="goolge_map_container" style="width:100%;  height: 600px;"></div>
';	

echo (count($map_reports->markers) ? $html : '<div class="alert alert-warning">' . TEXT_NO_RECORDS_FOUND . '</div>');

