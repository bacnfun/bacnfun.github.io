// 獲取對話框及相關元素
const dialogBox = document.getElementById('dialog-box');
const closeButton = document.getElementById('close-button');
const textContainer = document.getElementById('dialog-text');
const optionsContainer = document.getElementById('dialog-options');
const inputField = document.getElementById('dialog-input');
const nextButton = document.getElementById('next-button');
const stopButton = document.getElementById('stop-button');

// 顯示對話框
function openDialog() {
    dialogBox.style.display = 'block';
}

// 更新關閉對話框的函數以考慮移除角色圖片
function closeDialog() {
    // 移除所有相關按鈕和容器
    const yesNoContainer = document.getElementById('yes-no-container');
    if (yesNoContainer) {
        yesNoContainer.remove(); // 移除容器
    }
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.remove(); // 移除「下一個」按鈕
    }
    const okButton = document.getElementById('ok-button');
    if (okButton) {
        okButton.remove(); // 移除「確認」按鈕
    }
    const inputField = document.getElementById('input-field');
    if (inputField) {
        inputField.remove(); // 移除輸入框
    }
    removeChar(); // 移除角色圖片

    dialogBox.style.display = 'none';
    textContainer.innerHTML = "";  // 清空文本
    optionsContainer.innerHTML = "";  // 清空選項

    // 清除逐字顯示 interval
    clearInterval(typeTextInterval);
}



// NPC 點擊時開啟對話框
document.getElementById('npc').addEventListener('click', function() {
    openDialog();
    loadDialogScript();  // 調用對話腳本
});

// 關閉按鈕的滑鼠事件處理
closeButton.addEventListener('mouseover', function() {
    closeButton.src = 'img/dlg/BtClose_2.png';
});
closeButton.addEventListener('mouseout', function() {
    closeButton.src = 'img/dlg/BtClose_1.png';
});
closeButton.addEventListener('mousedown', function() {
    closeButton.src = 'img/dlg/BtClose_3.png';
});
closeButton.addEventListener('mouseup', function() {
    closeButton.src = 'img/dlg/BtClose_2.png';
});
closeButton.addEventListener('click', closeDialog);

