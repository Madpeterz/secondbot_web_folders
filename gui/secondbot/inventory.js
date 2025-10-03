
var useCacheInventory = true;
function getBotFolders() {
    if(useCacheInventory == true)
    {
        addToErrorReplyLog('Loading inventory from cache...');
        postCallBotWithToken("InventoryPreloadDone", {} , InventoryPreloadDone);
    }
    else
    {
        addToErrorReplyLog('Loading folder layout from bot [non-cached]...');
        postCallBotWithToken("InventoryFolders", {} , SetBotFolders);
    }
}

function InventoryPreloadFolderCount(jsonRaw)
{
    if(jsonRaw.includes("folders:0") == true)
    {
        addToErrorReplyLog("Preload done and folder count is zero loading folder layout using non-cached method");
        useCacheInventory = false;
        setTimeout(getBotFolders, 3000);
        return;
    }
    addToErrorReplyLog("Preload done and preload size is "+jsonRaw+" - loading from cache");
    setTimeout(
        postCallBotWithToken("InventoryContentsCatched", {} , SetBotInventoryCached), 
        1000
    );
    return;
}
function InventoryPreloadDone(jsonRaw)
{
    if(jsonRaw == "Ready")
    {
        addToErrorReplyLog("Preload says its ready - checking folder count...");
        postCallBotWithToken("InventoryPreloadCount", {} , InventoryPreloadFolderCount);
        return;
    }
    else if(jsonRaw == "Not ready")
    {
        addToErrorReplyLog("Preload says its not ready - trying again shortly");
        setTimeout(getBotFolders, 3000);
        return;
    }
    else
    {
        useCacheInventory = false;
        setTimeout(getBotFolders, 3000);
    }
}


function getBotRealUUID(callback) {
    if (ItemAPIBusy == false) {
        ItemAPIBusy = true;
        RealUUIDCallback = callback;
        postCallBotWithToken("getRealUUID", {item: ItemUUID} , setBotRealUUID);
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
        postCallBotWithToken("InventoryContents", {folderUUID: ActiveNode.id} , SetFolderContents);
    }
}

function InventoryRez() {
    if (ItemAPIBusy == false) {
        ItemAPIBusy = true;
        postCallBotWithToken("RezObject", {item: ActiveNode.id} , RezObjectFeedback);
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
        postCallBotWithToken("DeleteInventoryFolder", {folder: ItemUUID} , SetDeleteResult);
    }
    else {
        postCallBotWithToken("DeleteInventoryItem", {item: ItemUUID} , SetDeleteResult);
    }
}


function InventoryRename() {
    ItemAPIBusy = true;
    postCallBotWithToken("RenameInventory", {item: ItemUUID, newname: $("#rename-newname").val()} , SetRenameResult);
}

function InventorySend() {
    ItemAPIBusy = true;
    postCallBotWithToken("SendItem", {item: ItemUUID, avatar: $("#senditem-recipient").val()} , SetSendResult);
}

function PlayGesture() {
    ItemAPIBusy = true;
    postCallBotWithToken("PlayGesture", {gesture: ItemUUID} , PlayGestureFeedback);
}

