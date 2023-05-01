**DATA PREPARATION SCRIPTS**
============================

**Introduction**
------------------

These scripts can aid in the data preparation process required prior to using the GWDM tool. They have all been created in a cloud-based environment called Google Colaboratory, or Colab for short. Colab is built on Jupyter Notebook, which allows users to write, execute, and visualize Python code quickly and easily.

These notebooks have been shared as Github Gists. A gist allows the notebook to be opened, run, and modified by an individual user without affecting the experience of another user.

There is a tool for retrieving elevations at wells that are missing ground surface elevation measurements, a tool for assigning aquifer IDs and names to wells depending on location, a tool for formatting wells and time series files, a tool for retrieving wells and time series files from the USGS NWIS database (U.S. only), and a tool for creating "representative" wells based on a grid.

An example set of files has been provided; however, you are welcome to use your own files if you would prefer.
 
`Download API Test Files <https://github.com/BYU-Hydroinformatics/gwdm/blob/ReadtheDocs-Documentation/docs/source/test_files/SupportScriptFileSet.zip>`_

**Elevation Generator** . image:: 
This tool can be used to retrieve elevations for wells that are missing ground surface elevations. These ground surface elevations are used for calculating Water Table Elevation (WTE) and are included as well metadata in the app. It samples a global, 30-meter DEM for each well location, providing a reasonable estimate for each missing GSE. Please note that its accuracy is limited and that field-measured GSE measurements are preferable. A file with well locations (lat/long coordinates) is required as input and a file with GSE's generated for each well will be ouptut.

To use this tool, you will need to register your Google account with Google Earth Engine to be able to utilize this service. You can do this at: https://signup.earthengine.google.com/#!/

To practice using this script, download and open the attached set of files (top of the page) and locate the ut_2015-2020_wells csv file.
