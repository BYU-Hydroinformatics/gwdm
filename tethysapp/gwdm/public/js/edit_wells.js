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
    var $geoserverUrl,
        map,
        $modalUpdate,
        public_interface,				// Object returned by the module
        wellGroup;

    /************************************************************************
     *                    PRIVATE FUNCTION DECLARATIONS
     *************************************************************************/

    var delete_well,
        init_all,
        init_events,
        init_jquery_vars,
        init_dropdown,
        init_map,
        reset_form,
        view_well;

    /************************************************************************
     *                    PRIVATE FUNCTION IMPLEMENTATIONS
     *************************************************************************/
    //Reset the form when the request is made successfully
    reset_form = function(result){
        if("success" in result){
            $("#region-text-input").val('');
            $("#shp-upload-input").val('');
            addSuccessMessage('Well Update Complete!');
        }
    };


    init_jquery_vars = function(){
        $modalUpdate = $("#update-well");
        $geoserverUrl = $("#geoserver-text-input").val();
    };

    init_map = function(){
        map = L.map('map',{
            zoom: 3,
            center: [0, 0],
            // crs: L.CRS.EPSG3857
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            // maxZoom: 10,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        wellGroup = L.layerGroup().addTo(map);
    };


    $('#update-well').on('hide.bs.modal', function () {
        reset_form({"reset": "reset"});
    });

    var viewIcon = function(cell, formatterParams){ //plain text value
        return "<i class='bi bi-sunglasses view-region-tabulator'></i>";
    };

    var deleteIcon = function(cell, formatterParams){ //plain text value
        return "<i class='bi bi-file-x'></i>";
    };

    var updateIcon = function(cell, formatterParams){ //plain text value
        return "<i class='bi bi-device-hdd'></i>";
    };

    delete_well = function(e, cell){
        wellGroup.clearLayers();
        var data = {
            well_id: cell.getRow().getData().id
        };
        //update database
        var xhr = deleteRowData($(this), data);
        if (xhr != null) {
            xhr.done(function (data) {
                if ('success' in data) {
                    addSuccessMessage("Well Successfully Deleted!");
                    cell.getRow().delete();
                }
            });
        }
    };

    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }

    view_well = function(e, cell){
        var cell_data = cell.getRow().getData();
        var well_id = cell_data.id;
        var defaultParameters = {
            service : 'WFS',
            version : '2.0.0',
            request : 'GetFeature',
            typeName : 'gwdm:well',
            outputFormat : 'text/javascript',
            format_options : 'callback:getJson',
            SrsName : 'EPSG:4326',
            featureID: 'well.'+well_id
        };

        var parameters = L.Util.extend(defaultParameters);
        var URL = $geoserverUrl + L.Util.getParamString(parameters);

        wellGroup.clearLayers();

        var ajax = $.ajax({
            url : URL,
            dataType : 'jsonp',
            jsonpCallback : 'getJson',
            success : function (response) {
                var feature = L.geoJSON(response).addTo(wellGroup);
                map.fitBounds(feature.getBounds());
            }
        });
    };


    init_dropdown = function () {
    };

    init_all = function(){
        init_jquery_vars();
        init_map();
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
        $("#region-select").change(function(){
            wellGroup.clearLayers();
            $("#tabulator-table").html('');
            var region = $("#region-select option:selected").val();
            var xhr = ajax_update_database("get-aquifers", {'id': region}); //Submitting the data through the ajax function, see main.js for the helper function.
            xhr.done(function(return_data){ //Reset the form once the data is added successfully
                if("success" in return_data){
                    var options = return_data["aquifers_list"];
                    var var_options = return_data["variables_list"];
                    $("#aquifer-select").html('');
                    $("#aquifer-select").val(null).trigger('change.select2');
                    // $("#aquifer-select").select2({'multiple': true,  placeholder: "Select an Aquifer(s)"});
                    var empty_opt = '<option value="" selected disabled>Select item...</option>';
                    // var var_empty_opt = '<option value="" selected disabled>Select item...</option>';
                    // var all_opt = new Option('All Aquifers', 'all');
                    $("#aquifer-select").append(empty_opt);
                    // $("#aquifer-select").append(all_opt);
                    // $("#variable-select").append(var_empty_opt);
                    options.forEach(function(attr,i){
                        var aquifer_option = new Option(attr[0], attr[1]);
                        $("#aquifer-select").append(aquifer_option);
                    });

                }else{
                    addErrorMessage(return_data['error']);
                }
            });
        }).change();

        $("#aquifer-select").change(function() {
            wellGroup.clearLayers();
            var region = $("#region-select option:selected").val();
            var aquifer = $("#aquifer-select option:selected").val();
            $("#tabulator-table").html('');
            var table = new Tabulator("#tabulator-table", {
                height:"311px",
                responsiveLayout:true, // enable responsive layouts
                layout:"fitColumns",
                ajaxURL:"tabulator",
                ajaxParams: {'region': region, 'aquifer': aquifer},
                ajaxProgressiveLoad:"load",
                paginationSize:10,
                placeholder:"No Data Set",
                selectable:1,
                selectablePersistence:false,
                columns:[
                    {title:"ID", field:"id", sorter:"number", align:"center"},
                    {title:"View", formatter:viewIcon, align:"center", cellClick:function(e, cell){view_well(e, cell)}},
                    // {title:"Edit", formatter:updateIcon, align:"center", cellClick:function(e, cell){update_form(e, cell)}},
                    {title:"Delete", formatter:deleteIcon, align:"center", cellClick:function(e, cell){delete_well(e, cell)}},
                    {title:"Well Name", field:"well_name", sorter:"string", headerFilter:"select", headerFilterParams:{values:true}},
                    {title:"Well ID", field:"well_id", sorter:"string", headerFilter:"select", headerFilterParams:{values:true}},
                    {title:"GSE", field:"gse", sorter:"string"},
                    {title:"Attributes", field:"attr_dict", align:"center", sorter:"string"},
                ]
            });
        });

    });

    return public_interface;

}()); // End of package wrapper
// NOTE: that the call operator (open-closed parenthesis) is used to invoke the library wrapper
// function immediately after being parsed.