<?php
$html = $pivot_table->render_layout() . '

<script>
var pivot_table' . $pivot_table->id . ' = false;
$(function(){
     pivot_table' . $pivot_table->id . ' = new WebDataRocks({
        container: "#pivot_table_' . $pivot_table->id . '",
        toolbar: ' . $pivot_table->has_toolbar() . ',
        height: ' . $pivot_table->get_height() . ',
        global: {    		
    		localization: "' . $pivot_table->get_localization(). '"
    	}
    });

    pivot_table' . $pivot_table->id . '.setReport(' . $pivot_table->getReport() . ')

    pivot_table' . $pivot_table->id . '.on("update", function() {
        $.ajax({
            method: "post",
            url: "' . url_for('ext/pivot_tables/view','action=set_report&id=' . $pivot_table->id) . '",
            data: {settings: JSON.stringify(pivot_table' . $pivot_table->id . '.getReport())}
        })
    });

    pivot_table' . $pivot_table->id . '.on("reportchange", function() {
        $.ajax({
            method: "post",
            url: "' . url_for('ext/pivot_tables/view','action=set_report&id=' . $pivot_table->id) . '",
            data: {settings: JSON.stringify(pivot_table' . $pivot_table->id . '.getReport())}
        })
    })  
        
    ' . $pivot_table->render_chart() . ' 

//fix bug reportchange. This event not working with format cells
    setTimeout(function(){
       $("#wdr-tab-format-cells").click(function(){
          setTimeout(function(){
             $("#wdr-popup-format-cells #wdr-btn-apply").click(function(){
               $.ajax({
                    method: "post",
                    url: "' . url_for('ext/pivot_tables/view','action=set_report&id=' . $pivot_table->id) . '",
                    data: {settings: JSON.stringify(pivot_table' . $pivot_table->id . '.getReport())}
                })
             })        
          },300)
       })
    }, 300);                
})

</script>
';

echo $html;

echo $pivot_table->hide_actions_in_toolbar();

