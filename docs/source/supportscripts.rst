.. raw:: html
   :file: translate.html

**Data Preparation Scripts**
============================

**Introduction**
------------------
These scripts can aid in the data preparation process required prior to using the GWDM tool. They have all been created in a cloud-based environment called Google Colaboratory, or Colab for short. Colab is built on Jupyter Notebook, which allows users to write, execute, and visualize Python code quickly and easily.

These notebooks have been shared as Github Gists. A gist allows the notebook to be opened, run, and modified by an individual user without affecting the experience of another user.

There is a tool for retrieving elevations at wells that are missing ground surface elevation measurements, a tool for assigning aquifer IDs and names to wells depending on location, a tool for formatting wells and time series files, a tool for retrieving wells and time series files from the USGS NWIS database (U.S. only), and a tool for creating "representative" wells based on a grid.

An example set of files has been provided; however, you are welcome to use your own files if you would prefer.
 
`Download API Test Files <https://github.com/BYU-Hydroinformatics/gwdm/blob/ReadtheDocs-Documentation/docs/source/test_files/SupportScriptFileSet.zip>`_

.. button-link:: https://github.com/BYU-Hydroinformatics/gwdm/blob/ReadtheDocs-Documentation/docs/source/test_files/SupportScriptFileSet.zip
    :color: secondary
    :expand:


.. line-block::

**Elevation Generator** 
-------------------------- 

.. container:: twocol1

     .. container:: leftside
   
            .. image:: images_scripts/mountain_elevation.png 
               
                
     .. container:: rightside
     
            This tool can be used to retrieve elevations for wells that are missing ground surface elevations. These ground surface elevations are used for calculating Water Table Elevation (WTE) and are included as well metadata in             the app. It samples a global, 30-meter DEM for each well location, providing a reasonable estimate for each missing GSE. Please note that its accuracy is limited and that field-measured GSE measurements are preferable. A             file with well locations (lat/long coordinates) is required as input and a file with GSE's generated for each well will be ouptut.

            To use this tool, you will need to register your Google account with Google Earth Engine to be able to utilize this service. You can do this at: https://signup.earthengine.google.com/#!/                                  
            To practice using this script, download and open the attached set of files (top of the page) and locate the ut_2015-2020_wells csv file.

            .. raw:: html

                <a href="https://colab.research.google.com/gist/mdstev1/72f338dbb9f4fbaeb875bd8f6b20cb7b/elevation_generator_using_google_ee.ipynb" target="_blank">
                    <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
 
                </a>


.. line-block::

**Aquifer Assignment Tool**
--------------------------   

.. container:: twocol2

     .. container:: leftside
   
            .. image:: images_scripts/aquifer_assignment.png
         
     .. container:: rightside
    
            This tool can be used for assigning an aquifer name and ID to each well. This requires an aquifers file with aquifer IDs and names assigned to each polygon and a wells file with lat/long locations for each well. Aquifers             can also be assigned to a separate time series file with well IDs that correspond to the well IDs in the wells file.
            To practice using this script, download and open the attached set of files and locate the UtahMajorAquifers json file and the Utah wells and TS (time series) csv files.
            
            .. raw:: html

                         <a href="https://colab.research.google.com/gist/mdstev1/3670653eafe6cbb1424c17846273b2b5/aquifer-assignment-tool.ipynb" target="_blank">
                             <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
                         </a>
.. line-block::

.. container:: twocol2

     .. container:: leftside
   
            
         
     .. container:: rightside
    
 
.. line-block::

**File Formatter**
------------------ 
.. container:: twocol3

       .. container:: leftside
    
            .. image:: images_scripts/file_format.png
         
       .. container:: rightside
       
            This tool is meant for cleaning and restructuring data files for import into the GWDM app. It accepts a wells file, time series file, and an aquifers file as inputs - each of which are optional, depending on your needs.             Options include:

                       * dropping unnecessary data
                       * reformatting data types
                       * accepting different date formats (which Excel sometimes corrupts)
                       * calculating water table elevation (WTE) from depth to groundwater measurements
                       
            To practice using this script, download and open the attached set of files and locate the UtahMajorAquifers geojson file and the ut_2015-2020_wells and ut_2015-2020_TS csv files.

            .. raw:: html

                         <a href="https://colab.research.google.com/gist/mdstev1/ed7fa793b3e09501ddba9b90df015e74/file_formatter.ipynb" target="_blank">
                             <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
                         </a>




.. line-block::

**NWIS File Retriever**
-----------------------  

.. container:: twocol4

     .. container:: leftside
   
            .. image:: images_scripts/usgs_logo.png
   
     .. container:: rightside
   
            This tool is meant for retrieving groundwater data files from the USGS National Water Information System (NWIS) data repository. The data from NWIS is only available for areas maintained by USGS. This tool:

                     * queries the NWIS database for wells and time series measurements that meet the user-specified time and place parameters
                     * assigns aquifers to each well
                     * drops wells that fall outside the aquifer boundary

            The tool requires an aquifers file as input and produces a formatted wells file and time series file (ready for import into the GWDM app).
            To practice using this tool, download and open the attached set of files and locate the UtahMajorAquifers geojson file.

            .. raw:: html

                         <a href="colab.research.google.com/gist/mdstev1/8086be08d3c7c753dad2ada31aafb85f/nwis-file-retriever.ipynb" target="_blank">
                             <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
                         </a>


            
