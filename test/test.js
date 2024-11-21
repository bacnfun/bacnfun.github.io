import { firestore } from './firebaseConfig.js'; // 引入 Firestore

// 同步本機資料到 Firestore
async function syncLocalDataToFirestore() {
    const localData = JSON.parse(localStorage.getItem('characterData')); // 獲取本機資料
    if (!localData) {
        console.error("No local data found to sync.");
        return;
    }

    const collectionRef = firestore.collection('userData'); // 指定 Firestore 集合
    const randomId = Math.random().toString(36).substring(2, 7); // 生成隨機 ID

    try {
        const docRef = collectionRef.doc(randomId); // 使用隨機 ID 作為文檔 ID
        await docRef.set(localData); // 同步本機資料到 Firestore
        console.log(`Data synced with ID: ${randomId}`);
    } catch (error) {
        console.error("Error syncing data to Firestore:", error);
    }
}

// 確保函數可以在控制台中調用
window.syncLocalDataToFirestore = syncLocalDataToFirestore;
