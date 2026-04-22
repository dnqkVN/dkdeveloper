import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, update, increment, onValue, serverTimestamp, query, limitToLast } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVJ49ItRu-dUCtytI0P5v7mDLE_QcubO8",
  authDomain: "kdtfdevt.firebaseapp.com",
  databaseURL: "https://kdtfdevt-default-rtdb.firebaseio.com",
  projectId: "kdtfdevt",
  storageBucket: "kdtfdevt.firebasestorage.app",
  messagingSenderId: "375523757842",
  appId: "1:375523757842:web:e3edae2409412e399cedcb",
  measurementId: "G-8R696PV3PB"
};
const app = initializeApp(firebaseConfig); const db = getDatabase(app); const auth = getAuth(app); const provider = new GoogleAuthProvider();

const ADMIN_EMAIL = "khangdoannq@gmail.com";
const userNames = {
    "qkhaang@gmail.com":"qk", "khangdoannq@gmail.com":"kdoan", "truongloi010220@gmail.com":"phát béo",
    "anddang15@gmail.com":"an", "truonghuuphat9991@gmail.com":"lọ dùm trai 6 múi",
    "anhkhoadn2009@gmail.com":"khoa", "tmai28298@gmail.com":"tmai", "12345vanthach@gmail.com":"nam"
};
const allowedEmails = Object.keys(userNames);
let currentEmail = "";

let links = [
"desocupa546dolecto.gb.net",
"789winn-789win.online",
"mmoo-trangchu.online",
"nk88-trangchu.online",
"open88vip1.online",
"555wingame.online",
"68winvipro01.online",
"riegrowtaimo.za.com",
"99win-site.online",
"f168viponline.com",
"vip66-vip1.online",
"33win-vip1.online",
"tg88-vip1.online",
"hz88-vn01.site",
"nk88-nk88.online",
"tg88-top1.online",
"88xx-top1.online",
"xn88-top1.online",
"x88top1.online",
"nohu-mobi.online",
"tg88-tg88.online",
"burirdred.za.com",
"99okok.site",
"f168vns.com",
"camineh.gb.net",
"docsachwcoed.gb.net",
"cloudfront.gb.net",
"x88-3.shop",
"pkwin2026.lat",
"derelle.gb.net",
"88xxcasino.com",
"888vicom.lat",
"tg88karik.online",
"68win10.store",
"rkmusics.in.net",
"n188-n188.site",
"x88-ka.online",
"c168-vn3.com",
"sc88-vn8.com",
"u888dani.com",
"c168uu.com",
"ae888t1.com",
"mb88vn.site"
];

let scoreTimer = null; 

async function getPublicIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch(e) { return "unknown"; }
}

// KHỐI 1: Check Thiết Bị & IP (Chống share acc nhưng cho phép 4G)
// 1. Danh sách Email VIP được phép đổi trình duyệt/thiết bị thoải mái
const whitelistEmails = [
    "khangdoannq@gmail.com", 
    "12345vanthach@gmail.com",
    "anhkhoadn2009@gmail.com",
    "tmai28298@gmail.com",
    "truongloi010220@gmail.com"// Thêm email bạn thân cậu vào đây
];

// KHỐI 1: Check Thiết Bị & IP (Bản VIP dành cho quin developer)
onAuthStateChanged(auth, async (u) => {
    if (u && allowedEmails.includes(u.email)) {
        const userIp = await getPublicIP();
        const userRef = ref(db, 'users/' + u.email.replace(/\./g, '_'));
        
        let myDeviceId = localStorage.getItem('deviceId');
        if (!myDeviceId) {
            myDeviceId = 'dev_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', myDeviceId);
        }

        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            const modal = document.getElementById('bannedModal');
            const msg = document.getElementById('bannedMessage');

            if (!userData) {
                // Đăng nhập lần đầu
                update(userRef, { currentIP: userIp, deviceId: myDeviceId, status: "active" });
            } else if (userData.status === "banned") {
                msg.innerText = "Tài khoản này đã bị ban vĩnh viễn.";
                modal.style.display = "flex";
                signOut(auth);
            } else if (userData.deviceId && userData.deviceId !== myDeviceId) {
                
                // --- ĐOẠN XỬ LÝ VIP ---
                if (whitelistEmails.includes(u.email)) {
                    // Nếu là VIP, cho phép ghi đè Device ID mới mà không Ban
                    update(userRef, { deviceId: myDeviceId, currentIP: userIp });
                    console.log("VIP User: Đã cập nhật thiết bị/trình duyệt mới.");
                } else {
                    // Nếu là người thường: BAN!
                    update(userRef, { status: "banned" });
                    msg.innerHTML = "Phát hiện đăng nhập từ thiết bị lạ<br>Tài khoản của bạn đã bị khóa!";
                    modal.style.display = "flex"; 
                    signOut(auth);
                }
                // ----------------------

            } else {
                // Cùng máy, chỉ đổi IP (4G)
                if (userData.currentIP !== userIp) {
                    update(userRef, { currentIP: userIp });
                }
            }
        }, { onlyOnce: true });
    }
});


