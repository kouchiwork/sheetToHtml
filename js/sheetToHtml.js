
// original data from sheet
var sheetData;
// edited data from sheet (Key-Val)
var arrayData;
// ids
var keyId = "#_key"
var templateId = "#_template"
var destinationId = "#_result"

window.onload = function () {

    // create api's url with key
    var sheetKey = $(keyId).text();
    var requestUrl = "https://spreadsheets.google.com/feeds/cells/" + sheetKey + "/od6/public/values?alt=json";

    console.debug(sheetKey);
    console.debug(requestUrl);

    // get sheet data from SpreadSheet
    $.ajax({
        type: 'GET',
        url: requestUrl,
        dataType: 'jsonp',
        cache: false,
        success: function (data) {
            // get data part only
            sheetData = data.feed.entry;
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
    var maxRow = sheetData[sheetData.length-1].gs$cell.row;
    var maxCol = 0;
    var headers =[]
    sheetData.some(function(item){
        if (item.gs$cell.row == 2){
            return true;
        }
        maxCol = item.gs$cell.col;
        headers.push(item.gs$cell.$t);
    })

    // then fill values by position of cells
    arrayData = [];

    // change data to hash
    for(var row = 2; row <= maxRow; row++) {
        arrayData.push([]);
        for(var col = 1; col <= maxCol; col++) {
            var val = getDataFromSheet(row,col);
            arrayData[row-2][headers[col-1]]=val;
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

// get values by position of cell
function getDataFromSheet(row,col){
    var val = sheetData.filter(function(item, index){
        if (item.gs$cell.row == row && item.gs$cell.col == col) return true;
    });
    if (val[0]){
        return val[0].gs$cell.$t.trim();
    }else{
        return ""
    }
}
