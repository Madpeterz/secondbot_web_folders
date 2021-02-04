// Last unixtime of command sent
var now = 0;
var webUItoken = "";
var lastfetchedtoken = 0;

// confuig values
var webUIcode = "";
var url = "";
var SignedCode = "";

// UI tabs
var activeTab = null;

// location
var currentregion = "";
var currentX = 0;
var currentY = 0;
var currentZ = -1;

// map / autowalker
var mapdblclick = false;
var mapdblclicktimerid = null;
var walktoX = 0;
var walktoY = 0;



// inventory
var RootFolderid = "";
var busy_with_folder = "";
var ItemName = "";
var ItemUUID = "";
var ItemIsFolder = false;
var ItemAPIBusy = false;
var ActiveNode = false;
var RealUUID = "";
var RealUUIDCallback = "";

// chat
var localchat_changes_from_last_displayed = 0;
var localchat_last_hash = "";
var nearme_hash = "";

// groups
var knowngroups = [];
var groupshaveunread = false;
var selectedgroup = "";

// friends
var friendshash = "";
var frienduuids = [];
var friendsfirstload = false;

// im
var knownims = [];
var imshaveunread = false;
var selectedim = "";

// errors
var errors_counter = 0;