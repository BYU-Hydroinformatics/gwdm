/*****************************************************************************
 * FILE:    Add New Layer
 * DATE:    22 AUGUST 2019
 * AUTHOR: Sarva Pulla
 * LICENSE: BSD 2-Clause
 *****************************************************************************/

/*****************************************************************************
 *                      LIBRARY WRAPPER
 *****************************************************************************/

var LIBRARY_OBJECT = (function() {
    // Wrap the library in a package function
    "use strict"; // And enable strict mode for this library

    /************************************************************************
     *                      MODULE LEVEL / GLOBAL VARIABLES
     *************************************************************************/
    var public_interface,				// Object returned by the module
        $shp_input,
        $wellsModal;
    /************************************************************************
     *                    PRIVATE FUNCTION DECLARATIONS
     *************************************************************************/

    var add_wells,
        get_shp_attributes,
        init_all,
        init_jquery_vars,
        init_dropdown,
        reset_form,
        reset_dropdown;

    /************************************************************************
     *                    PRIVATE FUNCTION IMPLEMENTATIONS
     *************************************************************************/
    //Reset the form when the request is made succesfully
    reset_form = function(result){
        if("success" in result){
            $("#shp-upload-input").val('');
            $(".attributes").addClass('d-none');
            $(".add").addClass('d-none');
            reset_dropdown();
            addSuccessMessage('Wells Upload Complete!');
        }
    };

    reset_dropdown = function(){
        $("#name_attributes").html('');
        $("#id_attributes").html('');
        $("#lat_attributes").html('');
        $("#lon_attributes").html('');
        $("#gse_attributes").html('');
        $("#aquifer_attributes").html('');
        $("#meta_attributes").html('');
        $("#name_attributes").val(null).trigger('change.select2');
        $("#id_attributes").val(null).trigger('change.select2');
        $("#lat_attributes").val(null).trigger('change.select2');
        $("#lon_attributes").val(null).trigger('change.select2');
        $("#gse_attributes").val(null).trigger('change.select2');
        $("#aquifer_attributes").val(null).trigger('change.select2');
        $("#meta_attributes").val(null).trigger('change.select2');
    };

    init_jquery_vars = function(){
        $shp_input = $("#shp-upload-input");
        $wellsModal = $("#wells-modal");
    };

    init_dropdown = function () {
        $(".lat_attributes").select2({dropdownParent: $wellsModal});
        $(".lon_attributes").select2({dropdownParent: $wellsModal});
        $(".name_attributes").select2({dropdownParent: $wellsModal});
        $(".id_attributes").select2({dropdownParent: $wellsModal});
        $(".aquifer_attributes").select2({dropdownParent: $wellsModal});
        $(".gse_attributes").select2({dropdownParent: $wellsModal});
        $(".meta_attributes").select2({dropdownParent: $wellsModal});
    };


    get_shp_attributes = function(){
        var shapefiles = $("#shp-upload-input")[0].files;
        if($shp_input.val() === ""){
            addErrorMessage("Layer Shape File cannot be empty!");
            return false;
        }else{
            reset_alert();
        }

        addInfoMessage("Getting attributes. Please wait...","message");
        var data = new FormData();
        for(var i=0;i < shapefiles.length;i++){
            data.append("shapefile",shapefiles[i]);
        }
        var submit_button = $("#submit-get-attributes");
        var submit_button_html = submit_button.html();
        submit_button.text('Submitting ...');
        var xhr = ajax_update_database_with_file("get-attributes", data); //Submitting the data through the ajax function, see main.js for the helper function.
        xhr.done(function(return_data){ //Reset the form once the data is added successfully
            if("success" in return_data){
                submit_button.html(submit_button_html);
                $(".attributes").removeClass('d-none');
                $wellsModal.modal('show');
                var attributes = return_data["attributes"];
                reset_dropdown();
                var empty_opt = '<option value="" selected disabled>Select item...</option>';
                $("#name_attributes").append(empty_opt).trigger('change');
                $("#id_attributes").append(empty_opt).trigger('change');
                $("#lat_attributes").append(empty_opt).trigger('change');
                $("#lon_attributes").append(empty_opt).trigger('change');
                $("#gse_attributes").append(empty_opt).trigger('change');
                $("#aquifer_attributes").append(empty_opt).trigger('change');
                // $("#meta_attributes").append(empty_opt).trigger('change');
                attributes.forEach(function(attr,i){
                    var name_option = new Option(attr, attr);
                    var id_option = new Option(attr, attr);
                    var lat_option = new Option(attr, attr);
                    var lon_option = new Option(attr, attr);
                    var gse_option = new Option(attr, attr);
                    var meta_option = new Option(attr, attr);
                    var aquifer_option = new Option(attr, attr);
                    $("#name_attributes").append(name_option).trigger('change');
                    $("#id_attributes").append(id_option).trigger('change');
                    $("#lat_attributes").append(lat_option).trigger('change');
                    $("#lon_attributes").append(lon_option).trigger('change');
                    $("#gse_attributes").append(gse_option).trigger('change');
                    $("#aquifer_attributes").append(aquifer_option).trigger('change');
                    $("#meta_attributes").append(meta_option).trigger('change');
                });
                $(".add").removeClass('d-none');
            }else{
                addErrorMessage(return_data['error']);
                submit_button.html(submit_button_html);
                reset_dropdown();

            }
        });
    };

    $("#submit-get-attributes").click(get_shp_attributes);

    add_wells = function(){
        var shapefiles = $("#shp-upload-input")[0].files;
        if($shp_input.val() === ""){
            addErrorMessage("Layer Shape File cannot be empty!");
            return false;
        }else{
            reset_alert();
        }

        var name = $("#name_attributes option:selected").val();
        var id =  $("#id_attributes option:selected").val();
        var lat = $("#lat_attributes option:selected").val();
        var lon = $("#lon_attributes option:selected").val();
        var gse = $("#gse_attributes option:selected").val();
        var meta = $("#meta_attributes").val();
        var aquifer_id = $("#aquifer-select option:selected").val();
        var aquifer_col = $("#aquifer_attributes option:selected").val();
        var region_id = $("#region-select option:selected").val();

        var data = new FormData();
        for(var i=0;i < shapefiles.length;i++){
            data.append("shapefile",shapefiles[i]);
        }
        data.append("attributes", meta);
        data.append("name", name);
        data.append("id", id);
        data.append("lat", lat);
        data.append("lon", lon);
        data.append("gse", gse);
        data.append("aquifer_id", aquifer_id);
        data.append("aquifer_col", aquifer_col);
        data.append("region_id", region_id);

        var submit_button = $("#submit-add-wells");
        var submit_button_html = submit_button.html();
        submit_button.text('Submitting ...');
        var xhr = ajax_update_database_with_file("submit", data); //Submitting the data through the ajax function, see main.js for the helper function.
        addInfoMessage("Adding wells. Please wait...","message");

        xhr.done(function(return_data){ //Reset the form once the data is added successfully
            if("success" in return_data){
                submit_button.html(submit_button_html);
                reset_form(return_data);
                addSuccessMessage(return_data["success"]);
            }else{
                addErrorMessage(return_data['error']);
            }
        });
    };

    $(".submit-add-wells").click(add_wells);



    init_all = function(){
        init_jquery_vars();
        init_dropdown();
    };

    /************************************************************************
     *                        DEFINE PUBLIC INTERFACE
     *************************************************************************/
    /*
     * Library object that contains public facing functions of the package.
     * This is the object that is returned by the library wrapper function.
     * See below.
     * NOTE: The functions in the public interface have access to the private
     * functions of the library because of JavaScript function scope.
     */
    public_interface = {

    };

    /************************************************************************
     *                  INITIALIZATION / CONSTRUCTOR
     *************************************************************************/

    // Initialization: jQuery function that gets called when
    // the DOM tree finishes loading
    $(function() {
        init_all();
        window.onbeforeunload = null;
        $("#region-select").change(function(){
            var region = $("#region-select option:selected").val();
            var xhr = ajax_update_database("get-aquifers", {'id': region}); //Submitting the data through the ajax function, see main.js for the helper function.
            xhr.done(function(return_data){ //Reset the form once the data is added successfully
                if("success" in return_data){
                    var options = return_data["aquifers_list"];
                    $("#aquifer-select").html('');
                    var empty_opt = '<option value="" selected disabled>Select item...</option>';
                    $("#aquifer-select").append(empty_opt);
                    options.forEach(function(attr,i){
                        var aquifer_option = new Option(attr[0], attr[1]);
                        $("#aquifer-select").append(aquifer_option);
                    });
                }else{
                    addErrorMessage(return_data['error']);
                }
            });
        }).change();
    });

    return public_interface;

}()); // End of package wrapper
// NOTE: that the call operator (open-closed parenthesis) is used to invoke the library wrapper
// function immediately after being parsed.