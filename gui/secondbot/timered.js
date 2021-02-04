setTimeout(reset_events, 1000);

function StartBotTimers() {
    stoptimers();
    if (webUItoken.length > 0) {
        friendsfirstload = true;
        setTimeout(getGroupList, 300); // fetch group list [once]
        setTimeout(getimList, 300); // fetch group list [once]
        setTimeout(getRegionName, 300); // fetch region name [once]
        setTimeout(getLocation, 200); // fetch location [once]
        setTimeout(getFriendsList, 300); // update friendslist [once]

        setInterval(getGroupList, 60000); // update grouplist (once a min)
        setInterval(getimList, 5000); // update im windows (every 5 secs)



        setInterval(getLocalchatHistory, 1250); // update localchat (every 1.2secs)
        setInterval(getNearMe, 5000); // update localchat (every 5secs)

        setInterval(getFriendsList, 2000); // update localchat (every 2secs)


        setInterval(getimsHaveUnread, 1250); // update im unread status (every 1.2secs)
        setInterval(getimChatHistory, 1250); // update im history (every 1.2secs)

        setInterval(getGroupsHaveUnread, 1250); // update groupchat unread status (every 1.2secs)
        setInterval(getGroupChatHistory, 1250); // update groupchat history (every 1.2secs)


        setInterval(updateGrouppedBadges, 5000); // update badges [Main menu] (every 5secs)
        setInterval(updateBadges, 5000); // update badges [Group menu] (every 5secs)

        setInterval(getRegionName, 15000); // update region name every 15 secs
        setInterval(getLocation, 1000); // update location every 3 secs
    } else {
        console.log("Error: webUItoken is zero len but timers started");
    }
}

function updateBadges() {
    $("#connectform").addClass("d-none");
    updateLocalchatBadge();
    updateGroupchatBadge();
    updateimchatBadge();
}

function updateGrouppedBadges() {
    if (activeTab == "groups") {
        getGroupsWithUnread();
    }
    else if (activeTab == "ims") {
        getimsWithUnread();
    }
}

function updateGroupchatBadge() {
    if (activeTab != "groups") {
        if (groupshaveunread == true) {
            $("#groupchat-badge").removeClass("d-none");
            $("#groupchat-badge").html("X");
        } else {
            $("#groupchat-badge").addClass("d-none");
        }
    }
    else {
        $("#groupchat-badge").addClass("d-none");
    }
}

function updateimchatBadge() {
    if (activeTab != "ims") {
        if (imshaveunread == true) {
            $("#imchat-badge").removeClass("d-none");
            $("#imchat-badge").html("X");
        } else {
            $("#imchat-badge").addClass("d-none");
        }
    }
    else {
        $("#imchat-badge").addClass("d-none");
    }
}

function updateLocalchatBadge() {
    if (activeTab != "localchat") {
        if (localchat_changes_from_last_displayed > 0) {
            $("#localchat-badge").removeClass("d-none");
            $("#localchat-badge").html(localchat_changes_from_last_displayed);
        } else {
            $("#localchat-badge").addClass("d-none");
        }
    }
    else {
        $("#localchat-badge").addClass("d-none");
        localchat_changes_from_last_displayed = 0;
    }
}

function getLocalchatHistory() {
    getCallBotWithToken("chat/localchathistory", updateLocalchatDisplay);
}