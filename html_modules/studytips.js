

    // Analytics property has to load...
    function waitForElement(){
        if(typeof(analytics) != undefined 
            && typeof(analytics.user) === typeof(Function)) {
                userId = analytics.user()._getId();  
                getQuote();       
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

    function getQuote() {

        var fullQuote; 
        var imgPath;

        var url = window.location.href;
        var split = url.split("/");
        var week = split[6];

        var array = document.getElementsByClassName("nav-item nav-item-chapter");
        var weekInfo; 

        if (array != null && array.length > 0)
        {
            var chapterId = array[0].outerText; 

            // If the week name is of the form "Week 1: Algorithms", just use the number mapping
            if (chapterId.includes("Week"))
            {
                var week = chapterId.split(" ")[1];
                var weekNum = week.split(":")[0];
                weekInfo = mappedInfo[weekNum];
            }
            // Otherwise check if chapter string exists explicitly in the course info js file
            else if (mappedInfo[chapterId] != null) 
            {
                weekInfo = mappedInfo[chapterId];
            }

            imgPath = "https://courses.edx.org/asset-v1:" + courseId + "+type@asset+block@" + weekInfo["pic"];
            fullQuote = weekInfo["tip"];
        }

        // Create goal text
        var textNode = document.createElement("P");
        textNode.innerHTML = fullQuote;
        textNode.className = "quoteText";
        textNode.setAttribute("id", "quoteText");
        document.getElementById("inspirationalQuote").appendChild(textNode);
        
        // Load image
        var pic = document.createElement("IMG");
        pic.setAttribute("src", imgPath);
        pic.setAttribute("height", "50%"); 
        pic.setAttribute("width", "50%"); 
        pic.setAttribute("alt", "Study Image");
        document.getElementById("picture").appendChild(pic);
    }

