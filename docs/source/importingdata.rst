.. raw:: html
   :file: translate.html
   
**Importing Data**
===================
 
**Introduction**
----------------
To demonstrate the data import process, an example set of data has been provided. Download and unzip the attached files or organize your own files to follow along.
`Download API Test Files <https://github.com/BYU-Hydroinformatics/gwdm/blob/ReadtheDocs-Documentation/docs/source/test_files/SupportScriptFileSet.zip>`_

**Add Region**
---------------
First, we must add a region. To do this, navigate to the main landing page (if you are not logged in with admin privileges, you will need to first obtain these credentials). Select the region tab on the left, then click on the **Add Region** link on the dropdown.

.. image:: images_import/add_region.png
Type in the name of your region and click the Choose Files button to open a file browser. From there you can select a shapefile set, a csv, or a geojson file. The example file in this demo is a set of shapefile files for the Utah state boundary. Note that shapefiles require .shp, .shx, and .dbf files, although .prj files are also good to include.

.. image:: images_import/add_region_files.png
To ensure that your region was loaded properly, you can go to the **Edit Region** tab and click on the **View** icon for your region. This will display your region boundaries on a map. From this page, you can also edit the name of the region or delete a region using the appropriate icons.

.. image:: images_import/view_region.png

**Add Aquifer**
-----------------
Next, we will add the aquifers. To do this, we will follow a similar process to that of adding a region. First, we select the region where the aquifers are located. The dropdown list will display all previously uploaded regions.

.. image:: images_import/add_aquifer_main.png
After selecting the region, a shapefile must be loaded. This time, we will use a geojson file type that contains aquifers in Utah.

.. image:: images_import/add_aquifer.png
Once the file is added, we click Get Attributes to define the aquifer name and ID. An aquifer name and ID should be specified for each aquifer in the file. In the case of the example Utah file, the appropriate attributes are Aquifer_Name and AquiferID (note that not all files will have intuitive names for these attributes). Finally, we add the aquifer with the Add Aquifer button. Once the aquifer(s) are loaded, they can be viewed, edited, or deleted on the Edit Aquifer tab (editing an aquifer includes an ability to edit its aquifer ID; however, this ID is used to connect wells to aquifers, so be careful with this capability).

.. image:: images_import/add_aquifer_attributes.png

**Add Wells**
--------------
Next, we will add the wells using the **Add Wells** command in the Wells section. These wells have already been assigned to their respective aquifers, so we can add them all at once. If you would like to add wells to a single aquifer at a time, pre-assigning aquifer IDs is unneccessary.

To add a list of wells, we select the region of interest. Since we have pre-assigned aquifer IDs, we will not select a single aquifer from the list; rather, we will leave the field blank. This time, we will use a csv file (although shapefiles can also be used). We again use the Get Attributes button to retrieve the column headers from the file. The Wells Wizard will automatically open up, wherein we can select the columns for latitude, longitude, aquifer ID (not necessary if a single aquifer was selected previously), well name, well ID, and ground surface elevation (GSE). For this example file, the appropriate headers are lat_dec, long_dec, AquiferID, Well_Name, Well_ID, and GSE, respectively. Finally, we click the Add Wells button to add the wells to the app.

.. image:: images_import/add_wells.png



   
