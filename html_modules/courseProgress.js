 var userId; 
    var courseId; 
    var weekNumber; 
    var weekId; 
    var devShowTreatment = false; 

    var SERVER_URL = "https://guarded-mesa-27479.herokuapp.com";


    //////////////////////////////////////////////
    //            PAGE LOAD FUNCTIONS           //
    //////////////////////////////////////////////

    // Callback to load external scripts
    function loadScript(url, callback)
    {
        // Adding the script tag to the head as suggested before
        var head = document.head;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    // Set user info global variables
    function getUserInfo()
    {
      var url = window.location.href;
      var split = url.split("/");
      courseId = split[4].split(":")[1];
      weekId = split[6];

      userId = analytics.user()._getId();

      weekNumber = getWeekNumber(); 

      getWeekPosts(); 
    }

    // Toggle between control/treatment displays
    function toggleGroupDisplay()
    {
        getUserInfo(); 
      
        // Only do any of this if the user is in the treatment group
        if (userId % 2 != 0 || devShowTreatment)
        {
            var saveGoalsButton = document.getElementById("saveGoalsButton");
            saveGoalsButton.disabled = true; 

            var goalsElement = document.getElementById("weekGoals");
            var goalsContainer = document.getElementById("goalsContainer"); 

            var weekNumber = getWeekNumber() - 1;

            var email = analytics._user._getTraits().email;

            goalsElement.style.display = "block"; 

            if (weekNumber > 0)
            {
                
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": SERVER_URL + "/api/goals2/weekByNum",
                    "method": "GET",
                    "headers": {
                        'x-access-token': accessToken
                    },
                    "data": {
                        "userId": userId,
                        'email': email,
                        "courseId": courseId,
                        "weekNumber": weekNumber
                    }
                };

                $.ajax(settings).done(function (response) {
                    var weekResult = response.data; 

                    if (weekResult != null)
                    {
                        document.getElementById("savedThree").style.display = "flex"; 

                        document.getElementById("savedVideos").innerHTML = weekResult.videoGoal; 
                        document.getElementById("savedQuizzes").innerHTML = weekResult.quizGoal; 
                        document.getElementById("savedAssignments").innerHTML = weekResult.assignmentGoal; 
                        document.getElementById("savedEstimatedTime").innerHTML = weekResult.estimatedTimeGoal; 

                        createSavedVideoTable(weekResult.content, weekResult.additionalGoal);

                    }
                    else
                    {
                        var textNode = createGoalTextNode("You didn't set any goals last week."); 
                        goalsContainer.appendChild(textNode);
                    }
                });
            }
            else
            {
                var textNode = createGoalTextNode("You didn't set any goals last week."); 
                goalsContainer.appendChild(textNode);             
            }

            getSavedRating(); 
        }

        loadScript("https://canvasjs.com/assets/script/canvasjs.min.js", generateLineChart);
    }

    //////////////////////////////////////////////
    //         GET ACTIVITY DATA                //
    //////////////////////////////////////////////

    // Get discussion activity data in order to update the week's record.
    // Discussion activity is stored in a separate database that is updated by a web scraper python script. 
    // The way this works is convoluted because the scraper is constantly inserting aggregated data (atm the only available format) to the db. So in order to get this week's data, we have to get the current amount and subtract the previous week's amount. 
    function getWeekPosts() {
        var email = analytics._user._getTraits().email; 

        // The activity database stores a different format of course ID so we need to convert ours. 
        // Ex: Convert ColumbiaX+CSMM.104x+3T2019 to CSMM104
        var shortCourseId = courseId.split("+")[1]; 
        shortCourseId = shortCourseId.substring(0, shortCourseId.length - 1);    
        var finalCourseId = shortCourseId.replace(".", "");  

        // Get the current date in Unix timestamp. 
        var currentDate = new Date(); 
        var currentDateTimestamp = currentDate.getTime() / 1000; 

        
        var start = getKeyByValue(courseDates, weekNumber);
        var startDate = new Date(start);
        var startDateTimestamp = (startDate.getTime() / 1000) - 300; // minius some margin
        var endDateTimestamp = startDateTimestamp + 86400*7 + 600; // get the timestamp one weeks later + some margin

        if (courseNumber == null)
        {
            courseNumber = ""; 
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/posts",
            "method": "GET",
            "headers": {
                'x-access-token': accessToken
            },
            "data": 
            {
                "email": email,
                "courseNumber": courseNumber,
                "startTime": startDateTimestamp,
                "endTime": endDateTimestamp
            }
        };


        $.ajax(settings).done(function (response) {
           var result = response.data;
           if (result != null)
           {
               var view1 = 0; 
               var posts1 = 0; 
               var view2 = 0; 
               var posts2 = 0;
               result.sort(sortByTimestamp);
               resultNum = result.length;

               var index = -1; 

               for (var i = 0; i < resultNum; i++) 
               {
                    if (result[i].Timestamp >= startDateTimestamp)
                    {
                        view1 = result[i].Views;
                        posts1 = result[i]['Aggregated post'];
                        index = i; 
                        break;
                    }
               }

               for (var k = resultNum - 1; k >= 0; k--) 
               {
                    if (result[k].Timestamp <= endDateTimestamp && k != index)
                    {
                        view2 = result[k].Views;
                        posts2 = result[k]['Aggregated post'];
                        break;
                    }
               }

               var views = view2 - view1;
               var posts = posts2 - posts1;

               if (view2 == 0)
               {
                    views = view1; 
               }

               if (posts2 == 0) 
               {
                    posts = posts1; 
               }

               logWeekPosts(views, posts);
           }
       });
    }

    // Save the discussion activity in this week's event record
    function logWeekPosts(views, posts)
    {
        var email = analytics._user._getTraits().email; 

        var group = "Control"; 

        if (userId % 2 != 0)
        {
            group = "Treatment"; 
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/events2",
            "method": "POST",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "email": email,
                "group": group,
                "courseId": courseId,
                "weekNumber": weekNumber,
                "weekId": weekId, 
                "event": "Posts", 
                "postsCreated": posts,
                "postsViewed": views,
                "contentId": "N/a"
            }
        }; 
        
        $.ajax(settings).done(function (response) {
        }); 
    }

    // Create the table of selected goals
    function createSavedVideoTable(selectedVideos, additionalGoal)
    {
        document.getElementById("savedAdditionalGoal").innerHTML = additionalGoal;
        document.getElementById("savedVideoTableDiv").innerHTML = "";

        if (selectedVideos != null)
        {
            var savedVideoTable = document.createElement('table');
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");

            var headRow = document.createElement("tr");

            ["Week", "Content", "Time (hh:mm:ss)"].forEach(function(el) {
                var th=document.createElement("th");
                th.style.textAlign = "center"; 
                th.appendChild(document.createTextNode(el));
                headRow.appendChild(th);
            });

            thead.appendChild(headRow); 
            savedVideoTable.appendChild(thead); 

            // Create the table rows
            for (var j=0; j < selectedVideos.length; j++)
            {
                var tr = document.createElement("tr");
                var contentArray = selectedVideos[j].split("_");


                var weekTd = document.createElement("td");
                weekTd.style.textAlign = "center"; 
                weekTd.appendChild(document.createTextNode(contentArray[0]));

                contentArray.splice(0, 1);

                var timeTd = document.createElement("td");
                timeTd.style.textAlign = "center"; 
                timeTd.appendChild(document.createTextNode(contentArray[contentArray.length - 1]));

                contentArray.splice(contentArray.length - 1, 1);

                var contentTd = document.createElement("td");
                contentTd.style.textAlign = "center"; 
                contentTd.appendChild(document.createTextNode(contentArray.join(' ')));

                tr.appendChild(weekTd); 
                tr.appendChild(timeTd); 
                tr.appendChild(contentTd); 

                tbody.appendChild(tr);
            }

            savedVideoTable.appendChild(tbody); 

            document.getElementById("savedVideoTableDiv").appendChild(savedVideoTable);
        }
    }

    // Get past week's numbers 
    var generateNumbers = function() {
        getUserInfo();

        var email = analytics._user._getTraits().email;

        var pastWeekNumber = weekNumber - 1; 

        var weekStartDate = new Date(getKeyByValue(courseDates, pastWeekNumber)); 
        var weekEndDate = new Date(getKeyByValue(courseDates, weekNumber));

        // Set date string for past week      
        var startString = convertDateToString(weekStartDate); 
        var endString = convertDateToString(weekEndDate);

        var dateString = "In the past week of the course (" + startString + " - " + endString + ") you have:";

        if (startString.includes("NaN") || endString.includes("NaN"))
        {
            dateString = "In the past week of the course you have:"
        } 

        document.getElementById("pastWeekHeader").innerHTML = dateString; 

        if (pastWeekNumber > 0)
        {

        // Send GET request for to get activity for specific user/course/week number. 
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/events2/week",
            "method": "GET",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "courseId": courseId, 
                "weekNumber": pastWeekNumber,
                "email": email
            }
        };

        $.ajax(settings).done(function (response) {

            var weekResult = response.data; 

            var videos = 0; 
            var questions = 0; 
            var views = 0; 
            var posts = 0; 

            if (weekResult != null && weekResult.length > 0)
            {
                for (var i = 0; i < weekResult.length; i++)
                {
                    if (weekResult[i].event.includes("video"))
                    {
                        videos++; 
                    }
                    else if (weekResult[i].event.includes("questions"))
                    {
                        questions += weekResult[i].numQuestions; 
                    }
                    else if (weekResult[i].event.includes("Posts"))
                    {
                        if (views != undefined && views != null)
                        {
                            views = weekResult[i].postsViewed; 
                        }

                        if (posts != undefined && posts != null)
                        {
                            posts = weekResult[i].postsCreated; 
                        }
                    }
                }
            }

            document.getElementById("videosWatched").innerHTML = videos; 
            document.getElementById("questionsAnswered").innerHTML = questions; 
            document.getElementById("postsViewed").innerHTML = views; 
            document.getElementById("postsCreated").innerHTML = posts; 
        });
        }          
    };

    // Generate the line chart 
    var generateLineChart = function () {

        var aggVideosWatched = []; 
        var aggQuestionsAnswered = []; 
        var aggPostsCreated = []; 
        var aggPostsViewed = []; 
            
        document.getElementById("noDataText").style.display = "block"; 
        document.getElementById("chartContainer").style.display = "block"; 

        // Send GET request for to get activity for specific user/course. 
         var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/events2",
            "headers": {
                'x-access-token': accessToken
            },
            "method": "GET",
            "data": {
                "userId": userId,
                "courseId": courseId
            }
        };

        $.ajax(settings).done(function (response) {
            var result = response.data; 
            result.sort(sortByWeekNumber);

            if (result.length != 0)
            {
                document.getElementById("noDataText").style.display = "none"; 
            }

            var week = 1; 
            var videos = 0; 
            var questions = 0; 
            var views = 0; 
            var posts = 0; 

            // Set data points for line chart
            for (var i = 0; i < result.length; i++)
            {

                if (result[i]!= null && result[i].weekNumber == week)
                {
                    if (result[i].event.includes("video"))
                    {
                        videos++; 
                    }
                    else if (result[i].event.includes("questions"))
                    {
                        questions += result[i].numQuestions; 
                    }
                    else if (result[i].event.includes("Posts"))
                    {
                        if (views != undefined && views != null)
                        {
                            views = result[i].postsViewed; 
                        }

                        if (posts != undefined && posts != null)
                        {
                            posts = result[i].postsCreated; 
                        }
                    }
                } 
                else
                {
                    // Get the actual start date of the week and attach it to the chart label
                    var startDate = getKeyByValue(courseDates, week); 

                    var dates = startDate.split("-");

                    var weekString = "Week " + week + " (" + dates[1] + "/" + dates[2] + ")"; 
        
                    aggVideosWatched.push({label: weekString, y: videos});
                    aggQuestionsAnswered.push({label: weekString, y: questions});
                    aggPostsCreated.push({label: weekString, y: views});
                    aggPostsViewed.push({label: weekString, y: posts});

                    videos = 0; 
                    questions = 0; 
                    views = 0; 
                    posts = 0; 


                    if (result[i].event.includes("video"))
                    {
                        videos++; 
                    }
                    else if (result[i].event.includes("questions"))
                    {
                        questions += result[i].numQuestions; 
                    }
                    else if (result[i].event.includes("Posts"))
                    {
                        if (views != undefined && views != null)
                        {
                            views = weekResult[i].postsViewed; 
                        }

                        if (posts != undefined && posts != null)
                        {
                            posts = weekResult[i].postsCreated; 
                        }
                    }

                    week++; 
                }
            }

            // Get the actual start date of the week and attach it to the chart label
            var startDate = getKeyByValue(courseDates, week); 

            var dates = startDate.split("-");

            var weekString = "Week " + week + " (" + dates[1] + "/" + dates[2] + ")"; 

            aggVideosWatched.push({label: weekString, y: videos});
            aggQuestionsAnswered.push({label: weekString, y: questions});
            aggPostsCreated.push({label: weekString, y: views});
            aggPostsViewed.push({label: weekString, y: posts});

            // Create chart 
            var chart = new CanvasJS.Chart("chartContainer", {
                theme:"light2",
                animationEnabled: true,
                title:{
                    text: "Class Progress"
                },
                axisY :{
                    includeZero: true,
                    title: "Number of Actions",
                    suffix: ""
                },
                toolTip: {
                    shared: "true"
                },
                legend:{
                    cursor:"pointer",
                    itemclick : toggleDataSeries
                },
                data: [{
                    type: "spline", 
                    showInLegend: true,
                    yValueFormatString: "",
                    name: "Videos Watched",
                    dataPoints: aggVideosWatched
                },
                {
                    type: "spline", 
                    showInLegend: true,
                    yValueFormatString: "",
                    name: "Posts Viewed",
                    dataPoints: aggPostsViewed
                },
                {
                    type: "spline", 
                    showInLegend: true,
                    yValueFormatString: "",
                    name: "Posts Created",
                    dataPoints: aggPostsCreated
                },
                {
                    type: "spline", 
                    showInLegend: true,
                    yValueFormatString: "",
                    name: "Questions Answered",
                    dataPoints: aggQuestionsAnswered
                } ]
            });
            chart.render();

            // Allows you to select/unselect certain series in the legend
            function toggleDataSeries(e) {
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                chart.render();
            }
        });  
    };

    // Gets existing rating from database
    function getSavedRating() {
        
        var responseText = document.getElementById("responseText");

        var email = analytics._user._getTraits().email;

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/rating",
            "method": "GET",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "courseId": courseId, 
                "email": email,
                "weekId": weekId, 
            }
        };

        $.ajax(settings).done(function (response) {

            var weekData = response.data; 

            if (weekData != null)
            {
                updateRating(weekData.satisfied);
                activateButton(); 
            }
            else
            {
                // Disable 'next' buttons until slider bar progress is submitted. 
                toggleNextButtonDisabled(true); 
            }
        }); 
    }

    // Saves the slider bar data
    function saveRating() {
        
        var email = analytics._user._getTraits().email;

        var ratingValue; 
        var veryUnhappy = document.getElementById("veryUnsatisfied");
        var unhappy = document.getElementById("unsatisfied");
        var neutral = document.getElementById("neutral");
        var smiley = document.getElementById("happy");
        var verySmiley = document.getElementById("veryHappy");

        if (smiley.checked == true)
        {
            ratingValue = 1; 
        }
        else if (verySmiley.checked == true)
        {
            ratingValue = 2; 
        }
        else if (veryUnhappy.checked == true)
        {
            ratingValue = -2; 
        }
        else if (unhappy.checked == true)
        {
            ratingValue = -1
        }
        else
        {
            ratingValue = 0; 
        }

        var responseText = document.getElementById("responseText");             

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/rating",
            "method": "POST",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "userId": userId,
                "email": email,
                "courseId": courseId, 
                "weekId": weekId, 
                "weekNumber": weekNumber, 
                "satisfied": ratingValue 
            }
        };

        // Enable 'next' buttons when slider bar progress is submitted. We'll do this even if storage fails so we don't block the user. 
        toggleNextButtonDisabled(false); 

        $.ajax(settings).done(function (response) {
            responseText.style.display = "block"; 
        }); 
    }

    //////////////////////////////////////////////
    //               HELPER FUNCTIONS           //
    //////////////////////////////////////////////

    // Sort events by week number
    function sortByTimestamp(record1, record2)
    {
        if (record1.Timestamp > record2.Timestamp)
        {
            return -1; 
        }

        if (record1.Timestamp < record2.Timestamp)
        {
            return 1; 
        }

        return 0; 
    } 

    // Search dictionary for value and return key (e.g. week num to start date)
    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    // Convert date object to readable string
    function convertDateToString(d)
    {
        var dd = d.getDate(); 
        var mm = d.getMonth()+1; 
        var yyyy = d.getFullYear();

        if(dd<10) 
        {
            dd='0'+dd;
        } 

        if(mm<10) 
        {
            mm='0'+mm;
        } 

        return mm +'/'+ dd +'/'+ yyyy;
    }

    // Get the week number based on the current date and the start date of each week recorded in SRLUICourseInfo.js
    function getWeekNumber()
    {
        var weekNumber;

        var currentDate = new Date();

        for(var key in courseDates) 
        {
            var tempDate = new Date(key);

            if (currentDate > tempDate )
            {
                weekNumber = courseDates[key];
            }
        }
        return weekNumber; 
    }

    // Sort events by week number
    function sortByWeekNumber(record1, record2)
    {
        if (record1.weekNumber > record2.weekNumber)
        {
            return 1; 
        }

        if (record1.weekNumber < record2.weekNumber)
        {
            return -1; 
        }

        return 0; 
    } 

    // Create the text node used for goals
    function createGoalTextNode(text)
    {
        var textNode = document.createElement("P");
        textNode.innerHTML = text;
        textNode.className = "goalText";
        return textNode; 
    }

    // Updates rating
    function updateRating(val) {

        if (val != undefined)
        {
           if (val == 1)
           {
                document.getElementById("veryUnsatisfied").checked = false;
                document.getElementById("unsatisfied").checked = false;
                document.getElementById("neutral").checked = false;
                document.getElementById("happy").checked = true;
                document.getElementById("veryHappy").checked = false;
           }
           else if (val == 0)
           {
                document.getElementById("veryUnsatisfied").checked = false;
                document.getElementById("unsatisfied").checked = false;
                document.getElementById("neutral").checked = true;
                document.getElementById("happy").checked = false;
                document.getElementById("veryHappy").checked = false;
           }
           else if (val == 2)
           {
                document.getElementById("veryUnsatisfied").checked = false;
                document.getElementById("unsatisfied").checked = false;
                document.getElementById("neutral").checked = false;
                document.getElementById("happy").checked = false;
                document.getElementById("veryHappy").checked = true;
           }
           else if (val == -1)
           {
                document.getElementById("veryUnsatisfied").checked = false;
                document.getElementById("unsatisfied").checked = true;
                document.getElementById("neutral").checked = false;
                document.getElementById("happy").checked = false;
                document.getElementById("veryHappy").checked = false;
           }
           else if (val == -2)
           {
                document.getElementById("veryUnsatisfied").checked = true;
                document.getElementById("unsatisfied").checked = false;
                document.getElementById("neutral").checked = false;
                document.getElementById("happy").checked = false;
                document.getElementById("veryHappy").checked = false;
           }
        }
    }

    // Toggle 'next' buttons disabled/enabled
    function toggleNextButtonDisabled(disabled)
    {
        var nextButton = document.getElementsByClassName("sequence-nav-button button-next");

        for (var i = 0; i < nextButton.length; i++)
        {
            nextButton[i].disabled = disabled; 
        }

        var sectionButtons = document.getElementsByClassName("seq_other inactive nav-item tab");

        for (var i = 0; i < sectionButtons.length; i++)
        {
            sectionButtons[i].disabled = disabled; 
        }

    }

    // Activate submit button when an option is selected
    function activateButton()
    {
        var saveGoalsButton = document.getElementById("saveGoalsButton");
        saveGoalsButton.disabled = false;
    }
