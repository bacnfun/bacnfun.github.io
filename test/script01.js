// 引入對話腳本及指令
function loadDialogScript() {
    typeText("歡迎你隨時來到充滿快樂的怪物公園～");  // 逐字顯示文字
    showOptions([
        { text: "設定/更新角色資料", action: case1 },
        { text: "發行/輸入引繼代碼", action: case10 },
        { text: "網站資料初始化", action: case7 }
    ]);
}

function case1() {
    typeText("\r\n\r\n請輸入你的角色名稱：");
    showInputField();  // 顯示輸入框
	showBtnNext(processCharacterInput); // 將 `processCharacterInput` 設為「下一個」按鈕的動作
}

function case2() {
	removeInputField()
	removeNextButton()
    typeText("\r\n\r\n\r\n與伺服器連線失敗，無法獲得角色資料，請稍後再試一次。");
    showBtnOk();
}

function case3() {
    removeInputField();
    removeNextButton();
    ShowChar(globalCharacterData.CharacterLookUrl);
    typeText(`\r\n\r\n\r\n\r\n你輸入的角色為 \r\n#r${globalCharacterData.GameWorldName}#n伺服器 等級 #e#r${globalCharacterData.UnionLevel} #g職業 #e#r${globalCharacterData.JobName} #e#b${globalCharacterData.CharacterName}#n \r\n#e#b是否要套用該角色資料？`);
    showBtnYesNo(case6, case9); // 提供「是/否」選項進一步操作
}

function case4() {
	removeInputField()
	removeNextButton()
    typeText("\r\n\r\n你所輸入的角色名稱可能錯誤，或該角色不在官網聯盟戰地排行榜內，請重新輸入。");
    showBtnOk();
}

function case5() {
	removeInputField()
	removeNextButton()
    typeText("\r\n\r\n\r\n你好像沒有輸入角色名稱耶？請重新輸入。");
    showBtnOk();
}


function case6() {
    removeChar();
    updateCharacterData(
        globalCharacterData.UnionLevel,
        globalCharacterData.CharacterLookUrl,
        globalCharacterData.CharacterName,
        globalCharacterData.JobName
    );
    typeText("\r\n\r\n頁面角色更新完成！#r把所有星期的任務完成77次#n後，\r\n#b收集7個星期的勳章#n再回來吧！");
    showBtnNext(closeDialog);
}


function case7() {
    typeText("\r\n\r\n\r\n#e#r真的確定要將資料初始化嗎？\r\n#b(角色資料、已登錄天數等都會被移除)");

    showBtnYesNo(case8, case9);
}

function case8() {
	hideStopButton(); // 在重置後隱藏停止按鈕
    resetData();
    typeText("\r\n\r\n\r\n資料初始化完成！歡迎下次再使用！");
	showBtnOk(() => {
        location.reload(); // 重整頁面
    });
}

function case9() {
	removeChar()
    typeText("\r\n\r\n\r\n等你想清楚了再來找我吧！");
	showBtnOk();
}


// Case 10: 判定同步狀態
function case10() {
  const userID = localStorage.getItem("userID");
  const syncStatus = userID ? "#e#b已同步" : "#e#r未同步";
  const linkCode = userID ? `#e#r${userID}` : "#e#r無";

  // 顯示同步狀態和引繼代碼
  typeText(`簽到資料同步狀態： ${syncStatus}\n#g你的引繼代碼： ${linkCode}`);

  // 動態設置選項
  const options = [
    { text: "輸入引繼代碼", action: case12 } // 輸入引繼代碼選項固定顯示
  ];

  if (!userID) {
    // 若無 userID，顯示發行引繼代碼選項
    options.unshift({ text: "發行引繼代碼", action: case11 });
  }

  // 顯示動態選項
  showOptions(options);
}


function case11() {
  // 從 localStorage 讀取資料
  const characterData = JSON.parse(localStorage.getItem("characterData")) || {};
  const cha_level = characterData.level || 10; // 預設等級
  const cha_img = characterData.img || 'img/signboard/defaultcha.png'; // 預設圖片
  const cha_name = characterData.name || '尚未設定角色'; // 預設名稱
  const cha_job = characterData.job || '初心者'; // 預設職業

  const localData = {
    level: cha_level,
    img: cha_img,
    name: cha_name,
    job: cha_job,
    signCounts: JSON.parse(localStorage.getItem("signCounts")) || {}, // 從 localStorage 獲取簽到次數
  };

  closeDialog(); // 關閉對話框
  publishLinkCode(localData).then((result) => {
    openDialog(); // 重新開啟對話框
    if (result.success) {
      typeText(`你的引繼代碼為： #e#r${result.linkCode}\n角色簽到資料設定資料庫同步完成！`);
      showBtnOk();
    } else {
      typeText(`發行失敗：${result.message}`);
      showBtnOk();
    }
  });
}


function case12() {
  typeText("請輸入引繼代碼：");
  showInputField();
  showBtnNext(() => {
    const inputCode = getInputValue();
    if (!inputCode) {
      case19();
      return;
    }
    closeDialog();
    verifyAndSync(inputCode).then((result) => {
      openDialog();
      if (result.success) {
        typeText("資料同步完成！");
        showBtnOk();
      } else {
        typeText(result.message);
        showBtnOk();
      }
    });
  });
}


// Case 13: 引繼代碼不存在
function case13() {
    removeInputField();
    removeNextButton();
    typeText("你輸入的引繼代碼不存在，請重新輸入。");
    showBtnOk();
}

// Case 14: 資料不同
function case14() {
    removeInputField();
    removeNextButton();
    ShowChar(globalCharacterData.CharacterLookUrl);
    typeText(`\r\n\r\n\r\n你輸入的角色為 \r\n#r${globalCharacterData.GameWorldName}#n伺服器 等級 #e#r${globalCharacterData.UnionLevel} #g職業 #e#r${globalCharacterData.JobName} #e#b${globalCharacterData.CharacterName}#n \r\n#e#b是否要套用該角色資料？`);
    showBtnYesNo(case16, case17);
}

// Case 15: 簽到進度不同
function case15() {
    const localData = calculateLocalSignCounts();
    const dbData = calculateDatabaseSignCounts();
    const syncSource = compareSyncProgress(localData, dbData);

    removeInputField();
    removeNextButton();
    ShowChar(globalCharacterData.CharacterLookUrl);
    typeText(`你輸入的角色為 #e#b${globalCharacterData.CharacterName}\r\n本機最後簽到時間 ${localData.lastSignDate} (已簽到次數：${localData.totalSignCounts})\r\n資料庫最後簽到時間 ${dbData.lastSignDate} (已簽到次數：${dbData.totalSignCounts})\r\n是否以最新的${syncSource === 'local' ? "#e#r本機" : "#e#r資料庫"}資料進行簽到次數同步？`);
    showBtnYesNo(case16, case17);
}

// Case 16: 確認同步完成
function case16() {
    typeText("角色簽到資料設定資料庫同步完成！歡迎下次再使用！");
    showBtnOk();
}

// Case 17: 取消同步
function case17() {
    typeText("等你想清楚了再來找我吧！");
    showBtnOk();
}

// Case 18: 資料庫連線失敗
function case18(errorMsg) {
    typeText(`資料庫連線失敗：${errorMsg}`);
    showBtnOk();
}

// Case 19: 未輸入代碼
function case19() {
    removeInputField();
    removeNextButton();
    typeText("你好像沒有輸入代碼耶？請重新輸入。");
    showBtnOk();
}
