// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


function change_to_menu_stockgroups(){
  $('div.stocktype_container').hide();
  $('div.stockgroup_container').fadeIn(150)
}

function change_to_menu_stocktypes( group ){
  $('div.stockgroup_container').fadeOut(80)
  $('div.stocktype_container#' + group).fadeIn(150);
}

function close_menus(){
  $('div.stocktype_container').fadeOut(80)
  $('div.stockgroup_container').fadeOut(80)
  $("div.custom_entry").fadeOut(80)
}

function submit_new_item_for( list, name, group ){
  close_menus();
  $.ajax({
    type: "POST",
    url: "/add?list=" + list + "&name=" + name + "&group=" + group, 
    success: function (msg) {
        if( list == "needed_items" ){ 
          $("#needed_items").append( $(
          '<div id=id'+ msg + '> <div class="item"> &nbsp;' + name + ', ' + group + ' <img src="images/x.png" border=0 class="destroy_button" height=60 width=60 onclick="delete_item(\'' + msg + '\')"> </div> <div class="spacer"> </div> </div>' ) )
        }
        if( list == "needed_stocktypes" ){
          $("#stocktype_block_"+group).append( $(
            ' <div class="stocktype" id="stocktype_container" onclick=" submit_new_item_for(\'needed_items\',\'' + name + '\',\'' + group + '\')"> &nbsp; ' + name + '</div>'
          ) )
        }
    }


  });
}

function delete_item( id ){
  $("div#id" + id).fadeOut(200, function() { $(this).remove() } );
  $.ajax({
    type: "POST",
    url: "/delete?id=" + id ,
    success: function (msg) { }
  });
}

function do_custom_entry( group ){
  close_menus()
  $("div#custom_entry_title").html("Add " + group + " item: " )
  //#$("#add_custom_item_form").attr("onSubmit", "submit_custom_entry( '" + group + "' )" )  
  $("#add_custom_item_form").submit( 
    function() {
      submit_custom_entry( group )
      return false;
    });

  $("div.custom_entry").fadeIn(200, function() {} );
}

function submit_custom_entry( group ){
  console.log( $("#custom_item").val() )
  console.log( group )
  // trigger addition to shopping list
  submit_new_item_for("needed_items", $("#custom_item").val(), group )

  // trigger addition to stocktype list (unless item already exists)
  submit_new_item_for("needed_stocktypes", $("#custom_item").val(), group )

  close_menus() 
}

