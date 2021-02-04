var FriendsEntry = `
<li>
<button type="button" class="btn btn-[[ONLINESTATUS]] mb-2 imavatar" data-name="[[AVATARNAME]]" data-uuid="[[AVATARUUID]]">[[AVATARNAME]]</button>
</li>
`;

function getFriendsList() {
    if ((activeTab == "friends") || (friendsfirstload == true)) {
        friendsfirstload = false;
        getCallBotWithToken("core/friends", setFriendsList);
    }
}

function setFriendsList(jsonRaw) {
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    setField("friendslistupdated", time);
    if (BasicChecks(jsonRaw, "Friendslist") == true) {
        try {
            var output = "";
            jsondata = JSON.parse(jsonRaw);
            var newhash = "";
            var newfrienduuids = [];
            $.each(jsondata, function (i, item) {
                if (item.hasOwnProperty('id')) {
                    newhash = sha1(newhash + item.name).substr(0, 10);
                    var entry = FriendsEntry;
                    entry = entry.replaceAll("[[AVATARUUID]]", item.id);
                    entry = entry.replaceAll("[[AVATARNAME]]", item.name);
                    newfrienduuids.push(item.id);
                    if (item.online == true) {
                        entry = entry.replaceAll("[[ONLINESTATUS]]", "success");
                    } else {
                        entry = entry.replaceAll("[[ONLINESTATUS]]", "danger");
                    }
                    output = output + entry;
                }
            });
            if (newhash != "") {
                if (newhash != friendshash) {
                    friendshash = newhash;
                    frienduuids = newfrienduuids;
                    setField("friendlist", output);
                    reset_events();
                }
            }
        }
        catch (err) {
            addToErrorReplyLog('Friendslist error ' + err);
        }
    }

}