.. raw:: html
   :file: translate.html
   
**Installing the GWDM Application**
=====================================
For this instruction, Mac OS was used.

**Step 1: Install Tethys**
----------------------
Follow the tethys installation steps (`link here <https://docs.tethysplatform.org/en/stable/installation.html>`_) and install the Tethys Platform on your computer. Before doing so, be sure to view the warning listed below.

         .. warning::
             As of April 1, 2021, the initial step creates an error when conda create -n tethys -c tethysplatform -c conda-forge tethys-platform
             understand to avoid negative consequences.

              .. code-block:: bash

                   conda create -n tethys -c tethysplatform -c conda-forge tethys-platform

              Instead, install a development build of the Tethys Platform by executing

               .. code-block:: bash

                    conda create -n tethys -c tethysplatform/label/dev -c tethysplatform -c conda-forge tethys-platform
   
   
After the installation is complete, go to http://127.0.0.1:8000/ and make sure the following page is displayed.
 
 .. image:: source/images_install/tethys_landing.png
                  
**Step 2: Clone/Copy the GWDM Appliclation**
------------------------------------------

.. warning::
      If the Tethys server is running from the previous step, make sure to quit the serve with CONTROL-C before proceeding to the next step.
1. Create a directory (folder) in the home directly and name it (e.g. "tethys_dev"). In this directory, GWDM app will be cloned from the following link:                                https://github.com/BYUHydroinformatics/gwdm
2. On the right side of the repository, click on ``Code`` green box and then click on the button to copy the URL

3. Bring up a terminal windown and go to the directory just created by executing the following command.
    
         .. code-block:: bash

             cd tethys_dev
             
   ``tethys_dev`` should be modified if the directly is named differently.
             
4. The GDWM app will be cloned here. To clone the app, type the following:
 
          .. code-block:: bash

              git clone URL
          
   Where URL is the URL that you copied to the clipboard.
   In other words, type ``git clone`` then paste the URL from the clipboard. When you are done, it should look like this:
      
          .. code-block:: python
          
            git clone https://github.com/BYU-Hydroinformatics/gwdm.git
     
5. To complete the installation, we need to install the app we just cloned.
   First, we need to be in the Tethys virtual environment. In the Command Line, type:
      
        .. code-block:: bash

            conda activate tethys
            
   Next, make sure you are at the top level of the new directory you just created (e.g. tethys_dev). There should a new directory/folder called ``gwdm`` and the folder should contain              ``setup.py``.  Go to the ``gwdm`` directly by executing:
          
        .. code-block:: bash

             cd tethys_dev/gwdm
             
   Finally, this command is used to install the app on your portal
         
             .. code-block:: bash

                   tethys install
                   
   To make sure that the app is installed on your local Tethys Platform, launch the Tethys portal by typing on the Command Line
      
              .. code-block:: bash

                                    tethys manage start
                                    
   Then, go to http://127.0.0.1:8000/apps/ and the app should be displayed.
       
       .. note::
            The initial admin login ID and password is:
            Username: admin
            Password: pass
      
    .. image:: source/images_install/gwdm_app.png
          

**Step 3: Set Up Docker Containers**
------------------------------------
1. Create a new directory/folder in your home directory and name it ``Thredds``.
   Make the Thredds directory public by typin in the Command Line:

            .. code-block:: bash

                        sudo chmod -R 777 Thredds
                        
2. Next, install Docker from https://docs.docker.com/engine/install/ . Docker will be installed as an app on Mac. In the Command Line, type:
 
              .. code-block:: bash

                                    tethys docker init
                                    
   This will initiate downloading necessary elements and may take anywhere from a few minutes to hours depending on the internet connection. After the docker initialize, the Command Line will      ask for several settings. For most of the cases, simply accept the defaults by hitting ``Enter``.
   
   .. note::
         1. For password, put pass to keep them simple. If a different password is selected, that needs to be remembered as this password will be required in leter steps.

         2. For the Thredds container, it will ask “Bind the THREDDS data directory to the host?” To which you will respond “Y” for yes.
            The next option will ask you to specify the location. Respond with the file path to the Thredds directory that you created earlier
    
   
   .. image:: source/images_install/respond_enter.png
**OPTIONAL: Set Up Portainer.io**
---------------------------------
Portainer gives a detail status and health check of the docker containers. In the Command Line, type:

      .. code-block:: bash
            docker volume create portainer_data

      .. code-block:: bash
            docker run -d  -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
            
Go to localhost:9000 to set up the userID and the password. On the next page, select "Docker" and complete the setting.

.. image:: source/images_install/portainer_setup.png

After the installation, Portainer should show up on Docker. Follow the steps below and make sure all the containers are healthy and running (you may have to start the new tethys containers with the "Start" button).

