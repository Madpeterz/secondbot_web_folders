function getimList() {
    getCallBotWithToken("ims/chatwindows", SetimList);
}

function getimsHaveUnread() {
    getCallBotWithToken("ims/haveunreadims", SetimchatHaveUnread);
}

function getimsWithUnread() {
    getCallBotWithToken("ims/listwithunread", SetimsWithUnread);
}

function sendImChat(sendmessage) {
    if (activeTab == "ims") {
        if (selectedim != "") {
            if (knownims.includes(selectedim) == true) {
                ImSend(sendmessage, selectedim);

            }
        }
    }
}

function ImSend(sendmessage, avatar) {
    postCallBotWithToken("ims/sendimchat/" + avatar, { message: sendmessage }, imChatReply);

}

function getimChatHistory() {
    if (activeTab == "ims") {
        if (selectedim != "") {
            if (knownims.includes(selectedim) == true) {
                getCallBotWithToken("ims/getimchat/" + selectedim, SetimchatHistory);
            }
        }
    }
}

function imChatReply(jsonRaw) {
    if (BasicChecks(jsonRaw, "imchatReply") == true) {
        if (jsonRaw != "ok") {
            console.log("imchat error:" + jsonRaw);
        }
    }
}


var imchatwindow = `
<div class="tab-pane fade" id="im-[[IMUUID]]" role="tabpanel" aria-labelledby="im-[[IMUUID]]-tab">
<h4>im: [[IMNAME]]</h4>
<p>Last updated: <span id="im-[[IMUUID]]-updated">Never</span></p>
<textarea cols="115" rows="10" id="im-[[IMUUID]]-history" READONLY></textarea>
<form class="form-inline imchatform" name="imchatinput" id="im-[[IMUUID]]-chatform" action="#" method="post">
<input type="text" id="im-[[IMUUID]]-chatinput" value="" size="50"> &nbsp; <button type="submit" class="btn btn-primary mb-2">Send</button>
</form>
</div>
`;
var imchatnavitem = `
<a class="nav-link" data-tabname="im-[[IMUUID]]" id="v-pills-im-[[IMUUID]]-tab"
data-toggle="pill" href="#im-[[IMUUID]]" role="tab" aria-controls="v-pills-im-[[IMUUID]]"
aria-selected="true">[[IMSHORTNAME]] <span id="imchat-[[IMUUID]]-badge" class="d-none badge badge-danger">#</span></a>
`


function SetimList(jsonRaw) {
    if (BasicChecks(jsonRaw, "imsList") == true) {
        try {
            jsondata = JSON.parse(jsonRaw);
            $.each(jsondata, function (i, item) {
                if (knownims.includes(i) == false) {
                    knownims.push(i);
                    var navitem = imchatnavitem;
                    var windowitem = imchatwindow;
                    navitem = navitem.replaceAll("[[IMUUID]]", i);
                    windowitem = windowitem.replaceAll("[[IMUUID]]", i);
                    navitem = navitem.replaceAll("[[IMNAME]]", item);
                    windowitem = windowitem.replaceAll("[[IMNAME]]", item);
                    var shortname = item;
                    if (shortname.length > 15) {
                        shortname = shortname.substr(0, 15);
                    }
                    navitem = navitem.replaceAll("[[IMSHORTNAME]]", shortname);
                    $('#v-pills-im-tab').html($("#v-pills-im-tab").html() + navitem);
                    $('#ims-pills-tabContent').html($("#ims-pills-tabContent").html() + windowitem);
                }
            });
            reset_events();
        }
        catch (err) {
            addToErrorReplyLog("imlist " + err);
        }

    }
}

function SetimchatHaveUnread(jsonRaw) {
    if (BasicChecks(jsonRaw, "imChatUnreadCheck") == true) {
        imshaveunread = false;
        if (jsonRaw == "True") {
            imshaveunread = true;
        }
    }
}

function SetimsWithUnread(jsonRaw) {
    if (BasicChecks(jsonRaw, "imsListWithUnread") == true) {
        $.each(knownims, function (i, item) {
            $("#imchat-" + item + "-badge").addClass("d-none");
        });
        try {
            jsondata = JSON.parse(jsonRaw);
            $.each(jsondata, function (i, item) {
                $("#imchat-" + item.Guid + "-badge").removeClass("d-none");
            });
        }
        catch (err) {
            addToErrorReplyLog("ims badge status: " + err);
        }
    }
}

function SetimchatHistory(jsonRaw) {
    if (BasicChecks(jsonRaw, "imchatHistory") == true) {
        if (activeTab == "ims") {
            if (selectedim != "") {
                if (knownims.includes(selectedim) == true) {
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
                        setField("im-" + selectedim + "-updated", time);
                        setField("im-" + selectedim + "-history", output);
                    }
                    catch (err) {
                        addToErrorReplyLog('imchatHistory error ' + err);
                    }
                }
            }
        }
    }
}