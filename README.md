# SRLUI
This code is part of a Columbia University research project seeking to understand how student goal setting and self-evaluation affect course progress in the edX online learning platform. Our custom study modules are built with HTML and Javascript interacting with a Node.js/MongoDB enabled server hosted on Heroku. 

## How to build the study modules on EdX
All the code for building the Weekly Reflection module is in the folder html_modules. First, create a Weekly Reflection module on the edX site, then add the following: 

1.  Course Progress
  
  - Add courseProgress2.0.html to the edX unit in the Raw HTML section.
  - Upload courseProgress.js to the "Files and Uploads" section. 
  
2. Study Planning

 - Add studyPlanning2.0.html to the edX unit in the Raw HTML section.
  - Upload studyPlanning.js to the "Files and Uploads" section. 
  - This code also uses the MDTimePicker library (https://github.com/dmuy/MDTimePicker). Download mdtimepicker.js and mdtimepicker.css and upload them to the "Files and Uploads" section.
  
3. Study Tips

  - Add studytips.html to the edX unit in the Raw HTML section. 
  - The relevant image files and paths should be stored in SRLUICourseInfo.js, more on that below. 
  
 4. Sensor
 
 -  Upload the sensor.js code to "Files and Uploads". 
  - Add sensor.html to the Raw HTML section of every edX module you want to track user activity (videos watched and questions answered)

 5. Course Info 
 
 - Finally, you need to create a javascript file called SRLUICourseInfo.js and upload it to the "Files and Uploads" section. 
 - A sample template is in the static_files folder. 

