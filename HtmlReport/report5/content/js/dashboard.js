/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8588235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Home/client_cgi/perr?id=be_verify_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-37"], "isController": false}, {"data": [0.7, 500, 1500, "Home/demo/index.php-42"], "isController": false}, {"data": [0.5, 500, 1500, "Register/demo/index.php?route=account/register-46"], "isController": false}, {"data": [1.0, 500, 1500, "Home/client_cgi/unblocking_rate-34"], "isController": false}, {"data": [0.9, 500, 1500, "Register/demo/index.php-47"], "isController": false}, {"data": [1.0, 500, 1500, "Home/generate_204-33"], "isController": false}, {"data": [1.0, 500, 1500, "Home/client_cgi/perr?id=be_verify_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-40"], "isController": false}, {"data": [1.0, 500, 1500, "Register/client_cgi/perr?id=be_false_positive_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-45"], "isController": false}, {"data": [1.0, 500, 1500, "Home/client_cgi/perr?id=be_false_positive_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-41"], "isController": false}, {"data": [0.7, 500, 1500, "Register/demo/index.php?route=account/register-46-0"], "isController": false}, {"data": [0.7, 500, 1500, "Register/demo/index.php?route=account/register-46-1"], "isController": false}, {"data": [1.0, 500, 1500, "Register/client_cgi/perr?id=be_verify_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-44"], "isController": false}, {"data": [1.0, 500, 1500, "Register/generate_204-43"], "isController": false}, {"data": [1.0, 500, 1500, "Home/client_cgi/perr/conn_test-35"], "isController": false}, {"data": [1.0, 500, 1500, "Home/client_cgi/perr?id=be_false_positive_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-39"], "isController": false}, {"data": [1.0, 500, 1500, "Home/client_cgi/perr?id=be_connectivity_check_success&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-36"], "isController": false}, {"data": [0.1, 500, 1500, "Home/demo/index.php-38"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 0, 0.0, 420.28235294117644, 42, 1751, 319.0, 958.6000000000015, 1536.8000000000004, 1751.0, 12.876836842902591, 19.075589872746555, 301.3722766910317], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Home/client_cgi/perr?id=be_verify_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-37", 5, 0, 0.0, 467.2, 460, 477, 468.0, 477.0, 477.0, 477.0, 6.313131313131313, 2.496892755681818, 394.30560487689394], "isController": false}, {"data": ["Home/demo/index.php-42", 5, 0, 0.0, 502.2, 388, 564, 551.0, 564.0, 564.0, 564.0, 7.961783439490445, 38.56488853503185, 6.31344546178344], "isController": false}, {"data": ["Register/demo/index.php?route=account/register-46", 5, 0, 0.0, 1014.4, 819, 1149, 1117.0, 1149.0, 1149.0, 1149.0, 3.654970760233918, 14.605605811403507, 9.839866593567251], "isController": false}, {"data": ["Home/client_cgi/unblocking_rate-34", 5, 0, 0.0, 332.8, 296, 379, 311.0, 379.0, 379.0, 379.0, 5.767012687427912, 7.783214388696655, 2.6075457756632066], "isController": false}, {"data": ["Register/demo/index.php-47", 5, 0, 0.0, 430.2, 365, 514, 425.0, 514.0, 514.0, 514.0, 5.307855626326964, 18.489375995222932, 4.229697452229299], "isController": false}, {"data": ["Home/generate_204-33", 5, 0, 0.0, 115.6, 86, 178, 98.0, 178.0, 178.0, 178.0, 6.775067750677507, 0.8402671917344173, 2.11059239498645], "isController": false}, {"data": ["Home/client_cgi/perr?id=be_verify_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-40", 5, 0, 0.0, 180.4, 168, 204, 178.0, 204.0, 204.0, 204.0, 17.857142857142858, 7.062639508928571, 1141.2353515625], "isController": false}, {"data": ["Register/client_cgi/perr?id=be_false_positive_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-45", 5, 0, 0.0, 179.6, 165, 189, 180.0, 189.0, 189.0, 189.0, 11.682242990654204, 4.620418370327103, 777.5422568633178], "isController": false}, {"data": ["Home/client_cgi/perr?id=be_false_positive_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-41", 5, 0, 0.0, 185.2, 165, 205, 186.0, 205.0, 205.0, 205.0, 17.921146953405017, 7.087953629032257, 1163.386956765233], "isController": false}, {"data": ["Register/demo/index.php?route=account/register-46-0", 5, 0, 0.0, 544.4, 396, 635, 604.0, 635.0, 635.0, 635.0, 5.847953216374268, 2.998218201754386, 10.88952850877193], "isController": false}, {"data": ["Register/demo/index.php?route=account/register-46-1", 5, 0, 0.0, 468.8, 350, 514, 513.0, 514.0, 514.0, 514.0, 5.159958720330238, 17.97419214396285, 4.283168859649123], "isController": false}, {"data": ["Register/client_cgi/perr?id=be_verify_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-44", 5, 0, 0.0, 168.4, 166, 172, 168.0, 172.0, 172.0, 172.0, 11.904761904761903, 4.708426339285714, 780.3548177083334], "isController": false}, {"data": ["Register/generate_204-43", 5, 0, 0.0, 63.4, 42, 140, 46.0, 140.0, 140.0, 140.0, 17.543859649122805, 2.1758497807017547, 5.465323464912281], "isController": false}, {"data": ["Home/client_cgi/perr/conn_test-35", 5, 0, 0.0, 344.0, 302, 402, 335.0, 402.0, 402.0, 402.0, 6.321112515802781, 0.9506360619469026, 2.228439080278129], "isController": false}, {"data": ["Home/client_cgi/perr?id=be_false_positive_mitm_cert_err&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-39", 5, 0, 0.0, 315.4, 299, 324, 318.0, 324.0, 324.0, 324.0, 12.72264631043257, 5.031906011450381, 809.1180621819339], "isController": false}, {"data": ["Home/client_cgi/perr?id=be_connectivity_check_success&ext_ver=1.212.611&product=cws&browser=chrome&uuid=7b777528ad712a7fdccd30862cd3eeb0-36", 5, 0, 0.0, 204.8, 153, 276, 165.0, 276.0, 276.0, 276.0, 8.223684210526315, 3.2525313527960527, 14.560097142269738], "isController": false}, {"data": ["Home/demo/index.php-38", 5, 0, 0.0, 1628.0, 1422, 1751, 1690.0, 1751.0, 1751.0, 1751.0, 2.8425241614553722, 12.35831793632746, 2.020857021034679], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