// KHỐI 2: Logic giao diện cũ của cậu (Giữ nguyên 100%)
onAuthStateChanged(auth, u => {
    document.body.style.display = "block";
    if(u && allowedEmails.includes(u.email)) {
        currentEmail = u.email;
        document.getElementById("loginUI").style.display = "none";
        document.getElementById("mainUI").style.display = "block";
        document.getElementById("navBar").style.display = "flex";
        const name = userNames[u.email];
        document.getElementById("user-display-name").innerText = name;
        document.getElementById("user-display-email").innerText = u.email;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN') + ' ' + now.toLocaleDateString('vi-VN');
        push(ref(db, 'logs'), { name: name, timestamp: serverTimestamp(), timeStr: timeStr });
        
        if(u.email === ADMIN_EMAIL) {
            document.getElementById("nav-admin").style.display = "flex";
            document.getElementById("user-role-badge").innerText = "Quản trị viên";
            document.getElementById("user-role-badge").className = "role-badge role-admin";
            const logRef = query(ref(db, 'logs'), limitToLast(50));
            onValue(logRef, snap => {
                const logList = document.getElementById("logList"); logList.innerHTML = "";
                let logs = [];
                snap.forEach(child => { 
                    let data = child.val();
                    if (!data.timeStr) data.timeStr = new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN');
                    logs.push(data); 
                });
                logs.reverse().forEach(d => {
                    logList.innerHTML += `<div class="log-item"><span class="log-name">${d.name}</span><span class="log-time"> - ${d.timeStr}</span></div>`;
                });
            });
            onValue(ref(db, 'scores'), snap => {
                const body = document.getElementById("scoreTableBody"); body.innerHTML = "";
                let scoreList = [];
                snap.forEach(child => { scoreList.push(child.val()); });
                scoreList.sort((a,b) => b.points - a.points).forEach(d => {
                    body.innerHTML += `<tr><td>${d.name}</td><td style="text-align:right"><span style="background:var(--primary-color);color:white;padding:2px 8px;border-radius:8px;font-size:12px;">${d.points.toFixed(1)}</span></td></tr>`;
                });
            });
        } else {
            document.getElementById("user-role-badge").innerText = "Thành viên";
            document.getElementById("user-role-badge").className = "role-badge role-user";
        }
        if(u.photoURL) document.getElementById("user-avatar").innerHTML = `<img src="${u.photoURL}" style="width:100%; height:100%; object-fit:cover;">`;
        
        const grid = document.getElementById("grid"); grid.innerHTML = "";
        links.forEach(n => {
            let div = document.createElement("div"); div.className = "box"; div.innerText = n;
            div.onclick = () => {
                window.open("https://www.google.com/url?q=https://" + n, "_blank");
                if(scoreTimer) clearTimeout(scoreTimer);
                scoreTimer = setTimeout(() => {
                    update(ref(db, 'scores/' + currentEmail.replace(/\./g, '_')), { points: increment(0.5), name: name });
                    scoreTimer = null; 
                }, 60000); 
            };
            grid.appendChild(div);
        });
    } else {
        if(u) signOut(auth);
        document.getElementById("loginUI").style.display = "flex";
        document.getElementById("mainUI").style.display = "none";
        document.getElementById("navBar").style.display = "none";
    }
});

// Các hàm khác giữ nguyên
window.switchTab = (tabName, el) => {
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active-page'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + tabName).classList.add('active-page');
    el.classList.add('active');
};
window.loginGoogle = () => signInWithPopup(auth, provider);
window.openLogoutModal = () => document.getElementById("logoutConfirmUI").style.display = "flex";
window.closeLogoutModal = () => document.getElementById("logoutConfirmUI").style.display = "none";
window.executeLogout = () => signOut(auth).then(()=>window.location.reload());
window.sendMsg = () => {
    let msg = document.getElementById("msgInput").value;
    if(!msg) return;
    push(ref(db,"chat"), { name: currentEmail, msg: msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
    document.getElementById("msgInput").value="";
};
onChildAdded(ref(db,"chat"), s => {
    let m = s.val();
    let div = document.createElement("div"); div.className = "msg-item";
    div.innerHTML = `<span class="msg-user">${userNames[m.name] || m.name}</span><div class="msg-text">${m.msg}</div><div class="msg-time">${m.time}</div>`;
    const box = document.getElementById("messages"); box.appendChild(div); box.scrollTop = box.scrollHeight;
});
document.getElementById("search").addEventListener("input", e => {
    let kw = e.target.value.toLowerCase();
    document.querySelectorAll(".box").forEach(b => b.style.display = b.innerText.toLowerCase().includes(kw) ? "" : "none");
});
