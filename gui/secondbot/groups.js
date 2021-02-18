function getGroupList() {
    getCallBotWithToken("group/GetGroupList", SetGroupList);
}

function getGroupsHaveUnread() {
    getCallBotWithToken("group/GroupchatAnyUnread", SetGroupchatHaveUnread);
}

function getGroupsWithUnread() {
    getCallBotWithToken("group/GroupchatListAllUnreadGroups", SetGroupsWithUnread);
}

function sendGroupchat(sendmessage) {
    if (activeTab == "groups") {
        if (selectedgroup != "") {
            if (knowngroups.includes(selectedgroup) == true) {
                postCallBotWithToken("group/Groupchat/" + selectedgroup, { message: sendmessage }, GroupChatReply);
            }
        }
    }

}

function getGroupChatHistory() {
    if (activeTab == "groups") {
        if (selectedgroup != "") {
            if (knowngroups.includes(selectedgroup) == true) {
                getCallBotWithToken("group/GroupchatHistory/" + selectedgroup, SetGroupchatHistory);
            }
        }
    }
}

function GroupChatReply(jsonRaw) {
    if (BasicChecks(jsonRaw, "GroupchatReply") == true) {
        if (jsonRaw != "Processing") {
            console.log("Groupchat error:" + jsonRaw);
        }
    }
}


var groupchatwindow = `
<div class="tab-pane fade" id="group-[[GROUPUUID]]" role="tabpanel" aria-labelledby="group-[[GROUPUUID]]-tab">
<h4>Group: [[GROUPNAME]]</h4>
<p>Last updated: <span id="group-[[GROUPUUID]]-updated">Never</span></p>
<textarea cols="115" rows="10" id="group-[[GROUPUUID]]-history" READONLY></textarea>
<form class="form-inline groupchatform" name="groupchatinput" id="group-[[GROUPUUID]]-chatform" action="#" method="post">
<input type="text" id="group-[[GROUPUUID]]-chatinput" value="" size="50"> &nbsp; <button type="submit" class="btn btn-primary mb-2">Send</button>
</form>
</div>
`;
var groupchatnavitem = `
<a class="nav-link" data-tabname="group-[[GROUPUUID]]" id="v-pills-group-[[GROUPUUID]]-tab"
data-toggle="pill" href="#group-[[GROUPUUID]]" role="tab" aria-controls="v-pills-group-[[GROUPUUID]]"
aria-selected="true">[[GROUPSHORTNAME]] <span id="groupchat-[[GROUPUUID]]-badge" class="d-none badge badge-danger">#</span></a>
`


function SetGroupList(jsonRaw) {
    if (BasicChecks(jsonRaw, "GroupsList") == true) {
        try {
            jsondata = JSON.parse(jsonRaw);
            $.each(jsondata, function (i, item) {
                if (knowngroups.includes(i) == false) {
                    knowngroups.push(i);
                    var navitem = groupchatnavitem;
                    var windowitem = groupchatwindow;
                    navitem = navitem.replaceAll("[[GROUPUUID]]", i);
                    windowitem = windowitem.replaceAll("[[GROUPUUID]]", i);
                    navitem = navitem.replaceAll("[[GROUPNAME]]", item);
                    windowitem = windowitem.replaceAll("[[GROUPNAME]]", item);
                    var shortname = item;
                    if (shortname.length > 15) {
                        shortname = shortname.substr(0, 15);
                    }
                    navitem = navitem.replaceAll("[[GROUPSHORTNAME]]", shortname);
                    $('#v-pills-group-tab').html($("#v-pills-group-tab").html() + navitem);
                    $('#groups-pills-tabContent').html($("#groups-pills-tabContent").html() + windowitem);
                }
            });
            reset_events();
        }
        catch (err) {
            addToErrorReplyLog("grouplist " + err);
        }

    }
}

function SetGroupchatHaveUnread(jsonRaw) {
    if (BasicChecks(jsonRaw, "GroupChatUnreadCheck") == true) {
        groupshaveunread = false;
        if (jsonRaw == "True") {
            groupshaveunread = true;
        }
    }
}

function SetGroupsWithUnread(jsonRaw) {
    if (BasicChecks(jsonRaw, "GroupsListWithUnread") == true) {
        $.each(knowngroups, function (i, item) {
            $("#groupchat-" + item + "-badge").addClass("d-none");
        });
        try {
            jsondata = JSON.parse(jsonRaw);
            $.each(jsondata, function (i, item) {
                $("#groupchat-" + item.Guid + "-badge").removeClass("d-none");
            });
        }
        catch (err) {
            addToErrorReplyLog("groups badge status: " + err);
        }
    }
}

function SetGroupchatHistory(jsonRaw) {
    if (BasicChecks(jsonRaw, "GroupchatHistory") == true) {
        if (activeTab == "groups") {
            if (selectedgroup != "") {
                if (knowngroups.includes(selectedgroup) == true) {
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
                        setField("group-" + selectedgroup + "-updated", time);
                        setField("group-" + selectedgroup + "-history", output);
                    }
                    catch (err) {
                        addToErrorReplyLog('GroupchatHistory error ' + err);
                    }
                }
            }
        }
    }
}