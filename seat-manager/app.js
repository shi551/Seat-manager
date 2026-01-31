import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ▼ ここにFirebaseの設定を貼り付けます（後で説明）
const firebaseConfig = {
  apiKey: "AIzaSyC5FIYFNAidKXPkMooly9f3QI0Os4sieFY",
  authDomain: "seat-manager-a008a.firebaseapp.com",
  databaseURL: "https://seat-manager-a008a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "seat-manager-a008a",
  storageBucket: "seat-manager-a008a.firebasestorage.app",
  messagingSenderId: "703106935067",
  appId: "1:703106935067:web:b06649343eb6d1f2c30bbe"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const seatsRef = ref(db, "seats");

const seatPositions = {
  1:{x:320,y:40}, 2:{x:320,y:100}, 3:{x:240,y:40}, 5:{x:160,y:40},
  6:{x:80,y:40}, 7:{x:80,y:100}, 8:{x:180,y:160},
  9:{x:260,y:240},10:{x:260,y:300},
  11:{x:100,y:240},12:{x:100,y:300},13:{x:100,y:360},
  14:{x:140,y:160}
};

const map = document.getElementById("map");
const count = document.getElementById("count");
const seatEls = {};

Object.keys(seatPositions).forEach(n=>{
  const d=document.createElement("div");
  d.className="seat free"; d.innerText=n;
  d.style.left=seatPositions[n].x+"px";
  d.style.top=seatPositions[n].y+"px";
  d.onclick=()=>set(ref(db,"seats/"+n), seatEls[n].classList.contains("free") ? "used":"free");
  map.appendChild(d);
  seatEls[n]=d;
});

onValue(seatsRef, snap=>{
  const data=snap.val()||{};
  let used=0;
  Object.keys(seatEls).forEach(n=>{
    const st=data[n]||"free";
    seatEls[n].className="seat "+(st==="used"?"used":"free");
    if(st==="used") used++;
  });
  count.innerText=`着席数: ${used} / 14`;
});

window.resetAll = ()=>{
  const init={};
  Object.keys(seatEls).forEach(n=>init[n]="free");
  set(seatsRef, init);
};