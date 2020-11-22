var selectionRecord = {}
var tableRecord = {}

function getSystemStatus() {
    alias_to_ip_map.forEach(element => {
        $.ajax({
                method: "GET",
                url: "http://" + element.ip + "/api/camera/status/",
                headers: {
                    'Authorization': 'Bearer ' + tokens[element.ip]
                },
            })
            .done(function (json) {
                if (!json.system_running) {
                    $(' #camera_' + element.type + '_status').removeClass("executing").addClass("notexecuting");
                } else {
                    $('#camera_' + element.type + '_status').removeClass("notexecuting").addClass("executing");
                }
            })
            .fail(function () {
                console.log("error" + element.ip);
            })
            .always(function () {

            });
    });
}

function updateDataElement(choice) {
    if (typeof tableRecord['record_table'] != "undefined") {
        tableRecord['record_table'].destroy();
        $('#record_table').empty();

    }

    let url_route = "";
    switch (choice) {
        case "Command History":
            url_route = "command_history";
            tableRecord['record_table'] = $('#record_table').DataTable({
                paging: false,
                scrollY: '25vh',
                scrollCollapse: true,
                sScrollX: "100%",
                scrollX: true,
                searching: false,
                order: [
                    [2, 'desc']
                ],
                data: [],
                columns: [{
                        title: "User"
                    },
                    {
                        title: "Commmand"
                    },
                    {
                        title: "Timestamp"
                    },
                ]
            });

            break;

        case "Detection":
            url_route = "detection";
            tableRecord['record_table'] = $('#record_table').DataTable({
                paging: false,
                scrollY: '25vh',
                scrollCollapse: true,
                sScrollX: "100%",
                scrollX: true,
                searching: false,
                order: [
                    [1, 'desc']
                ],
                data: [],
                columns: [{
                        title: "Calling Process"
                    },
                    {
                        title: "Timestamp"
                    },
                    {
                        title: "# of Captures"
                    },
                    {
                        title: "Recipient"
                    },
                ]
            });

            break;

        case "Messages":
            url_route = "message";
            tableRecord['record_table'] = $('#record_table').DataTable({
                paging: false,
                scrollY: '25vh',
                scrollCollapse: true,
                sScrollX: "100%",
                scrollX: true,
                searching: false,
                order: [
                    [3, 'desc']
                ],
                data: [],
                columns: [{
                        title: "ID"
                    },
                    {
                        title: "Function"
                    },
                    {
                        title: "Messages"
                    },
                    {
                        title: "Timestamp"
                    },
                ]
            });

            break;

        case "Thread Activity":
            url_route = "threadactivity";
            tableRecord['record_table'] = $('#record_table').DataTable({
                paging: false,
                scrollY: '25vh',
                scrollCollapse: true,
                sScrollX: "100%",
                scrollX: true,
                searching: false,
                order: [
                    [5, 'desc']
                ],
                data: [],
                columns: [{
                        title: "ID"
                    },
                    {
                        title: "Thread type"
                    },
                    {
                        title: "Attribute 1"
                    },
                    {
                        title: "Attribute 2"
                    },
                    {
                        title: "Restart"
                    },
                    {
                        title: "Timestamp"
                    },
                ]
            });

            break;
    }
    return url_route;
}

function fetchData(system_ip, url_route) {
    const api_url = "http://" + system_ip + "/api/camera/" + url_route + "/";
    $.ajax({
            method: "GET",
            url: api_url,
            headers: {
                'Authorization': 'Bearer ' + tokens[system_ip]
            }
        })
        .done(function (json) {
            data_to_feed = [];
            json.forEach(element => {
                // turn list of dict+ionary to a list of lists 
                let temp = Object.keys(element).map(function (key) {
                    return element[key];
                });
                data_to_feed.push(temp);
            });
            // feed the data to the table 
            tableRecord['record_table'].rows.add(data_to_feed).columns.adjust().draw();
        })
        .fail(function () {
            console.log("error getting messages for ... " + system_ip);
        });
}

' update system status every 5 seconds '
window.setInterval(function () {
    getSystemStatus();
}, 5000);


$(document).ready(function () {
    ' When the page loads, create a new DataTable and get execute function to get System status '
    getSystemStatus();
    updateDataElement($('#record_select_picker').val());

});



$('#start_button').click(function () {
    $("#start_button").attr("disabled", true);
    alias_to_ip_map.forEach(element => {
        $.ajax({
                method: "POST",
                url: "http://" + element.ip + "/api/camera/action/start/?delay=" + parseInt($('#delay-slider').val()),
                headers: {
                    'Authorization': 'Bearer ' + tokens[element.ip]
                }
            })
            .done(function (json) {
                if (json.system_running) {
                    $('#camera_' + element.type + '_status').removeClass("notexecuting").addClass("executing");
                }
            })
            .fail(function () {
                console.log("error" + element.ip);
            })
            .always(function () {
                console.log("Fetched surveillance status for ... " + element.ip);
            });
    });
    setTimeout(function () {
        $("#start_button").attr("disabled", false);
    }, 2000);
});


$('#stop_button').click(function () {
    $("#stop_button").attr("disabled", true);
    alias_to_ip_map.forEach(element => {
        $.ajax({
                method: "POST",
                url: "http://" + element.ip + "/api/camera/action/stop/",
                headers: {
                    'Authorization': 'Bearer ' + tokens[element.ip]
                }
            })
            .done(function (json) {
                if (!json.system_running) {
                    $('#camera_' + element.type + '_status').removeClass("executing").addClass("notexecuting");
                }
            })
            .fail(function () {
                console.log("error" + element.ip);
            })
            .always(function () {
                console.log("Fetched surveillance status for ... " + element.ip);
            });
    });
    setTimeout(function () {
        $("#stop_button").attr("disabled", false);
    }, 2000);
});


$('.system').on('click touch', function () {
    // get the IP address of the system card that was selected/clicked/touched
    selectionRecord['clicked_system'] = $(this).find('h6').text();
    // get the url route for based on the record select picker value and also prepare the table accordingly //
    const system_ip = $(this).find('h6').text();
    const url_route = updateDataElement($('#record_select_picker').val());

    fetchData(system_ip, url_route);
});


$("#record_select_picker").on("changed.bs.select", function (e, clickedIndex, newValue, oldValue) {
    if (typeof selectionRecord['clicked_system'] === "undefined") {
        alert("First click on the system card ... ");
    } else {
        // selectionRecord['clikced_system'] is not undefined , get the url route based on selection
        const url_route = updateDataElement(this.value);
        const system_ip = selectionRecord['clicked_system'];
        fetchData(system_ip, url_route);
    }
});