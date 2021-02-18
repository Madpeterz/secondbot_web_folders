
function getBotFolders() {
    getCallBotWithToken("inventory/InventoryFolders", SetBotFolders);
}


function getBotRealUUID(callback) {
    if (ItemAPIBusy == false) {
        ItemAPIBusy = true;
        RealUUIDCallback = callback;
        getCallBotWithToken("inventory/getRealUUID/" + ItemUUID, setBotRealUUID);
    }
}

function setBotRealUUID(jsonRaw) {
    if (BasicChecks(jsonRaw, "RealUUID") == true) {
        if (jsonRaw != "Failed") {
            addToreplyLog('UUID: ' + jsonRaw);
            RealUUID = jsonRaw;
            RealUUIDCallback();
        }
    }
    ItemAPIBusy = false;
}

function RefreshFolder(node) {
    if (ItemAPIBusy == false) {
        ActiveNode = node;
        ItemAPIBusy = true;
        getCallBotWithToken("inventory/InventoryContents/" + ActiveNode.id, SetFolderContents);
    }
}

function InventoryRez() {
    if (ItemAPIBusy == false) {
        ItemAPIBusy = true;
        getCallBotWithToken("inventory/RezObject/" + ActiveNode.id, RezObjectFeedback);
    }
}

function RezObjectFeedback(value) {
    ItemAPIBusy = false;
    ActiveNode = null;
    BasicChecks(value, "RezObjectFeedback");
}

function InventoryRemove() {
    ItemAPIBusy = true;
    if (ItemIsFolder == true) {
        getCallBotWithToken("inventory/DeleteInventoryFolder/" + ItemUUID, SetDeleteResult);
    }
    else {
        getCallBotWithToken("inventory/DeleteInventoryItem/" + ItemUUID, SetDeleteResult);
    }
}


function InventoryRename() {
    ItemAPIBusy = true;
    postCallBotWithToken("inventory/RenameInventory/" + ItemUUID, { newname: $("#rename-newname").val() }, SetRenameResult);
}

function InventorySend() {
    ItemAPIBusy = true;
    getCallBotWithToken("inventory/SendItem/" + ItemUUID + "/" + $("#senditem-recipient").val(), SetSendResult);
}

function PlayGesture() {
    ItemAPIBusy = true;
    getCallBotWithToken("animation/PlayGesture/" + ItemUUID, PlayGestureFeedback);
}

function PlayGestureFeedback(value) {
    ItemAPIBusy = false;
    ActiveNode = null;
    BasicChecks(value, "PlayGestureFeedback");
}

function SetRenameResult(jsonRaw) {
    if (BasicChecks(jsonRaw, "InventoryRename") == true) {
        if (jsonRaw == "True") {
            var jstree = $("#jstree").jstree(true);
            jstree.rename_node(ActiveNode, $("#rename-newname").val());
        }
    }
    $("#senditem-recipient").val("");
    ActiveNode = null;
    ItemAPIBusy = false;
}

function SetSendResult(jsonRaw) {
    if (BasicChecks(jsonRaw, "InventorySend") == true) {
        addToreplyLog('Send inventory: ' + jsonRaw);
    }
    ActiveNode = null;
    ItemAPIBusy = false;
}

function SetDeleteResult(jsonRaw) {
    if (BasicChecks(jsonRaw, "InventoryDelete") == true) {
        addToreplyLog('Delete inventory: ' + jsonRaw);
        if (jsonRaw == "True") {
            var jstree = $("#jstree").jstree(true);
            jstree.delete_node(ActiveNode);
        }
    }
    ActiveNode = null;
    ItemAPIBusy = false;
}

function DeleteNode(node, isfolder) {
    if (ItemAPIBusy == false) {
        ItemName = node.text;
        ItemUUID = node.id;
        ItemIsFolder = isfolder;
        ActiveNode = node;
        showDeleteModal();
    }
}

function GestureNode(node) {
    if (ItemAPIBusy == false) {
        ItemName = node.text;
        ItemUUID = node.id;
        ItemIsFolder = false;
        ActiveNode = node;
        PlayGesture();
    }
}

function RezNode(node) {
    if (ItemAPIBusy == false) {
        ItemName = node.text;
        ItemUUID = node.id;
        ItemIsFolder = false;
        ActiveNode = node;
        InventoryRez();
    }
}

function RenameNode(node, isfolder) {
    if (ItemAPIBusy == false) {
        ItemName = node.text;
        ItemUUID = node.id;
        ItemIsFolder = isfolder;
        ActiveNode = node;
        showRenameModal();
    }
}

function SendNode(node) {
    if (ItemAPIBusy == false) {
        ItemName = node.text;
        ItemUUID = node.id;
        ItemIsFolder = false;
        ActiveNode = node;
        showSendModal();
    }
}

function PreviewNode(node) {
    if (ItemAPIBusy == false) {
        ItemName = node.text;
        ItemUUID = node.id;
        ItemIsFolder = false;
        ActiveNode = node;
        RealUUID = "";
        showTexturePreview();
    }
}


