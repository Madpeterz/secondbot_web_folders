function StartBotTimers() {
    setInterval(getLocalchatHistory, 750);
    setInterval(updateBadges, 3000);
}

function updateBadges() {
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

    $("#connectform").addClass("d-none");
}

function getLocalchatHistory() {
    getCallBotWithToken("chat/localchatHistory", updateLocalchatDisplay);
}