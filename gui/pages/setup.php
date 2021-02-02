<div class="tab-pane fade show active" id="setup" role="tabpanel" aria-labelledby="setup-tab">
                    <h4>HTTP reply from bot</h4>
                    <textarea cols="150" rows="10" id="http_result" READONLY></textarea>
                    <h4>Details</h4>
                    <p>
                        Name: <span id="botname"></span><br />
                        Version: <span id="botversion"></span>
                    </p>
                    <form id="connectform" action="#" method="post">
                        <label for="apiurl">API url</label>
                        <input autocomplete="off" type="text" id="apiurl" name="apiurl" value="<?php
                        if (isset($_GET["url"]) == true) {
                            echo $_GET["url"];
                        }
                        ?>"><br/>
                       <label for="webuicode">Web UI code</label>
                        <input autocomplete="off" type="password" id="webuicode" name="webuicode" value="<?php
                        if (isset($_GET["webuicode"]) == true) {
                            echo $_GET["webuicode"];
                        }
                        ?>"><br/>
                       <label for="signedcommand">Signed command code</label>
                        <input autocomplete="off"  type="password" id="signedcommand" name="signedcommand" value="<?php
                        if (isset($_GET["signedcommand"]) == true) {
                            echo $_GET["signedcommand"];
                        }
                        ?>"><br/>
                        <button type="submit">Connect</button>
                    </form>
                    <form class="d-none" id="disconnectform" action="#" method="post">
                        <button type="submit">Logout & Clear</button>
                    </form>

                </div>