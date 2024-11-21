import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { firebaseApp } from "./firebaseConfig.js";

const db = getFirestore(firebaseApp);

// 判定同步狀態
export function isSynchronized() {
    const userID = localStorage.getItem('userID');
    return Boolean(userID);
}

// 發行引繼代碼
export async function issueTransferCode(localData) {
    const transferCode = generateTransferCode();
    const isUnique = await checkCodeUnique(transferCode);
    if (!isUnique) throw new Error("代碼重複，請重試");
    await writeToFirestore(transferCode, localData);
    localStorage.setItem('userID', transferCode);
    return transferCode;
}

// 驗證引繼代碼
export async function verifyTransferCode(code) {
    const docRef = doc(db, "userID", code);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data();
}

// 比較同步進度
export function compareSyncProgress(localData, dbData) {
    const localDate = localData.lastSignDate;
    const dbDate = dbData.lastSignDate;
    if (new Date(localDate) > new Date(dbDate)) {
        return 'local';
    } else if (new Date(localDate) < new Date(dbDate)) {
        return 'database';
    } else {
        return 'equal';
    }
}

// 寫入資料庫
async function writeToFirestore(code, data) {
    const docRef = doc(db, "userID", code);
    await setDoc(docRef, data);
}

// 生成唯一代碼
function generateTransferCode() {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 避免 1, l, 0, o
    return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}

// 確認代碼唯一
async function checkCodeUnique(code) {
    const docRef = doc(db, "userID", code);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
}

export async function syncWithLinkCode(linkCode) {
    // Firebase Firestore 初始化代碼已經存在於 firebaseConfig.js
    try {
        const docRef = doc(db, "userID", linkCode);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data(), message: "同步成功" };
        } else {
            return { success: false, message: "未找到對應的用戶資料" };
        }
    } catch (error) {
        console.error("同步失敗：", error);
        return { success: false, message: "同步失敗，請稍後再試" };
    }
}
