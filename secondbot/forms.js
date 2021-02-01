$(document).ready(function () {
    $("#connectform").submit(function (e) {
        e.preventDefault();
        localStorage.setItem("webuicode", $("#webuicode").val());
        localStorage.setItem("apiurl", $("#apiurl").val());
        localStorage.setItem("SignedCode", $("#signedcommand").val());
        window.location = window.location.href.split("?")[0];
    });
    $("#disconnectform").submit(function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location = window.location.href.split("?")[0];
    });
    $("#localchatform").submit(function (e) {
        e.preventDefault();
        var message = $("#localchatinput").val();
        $("#localchatinput").val("");
        sendLocalChat(message);

    });
});