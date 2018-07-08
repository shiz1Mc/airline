function showDeparturesCanvas() {
	setActiveDiv($("#departuresCanvas"))
	$('#main-tabs').children('.left-tab').children('span').removeClass('selected')
	loadDepartures($('#airportPopupId').val())
}

function loadDepartures(airportId) {
	//$('#rankingCanvas .table').hide() //hide all tables until they are loaded
	$('.departures').children('div.table-row').remove()
	var currentTime = new Date()
	currentMinute =  currentTime.getMinutes()
	currentHour = currentTime.getHours()
	currentDay = currentTime.getDay()
	
	$.ajax({
		type: 'GET',
		url: "/airports/" + airportId + "/departures/" + currentDay + "/" + currentHour + "/" + currentMinute,
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    success: function(departures) {
	    	updateDepartures(departures)
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
	    }
	});
}

function updateDepartures(allDepartures) {
	var boardSize = 30
	for (var i = 0 ; i < 3; i++) { //how many boards
		var tableId = '#departures' + (i + 1)
		var departuresTable = $(tableId)
		
		var departures = allDepartures.slice(i * boardSize, (i + 1) * boardSize)
		
		var filledRows = departures.length
		$.each(departures, function(index, departure){
			var row = $("<div class='table-row' style='position:relative;'></div>")
			row.append("<div class='cell'>" + departure.timeSlotTime + "</div>")
			row.append("<div class='cell'>" + departure.flightCode + "</div>")
			//row.append("<div class='cell' style='width:50%'>" + departure.destination + "</div>")
			row.append("<div class='cell' style='overflow:hidden; float:left; text-overflow: clip; white-space: nowrap;'>" + departure.destination + "</div>")
			var statusDiv = $("<div class='cell'>" + departure.statusText + "</div>")
			if (departure.statusCode == 'FINAL_CALL') {
				 statusDiv.addClass('blink')
			}
			row.append(statusDiv) 
			
			
			departuresTable.append(row)
		})
		
		for (var j = 0; j < boardSize - filledRows ; j ++) {
			var emptyRow = $("<div class='table-row' style='position:relative;'></div>")
			emptyRow.append("<div class='cell'>&nbsp;</div>")
			emptyRow.append("<div class='cell'>&nbsp;</div>")
			emptyRow.append("<div class='cell'>&nbsp;</div>")
			emptyRow.append("<div class='cell'>&nbsp;</div>")
			
			departuresTable.append(emptyRow)
		}
		
	}	
	
}

function getRankingRow(ranking) {
	var row = $("<div class='table-row'></div>")
	row.append("<div class='cell'>" + ranking.rank + "</div>")
	row.append("<div class='cell'>" + getMovementLabel(ranking.movement) + "</div>")
	var countryFlagUrl = getCountryFlagUrl(ranking.airlineCountryCode)
	if (countryFlagUrl) {
		row.append("<div class='cell'><img src='" + countryFlagUrl + "'/>" + ranking.airlineName + "</div>")
	} else {
		row.append("<div class='cell'>" + ranking.airlineName + "</div>")
	}
	row.append("<div class='cell' style='text-align: right;'>" + ranking.rankedValue + "</div>")
	
	
	return row
}

function getDividerRow() {
	var row = $("<div class='table-row'></div>")
	row.append("<div class='cell' style='border-top: 1px solid #6093e7;'></div>")
	row.append("<div class='cell' style='border-top: 1px solid #6093e7;'></div>")
	row.append("<div class='cell' style='border-top: 1px solid #6093e7;'></div>")
	row.append("<div class='cell' style='border-top: 1px solid #6093e7;'></div>")
	
	return row
}


function getMovementLabel(movement) {
	if (movement == 0) {
		return '-'
	} else if (movement < 0) { //going up in ranking
		return "<img src='assets/images/icons/12px/arrow-090.png'/>" + movement * -1
	} else {
		return "<img src='assets/images/icons/12px/arrow-270.png'/>" + movement
	}
}