function sendLocalChat(sendmessage) {
    postCallBotWithToken("chat/localchatSay", { message: sendmessage }, updateLocalchatDisplay);
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