.. image:: source/images_install/pass_thredds.png


**Step 4: Download PGAdmin 4 for Database Management**
-----------------------------------------------------
Download PGAdmin (https://www.pgadmin.org/). Download the macOS version (or whatever operating system you are using).

Open the application and add a new server

.. image:: source/images_install/pgAdmin_server.png

Name it as you desire (e.g. "postgis_thethys_docker"). Click the "Connection" tab and enter the following setting

.. image:: source/images_install/pgAdmin_setting.png
.. image:: source/images_install/pgAdmin_after_setting.png

**Step 5: Tethys Settings**
---------------------------
Now in the Command Line, run:

         .. code-block:: bash

               tethys syncstores gwdm
               
  
and

    .. code-block:: bash

                  tethys manage start
      
Go to the Tethys homepage (http://127.0.0.1:8000/apps/) and click the app icon. You should land on the page titled "Change Tethys App."

1. Click the **plus mark** under **PERSISTENT STORE DATABASE SETTINGS**.

.. image:: source/images_install/persistent.png

On the next page, set up the setting to:

   .. note::
         - Name: Arbitrary Name (e.g. Postgresql)
         - Engine: Postgresql   
         - Port: 5435     
         - Username: postgres     
         
.. image:: source/images_install/persistent_setting.png

Now, save the settings.

2. Add a Spatial Dataset Service (for geoserver) and select it in the app settings

  .. note::
         - Name: Arbitrary Name (e.g. geoserver)
         - Engine: Geoserver
         - Endpoint: http://127.0.0.1:8081/geoserver/
         - Username: admin
         - password: geoserver

   .. image:: source/images_install/spatial.png
   .. image:: source/images_install/geoserver.png

3. Add another Spatial Dataset Service (for thredds) and select it in the app settings

   .. note:: 
      - Name: Arbitrary Name (e.g. Thredds)
      - Engine: Thredds
      - Endpoint: http://127.0.0.1:8383/thredds/
      - Username: admin
      - password: pass
   
.. image:: source/images_install/thredds_app_setting.png

4. Make a directory in your Thredds directory in **thredds/public/testdata** and call it **“groundwater”** .
   Add the file path to this new groundwater directory to the thredds file path in the app settings

    .. code-block:: bash

                         tethys syncstores gwdm


   Open up Pgadmin4 again to check that the database is initialized.
   Under databases, **“gwdm_gwdb”** should now show up
   Within gwdm_gwdb, if you select schemas>public>Tables the different parameters should be visible (aquifer, measurement, well, etc.)

   .. image:: source/images_install/pgadmin.png
   

**Step 6: Edit Thredds Files**
------------------------------
1. Go into thredds directory and open “Catalog.xml” file with an editor (Pycharm, Notepad++, etc.)

   - Uncomment the wms, wcs, and ncss service tags within the service section
   - In the “datasetScan” tag, change the name attribute from ``Test all files in a directory`` to ``All Datasets``
   - In the “Filter” section towards the bottom of the file:
   
Remove one of the “include” tags and change the other one to say ``<include wildcard=”*”/>``
   - Delete the “catalogref” tag at the very bottom
If you need help, the screenshot below shows what it should look like.

.. image:: source/images_install/catalog_xml.png

2. Open the “threddsConfig.xml” file

   - Uncomment the CORS tag and enable it to “true”
   
.. image:: source/images_install/thredds_edit2.png

   - Uncomment the WMS section and set “allow” and “allowRemote” to true
   - Also, add in this line of code:

.. code-block:: bash

     <paletteLocationDir>/WEB-INF/palettes</paletteLocationDir>
  
  
  
.. image:: source/images_install/thredds_edit3.png
                    
**Step 7: Set Up Geoserver**
----------------------------

1. Open Geoserver browser and log in (localhost:8081/geoserver)

**Add a new workspace:**

Go to “Workspaces” tab > “Add New Workspace” link
Name it “gwdm” (Namespace can be anything)

**Add a new store:**

Stores tab > “Add New Store” link > “Postgis” link
Select gwdm workspace from dropdown and set

.. note::
   - Name: postgis
   - Host: 172.17.0.1
   - Port: 5435
   - Database: gwdm_gwdb
   - Schema: public
   - User: postgres
   - Password: pass

   - Save it
   
>Publish the Layers

Go to “Layers” tab > “Add a new resource” link > “gwdm:postgis” from dropdown

   - Click “Publish” for the region layer
   - Under the “Bounding Boxes” section, click “Compute from data” and “compute from native bounds”
   - Save it
   - Repeat the process for the aquifer and well layers
   
.. admonition:: Success
      
      Now you can add data and begin using the app.