var full;
var weekOnly; 
var uniqueWeek = []; 

$( "h4 a" ).each(function( index ) {
  full = $( this ).attr("href");
  var split = full.split("/");
  weekOnly = split[4];
  weekList.push(weekOnly);
});

$.each(weekList, function(i, el){
    if($.inArray(el, uniqueWeek) === -1) uniqueWeek.push(el);
});

var mapped = [];
for (i=0; i < uniqueWeek.length; i++) {
  mapped[i] = [uniqueWeek[i], [], ""];
};

copy(mapped);