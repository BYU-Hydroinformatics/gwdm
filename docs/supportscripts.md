
# **Data Preparation Scripts**

These scripts can aid in the data preparation process required prior to
using the GWDM tool. They have all been created in a cloud-based
environment called Google Colaboratory, or Colab for short. Colab is
built on Jupyter Notebook, which allows users to write, execute, and
visualize Python code quickly and easily.

These notebooks have been shared as GitHub Gists. A gist allows the
notebook to be opened, run, and modified by an individual user without
affecting the experience of another user.

There is a tool for retrieving elevations at wells that are missing
ground surface elevation measurements, a tool for assigning aquifer IDs
and names to wells depending on location, a tool for formatting wells
and time series files, a tool for retrieving wells and time series files
from the USGS NWIS database (U.S. only).

An example set of files has been provided; however, you are welcome to
use your own files if you would prefer.

`SupportScriptFileSet.zip </test_files/SupportScriptFileSet.zip>`{.interpreted-text
role="download"}

## **Elevation Generator**

This tool can be used to retrieve elevations for wells that are missing
ground surface elevations. These ground surface elevations are used for
calculating Water Table Elevation (WTE) and are included as well
metadata in the app. It samples a global, 30-meter DEM for each well
location, providing a reasonable estimate for each missing GSE. Please
note that its accuracy is limited and that field-measured GSE
measurements are preferable. A file with well locations (lat/long
coordinates) is required as input and a file with GSEs generated for
each well will be output. To use this tool, you will need to register
your Google account with Google Earth Engine to be able to utilize this
service. You can do this at: <https://signup.earthengine.google.com/#!/>
To practice using this script, download and open the attached set of
files (top of the page) and locate the ut_2015-2020_wells csv file.

<a href="https://colab.research.google.com/github/BYU-Hydroinformatics/gwdm-notebooks/blob/main/elevation_generator_using_google_ee.ipynb" target="_blank">
<img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
</a>

## **Aquifer Assignment Tool**

This tool can be used for assigning an aquifer name and ID to each well.
This requires an aquifers file with aquifer IDs and names assigned to
each polygon and a wells file with lat/long locations for each well.
Aquifers can also be assigned to a separate time series file with well
IDs that correspond to the well IDs in the wells file. To practice using
this script, download and open the attached set of files and locate the
UtahMajorAquifers json file and the Utah wells and TS (time series) csv
files.

<a href="https://colab.research.google.com/github/BYU-Hydroinformatics/gwdm-notebooks/blob/main/aquifer_assignment_tool.ipynb" target="_blank">
<img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
</a>

## **File Formatter**

This tool is meant for cleaning and restructuring data files for import
into the GWDM app. It accepts a wells file, time series file, and an
aquifers file as inputs- each of which are optional, depending on your
needs. Options include:

> -   Dropping unnecessary data
> -   Reformatting data types
> -   Accepting different date formats (which Excel sometimes corrupts)
> -   Calculating water table elevation (WTE) from depth to groundwater
>     measurements

To practice using this script, download and open the attached set of
files and locate the UtahMajorAquifers geojson file and the
ut_2015-2020_wells and ut_2015-2020_TS csv files.

<a href="https://colab.research.google.com/github/BYU-Hydroinformatics/gwdm-notebooks/blob/main/file_formatter.ipynb" target="_blank">
<img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
 </a>

## **NWIS File Retriever**

This tool is meant for retrieving groundwater data files from the USGS
National Water Information System (NWIS) data repository. The data from
NWIS is only available for areas maintained by USGS. This tool:

> -   Queries the NWIS database for wells and time series measurements
>     that meet the user-specified time and place parameters
> -   Assigns aquifers to each well
> -   Drops wells that fall outside the aquifer boundary

The tool requires an aquifers file as input and produces a formatted
wells file and time series file (ready for import into the GWDM app). To
practice using this tool, download and open the attached set of files
and locate the UtahMajorAquifers geojson file.

<a href="https://colab.research.google.com/github/BYU-Hydroinformatics/gwdm-notebooks/blob/main/nwis_file_retriever.ipynb" target="_blank">
<img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
</a>
