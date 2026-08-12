(function () {
    "use strict";

    // Gọi lấy danh sách redirects từ Firebase
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://check-user-1-default-rtdb.firebaseio.com/redirects.json?t=" + Date.now(),
        onload: function (res) {
            try {
                const redirectMap = JSON.parse(res.responseText);
                if (!redirectMap) return;

                // Lấy path từ URL hiện tại
                const path = window.location.pathname.split("/").filter(Boolean);

                if (path.length > 0) {
                    let key = path[0];

                    // Kiểm tra đuôi -2
                    if (!key.includes("-2") && redirectMap[key + "-2"]) {
                        key = key + "-2";
                    }

                    // Nếu tìm thấy key trong Firebase -> Chuyển hướng
                    if (redirectMap[key]) {
                        const delay = Math.floor(Math.random() * 200) + 100;
                        setTimeout(() => {
                            window.location.href = "https://www.google.com/url?q=https://" + redirectMap[key];
                        }, delay);
                    }
                }
            } catch (e) {
                console.error("[main.js] Lỗi xử lý:", e);
            }
        }
    });
})();
