import { firestore } from './firebaseConfig.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

async function generateLinkCode(localData) {
  const linkCode = generateRandomCode();
  const docRef = doc(firestore, "userID", linkCode);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return generateLinkCode(localData);

  await setDoc(docRef, { ...localData, lastSyncDate: new Date().toISOString() });
  localStorage.setItem("userID", linkCode);
  return linkCode;
}

function generateRandomCode() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

async function syncWithLinkCode(linkCode) {
  const docRef = doc(firestore, "userID", linkCode);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return { success: false, message: "代碼不存在" };

  const remoteData = docSnap.data();
  const localData = JSON.parse(localStorage.getItem("characterData")) || {};
  
  if (localData.CharacterName !== remoteData.CharacterName) {
    return { success: true, data: remoteData, message: "角色資料不匹配，請確認是否同步" };
  }

  localStorage.setItem("characterData", JSON.stringify(remoteData));
  return { success: true, message: "同步成功" };
}

export { generateLinkCode, syncWithLinkCode };
