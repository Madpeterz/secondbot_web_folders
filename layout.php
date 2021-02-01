<div class="container">
    <div class="row">
        <div class="col-sm-2">
            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <a class="nav-link active" data-tabname="setup" id="v-pills-setup-tab" 
                data-toggle="pill" href="#setup" role="tab" aria-controls="v-pills-setup" aria-selected="true">Setup</a>
                <a class="nav-link" data-tabname="localchat" id="v-pills-localchat-tab" data-toggle="pill" 
                href="#localchat" role="tab" aria-controls="v-pills-localchat" aria-selected="false">Localchat 
                    <span id="localchat-badge" class="d-none badge badge-danger">0</span></a>
                <a class="nav-link" data-tabname="ims" id="v-pills-ims-tab" data-toggle="pill" href="#ims" role="tab"
                    aria-controls="v-pills-ims" aria-selected="false">Ims</a>
                <a class="nav-link" data-tabname="groups" id="v-pills-groups-tab" data-toggle="pill" 
                href="#groups" role="tab" aria-controls="v-pills-groups" aria-selected="false">Groups</a>
                <a class="nav-link" data-tabname="inventory" id="v-pills-inventory-tab" data-toggle="pill" 
                href="#inventory" role="tab" aria-controls="v-pills-inventory" aria-selected="false">Inventory</a>
            </div>
            <br />
            <img src="images/logo.png" title="SecondBot" width="120px">
        </div>
        <div class="col-sm-10">
            <div class="tab-content" id="pills-tabContent">
                <?php include "pages/setup.php"; ?>
                <?php include "pages/localchat.html"; ?>
                <?php include "pages/ims.html"; ?>
                <?php include "pages/groups.html"; ?>
                <?php include "pages/inventory.html"; ?>
            </div>
        </div>
    </div>
</div>