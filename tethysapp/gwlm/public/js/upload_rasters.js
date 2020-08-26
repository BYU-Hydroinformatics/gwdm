/*****************************************************************************
 * FILE:    Upload Rasters
 * DATE:    25 AUGUST 2020
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
    var public_interface;

    /************************************************************************
     *                    PRIVATE FUNCTION DECLARATIONS
     *************************************************************************/

    var upload_rasters,
        init_all,
        init_events,
        init_jquery_vars,
        reset_form;

    /************************************************************************
     *                    PRIVATE FUNCTION IMPLEMENTATIONS
     *************************************************************************/
    //Reset the form when the request is made succesfully
    reset_form = function(result){
        if("success" in result){
            addSuccessMessage('Raster Successfully Uploaded!');
            $("#aquifer-select").empty().trigger('change');
            $("#variable-select").empty().trigger('change');        }
    };

    init_jquery_vars = function(){
    };

    upload_rasters = function(){
        reset_alert();
        var region = $("#region-select option:selected").val();
        var aquifer = $("#aquifer-select option:selected").text();
        var variable = $("#variable-select option:selected").val();
        var ncfiles = $("#shp-upload-input")[0].files;

        if(aquifer === ""){
            addErrorMessage("Aquifer cannot be empty! Please select an Aquifer.");
            return false;
        }else{
            reset_alert();
        }
        if(variable === ""){
            addErrorMessage("Variable cannot be empty! Please select a Variable.");
            return false;
        }else{
            reset_alert();
        }
        addInfoMessage("Uploading Rasters. Please wait...","message");

        var data = new FormData();
        data.append("region", region);
        data.append("aquifer", aquifer);
        data.append("variable", variable);

        for(var i=0;i < ncfiles.length;i++){
            data.append("ncfiles",ncfiles[i]);
        }
        var submit_button = $("#submit-upload-rasters");
        var submit_button_html = submit_button.html();
        submit_button.text('Uploading Rasters ...');
        var xhr = ajax_update_database_with_file("submit", data); //Submitting the data through the ajax function, see main.js for the helper function.
        xhr.done(function(return_data){ //Reset the form once the data is added successfully
            if("success" in return_data){
                submit_button.html(submit_button_html);
                reset_form(return_data);
                console.log(return_data);
            }else{
                submit_button.html(submit_button_html);
                addErrorMessage(return_data['error']);
                console.log(return_data['error'])
            }
        });


    };

    $("#submit-upload-rasters").click(upload_rasters);

    init_all = function(){
        init_jquery_vars();
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
        $("#region-select").change(function(){
            var region = $("#region-select option:selected").val();
            var xhr = ajax_update_database("get-aquifers", {'id': region}); //Submitting the data through the ajax function, see main.js for the helper function.
            xhr.done(function(return_data){ //Reset the form once the data is added successfully
                if("success" in return_data){
                    var options = return_data["aquifers_list"];
                    var var_options = return_data["variables_list"];
                    $("#aquifer-select").html('');
                    $("#variable-select").html('');
                    // $("#variable-select").select2({'multiple': true,  placeholder: "Select a Variable(s)"});
                    // $("#aquifer-select").select2({'multiple': false,  placeholder: "Select an Aquifer(s)"});
                    var empty_opt = '<option value="" selected disabled>Select item...</option>';
                    var var_empty_opt = '<option value="" selected disabled>Select item...</option>';
                    $("#aquifer-select").append(empty_opt);
                    $("#variable-select").append(var_empty_opt);
                    options.forEach(function(attr,i){
                        var aquifer_option = new Option(attr[0], attr[1]);
                        $("#aquifer-select").append(aquifer_option);
                    });
                    var_options.forEach(function(attr, i){
                        var var_option = new Option(attr[0], attr[1]);
                        $("#variable-select").append(var_option);
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