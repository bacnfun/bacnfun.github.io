// 獲取元素
const clouds = document.querySelectorAll('.cloud');
const balloons = document.querySelectorAll('.balloon');
const monsters = document.querySelectorAll('.monster'); // 取得怪物元素
const cloudContainer = document.getElementById('cloudContainer');
const dayImages = {
    1: "img/mon.png",
    2: "img/tue.png",
    3: "img/wed.png",
    4: "img/thu.png",
    5: "img/fri.png",
    6: "img/sat.png",
    7: "img/sun.png"
};

// Yeti 動畫
const yeti1 = document.getElementById('yeti1');
const yeti2 = document.getElementById('yeti2');
const totalFrames = 17;
const animationDuration = 3.4 * 1000; // Yeti 行走動畫總時長 (毫秒)
const frameInterval = animationDuration / totalFrames;
const screenWidth = 100; // 屏幕寬度百分比
const offset = 80; // 間隔百分比

// 音樂控制
let isPlaying = true; // 預設音樂是播放中的
const bgmPlayer = document.getElementById('bgmPlayer');
const playButton = document.getElementById('playButton');

// 簽到數量
const signCounts = {
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0
};

// 設定數字位置
const numberPositions = [
    { x: 267, y: 195 },
    { x: 267, y: 239 },
    { x: 267, y: 284 },
    { x: 267, y: 328 },
    { x: 267, y: 376 },
    { x: 267, y: 420 },
    { x: 267, y: 464 }
];

// 初始化並設定雲朵位置
function initCloud(cloud, index) {
    const topPosition = 5 + Math.random() * 15;
    cloud.style.top = `${topPosition}%`;
    cloud.style.zIndex = index;
    const startPosition = Math.random() * 100;
    cloud.style.left = `${startPosition}vw`;
}

// 更新顯示的日期圖片
function updateDisplay() {
    const dayImageElement = document.getElementById("day-image");
    const todayOverlayElement = document.getElementById("today-overlay");

    dayImageElement.src = dayImages[currentDay];

    // 若為今天，顯示 today.png，否則隱藏
    if (currentDay === today) {
        todayOverlayElement.style.display = "block";
    } else {
        todayOverlayElement.style.display = "none";
    }
}

// 切換日期
function changeDay(offset) {
    currentDay += offset;

    if (currentDay > 7) {
        currentDay = 1;
    } else if (currentDay < 1) {
        currentDay = 7;
    }

    updateDisplay();
}

// Yeti 動畫
function setupYetiAnimation(yeti) {
    let frame = 0;
    setInterval(() => {
        yeti.src = `img/yeti_${frame}.png`;
        frame = (frame + 1) % totalFrames;
    }, frameInterval);
}

// 重置 Yeti 位置
function resetYetiPosition(yeti, otherYeti) {
    const currentPosition = parseFloat(yeti.style.left);
    const otherPosition = parseFloat(otherYeti.style.left);
    
    if (currentPosition >= screenWidth) {
        yeti.style.left = `${(otherPosition - offset)}vw`;
    }
}

// 音樂控制
playButton.addEventListener('click', function() {
    if (isPlaying) {
        bgmPlayer.pause();
        playButton.src = "img/play.png"; 
    } else {
        bgmPlayer.play();
        playButton.src = "img/play.png"; 
    }
    isPlaying = !isPlaying;
});

// 更新簽到數量顯示
function updateSignCounts() {
    document.getElementById('count-mon').textContent = signCounts.mon;
    document.getElementById('count-tue').textContent = signCounts.tue;
    document.getElementById('count-wed').textContent = signCounts.wed;
    document.getElementById('count-thu').textContent = signCounts.thu;
    document.getElementById('count-fri').textContent = signCounts.fri;
    document.getElementById('count-sat').textContent = signCounts.sat;
    document.getElementById('count-sun').textContent = signCounts.sun;
}

// 動態生成簽到次數輸入框
function createInputFields() {
    const signboard = document.getElementById('signboard');
    numberPositions.forEach((pos, index) => {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'input-field';
        input.style.left = `${pos.x}px`;
        input.style.top = `${pos.y}px`;
        input.min = 0;
        input.max = 77;
        input.value = 0;
        signboard.appendChild(input);
    });
}

// 修正按鈕事件
document.getElementById('edit-button').addEventListener('click', function() {
    createInputFields(); 
});

// 設定窗口大小調整
window.addEventListener('resize', adjustScale);
adjustScale(); // 初始調整

// 初始化頁面設置
window.onload = function() { updateDisplay(); bgmPlayer.play(); };

// NPC動畫
const npcImage = document.getElementById('npc-image');
const actions = {
    eyes: ['eye.1.png', 'eye.2.png'],
    hands: ['hand.0.png', 'hand.1.png', 'hand.2.png'],
    pets: ['pet.0.png', 'pet.1.png']
};

function getRandomActionGroup() {
    const actionGroups = Object.keys(actions);
    const randomGroup = actionGroups[Math.floor(Math.random() * actionGroups.length)];
    const actionSet = actions[randomGroup];
    return actionSet[Math.floor(Math.random() * actionSet.length)];
}

function animateNPC() {
    npcImage.src = 'img/NPC/stand.0.png';
    npcImage.style.opacity = 1;

    setTimeout(() => {
        const action = getRandomActionGroup();
        npcImage.src = 'img/NPC/' + action;
        npcImage.style.opacity = 1;
    }, 300);

    setTimeout(() => {
        npcImage.src = 'img/NPC/stand.0.png';
        npcImage.style.opacity = 1;
    }, 1300);

    setTimeout(animateNPC, 3600);
}

animateNPC(); // 初始化NPC動畫

// 鼠標控制：按下左鍵時改變鼠標圖標
document.addEventListener('mousedown', function(event) {
    if (event.button === 0) { 
        document.body.style.cursor = "url('img/Cursor1.png'), auto";
    }
});

document.addEventListener('mouseup', function(event) {
    if (event.button === 0) { 
        document.body.style.cursor = "url('img/Cursor0.png'), auto";
    }
});

// 超連結的鼠標光標變更
const links = document.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('mouseenter', function() {
        document.body.style.cursor = "url('img/Cursor1.png'), auto";
    });

    link.addEventListener('mouseleave', function() {
        document.body.style.cursor = "url('img/Cursor0.png'), auto";
    });
});
