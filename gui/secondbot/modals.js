function showDeleteModal() {
    if (ItemIsFolder == true) {
        setField("deleteitem-itemname", "(Folder) " + ItemName);
    } else {
        setField("deleteitem-itemname", ItemName);
    }
    $('#deleteitemwindow').modal('show');
}

function showSendModal() {
    if (ItemIsFolder == false) {
        setField("senditem-itemname", ItemName);
        $('#senditemwindow').modal('show');
    }
}

function showRenameModal() {
    $("#rename-newname").val(ItemName);
    $('#renamewindow').modal('show');
}

function showTexturePreview() {
    if (ItemIsFolder == false) {
        if (RealUUID == "") {
            getBotRealUUID(showTexturePreview);
        } else {
            $("#previewtexturehere").attr("src", "http://secondlife.com/app/image/" + RealUUID + "/1");
            $('#previewwindow').modal('show');
            RealUUID = "";
        }
    }
}


function showUUIDModal() {
    $("#inventoryUUIDname").val(ItemName);
    $("#inventoryUUID").val(ItemUUID);
    $('#inventoryuuidwindow').modal('show');
}