function DoSwitchOutfit() {
    ItemAPIBusy = true;
    postCallBotWithToken("SwapOutfit", {folder: ItemUUID} , PlayGestureFeedback);
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
            var targetNode = jstree.get_node(ActiveNode).parent;
            jstree.delete_node(ActiveNode);
            getCallBotWithToken("inventory/InventoryContents/" + targetNode.id, SetFolderContents);
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

function SwapOutfit(node, isfolder) {
    if (ItemAPIBusy == false) {
        if(isfolder == true)
        {
            ItemName = node.text;
            ItemUUID = node.id;
            ItemIsFolder = isfolder;
            ActiveNode = node;
            DoSwitchOutfit();
        }
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

function GetUUIDNode(node) {
    if (ItemAPIBusy == false) {
        ItemName = node.text;
        ItemUUID = node.id;
        ItemIsFolder = false;
        ActiveNode = node;
        RealUUID = "";
        showUUIDModal();
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
        },
        GetUUID: {
            label: "UUID",
            action: function () { GetUUIDNode(node); }
        },
        ReplaceOutfit: {
            label: "Swap outfit",
            action: function() { SwapOutfit(node, true); }
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
        //delete items.GetUUID;
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

    if(IsFolder == false)
    {
        delete items.ReplaceOutfit;
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

function fullUnpackInventory(JsonObject, parentid, callback) {
    addToErrorReplyLog("Rendering inventory...");
    if (parentid == "#") {
        RootFolderid = JsonObject.UUID;
    }
    
    // Process inventory recursively with batching to prevent browser blocking
    function processInventoryRecursive(obj, parentId, batchQueue, callback) {
        if (!obj || !obj.hasOwnProperty('UUID')) {
            if (callback) callback();
            return;
        }
        
        var jstree = $('#jstree').jstree();
        
        try {
            // Create the current node
            if (obj.InventoryType == "Folder") {
                jstree.create_node(parentId, { 
                    "li_attr": { "type": "Folder" }, 
                    "id": obj.UUID, 
                    "text": obj.Name 
                }, "last");
                // Process children if they exist
                if (obj.hasOwnProperty('Children') && obj.Children.length > 0) {
                    // Add children to batch queue
                    for (var i = 0; i < obj.Children.length; i++) {
                        batchQueue.push({
                            object: obj.Children[i],
                            parentId: obj.UUID
                        });
                    }
                }
            } else {
                var typename = obj.InventoryType.replace("Inventory", "");
                jstree.create_node(parentId, {
                    "li_attr": { "type": typename },
                    "id": obj.UUID,
                    "text": obj.Name,
                    "icon": "images/tree/" + typename + ".png"
                }, "last");
            }
            

            
            if (callback) callback();
        } catch (err) {
            addToErrorReplyLog("Error processing item: " + obj.UUID + " - " + err);
            if (callback) callback();
        }
    }
    
    // Process batch queue with delays
    function processBatchQueue(batchQueue, batchSize, callback) {
        if (batchQueue.length === 0) {
            if (callback) callback();
            return;
        }
        
        var currentBatch = batchQueue.splice(0, batchSize);
        var processed = 0;
        
        function processNextInBatch() {
            if (processed >= currentBatch.length) {
                // Use setTimeout to allow browser to breathe before next batch
                setTimeout(function() {
                    processBatchQueue(batchQueue, batchSize, callback);
                }, 10);
                return;
            }
            
            var item = currentBatch[processed];
            processInventoryRecursive(item.object, item.parentId, batchQueue, function() {
                processed++;
                processNextInBatch();
            });
        }
        
        processNextInBatch();
    }
    
    if (JsonObject.hasOwnProperty('UUID') && JsonObject.hasOwnProperty('Name')) {
        if (JsonObject.hasOwnProperty('InventoryType')) {
            try {
                var jstree = $('#jstree').jstree();
                
                // Create root folder first
                if (JsonObject.InventoryType == "Folder") {
                    jstree.create_node(parentid, { 
                        "li_attr": { "type": "Folder" }, 
                        "id": JsonObject.UUID, 
                        "text": JsonObject.Name 
                    }, "last");
                    
                    // Process children in batches
                    var batchQueue = [];
                    if (JsonObject.hasOwnProperty('Children') && JsonObject.Children.length > 0) {
                        for (var i = 0; i < JsonObject.Children.length; i++) {
                            batchQueue.push({
                                object: JsonObject.Children[i],
                                parentId: JsonObject.UUID
                            });
                        }
                    }
                    
                    // Process in batches of 25 items
                    processBatchQueue(batchQueue, 25, function() {
                        if (parentid == "#") {
                            expandNode(JsonObject.UUID);
                        }
                        if (callback) callback();
                    });
                } else {
                    var typename = JsonObject.InventoryType.replace("Inventory", "");
                    jstree.create_node(parentid, {
                        "li_attr": { "type": typename },
                        "id": JsonObject.UUID,
                        "text": JsonObject.Name,
                        "icon": "images/tree/" + typename + ".png"
                    }, "last");
                    
                    if (parentid == "#") {
                        expandNode(JsonObject.UUID);
                    }
                    if (callback) callback();
                }
            } catch (err) {
                addToErrorReplyLog("Error processing root folder: " + err);
                if (callback) callback();
            }
        }
    } else {
        if (callback) callback();
    }
}

function SetBotInventoryCached(jsonRaw) 
{
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
                fullUnpackInventory(jsondata, "#", function() {
                    addToErrorReplyLog('Inventory rendered from cache');
                });
            });
    } catch (err) {
        addToErrorReplyLog('Failed processing folder reply loading directly');
        useCacheInventory = false;
        setTimeout(getBotFolders, 3000);
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