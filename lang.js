const labels = {
  vn: {
    start: "Bắt đầu chơi",
    replay: "Chơi lại",
    change: "Đổi",
    stay: "Không đổi",
    reset: "Reset bảng",
    push: "Push Firebase",
    instruction: "Bấm vào cửa để bắt đầu chơi",
    total: "Tổng lượt chơi",
    results: "Kết quả",
    changeCount: "Lượt đổi",
    winChange: "Thắng khi đổi",
    winStay: "Thắng khi không đổi",
    instrBtn:"Hướng dẫn",
    instr:"Bàn phím: 1-3 chọn cửa, Mũi tên/Tab đổi Giữ/Đổi, Enter xác nhận."
      },
  en: {
    start: "Start Game",
    replay: "Play Again",
    change: "Switch",
    stay: "Stay",
    reset: "Reset Stats",
    push: "Push Firebase",
    instruction: "Click a door to start playing",
    total: "Total games",
    results: "Results",
    changeCount: "Switched",
    winChange: "Win when switched",
    winStay: "Win when stayed",
    instrBtn:"Instructions",
    instr:"Keyboard: 1-3 select door, Arrow/Tab toggle Stay/Switch, Enter confirm.\n Push Firebase only uploads stats for educational purposes, not personal data."
  }
};

let currentLang = "vn";

document.getElementById("langBtn").addEventListener("click", () => {
  currentLang = currentLang === "vn" ? "en" : "vn";
  updateLanguage();
});


function updateLanguage() {
  const l = labels[currentLang];
  document.getElementById("startBtn").innerText = firstClick ? l.start : l.replay;

  document.getElementById("changeBtn").innerText = l.change;
  document.getElementById("stayBtn").innerText = l.stay;
  document.getElementById("resetBtn").innerText = l.reset;
  document.getElementById("pushFirebaseBtn").innerText = l.push;
  document.getElementById("instruction").innerText = l.instruction;
  document.getElementById("resultTitle").innerText = l.results;

    document.getElementById("totalLabel").textContent = `${l.total}: `;
    document.getElementById("changeCountLabel").textContent = `${l.changeCount}: `;
    document.getElementById("winChangeLabel").textContent = `${l.winChange}: `;
    document.getElementById("winStayLabel").textContent = `${l.winStay}: `;
    document.getElementById("instr").innerText = l.instr;
    document.getElementById("instrBtn").innerText = l.instrBtn;
      // Cập nhật nút ngôn ngữ
  
  document.getElementById("langBtn").innerText = currentLang === "vn" ? "VN" : "EN ";
 

}

// Toggle EN / VN
const langSwitch = document.getElementById("langBtn");
const instrEN = document.getElementById("instrEN");
const instrVN = document.getElementById("instrVN");
const langLabel = document.getElementById("langLabel");

langSwitch.addEventListener("change", () => {
  if(langSwitch.checked){
    instrEN.style.display="none";
    instrVN.style.display="block";
    langLabel.textContent="VN";
  } else {
    instrEN.style.display="block";
    instrVN.style.display="none";
    langLabel.textContent="EN";
  }
});

// Toggle instructions collapse
const instrBtn = document.getElementById("instrBtn");
const instrContent = document.getElementById("instructionsContent");

instrBtn.addEventListener("click", () => {
  if(instrContent.style.display === "none"){
    instrContent.style.display = "block";
    instrBtn.textContent = labels[currentLang].instrBtn+ "▲";
  } else {
    instrContent.style.display = "none";
    instrBtn.textContent = labels[currentLang].instrBtn + "▼";
  }
});
