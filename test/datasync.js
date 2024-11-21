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
export async function publishLinkCode(localData) {
  let linkCode;
  let isUnique = false;

  // 確保生成的代碼唯一
  while (!isUnique) {
    linkCode = generateLinkCode();
    isUnique = await isLinkCodeUnique(linkCode);
  }

  const syncResult = await syncToFirestore(linkCode, localData);
  if (syncResult.success) {
    localStorage.setItem("userID", linkCode);
    return { success: true, linkCode };
  } else {
    return { success: false, message: syncResult.message };
  }
}

// 驗證引繼代碼並同步資料
export async function verifyAndSync(linkCode) {
  const result = await syncFromFirestore(linkCode);
  if (!result.success) {
    return { success: false, message: result.message };
  }

  const data = result.data;
  const localData = JSON.parse(localStorage.getItem("characterData")) || {};

  // 比對角色名稱
  if (data.name !== localData.name) {
    return { success: false, message: "角色名稱不一致", data };
  }

  return { success: true, data };
}
