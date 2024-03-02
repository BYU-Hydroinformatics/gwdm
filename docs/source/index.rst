.. raw:: html
   :file: translate.html
   
**Home**
=================
The Groundwater Data Mapper (GWDM) is a Tethys Platform web application and an associated set of Python scripts. The GWDM Tethys app can be used to host and visualize groundwater data in one or more regions. The groundwater data is a set of wells organized by aquifers. For each well, the user can upload a set of measurements (typically groundwater elevations) taken at different points in time. The wells are then displayed on a map in the web interface and the measurement time series can be visualized by clicking on the wells. This documentation describes how to format and organize groundwater data for use in the GWDM app and how to upload and manage the data. Furthermore, the tools include a mapping algorithm that uses a machine learning algorithm to impute gaps in the time series record for all of the wells in an aquifer and it then peforms a spatial interpolation of water levels at wells to generate a series of time-varying rasters illustrating how the water levels in the aquifer vary over time. These rasters can be animated in the app. Furthermore, by calculating the volume between subsequent rasters and multiplying by a storage coefficient, the algorithm also generates a time series of groundwater volume storage change over time. Thus the GWDM tools can be used to analyze the sustainability of a aquifer. 

These tools were originally developed via funding from the National Aeronautics and Space Administration: 80NSSC20K0155; United States Agency for International Development: Cooperative Agreement with SERVIR West Africa Hub. More details about this project can be found here: `https://hydroinf.groups.et.byu.net/servir-wa/ <https://hydroinf.groups.et.byu.net/servir-wa/>`_ 

.. toctree::
    :maxdepth: 2
    :caption: TABLE OF CONTENTS

    Home <self>
    overview
    datapreparation
    supportscripts
    importingdata
    mapping
    installation

