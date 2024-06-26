function sendLocalChat(sendmessage) {
    postCallBotWithToken("Say", { channel:0, message: sendmessage }, updateLocalchatDisplay);
}

function getNearMe() {
    postCallBotWithToken("NearmeWithDetails", {}, setNearMeDetailed);
}

function getLocalchatHistory() {
    postCallBotWithToken("LocalChatHistory", {}, updateLocalchatDisplay);
}

var nearMeEntry = `
<tr>
<td><button type="button" class="btn btn-[[BUTTONCOLOR]] mb-2 imavatar" data-name="[[AVATARNAME]]" data-uuid="[[AVATARUUID]]">[[AVATARNAME]]</button></td>
<td>[[AVATARRANGE]]</td>
</tr>
`;

var nearMeTableHeader = `
<tr>
<th>Name</td><th>Distance</th>
</tr>
`;

function setNearMeDetailed(jsonRaw) {
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    setField("nearmeupdated", time);
    if (BasicChecks(jsonRaw, "NearMeDetailed") == true) {
        try {
            var output = nearMeTableHeader;
            jsondata = JSON.parse(jsonRaw);
            var newhash = "";
            $.each(jsondata, function (i, item) {
                newhash = sha1(newhash + item.range + item.id).substr(0, 10);
            });
            if (newhash != nearme_hash) {
                nearme_hash = newhash;
                restdotsonmap("worldmapdot");
                $.each(jsondata, function (i, item) {
                    var entry = nearMeEntry;
                    entry = entry.replaceAll("[[AVATARUUID]]", item.id);
                    entry = entry.replaceAll("[[AVATARNAME]]", item.name);
                    entry = entry.replaceAll("[[AVATARRANGE]]", item.range);
                    if (frienduuids.includes(item.id) == true) {
                        add_person_to_map(true, false, item.x, item.y, "worldmapdot");
                        entry = entry.replaceAll("[[BUTTONCOLOR]]", "success");
                    } else {
                        add_person_to_map(false, false, item.x, item.y, "worldmapdot");
                        entry = entry.replaceAll("[[BUTTONCOLOR]]", "danger");
                    }
                    output = output + entry;
                });
                setField("nearmelist", output);
                reset_events();
            }
        }
        catch (err) {
            addToErrorReplyLog('NearMe error ' + err);
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
            addToErrorReplyLog('localchat error ' + err);
        }
    }
}



