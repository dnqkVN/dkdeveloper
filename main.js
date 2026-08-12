(function () {
    "use strict";
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://check-user-1-default-rtdb.firebaseio.com/redirects.json?t=" + Date.now(),
        onload: function(res){
            try {
                const redirectMap = JSON.parse(res.responseText);
                if(!redirectMap) return;
                const path = window.location.pathname.split("/").filter(Boolean);
                if(path.length > 0){
                    let key = path[0];
                    if(!key.includes("-2") && redirectMap[key + "-2"]){
                        key = key + "-2";
                    }
                    if(redirectMap[key]){
                        const delay = Math.floor(Math.random()*200)+100;
                        setTimeout(()=>{
                            window.open("https://www.google.com/url?q=https://" + redirectMap[key], "_blank");
                        }, delay);
                    }
                }
            } catch(e) {
                console.log(e);
            }
        }
    });
})();
