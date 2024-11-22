import { db } from "./firebaseConfig.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// 隨機生成 5 碼引繼代碼
export function generateLinkCode() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 排除 1、l、i、0、o
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// 檢查引繼代碼是否已存在
export async function isLinkCodeUnique(linkCode) {
  const userRef = doc(db, "users", linkCode);
  const snapshot = await getDoc(userRef);
  return !snapshot.exists();
}

// 同步本地資料到 Firestore
export async function syncToFirestore(userID, data) {
  try {
    const userRef = doc(db, "users", userID);
    await setDoc(userRef, data);
    return { success: true, message: "同步成功" };
  } catch (error) {
    return { success: false, message: `同步失敗: ${error.message}` };
  }
}

// 從 Firestore 獲取資料
export async function syncFromFirestore(userID) {
  try {
    const userRef = doc(db, "users", userID);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return { success: true, data: snapshot.data() };
    } else {
      return { success: false, message: "資料不存在" };
    }
  } catch (error) {
    return { success: false, message: `讀取失敗: ${error.message}` };
  }
}

// 發行引繼代碼並同步本地資料
export async function publishCodeFromLocalStorage() {
  try {
    const characterData = JSON.parse(localStorage.getItem("characterData")) || {};
    const signCounts = JSON.parse(localStorage.getItem("signCounts")) || {
      mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0
    };
    const totalSignCount = Object.values(signCounts).reduce((sum, count) => sum + count, 0);
    const lastSignDate = localStorage.getItem("daysign") || "0000-00-00";

    // 合併完整數據
    const localData = {
      ...characterData,
      signCounts,
      totalSignCount,
      lastSignDate
    };

    let linkCode;
    let isUnique = false;

    // 確保生成的代碼唯一
    while (!isUnique) {
      linkCode = generateLinkCode();
      isUnique = await isLinkCodeUnique(linkCode);
    }

    // 同步資料到 Firestore
    const syncResult = await syncToFirestore(linkCode, localData);
    if (syncResult.success) {
      localStorage.setItem("userID", linkCode);
      return { success: true, linkCode };
    } else {
      return { success: false, message: syncResult.message };
    }
  } catch (error) {
    return { success: false, message: `發行過程中發生錯誤: ${error.message}` };
  }
}


// 添加別名以保留對舊名稱的支持
export { publishLinkCode as publishCodeFromLocalStorage };


// 驗證引繼代碼並同步資料
export async function verifyAndSync(linkCode) {
  try {
    const result = await syncFromFirestore(linkCode);
    if (!result.success) {
      return { success: false, message: "引繼代碼不存在" };
    }

    const remoteData = result.data;
    const localData = JSON.parse(localStorage.getItem("characterData")) || {};

    // 比對角色名稱
    if (remoteData.name !== localData.name) {
      return { success: false, message: "角色名稱不一致", dbData: remoteData };
    }

    return { success: true, dbData: remoteData, localData };
  } catch (error) {
    return { success: false, message: `驗證過程中發生錯誤: ${error.message}` };
  }
}

// 比對並同步簽到資料
export async function compareAndSyncSignData(linkCode) {
  try {
    const result = await syncFromFirestore(linkCode);
    if (!result.success) {
      return { success: false, message: result.message };
    }

    const remoteData = result.data;
    const localData = JSON.parse(localStorage.getItem("characterData")) || {};
    const remoteLastSignDate = remoteData.lastSignDate || "0000-00-00";
    const localLastSignDate = localData.lastSignDate || "0000-00-00";

    // 判斷最新簽到數據
    if (new Date(remoteLastSignDate) > new Date(localLastSignDate)) {
      // 使用遠端資料覆蓋本地
      localStorage.setItem("characterData", JSON.stringify(remoteData));
      return { success: true, source: "remote", message: "使用遠端資料同步成功" };
    } else if (new Date(remoteLastSignDate) < new Date(localLastSignDate)) {
      // 將本地資料同步到遠端
      await syncToFirestore(linkCode, localData);
      return { success: true, source: "local", message: "使用本地資料同步成功" };
    }

    // 資料相同
    return { success: true, source: "equal", message: "本地與遠端資料一致" };
  } catch (error) {
    return { success: false, message: `同步過程中發生錯誤: ${error.message}` };
  }
}
