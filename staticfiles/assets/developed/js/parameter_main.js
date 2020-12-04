var selectionRecord = {}
var tableRecord = {}


$("#parameter_picker").on("changed.bs.select", function (e, clickedIndex, newValue, oldValue) {
    if ($('#system_picker').val() == "") {
        alert("Select a system first");
    }
    else {
        let url_route = "";
        switch (this.value) {
            case "Network":
                url_route = "network";
                break;
            default:
                url_route = "parameter"
                break;
        }
        const api_url = "http://" + $('#system_picker').val() + "/api/parameter/" + url_route + "/";
        console.log(api_url);
    }
});