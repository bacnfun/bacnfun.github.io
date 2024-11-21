const worldNumber = {
    "艾麗亞": 0,
    "普力特": 1,
    "琉德": 2,
    "優依娜": 3,
    "愛麗西亞": 4,
    "殺人鯨": 6,
    "Reboot": 45,
};

// 發送請求以獲取角色數據
async function requestUnionRank(target) {
    // 使用你 Netlify 部署的 cors-proxy 函數的 URL
    const proxyUrl = 'https://bacnfun-mapleunion.netlify.app/.netlify/functions/cors-proxy';
    const payload = {
        RankType: "3", // 3 = 總等級排行, 1 = 攻擊力排行
        GameWorldId: "-1",
        CharacterName: target
    };

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            return { data, success: true };
        } else {
            console.error(`Request failed with status ${response.status}`);
            return { data: null, success: false };
        }
    } catch (error) {
        console.error('Error:', error);
        return { data: null, success: false };
    }
}

// 定義全域變數來儲存角色資料
let globalCharacterData = {};

// 處理獲取到的角色資訊
async function displayUnionRank(characterName) {
    const result = await requestUnionRank(characterName);
    const nowTime = new Date().toLocaleString();

    if (!result.success) {
        // 進入 case2，顯示連線失敗訊息
        openDialog();
        case2();
        return;
    }

    if (!result.data || result.data.Code !== 1) {
        // 進入 case4，顯示查無此角色訊息
        openDialog();
        case4();
        return;
    }

    // 成功獲取角色資料，將其存入全域變數
    globalCharacterData = {
        CharacterName: result.data.Data.CharacterName,
        JobName: result.data.Data.JobName,
        UnionLevel: result.data.Data.UnionLevel,
        GameWorldName: result.data.Data.GameWorldName,
        CharacterLookUrl: result.data.Data.CharacterLookUrl
    };

    // 進入 case3 並傳遞資料
    openDialog();
    case3(globalCharacterData);
}


// 此函數可用於呼叫 displayUnionRank 並處理輸入框的內容
function sendToUnion(characterName) {
    if (characterName) {
        displayUnionRank(characterName);
		closeDialog()
    } else {
        case5(); // 若未輸入角色名稱，進入 case5 顯示提示訊息
    }
}
