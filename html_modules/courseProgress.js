    var userId; 
    var courseId; 
    var weekNumber; 
    var weekId; 
    var devShowTreatment = false; 
    var postsArray = {};

    //var SERVER_URL = "https://columbiax-srlui.herokuapp.com";
    var SERVER_URL = "localhost:8080"

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
                    "url": SERVER_URL + "/api/goals/weekByNum",
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
    }

    //////////////////////////////////////////////
    //         GET ACTIVITY DATA                //
    //////////////////////////////////////////////

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
    function generateNumbers() {
        getUserInfo();

        var email = analytics._user._getTraits().email;

        var pastWeekNumber = weekNumber - 1; 

        var weekStartDate = new Date(DATES[pastWeekNumber]); 
        var weekEndDate = new Date(DATES[weekNumber]);

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
                "url": SERVER_URL + "/api/activity",
                "method": "GET",
                "headers": {
                    'x-access-token': accessToken
                },
                "data": {
                    "courseId": courseId, 
                    "email": email
                }
            };

            $.ajax(settings).done(function (response) {

                var resultArray = response.data; 
                var result = resultArray[0];

                // Past week numbers
                document.getElementById("videosWatched").innerHTML = result.videos[pastWeekNumber]; 
                document.getElementById("problemsCompleted").innerHTML = result.problems[pastWeekNumber]; 
                document.getElementById("postsCreated").innerHTML = result.posts[pastWeekNumber]; 

                //Generate line chart
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
                    axisX: {
                        title: "Week Number"
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
                        dataPoints: result.videos
                    },
                    {
                        type: "spline", 
                        showInLegend: true,
                        yValueFormatString: "",
                        name: "Posts Created",
                        dataPoints: result.posts
                    },
                    {
                        type: "spline", 
                        showInLegend: true,
                        yValueFormatString: "",
                        name: "Questions Tried",
                        dataPoints: result.problems
                    } ]
                });
                chart.render();
            });
        }          
    };

    // Allows you to select/unselect certain series in the legend
    function toggleDataSeries(e) {

        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
            chart.render();
    }

   
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
            return 1; 
        }

        if (record1.Timestamp < record2.Timestamp)
        {
            return -1; 
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

        for(var week in DATES) 
        {
            var tempDate = new Date(DATES[week]);

            if (currentDate <= tempDate )
            {
                weekNumber = week
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
