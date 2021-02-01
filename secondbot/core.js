function getBotName() {
    getCallBotWithToken("core/name", SetBotName);
}

function getBotVersion() {
    getCallBotWithToken("core/version", SetBotVersion);
}

function FetchToken() {
    now = Now();
    var raw = now + webUIcode;
    HashResult = sha1(raw).substr(0, 10);
    callBot("core/gettoken", "post", { authcode: HashResult, unixtimegiven: now }, SetToken);
}

function SetBotName(value) {
    setField("botname", value);
}
function SetBotVersion(value) {
    setField("botversion", value);
}


function SetToken(token) {
    if (token != "error") {
        if (token != "Authcode not accepted") {
            webUItoken = token;
            addToreplyLog('Connected to bot');
            getBotName();
            getBotVersion();
            getBotFolders();
            StartBotTimers();
        } else {
            addToreplyLog('Bad auth!');
        }
    } else {
        addToreplyLog('Error!');
    }
}