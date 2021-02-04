

$(document).ready(function () {
    reset_events();
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

function stoptimers(removetoken) {
    for (var i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    errors_counter = 0;
}

function BasicChecks(value, sourcename) {
    if (value == "Authcode not accepted") {
        webUItoken = "";
        stoptimers();
        addToreplyLog("Error: Auth code rejected - shutting down");
        return false;
    }
    if (value == "Token not accepted") {
        addToErrorReplyLog('Request: ' + sourcename + ' ' + value);
        FetchToken();
        return false;
    }
    var vcheck = value + "thisisatest";
    if (vcheck.startsWith("error") == true) {
        addToErrorReplyLog('Request: ' + sourcename + ' ' + value);
        return false;
    }
    if (vcheck.startsWith("Error") == true) {
        addToErrorReplyLog('Request: ' + sourcename + ' ' + value);
        return false;
    }
    errors_counter--;
    if (errors_counter < 0) {
        errors_counter = 0;
    }
    return true;
}

function addToErrorReplyLog(message) {
    errors_counter++;
    addToreplyLog(message);
    if (errors_counter >= 10) {
        webUItoken = "";
        stoptimers();
        addToreplyLog("Stacking errors limit reached - shutting down");
    }
}

function addToreplyLog(message) {
    $('#http_result').html(message + "\n" + $('#http_result').html());
}


function setField(field, value) {
    if (BasicChecks(value, field) == true) {
        $('#' + field).html(value);
    }
}

var rollingmapid = 0;
function addtomap(X, Y, image, useclass) {
    rollingmapid++;
    if (rollingmapid > 900) {
        rollingmapid = 0;
    }
    var pixalsize = 13;
    var half = Math.floor(pixalsize / 2);
    $('#regionmap').prepend('<img class="noselect ' + useclass + '" id="mapdot' + rollingmapid + '" src="images/' + image + '" />');
    $('#mapdot' + rollingmapid).css('position', 'absolute')
        .css('top', (Y - half) + 'px')
        .css('left', (X - half) + 'px')
        .css('width', '' + pixalsize + 'px')
        .css('height', '' + pixalsize + 'px')
        .css('z-index', 4);
};


function restdotsonmap(classname) {
    $("." + classname).remove();
}

function add_person_to_map(isfriend, isyou, x, y, classname) {
    var xpercent = (x / 256) * 100;
    var ypercent = (y / 256) * 100;
    var realxpercent = (500 / 100) * xpercent;
    var realypercent = 500 - (500 / 100) * ypercent;
    var useimage = "someone.png";
    if (isfriend == true) {
        useimage = "friend.png";
    } else if (isyou == true) {
        useimage = "you.png";
    }

    addtomap(realxpercent, realypercent, useimage, classname);
}
