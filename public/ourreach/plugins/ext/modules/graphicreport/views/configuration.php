<h3 class="page-title"><?php echo TEXT_EXT_GRAPHIC_REPORT ?></h3>


<?php echo button_tag(TEXT_BUTTON_CREATE,url_for('ext/graphicreport/configuration_form'),true) ?>

<div class="table-scrollable">
<table class="table table-striped table-bordered table-hover">
<thead>
  <tr>
    <th><?php echo TEXT_ACTION ?></th>        
    <th><?php echo TEXT_REPORT_ENTITY ?></th>
    <th width="100%"><?php echo TEXT_NAME ?></th>    
    <th><?php echo TEXT_EXT_HORIZONTAL_AXIS ?></th>    
    <th><?php echo TEXT_EXT_VERTICAL_AXIS ?></th>    
  </tr>
</thead>
<tbody>
<?php
$reports_query = db_query("select * from app_ext_graphicreport order by name");

$entiti_cache = entities::get_name_cache();
$fields_cahce = fields::get_name_cache();



if(db_num_rows($reports_query)==0) echo '<tr><td colspan="9">' . TEXT_NO_RECORDS_FOUND. '</td></tr>'; 

while($reports = db_fetch_array($reports_query)):
?>
<tr>
  <td style="white-space: nowrap;"><?php echo button_icon_delete(url_for('ext/graphicreport/configuration_delete','id=' . $reports['id'])) . ' ' . button_icon_edit(url_for('ext/graphicreport/configuration_form','id=' . $reports['id'])) ?></td>
  <td><?php echo $entiti_cache[$reports['entities_id']] ?></td>
  <td><?php echo link_to($reports['name'],url_for('ext/graphicreport/view','id=' . $reports['id'])) ?></td>  
  <td><?php echo $fields_cahce[$reports['xaxis']] ?></td>
  <td>
<?php  
  foreach(explode(',',$reports['yaxis']) as $id)
  {
    echo $fields_cahce[$id]  . '<br>';
  }  
?>
  </td>
    
</tr>  
<?php endwhile ?>
</tbody>
</table>
</div>