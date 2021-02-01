
function getBotFolders() {
    getCallBotWithToken("inventory/folders", SetBotFolders);
}

function RefreshFolder(node) {
    if (busy_with_folder == "") {
        busy_with_folder = node.id;
        getCallBotWithToken("inventory/contents/" + busy_with_folder, SetFolderContents);
    }
}

function DeleteNode(node) {
    console.log("Action DELETE for ");
}

function RenameNode(node) {
    console.log("Action RENAME for ");
}

function SendNode(node) {
    console.log("Action SEND for ");
}

function EditNode(node) {
    console.log("Action EDIT for ");
}

function PreviewNode(node) {
    console.log("Action Preview for ");
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
            action: function () { RenameNode(node); }
        },
        deleteItem: {
            label: "Delete",
            action: function () { DeleteNode(node); }
        },
        SendItem: {
            label: "Send",
            action: function () { SendNode(node); }
        },
        EditItem: {
            label: "Edit",
            action: function () { EditNode(node); }
        },
        PreviewItem: {
            label: "Preview",
            action: function () { PreviewNode(node); }
        }
    };

    var nodeObj = $("#" + node.id);
    var IsFolder = false;
    var IsEditable = false;
    var IsPreviewable = false;
    if (nodeObj.attr("type") == "Folder") {
        IsFolder = true;
    }
    if (nodeObj.attr("type") == "Notecard") {
        IsEditable = true;
    }
    if (nodeObj.attr("type") == "LSL") {
        IsEditable = true;
    }
    if (nodeObj.attr("type") == "Texture") {
        IsPreviewable = true;
    }

    if ((node.parent == "#") || (node.parent == RootFolderid)) {
        delete items.deleteItem;
        delete items.renameItem;
    }

    if (IsFolder == true) {
        delete items.SendItem;
    }
    if (IsFolder == false) {
        delete items.refreshItem;
    }
    if (IsEditable == false) {
        delete items.EditItem;
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
            var children = jstree.get_node(busy_with_folder).children;
            $.each(jsondata, function (i, item) {
                if (missingids.includes(item.id) == false) {
                    missingids.push(item.id);
                    missingobjects.push(item);
                }
            });

            $.each(missingobjects, function (i, item) {
                if (item.id != busy_with_folder) {
                    var typename = item.typename.replace("Inventory", "");
                    jstree.create_node(busy_with_folder, {
                        "li_attr": { "type": typename },
                        "id": item.id,
                        "text": item.name,
                        "icon": "images/tree/" + typename + ".png",

                    }, "last");
                }
            });

            expandNode(busy_with_folder);

            busy_with_folder = "";

        }
        catch (err) {
            console.log(err);
            busy_with_folder = "";
            addToreplyLog('Failed processing folder reply');
        }
    }
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
                    console.log("Error processing folder data strut: " + err);
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
            $('#jstree').html("");
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
                }).on('ready.jstree', function (e, data) {
                    unpackInventoryMapFolder(jsondata, "#");
                    addToreplyLog('Inventory folders ready');
                });

        }
        catch (err) {
            console.log(err);
            addToreplyLog('Failed processing folder reply');
        }
    }
}