// 逐字顯示文字
function typeText(text) {
    const dialogTextElement = document.getElementById('dialog-text');
    dialogTextElement.innerHTML = ''; // 清空對話框內容

    // 將格式符號轉換為 HTML 標籤
    let formattedText = text
        .replace(/#b/g, '<span class="text-blue">')
        .replace(/#d/g, '<span class="text-purple">')
        .replace(/#g/g, '<span class="text-green">')
        .replace(/#k/g, '<span class="text-black">')
        .replace(/#r/g, '<span class="text-red">')
        .replace(/#e/g, '<span class="text-bold">')
        .replace(/#n/g, '</span>') // 使用閉合標籤代替開啟標籤以避免錯誤
        .replace(/\r\n/g, '<br>');

    let openTags = []; // 用來存放當前開啟的標籤
    let displayText = ''; // 儲存處理過的顯示文本
    let i = 0;

    // 定義逐字顯示的遞迴函數
    function typeWriter() {
        if (i < formattedText.length) {
            const currentChar = formattedText[i];

            if (currentChar === '<') {
                // 處理開啟或閉合的標籤
                const tagEnd = formattedText.indexOf('>', i);
                const tag = formattedText.slice(i, tagEnd + 1);

                if (!tag.startsWith('</')) {
                    // 開啟標籤，加入開啟標籤列表
                    openTags.push(tag);
                } else {
                    // 閉合標籤，從開啟標籤列表中移除
                    openTags.pop();
                }

                displayText += tag;
                i = tagEnd + 1;
            } else {
                // 處理普通字符
                displayText += currentChar;
                i++;
            }

            dialogTextElement.innerHTML = displayText;
            setTimeout(typeWriter, 30); // 每 30 毫秒顯示一個字元
        }
    }

    typeWriter();
}

// 顯示選項按鈕
function showOptions(options) {
    optionsContainer.innerHTML = "";  // 清空現有選項
    options.forEach(option => {
        const button = document.createElement("button");
        button.innerHTML = `<img class="dot" src="img/dlg/dot_1.png" width="6" height="7" alt="dot"> ${option.text}`;
        
        // 在點擊選項後清除選項並執行對應的動作
        button.onclick = () => {
            optionsContainer.innerHTML = ""; // 清除選項
            option.action(); // 執行選項的對應動作
        };

        // 為選項按鈕添加 hover 效果
        button.addEventListener('mouseover', () => {
            const dot = button.querySelector(".dot");
            dot.src = 'img/dlg/dot_2.png';  // 滑鼠懸停時變色
        });
        button.addEventListener('mouseout', () => {
            const dot = button.querySelector(".dot");
            dot.src = 'img/dlg/dot_1.png';  // 滑鼠離開時恢復原來的顏色
        });

        optionsContainer.appendChild(button);
    });

    // 設定選項的位置，讓選項顯示在文本下方的空兩行處
    const textHeight = textContainer.offsetHeight;
    optionsContainer.style.marginTop = `${textHeight + 20}px`;  // 調整選項的顯示位置
    optionsContainer.style.display = 'block';
}


// 顯示「下一個」按鈕
function showBtnNext(nextAction) {
    // 創建或取得「下一個」按鈕
    let nextButton = document.getElementById('next-button');
    if (!nextButton) {
        nextButton = document.createElement('img');
        nextButton.id = 'next-button';
        nextButton.src = 'img/dlg/BtNext_1.png';
        nextButton.width = 40;
        nextButton.height = 16;
        nextButton.style.position = 'absolute';
        nextButton.style.top = '172px';
        nextButton.style.left = '460px';
        dialogBox.appendChild(nextButton);
    }

    // 設置按鈕的事件處理
    nextButton.onclick = () => {
        if (nextAction) {
            nextAction(); // 執行下一個動作
        } else {
            closeDialog(); // 如果沒有動作，則結束對話
        }
    };

    // 添加 hover 效果
    nextButton.addEventListener('mouseover', () => {
        nextButton.src = 'img/dlg/BtNext_2.png';
    });
    nextButton.addEventListener('mouseout', () => {
        nextButton.src = 'img/dlg/BtNext_1.png';
    });
    nextButton.addEventListener('mousedown', () => {
        nextButton.src = 'img/dlg/BtNext_3.png';
    });
    nextButton.addEventListener('mouseup', () => {
        nextButton.src = 'img/dlg/BtNext_2.png';
    });
}

// 顯示是/否按鈕
function showBtnYesNo(yesAction, noAction) {
    // 創建或取得 "是" 和 "否" 按鈕容器
    let yesNoContainer = document.getElementById('yes-no-container');
    if (!yesNoContainer) {
        yesNoContainer = document.createElement('div');
        yesNoContainer.id = 'yes-no-container';
        yesNoContainer.style.position = 'absolute';
        yesNoContainer.style.top = '206px';
        yesNoContainer.style.left = '385px'; // 與對話框的 X 座標對齊
        yesNoContainer.style.display = 'none'; // 預設隱藏
        dialogBox.appendChild(yesNoContainer);
    }
    yesNoContainer.innerHTML = ''; // 清空現有內容

    // 創建 "是" 按鈕
    const yesButton = document.createElement("img");
    yesButton.src = "img/dlg/BtYes_1.png";
    yesButton.width = 57;
    yesButton.height = 16;
    yesButton.style.marginRight = "10px"; // 與「否」按鈕間距

    yesButton.addEventListener('mouseover', () => {
        yesButton.src = "img/dlg/BtYes_2.png";
    });
    yesButton.addEventListener('mouseout', () => {
        yesButton.src = "img/dlg/BtYes_1.png";
    });
    yesButton.addEventListener('mousedown', () => {
        yesButton.src = "img/dlg/BtYes_3.png";
    });
    yesButton.addEventListener('mouseup', () => {
        yesButton.src = "img/dlg/BtYes_2.png";
    });
    yesButton.onclick = () => {
        yesNoContainer.style.display = 'none'; // 隱藏按鈕容器
        yesAction();
    };

    // 創建 "否" 按鈕
    const noButton = document.createElement("img");
    noButton.src = "img/dlg/BtNo_1.png";
    noButton.width = 57;
    noButton.height = 16;

    noButton.addEventListener('mouseover', () => {
        noButton.src = "img/dlg/BtNo_2.png";
    });
    noButton.addEventListener('mouseout', () => {
        noButton.src = "img/dlg/BtNo_1.png";
    });
    noButton.addEventListener('mousedown', () => {
        noButton.src = "img/dlg/BtNo_3.png";
    });
    noButton.addEventListener('mouseup', () => {
        noButton.src = "img/dlg/BtNo_2.png";
    });
    noButton.onclick = () => {
        yesNoContainer.style.display = 'none'; // 隱藏按鈕容器
        noAction();
    };

    // 將按鈕加入容器
    yesNoContainer.appendChild(yesButton);
    yesNoContainer.appendChild(noButton);
    yesNoContainer.style.display = 'block'; // 顯示按鈕容器
}

	// 顯示「確認」按鈕
	function showBtnOk(callback) {
    // 創建或取得「確認」按鈕
    let okButton = document.getElementById('ok-button');
    if (!okButton) {
        okButton = document.createElement('img');
        okButton.id = 'ok-button';
        okButton.src = 'img/dlg/BtOk_1.png';
        okButton.width = 40;
        okButton.height = 16;
        okButton.style.position = 'absolute';
        okButton.style.top = '205px';
        okButton.style.left = '468px';
        dialogBox.appendChild(okButton);
    }

    // 設置按鈕的事件處理
    okButton.onclick = () => {
        if (callback) {
            callback(); // 執行回調函數，例如重整頁面
        } else {
            closeDialog(); // 如果沒有回調函數，則結束對話
        }
    };

    // 添加 hover 效果
    okButton.addEventListener('mouseover', () => {
        okButton.src = 'img/dlg/BtOk_2.png';
    });
    okButton.addEventListener('mouseout', () => {
        okButton.src = 'img/dlg/BtOk_1.png';
    });
    okButton.addEventListener('mousedown', () => {
        okButton.src = 'img/dlg/BtOk_3.png';
    });
    okButton.addEventListener('mouseup', () => {
        okButton.src = 'img/dlg/BtOk_2.png';
    });
}

	// 隱藏停止對話按鈕
	function hideStopButton() {
		if (closeButton) {
			closeButton.style.display = 'none'; // 隱藏停止按鈕
		}
	}


// 顯示輸入框
function showInputField() {
    // 檢查是否已經存在輸入框，避免重複創建
    let inputField = document.getElementById('input-field');
    if (!inputField) {
        inputField = document.createElement('input');
        inputField.id = 'input-field';
        inputField.type = 'text';
        inputField.style.fontFamily = 'simsun';
        inputField.style.fontSize = '12px';
        inputField.style.width = '300px';
        inputField.style.border = '1px solid #000';
        inputField.style.position = 'absolute';
        inputField.style.top = '90px'; // 放置在文本下方
        inputField.style.left = '164px'; // 可根據需要調整位置

        dialogBox.appendChild(inputField);
    }

    inputField.style.display = 'block';
    inputField.focus();
}

// 捕捉輸入框中的內容並將其傳遞給 union.js 中的函數處理
function processCharacterInput() {
    const inputField = document.getElementById('input-field');
    if (inputField) {
        const characterName = inputField.value.trim();
        if (characterName) {
            // 呼叫 union.js 中的函數，並傳遞 characterName
            sendToUnion(characterName); // 假設 `sendToUnion` 已在 union.js 中定義
        } else {
            case5(); // 如果沒有輸入內容，引導到 case5
        }
    }
}

// 移除輸入框的函數
function removeInputField() {
    const inputField = document.getElementById('input-field');
    if (inputField) {
        inputField.remove();
    }
}

// 移除「下一個」按鈕的函數
function removeNextButton() {
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.remove();
    }
}


// 顯示角色圖片
function ShowChar(imageUrl) {
    // 檢查是否已經存在圖片容器，避免重複創建
    let charContainer = document.getElementById('char-container');
    if (!charContainer) {
        charContainer = document.createElement('div');
        charContainer.id = 'char-container';
        charContainer.style.position = 'absolute';
        charContainer.style.width = '96px';
        charContainer.style.height = '96px';
        charContainer.style.top = '17px';
        charContainer.style.left = '376px';
        dialogBox.appendChild(charContainer);
    }

    // 清空容器並添加圖片
    charContainer.innerHTML = ''; // 清空之前的內容
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.width = 96;
    imgElement.height = 96;
    charContainer.appendChild(imgElement);
}

// 移除角色圖片
function removeChar() {
    const charContainer = document.getElementById('char-container');
    if (charContainer) {
        charContainer.remove(); // 移除圖片容器
    }
}
