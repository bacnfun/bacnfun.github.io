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


function case10() {
    const storedCode = localStorage.getItem('transferCode');
    const syncStatus = storedCode ? "已同步" : "未同步";
    const displayCode = storedCode ? `${storedCode} (請反白複製)` : "無";

    typeText(`簽到資料同步狀態： ${syncStatus}\r\n你的引繼代碼： ${displayCode}`);
    const options = [];
    if (!storedCode) options.push({ text: "發行引繼代碼", action: case11 });
    options.push({ text: "輸入引繼代碼", action: case12 });
    showOptions(options);
}

function case11() {
    issueTransferCode()
        .then(code => {
            typeText(`你的引繼代碼為： ${code}\r\n角色簽到資料設定資料庫同步完成！\r\n可以在其他裝置/瀏覽器輸入一樣的引繼代碼同步簽到資料！歡迎下次再使用！`);
            showBtnOk();
        })
        .catch(() => {
            typeText("無法發行引繼代碼，請稍後再試。");
            showBtnOk();
        });
}

function case12() {
    typeText("請輸入引繼代碼：");
    showInputField();
    showBtnNext(() => {
        const inputCode = getInputFieldValue();
        if (!inputCode) {
            case13(); // 顯示錯誤
        } else {
            verifyTransferCode(inputCode);
        }
    });
}

function case13() {
    removeInputField();
    removeNextButton();
    typeText("你輸入的引繼代碼不存在，請重新輸入。");
    showBtnOk();
}

function case14() {
    removeInputField();
    removeNextButton();
    ShowChar(globalCharacterData.CharacterLookUrl);
    typeText(`你輸入的角色為 #r${globalCharacterData.GameWorldName}#n伺服器 等級 #e#r${globalCharacterData.UnionLevel} #g職業 #e#r${globalCharacterData.JobName} #e#b${globalCharacterData.CharacterName}#n \r\n是否要套用該角色資料？`);
    showBtnYesNo(() => syncDataFromFirestore(globalCharacterData), case17);
}

function case15() {
    removeInputField();
    removeNextButton();
    ShowChar(globalCharacterData.CharacterLookUrl);
    typeText(`你輸入的角色為 #e#b${globalCharacterData.CharacterName}\r\n本機最後簽到時間 XXXX-XX-XX (已簽到次數：XXX)\r\n資料庫最後簽到時間 XXXX-XX-XX (已簽到次數：XXX)\r\n是否以最新的資料進行簽到次數同步？`);
    showBtnYesNo(() => syncDataFromFirestore(globalCharacterData), case17);
}

function case16() {
    typeText("角色簽到資料設定資料庫同步完成！歡迎下次再使用！");
    showBtnOk();
}

function case17() {
    typeText("等你想清楚了再來找我吧！");
    showBtnOk();
}