// Firebase config
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://monty-hall-20cd3-default-rtdb.firebaseio.com/",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Biến trạng thái
let doors = [];
let chosenDoor = null;
let treasureDoor = null;
let openedDoor = null;
let change = null;

let stats = JSON.parse(localStorage.getItem("montyStats")) || {
  total: 0,
  changeCount: 0,
  winChange: 0,
  winStay: 0
};

let firstClick = true;

document.addEventListener("DOMContentLoaded", () => {
  doors = document.querySelectorAll(".door");

  doors.forEach(d => {
    d.addEventListener("click", handleDoorClick);
  });

  document.getElementById("changeBtn").addEventListener("click", () => selectChoice(true));
  document.getElementById("stayBtn").addEventListener("click", () => selectChoice(false));
  document.getElementById("startBtn").addEventListener("click", resetGame);
  document.getElementById("resetBtn").addEventListener("click", resetStats);
  document.getElementById("pushFirebaseBtn").addEventListener("click", pushFirebase);

  updateStats();
});

// Xử lý click cửa
function handleDoorClick(e) {
  const d = e.currentTarget;

 if (firstClick) {
  firstClick = false;
  document.getElementById("startBtn").innerText = "Chơi lại";

  // Fade-out hướng dẫn
  const instr = document.getElementById("instruction");
  instr.style.opacity = 0;
  setTimeout(() => { instr.style.display = "none"; }, 500);

  treasureDoor = Math.floor(Math.random() * 3);
}

  if (chosenDoor !== null) return;

  chosenDoor = parseInt(d.dataset.index);

  doors.forEach(dd => dd.classList.remove("selected"));
  d.classList.add("selected");

  // mở 1 cửa không phải kho báu và không phải cửa chọn
  let possible = [0,1,2].filter(i => i!==chosenDoor && i!==treasureDoor);
  openedDoor = possible[Math.floor(Math.random()*possible.length)];
  doors[openedDoor].classList.add("opened");
  doors[openedDoor].innerText = "Goat 🐐";

  doors.forEach(d => d.style.pointerEvents = "none");
  document.getElementById("changeBtn").disabled = false;
  document.getElementById("stayBtn").disabled = false;
  document.getElementById("startBtn").style.display ="none";
}

// Chọn đổi/không đổi
function selectChoice(didChange) {
  change = didChange;
  document.getElementById("changeBtn").classList.toggle("selectedBtn", didChange);
  document.getElementById("stayBtn").classList.toggle("selectedBtn", !didChange);

  let finalChoice = change ? [0,1,2].find(i => i!==chosenDoor && i!==openedDoor) : chosenDoor;

  doors.forEach((d,i)=>{
  d.classList.add("opened");
  if (i === chosenDoor) {
    d.classList.add("selected"); // giữ highlight
  }
  d.innerText = i===treasureDoor ? "Treasure 💎" : "Goat 🐐";
  });


  stats.total++;
  if(change) stats.changeCount++;
  if(change && finalChoice===treasureDoor) stats.winChange++;
  if(!change && finalChoice===treasureDoor) stats.winStay++;
  updateStats();

  document.getElementById("changeBtn").disabled = true;
  document.getElementById("stayBtn").disabled = true;

  doors.forEach((d,i)=>{
  setTimeout(() => { // tạo delay từng cửa cho trực quan
    d.classList.add("opened");
    d.innerText = i===treasureDoor ? "Treasure 💎" : "Goat 🐐";
  }, i * 200); // 0ms, 200ms, 400ms
});
 document.getElementById("startBtn").style.display ="inline-block";
}

// Reset game (Chơi lại)
function resetGame() {
  firstClick = true;
  chosenDoor = null;
  treasureDoor = null;
  openedDoor = null;
  change = null;

  doors.forEach(d => {
    d.classList.remove("selected");
    d.classList.remove("opened");
    d.innerText = `Door ${parseInt(d.dataset.index)+1}`;
    d.style.pointerEvents = "auto";

    const instr = document.getElementById("instruction");
    instr.style.display = "block";
    instr.style.opacity = 1;

  });

  document.getElementById("changeBtn").classList.remove("selectedBtn");
  document.getElementById("stayBtn").classList.remove("selectedBtn");
  document.getElementById("changeBtn").disabled = true;
  document.getElementById("stayBtn").disabled = true;

  document.getElementById("instruction").style.display = "block";
 document.getElementById("startBtn").style.display ="none";
}

// Cập nhật bảng
function updateStats() {
  document.getElementById("total").innerText = stats.total;
  document.getElementById("changeCount").innerText = stats.changeCount;
  document.getElementById("winChange").innerText = stats.winChange;
  document.getElementById("winStay").innerText = stats.winStay;
  localStorage.setItem("montyStats", JSON.stringify(stats));
}

// Reset bảng
function resetStats() {
  if(confirm("Bạn có chắc muốn reset tất cả kết quả không?")) {
    stats = { total:0, changeCount:0, winChange:0, winStay:0 };
    localStorage.removeItem("montyStats");
    updateStats();
  }
}

// Push Firebase
function pushFirebase() {
  const newRef = db.ref("montyHallStats").push();
  newRef.set(stats)
    .then(()=>alert("Đã push dữ liệu lên Firebase!"))
    .catch(err=>alert("Lỗi: "+err));
}
