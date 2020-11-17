# Welcome
This repository contains is a template for online experiments that integrates jsPysch, Google Sheets, and SONA. The goal is to make it a breeze to upload your experiments to the internet, gather data, and give out credits. Have at it!

Pictures to improve the tutorial coming soon!

# Files

## jspych

This folder contains the most recent version of jsPsych for use in your experiments. There is no need to touch this unless you need to add some custom plugins or need to update to a different version.

## jsSheet

This folder contains the files necessary to get your experiment deployed with Google Sheets. It's important to note that changes to **Code.gs** and **index.html** are not immediately reflected in your app. They have to be deployed directly to your Google Sheets App.

- **Code.gs** - Contains code that handles deploying your experiment, creating IDs, uploading data, and ensuring data is organized.  It is written in Google Script which is very similar to JavaScript.
- **index.html** - Initial file served to the user. This file determines what other files are served to the user. 

## resources

This folder is meant to contain all multimedia files (or any "bulk" file) that is required for the experiment. It's use is purely organizational, but it can help to remove a lot of clutter files from your code.

## Experiment Files

All files and folders used in your experiment that don't fit into another category should be held in the root directory. It currently holds **ExampleExperiment.js** and **format.css**, but you may need to expand the number here based on the needs of your work.

- **ExampleExperiment.js** - The meat of your experiment. This file should hold the bulk of the code for your experiment. The default content here is near the minimum code needed to run an experiment, save it's data, and then redirect to SONA to grant credit. Add trials to it until you have the experiment that you want!
- **format.css** - css file that can be used to modify the appearance of the experiment. It's purpose is entirely aesthetic, but it may be necessary to your experiment if you need specific visual features.

## ME!

The **README.md** file is me! I am a special file that will be the first thing that anyone going to your repository reads. Be sure to update me when you make a copy!

# Deployment Tutorial
Deploying this code is relatively easy, but there are still a few steps you have to follow to get things going.

## Repository
This repository is known as a *template*. This means you can make an entirely new repository and start with the files and organization you see here. You should start by making your own repository based off this template.

 1. Click "Use this template".
 2. Choose the owner, name, and visibility of the template.
 3. Create the repository.

## GitHub Pages
We use Github to host our files. This let's our Google Apps Scripts see and use our files. We need to enable this functionality before we can proceed any further.

1. Click "Settings".
2. Scroll down until you see **GitHub Pages**.
3. Select a Source (usually *master*).
4. Save.

## Update Code
Every repository has it's own url and yours is no different! We need to update this in your code so that the Google Scripts App knows where to look for your files.
1. Navigate to jsSheet/index.html.
2. Fill in "https://\<USER\>.github.io/\<REPO\>/" where \<USER\> is your GitHub username and \<REPO\> is the name of your repository. This also be found near the top of the Github Pages section of your settings.
3. Save your changes and push them to your repository.

## Deploy to Google Apps
In order to deploy our code to the internet and connect it to our database (Google Sheets), we need to put some of it into a Google App.
1. Go to your Google Drive
2. Create a new Google Sheet
3. Go to Tools > Script Editor
4. Create a new HTML file by doing File > New > HTML File
5. Name it index
Now, we have two files listed in our App: **Code.gs** and **index.html**. We need to copy the contents of your **Code.gs** and **index.html** into their online versions.
6. Copy and Save from **jsSheet/index.html** to **index.html** in your Google App.
7. Copy and Save from **jsSheet/Code.gs** to **Code.gs** in your Google App.
8. Click Publish > Deploy as Web App
9. Change the "Who has access to the app:" section to "Anyone, even anonymous"
10. Click Deploy  

Assuming everything has been done correctly, you should be able to access your experiment using the link provided after deploying your experiment.

