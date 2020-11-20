$(document).ready(function () {
    alias_to_ip_map.forEach(element => {
        $.ajax({
                method: "GET",
                url: "http://" + element.ip + "/api/camera/status/",
                headers: {
                    'Authorization': 'Bearer ' + tokens[element.ip]
                },
            })
            .done(function (json) {
                if (!json.status) {
                    $('#camera_' + element.type + '_status').removeClass("executing").addClass("notexecuting");
                } else {
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

    $('#detection_table').DataTable( {
        paging : false,
        scrollY: '25vh',
        scrollCollapse: true,
        "sScrollX": "100%",
        "scrollX": true,
        searching : false,
        data: [],
        columns: [
            { title: "Calling Process" },
            { title: "Detection Time" },
            { title: "# of captures" },
            { title: "Address" },
        ]
    } );

    $('#message_table').DataTable( {
        paging : false,
        scrollY: '25vh',
        scrollCollapse: true,
        "sScrollX": "100%",
        "scrollX": true,
        searching : false,
        data: [],
        columns: [
            { title: "ID" },
            { title: "Function" },
            { title: "Message" },
            { title: "Timestamp" },
        ]
    } );

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
                if (json.success) {
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
                if (json.success) {
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
    const clicked_system_ip = $(this).find('h6').text();

    $('#message_table').DataTable().clear().draw();
    $.ajax({
        method: "GET",
        url: "http://" + clicked_system_ip + "/api/camera/message/",
        headers: {
            'Authorization': 'Bearer ' + tokens[clicked_system_ip]
        }
    })
    .done(function (json) {
        data_to_feed = [];
        json.forEach(element => {
            // turn list of dict+ionary to a list of lists 
            let temp = Object.keys(element).map(function(key){
                return element[key];
            });
            data_to_feed.push(temp);
        });

        $('#message_table').DataTable().rows.add(data_to_feed).columns.adjust().draw();
    })
    .fail(function () {
        console.log("error getting messages for ... " + element.ip);
    });

    $('#detection_table').DataTable().clear().draw();
    $.ajax({
        method: "GET",
        url: "http://" + clicked_system_ip + "/api/camera/detection/",
        headers: {
            'Authorization': 'Bearer ' + tokens[clicked_system_ip]
        }
    })
    .done(function (json) {
        data_to_feed = [];
        json.forEach(element => {
            // turn list of dict+ionary to a list of lists 
            let temp = Object.keys(element).map(function(key){
                return element[key];
            });
            data_to_feed.push(temp);
        });

        $('#detection_table').DataTable().rows.add(data_to_feed).columns.adjust().draw();
    })
    .fail(function () {
        console.log("error getting messages for ... " + element.ip);
    });



});