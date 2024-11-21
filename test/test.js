import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// 初始化 Firestore
const db = getFirestore();

// 生成唯一的引繼碼
function generateUniqueCode(length = 5) {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 避免 1,l,i,0,o
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// 檢查 Firestore 是否存在該引繼碼
async function checkCodeExists(code) {
    const docRef = doc(db, "userID", code);
    const docSnap = await getDoc(docRef);
    return docSnap.exists(); // 返回是否已存在
}

// 將本機資料同步至 Firestore
async function syncLocalDataToFirestore() {
    // 讀取本機資料
    const characterData = JSON.parse(localStorage.getItem("characterData"));
    const signCounts = JSON.parse(localStorage.getItem("signCounts"));
    const lastSignDate = localStorage.getItem("daysign");

    // 確保資料存在
    if (!characterData || !signCounts || !lastSignDate) {
        console.error("本機資料不完整，無法同步");
        return;
    }

    // 生成唯一引繼碼
    let uniqueCode;
    do {
        uniqueCode = generateUniqueCode();
    } while (await checkCodeExists(uniqueCode)); // 確保不重複

    // 構建 Firestore 資料結構
    const firestoreData = {
        characterData,
        signCounts,
        lastSignDate,
        createdAt: new Date().toISOString(),
    };

    // 將資料寫入 Firestore
    try {
        const docRef = doc(db, "userID", uniqueCode);
        await setDoc(docRef, firestoreData);

        // 成功後更新本機存儲中的引繼碼
        localStorage.setItem("uniqueCode", uniqueCode);
        console.log(`資料同步成功！引繼碼為：${uniqueCode}`);
        return uniqueCode;
    } catch (error) {
        console.error("資料同步失敗：", error);
    }
}
