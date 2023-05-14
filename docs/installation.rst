.. raw:: html
   :file: translate.html
   
**Installing the GWDM Application**
=====================================
For this instruction, Mac OS was used.

**Step1: Install Tethys**
----------------------
Follow the tethys installation steps (`link here <https://docs.tethysplatform.org/en/stable/installation.html>`_) and install the Tethys Platform on your computer. Before doing so, be sure to view the warning listed below.

.. warning::
    As of April 1, 2021, the initial step creates an error when conda create -n tethys -c tethysplatform -c conda-forge tethys-platform
    understand to avoid negative consequences.
    
     .. code-block:: python
     
          conda create -n tethys -c tethysplatform -c conda-forge tethys-platform

     Instead, install a development build of the Tethys Platform by executing
     
      .. code-block:: python
      
             conda create -n tethys -c tethysplatform/label/dev -c tethysplatform -c conda-forge tethys-platform
   
   
After the installation is complete, go to http://127.0.0.1:8000/ and make sure the following page is displayed.
 
 .. image:: source/images_install/tethys_landing.png
                  
**Step2: Clone/Copy the GWDM Appliclation**
------------------------------------------

.. warning::
      If the Tethys server is running from the previous step, make sure to quit the serve with CONTROL-C before proceeding to the next step.

    1. Create a directory (folder) in the home directly and name it (e.g. "tethys_dev"). In this directory, GWDM app will be cloned from the following link:                                https://github.com/BYUHydroinformatics/gwdm
    2. On the right side of the repository, click on ``Code`` green box and then click on the button to copy the URL

    3. Bring up a terminal windown and go to the directory just created by executing the following command.
    
      .. code-block:: python
      
             cd tethys_dev
             
     ``tethys_dev`` should be modified if the directly is named differently.
             
    4. The GDWM app will be cloned here. To clone the app, type the following:
      .. code-block:: python
      
          git clone URL
          
      Where URL is the URL that you copied to the clipboard.
      In other words, type ``git clone`` then paste the URL from the clipboard. When you are done, it should look like this:
      
          .. code-block:: python
          
            git clone https://github.com/BYU-Hydroinformatics/gwdm.git
     
    5. To complete the installation, we need to install the app we just cloned.
        First, we need to be in the Tethys virtual environment. In the Command Line, type:
      
          .. code-block:: python
          
            conda activate tethys
        Next, make sure you are at the top level of the new directory you just created (e.g. tethys_dev). There should a new directory/folder called ``gwdm`` and the folder should contain                    ``setup.py``.
        Go to the ``gwdm`` directly by executing:
        
        
          .. code-block:: python
          
             cd tethys_dev/gwdm
             
         Finally, this command is used to install the app on your portal
         
          .. code-block:: python
          
             tethys install
             
          

**Step3: Set Up Docker Containers**
------------------------------------
1. Create a new directory/folder in your home directory and name it Thredds.
Make the Thredds directory public by typin in the Command Line:


**OPTIONAL: Set Up Portainer.io**
---------------------------------
Portainer gives a detail status and health check of the docker containers. In the Command Line, type:


**Step4: Download PGAdmin 4 for Database Management**
-----------------------------------------------------
Download PGAdmin (https://www.pgadmin.org/). Download the macOS version (or whatever operating system you are using).

Open the application and add a new server

**Step5: Tethys Settings**
---------------------------
Now in the Command Line, run:

**Step 6: Edit Thredds Files**
------------------------------


**Step 7: Set Up Geoserver**
---------------------------
