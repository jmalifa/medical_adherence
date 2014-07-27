var missed = 2;

    getAllItems();
    $("#logForm").submit(function(){

        
        
        var startDate = $("input[name='startDate']").val();
        var date = $("input[name='date']").val();
        var time = $('input[name="time"]:checked').val();
        var data = $('input[name="data"]:checked').val();
        var i = 0
        var logLength = localStorage.length-1;
        for (i = 0; i <= logLength; i++) {
            var itemKey = localStorage.key(i);
            var values = localStorage.getItem(itemKey);
            values = values.split(";"); 
            
            if (startDate != values[0]) {
                alert("Please enter your previous start date or clear data to start again.");
                logLength.splice(i);
            } 

            if( date == values[1] && time == values[2]) {
                alert("Data already entered. Please select a different Date or Time.");
                logLength.splice(i);
                drawChart();
            }
            
            
        }

        console.log(missed);

        var newDate = new Date();
        var itemKey = newDate.getTime();
        var values = new Array();
        values.push(startDate);
        values.push(date);
        values.push(time);
        values.push(data);

        if (startDate != "" && date != "" && time != null) {
            localStorage.setItem(itemKey, values.join(';'));  
        } else {
            alert("There are missing fields. Make sure you fill them in.");
        }
    });





function getAllItems() {
        var timeLog = ""; 
        var i = 0;
        var logLength = localStorage.length-1; 
        for (i = 0; i <= logLength; i++) {
            var itemKey = localStorage.key(i);
            var values = localStorage.getItem(itemKey);
            values = values.split(";"); 
            var startDate = values[0];
            var date = values[1];
            var time = values[2];
            var data = values[3];
 
            
            timeLog += '<li><strong>' +"Start Date: "+'</strong>'+startDate+': Date: '+date+' Time: '+time+' Data'+data+'</li>';
        }
 
    
    if (timeLog == "") 
        timeLog = '<h6>No Data to Display</h6>';
    
    $("#theLog").html(timeLog); 
}



$(function () {
 
    $("#startDate").datepicker({
        minDate: "dateToday",
        changeMonth: true,
        dateFormat: 'dd-mm-yy',
        onClose: function (selectedDate, instance) {
            if (selectedDate != '') {
                $("#date_pick").datepicker("option", "minDate", selectedDate);
                var date = $.datepicker.parseDate(instance.settings.dateFormat, selectedDate, instance.settings);
                // date.setMonth(date.getMonth() + 2);
                date.setDate( date.getDate() + 42 );
                console.log(selectedDate, date);
                $("#date_pick").datepicker("option", "minDate", selectedDate);
                $("#date_pick").datepicker("option", "maxDate", date);
            }
        }
    });
    $("#date_pick").datepicker({
        minDate: "dateToday",
        changeMonth: true,
        dateFormat: 'dd-mm-yy',
        onClose: function (selectedDate) {
            $("#startDate").datepicker("option", "maxDate", selectedDate);
        }
    });
});

$("#clearLog").click(function() {
    var answer = confirm("Are you sure you want to clear the data?");
 
    if (answer) {
        localStorage.clear();
 
        getAllItems();//refresh the list of items
        drawChart(); //refresh the graph
    }
});

// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
    
    // var today = new Date();
    // var dd = today.getDate();
    // var mm = today.getMonth()+1;
    // var yyyy = today.getFullYear();

    // if(dd<10) {
    //     dd='0'+dd
    // } 

    // if(mm<10) {
    //     mm='0'+mm
    // } 

    // today = dd+'-'+mm+'-'+yyyy;



    // Create the data table.
    var i = 0;
    var missed = 0;
    var taken = 0;
    logLength = localStorage.length-1;
    for (i = 0; i <= logLength; i++) {
        var itemKey = localStorage.key(i);
        var values = localStorage.getItem(itemKey);
        values = values.split(";");
        
        if(values[3] == "missed") {
            missed += 1;
            
        }

        if(values[3] == "taken") {
            taken +=1;
        }
        
    }

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Taken', taken],
      ['Missed', missed],
      
    ]);

    
    // Set chart options
    var options = {'title':'MedicationAdherence Performance Chart',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}


