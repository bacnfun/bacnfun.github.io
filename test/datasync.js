import { db } from './firebaseConfig.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// 從資料庫同步數據到本地
export async function syncFromFirestore(userID) {
    try {
        const docRef = doc(db, "userID", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                success: true,
                data: docSnap.data(),
                message: "同步成功",
            };
        } else {
            return {
                success: false,
                message: "未找到對應的用戶資料",
            };
        }
    } catch (error) {
        console.error("同步失敗：", error);
        return {
            success: false,
            message: "同步失敗，請稍後再試",
        };
    }
}

// 將本地數據同步到資料庫
export async function syncToFirestore(userID, localData) {
    try {
        const docRef = doc(db, "userID", userID);
        await setDoc(docRef, localData, { merge: true });
        return {
            success: true,
            message: "數據已成功同步到資料庫",
        };
    } catch (error) {
        console.error("數據同步失敗：", error);
        return {
            success: false,
            message: "數據同步失敗，請稍後再試",
        };
    }
}

// 驗證引繼代碼的有效性
export async function validateLinkCode(userID) {
    try {
        const docRef = doc(db, "userID", userID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data(), message: "代碼有效" };
        } else {
            return { success: false, message: "代碼無效或不存在" };
        }
    } catch (error) {
        console.error("驗證代碼失敗：", error);
        return {
            success: false,
            message: "驗證代碼時發生錯誤，請稍後再試",
        };
    }
}

// 根據比對結果同步最新資料
export async function resolveSyncConflict(userID, localData, remoteData) {
    try {
        const latestData =
            remoteData.lastSignDate > localData.lastSignDate
                ? remoteData
                : localData;

        // 同步最新資料到資料庫
        const docRef = doc(db, "userID", userID);
        await setDoc(docRef, latestData, { merge: true });

        return {
            success: true,
            data: latestData,
            message: "同步衝突已解決，已同步最新資料",
        };
    } catch (error) {
        console.error("解決同步衝突時發生錯誤：", error);
        return {
            success: false,
            message: "解決同步衝突時失敗，請稍後再試",
        };
    }
}

// 發行新的引繼代碼
export async function generateNewLinkCode(localData) {
    try {
        let userID;
        let isUnique = false;

        while (!isUnique) {
            userID = generateRandomCode(5);
            const validation = await validateLinkCode(userID);
            isUnique = !validation.success;
        }

        // 將本地資料同步到資料庫
        await syncToFirestore(userID, localData);
        return {
            success: true,
            userID,
            message: "引繼代碼已發行，請妥善保存",
        };
    } catch (error) {
        console.error("發行引繼代碼失敗：", error);
        return {
            success: false,
            message: "發行引繼代碼時發生錯誤，請稍後再試",
        };
    }
}

// 隨機生成引繼代碼
function generateRandomCode(length) {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 避免混淆字符
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
