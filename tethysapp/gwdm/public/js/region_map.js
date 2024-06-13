/*****************************************************************************
 * FILE:    View Region Map
 * DATE:    3 MARCH 2020
 * AUTHOR: Brigham Young University
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
    var aquiferGroup,
        contourLayer,
        contourTimeLayer,
        contourGroup,
        currentFeatures,
        drawControl,
        drawGroup,
        // drawOptions,
        $getMultWellsBtn,
        $geoserverUrl,
        geojsonMarkerOptions,
        interpolationGroup,
        lastPopup,
        layer_control,
        map,
        markers,
        min_obs,
        max_obs,
        $modalWarning,
        $modalChart,
        $tsToggle,
        overlay_maps,
        public_interface,				// Object returned by the module
        region,
        regionGroup,
        rangeMin,
        rangeMax,
        slidervar,
        $threddsUrl,
        tdWmsLayer,
        ts_chart,
        user_status,
        wfs_response,
        wmsLayer,
        wms_legend,
        well_obs;

    /************************************************************************
     *                    PRIVATE FUNCTION DECLARATIONS
     *************************************************************************/

    var add_wms,
        get_chart_min_date,
        get_chart_max_date,
        get_ts,
        generate_chart,
        generate_mult_chart,
        get_region_aquifers,
        get_well_obs,
        get_wms_datasets,
        get_wms_metadata,
        generate_drawdown_chart,
        highlight_layer,
        init_all,
        init_events,
        init_jquery_vars,
        init_dropdown,
        init_map,
        init_slider,
        load_markers,
        markers_style_function,
        multi_wells_warning,
        original_map_chart,
        resize_map_chart,
        reset_alert,
        reset_form,
        set_outlier,
        toggle_chart_labels,
        update_general_chart,
        view_region,
        view_aquifer,
        view_wells,
        wfs_style_function,
        wfs_feature_function,
        wfs_filter_function;


    /************************************************************************
     *                    PRIVATE FUNCTION IMPLEMENTATIONS
     *************************************************************************/
    //Reset the form when the request is made successfully
    reset_form = function(result){
        if("success" in result){
            addSuccessMessage('');
        }
    };

    resize_map_chart = function(){
        $('#chart').addClass('partial-chart');
        $('#chart').removeClass('full-chart');
        $('#map').removeClass('full-map');
        $('#map').addClass('partial-map');
    };

    original_map_chart = function(){
        $('#chart').removeClass('partial-chart');
        $('#chart').addClass('full-chart');
        $('#map').addClass('full-map');
        $('#map').removeClass('partial-map');
    };

    init_jquery_vars = function(){
        $geoserverUrl = $("#geoserver-text-input").val();
        $modalChart = $("#chart-modal");
        $modalWarning = $("#warning-modal");
        $threddsUrl = $("#thredds-text-input").val();
        region = $("#region-text-input").val();
        user_status = $("#user-info").attr('user-status');
        $getMultWellsBtn = $(".submit-get-measurements");
        $tsToggle = false;
    };


    init_map = function(){
        map = L.map('map',{
            zoom: 3,
            center: [0, 0],
            editable: true
            // crs: L.CRS.EPSG3857
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            // maxZoom: 10,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let drawOptions = {
            position: 'topleft',
            draw:{
                polyline: false,
                marker: false,
                circlemarker: false,
                circle: false
            }
        };

        drawControl = new L.Control.Draw(drawOptions);

        wms_legend = L.control({
            position: 'bottomright'
        });

        wms_legend.onAdd = function(map) {
            // var src = "?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=significant_wave_height&colorscalerange=0,3&PALETTE=scb_bugnylorrd&numcolorbands=100&transparent=TRUE";
            var legend_div = L.DomUtil.create('div', 'info legend lcontrol hidden');
            legend_div.innerHTML +=
                '<img src="" name="legend-image" id="legend-image" alt="Legend">';
            return legend_div;
        };
        wms_legend.addTo(map);

        var legend = L.control({position: 'topright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info_legend');
            var labels = ['<strong>Legend</strong>'];
            labels.push('<span class="bluewell"></span> Regular Wells');
            labels.push('<span class="redwell"></span> Outlier Wells');
            div.innerHTML = labels.join('<br>');
            return div;
        };
        legend.addTo(map);
        var timeDimension = new L.TimeDimension();
        map.timeDimension = timeDimension;

        var player  = new L.TimeDimension.Player({
            loop: true,
            startOver:true
        }, timeDimension);

        var timeDimensionControlOptions = {
            player:        player,
            timeDimension: timeDimension,
            position:      'bottomleft',
            autoPlay:      false,
            minSpeed:      1,
            speedStep:     0.5,
            maxSpeed:      20,
            timeSliderDragUpdate: true,
            loopButton:true,
            limitSliders:true
        };

        var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
        map.addControl(timeDimensionControl);

        regionGroup = L.featureGroup().addTo(map);
        aquiferGroup = L.featureGroup().addTo(map);
        drawGroup = L.featureGroup().addTo(map);
        interpolationGroup = L.layerGroup().addTo(map);
        contourGroup = L.layerGroup().addTo(map);

        markers = L.markerClusterGroup(    {iconCreateFunction: function (cluster) {
                // get the number of items in the cluster
                var count = cluster.getChildCount();
                // figure out how many digits long the number is
                var digits = (count + '').length;

                return L.divIcon({
                    html: count,
                    className: 'cluster digits-' + digits,
                    iconSize: null,
                });
            }}).addTo(map);

        markers.disableClustering();

        $('#cluster-toggle').change(function() {
            // this will contain a reference to the checkbox
            if (this.checked) {
                markers.enableClustering();

            } else {
                markers.disableClustering();
            }
        });

        $('#ts-toggle').change(function(){
            if(this.checked){
                original_map_chart();
                $tsToggle = true;
                map.closePopup();
                map.addControl(drawControl);
                $(".selected_wells").removeClass("d-none");
                // map.editTools.startPolygon();
                // map.on('editable:drawing:end', (e) => {
                //     console.log(e);
                // });
            } else {
                $tsToggle = false
                drawGroup.clearLayers();
                drawControl.remove();
                $(".selected_wells").addClass("d-none");
                $("#variable-select").trigger("change");
            }
        });

        $("#multi-vals-btn").click(function () {
            let featureDict = {"type": "FeatureCollection"};
            let features = [];
            markers.eachLayer(function(mrkr){
                if(mrkr.options.fillColor === "black"){
                    features.push(mrkr.feature);
                }
            });
            featureDict["features"] = features;
            multi_wells_warning(featureDict);
            currentFeatures = featureDict;
        });

        multi_wells_warning = function(featuresJson){
            if (featuresJson.features.length !== 0) {
                if (featuresJson.features.length > 0) {
                    $modalWarning.modal("show");
                    addWarningMessage("Number of Wells selected are " + featuresJson.features.length + ". Are you sure you want to proceed?")
                    $getMultWellsBtn.removeClass("d-none");
                } else {
                    addErrorMessage("Unknown error. Please try again.");
                    $getMultWellsBtn.addClass("d-none");
                }
            } else {
                $modalWarning.modal("show");
                // $(".warning").innerHTML("No Wells within the geometry. Please Try again.");
                addErrorMessage("No Wells were selected. Please try again.");
                $getMultWellsBtn.addClass("d-none");
            }
        }

        $(".submit-get-measurements").click(function(){
            var aquifer_id = $("#aquifer-select option:selected").val();
            var variable_id = $("#variable-select option:selected").val();
            var data = new FormData();
            data.append("aquifer_id", aquifer_id);
            data.append("variable_id", variable_id);
            data.append("wells_dict", JSON.stringify(currentFeatures));
            var xhr = ajax_update_database_with_file("get-multi-timeseries", data);
            xhr.done(function (return_data) {
                if ("success" in return_data) {
                    // $modalChart.modal('show');
                    // reset_form(return_data);
                    generate_mult_chart(return_data);
                } else if ("error" in return_data) {
                    // addErrorMessage(return_data["error"]);
                    console.log('err');
                }
            });
        })

        highlight_layer = function(layerID) {
            let highlight = {
                radius: 12,
                fillColor: "black",
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            };
            map._layers[layerID.target._leaflet_id].setStyle(highlight);
        }

        overlay_maps = {
            "Region Boundary": regionGroup,
            "Aquifer Boundary": aquiferGroup,
            "Wells": markers,
            "Interpolation Layer": interpolationGroup,
            "Contours": contourGroup
        };

        layer_control = L.control.layers(null, overlay_maps).addTo(map);

        L.easyButton({
            states: [{
                stateName: 'region-home',
                icon: 'bi bi-house',
                title: 'Region Home',
                onClick: function() {
                    // view_region(region, get_region_aquifers);
                    location.reload();
                }
            }]
        }).addTo(map);

        L.easyButton({
            states: [{
                stateName: 'multi-chart',
                icon: 'bi bi-graph-up',
                title: 'Multi Wells Chart',
                onClick: function() {
                    $("#multi-chart-modal").modal("show");
                }
            }]
        }).addTo(map);

        var min_input = L.control({position: 'topleft'});
        min_input.onAdd = function(map){
            var div = L.DomUtil.create('div', 'min_input lcontrol hidden');
            div.innerHTML = '<b>Min:</b><input type="number" class="form-control input-sm" name="leg_min" id="leg_min" min="-5000" max="5000" step="10" value="-500" disabled>';
            return div;
        };
        min_input.addTo(map);

        var max_input = L.control({position: 'topleft'});
        max_input.onAdd = function(map){
            var div = L.DomUtil.create('div', 'max_input lcontrol hidden');
            div.innerHTML = '<b>Max:</b><input type="number" class="form-control input-sm" name="leg_max" id="leg_max" ' +
                'min="-5000" max="5000" step="10" value="0" disabled>';
            return div;
        };
        max_input.addTo(map);

        var symbology_input = L.control({position: 'topright'});
        symbology_input.onAdd = function(map){
            var div = L.DomUtil.create('div', 'symbology_input lcontrol hidden');
            div.innerHTML = '<select  id="select_symbology">'+
                '<option value="" selected disabled>Select Symboloy</option>' +
                '<option value="default">Default</option>' +
                '<option value="default-inv">Default Inverse</option>' +
                '<option value="div-RdYlGn-inv">RdYlGn Inv</option>' +
                '<option value="div-RdYlGn">RdYlGn</option>'
                '<option value="x-Rainbow">Rainbow</option>' +
                '<option value="x-Rainbow-inv">Rainbow Inv</option>' +
                '</select>';
            return div
        };
        symbology_input.addTo(map);

        var opacity_input = L.control({position: 'topright'});
        opacity_input.onAdd = function(map){
            var div = L.DomUtil.create('div', 'opacity_input lcontrol hidden');
            div.innerHTML = '<b>Opacity:</b><input type="number" class="form-control input-sm" name="opacity" id="opacity_val" ' +
                'min="0" max="1" step="0.1" value="1.0">';
            return div;
        };
        opacity_input.addTo(map);

    };


    $('#update-well').on('hide.bs.modal', function () {
        reset_form({"reset": "reset"});
    });

    wfs_style_function = function (feature) {
        return {
            stroke: false,
            fillColor: 'FFFFFF',
            fillOpacity: 0
        };
    };

    wfs_feature_function = function (feature, layer) {
        var popupOptions = {maxWidth: 200};
        if (feature.properties) {
            var popupString = '<div class="popup">';
            // var well_id = feature.id.split('.')[1];
            // console.log(well_id, well_obs[well_id]);
            popupString += '<span class="well_id" well-id="'+feature.id+'"></span><br/>';
            for (var k in feature.properties) {
                var v = feature.properties[k];
                popupString += k + ': ' + v + '<br />';
            }
            // console.log(well_obs[well_id]);

            if(user_status === 'admin'){
                // popupString += '<a class="btn btn-default set-outlier" id="set-outlier" name="set-outlier">Outlier</a></div>';
                var outlier_status = feature.properties['outlier'];
                var checked = '';
                if(outlier_status){
                    checked = 'checked';
                }
                var outlier_toggle = '<input type="checkbox" class="set-outlier" id="outlier-toggle" name="outlier-toggle" '+checked+'><label for="outlier-toggle">Outlier</label>';
                popupString += outlier_toggle;
            }
            layer.bindPopup(popupString);
            layer.on('click', get_ts);

        }
    };

    wfs_filter_function = function(feature) {
        var well_id = feature.id.split('.')[1];
        if(parseInt(rangeMin) <= parseInt(well_obs[well_id]) && parseInt(well_obs[well_id]) <= parseInt(rangeMax)){
            return true
        }
    };

    view_region = function(region_id, callback){
        $(".drawdown").addClass("d-none");
        var defaultParameters = {
            service : 'WFS',
            version : '2.0.0',
            request : 'GetFeature',
            typeName : 'gwdm:region',
            outputFormat : 'text/javascript',
            format_options : 'callback:getRegion',
            SrsName : 'EPSG:4326',
            featureID: 'region.'+region_id
        };

        var parameters = L.Util.extend(defaultParameters);
        var URL = $geoserverUrl + L.Util.getParamString(parameters);

        regionGroup.clearLayers();

        var ajax = $.ajax({
            url : URL,
            dataType : 'jsonp',
            jsonpCallback : 'getRegion',
            success : function (response) {
                var myStyle = {
                    "color": "#710000",
                    "weight": 6,
                    "opacity": 1,
                    "fillOpacity": 0
                };
                var feature = L.geoJSON(response, {style: myStyle, interactive: false}).addTo(regionGroup);
                map.fitBounds(feature.getBounds());
                return callback(region_id);
                // console.log(region_aquifers);
            }
        });
    };

    get_region_aquifers = function(region_id){
        var defaultParameters = {
            service : 'WFS',
            version : '2.0.0',
            request : 'GetFeature',
            typeName : 'gwdm:aquifer',
            outputFormat : 'text/javascript',
            format_options : 'callback:getRegionAquifers',
            SrsName : 'EPSG:4326',
            cql_filter: 'region_id='+region_id
        };

        var parameters = L.Util.extend(defaultParameters);
        var URL = $geoserverUrl + L.Util.getParamString(parameters);
        var ajax = $.ajax({
            url : URL,
            dataType : 'jsonp',
            jsonpCallback : 'getRegionAquifers',
            success : function (response) {
                aquiferGroup.clearLayers();

                var all_aquifers = L.geoJSON(response,
                    {
                        color:'blue',
                        weight:1,
                        fillOpacity:0.2,
                        onEachFeature: function (feature, layer){
                            var tooltip_content="Aquifer Name: "+feature.properties.aquifer_name;
                            layer.bindTooltip(tooltip_content,{sticky:true});
                            layer.on({
                                click: function jumpaquifer(){
                                    var aquifer_val = feature.id.split('.')[1];
                                    $("#aquifer-select").val(aquifer_val).trigger('change');
                                }
                            });

                        }

                    });

                all_aquifers.addTo(aquiferGroup);


            }
        });
    };

    view_aquifer = function(aquifer_id){
        $(".drawdown").addClass("d-none");

        var defaultParameters = {
            service : 'WFS',
            version : '2.0.0',
            request : 'GetFeature',
            typeName : 'gwdm:aquifer',
            outputFormat : 'text/javascript',
            format_options : 'callback:getAquifer',
            SrsName : 'EPSG:4326',
            featureID: 'aquifer.'+aquifer_id
        };

        var parameters = L.Util.extend(defaultParameters);
        var URL = $geoserverUrl + L.Util.getParamString(parameters);

        aquiferGroup.clearLayers();

        var ajax = $.ajax({
            url : URL,
            dataType : 'jsonp',
            jsonpCallback : 'getAquifer',
            success : function (response) {
                var myStyle = {
                    "color": "#0004ff",
                    "weight": 4,
                    "opacity": 1,
                    "fillOpacity": 0
                };
                var feature = L.geoJSON(response, {style: myStyle, interactive: false}).addTo(aquiferGroup);
                map.fitBounds(feature.getBounds());
            }
        });
    };

    markers_style_function = function (feature) {
        if(feature.properties.outlier===false){
            return {
                radius: 6,
                fillColor: "blue",
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
        }else{
            return {
                radius: 6,
                fillColor: "red",
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
        }
    };

    load_markers = function(wfs_obj){
        markers.clearLayers();
        markers.bringToFront();
        L.geoJson(wfs_obj, {
            // style: wfs_style_function,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, markers_style_function(feature));
            },
            onEachFeature: wfs_feature_function,
            filter: wfs_filter_function
        }).addTo(markers);
    };

    view_wells = function(aquifer_id){
        var defaultParameters = {
            service : 'WFS',
            version : '2.0.0',
            request : 'GetFeature',
            typeName : 'gwdm:well',
            outputFormat : 'text/javascript',
            format_options : 'callback:getWells',
            SrsName : 'EPSG:4326',
            cql_filter: 'aquifer_id='+aquifer_id
        };

        var parameters = L.Util.extend(defaultParameters);
        var URL = $geoserverUrl + L.Util.getParamString(parameters);

        // aquiferGroup.clearLayers();

        var ajax = $.ajax({
            url : URL,
            dataType : 'jsonp',
            jsonpCallback : 'getWells',
            success : function (response) {
                wfs_response = response;
                load_markers(wfs_response);
            }
        });
    };

    get_ts = function(e){
        lastPopup = e;
        if($tsToggle===false) {
            var popup = e.target.getPopup();
            var well_id = popup._source.feature.id;
            var aquifer_id = $("#aquifer-select option:selected").val();
            var variable_id = $("#variable-select option:selected").val();
            var data = new FormData();
            data.append("aquifer_id", aquifer_id);
            data.append("variable_id", variable_id);
            data.append("well_id", well_id);
            $("#well-info").attr("well-id", well_id);
            var xhr = ajax_update_database_with_file("get-timeseries", data);
            xhr.done(function (return_data) {
                if ("success" in return_data) {
                    // $modalChart.modal('show');
                    // reset_form(return_data);
                    resize_map_chart();
                    generate_chart(return_data);

                    // addSuccessMessage("Aquifer Update Successful!");
                } else if ("error" in return_data) {
                    // addErrorMessage(return_data["error"]);
                    console.log('err');
                }
            });
        }else{
            highlight_layer(e);
        }
    };

    set_outlier = function(){
        var aquifer_id = $("#aquifer-select option:selected").val();
        var variable_id = $("#variable-select option:selected").val();
        var well_id = $("#well-info").attr("well-id");

        var data = new FormData();
        data.append("aquifer_id", aquifer_id);
        data.append("variable_id", variable_id);
        data.append("well_id", well_id);
        var xhr = ajax_update_database_with_file("set-outlier", data);
        xhr.done(function(return_data){
            if("success" in return_data){
                // addSuccessMessage("Aquifer Update Successful!");
            }else if("error" in return_data){
                // addErrorMessage(return_data["error"]);
                console.log('err');
            }
        });
    };

    // $("#set-outlier").click(set_outlier);
    jQuery("body").on('click','.set-outlier', function(e){
        // e.preventDefault();
        set_outlier();
    });

    generate_drawdown_chart = function(result){
        let wms_endpoint = $("#select-interpolation option:selected").text();
        let variable_name = $("#variable-select option:selected").text();
        Highcharts.stockChart('plotter',{
            chart:{
                type: 'spline'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }
            },
            title: {
                text: wms_endpoint +" "+ variable_name + " Storage Time Series",
                style: {
                    fontSize: '14px'
                }
            },
            xAxis: {
                title: {
                    text: result['units']
                }
            },
            yAxis: {
                title: {
                    text: "Storage Time Series"
                }

            },
            exporting: {
                enabled: true
            },
            series: [{
                data:result['time_series'],
                name: "Storage Time Series"
            }]

        }, function (chart) {
            toggle_chart_labels(chart);
        });
    };


    generate_mult_chart = function(result){
        let seriesOptions = [];
        result["ts_list"].forEach((ts, idx) => {
            seriesOptions.push({data: ts, name: currentFeatures["features"][idx]["properties"]["well_name"]})
        });
        var variable_name = $("#variable-select option:selected").text();
        Highcharts.stockChart('multi-plotter',{
            chart:{
                type: 'spline'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }
            },
            // title: {
            //     text: result['well_info']["well_name"] +" "+ variable_name + " values",
            //     style: {
            //         fontSize: '14px'
            //     }
            // },
            // xAxis: {
            //     title: {
            //         text: result['well_info']['attr_dict']
            //     }
            // },
            yAxis: {
                title: {
                    text: variable_name
                }

            },
            exporting: {
                enabled: true
            },
            series: seriesOptions

        });
    };

    get_chart_min_date  = function(first_entry){
        let interp_raster = $("#select-interpolation option:selected").val();
        let min_val;
        if(interp_raster !== ""){
            let first_time = tdWmsLayer._timeDimension.getAvailableTimes()[0];
            min_val = Math.min(first_time, first_entry);
        } else {
            min_val = first_entry
        }
        return min_val
    };

    get_chart_max_date = function(last_entry){
        let interp_raster = $("#select-interpolation option:selected").val();
        let max_val;
        if(interp_raster !== ""){
            let last_time = tdWmsLayer._timeDimension.getAvailableTimes()[
            tdWmsLayer._timeDimension.getAvailableTimes().length - 1
                ]
            max_val = Math.max(last_time, last_entry);
        } else {
            max_val = last_entry
        }
        return max_val
    }

    update_general_chart = function(){
        let first_entry = ts_chart.series[0].processedXData[0];
        let last_entry = ts_chart.series[0].processedXData[ts_chart.series[0].processedXData.length -1];
        ts_chart.update({
            xAxis: {
                min: get_chart_min_date(first_entry),
                max: get_chart_max_date(last_entry),
                plotBands: [
                    {
                        color: "rgba(0,0,0,0.05)",
                        from: new Date(1948, 0, 1),
                        to: tdWmsLayer._timeDimension.getAvailableTimes()[0],
                        id: "band1"
                    },
                    {
                        color: "rgba(0,0,0,0.05)",
                        from:
                            tdWmsLayer._timeDimension.getAvailableTimes()[
                            tdWmsLayer._timeDimension.getAvailableTimes()
                                .length - 1
                                ],
                        to:  new Date(2050, 0, 1),
                        id: "band2"
                    }
                ],
                plotLines: [
                    {
                        color: "red",
                        dashStyle: "solid",
                        value: tdWmsLayer._timeDimension.getCurrentTime(),
                        width: 2,
                        id: "pbCurrentTime"
                    }
                ]
            }
        })
    };


    generate_chart = function(result){
        var variable_name = $("#variable-select option:selected").text();
        ts_chart = Highcharts.chart('chart',{
            chart:{
                type: 'spline'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }
            },
            title: {
                text: result['well_info']["well_name"] +" "+ variable_name + " values",
                style: {
                    fontSize: '14px'
                }
            },
            xAxis: {
                type: "datetime",
                title: {
                    text: result['well_info']['attr_dict']
                }
            },
            yAxis: {
                title: {
                    text: variable_name
                }

            },
            exporting: {
                enabled: true
            },
            series: [{
                data:result['timeseries'],
                name: variable_name
            }]

        }, function(chart){
            toggle_chart_labels(chart);
        });
        let interp_raster = $("#select-interpolation option:selected").val();
        if (interp_raster!==""){
            update_general_chart();
        }
    };

    toggle_chart_labels = function(chart) {
        chart.renderer.button('Toggle Labels', 0, 0)
            .attr({
                zIndex: 3
            })
            .on('click', function () {
                let opt = chart.series[0].options;
                opt.dataLabels.enabled = !opt.dataLabels.enabled;
                // opt.marker.enabled = !opt.marker.enabled;
                chart.series[0].update(opt);
            })
            .add();
    };

    get_wms_datasets = function(aquifer_name, variable_id, region_id){
        var data = {"aquifer_name": aquifer_name, "variable_id": variable_id, "region_id": region_id};
        var xhr = ajax_update_database("get-wms-datasets", data);
        xhr.done(function(return_data) {
            if ("success" in return_data) {
                $("#select-interpolation").html('');
                // $("#select-interpolation").prop("selected", false);
                var empty_opt = '<option value="" selected disabled>Select item...</option>';
                $("#select-interpolation").append(empty_opt);
                $("#select-interpolation").val('').trigger('change');
                var wms_options = return_data['wms_files'];
                wms_options.forEach(function(attr,i){
                    var wms_option = new Option(attr[0], attr[1]);
                    $("#select-interpolation").append(wms_option);
                });
            }else{
                console.log(return_data);
            }
        });
    };

    get_well_obs = function(aquifer_id, variable_id){
        var data = {"aquifer_id": aquifer_id, "variable_id": variable_id};
        var xhr = ajax_update_database("get-well-obs", data);
        xhr.done(function(return_data){
            if("success" in return_data){
                well_obs = return_data['obs_dict'];

                if('min_obs' in return_data){
                    min_obs = return_data['min_obs'];
                    max_obs = return_data['max_obs'];
                    document.getElementById('input-number-min').setAttribute("value", min_obs);
                    document.getElementById('input-number-max').setAttribute("value", max_obs);
                    slidervar.noUiSlider.updateOptions({
                        start: [0, max_obs],
                        range: {
                            'min': 0,
                            'max': max_obs
                        },
                    });
                    slidervar.removeAttribute('disabled');
                }else{
                    slidervar.setAttribute('disabled', true);
                }
                view_wells(aquifer_id);

                // addSuccessMessage("Aquifer Update Successful!");
            }else if("error" in return_data){
                // addErrorMessage(return_data["error"]);
                console.log('err');
            }
        });
    };

    get_wms_metadata = function(region, aquifer_name, file_name, wms_endpoint){
        var data = {"region": region, "aquifer_name": aquifer_name, "file_name": file_name};
        var xhr = ajax_update_database("get-wms-metadata", data);
        xhr.done(function(return_data){
            if("success" in return_data) {
                var range_min = return_data['range_min'];
                var range_max = return_data['range_max'];
                var drawdown_dict = return_data['drawdown'];
                $("#leg_min").val(range_min);
                $("#leg_max").val(range_max);
                add_wms(wms_endpoint, range_min, range_max, 'x-Rainbow');
                if("units" in drawdown_dict){
                    $(".drawdown").removeClass("d-none");
                }
                generate_drawdown_chart(drawdown_dict);
            }
        })
    };

    add_wms = function(wmsUrl, range_min, range_max, style){
        // map.removeLayer(tdWmsLayer);
        // map.removeLayer(contourTimeLayer);
        $('.lcontrol').removeClass('d-none');
        $('.leaflet-bar-timecontrol').removeClass('d-none');
        interpolationGroup.clearLayers();
        contourGroup.clearLayers();

        contourLayer = L.tileLayer.wms(wmsUrl, {
            layers: 'tsvalue',
            format: 'image/png',
            transparent: true,
            styles: 'contours',
            crs: L.CRS.EPSG4326,
            opacity: '1.0',
            colorscalerange: [range_min, range_max],
            version:'1.3.0',
            zIndex: 10
        });

        contourTimeLayer = L.timeDimension.layer.wms(contourLayer,{
            requestTimefromCapabilities: true,
            updateTimeDimension: true,
            updateTimeDimensionMode: 'replace',
        });

        wmsLayer = L.tileLayer.wms(wmsUrl, {
            layers: 'tsvalue',
            format: 'image/png',
            // dimension: 'time',
            transparent: true,
            styles: 'raster/'+style,
            opacity: '1.0',
            colorscalerange: [range_min, range_max],
            version:'1.3.0',
            zIndex:5,
        });

        tdWmsLayer = L.timeDimension.layer.wms(wmsLayer,{
            requestTimefromCapabilities: true,
            updateTimeDimension: true,
            updateTimeDimensionMode: 'replace',

        });
        // tdWmsLayer.addTo(map);
        // contourTimeLayer.addTo(map);
        interpolationGroup.addLayer(tdWmsLayer);
        contourGroup.addLayer(contourTimeLayer);
        contourTimeLayer.bringToFront();
        var src = wmsUrl + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=tsvalue"+
            "&colorscalerange="+range_min+","+range_max+"&PALETTE=raster/"+style+"&transparent=TRUE";
        $("#legend-image").attr("src", src);
        if(ts_chart !== undefined){
            get_ts(lastPopup);
            // console.log(lastPopup);
            // update_general_chart();
        }
    };

    init_dropdown = function () {
    };

    init_slider = function(){
        slidervar = document.getElementById('slider');
        noUiSlider.create(slidervar, {
            connect: true,
            start: [ 0, 700 ],
            step: 1,
            range: {
                min: 0,
                max: 700
            }
        });
    };

    init_all = function(){
        init_jquery_vars();
        init_map();
        init_dropdown();
        init_slider();
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
        // view_region(region, get_region_aquifers);
        Highcharts.setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        $("#region-select").change(function(){
            region = $("#region-select").val();
            view_region(region, get_region_aquifers);
            original_map_chart();
            var xhr = ajax_update_database("get-aquifers", {'id': region}); //Submitting the data through the ajax function, see main.js for the helper function.
            xhr.done(function(return_data){ //Reset the form once the data is added successfully
                if("success" in return_data){
                    var options = return_data["aquifers_list"];
                    var var_options = return_data["variables_list"];
                    $("#aquifer-select").html('');
                    $("#variable-select").html('');
                    $("#select-interpolation").html('');
                    $("#aquifer-select").val(null).trigger('change.select2');
                    $("#variable-select").val(null).trigger('change.select2');
                    $("#select-interpolation").val(null).trigger('change.select2');
                    $("#variable-select").select2({'multiple': false,  placeholder: "Select a Variable"});
                    $("#aquifer-select").select2({'multiple': false,  placeholder: "Select an Aquifer"});
                    $("#select-interpolation").select2({'multiple': false, placeholder: "Select a Layer"});
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
        });
        $("#region-select").val(region).trigger("change");

        var aquifer_empty_opt = '<option value="" selected disabled>Select Aquifer...</option>';
        $("#aquifer-select").prepend(aquifer_empty_opt);
        $('#aquifer-select').select2('val', '');
        $("#aquifer-select").change(function(){
            var aquifer_id = $("#aquifer-select option:selected").val();
            var variable_id = $("#variable-select option:selected").val();
            var aquifer_name = $("#aquifer-select option:selected").text();
            view_aquifer(aquifer_id);
            if(variable_id !== ""){
                get_well_obs(aquifer_id, variable_id);
                get_wms_datasets(aquifer_name, variable_id, region);
            }
            original_map_chart();
            $("#legend-image").attr("src", '');
            interpolationGroup.clearLayers();
            contourGroup.clearLayers();
            $('.lcontrol').addClass('d-none');
            $('.leaflet-bar-timecontrol').addClass('d-none');
            // map.removeLayer(tdWmsLayer);
            // map.removeLayer(contourTimeLayer);
        });

        $("#variable-select").change(function(){
            $(".drawdown").addClass("d-none");

            var aquifer_id = $("#aquifer-select option:selected").val();
            var aquifer_name = $("#aquifer-select option:selected").text();
            var variable_id = $("#variable-select option:selected").val();
            if(variable_id !== ""){
                get_well_obs(aquifer_id, variable_id);
                get_wms_datasets(aquifer_name, variable_id, region);
            }
            original_map_chart();
            $("#legend-image").attr("src", '');
            $('.lcontrol').addClass('d-none');
            $('.leaflet-bar-timecontrol').addClass('d-none');
            // map.removeLayer(tdWmsLayer);
            // map.removeLayer(contourTimeLayer);
            interpolationGroup.clearLayers();
            contourGroup.clearLayers();
        });

        $("#select-interpolation").change(function(){
            var wms_endpoint = $("#select-interpolation option:selected").val();
            var file_name = $("#select-interpolation option:selected").text();
            if(file_name!=='Select item...'){
                var aquifer_name = $("#aquifer-select option:selected").text();
                get_wms_metadata(region, aquifer_name, file_name, wms_endpoint);
            }

        });

        $("#select_symbology").change(function(){
            var symbology = $("#select_symbology option:selected").val();
            var current_wms_layer = interpolationGroup.getLayers()[0];
            current_wms_layer.setParams({styles: 'raster/'+symbology});
            var wmsUrl = current_wms_layer._baseLayer._url;
            var range_min = current_wms_layer._baseLayer.wmsParams.colorscalerange[0];
            var range_max = current_wms_layer._baseLayer.wmsParams.colorscalerange[1];
            var src = wmsUrl + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=tsvalue"+
                "&colorscalerange="+range_min+","+range_max+"&STYLES=raster/"+symbology+"&transparent=TRUE";
            $("#legend-image").attr("src", src);
        });

        $("#opacity_val").change(function(){
            var opacity = $("#opacity_val").val();
            tdWmsLayer.setOpacity(opacity);
        });

        var inputNumberMin = document.getElementById('input-number-min');
        var inputNumberMax = document.getElementById('input-number-max');

        inputNumberMin.addEventListener('change', function () {
            slidervar.noUiSlider.set([this.value, inputNumberMax.value]);
        });

        inputNumberMax.addEventListener('change', function () {
            slidervar.noUiSlider.set([inputNumberMin.value, this.value]);
        });


        slidervar.noUiSlider.on('update', function( values, handle ) {

            //handle = 0 if min-slider is moved and handle = 1 if max slider is moved
            if (handle===0){
                document.getElementById('input-number-min').value = values[0];
            } else {
                document.getElementById('input-number-max').value =  values[1];
            }
            rangeMin = document.getElementById('input-number-min').value;
            rangeMax = document.getElementById('input-number-max').value;
            load_markers(wfs_response)
        });

        map.on('draw:created', (e) => {
            drawGroup.clearLayers();
            let drawnLayer = e.layer;
            drawGroup.addLayer(drawnLayer);
            let polygonGeoJson = e.layer.toGeoJSON();
            let ptsWithin = turf.within(markers.toGeoJSON(), polygonGeoJson);
            multi_wells_warning(ptsWithin);
            currentFeatures = ptsWithin;
        });

        map.on('draw:drawstart', (e) => {
            drawGroup.clearLayers();
            load_markers(wfs_response);
        });

        map.timeDimension.on('timeload', (function() {
            if (!ts_chart){
                return;
            }
            ts_chart.xAxis[0].removePlotBand("pbCurrentTime");
            ts_chart.xAxis[0].addPlotLine({
                color: 'red',
                dashStyle: 'solid',
                value: new Date(map.timeDimension.getCurrentTime()),
                width: 2,
                id: 'pbCurrentTime'
            });
        }));

    });

    return public_interface;

}()); // End of package wrapper
// NOTE: that the call operator (open-closed parenthesis) is used to invoke the library wrapper
// function immediately after being parsed.