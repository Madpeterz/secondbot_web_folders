function getBotName() {
    postCallBotWithToken("Name", {}, SetBotName);
}

function getBotVersion() {
    postCallBotWithToken("Version", {}, SetBotVersion);
}

function getRegionName() {
    postCallBotWithToken("SimName", {}, SetRegionName);
}

function getRegionTile() {
    postCallBotWithToken("GetSimTexture", {regionname:currentregion}, SetRegionTile);
}

function getLocation() {
    postCallBotWithToken("GetPosition", {}, SetLocation);
}

function startAutoWalker() {
    if (mapdblclicktimerid != null) {
        window.clearInterval(mapdblclicktimerid);
        mapdblclicktimerid = null;
    }
    mapdblclick = false;
    if (currentZ >= 0) {
        console.log("walk to - end: " + walktoX + ", " + walktoY);
        postCallBotWithToken("AutoPilot", {x: walktoX, y:walktoY, z:currentZ}, autowalkerFeedback);
    }
}

function teleportInSim() {
    if (currentregion != "") {
        if (currentZ >= 0) {
            postCallBotWithToken("Teleport", {region: currentregion, x: walktoX, y:walktoY, z:currentZ}, teleportFeedback);
        }
    }
}

function autowalkerFeedback(value) {
    BasicChecks(value, "autowalkerFeedback");
}

function teleportFeedback(value) {
    BasicChecks(value, "teleportFeedback");
}

function FetchToken() {
    stoptimers();
    postCallBotWithToken("Hello", {}, SetToken);
}

function SetBotName(value) {
    if (BasicChecks(value, "BotName") == true) {
        setField("botname", value);
    }
}
function SetBotVersion(value) {
    if (BasicChecks(value, "BotVersion") == true) {
        setField("botversion", value);
    }
}
function SetRegionName(value) {
    if (BasicChecks(value, "RegionName") == true) {
        if (currentregion != value) {
            setField("regionname", value);
            currentregion = value;
            getRegionTile();
            getLocation();
        }
    }
}

function SetLocation(value) {
    if (BasicChecks(value, "Location") == true) {
        try {
            jsondata = JSON.parse(value);
            var needupdate = false;
            if (currentX != jsondata.x) {
                needupdate = true;
            }
            else if (currentY != jsondata.y) {
                needupdate = true;
            }
            if (needupdate == true) {
                currentX = jsondata.x;
                currentY = jsondata.y;
                currentZ = jsondata.z;
                setField("posX", jsondata.x);
                setField("posY", jsondata.y);
                setField("posZ", jsondata.z);
                restdotsonmap("mapme");
                add_person_to_map(false, true, currentX, currentY, "mapme");
            }
        }
        catch (err) {
            addToErrorReplyLog('Location error ' + err);
        }
    }
}

function SetRegionTile(value) {
    if (BasicChecks(value, "RegionTile") == true) {
        if (value != "Unable to find region") {
            $("#regionmap").css('background-image', 'url(http://secondlife.com/app/image/' + value + '/1)');
        }
    }
}


function SetToken() {
    addToreplyLog('Connected to bot');
    getBotName();
    getBotVersion();
    getBotFolders();
    StartBotTimers();
}