**DATA PREPARATION (API)**
=========================

**Inntroduction**
---------------

Before importing data into the GWDM app, the following data content needs to be collected and prepared:
  * Region Boundary
  * Aquifers
  * Well locations
  * Measurements (Time Series Data)
  
A region is typically a state, country, or water management agency boundary and represents the top of the data heirarchy. In one region, there may be one or more aquifers in which wells are located. Each well may have time series data in one or multiple files that show historical trends of groundwater data such as water table elevations, water quality, etc. The following diagram graphically illustrates the relationship of the different data components:
#image

This page will walk you through how to prepare the appropriate files needed to import data into the app and provide links to complementary tools designed to aid in this data preparation process.

**Regions & Aquifers**
---------------------
The first step of organizing groundwater data in the GWDM app is uploading region and aquifer files where the wells are located. In the app, region is the first "filter" that users see on the landing page. Data are then organized by aquifer in the next page.
#image

Region and aquifers files have to be one of the following data types:

  * Shapefile (.shp, .shx, and.dbf are required)
  * GeoJSON file (.geojson)
In the examples used on this page, the state of Utah (USA) was used as a region boundary in a shapefile and Utah's major aquifers were prepared in a .geojson file.

When exporting shapefiles from a utility such as Esri ArcGIS or QGIS, the shapefile should be exported as a 2D object, not a 3D object (no Z coordinate). This is because the PostGIS database used to store the objects in the GWDM only supports 2D shapes. Shapefiles with Z coordinates will result in an error message when importing to ArcGIS. In our experience, shapefiles and GeoJSON objects exported from QGIS are more likely to import correctly than shapes exported from ArcGIS.

**Region (State Boundary)**:
---------------------
For this example, QGIS was used to export the region boundary (the state of Utah) as a shapefile. You can often find regional shapefiles on the internet. Regardless of where you get your shapefile, the exported files should consist of multiple files as seen below.

image

**Aquifer**:
------------
The aquifers in your region will also need to be organized in either a geojson file or a shapefile. The attribute table for the aquifer file has two fields (columns) that are required to upload the file to the app: an aquifer name representing the unique name of the aquifer and an **aquifer ID**, a unique integer ID.


**Well Locations File**
------------------------
Well locations are organized in CSV files where each row represents a well location and the columns represents well attributes. These typically can be exported from Excel or from a well database.

Wells are organized by aquifers in the app. There are two ways to prepare well locations files.

1. Create a single CSV file with all wells and assign each well an aquifer ID corresponding to the aquifer it is located in. This allows the GWDM app to match the aquifer ID attribute from the well location file to the aquifer ID that was inputed with the aquifer polygons in the previous step. This allows you to import all of the wells associated with your region in a single step. However, it does require that you have aquifer IDs associated with your wells. If you do not have Aquifer IDs, you can use one of the support scripts we have provided to automatically generated the IDs based on the aquifer polygon files and the well coordinates.
2. Create a separate CSV file that contains only wells belonging to a single aquifer. This method does not require an aquifer ID as all of the wells are imported to a assigned aquifer. With this method, you create multiple well files - one per aquifer, and then import the wells one at a time. Each time you import the wells, you explicitly select the aquifer polygon the wells should be assigned to.


A well location file must include the well coordinates (latitude and longitude in a decimal degree format), well names, and well IDs. If you are useing method #1 described above, an aquifer ID field is also required.

The required fields (columns) for a wells file are:


This is a sample well locations file:

+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Field**                | **Type**       | **Description**                                                                                                                                                                                     |
+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Latitude                 | Numeric        | Latitude must be input in a decimal degree format.                                                                                                                                                  |
+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Longitude                | Numeric        | Longtitude must be input in a decimal degree format.                                                                                                                                                |
+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Well name                | Text or Numeric| This is a text string or number used to identify the well.                                                                                                                                          |
+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Well ID                  | Text or Numeric| Well ID has to be an unique value and must not have duplicates within an aquifer. There can be duplicate well IDs in different aquifers (i.e. There can be the same well ID in different aquifers)  |
+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Ground Surface Elevation | Numeric        | OPTIONAL: This field only serves as a metadata purpose.                                                                                                                                             |
+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Aquifer                  | Text or Integer|If a file contains wells from multiple aquifers, this field is mandadory.                                                                                                                            |
|                          |                |OPTIONAL if a file only contains wells from single aquifer. See the description above for the two methods for importing well locations.                                                              |
+--------------------------+----------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+


    data_preparation
    support_scripts
    importing_data
    mapping
    installation
