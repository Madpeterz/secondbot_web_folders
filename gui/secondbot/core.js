function getBotName() {
    getCallBotWithToken("info/Name", SetBotName);
}

function getBotVersion() {
    getCallBotWithToken("info/Version", SetBotVersion);
}

function getRegionName() {
    getCallBotWithToken("info/SimName", SetRegionName);
}

function getRegionTile() {
    getCallBotWithToken("estate/GetSimTexture/" + currentregion, SetRegionTile);
}

function getLocation() {
    getCallBotWithToken("info/GetPosition", SetLocation);
}

function startAutoWalker() {
    if (mapdblclicktimerid != null) {
        window.clearInterval(mapdblclicktimerid);
        mapdblclicktimerid = null;
    }
    mapdblclick = false;
    if (currentZ >= 0) {
        console.log("walk to - end: " + walktoX + ", " + walktoY);
        getCallBotWithToken("core/AutoPilot/" + walktoX + "/" + walktoY + "/" + currentZ, autowalkerFeedback);
    }
}

function teleportInSim() {
    if (currentregion != "") {
        if (currentZ >= 0) {
            getCallBotWithToken("core/Teleport/" + currentregion + "/" + walktoX + "/" + walktoY + "/" + currentZ, teleportFeedback);
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
    now = Now();
    var dif = now - lastfetchedtoken;
    if (dif > 10) {
        lastfetchedtoken = now;
        var raw = now + webUIcode;
        HashResult = sha1(raw).substr(0, 10);
        callBot("core/GetToken", "post", { authcode: HashResult, unixtimegiven: now }, SetToken);
    }
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


function SetToken(token) {
    if (token != "error") {
        if (token != "Authcode not accepted") {
            webUItoken = token;
            if (webUItoken.length > 0) {
                addToreplyLog('Connected to bot');
                getBotName();
                getBotVersion();
                getBotFolders();
                StartBotTimers();
            } else {
                addToErrorReplyLog("Token is invaild please reload");
            }
        } else {
            addToErrorReplyLog("Bad auth code");
        }
    } else {
        addToErrorReplyLog("Invaild token");
    }
}