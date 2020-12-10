    //////////////////////////////////////////////
    //               Logging User Data           //
    //////////////////////////////////////////////

    var userId;
    var courseId;
    var group; 
    var weekNumber;
    var newExperience = false;  

    //Goal: log all data that is sent in xhr post requests to console before they are sent
    //Code snippet inspired by: http://stackoverflow.com/questions/25335648/how-to-intercept-all-ajax-requests-made-by-different-js-libraries
    var vidlog;
    var finishedContentIds = []; 
    var plays = [];
    var pauses = [];
    var durVid;
    var vidSum = [];

    var SERVER_URL = "https://columbiax-srlui.herokuapp.com";

    // Get user info on window load. 
    window.onload = function initSensor() {
        getUserInfo();
    };

    // Get user info to fill global variables need for api requests
    function getUserInfo()
    {

        var url = window.location.href;
        var split = url.split("/");
        courseId = split[4].split(":")[1];    

        if (courseId.includes("type")){
            courseId = courseId.split("+type")[0]; 
            newExperience = true;
        }

        weekNumber = getWeekNumber();

        waitForElement();
    }

    function waitForElement(){

        if(typeof(analytics) != undefined && typeof(analytics.user) === typeof(Function)) {
            
            userId = analytics.user()._getId();  

            if (userId % 2 == 0)
            {
                group = "Control";
            }
            else
            {
                group = "Treatment"; 
            }

            listen();

        }
        else{
            setTimeout(waitForElement, 250);
        }
    }


    // Log events that occur. We store events per week, so a 'type' parameter indicates which event we are updating.
    function logVideoEvent(contentId) {
        var email = analytics._user._getTraits().email; 

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/events",
            "method": "POST",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "email": email,
                "group": group,
                "courseId": courseId,
                "event": "Watched video", 
                "weekNumber": weekNumber,
                "contentId": contentId
            }
        }; 

        var editSettings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/activity/edit",
            "method": "POST",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "email": email,
                "group": group,
                "courseId": courseId,
                "event": "Watched video", 
                "weekNumber": weekNumber,
                "contentId": contentId
            }
        }; 
        
        $.ajax(settings).done(function (response) {
        }); 

        $.ajax(editSettings).done(function (response) {
        }); 
    }

    function logQuestionEvent(contentId, numQuestions) {
        var email = analytics._user._getTraits().email; 

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/events",
            "method": "POST",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "email": email,
                "group": group,
                "courseId": courseId,
                "event": "Answered questions", 
                "contentId": contentId,
                "weekNumber": weekNumber,
                "numQuestions": numQuestions
            }
        }; 


        var editSettings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/activity/edit",
            "method": "POST",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "email": email,
                "group": group,
                "courseId": courseId,
                "event": "Answered questions", 
                "contentId": contentId,
                "weekNumber": weekNumber,
                "numQuestions": numQuestions
            }
        }; 
        
        $.ajax(settings).done(function (response) {}); 

        $.ajax(editSettings).done(function (response) {}); 
    }

    //////////////////////////////////////////////
    //               HELPER FUNCTIONS           //
    //////////////////////////////////////////////    


    // Get the week number based on the current date and the start date of each week recorded in SRLUICourseInfo.js
    function getWeekNumber()
    {
        weekNumber = 0; 

        var currentDate = new Date();

        for(var week in DATES) 
        {
            var tempDate = new Date(DATES[week]);

            if (currentDate > tempDate )
            {
                weekNumber = parseInt(week) + 1; 
            }
        }

        if (weekNumber == 0)
        {
            weekNumber = 1; // let's not be weird
        }

        if (weekNumber == undefined) 
        {
            weekNumber = week;
        }

        return weekNumber; 
    }

    //////////////////////////////////////////////
    //               EVENT LISTENER             //
    //////////////////////////////////////////////    

    // Function takes a string to be sent via xhr and turns it back into an object to make it easier
    // to read on the console
    function splitParamString(input) {

        if(input == null){
            return {};
        }

        var params = input.split("&");
        var paramObject = {};
        params.forEach(function(element) {
            var keyValue = element.split("=");
            paramObject[keyValue[0]]=keyValue[1];
        });

        return paramObject;
    }

    // Sensor listener code 
    function listen() {

        // This will break studio if it runs inside of it, so this IF statement make it so the XHR intercept only fires if not in studio
        if (intercepted == undefined)
        {
            var intercepted = false
        }

        if (document.URL.includes('studio') === false && intercepted == false) 
        {  
            intercepted = true;
            var origSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.send = function(data) 
            {
                vidlog = splitParamString(data);
                vidlog.time = new Date();
                var listening = true;

                if (listening && vidlog.event_type === "play_video") 
                {
                    listening = false;
                    setTimeout(function () {
                        listening = true
                    }, 2000);

                    plays.push(vidlog.time);

                    addUp();
                } 
                else if (listening && vidlog.event_type === "pause_video") 
                {
                    listening = false;
                    setTimeout(function () {
                        listening = true
                    }, 2000);

                    pauses.push(vidlog.time);

                    addUp();
                } 
                else if (vidlog.event_type === "problem_check") 
                {
                    // We need to look up how many questions are in each problem set, so we'll take the problem ID and match it to the html elements within the problem. 

                    // Get the problem ID
                    var problemSetId = vidlog.event.split("_")[1];

                    if (!finishedContentIds.includes(problemSetId))
                    {
                        // Get the array of problem set HTML elements
                        var problemSets = document.getElementsByClassName("problem");
                        
                        var numProblems = 0;

                        var problemNames = []; 

                        var problemSetIndex = 0; 

                        // Loop through problem sets and look for child element with the problem id. Then we can count the number of problems that were answered. 
                        for (var i = 0; i < problemSets.length; i++)
                        {
                            var problems = problemSets[i].getElementsByClassName("wrapper-problem-response");

                            // We only need to look at the first problem, since all problems share the same id
                            var problemHTML = problems[0].outerHTML;

                            problemSetIndex = i; 

                            if (problemHTML.includes(problemSetId))
                            {
                                for (var j = 0; j < problems.length; j++)
                                {
                                    var name = problems[j].innerText; 
                                    var nameArray = name.split("?");

                                    problemNames.push(nameArray[0] + "?");
                                }

                                numProblems = problems.length; 
                                break;
                            }    
                        }

                        var elements = document.getElementsByClassName("hd hd-2"); 

                        var title = ""; 

                        if (elements.length > 0)
                        {
                            title = elements[0].innerText+"_"+numProblems; 
                        } 

                        // Finally store the number of questions answered in the week's event record     
                        logQuestionEvent(title + "- "+ problemNames.join(), numProblems);

                        // Store problem ID so we won't store the same info if they retry the questions. 
                        // Note this is not sticky, so if they refresh the page and answer the questions again it'll be recorded.
                        finishedContentIds.push(problemSetId); 
                    }       
                }

                origSend.call(this,data);
            };
        }
    }

    // Takes the Pauses and Plays arrays and finds total duration between play and pause events
    function addUp() 
    {
        for (i=0; i<= pauses.length-1; i++) 
        {
            vidSum[i] = pauses[i] - plays[i];
        }

        durVid = vidSum.reduce(add, 0) / 1000;

        // Somewhat arbitrary amount in seconds to mark the video as "watched". 
        if (durVid >= 3) 
        {
            var vidId = vidlog.event.split("%")[5];

            if (!finishedContentIds.includes(vidId))
            {
                var elements = document.getElementsByClassName("hd hd-2"); 
                var videoTitle = ""; 

                if (elements.length > 0)
                {
                    videoTitle = elements[0].innerText; 
                }

                logVideoEvent(videoTitle);
                finishedContentIds.push(vidId)
            }
        }
    }

    // Returns the Sum of an Array
    function add(a, b) 
    {
        return a + b;
    }