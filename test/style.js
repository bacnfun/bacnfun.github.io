		const clouds = document.querySelectorAll('.cloud');
		const balloons = document.querySelectorAll('.balloon');
		const monsters = document.querySelectorAll('.monster'); // 取得怪物元素
		const cloudContainer = document.getElementById('cloudContainer');
		
		// 現有的調整縮放函數
		function adjustScale() {
			const aspectRatio = window.innerWidth / window.innerHeight;

			if (aspectRatio > 16 / 9) { // 當比例大於16:9，則裁切
				const scale = window.innerHeight / 768; // 以高度縮放
				cloudContainer.style.transform = `scale(${scale})`;
				cloudContainer.style.width = `${(16 / 9) * window.innerHeight}px`; // 寬度依比例計算
				cloudContainer.style.marginLeft = `${-(((16 / 9) * window.innerHeight - window.innerWidth) / 2)}px`; // 置中
				cloudContainer.style.height = '100vh'; // 確保高度是100vh
			} else if (aspectRatio < 4 / 3) { // 當比例小於4:3，則裁切
				const scale = window.innerWidth / 1366; // 以寬度縮放
				cloudContainer.style.transform = `scale(${scale})`;
				cloudContainer.style.height = `${(4 / 3) * window.innerWidth}px`; // 高度依比例計算
				cloudContainer.style.marginTop = `${-(((4 / 3) * window.innerWidth - window.innerHeight) / 2)}px`; // 置中
				cloudContainer.style.width = '100vw'; // 確保寬度是100vw
			} else { // 在4:3到16:9之間，正常顯示
				cloudContainer.style.transform = 'scale(1)';
				cloudContainer.style.width = '100vw';
				cloudContainer.style.height = '100vh';
				cloudContainer.style.margin = '0';
			}
		}

		function initCloud(cloud, index) {
			const topPosition = 5 + Math.random() * 15; 
			cloud.style.top = `${topPosition}%`;
			cloud.style.zIndex = index;
			const startPosition = Math.random() * 100; 
			cloud.style.left = `${startPosition}vw`;
		}

		clouds.forEach((cloud, index) => {
			initCloud(cloud, index);
			cloud.addEventListener('animationiteration', () => {
				initCloud(cloud, index);
			});
		});

		// 每週的圖片路徑
		const dayImages = {
			1: "img/mon.png",
			2: "img/tue.png",
			3: "img/wed.png",
			4: "img/thu.png",
			5: "img/fri.png",
			6: "img/sat.png",
			7: "img/sun.png"
		};

		// 判斷今天是星期幾
		let today = new Date().getDay();
		if (today === 0) today = 7; // 將星期天調整為 7

		let currentDay = today;

		// 更新顯示的圖片
		function updateDisplay() {
			const dayImageElement = document.getElementById("day-image");
			const todayOverlayElement = document.getElementById("today-overlay");

			// 更新當前日期的圖片
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

			// 確保在 1-7 之間循環
			if (currentDay > 7) {
				currentDay = 1;
			} else if (currentDay < 1) {
				currentDay = 7;
			}

			// 更新顯示
			updateDisplay();
		}

		// 這是 Yeti 動畫部分
		const yeti1 = document.getElementById('yeti1');
		const yeti2 = document.getElementById('yeti2');
		const totalFrames = 17;
		const animationDuration = 3.4 * 1000; // Yeti 行走動畫總時長 (毫秒)
		const frameInterval = animationDuration / totalFrames;
		const screenWidth = 100; // 屏幕寬度百分比
		const offset = 80; // 間隔百分比

		yeti1.style.left = "0vw";
		yeti2.style.left = `-80vw`;

		// Yeti 動畫函數
		function setupYetiAnimation(yeti) {
			let frame = 0;
			setInterval(() => {
				yeti.src = `img/yeti_${frame}.png`;
				frame = (frame + 1) % totalFrames;
			}, frameInterval);
		}

		// 設定每隻 Yeti 的移動重置位置
		function resetYetiPosition(yeti, otherYeti) {
			const currentPosition = parseFloat(yeti.style.left);
			const otherPosition = parseFloat(otherYeti.style.left);
			
			if (currentPosition >= screenWidth) {
				yeti.style.left = `${(otherPosition - offset)}vw`;
			}
		}

		setupYetiAnimation(yeti1);
		setupYetiAnimation(yeti2);

		setInterval(() => {
			yeti1.style.left = `${parseFloat(yeti1.style.left) + 0.0585}vw`;
			yeti2.style.left = `${parseFloat(yeti2.style.left) + 0.0585}vw`;
			resetYetiPosition(yeti1, yeti2);
			resetYetiPosition(yeti2, yeti1);
		}, 170);

		// 這是氣球動畫部分
		function initBalloon(balloon) {
			balloon.style.left = '100vw';
		}

		balloons.forEach((balloon) => {
			initBalloon(balloon);
			balloon.addEventListener('animationiteration', () => {
				initBalloon(balloon); // 當動畫結束時重新從右側進入
			});
		});

		// 調整縮放比例
		window.addEventListener('resize', adjustScale);
		adjustScale(); // 初始調整
		
		
		// 以下是NPC動畫部分
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