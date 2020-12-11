# SRLUI
This code is part of a Columbia University research project seeking to understand how student goal setting and self-evaluation affect course progress in the edX online learning platform. Our custom study modules are built with HTML and Javascript interacting with a Node.js/MongoDB enabled server hosted on Heroku. 

## How to deploy the Node.js Application to Heroku 

We chose to use Heroku to host the SRLUI application. In order to deploy the app, make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/vshaw/srlui.git # or clone your own fork
$ cd srlui
$ npm install
```
Then deploy to Heroku with 

```
$ heroku create
$ git push heroku master
```

You can also follow these instructions for more detailed walkthrough on how to get the app up and running on Heroku.
[Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
 

## How to build the study modules on EdX
All the code for building the Weekly Reflection module is in the folder edX_modules. 

1. **Javascript Files **
  - Open the js folder in edX_modules. In the Files and Uploads section of the edX Studio page for the course, add courseProgress.js, sensor.js, studyPlanning.js, and studyTips.js
  - Add the following widget library files [canvasjs.min](https://canvasjs.com/download-html5-charting-graphing-library/?f=chart) and (mdtimepicker.js and mdtimepicker.css)[https://github.com/dmuy/MDTimePicker]
  - Edit the SRLUICourseInfo.js page with specific course information. Then add it to Files and Uploads as well. 
  - Add the Study Tip image files to Files and Uploads. 

First, create a Weekly Reflection module on the edX site, then add the following: 

2.  **HTML Files**
  - You will find all the files you need to build a Weekly Reflection Module on in EdX Studio. 
  - Add courseProgress2.0.html, studyPlanning2.0.html, and studyTips.html to the edX unit in the Raw HTML section. **Make sure to edit the weeklyIdentifier variable first to correspond with the correct edX week you are building for.**
  - Add sensor.html to the Raw HTML section of every edX module you want to track user activity (videos watched and questions answered)


