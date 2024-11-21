import { firestore } from './firebaseConfig.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// 發行引繼代碼
async function generateLinkCode(localData) {
  const linkCode = generateRandomCode();
  const docRef = doc(firestore, "userID", linkCode);

  // 確認是否有相同的引繼代碼
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // 如果代碼已存在，重新發行
    return generateLinkCode(localData);
  }

  // 保存到 Firestore
  await setDoc(docRef, {
    ...localData,
    lastSyncDate: new Date().toISOString() // 記錄同步時間
  });

  // 儲存到 localStorage
  localStorage.setItem("linkCode", linkCode);
  return linkCode;
}

// 生成隨機代碼
function generateRandomCode() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 避免混淆字符
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 輸入引繼代碼進行同步
async function syncWithLinkCode(linkCode) {
  const docRef = doc(firestore, "userID", linkCode);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // 代碼不存在
    return { success: false, message: "代碼不存在" };
  }

  // 獲取 Firestore 中的資料
  const remoteData = docSnap.data();

  // 比對本地和遠端資料
  const localData = JSON.parse(localStorage.getItem("characterData"));
  if (!localData || localData.CharacterName !== remoteData.CharacterName) {
    return {
      success: true,
      data: remoteData,
      message: "角色資料不匹配，請確認是否同步"
    };
  }

  // 同步簽到資料
  localStorage.setItem("characterData", JSON.stringify(remoteData));
  return { success: true, message: "同步成功" };
}

export { generateLinkCode, syncWithLinkCode };