function InventoryMenu(node) {
    // The default set of all items
    var items = {
        refreshItem: {
            label: "Refresh",
            action: function () { RefreshFolder(node); }
        },
        renameItem: {
            label: "Rename",
            action: function () { RenameNode(node, false); }
        },
        renameFolder: {
            label: "Rename",
            action: function () { RenameNode(node, true); }
        },
        deleteItem: {
            label: "Delete",
            action: function () { DeleteNode(node, false); }
        },
        deleteFolder: {
            label: "Delete",
            action: function () { DeleteNode(node, true); }
        },
        SendItem: {
            label: "Send",
            action: function () { SendNode(node); }
        },
        RezObject: {
            label: "Rez",
            action: function () { RezNode(node); }
        },
        PreviewItem: {
            label: "Preview",
            action: function () { PreviewNode(node); }
        },
        PlayGesture: {
            label: "Play",
            action: function () { GestureNode(node); }
        }
    };

    var nodeObj = $("#" + node.id);
    var IsFolder = false;
    var IsPreviewable = false;
    var IsRezable = false;
    var isGesture = false;
    if (nodeObj.attr("type") == "Folder") {
        IsFolder = true;
    }
    if (nodeObj.attr("type") == "Texture") {
        IsPreviewable = true;
    }
    if (nodeObj.attr("type") == "Object") {
        IsRezable = true;
    }
    if (nodeObj.attr("type") == "Gesture") {
        isGesture = true;
    }

    if ((node.parent == "#") || (node.parent == RootFolderid)) {
        delete items.deleteItem;
        delete items.deleteFolder;
        delete items.renameItem;
        delete items.renameFolder;
        delete items.RezObject;
        delete items.PlayGesture;
    }

    if (IsFolder == true) {
        delete items.deleteItem;
        delete items.renameItem;
        delete items.SendItem;
    } else {
        delete items.deleteFolder;
        delete items.renameFolder;
        delete items.refreshItem;
    }

    if (IsRezable == false) {
        delete items.RezObject;
    }

    if (isGesture == false) {
        delete items.PlayGesture;
    }


    if (IsPreviewable == false) {
        delete items.PreviewItem;
    }
    return items;
}



function SetFolderContents(jsonRaw) {
    if (BasicChecks(jsonRaw, "Contents") == true) {
        try {
            jsondata = JSON.parse(jsonRaw);
            var missingids = [];
            var missingobjects = [];
            var jstree = $("#jstree").jstree(true);
            var children = jstree.get_node(ActiveNode).children;

            $.each(jsondata, function (i, item) {
                if (children.includes(item.id) == false) {
                    if (missingids.includes(item.id) == false) {
                        missingids.push(item.id);
                        missingobjects.push(item);
                    }
                }
            });

            $.each(missingobjects, function (i, item) {
                if (item.id != ActiveNode.id) {
                    var typename = item.typename.replace("Inventory", "");
                    jstree.create_node(ActiveNode.id, {
                        "li_attr": { "type": typename },
                        "id": item.id,
                        "text": item.name,
                        "icon": "images/tree/" + typename + ".png",

                    }, "last");
                }
            });

            expandNode(ActiveNode.id);
        }
        catch (err) {
            console.log(err);
            addToErrorReplyLog('Failed processing folder reply');
        }
    }
    ActiveNode = "";
    ItemAPIBusy = false;
}


function unpackInventoryMapFolder(JsonObject, parentid) {
    if (parentid == "#") {
        RootFolderid = JsonObject.id;
    }
    if (JsonObject.hasOwnProperty('id')) {
        if (JsonObject.hasOwnProperty('name')) {
            if (JsonObject.hasOwnProperty('subfolders')) {
                try {
                    var jstree = $('#jstree').jstree();
                    jstree.create_node(parentid, { "li_attr": { "type": "Folder" }, "id": JsonObject.id, "text": JsonObject.name }, "last");

                    $.each(JsonObject.subfolders, function (i, item) {
                        unpackInventoryMapFolder(item, JsonObject.id);
                    });
                }
                catch (err) {
                    addToErrorReplyLog("Error processing folder data strut: " + err);
                }
            }
        }
    }
    if (parentid == "#") {
        expandNode(JsonObject.id);
    }
}

function SetBotFolders(jsonRaw) {
    if (BasicChecks(jsonRaw, "Folders") == true) {
        try {
            jsondata = JSON.parse(jsonRaw);
            $('#jstree').off('ready.jstree');
            $('#inventory').html('<div id="jstree">Inventory not loaded</div>');
            $('#jstree')
                .jstree({
                    "core": {
                        "animation": 1,
                        "check_callback": true,
                        "themes": { "stripes": true }
                    },
                    "plugins": ["contextmenu"],
                    "contextmenu": {
                        "items": InventoryMenu
                    }
                })
                .on('dblclick.jstree', function (event) {
                    var rawnode = $(event.target).closest("li");
                    node = $('#jstree').jstree(true).get_node(rawnode.attr("id"))
                    if (rawnode.attr("type") == "Folder") {
                        RefreshFolder(node);
                    }
                })
                .on('ready.jstree', function (e, data) {
                    unpackInventoryMapFolder(jsondata, "#");
                    addToErrorReplyLog('Inventory folders ready');
                });


        }
        catch (err) {
            addToErrorReplyLog('Failed processing folder reply');
        }
    }
}