    var userId; 
    var courseId; 
    var weekNumber; 
    var weekId; 
    var devShowTreatment = false; 
    var postsArray = {};
    var goalContent = [];
    var goalCreateDate = ""; 

    var SERVER_URL = "https://columbiax-srlui.herokuapp.com";

    // Analytics property has to load...
    function waitForElement(){
        if(typeof(analytics) != undefined 
            && typeof(analytics.user) === typeof(Function)) {
                userId = analytics.user()._getId();  
                generateNumbers();       
        }
        else{
            setTimeout(waitForElement, 250);
        }
    }

    // Set user info global variables
    function getUserInfo()
    {
      var url = window.location.href;
      var split = url.split("/");
      courseId = split[4].split(":")[1];
      weekId = split[6];

      if (courseId.includes("type")){
        courseId = courseId.split("+type")[0]; 
      }

      waitForElement();
    }

    // Toggle between control/treatment displays
    function toggleGroupDisplay()
    {
        getUserInfo(); 
      
        // Only show goal section if the user is in the treatment group
        if (userId % 2 != 0 || devShowTreatment)
        {
            var saveGoalsButton = document.getElementById("saveGoalsButton");
            saveGoalsButton.disabled = true; 

            var goalsElement = document.getElementById("weekGoals");
            var goalsContainer = document.getElementById("goalsContainer"); 

            goalsElement.style.display = "block"; 
        }
    }

    //////////////////////////////////////////////
    //         GET ACTIVITY DATA                //
    //////////////////////////////////////////////

    // Create the table of selected goals
    function createSavedVideoTable(selectedVideos)
    {
        document.getElementById("savedVideoTableDiv").innerHTML = "";

        if (selectedVideos != null)
        {
            var savedVideoTable = document.createElement('table');
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");

            var headRow = document.createElement("tr");

            ["Week", "Learning Content", "Time (hh:mm:ss)"].forEach(function(el) {
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

                var contentTd = document.createElement("td");
                contentTd.style.textAlign = "center"; 

                if (contentArray[3] != null) 
                {
                    contentTd.appendChild(document.createTextNode(contentArray[1] + " (" + contentArray[3] + " problems)"));
                }
                else
                {
                    contentTd.appendChild(document.createTextNode(contentArray[1]));          
                }

                var timeTd = document.createElement("td");
                timeTd.style.textAlign = "center"; 
                timeTd.appendChild(document.createTextNode(contentArray[2]));

                tr.appendChild(weekTd); 
                tr.appendChild(contentTd); 
                tr.appendChild(timeTd); 

                tbody.appendChild(tr);
            }

            savedVideoTable.appendChild(tbody); 

            document.getElementById("savedVideoTableDiv").appendChild(savedVideoTable);
        }
    }

    // Get past week's numbers 
    function generateNumbers() {

        var email = analytics._user._getTraits().email;

        var weekNumber = getWeekNumber() - 1;

        var datestring = "In the past week of the course you have:"

        if (weekNumber > 1)
        {
            var weekStartDate = new Date(DATES[weekNumber - 1]); 
            var weekEndDate = new Date(DATES[weekNumber]);

            // Set date string for past week      
            var startString = convertDateToString(weekStartDate); 
            var endString = convertDateToString(weekEndDate);

            dateString = "In the past week of the course (" + startString + " - " + endString + ") you have:";

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

                var result = response.data; 

                if (result != null)
                {
                    // FILL OUT GOAL SECTION
                    var goalArray = result.goals; 

                    if (goalArray.length > 0) 
                    {
                        var goalResult = goalArray[goalArray.length - 1];

                        document.getElementById("goalsHeaderText").innerHTML = "As a reminder, these were the last goals you set for yourself on " + goalResult.goalCreateDate;
                        document.getElementById("savedThree").style.display = "flex"; 

                        document.getElementById("savedVideos").innerHTML = goalResult.videoGoal; 
                        document.getElementById("savedQuizzes").innerHTML = goalResult.quizGoal; 
                        document.getElementById("savedAssignments").innerHTML = goalResult.assignmentGoal; 
                        document.getElementById("savedEstimatedTime").innerHTML = goalResult.estimatedTimeGoal; 

                        document.getElementById("savedAdditionalGoal").innerHTML = "<b>Additional Goals: </b>" + goalResult.additionalGoal;

                        goalCreateDate = goalResult.goalCreateDate; 

                        if (goalResult.content.length > 0) {
                            goalContent = goalResult.content; 
                            createSavedVideoTable(goalResult.content);
                        }

                        if (goalResult.rating != null)
                        {
                            updateRating(goalResult.rating);
                            activateButton(); 
                        }
                        else
                        {
                            // Disable 'next' buttons until slider bar progress is submitted. 
                            if (!wereGoalsMadeSameDay(goalResult.goalCreateDate)) {
                                toggleNextButtonDisabled(true);        
                            }
                        }
                    }

                    // FILL NUMBERS AND CHART
                    document.getElementById("videosWatched").innerHTML = result.videos[weekNumber]; 
                    document.getElementById("problemsCompleted").innerHTML = result.problems[weekNumber]; 
                    document.getElementById("postsCreated").innerHTML = result.posts[weekNumber]; 

                    //Generate line chart
                    var videoData = [];
                    var postsData = [];
                    var problemData = []; 
                    var goalVideoData = [];
                    var goalProblemData = []; 

                    var numWeeks = Object.keys(DATES).length;
                    var goalIndex = 0; 
                    var currentGoalDate = goalArray[goalIndex].goalCreateDate; 

                    for (var i = 1; i < numWeeks + 1; i++)
                    {
                        var videoGoalCounter = 0; 
                        var problemGoalCounter = 0; 

                        weekDate = DATES[i];

                        videoData.push({label: "Week Ending in " + weekDate, y: result.videos[i]});
                        postsData.push({label: "Week Ending in " + weekDate, y: result.posts[i]});
                        problemData.push({label: "Week Ending in " + weekDate, y: result.problems[i]});

                        while (goalIndex < goalArray.length && 
                            new Date(currentGoalDate).getTime() <= new Date(weekDate).getTime())
                        {
                            videoGoalCounter += goalArray[goalIndex].videoGoal; 
                            problemGoalCounter += goalArray[goalIndex].quizGoal; 
                            goalIndex++; 

                            if (goalIndex < goalArray.length)
                            {
                                currentGoalDate = goalArray[goalIndex].goalCreateDate;
                            } 
                        }

                        goalVideoData.push({label: "Week Ending in " + weekDate, y: videoGoalCounter}); 
                        goalProblemData.push({label: "Week Ending in " + weekDate, y: problemGoalCounter}); 
                    }

                    var chart = new CanvasJS.Chart("chartContainer", {
                        theme:"light2",
                        animationEnabled: true,
                        title:{
                            text: "Class Progress"
                        },
                        axisY: {
                            includeZero: true,
                            title: "Number of Actions",
                            suffix: ""
                        },
                        axisX: {
                            title: "Week Number",
                            labelFormatter: function (e) {
                                return e.value + 1;
                            }
                        },
                        toolTip: {
                            shared: "true"
                        },
                        legend:{
                            cursor:"pointer",
                            itemclick : function (e) {
                                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                    e.dataSeries.visible = false;
                                } else {
                                    e.dataSeries.visible = true;
                                }
                                e.chart.render();
                            }
                        },
                        data: [{
                            type: "spline", 
                            showInLegend: true,
                            yValueFormatString: "",
                            name: "Videos Watched",
                            color: "#094D8F",
                            lineThickness: 3,
                            dataPoints: videoData
                        },
                        {
                            type: "spline", 
                            showInLegend: true,
                            yValueFormatString: "",
                            name: "Problems Completed",
                            color: "#1E9121",
                            lineThickness: 3,
                            dataPoints: problemData
                        },
                        {
                            type: "spline", 
                            showInLegend: true,
                            yValueFormatString: "",
                            name: "Videos Watched Goal",
                            color: "#637CCE",
                            lineDashType: "dash",
                            lineThickness: 1,
                            dataPoints: goalVideoData,
                        },
                        {
                            type: "spline", 
                            showInLegend: true,
                            yValueFormatString: "",
                            name: "Problems Completed Goal",
                            color: "#66B954",
                            lineDashType: "dash",
                            lineThickness: 1,
                            dataPoints: goalProblemData,
                        },
                        {
                            type: "spline", 
                            showInLegend: true,
                            yValueFormatString: "",
                            name: "Posts Created",
                            dataPoints: postsData,
                        }]
                    });
                    chart.render();
                }
                else
                {
                    var textNode = createGoalTextNode("You didn't set any goals last week."); 
                    goalsContainer.appendChild(textNode);
                }
            });
        }

        document.getElementById("pastWeekHeader").innerHTML = dateString; 
    }


    // Saves the slider bar data
    function saveRating() {
        
        var email = analytics._user._getTraits().email;

        var responseText = document.getElementById("responseText");             

        var ratingValue = document.getElementById("rangeValLabel").innerHTML;

        var weekNumber = getWeekNumber() - 1; 

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/activity/rating",
            "method": "POST",
            "headers": {
                'x-access-token': accessToken
            },
            "data": {
                "email": email,
                "courseId": courseId, 
                "content": goalContent,
                "goalCreateDate": goalCreateDate, 
                "rating": ratingValue 
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

    function wereGoalsMadeSameDay(goalCreateDate){

        var timeDiff = Math.abs(new Date().getTime() - Date.parse(goalCreateDate));
        var daysDiff = timeDiff  / (1000 * 3600 * 24);

        if (daysDiff <= 1) {
            return true;
        }
        else
        {
            return false; 
        }
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
                weekNumber = week;
            }
        }

        if (weekNumber == undefined) {
            weekNumber = week;
        }

        return weekNumber; 
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
        document.getElementById("rangeValLabel").innerHTML = val;
        document.getElementById("rangeVal").value = val;
    }

    // Toggle 'next' buttons disabled/enabled
    function toggleNextButtonDisabled(disabled)
    {
        var buttons = document.getElementsByClassName("sequence-nav-button button-next"); 

        for (var i = 0; i < buttons.length; i++)
        {
            buttons[i].disabled = disabled; 
        }

        buttons = document.getElementsByClassName("next-btn btn btn-link"); 

        for (var i = 0; i < buttons.length; i++)
        {
            buttons[i].disabled = disabled; 
        }       

        buttons = document.getElementsByClassName("seq_other inactive nav-item tab"); 

        for (var i = 0; i < buttons.length; i++)
        {
            buttons[i].disabled = disabled; 
        }       

        buttons = document.getElementsByClassName("complete btn btn-link"); 

        for (var i = 0; i < buttons.length; i++)
        {
            buttons[i].disabled = disabled; 
        }       

        buttons = document.getElementsByClassName("sequence-nav-button button-next"); 

        for (var i = 0; i < buttons.length; i++)
        {
            buttons[i].disabled = disabled; 
        }       

        buttons = document.getElementsByClassName("next-button btn btn-outline-primary"); 

        for (var i = 0; i < buttons.length; i++)
        {
            buttons[i].disabled = disabled; 
        }        
    }

    // Activate submit button when an option is selected
    function activateButton()
    {
        var saveGoalsButton = document.getElementById("saveGoalsButton");
        saveGoalsButton.disabled = false;
    }
