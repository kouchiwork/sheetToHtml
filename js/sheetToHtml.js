
// original data from sheet
var sheetData;
// edited data from sheet (Key-Val)
var arrayData;
// ids
var keyId = "#_key"
var apiKeyId = "#_apiKey"
var sheetNameId = "#_sheetName";
var templateId = "#_template"
var destinationId = "#_result"

window.onload = function () {

    // create api's url with key
    var sheetKey = $(keyId).text();
    var apiKey = $(apiKeyId).text();
    var sheetName = $(sheetNameId).text();
    var requestUrl = "https://sheets.googleapis.com/v4/spreadsheets/" + sheetKey + "/values/" + sheetName + "?key=" + apiKey;

    // get sheet data from SpreadSheet
    $.ajax({
        type: 'GET',
        url: requestUrl,
        dataType: 'jsonp',
        jsonpCallback: 'jsondata',
        cache: false,
        success: function (data) {
            // get data part only
            //sheetData = data.feed.entry;
            sheetData = data.values;
            // modify data
            changeData();
            // render to dom
            render();
        },
        error: function () {
            alert('error');
        }
    });

};

// change data to hash array
function changeData(){

    // define max row and max col
    var maxRow = sheetData.length-1;
    var maxCol = sheetData[0].length-1;
    var headers =sheetData[0]

    // then fill values by position of cells
    arrayData = [];

    // change data to hash
    for(var row = 1; row <= maxRow; row++) {
        arrayData.push([]);
        for(var col = 0; col <= maxCol; col++) {
            var val = sheetData[row][col];
            if (typeof val === "undefined") {
              val = "";
            }
            arrayData[row-1][headers[col]]=val.trim();
        }
    }
}

// render to html
function render() {

    // init html
    $(destinationId).empty();

    // get template
    var template = _.template($(templateId).html());

    // apply data to template
    _.each(arrayData,function(elm,i){

        // separate header and value and throw them int hash
        var template_values = {};
        Object.keys(elm).forEach(function(key) {
            template_values["header_" + key] = key;
            template_values[key] = this[key];
        }, elm);

        // append
        $(destinationId).append(template(template_values));

    });

}
