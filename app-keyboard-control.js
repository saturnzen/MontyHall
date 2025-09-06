document.addEventListener("DOMContentLoaded", () => {

  let doors = document.querySelectorAll(".door");
  let chosenDoor = null;
  let treasureDoor = null;
  let openedDoor = null;
  let change = null;
  let firstClick = true;
  let selectedChoice = 0; // 1 = stay, 2 = change
  let confirmed = false;   // đã xác nhận lựa chọn đổi/không đổi chưa

  function getStats() {
    return JSON.parse(localStorage.getItem("montyStats")) || {
      total:0, changeCount:0, winChange:0, winStay:0
    };
  }

  function updateStatsUI() {
    let stats = getStats();
    document.getElementById("total").textContent = stats.total;
    document.getElementById("changeCount").textContent = stats.changeCount;
    document.getElementById("winChange").textContent = stats.winChange;
    document.getElementById("winStay").textContent = stats.winStay;
  }

  function resetHighlightButtons() {
    document.getElementById("changeBtn").classList.remove("selectedBtn");
    document.getElementById("stayBtn").classList.remove("selectedBtn");
  }

  function playRound(didChange) {
    change = didChange;
    confirmed = true; // đã xác nhận lựa chọn
    let finalChoice = change ? [0,1,2].find(i=>i!==chosenDoor && i!==openedDoor) : chosenDoor;

    doors.forEach((d,i)=>{
      d.classList.add("opened");
      if(i===chosenDoor) d.classList.add("selected");
      d.innerText = i===treasureDoor ? "Treasure 💎" : "Goat 🐐";
    });

    // Cập nhật stats
    let stats = getStats();
    stats.total++;
    if(change) stats.changeCount++;
    if(change && finalChoice===treasureDoor) stats.winChange++;
    if(!change && finalChoice===treasureDoor) stats.winStay++;
    localStorage.setItem("montyStats", JSON.stringify(stats));
    updateStatsUI();

    // Disable change/stay buttons, nhưng giữ màu highlight
    document.getElementById("changeBtn").disabled = true;
    document.getElementById("stayBtn").disabled = true;

    // Enable play again
    document.getElementById("startBtn").style.display ="inline-block";

    firstClick = true;
    chosenDoor = null;
    openedDoor = null;
    treasureDoor = null;
  }

  // Khởi tạo UI
  updateStatsUI();

  document.addEventListener("keydown", (e) => {
    const key = e.key;

    // --- Chọn cửa ---
    if(firstClick && ["1","2","3"].includes(key)) {
      let index = parseInt(key) - 1;
      chosenDoor = index;
      firstClick = false;

      treasureDoor = Math.floor(Math.random()*3);

      doors.forEach(d=>d.classList.remove("selected"));
      doors[index].classList.add("selected");

      let possible = [0,1,2].filter(i=>i!==chosenDoor && i!==treasureDoor);
      openedDoor = possible[Math.floor(Math.random()*possible.length)];
      doors[openedDoor].classList.add("opened");
      doors[openedDoor].innerText = "Goat 🐐";

      document.getElementById("changeBtn").disabled = false;
      document.getElementById("stayBtn").disabled = false;

      document.getElementById("startBtn").style.display ="none";

      // Default highlight stay
      selectedChoice = 1;
      resetHighlightButtons();
      document.getElementById("stayBtn").classList.add("selectedBtn");
    }

    // --- Chọn đổi / không đổi ---
    if(chosenDoor !== null && !confirmed && ["ArrowLeft","ArrowRight","Tab"].includes(key)) {
      selectedChoice = selectedChoice === 1 ? 2 : 1; // toggle
      if(selectedChoice === 1) {
        document.getElementById("stayBtn").classList.add("selectedBtn");
        document.getElementById("changeBtn").classList.remove("selectedBtn");
      } else {
        document.getElementById("changeBtn").classList.add("selectedBtn");
        document.getElementById("stayBtn").classList.remove("selectedBtn");
      }
    }

    // --- Enter ---
    if(key === "Enter") {
      if(chosenDoor !== null && !document.getElementById("changeBtn").disabled) {
        // xác nhận đổi / không đổi
        playRound(selectedChoice === 2);
      } else if(firstClick) {
        // Nếu chơi xong -> bấm enter = play again
        document.getElementById("startBtn").click();
        // Reset highlight nút đổi/không đổi
        resetHighlightButtons();
        confirmed = false;
        document.getElementById("startBtn").style.display ="none";
      }
    }
  });

});
