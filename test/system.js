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

		// 音樂控制
		let isPlaying = false; // 預設音樂是播放停止狀態
		const bgmPlayer = document.getElementById('bgmPlayer');
		const playButton = document.getElementById('playButton');

		bgmPlayer.volume = 0.2; // 音量設為20%

		playButton.addEventListener('click', function() {
			if (isPlaying) {
				bgmPlayer.pause();
				playButton.src = "img/play.png"; // 更換為播放圖示（可以選擇不同圖示）
			} else {
				bgmPlayer.play();
				playButton.src = "img/play.png"; // 更換為暫停圖示
			}
			isPlaying = !isPlaying;
		});

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
		
		// 監聽左鍵按下和放開事件
			document.addEventListener('mousedown', function(event) {
				if (event.button === 0) { // 左鍵（button 0 代表左鍵）
					document.body.style.cursor = "url('img/Cursor1.png'), auto"; // 改為 Cursor1.png
				}
			});

			document.addEventListener('mouseup', function(event) {
				if (event.button === 0) { // 左鍵
					document.body.style.cursor = "url('img/Cursor0.png'), auto"; // 恢復為 Cursor0.png
				}
			});

			// 監聽鼠標移動到超連結上時的事件
			const links = document.querySelectorAll('a'); // 選取所有超連結
			links.forEach(link => {
				link.addEventListener('mouseenter', function() {
					document.body.style.cursor = "url('img/Cursor1.png'), auto"; // 滑鼠移入超連結時變為 Cursor1.png
				});

				link.addEventListener('mouseleave', function() {
					document.body.style.cursor = "url('img/Cursor0.png'), auto"; // 滑鼠移開超連結時恢復為 Cursor0.png
				});
			});
			
		const signCounts = {
			mon: 0,
			tue: 0,
			wed: 0,
			thu: 0,
			fri: 0,
			sat: 0,
			sun: 0
		};

		// 從 localStorage 讀取數字，如果存在的話
		function loadSignCounts() {
			const savedCounts = JSON.parse(localStorage.getItem('signCounts'));
			if (savedCounts) {
				for (let day in savedCounts) {
					if (signCounts.hasOwnProperty(day)) {
						signCounts[day] = savedCounts[day];
					}
				}
			}
		}

		// 更新每一天的簽到次數顯示
		function updateSignCounts() {
			document.getElementById('count-mon').textContent = signCounts.mon;
			document.getElementById('count-tue').textContent = signCounts.tue;
			document.getElementById('count-wed').textContent = signCounts.wed;
			document.getElementById('count-thu').textContent = signCounts.thu;
			document.getElementById('count-fri').textContent = signCounts.fri;
			document.getElementById('count-sat').textContent = signCounts.sat;
			document.getElementById('count-sun').textContent = signCounts.sun;
		}

		// 調用更新函數
		loadSignCounts();
		updateSignCounts();

		// 設定數字位置
		const numberPositions = [
			{ x: 263, y: 195 },
			{ x: 263, y: 239 },
			{ x: 263, y: 284 },
			{ x: 263, y: 331 },
			{ x: 263, y: 376 },
			{ x: 263, y: 420 },
			{ x: 263, y: 464 }
		];

	// 建立輸入框並設置限制
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
			input.value = signCounts[Object.keys(signCounts)[index]]; // 預設顯示當前儲存的數字
			
			// 監聽輸入框的 input 事件
			input.addEventListener('input', function() {
				if (parseInt(input.value) > 77) {
					input.value = 77;  // 如果輸入的數字大於 77，將其強制設置為 77
				} else if (parseInt(input.value) < 0) {
					input.value = 0;  // 如果小於 0，將其強制設置為 0
				}
			});

			signboard.appendChild(input);
		});
	}


		// 「修正」按鈕點擊事件
		document.getElementById('edit-button').addEventListener('click', function() {
			createInputFields(); // 顯示輸入框
			showConfirmCancelButtons(); // 顯示確認與取消按鈕
		});

		// 顯示確認與取消按鈕
		function showConfirmCancelButtons() {
			// 隱藏「修正」按鈕
			document.getElementById('edit-button').style.display = 'none';
			
			// 顯示「確認」和「取消」按鈕
			document.getElementById('confirm-cancel-buttons').style.display = 'block';
		}

		// 確認按鈕點擊事件
		function confirmAction() {
			// 取得所有輸入框
			const inputFields = document.querySelectorAll('.input-field');

			// 更新 signCounts 變數
			inputFields.forEach((input, index) => {
				const day = Object.keys(signCounts)[index];  // 得到對應的星期
				signCounts[day] = parseInt(input.value, 10); // 更新 signCounts 的數字
			});

			// 保存到 localStorage
			localStorage.setItem('signCounts', JSON.stringify(signCounts));

			// 更新顯示
			updateSignCounts();
			displayTotal();

			// 隱藏「確認」和「取消」按鈕
			document.getElementById('confirm-cancel-buttons').style.display = 'none';
			// 重新顯示「修正」按鈕
			document.getElementById('edit-button').style.display = 'block';

			// 移除所有輸入框
			inputFields.forEach(input => input.remove());
		}

		// 取消按鈕點擊事件
		function cancelAction() {
			// 取消操作，並隱藏「確認」和「取消」按鈕
			document.getElementById('confirm-cancel-buttons').style.display = 'none';
			
			// 重新顯示「修正」按鈕
			document.getElementById('edit-button').style.display = 'block';
			
			// 移除所有輸入框
			const inputFields = document.querySelectorAll('.input-field');
			inputFields.forEach(input => input.remove());
		}

			// 計算七天的加總
			function calculateTotal() {
				return Object.values(signCounts).reduce((sum, count) => sum + count, 0);
			}

			// 預載入數字圖片
			function preloadImages() {
				for (let i = 0; i <= 9; i++) {
					const img = new Image(); // 創建新的 Image 物件
					img.src = `img/signboard/${i}.png`;  // 預載入 0 到 9 的數字圖片
				}
			}

			// 顯示加總數字圖片
			function displayTotal() {
				const total = calculateTotal(); // 獲取加總數字
				const signboard = document.getElementById('signboard');
				const totalStr = total.toString().padStart(3, '0'); // 確保總和為三位數，例：'001', '023', '539'

				// 確保圖片位置的基準點為 (120, 40)
				const baseX = 122;
				const baseY = 42;

				const digitWidths = {
					'0': 14,
					'1': 11,
					'2': 13,
					'3': 14,
					'4': 16,
					'5': 14,
					'6': 15,
					'7': 14,
					'8': 15,
					'9': 15
				};

				// 移除之前的數字圖片（如果有）
				const existingImages = signboard.querySelectorAll('.total-digit');
				existingImages.forEach(img => img.remove());

				let currentX = baseX; // 用來追蹤每個數字的起始位置

				// 顯示總和的每一位數字
				totalStr.split('').forEach(digit => {
					const img = document.createElement('img');
					img.src = `img/signboard/${digit}.png`;  // 對應的數字圖片
					img.className = 'total-digit';
					img.style.position = 'absolute';
					img.style.top = `${baseY}px`;
					img.style.left = `${currentX}px`; // 動態設置每個圖片的位置
					currentX += digitWidths[digit]; // 更新X軸位置為圖片的寬度
					signboard.appendChild(img); // 確保圖片加入到signboard中
				});
			}


				// 預設資料：將角色名稱設為 "尚未設定角色"
				let cha_name = '尚未設定角色'; // 字串形式的角色名稱

				// 角色等級、圖片路徑和職業
				let cha_level = 10;  // 預設等級
				let cha_img = 'img/signboard/defaultcha.png';  // 預設角色圖片
				let cha_job = '初心者';  // 預設職業

				// 儲存角色資料到 localStorage
				function saveCharacterData() {
				  const characterData = {
					level: cha_level,
					img: cha_img,
					name: cha_name,
					job: cha_job,
				  };
				  localStorage.setItem('characterData', JSON.stringify(characterData)); // 將資料轉為 JSON 字串並儲存
				}

				// 讀取角色資料從 localStorage
				function loadCharacterData() {
				  const savedData = localStorage.getItem('characterData');
				  if (savedData) {
					const characterData = JSON.parse(savedData); // 解析 JSON 字串
					cha_level = characterData.level;
					cha_img = characterData.img;
					cha_name = characterData.name;
					cha_job = characterData.job;
				  }
				}

				// 顯示角色資料函數
				function displayCharacterInfo() {
				  const signboard = document.getElementById('signboard');

				  // 檢查是否已經存在角色資訊容器，存在則移除
				  let characterInfoContainer = document.getElementById('character-info-container');
				  if (characterInfoContainer) {
					characterInfoContainer.remove();
				  }

				  // 創建角色資訊容器
				  characterInfoContainer = document.createElement('div');
				  characterInfoContainer.id = 'character-info-container';
				  characterInfoContainer.style.position = 'relative';

				  // 顯示角色等級
				  const levelElement = document.createElement('div');
				  levelElement.textContent = `Lv. ${cha_level}`;
				  levelElement.style.position = 'absolute';
				  levelElement.style.left = '72px';
				  levelElement.style.top = '23px';
				  levelElement.style.fontFamily = 'SimSun';
				  levelElement.style.fontSize = '12px';
				  levelElement.style.color = 'white';
				  levelElement.style.fontWeight = 'bold';
				  characterInfoContainer.appendChild(levelElement);

				  // 顯示角色圖片
				  const imgElement = document.createElement('img');
				  imgElement.src = cha_img;
				  imgElement.style.position = 'absolute';
				  imgElement.style.left = '20px';
				  imgElement.style.top = '35px';
				  imgElement.style.width = '100px';
				  imgElement.style.height = '100px';
				  characterInfoContainer.appendChild(imgElement);

				  // 顯示角色名稱
				  const nameElement = document.createElement('div');
				  nameElement.textContent = cha_name;
				  nameElement.style.position = 'absolute';
				  nameElement.style.left = '70px';
				  nameElement.style.top = '140px';
				  nameElement.style.fontFamily = 'SimSun';
				  nameElement.style.fontSize = '12px';
				  nameElement.style.color = 'white';
				  nameElement.style.textAlign = 'center';
				  nameElement.style.transform = 'translate(-50%, -50%)';
				  characterInfoContainer.appendChild(nameElement);

				  // 顯示角色職業
				  const jobElement = document.createElement('div');
				  jobElement.textContent = cha_job;
				  jobElement.style.position = 'absolute';
				  jobElement.style.left = '70px';
				  jobElement.style.top = '160px';
				  jobElement.style.fontFamily = 'SimSun';
				  jobElement.style.fontSize = '12px';
				  jobElement.style.color = 'white';
				  jobElement.style.textAlign = 'center';
				  jobElement.style.transform = 'translate(-50%, -50%)';
				  characterInfoContainer.appendChild(jobElement);

				  // 將角色資訊容器添加到 signboard
				  signboard.appendChild(characterInfoContainer);
				}

				// 調用讀取角色資料
				loadCharacterData(); // 加載資料

				// 調用顯示角色資料的函數
				displayCharacterInfo();

				// 從 datasync.js 匯入必要的函數
				import {
				  publishLinkCode,
				  verifyAndSync,
				  syncToFirestore,
				  syncFromFirestore,
				} from "./datasync.js";

				// 確認 localStorage 是否有 userID
				const userID = localStorage.getItem("userID");

				// 初始化同步的函數：檢查是否從 Firestore 獲取資料或使用本機資料
				async function initializeSync() {
				  if (userID) {
					// 若存在 userID，嘗試從 Firestore 同步資料
					const result = await syncFromFirestore(userID);
					if (result.success) {
					  console.log("已從 Firestore 同步資料：", result.data);
					  localStorage.setItem("characterData", JSON.stringify(result.data));
					} else {
					  console.error("從 Firestore 同步失敗：", result.message);
					}
				  } else {
					// 若無 userID，保留本機資料
					console.log("localStorage 中未找到 userID，將使用本機資料。");
				  }
				}

				// 發行新引繼代碼並同步本機資料
				async function handlePublishLinkCode() {
				  const localData = JSON.parse(localStorage.getItem("characterData")) || {};
				  const result = await publishLinkCode(localData);
				  if (result.success) {
					console.log("引繼代碼發行成功：", result.linkCode);
				  } else {
					console.error("引繼代碼發行失敗：", result.message);
				  }
				}
				
				// 將函數掛載到全域（供調試或其他模組使用）
				window.handlePublishLinkCode = handlePublishLinkCode;



			function resetData() {
				// 清空 localStorage
				localStorage.clear();

				// 清空全域變數中的角色資料和簽到次數
				window.characterData = {
					level: 10,
					img: 'img/signboard/defaultcha.png',
					name: '尚未設定角色',
					job: '初心者'
				};

				window.signCounts = {
					mon: 0,
					tue: 0,
					wed: 0,
					thu: 0,
					fri: 0,
					sat: 0,
					sun: 0
				};

				// 儲存預設值到 localStorage
				localStorage.setItem('characterData', JSON.stringify(window.characterData));
				localStorage.setItem('signCounts', JSON.stringify(window.signCounts));

				// 更新每一天的簽到次數顯示
				document.getElementById('count-mon').textContent = 0;
				document.getElementById('count-tue').textContent = 0;
				document.getElementById('count-wed').textContent = 0;
				document.getElementById('count-thu').textContent = 0;
				document.getElementById('count-fri').textContent = 0;
				document.getElementById('count-sat').textContent = 0;
				document.getElementById('count-sun').textContent = 0;

				// 更新總次數顯示
				displayTotal();

				// 將角色資訊重設為預設值
				const characterNameElement = document.getElementById('character-name');
				const characterImageElement = document.getElementById('character-image');
				const characterJobElement = document.getElementById('character-job');
				const characterLevelElement = document.getElementById('character-level');

				if (characterNameElement) characterNameElement.textContent = '尚未設定角色';
				if (characterImageElement) characterImageElement.src = 'img/signboard/defaultcha.png';
				if (characterJobElement) characterJobElement.textContent = '初心者';
				if (characterLevelElement) characterLevelElement.textContent = 'Lv. 10';

				// 重置輸入框的值為 0
				const inputFields = document.querySelectorAll('.input-field');
				inputFields.forEach(input => {
					input.value = 0;
				});

				// 更新簽到次數以匹配輸入框
				updateSignCounts();
			}

				// 初始化簽到數字
				let todaysigncount = 2;

				// 顯示數字和按鈕
				function displaySignControls() {
					const signboard = document.getElementById('signboard');

					// 檢查是否已經存在數字元素，存在則移除
					let signCountElement = document.getElementById('today-sign-count');
					if (signCountElement) {
						signCountElement.remove();
					}

					// 創建數字圖片元素
					signCountElement = document.createElement('img');
					signCountElement.id = 'today-sign-count';
					signCountElement.src = `img/signtoday/${todaysigncount}.png`; // 初始圖片
					signCountElement.style.position = 'absolute';
					signCountElement.style.left = '294px'; 
					signCountElement.style.top = '46px';
					signboard.appendChild(signCountElement);

					// 創建減按鈕
					let subtractButton = document.createElement('img');
					subtractButton.id = 'subtract-button';
					subtractButton.src = 'img/signtoday/btndown_1.png';
					subtractButton.style.position = 'absolute';
					subtractButton.style.left = '246px'; 
					subtractButton.style.top = '73px';
					signboard.appendChild(subtractButton);

					// 創建加按鈕
					let addButton = document.createElement('img');
					addButton.id = 'add-button';
					addButton.src = 'img/signtoday/btnup_1.png';
					addButton.style.position = 'absolute';
					addButton.style.left = '246px'; 
					addButton.style.top = '53px';
					signboard.appendChild(addButton);

					// 更新按鈕狀態
					function updateButtonStates() {
						addButton.src = todaysigncount >= 7 ? 'img/signtoday/btnup_4.png' : 'img/signtoday/btnup_1.png';
						subtractButton.src = todaysigncount <= 1 ? 'img/signtoday/btndown_4.png' : 'img/signtoday/btndown_1.png';
						addButton.style.pointerEvents = todaysigncount >= 7 ? 'none' : 'auto';
						subtractButton.style.pointerEvents = todaysigncount <= 1 ? 'none' : 'auto';
					}

					// 加按鈕事件
					addButton.addEventListener('mouseover', () => {
						if (todaysigncount < 7) addButton.src = 'img/signtoday/btnup_2.png';
					});
					addButton.addEventListener('mouseout', () => {
						updateButtonStates();
					});
					addButton.addEventListener('mousedown', () => {
						if (todaysigncount < 7) addButton.src = 'img/signtoday/btnup_3.png';
					});
					addButton.addEventListener('mouseup', () => {
						if (todaysigncount < 7) {
							todaysigncount++;
							signCountElement.src = `img/signtoday/${todaysigncount}.png`;
							updateButtonStates();
						}
					});

					// 減按鈕事件
					subtractButton.addEventListener('mouseover', () => {
						if (todaysigncount > 1) subtractButton.src = 'img/signtoday/btndown_2.png';
					});
					subtractButton.addEventListener('mouseout', () => {
						updateButtonStates();
					});
					subtractButton.addEventListener('mousedown', () => {
						if (todaysigncount > 1) subtractButton.src = 'img/signtoday/btndown_3.png';
					});
					subtractButton.addEventListener('mouseup', () => {
						if (todaysigncount > 1) {
							todaysigncount--;
							signCountElement.src = `img/signtoday/${todaysigncount}.png`;
							updateButtonStates();
						}
					});

					// 初始載入時更新按鈕狀態
					updateButtonStates();
				}


					// 初始化簽到按鈕和邏輯
					function displaySignButton() {
						const signboard = document.getElementById('signboard');

						// 檢查是否已經存在簽到按鈕，存在則移除
						let signButton = document.getElementById('sign-button');
						if (signButton) {
							signButton.remove();
						}

						// 創建簽到按鈕
						signButton = document.createElement('img');
						signButton.id = 'sign-button';
						signButton.src = 'img/signtoday/signcomp2_1.png';
						signButton.style.position = 'absolute';
						signButton.style.left = '265px';
						signButton.style.top = '99px';
						signboard.appendChild(signButton);

						// 判斷是否可以簽到
						const todayDateStr = getTodayDateStr();
						const storedDateStr = localStorage.getItem('daysign');
						const now = new Date();
						const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
						const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
						const todayKey = dayKeys[dayOfWeek]; // 獲取今天的key

						// 判斷當天完成次數是否已達 77 次
						if (signCounts[todayKey] >= 77) {
							signButton.src = 'img/signtoday/signcomp2_4.png';
							signButton.style.pointerEvents = 'none'; // 禁用按鈕
							return;
						}

						if (storedDateStr === todayDateStr) {
							// 已簽到，設置按鈕無法點擊
							signButton.src = 'img/signtoday/signcomp2_4.png';
							signButton.style.pointerEvents = 'none';
						} else {
							// 按鈕事件設定
							signButton.addEventListener('mouseover', () => {
								signButton.src = 'img/signtoday/signcomp2_2.png';
							});
							signButton.addEventListener('mouseout', () => {
								signButton.src = 'img/signtoday/signcomp2_1.png';
							});
							signButton.addEventListener('mousedown', () => {
								signButton.src = 'img/signtoday/signcomp2_3.png';
							});
							signButton.addEventListener('mouseup', () => {
								// 執行簽到動作，計算新完成次數
								const newCount = signCounts[todayKey] + todaysigncount;
								if (newCount > 77) {
									signCounts[todayKey] = 77; // 設定為最大值 77
								} else {
									signCounts[todayKey] = newCount;
								}

								// 更新 localStorage 並顯示
								localStorage.setItem('signCounts', JSON.stringify(signCounts));
								localStorage.setItem('daysign', todayDateStr);

								// 更新顯示
								updateSignCounts();
								displayTotal();

								// 更新按鈕狀態
								signButton.style.pointerEvents = 'none'; // 禁用按鈕
								signButton.src = 'img/signtoday/signcomp2_4.png';
							});
						}
					}

					// 獲取今天的日期字串
					function getTodayDateStr() {
						const now = new Date();
						const year = now.getFullYear().toString().slice(-2); // 取後兩位
						const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份補零
						const day = now.getDate().toString().padStart(2, '0'); // 日期補零
						return `${year}${month}${day}`;
					}

					// 更新今天的簽到次數
					function updateSignCountForToday() {
						const now = new Date();
						const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
						const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

						const todayKey = dayKeys[dayOfWeek]; // 獲取今天的key
						signCounts[todayKey] += todaysigncount; // 更新今日簽到次數

						// 確保總次數不超過 77
						if (signCounts[todayKey] > 77) {
							signCounts[todayKey] = 77;
						}

						// 儲存更新後的簽到次數
						localStorage.setItem('signCounts', JSON.stringify(signCounts));

						// 更新顯示
						updateSignCounts();
						displayTotal();
					}

					// 在頁面載入時執行初始化
					window.onload = function() {
						updateDisplay();
						bgmPlayer.play();
						preloadImages();
						displayTotal();
						displaySignControls();
						displaySignButton(); // 新增顯示簽到按鈕
						initializeSync; // 頁面載入時自動執行初始化同步
					};
