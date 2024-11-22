// 從 datasync.js 匯入必要的函數
import {
  publishLinkCode,
  verifyAndSync,
  syncToFirestore,
  syncFromFirestore,
} from "./datasync.js";

// 音樂控制
let isPlaying = false; // 預設音樂是播放停止狀態
const bgmPlayer = document.getElementById("bgmPlayer");
const playButton = document.getElementById("playButton");

bgmPlayer.volume = 0.2; // 音量設為20%

playButton.addEventListener("click", function () {
  if (isPlaying) {
    bgmPlayer.pause();
    playButton.src = "img/play.png"; // 更換為播放圖示
  } else {
    bgmPlayer.play();
    playButton.src = "img/play.png"; // 更換為暫停圖示
  }
  isPlaying = !isPlaying;
});

// 滑鼠事件監聽
document.addEventListener("mousedown", function (event) {
  if (event.button === 0) {
    document.body.style.cursor = "url('img/Cursor1.png'), auto"; // 改為 Cursor1.png
  }
});

document.addEventListener("mouseup", function (event) {
  if (event.button === 0) {
    document.body.style.cursor = "url('img/Cursor0.png'), auto"; // 恢復為 Cursor0.png
  }
});

// 超連結滑鼠事件
const links = document.querySelectorAll("a");
links.forEach((link) => {
  link.addEventListener("mouseenter", function () {
    document.body.style.cursor = "url('img/Cursor1.png'), auto";
  });

  link.addEventListener("mouseleave", function () {
    document.body.style.cursor = "url('img/Cursor0.png'), auto";
  });
});

// 簽到數據初始化
const signCounts = {
  mon: 0,
  tue: 0,
  wed: 0,
  thu: 0,
  fri: 0,
  sat: 0,
  sun: 0,
};

// 從 localStorage 加載簽到數據
function loadSignCounts() {
  const savedCounts = JSON.parse(localStorage.getItem("signCounts"));
  if (savedCounts) {
    Object.keys(signCounts).forEach((day) => {
      if (savedCounts.hasOwnProperty(day)) {
        signCounts[day] = savedCounts[day];
      }
    });
  }
}

// 更新簽到次數顯示
function updateSignCounts() {
  Object.keys(signCounts).forEach((day) => {
    const elementId = `count-${day}`;
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = signCounts[day];
    }
  });
}

// 調用初始化簽到數據
loadSignCounts();
updateSignCounts();

// 初始化同步的函數
async function initializeSync() {
  const userID = localStorage.getItem("userID");
  if (userID) {
    const result = await syncFromFirestore(userID);
    if (result.success) {
      console.log("從 Firestore 同步成功：", result.data);
      localStorage.setItem("characterData", JSON.stringify(result.data));
    } else {
      console.error("從 Firestore 同步失敗：", result.message);
    }
  } else {
    console.log("未找到 userID，使用本地資料。");
  }
}

// 發行引繼代碼並同步本地資料
async function handlePublishLinkCode() {
  const localData = JSON.parse(localStorage.getItem("characterData")) || {};
  const result = await publishLinkCode(localData);
  if (result.success) {
    console.log(`引繼代碼發行成功：${result.linkCode}`);
    alert(`引繼代碼為：${result.linkCode}`);
  } else {
    console.error(`引繼代碼發行失敗：${result.message}`);
    alert(`發行失敗：${result.message}`);
  }
}

// 簽到總和計算
function calculateTotal() {
  return Object.values(signCounts).reduce((sum, count) => sum + count, 0);
}

// 顯示簽到總數字
function displayTotal() {
  const total = calculateTotal();
  const signboard = document.getElementById("signboard");
  const totalStr = total.toString().padStart(3, "0");
  const baseX = 122;
  const baseY = 42;

  const digitWidths = {
    0: 14,
    1: 11,
    2: 13,
    3: 14,
    4: 16,
    5: 14,
    6: 15,
    7: 14,
    8: 15,
    9: 15,
  };

  const existingImages = signboard.querySelectorAll(".total-digit");
  existingImages.forEach((img) => img.remove());

  let currentX = baseX;
  totalStr.split("").forEach((digit) => {
    const img = document.createElement("img");
    img.src = `img/signboard/${digit}.png`;
    img.className = "total-digit";
    img.style.position = "absolute";
    img.style.top = `${baseY}px`;
    img.style.left = `${currentX}px`;
    currentX += digitWidths[digit];
    signboard.appendChild(img);
  });
}

// 初始化同步及簽到資料顯示
window.onload = function () {
  initializeSync();
  loadSignCounts();
  updateSignCounts();
  displayTotal();
};
