

$(document).ready(function () {
    webUIcode = localStorage.getItem("webuicode");
    if (webuicode != null) {
        url = localStorage.getItem("apiurl");
        if (url != null) {
            SignedCode = localStorage.getItem("SignedCode");
            addToreplyLog("starting connection to endpoint: " + url);
            $("#disconnectform").removeClass("d-none");
            $("#connectform").addClass("d-none");
            FetchToken();
        } else {
            url = "";
            webuicode = "";
        }
    } else {
        webuicode = "";
    }
});

function Now() {
    return Math.round(+new Date() / 1000);
}

function getCallBotWithToken(command, callback) {
    var action = command + "/" + webUItoken;
    callBot(action, "get", {}, callback);
}

function postCallBotWithToken(command, args, callback) {
    var action = command + "/" + webUItoken;
    callBot(action, "post", args, callback);
}

function expandNode(nodeID) {
    // Expand all nodes up to the root (the id of the root returns as '#')
    while (nodeID != '#') {
        // Open this node
        $("#jstree").jstree("open_node", nodeID)
        // Get the jstree object for this node
        var thisNode = $("#jstree").jstree("get_node", nodeID);
        // Get the id of the parent of this node
        nodeID = $("#jstree").jstree("get_parent", thisNode);
    }
}

function callBot(command, method, postdata, callback) {
    if (errors_counter > 15) {
        errors_counter = 0;
        addToreplyLog('Error limit reached stopping timers and disconnecting');
        webUItoken = "";
        for (var i = 1; i < 99999; i++) {
            window.clearInterval(i);
        }
    }
    else {
        $.ajax({
            type: method,
            url: url + "/" + command,
            data: postdata,
            success: function (data) {
                try {
                    if (data.hasOwnProperty('reply')) {
                        callback.call(this, data.reply);
                    } else {
                        callback.call(this, "error");
                    }
                }
                catch (err) {
                    console.log("Json error:" + data);
                    console.log("Json error:" + err);
                    callback.call(this, "error");
                }

            },
            error: function (data) {
                callback.call(this, "error");
            }
        });
    }
}

function BasicChecks(value, sourcename) {
    if (value != "error") {
        if (value != "Authcode not accepted") {
            if (value != "Token not accepted") {
                errors_counter = 0;
                return true;
            }
            webUItoken = "";
            for (var i = 1; i < 99999; i++) {
                window.clearInterval(i);
            }
            addToreplyLog('Request: ' + sourcename + ' ' + value);
            FetchToken();
            return false;
        }
        addToreplyLog('Request: ' + sourcename + ' ' + value);
        return false;
    }
    errors_counter++;
    addToreplyLog('Request: ' + sourcename + ' error: ' + value);
    return false;
}

function addToreplyLog(message) {
    $('#http_result').html(message + "\n" + $('#http_result').html());
}


function setField(field, value) {
    if (BasicChecks(value, field) == true) {
        $('#' + field).html(value);
    }
}
