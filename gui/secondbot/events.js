function reset_events() {
    $(document).off("click", "#givebutton");
    $(document).off("click", "#delete-button");
    $(document).off("click", "#rename-button");
    $(document).off("click", "#sendbutton");
    $(document).off("click", ".imavatar");
    $(document).off("click", ".newimwindow");
    $(document).off('submit', "#connectform");
    $(document).off('submit', "#disconnectform");
    $(document).off('submit', '.groupchatform');
    $(document).off('submit', '.localchatform');



    $(document).off('shown.bs.tab', 'a[data-toggle="pill"]');

    $(document).on('submit', '#connectform', function (e) {
        e.preventDefault();
        localStorage.setItem("webuicode", $("#webuicode").val());
        localStorage.setItem("apiurl", $("#apiurl").val());
        localStorage.setItem("SignedCode", $("#signedcommand").val());
        window.location = window.location.href.split("?")[0];
    });

    $(document).on('submit', '#disconnectform', function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location = window.location.href.split("?")[0];
    });

    $(document).on("shown.bs.tab", 'a[data-toggle="pill"]', function (e) {
        if (e.target.dataset.tabname.startsWith("group-") == true) {
            selectedgroup = e.target.dataset.tabname.replace("group-", "");
        }
        else if (e.target.dataset.tabname.startsWith("im-") == true) {
            selectedim = e.target.dataset.tabname.replace("im-", "");
        }
        else {
            activeTab = e.target.dataset.tabname;
        }
    });


    $(document).on('submit', '.groupchatform', function (e) {
        e.preventDefault();
        if (activeTab == "groups") {
            if (selectedgroup != "") {
                if (knowngroups.includes(selectedgroup) == true) {
                    var message = $("#group-" + selectedgroup + "-chatinput").val();
                    $("#group-" + selectedgroup + "-chatinput").val("");
                    sendGroupchat(message);
                }
            }
        }
    });

    $(document).on('submit', '.localchatform', function (e) {
        e.preventDefault();
        var message = $("#localchatinput").val();
        $("#localchatinput").val("");
        sendLocalChat(message);
    });

    $(document).on('submit', '.imchatform', function (e) {
        e.preventDefault();
        if (activeTab == "ims") {
            if (selectedim != "") {
                if (knownims.includes(selectedim) == true) {
                    var message = $("#im-" + selectedim + "-chatinput").val();
                    $("#im-" + selectedim + "-chatinput").val("");
                    sendImChat(message);
                }
            }
        }
    });

    $(document).on("click", "#givebutton", function (event) {
        $('#senditemwindow').modal('hide');
        InventorySend();
    });

    $(document).on("click", "#delete-button", function (event) {
        $('#deleteitemwindow').modal('hide');
        InventoryRemove();
    });

    $(document).on("click", "#rename-button", function (event) {
        $('#renamewindow').modal('hide');
        InventoryRename();
    });

    $(document).on("click", "#sendbutton", function (event) {
        $('#imwindow').modal('hide');
        ImSend($("#newim-text").val(), $("#newim-recipient").val());
        $('#v-pills-ims-tab').tab('show');
    });

    $(document).on("click", ".imavatar", function (event) {
        $('#newim-recipient').val($(this).attr('data-name'));
        $('#newim-text').val("");
        $('#imwindow').modal('show');
    });

    $(document).on("click", ".newimwindow", function (event) {
        $('#newim-recipient').val("");
        $('#newim-text').val("");
        $('#imwindow').modal('show');
    });
}