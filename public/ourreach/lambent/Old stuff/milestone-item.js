function animated_list_action_1003()
{

  $(".todo-list-item-1003").change(function(){
    list_id = $(this).val();
    
    var checked_text = $(".todo_list_1003_"+list_id).html();
                                            
    if($(this).prop("checked")){
      reward_element($(this), "confetti2", function(){});
      reward_element($(".form-group-1003"), "checkmark", function(){});
    }
  });
}
    
$(function(){
  //console.log("Custom Listeners Added.");
  animated_list_action_1003();
})    
