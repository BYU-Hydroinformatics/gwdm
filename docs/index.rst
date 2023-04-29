.. raw:: html
   :file: translate.html
   
**INTRODUCTION**
=================
Water managers in Western Africa and around the world face the daunting task of managing freshwater resources in the face of increased demand from industry, agriculture, climate change, and population growth. As surface water resources become fully allocated, groundwater is increasingly targeted to make up surface water deficits, particularly during periods of drought. As a result, many of our aquifers are not being managed in a sustainable fashion, resulting in reduced water quality, land subsidence, increased pumping costs, and in some cases, the complete exhaustion of an aquifer and the loss of groundwater as a buffer during times of drought.

**Mapping Algorithm**
---------------------
Even when water managers have access to large data sets of historical groundwater level measurements, at any individual well these measurements often exhibit significant time gaps. Aggregating and synthesizing these well measurements to provide information that supports a holistic assessment of aquifer level sustainability can be a challenging task. In partnership with NASA SERVIR, we have developed a series of algorithms that use these existing well measurements combined with Earth Observation data to analyze changes in water tables and characterize aquifer storage over time. Our approach involves collecting data describing well locations and any historical water level measurements in an aquifer. To evaluate aquifer behavior, we need to impute missing data at each well location so that we have data at each time step for analysis. To impute these data, we use a machine learning approach, to train models to use Earth Observation data to impute (or estimate) missing measurements at each well. Using this approach, we generate a time series for each well and use these data to spatially interpolate the water table at each time step.

These interpolated water table maps can be used to evaluate the sustainability of the aquifer by looking at the changes to aquifer storage over time. We have shown that our approach can deal with gaps resulting from long periods with no measurements at wells, our machine learning algorithms build correlations between existing water level measurements and Earth observations such as water storage changes from the NASA Gravity Recovery and Climate Experiment (GRACE) mission, soil moisture from the Global Land Data Assimilation System (GLDAS), or the Palmer Drought Severity Index (PDSI). These machine learning methods have shown to be remarkably accurate for data imputation and extrapolation. The product of this process is a series of time-varying rasters that can be animated to allow water managers to visualize how the water levels are changing over time and where the aquifer is being stressed. The rasters can also be analyzed to assess the change in aquifer water volume or storage over time – a key indicator of aquifer health and sustainability.


**Tethys Application**
-----------------------
We have incorporated our groundwater level mapping algorithms in a simple, easy-to-use web application created using Tethys Platform, developed in our hydroinformatics laboratory. In addition to the water level mapping, the system provides a powerful online database of historical groundwater data where users can zoom in to areas of interest, select wells, and view the historical water level record and meta-data about each well.


**Regions, Aquifers, and Well Data**
------------------------------------
For any of the portals, you can access the app by clicking on the Groundwater Data Mapper icon. Once you are in the app, you will see the landing page:


**Controls**
-------------
On the left side of the map, you will see a set of controls :


**Selecting and displaying multiple wells**
---------
It may be helpful to compare wells within the same aquifer that may not necessarily fall under the same cluster groups. One would need to select which variable to compare before activating the Multi Well Select. To activate this command, simply click on the button which will then turn green and three more options will be added to the screen. Here is a picture of all the options that will be available once the Multiple Well Select is activate;

**Displaying Rasters**
---------------
Once you have created an interpolation layer and selected that layer from the control panel on the right, a new set of controls will appear. The figure below points out each of those controls and the following paragraph provides an explanation for each of them.

**Admin Control Panel**
-------------
There is also an admin control panel that is used to import and manage the data used by the app and to perform interpolations:


**Documentation and Tutorials**
--------------
The navigation bar at the top of this page can be used to explore a set of documentation and tutorials associated with the GWDM. The sections are as follows:

Data Preparation. This section describes how the data are organized in the GWDM and how to format your data before importing the data into the app.

Support Scripts. This section describes a set of Python scripts that can be used to process, format, and prepare your data. For example, one of the scripts can be used to generate ground surface elevations using global DEM data if your wells do not have elevation data.

Importing Data. Once your data are organized into properly formated input files, this section describes how to import the data into the app.

Mapping. This section describes the interpolation algorithms and shows to generate time-varying rasters of your groundwater data for display and animation.

Installation. This section describes how to intall the GWDM app in your own Tethys portal.

.. toctree::
    :maxdepth: 2
    :hidden:
    :caption: TABLE OF CONTENT

    self
    datapreparation
    support_scripts
    importing_data
    mapping
    installation

