function sendLocalChat(sendmessage) {
    postCallBotWithToken("chat/localchatSay", { message: sendmessage }, updateLocalchatDisplay);
}

function getNearMe() {
    getCallBotWithToken("core/nearme", setNearMe);
}

var nearMeEntry = '<li><button type="button" class="btn btn-primary mb-2 imavatar" data-name="[[AVATARNAME]]" data-uuid="[[AVATARUUID]]">[[AVATARNAME]]</button></li>';

function setNearMe(jsonRaw) {
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    setField("nearmeupdated", time);
    if (BasicChecks(jsonRaw, "NearMe") == true) {
        try {
            var output = "";
            jsondata = JSON.parse(jsonRaw);
            var newhash = "";
            $.each(jsondata, function (i, item) {
                newhash = sha1(newhash + item).substr(0, 10);
                var entry = nearMeEntry;
                entry = entry.replaceAll("[[AVATARUUID]]", i);
                entry = entry.replaceAll("[[AVATARNAME]]", item);
                output = output + entry;
            });
            if (newhash != "") {
                if (newhash != nearme_hash) {
                    nearme_hash = newhash;
                    setField("nearmelist", output);
                    reset_events();
                }
            }
        }
        catch (err) {
            addToreplyLog('NearMe error ' + err);
        }
    }
}



function updateLocalchatDisplay(jsonRaw) {
    if (BasicChecks(jsonRaw, "localchathistory") == true) {
        try {
            var output = "";
            jsondata = JSON.parse(jsonRaw);
            var newhash = "";
            var addon = "";
            $.each(jsondata, function (i, item) {
                newhash = sha1(newhash + item).substr(0, 10);
                output = output + addon + item;
                addon = "\n";
            });
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            setField("localchatupdated", time);
            if (localchat_last_hash != newhash) {
                localchat_last_hash = newhash;
                if (activeTab != "localchat") {
                    localchat_changes_from_last_displayed++;
                }
                setField("localchathistory", output);
            }
        }
        catch (err) {
            addToreplyLog('localchat error ' + err);
        }
    }
}