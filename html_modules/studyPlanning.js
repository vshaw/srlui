 var userId; 
    var email;
    var weekId;
    var weekNumber = 0;
    var selectedVideos = []; 
    var goalVideos = 0; 
    var goalQuizzes = 0; 
    var goalAssignments = 0; 
    var goalTime = new Date(); 
    goalTime.setHours(0, 0, 0, 0);
    var additionalGoal = ""; 

    var devShowTreatment = false; 
    var SERVER_URL = "https://guarded-mesa-27479.herokuapp.com";

    //////////////////////////////////////////////
    //            PAGE LOAD FUNCTIONS         //
    //////////////////////////////////////////////

    // Load external scripts, ie SRLUICourseInfo.js
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

    // Toggle display between treatment/control experiences
    var toggleGroupDisplay = function()
    {
        getUserInfo();
      
        var controlElement = document.getElementById("controlWeeklyGoals");
        var treatmentElement = document.getElementById("treatmentWeeklyGoals"); 

        if (userId % 2 == 0 && !devShowTreatment)
        {
            getControlGoals(); 
            controlElement.style.display = "block"; 
            treatmentElement.style.display = "none"; 
        }
        else
        {
            getTreatmentGoals(); 
        }
    };

    // Get user info and set global variables
    function getUserInfo()
    {
        var url = window.location.href;
        var split = url.split("/");
        weekId = split[6];
        courseId = split[4].split(":")[1];

        userId = analytics.user()._getId();
        email = analytics._user._getTraits().email;

        var currentDate = new Date();

        for(var key in courseDates) {

            var tempDate = new Date(key);

            if (currentDate > tempDate)
            {
                weekNumber = courseDates[key];
            }
        }
    }

    //////////////////////////////////////////////
    //       CONTROL GROUP FUNCTIONS            //
    //////////////////////////////////////////////

    // Show control experience with static goals 
    function getControlGoals() 
    {
        var goals = {}; 

        var url = window.location.href;
        var split = url.split("/");
        var week = split[6];

        // Read goals from SRLUICourseInfo.js static file
        for (var i=0; i < mappedInfo.length; i++) {
            if(mappedInfo[i][0] == week) {
                goals = mappedInfo[i][1];
            }
        }

        // Add html text element per goal
        for (var j=0; j < goals.length; j++) {
            var goal = goals[j];
            var textNode = document.createElement("P");
            textNode.innerHTML = goal;
            textNode.className = "header1";
            document.getElementById("controlGoals").appendChild(textNode);
        }
    };

    //////////////////////////////////////////////
    //       TREATMENT GROUP FUNCTIONS          //
    //////////////////////////////////////////////

    // Retrieve user defined goals from the database
    function getTreatmentGoals()
    {
        var videoTable = generateVideoTable(); 
        assignVideoTablePagination(videoTable);
        
        var scheduleGoals = document.getElementById("scheduleGoals");
        var treatmentElement = document.getElementById("treatmentWeeklyGoals"); 

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/goals2/week",
            "headers": {
                'x-access-token': accessToken
            },
            "method": "GET",
            "data": {
                "userId": userId,
                "email": email,
                "courseId": courseId, 
                "weekId": weekId
            }
        };

        $.ajax(settings).done(function (response) {

            var result = response.data; 

            // If we found goals already set, redirect to the calendar/goal view. Otherwise, show them 
            // the set goal page. 
            if (result != null)
            {
                treatmentWeeklyGoals.style.display="none";
                setDateTimePickers(); 

                selectedVideos = result.content; 

                goalVideos = result.videoGoal; 
                goalQuizzes = result.quizGoal; 
                goalAssignments = result.assignmentGoal; 
                additionalGoal = result.additionalGoal; 

                createSavedVideoTable(additionalGoal); 

                document.getElementById("savedVideos").innerHTML = result.videoGoal; 
                document.getElementById("savedQuizzes").innerHTML = result.quizGoal; 
                document.getElementById("savedAssignments").innerHTML = result.assignmentGoal; 
                document.getElementById("savedEstimatedTime").innerHTML = result.estimatedTimeGoal; 


                document.getElementById("videos").innerHTML = result.videoGoal; 
                document.getElementById("quizzes").innerHTML = result.quizGoal; 
                document.getElementById("assignments").innerHTML = result.assignmentGoal; 
                document.getElementById("estimatedTime").innerHTML = result.estimatedTimeGoal; 

                var timeArray = result.estimatedTimeGoal.split(":");
                
                if (timeArray.length == 3)
                {
                    goalTime.setHours(timeArray[0], timeArray[1], timeArray[2], 0);
                }
                else
                {
                    goalTime.setHours(0, timeArray[0], timeArray[1], 0);
                }
                
                scheduleGoals.style.display="block"; 
            } 
            else
            {
                treatmentWeeklyGoals.style.display="block";
                scheduleGoals.style.display="none"; 
            }              
        }); 
    }

    // Mark the saved rows as selected
    function selectSavedRows()
    {
        for (var i=0; i < selectedVideos.length; i++)
        {
            var element = document.getElementById(selectedVideos[i]);

            if (element)
            {
                element.checked = true; 
            }
        }
    }

    // Generate a master table of all course content corresponding to each week
    function generateVideoTable() {

        var tableArray = {}; 
        var weekCount = 1; 

        var videoTable;
        var thead;
        var tbody;

        var weekNum = 1; 
        var counter = 1; 

        for(var i=0; i < videos.length; i++)
        {
            var weekNum = videos[i][0]; 

            // If no content for that week is found in the table array, create a new table with headers
            if (!(weekNum in tableArray))
            {
                counter = 1; 
                videoTable = document.createElement('table');
                videoTable.id = "videoTable";
                thead = document.createElement("thead");
                tbody = document.createElement("tbody");

                var headRow = document.createElement("tr");
                var weekHeaderString = "Week " + weekNum + " Content";

                // Create table header checkbox 
                var thCheckbox = document.createElement("th");
                var headerCb = document.createElement("INPUT");
                headerCb.setAttribute("type", "checkbox");
                headerCb.onclick = function(e){ selectAllVideos(this.checked) };   

                thCheckbox.appendChild(headerCb);
                thCheckbox.style.textAlign = "center"; 
                headRow.appendChild(thCheckbox); 


                ["#", weekHeaderString, "Time (hh:mm:ss)"].forEach(function(el) {
                    var th=document.createElement("th");
                    th.style.textAlign = "center"; 
                    th.appendChild(document.createTextNode(el));
                    headRow.appendChild(th);
                });

                thead.appendChild(headRow); 
                videoTable.appendChild(thead); 
            }

            // Create the table row
            var tr = document.createElement("tr");

            for (var j=0; j < videos[i].length + 1; j++)
            {
                var td = document.createElement("td");
                td.style.textAlign = "center"; 

                if (j == 0)
                {
                    // For the # column, use an incrementing counter
                    td.appendChild(document.createTextNode(counter));
                }
                else if (j != videos[i].length)
                {
                    td.appendChild(document.createTextNode(videos[i][j]));
                }
                else
                {
                    // Lastly add the checkbox column
                    var cb = document.createElement("INPUT");
                    cb.setAttribute("type", "checkbox");
                    cb.id = videos[i][0] + "_" + videos[i][1] + "_" + videos[i][2]; 

                    cb.onclick = function(e){ saveSelectedVideos(this.checked, this.id) };   

                    td.appendChild(cb); 
                }

                // Checkbox should be inserted at first position
                if (j == videos[i].length)
                {
                    tr.insertBefore(td, tr.firstChild)
                }
                else
                {
                    tr.appendChild(td);
                }
            }

            tbody.appendChild(tr);
            counter++; 

            videoTable.appendChild(tbody);
            tableArray[weekNum] = videoTable; 
        }

        return tableArray; 
    }

    // Adds checked rows to a global array 
    function saveSelectedVideos(checked, videoRow)
    {
        var rowElements = videoRow.split("_");

        if (checked)
        {
            selectedVideos.push(videoRow);
            incrementGoalNumbers(1, rowElements[1], rowElements[rowElements.length - 1]);
        }
        else
        {
            incrementGoalNumbers(-1, rowElements[1], rowElements[rowElements.length - 1]);
    
            var index = selectedVideos.indexOf(videoRow)

            if (index > -1) {
                selectedVideos.splice(index, 1);
            }
        }
    }

    // Add/Subtract goal numbers 
    function incrementGoalNumbers(increment, name, time)
    {
        var tempDate = new Date(); 
        var timeBuckets = time.split(":");

        if (timeBuckets.length == 3)
        {
            tempDate.setHours(timeBuckets[0], timeBuckets[1], timeBuckets[2], 0);
        }
        else
        {
            tempDate.setHours(0, timeBuckets[0], timeBuckets[1], 0);
        }

        goalTime.setHours(goalTime.getHours() + (tempDate.getHours() * increment)); 
        goalTime.setMinutes(goalTime.getMinutes() + (tempDate.getMinutes() * increment)); 
        goalTime.setSeconds(goalTime.getSeconds() + (tempDate.getSeconds() * increment)); 

        if (name.includes("Quiz"))
        {
            goalQuizzes += increment; 
        }
        else if (name.includes("Assignment") && name.includes("Week"))
        {
            goalAssignments += increment; 
        }
        else
        {
            goalVideos += increment; 
        }    

        document.getElementById("videos").innerHTML = goalVideos; 
        document.getElementById("quizzes").innerHTML = goalQuizzes; 
        document.getElementById("assignments").innerHTML = goalAssignments; 
        document.getElementById("estimatedTime").innerHTML = goalTime.getHours() + ":" + goalTime.getMinutes() + ":" + goalTime.getSeconds(); 
    }

    // Assign page numbers to the correct table content
    function assignVideoTablePagination(videoTable)
    {
        var paginationDiv = document.getElementById("paginationDiv");

        // Create an HTML element for each page number, with a function to display corresponding content
        for(var i in videoTable)
        {
            var a = document.createElement('a');
            var link = document.createTextNode(i);
            a.appendChild(link); 
            a.id = i; 
            a.addEventListener("click", function(e){ showSelectedVideos(e.target.id, videoTable)});    

            paginationDiv.appendChild(a); 
        }

        // Start by showing Week 1 content by default
        showSelectedVideos(1, videoTable);
    }

    // Show week content based on what page number is selected
    function showSelectedVideos(weekNum, videoTable)
    {
        var videoTableDiv = document.getElementById("videoTableDiv");
        var learningGoalsDiv = document.getElementById("learningGoals");
        var weekHeaderText = document.getElementById("weekHeader"); 

        learningGoalsDiv.style.fontStyle = "italic";

        // Clear the video table and add new content
        learningGoalsDiv.innerHTML = ""; 
        videoTableDiv.innerHTML = "";
        weekHeaderText.innerHTML = ""; 
        videoTableDiv.appendChild(videoTable[weekNum]); 

        selectSavedRows();


        var allGoalsArray = []; 

        if (mappedInfo.length > weekNum)
        {
            var goals = mappedInfo[weekNum - 1][1];

            for (var i=0; i < goals.length; i++)
            {
                var goal = goals[i];
                var goalArray = goal.split(" ");
                goalArray.splice(0, 1);
                allGoalsArray.push(" " + goalArray.join(" ")); 
            }
        }

        var textNode = document.createElement("P");
        textNode.innerHTML = allGoalsArray.toString();
        learningGoalsDiv.appendChild(textNode);
        
        weekHeaderText.innerHTML = "Week " + weekNum + " Learning Topic(s):"; 

        var pageNumberElements = document.getElementById("paginationDiv").children;

        // Make the other page numbers inactive
        for (var i=0; i < pageNumberElements.length; i++)
        {
            if (pageNumberElements[i].hasAttribute("class"))
            {
                pageNumberElements[i].removeAttribute("class")
            }
        }

        // Mark current week number as active
        var pageNum = document.getElementById(weekNum); 
        pageNum.className = "active"; 
    }

    // Select all videos when header checkbox is selected
    function selectAllVideos(isChecked) {

        var table = document.getElementById("videoTable").rows;

        // Get week
        var weekContentString = table[0].children[2].innerHTML; 
        var tempArray = weekContentString.split(" ");
        var week = tempArray[1]; 

        // Iterate through all visible rows
        for(var i = 1; i < table.length; i++) {

            var nodes = table[i].children; 
            var tempId = week + "_" + nodes[2].innerHTML + "_" + nodes[3].innerHTML;

            if (document.getElementById(tempId).checked != isChecked)
            {
                document.getElementById(tempId).checked = isChecked;
                saveSelectedVideos(isChecked, tempId); 
            }
        }  
    }

    // Save set goals
    function saveGoals() {

        var additionalGoal = document.getElementById("additionalGoal").value;

        var estimatedTime = goalTime.getHours() + ":" + goalTime.getMinutes() + ":" + goalTime.getSeconds(); 

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/goals2",
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
                "videoGoal": goalVideos,
                "quizGoal": goalQuizzes,
                "assignmentGoal": goalAssignments,
                "estimatedTimeGoal": estimatedTime,
                "additionalGoal": additionalGoal,
                "content": selectedVideos
            }
        };

        // Save the goal and switch to calendar view
        $.ajax(settings).done(function (response) {

          treatmentWeeklyGoals.style.display="none";

          createSavedVideoTable(additionalGoal); 

          document.getElementById("savedVideos").innerHTML = goalVideos; 
          document.getElementById("savedQuizzes").innerHTML = goalQuizzes; 
          document.getElementById("savedAssignments").innerHTML = goalAssignments; 
          document.getElementById("savedEstimatedTime").innerHTML = estimatedTime; 

          setDateTimePickers(); 
          document.getElementById("scheduleGoals").style.display="block"; 
      });          
    }

    // Create the table of selected goals
    function createSavedVideoTable(additionalGoal)
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

    // Allow the user to return to the set goals page and edit goals. 
    function editGoals()
    {
        var scheduleGoalsElement = document.getElementById("scheduleGoals");
        var treatmentElement = document.getElementById("treatmentWeeklyGoals"); 
        
        scheduleGoalsElement.style.display ="none"; 
        treatmentElement.style.display = "block"; 

        document.getElementById("additionalGoal").innerHTML = additionalGoal;

        selectSavedRows(); 
    }

    // Save calendar email reminders
    function saveReminders()
    {      
        var date1 = document.getElementById("date1").value;
        var time1 = document.getElementById("time1").value;
        var task1 = document.getElementById("task1").value;
        var offset1 = getCheckedBox("reminder1", "reminder2", "reminder3");
        
        var finalDate1 = getFinalSendDate(date1, time1, offset1);

        var date2 = document.getElementById("date2").value;
        var time2 = document.getElementById("time2").value;
        var task2 = document.getElementById("task2").value;
        var offset2 = getCheckedBox("reminder4", "reminder5", "reminder6");
        
        var finalDate2 = getFinalSendDate(date2, time2, offset2);

        var date3 = document.getElementById("date3").value;
        var time3 = document.getElementById("time3").value;
        var task3 = document.getElementById("task3").value;
        var offset3 = getCheckedBox("reminder7", "reminder8", "reminder9");

        var finalDate3 = getFinalSendDate(date3, time3, offset3);

        var date4 = document.getElementById("date4").value;
        var time4 = document.getElementById("time4").value;
        var task4 = document.getElementById("task4").value;
        var offset4 = getCheckedBox("reminder10", "reminder11", "reminder12");

        var finalDate4 = getFinalSendDate(date4, time4, offset4);

        var date5 = document.getElementById("date5").value;
        var time5 = document.getElementById("time5").value;
        var task5 = document.getElementById("task5").value;
        var offset5 = getCheckedBox("reminder13", "reminder14", "reminder15");

        var finalDate5 = getFinalSendDate(date5, time5, offset5);

        var date6 = document.getElementById("date6").value;
        var time6 = document.getElementById("time6").value;
        var task6 = document.getElementById("task6").value;
        var offset6 = getCheckedBox("reminder16", "reminder17", "reminder18");

        var finalDate6 = getFinalSendDate(date6, time6, offset6);

        var date7 = document.getElementById("date7").value;
        var time7 = document.getElementById("time7").value;
        var task7 = document.getElementById("task7").value;
        var offset7 = getCheckedBox("reminder19", "reminder20", "reminder21");

        var finalDate7 = getFinalSendDate(date7, time7, offset7);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": SERVER_URL + "/api/tasks",
            "headers": {
                'x-access-token': accessToken
            },
            "method": "POST",
            "data": {
                "userId": userId,
                "email": email,
                "courseId": courseId, 
                "weekId": weekId, 
                "weekNumber": weekNumber, 
                "task1": task1, 
                "date1": finalDate1, 
                "offset1": offset1,
                "task2": task2, 
                "date2": finalDate2,
                "offset2": offset2,
                "task3": task3, 
                "date3": finalDate3,
                "offset3": offset3,
                "task4": task4, 
                "date4": finalDate4,
                "offset4": offset4,
                "task5": task5, 
                "date5": finalDate5,
                "offset5": offset5, 
                "task6": task6, 
                "date6": finalDate6,
                "offset6": offset6, 
                "task7": task7, 
                "date7": finalDate7,
                "offset7": offset7,
                "content": selectedVideos  
            }
        };

        $.ajax(settings).done(function (response) {
            responseText.style.display="block";
        });          
    }

    // Get value of the checked box for time offset
    function getCheckedBox(id1, id2, id3)
    {
        var cb1 = document.getElementById(id1);
        var cb2 = document.getElementById(id2);
        var cb3 = document.getElementById(id3);

        if (cb1.checked)
        {
            return cb1.value;
        }
        else if (cb2.checked)
        {
            return cb2.value; 
        }
        else
        {
            return cb3.value; 
        }
    }

    // Checks email send date
    function getFinalSendDate(date, time, offset)
    {
        var msPerMin = 60000;
        var currentDate = new Date().getTime(); 

        var finalDate = null; 

        if (date != "" && time != "")
        {
            var tempDate = new Date(date + " " + time);

            if (isValidDate(tempDate))
            {
                var dateWithOffset = tempDate.getTime() - (offset * msPerMin);

                if (dateWithOffset > currentDate)
                {
                    finalDate = dateWithOffset;    
                }
            }
        }

        return finalDate; 
    }

    // Checks if date can be parsed
    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    // Use jquery timepickers for cross browser compatability 
    function setDateTimePickers()
    {
        if ( $('#time1').prop('type') != 'time' ) 
        {
            $('#time1').mdtimepicker();
            $('#time1').attr('placeholder', "--:-- --");
        }

        if ( $('#time2').prop('type') != 'time' ) {
            $('#time2').mdtimepicker();
            $('#time2').attr('placeholder', "--:-- --");        
        }

        if ( $('#time3').prop('type') != 'time' ) {
            $('#time3').mdtimepicker();
            $('#time3').attr('placeholder', "--:-- --");        
        }
               
        if ( $('#time4').prop('type') != 'time' ) {
            $('#time4').mdtimepicker();
            $('#time4').attr('placeholder', "--:-- --");        
        }

        if ( $('#time5').prop('type') != 'time' ) {
            $('#time5').mdtimepicker();
            $('#time5').attr('placeholder', "--:-- --");        
        }

        if ( $('#time6').prop('type') != 'time' ) {
            $('#time6').mdtimepicker();
            $('#time6').attr('placeholder', "--:-- --");        
        }

        if ( $('#time7').prop('type') != 'time' ) {
            $('#time7').mdtimepicker();
            $('#time7').attr('placeholder', "--:-- --");        
        }

        if ( $('#date1').prop('type') != 'date' ) {
            $('#date1').datepicker();
            $('#date1').attr('placeholder', "mm/dd/yyyy");

        }
        if ( $('#date2').prop('type') != 'date' ) {
            $('#date2').datepicker();
            $('#date2').attr('placeholder', "mm/dd/yyyy");

        }

        if ( $('#date3').prop('type') != 'date' ) {
            $('#date3').datepicker();
            $('#date3').attr('placeholder', "mm/dd/yyyy");
        } 

        if ( $('#date4').prop('type') != 'date' ) {
            $('#date4').datepicker();
            $('#date4').attr('placeholder', "mm/dd/yyyy");
        } 

        if ( $('#date5').prop('type') != 'date' ) {
            $('#date5').datepicker();
            $('#date5').attr('placeholder', "mm/dd/yyyy");
        } 

        if ( $('#date6').prop('type') != 'date' ) {
            $('#date6').datepicker();
            $('#date6').attr('placeholder', "mm/dd/yyyy");
        } 

        if ( $('#date7').prop('type') != 'date' ) {
            $('#date7').datepicker();
            $('#date7').attr('placeholder', "mm/dd/yyyy");
        } 
    }
