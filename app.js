const STORAGE_KEY = "jp_travel_shopping_notebook_v1";
const SETTINGS_STORAGE_KEY = "jp_travel_shopping_settings_v1";
const IDB_NAME = "jp_travel_shopping_db";
const IDB_VERSION = 1;
const IDB_STORE = "notebook_state";

const DEFAULT_SETTINGS = {
  apiKey: "",
  exchangeRate: 0.215,
  taxFreeThreshold: 5000,
};

// 預設載入資料夾內 9 張日本藥妝實拍照片與精準商品標價（依照片中實際價牌店名分類）
// 預設大阪心齋橋筋與道頓堀交會處座標 (34.6687, 135.5012) 與周邊 3 家實體藥妝店
const OSAKA_PRESET_LOCATION = {
  lat: 34.6687,
  lon: 135.5012,
  address: "大阪心齋橋筋與道頓堀交會處附近",
};

function createBuiltInStores() {
  return [
    {
      id: "store_daikoku",
      name: "ダイコクドラッグ 道頓堀店 (大國藥妝)",
      lat: 34.6688,
      lon: 135.5015,
      address: "大阪府大阪市中央区道頓堀1丁目 (距離約 30m)",
      cards: [
        {
          id: "card_8504",
          title: "DHC 速攻藍莓專區 (IMG_8504)",
          imageUrl: "./IMG_8504.JPG",
          items: [
            {
              id: "item_8504_1",
              name: "DHC 速攻藍莓 20日分 (速攻ブルーベリー)",
              note: "40粒・輕減稅率 8%",
              untaxedPrice: 980,
              taxedPrice: 1058,
              taxRate: 8,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8504_2",
              name: "DHC 速攻藍莓 60日分 (速攻ブルーベリー)",
              note: "120粒 大容量・輕減稅率 8%",
              untaxedPrice: 2580,
              taxedPrice: 2786,
              taxRate: 8,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_8505",
          title: "AG 鼻炎噴劑特價架 (IMG_8505)",
          imageUrl: "./IMG_8505.JPG",
          items: [
            {
              id: "item_8505_1",
              name: "AG エージーアレルカットC 30ml (點鼻藥各種)",
              note: "第一三共・30mL 大瓶",
              compareKey: "ag_allercut_c_30",
              untaxedPrice: 1880,
              taxedPrice: 2068,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8505_2",
              name: "AG エージーアレルカットEXc 10ml (長效型)",
              note: "金色包裝・1日2回 季節性過敏",
              untaxedPrice: 1680,
              taxedPrice: 1848,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8505_3",
              name: "上排鼻炎藥特價商品 (598円標價)",
              note: "上層紅字特價牌・稅率 10%",
              untaxedPrice: 598,
              taxedPrice: 658,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_8506",
          title: "NAZAL 佐藤製藥鼻炎噴劑架 (IMG_8506)",
          imageUrl: "./IMG_8506.JPG",
          items: [
            {
              id: "item_8506_1",
              name: "Sato ナザールGスプレー 30ml (經典藍盒)",
              note: "佐藤製藥 NAZAL G 一般款 30ml",
              untaxedPrice: 1180,
              taxedPrice: 1298,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8506_2",
              name: "Sato ナザールGスプレー クール 30ml (清涼款)",
              note: "佐藤製藥 NAZAL G Cool 清涼噴霧 30ml",
              untaxedPrice: 1180,
              taxedPrice: 1298,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8506_3",
              name: "新ルルAゴールドDXα 90錠 (新露露感冒藥)",
              note: "上排標價・第一三共 90錠",
              untaxedPrice: 2080,
              taxedPrice: 2288,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_8507",
          title: "DHC 藍莓精華一般版貨架 (IMG_8507)",
          imageUrl: "./IMG_8507.JPG",
          items: [
            {
              id: "item_8507_1",
              name: "DHC 藍莓精華 20日分 (ブルーベリーエキス)",
              note: "40粒・輕減稅率 8%",
              untaxedPrice: 628,
              taxedPrice: 678,
              taxRate: 8,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8507_2",
              name: "DHC 藍莓精華 60日分 (ブルーベリーエキス)",
              note: "120粒・輕減稅率 8%",
              untaxedPrice: 1380,
              taxedPrice: 1490,
              taxRate: 8,
              selected: false,
              qty: 1,
            },
          ],
        },
      ],
    },
    {
      id: "store_matsukiyo",
      name: "マツモトキヨシ 心斎橋南店 (松本清)",
      lat: 34.6686,
      lon: 135.5018,
      address: "大阪府大阪市中央区心斎橋筋2丁目 (距離約 55m)",
      cards: [
        {
          id: "card_8498",
          title: "DHC 護唇膏貨架 (IMG_8498)",
          imageUrl: "./IMG_8498.JPG",
          items: [
            {
              id: "item_8498_1",
              name: "DHC 藥用護唇膏 安妮亞限定款 (アーニャ各種)",
              note: "SPY×FAMILY 聯名款・松本清特惠",
              untaxedPrice: 680,
              taxedPrice: 748,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8498_2",
              name: "DHC 純欖護唇膏 (薬用リップクリーム)",
              note: "1.5g 經典款・限定特價",
              untaxedPrice: 580,
              taxedPrice: 638,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_8500",
          title: "Melano CC 酵素洗顏/精華專區 (IMG_8500)",
          imageUrl: "./IMG_8500.JPG",
          items: [
            {
              id: "item_8500_1",
              name: "Melano CC 藥用黑斑集中保養美容液",
              note: "メラノCC 薬用しみ集中対策美容液 20ml",
              untaxedPrice: 980,
              taxedPrice: 1078,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8500_2",
              name: "Melano CC 藥用黑斑集中保濕乳霜 (クリーム)",
              note: "手中拿取商品・W維他命滲透 23g",
              untaxedPrice: 1050,
              taxedPrice: 1155,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_8502",
          title: "Melano CC 全系列與豆乳美肌貨架 (IMG_8502)",
          imageUrl: "./IMG_8502.JPG",
          items: [
            {
              id: "item_8502_1",
              name: "LIFTER セルフェステ化粧水 (2+1組)",
              note: "リフターモイストアップローション 2+1セット",
              untaxedPrice: 1597,
              taxedPrice: 1756,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8502_2",
              name: "Melano CC 藥用黑斑集中保養美容液 (一般版)",
              note: "20ml 經典款",
              untaxedPrice: 980,
              taxedPrice: 1078,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8502_3",
              name: "Melano CC プレミアム美容液 (Premium 特濃版)",
              note: "20ml 進階浸透版",
              untaxedPrice: 1380,
              taxedPrice: 1518,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8502_4",
              name: "Yunth 生VC美白美容液",
              note: "需拿空卡至櫃檯結帳・28包入",
              untaxedPrice: 3600,
              taxedPrice: 3960,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8502_5",
              name: "Melano CC 美白化妝水 / 補充包",
              note: "下排化妝水系列",
              untaxedPrice: 880,
              taxedPrice: 968,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8502_6",
              name: "Melano CC 藥用保濕凝露 (ジェル)",
              note: "右下角圓罐裝",
              untaxedPrice: 1050,
              taxedPrice: 1155,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_mk_ag",
          title: "AG 點鼻藥貨架 (心齋橋南店標價)",
          imageUrl: "./IMG_8503.JPG",
          items: [
            {
              id: "item_mk_ag_1",
              name: "AG エージーアレルカットC 30ml (清涼型點鼻藥)",
              note: "第2類医薬品・30ml 大瓶",
              compareKey: "ag_allercut_c_30",
              untaxedPrice: 1980,
              taxedPrice: 2178,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
      ],
    },
    {
      id: "store_satudora",
      name: "サツドラ 道頓堀店 (札幌藥妝)",
      lat: 34.6689,
      lon: 135.5020,
      address: "大阪府大阪市中央区道頓堀1丁目 (松竹座對面，距離約 75m)",
      cards: [
        {
          id: "card_sd_melanocc",
          title: "Melano CC 美容液 (道頓堀店標價)",
          imageUrl: "./IMG_8500.JPG",
          items: [
            {
              id: "item_sd_melanocc_1",
              name: "Melano CC 藥用黑斑集中保養美容液",
              note: "メラノCC 薬用しみ集中対策美容液 20ml",
              untaxedPrice: 1080,
              taxedPrice: 1188,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_8501",
          title: "Capsule Serum 生美容液專區 (IMG_8501)",
          imageUrl: "./IMG_8501.JPG",
          items: [
            {
              id: "item_8501_1",
              name: "CPセラム G 美容液 (穀胱甘肽白玉生美容液)",
              note: "30ml 白色包裝・グルタチオン配合",
              untaxedPrice: 2255,
              taxedPrice: 2480,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8501_2",
              name: "CPセラム V 美容液 (生維他命C美容液)",
              note: "30ml 黃色包裝・ビタミンC誘導体",
              untaxedPrice: 2255,
              taxedPrice: 2480,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8501_3",
              name: "CPセラム A 美容液 (蝦紅素抗老生美容液)",
              note: "30ml 橘色包裝・アスタキサンチン配合",
              untaxedPrice: 2710,
              taxedPrice: 2981,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_8503",
          title: "AG 過敏點鼻藥專區 (IMG_8503)",
          imageUrl: "./IMG_8503.JPG",
          items: [
            {
              id: "item_8503_1",
              name: "AG エージーアレルカットC 15ml (清涼型點鼻藥)",
              note: "第2類医薬品・15ml 小瓶",
              compareKey: "ag_allercut_c_15",
              untaxedPrice: 1380,
              taxedPrice: 1518,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8503_2",
              name: "AG エージーアレルカットC 30ml (清涼型點鼻藥)",
              note: "第2類医薬品・30ml 大瓶",
              compareKey: "ag_allercut_c_30",
              untaxedPrice: 2180,
              taxedPrice: 2398,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
          ],
        },
        {
          id: "card_sd_blueberry",
          title: "DHC 藍莓專區 (道頓堀特價架)",
          imageUrl: "./IMG_8504.JPG",
          items: [
            {
              id: "item_sd_blue_1",
              name: "DHC 速攻藍莓 20日分 (速攻ブルーベリー)",
              note: "40粒・道頓堀限定特惠 8%",
              untaxedPrice: 890,
              taxedPrice: 961,
              taxRate: 8,
              selected: false,
              qty: 1,
            },
            {
              id: "item_sd_blue_2",
              name: "DHC 速攻藍莓 60日分 (速攻ブルーベリー)",
              note: "120粒 大容量・道頓堀限定 8%",
              untaxedPrice: 2450,
              taxedPrice: 2646,
              taxRate: 8,
              selected: false,
              qty: 1,
            },
          ],
        },
      ],
    },
  ];
}

// 狀態管理（IndexedDB 大容量儲存 + LocalStorage 自動遷移與設定備援）
let state = loadState();
let filterSelectedOnly = false;
let currentModalTaxRate = 10;
let idbDatabase = null;

function loadState() {
  try {
    // 優先讀取舊版完整 LocalStorage 資料（供首次無縫升級遷移至 IndexedDB）
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.stores) && parsed.stores.length > 0) {
        return {
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          currentStoreId: parsed.currentStoreId || parsed.stores[0].id,
          stores: parsed.stores,
        };
      }
    }
    // 讀取輕量設定檔
    const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (rawSettings) {
      const parsedSettings = JSON.parse(rawSettings);
      const stores = createBuiltInStores();
      return {
        settings: { ...DEFAULT_SETTINGS, ...(parsedSettings.settings || {}) },
        currentStoreId: parsedSettings.currentStoreId || stores[0].id,
        stores,
      };
    }
  } catch (err) {
    console.warn("讀取 LocalStorage 失敗，使用預設資料:", err);
  }
  const stores = createBuiltInStores();
  return {
    settings: { ...DEFAULT_SETTINGS },
    currentStoreId: stores[0].id,
    stores,
  };
}

function openAppDatabase() {
  return new Promise((resolve, reject) => {
    if (idbDatabase) {
      resolve(idbDatabase);
      return;
    }
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = (ev) => {
      idbDatabase = ev.target.result;
      resolve(idbDatabase);
    };
    req.onerror = () => reject(req.error);
  });
}

function idbLoadState() {
  return openAppDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readonly");
        const store = tx.objectStore(IDB_STORE);
        const getReq = store.get(STORAGE_KEY);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => reject(getReq.error);
      })
  );
}

function idbSaveState(currentState) {
  return openAppDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        const store = tx.objectStore(IDB_STORE);
        const putReq = store.put(currentState, STORAGE_KEY);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      })
  );
}

async function initHighCapacityStorage() {
  try {
    const urlProvidedKey = extractUrlApiKey();
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
    const savedInIdb = await idbLoadState();
    if (
      savedInIdb &&
      Array.isArray(savedInIdb.stores) &&
      savedInIdb.stores.length > 0
    ) {
      state = {
        settings: { ...DEFAULT_SETTINGS, ...(savedInIdb.settings || {}) },
        currentStoreId:
          savedInIdb.currentStoreId || savedInIdb.stores[0].id,
        stores: savedInIdb.stores,
      };
      // 確保大阪心齋橋 3 家藥妝店皆存在且帶有定位座標
      const builtIns = createBuiltInStores();
      builtIns.forEach((bs) => {
        const found = state.stores.find((s) => s.id === bs.id);
        if (!found) {
          state.stores.push(bs);
        } else {
          found.lat = bs.lat;
          found.lon = bs.lon;
          found.address = bs.address;
        }
      });
      await idbSaveState(state);
      if (urlProvidedKey) {
        state.settings.apiKey = urlProvidedKey;
        await idbSaveState(state);
        showToast("已從專屬連結自動綁定 AI 金鑰！");
      }
      renderApp();
    } else {
      if (urlProvidedKey) {
        state.settings.apiKey = urlProvidedKey;
        showToast("已從專屬連結自動綁定 AI 金鑰！");
      }
      // 首次升級：將現有 state 寫入大容量 IndexedDB，並釋放舊版 5MB LocalStorage 圖片佔用
      await idbSaveState(state);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
  } catch (err) {
    console.warn("IndexedDB 初始化備援:", err);
  }
}

function extractUrlApiKey() {
  try {
    if (typeof window === "undefined" || !window.location) return "";
    const params = new URLSearchParams(window.location.search);
    const key = (params.get("key") || params.get("apikey") || "").trim();
    if (key) {
      state.settings.apiKey = key;
      params.delete("key");
      params.delete("apikey");
      const newSearch = params.toString();
      const cleanUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : "") +
        window.location.hash;
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, "", cleanUrl);
      }
      return key;
    }
  } catch (_) {}
  return "";
}

function saveState() {
  // 1. 輕量設定寫入 LocalStorage (<1KB，永不爆滿)
  try {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        settings: state.settings,
        currentStoreId: state.currentStoreId,
      })
    );
  } catch (_) {}

  // 2. 完整照片與商品清單寫入大容量 IndexedDB (支援數百 MB ~ 數 GB)
  idbSaveState(state).catch((err) => {
    console.warn("IndexedDB 寫入失敗，嘗試降級寫入 LocalStorage:", err);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      showToast("儲存空間不足，請清理部分不需要的照片");
    }
  });
}

async function updateStorageQuotaDisplay() {
  const el = document.getElementById("storageStatusText");
  if (!el) return;
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      if (est && est.quota) {
        const usedMb = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
        const quotaMb = Math.round(est.quota / (1024 * 1024));
        const quotaDisplay =
          quotaMb >= 1024
            ? `${(quotaMb / 1024).toFixed(1)} GB`
            : `${quotaMb} MB`;
        el.textContent = `已用 ${usedMb} MB / 可用上限約 ${quotaDisplay}`;
        return;
      }
    }
    el.textContent = "已啟用（支援數百張以上照片）";
  } catch (_) {
    el.textContent = "已啟用（支援數百張以上照片）";
  }
}

function getCurrentStore() {
  return (
    state.stores.find((s) => s.id === state.currentStoreId) || state.stores[0]
  );
}

// 格式化金額
function formatYen(num) {
  return "¥" + Math.round(Number(num) || 0).toLocaleString("ja-JP");
}

function formatTwd(yen) {
  const twd = Math.round((Number(yen) || 0) * state.settings.exchangeRate);
  return "NT$" + twd.toLocaleString("zh-TW");
}

// 清理商品名稱做智慧比對（去除括號補充說明、標點、空白）
function cleanProductName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[（(][^）)]*[）)]/g, "") // 移除非關鍵括號補充說明
    .replace(/[【\[][^】\]]*[】\]]/g, "")
    .replace(/[\s\-_・，,、。/\\+＋★]/g, "")
    .trim();
}

function normalizeProductName(item) {
  if (!item) return "";
  if (item.compareKey && String(item.compareKey).trim()) {
    return String(item.compareKey).trim().toLowerCase();
  }
  return cleanProductName(item.name);
}

// 判斷兩件商品是否為同款商品
function isSameProduct(a, b) {
  if (!a || !b) return false;
  // 1. 若兩者都有 compareKey，以 compareKey 為絕對標準
  const keyA = a.compareKey ? String(a.compareKey).trim().toLowerCase() : "";
  const keyB = b.compareKey ? String(b.compareKey).trim().toLowerCase() : "";
  if (keyA && keyB) {
    return keyA === keyB;
  }
  // 2. 若其中一個 compareKey 與另一個名稱完全對應
  const cleanA = cleanProductName(a.name);
  const cleanB = cleanProductName(b.name);
  if (keyA && cleanB && keyA === cleanB) return true;
  if (keyB && cleanA && keyB === cleanA) return true;

  // 3. 標準化名稱完全相同
  if (cleanA && cleanB && cleanA === cleanB) return true;

  return false;
}

// 取得同款商品在全手帳各家商店的全部標價（由未稅低到高排序）
function getProductAllStorePrices(currentItem) {
  const matches = [];
  for (const store of state.stores) {
    for (const card of store.cards) {
      for (const item of card.items) {
        if (isSameProduct(currentItem, item)) {
          matches.push({
            storeId: store.id,
            storeName: store.name,
            cardId: card.id,
            cardTitle: card.title,
            item,
            untaxedPrice: Number(item.untaxedPrice) || 0,
            taxedPrice: Number(item.taxedPrice) || 0,
            selected: Boolean(item.selected),
          });
        }
      }
    }
  }

  // 依照未稅價從低到高排序（最低價排最前面）
  matches.sort((a, b) => a.untaxedPrice - b.untaxedPrice);
  return matches;
}

// 跨店比價核心：精準找出同款商品的最低價、價差與最低價店家
function findCrossStoreComparison(currentItem, currentStoreId) {
  const matches = getProductAllStorePrices(currentItem);
  if (matches.length <= 1) return null; // 僅有一家店記錄，無需比價

  const lowestMatch = matches[0];
  const currentUntaxed = Number(currentItem.untaxedPrice) || 0;
  const isCurrentLowest = currentUntaxed <= lowestMatch.untaxedPrice;

  // 取得其他商店的記錄
  const otherStoreMatches = matches.filter((m) => m.storeId !== currentStoreId);
  if (otherStoreMatches.length === 0) return null;

  // 計算最低價商店的距離
  const lowestStoreObj = state.stores.find((s) => s.id === lowestMatch.storeId);
  const lowestStoreDist =
    lastUserLocation && lowestStoreObj && lowestStoreObj.lat != null && lowestStoreObj.lon != null
      ? calculateDistanceMeters(lastUserLocation.lat, lastUserLocation.lon, lowestStoreObj.lat, lowestStoreObj.lon)
      : null;

  if (isCurrentLowest) {
    // 當前店家就是最低價！
    const otherLowest = otherStoreMatches[0];
    const diff = otherLowest.untaxedPrice - currentUntaxed;
    const thisStore = state.stores.find((s) => s.id === currentStoreId) || getCurrentStore();
    return {
      type: diff > 0 ? "lowest" : "same",
      isLowest: true,
      text: diff > 0 ? `👑 最低價！比 ${otherLowest.storeName} 省 ¥${diff}` : `與 ${otherLowest.storeName} 同為最低價 ¥${currentUntaxed}`,
      minPrice: currentUntaxed,
      minTaxedPrice: Number(currentItem.taxedPrice) || Math.round(currentUntaxed * 1.1),
      lowestStoreId: thisStore.id,
      lowestStoreName: thisStore.name,
      lowestStoreDist: null,
      secondStoreName: otherLowest.storeName,
      secondStorePrice: otherLowest.untaxedPrice,
      diff,
      matches,
    };
  } else {
    // 另一家店才是最低價！
    const diff = currentUntaxed - lowestMatch.untaxedPrice;
    return {
      type: "pricier",
      isLowest: false,
      text: `⚠️ 附近 ${lowestMatch.storeName} 更便宜！最低 ¥${lowestMatch.untaxedPrice} (省 ¥${diff})`,
      minPrice: lowestMatch.untaxedPrice,
      minTaxedPrice: lowestMatch.taxedPrice,
      lowestStoreId: lowestMatch.storeId,
      lowestStoreName: lowestMatch.storeName,
      lowestStoreDist,
      diff,
      matches,
    };
  }
}

// 提取適合大國藥妝官方商城搜尋的日文與商品關鍵字
function extractJapaneseSearchKeyword(item) {
  if (!item || !item.name) return "";
  const name = item.name;
  const note = item.note || "";

  // 1. 若括號內有日文品名 (如 (速攻ブルーベリー) 或 (薬用リップクリーム) 或 (EVE クイック DX))
  const bracketMatch = (name + " " + note).match(/[（(]([ァ-ヴーぁ-んa-zA-Z0-9\s]+)[）)]/);

  // 2. 提取乾淨的商品主名稱 (去除中文輔助詞與劑量規格詞，避免大國搜尋因"20日分"等字眼導致0搜尋結果)
  const cleanName = name
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[【\[][^】\]]*[】\]]/g, "")
    .replace(/\b(安妮亞限定款|經典款|一般款|限定特價|特惠|清涼款|上排標價|下排標價|頭痛藥|感冒藥|美白淡斑精華)\b/g, "")
    .replace(/\s*\d+\s*(?:日分|天份|日|錠|粒|包|ml|g|枚|包裝)/gi, "")
    .trim();

  // 3. 若括號內有日文假名品名且字數充足，大國全球/日本商城對純日文名命中率極高
  if (bracketMatch && bracketMatch[1].trim().length >= 2) {
    let rawBracket = bracketMatch[1]
      .replace(/\s*\d+\s*(?:日分|天份|日|錠|粒|包|ml|g|枚|包裝)/gi, "")
      .trim();
    const brand = cleanName.split(/\s+/)[0] || "";
    if (brand && rawBracket.toLowerCase().startsWith(brand.toLowerCase())) {
      return rawBracket;
    }
    if (brand && !rawBracket.includes(brand) && /^[a-zA-Z0-9]+$/.test(brand)) {
      return `${brand} ${rawBracket}`.trim();
    }
    return rawBracket || cleanName;
  }

  return cleanName;
}

// 大國藥妝官方線上商城 (已依使用者需求刪除其他藥妝店與電商)
// 注意：大國全球旗艦店搜尋參數為 ?keyword=，台灣官方商城為 /zh-TW/search?q=
const FAMOUS_JP_DRUGSTORE_SITES = [
  {
    id: "daikoku_global",
    name: "大國藥妝全球旗艦店",
    badge: "日本直送",
    getUrl: (q) => `https://www.dkglobal-daikokudrug.com/search?keyword=${encodeURIComponent(q)}`,
  },
  {
    id: "daikoku_taiwan",
    name: "大國藥妝台灣官方商城",
    badge: "繁中直送",
    getUrl: (q) => `https://www.daikokudrug-taiwan.com/zh-TW/search?q=${encodeURIComponent(q)}`,
  },
];

// 快取電商行情報價結果
const onlineBenchmarkCache = new Map();

// 調用 Gemini API 估算大國藥妝官方線上商城行情
async function fetchOnlineBenchmarkFromGemini(item) {
  const cacheKey = item.name + "_" + (item.untaxedPrice || 0);
  if (onlineBenchmarkCache.has(cacheKey)) {
    return onlineBenchmarkCache.get(cacheKey);
  }

  const apiKey = state.settings.apiKey;
  if (!apiKey) {
    throw new Error("請先在手帳設定中填寫 Gemini API Key，即可啟用 AI 查詢大國藥妝線上商城行情");
  }

  const promptText = `你是一位日本大國藥妝(Daikoku Drug)比價專家。請針對下列日本藥妝商品，提供大國藥妝官方線上商城(全球旗艦店/台灣商城)的常見售價與日本官方建議售價(MSRP含稅)：
商品名稱：${item.name}
規格說明：${item.note || "一般規格"}
旅客目前實體店未稅標價：¥${item.untaxedPrice} (含稅約 ¥${item.taxedPrice || Math.round(item.untaxedPrice * 1.1)})

請以繁體中文只回傳純 JSON 格式（不要回傳額外 Markdown 說明）：
{
  "msrpTaxed": 2640,
  "onlineMinTaxed": 2180,
  "cheapestSiteName": "大國藥妝線上旗艦店",
  "summary": "日本官方含稅定價約 ¥2,640，大國藥妝線上商城含稅約 ¥2,180。目前實體未稅價 ¥${item.untaxedPrice} 相比大國線上商城更便宜！",
  "isPhysicalCheaper": true,
  "diffYen": 180
}`;

  let modelName = "gemini-2.5-flash";
  try {
    const availableModels = await fetchAvailableGeminiModelsList(apiKey);
    if (availableModels && availableModels.length > 0) {
      modelName = availableModels[0];
    }
  } catch (_) {}

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
    signal: controller.signal,
  });
  clearTimeout(timer);

  if (!response.ok) {
    throw new Error(`查詢大國藥妝線上行情失敗 (${response.status})`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const parsed = JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());
  onlineBenchmarkCache.set(cacheKey, parsed);
  return parsed;
}

function renderOnlineCompareHtml(item) {
  const keyword = extractJapaneseSearchKeyword(item);
  const chipsHtml = FAMOUS_JP_DRUGSTORE_SITES.map((site) => {
    const url = site.getUrl(keyword);
    return `
      <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="jp-site-chip" title="在新分頁開啟 ${site.name} 查即時底價">
        <span>${escapeHtml(site.name)}</span>
        <span class="site-badge">${escapeHtml(site.badge)} ↗</span>
      </a>
    `;
  }).join("");

  return `
    <div class="online-compare-box" data-item-id="${escapeHtml(item.id)}">
      <div class="online-compare-header">
        <strong>🌐 比對大國藥妝線上商城 (Daikoku Online)</strong>
        <button type="button" class="mini-btn btn-query-online-bench" data-item-id="${escapeHtml(item.id)}">
          🤖 AI 查大國藥妝線上價
        </button>
      </div>
      <div class="jp-sites-grid">
        ${chipsHtml}
      </div>
      <div class="online-bench-result hidden" id="onlineBench_${escapeHtml(item.id)}"></div>
    </div>
  `;
}

function bindOnlineCompareEvents(container, item) {
  const btnQuery = container.querySelector(".btn-query-online-bench");
  const benchResult = container.querySelector(".online-bench-result");
  if (btnQuery && benchResult) {
    btnQuery.addEventListener("click", async (e) => {
      e.stopPropagation();
      btnQuery.disabled = true;
      btnQuery.textContent = "⏳ 查詢中...";
      benchResult.classList.remove("hidden");
      benchResult.innerHTML = `<span style="color:var(--ink-muted); font-size:0.75rem;">正在向大國藥妝線上商城查詢行情報價...</span>`;

      try {
        const bench = await fetchOnlineBenchmarkFromGemini(item);
        benchResult.className = `online-bench-result online-ai-benchmark ${bench.isPhysicalCheaper ? "cheaper" : "pricier"}`;
        benchResult.innerHTML = `
          <div class="online-bench-row">
            <span><strong>${bench.isPhysicalCheaper ? "🎉 實體店比大國線上商城划算！" : "⚠️ 大國線上商城可能更便宜"}</strong></span>
            <span>日本官方含稅定價：<strong>${formatYen(bench.msrpTaxed)}</strong></span>
          </div>
          <div>${escapeHtml(bench.summary)}</div>
          <div style="font-size:0.72rem; color:var(--ink-muted); margin-top:4px;">
            指標平台：<strong>${escapeHtml(bench.cheapestSiteName || "大國藥妝線上旗艦店")}</strong> 網購含稅約 ${formatYen(bench.onlineMinTaxed)}
          </div>
        `;
        btnQuery.textContent = "✓ 已完成日本電商比價";
      } catch (err) {
        benchResult.className = "online-bench-result online-ai-benchmark";
        benchResult.innerHTML = `
          <div style="color: var(--accent-persimmon); font-size: 0.76rem;">
            ⚠️ ${escapeHtml(err.message)}
          </div>
          <div style="font-size: 0.72rem; color: var(--ink-muted); margin-top: 3px;">
            您仍可直接點擊上方 <strong>価格.com</strong> 或 <strong>松本清官網</strong> 按鈕，一鍵在新分頁查看即時底價！
          </div>
        `;
        btnQuery.textContent = "重試 AI 查詢";
        btnQuery.disabled = false;
      }
    });
  }
}

// 供按鈕點擊時執行：確認是否為最低價，若不是則在品項旁/下方詳細顯示哪家店有低價與價位
function evaluateAndDisplayLowestResult(item, storeId, resultContainer) {
  if (!resultContainer) return;
  const comp = findCrossStoreComparison(item, storeId);
  resultContainer.classList.remove("hidden", "lowest-success", "lowest-warning", "lowest-info");

  if (!comp) {
    resultContainer.classList.add("lowest-info");
    resultContainer.innerHTML = `
      <div class="result-title">ℹ️ 尚無其他分店比價資料</div>
      <div>目前只有【${escapeHtml(getCurrentStore().name)}】記錄了此商品（未稅 ${formatYen(item.untaxedPrice)}）。可至附近其他分店新增照片或商品進行即時比價。</div>
    `;
    const onlineWrapper = document.createElement("div");
    onlineWrapper.innerHTML = renderOnlineCompareHtml(item);
    resultContainer.appendChild(onlineWrapper);
    bindOnlineCompareEvents(onlineWrapper, item);
    return;
  }

  if (comp.isLowest) {
    resultContainer.classList.add("lowest-success");
    const otherText = comp.secondStoreName
      ? `，比附近的【${escapeHtml(comp.secondStoreName)}】未稅價 (${formatYen(comp.secondStorePrice)}) 便宜 <strong>¥${comp.diff}</strong>`
      : "";
    resultContainer.innerHTML = `
      <div class="result-title">🎉 本店就是最低價！</div>
      <div>目前未稅價 <strong>${formatYen(item.untaxedPrice)}</strong> (${formatTwd(item.untaxedPrice)})${otherText}！可安心在本店採購。</div>
    `;
  } else {
    resultContainer.classList.add("lowest-warning");
    const distText = comp.lowestStoreDist != null ? `（距離此處約 ${formatDistance(comp.lowestStoreDist)}）` : "";
    resultContainer.innerHTML = `
      <div class="result-title">⚠️ 附近【${escapeHtml(comp.lowestStoreName)}】有更低價！</div>
      <div>
        該店最低價：未稅 <strong class="price-highlight">${formatYen(comp.minPrice)}</strong> 
        <span style="font-size:0.75rem;">(含稅 ${formatYen(comp.minTaxedPrice)})</span>
        ｜ 比本店便宜 <strong style="color:var(--accent-persimmon);">¥${comp.diff}</strong> (${formatTwd(comp.diff)})！
      </div>
      <div style="font-size: 0.73rem; color: var(--ink-muted); margin-top: 3px;">
        📍 建議前往：${escapeHtml(comp.lowestStoreName)} ${distText}
      </div>
      <div class="result-actions">
        <button type="button" class="mini-btn btn-jump-to-lowest" data-store-id="${comp.lowestStoreId}">
          👉 切換至【${escapeHtml(comp.lowestStoreName)}】查看
        </button>
      </div>
    `;

    resultContainer.querySelector(".btn-jump-to-lowest")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.currentStoreId = comp.lowestStoreId;
      saveState();
      renderApp();
      showToast(`已切換至「${comp.lowestStoreName}」`);
    });
  }

  // 附加上日本知名藥妝網站比價區塊
  const onlineWrapper = document.createElement("div");
  onlineWrapper.innerHTML = renderOnlineCompareHtml(item);
  resultContainer.appendChild(onlineWrapper);
  bindOnlineCompareEvents(onlineWrapper, item);
}

// 取得全手帳所有同款商品跨店最低價總表
function getAllProductsComparisonList() {
  const groups = [];

  for (const store of state.stores) {
    for (const card of store.cards) {
      for (const item of card.items) {
        let foundGroup = groups.find((g) => isSameProduct(g.sampleItem, item));
        const entry = {
          storeId: store.id,
          storeName: store.name,
          cardId: card.id,
          cardTitle: card.title,
          item,
          untaxedPrice: Number(item.untaxedPrice) || 0,
          taxedPrice: Number(item.taxedPrice) || 0,
          selected: Boolean(item.selected),
        };

        if (foundGroup) {
          foundGroup.stores.push(entry);
        } else {
          groups.push({
            sampleItem: item,
            name: item.name,
            note: item.note,
            stores: [entry],
          });
        }
      }
    }
  }

  // 整理每個群組的最低價與統計
  const list = groups.map((group) => {
    group.stores.sort((a, b) => a.untaxedPrice - b.untaxedPrice);
    const minUntaxed = group.stores[0].untaxedPrice;
    const maxUntaxed = group.stores[group.stores.length - 1].untaxedPrice;
    const lowestEntries = group.stores.filter((s) => s.untaxedPrice === minUntaxed);
    const lowestStoreNames = [...new Set(lowestEntries.map((s) => s.storeName))];
    const diff = maxUntaxed - minUntaxed;
    const storeCount = new Set(group.stores.map((s) => s.storeId)).size;

    return {
      ...group,
      minUntaxed,
      maxUntaxed,
      lowestStoreNames,
      diff,
      storeCount,
    };
  });

  // 排序：價差最大的排前面，多店皆有的排前面
  list.sort((a, b) => {
    if (b.diff !== a.diff) return b.diff - a.diff;
    return b.storeCount - a.storeCount;
  });

  return list;
}

// 開啟單一商品跨店比價彈窗
function openItemCompareModal(item) {
  const matches = getProductAllStorePrices(item);
  const modal = document.getElementById("itemCompareModal");
  const headerEl = document.getElementById("itemCompareProductHeader");
  const listEl = document.getElementById("itemCompareStoreList");

  if (!modal || !headerEl || !listEl || matches.length === 0) return;

  const lowest = matches[0];
  headerEl.innerHTML = `
    <h4>${escapeHtml(item.name)}</h4>
    ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}
    <div style="margin-top: 6px; font-size: 0.82rem; font-weight: 700; color: #1a5631;">
      👑 全手帳最低價：${escapeHtml(lowest.storeName)}（未稅 ${formatYen(lowest.untaxedPrice)} / 含稅 ${formatYen(lowest.taxedPrice)}）
    </div>
  `;

  listEl.innerHTML = "";
  matches.forEach((m) => {
    const isLowest = m.untaxedPrice === lowest.untaxedPrice;
    const diff = m.untaxedPrice - lowest.untaxedPrice;
    const isCurrent = m.storeId === state.currentStoreId;

    const row = document.createElement("div");
    row.className = `compare-store-card ${isLowest ? "is-lowest" : ""}`;
    row.innerHTML = `
      <div class="compare-store-info">
        <div class="store-name">
          ${escapeHtml(m.storeName)}
          ${isLowest ? '<span class="lowest-spotlight-badge" style="font-size:0.7rem; padding: 1px 6px;">最低價 👑</span>' : ""}
          ${isCurrent ? '<span style="font-size:0.7rem; color:var(--accent-sage); font-weight:600;">(目前商店)</span>' : ""}
        </div>
        <div class="price-sub">
          未稅 ${formatYen(m.untaxedPrice)} (${formatTwd(m.untaxedPrice)}) ｜ 含稅 ${formatYen(m.taxedPrice)} (${formatTwd(m.taxedPrice)})
        </div>
      </div>
      <div class="compare-store-right">
        ${
          diff > 0
            ? `<span style="font-size:0.78rem; color:var(--accent-persimmon); font-weight:700;">+¥${diff} (${formatTwd(diff)})</span>`
            : `<span style="font-size:0.78rem; color:#1a5631; font-weight:700;">★ 最低價</span>`
        }
        ${
          !isCurrent
            ? `<button type="button" class="mini-btn btn-jump-store" data-store-id="${m.storeId}">切換到此店</button>`
            : `<span style="font-size:0.75rem; color:var(--ink-muted);">本店商品</span>`
        }
      </div>
    `;

    const jumpBtn = row.querySelector(".btn-jump-store");
    if (jumpBtn) {
      jumpBtn.addEventListener("click", () => {
        state.currentStoreId = m.storeId;
        saveState();
        modal.classList.add("hidden");
        renderApp();
        showToast(`已切換至「${m.storeName}」`);
      });
    }

    listEl.appendChild(row);
  });

  const onlineWrapper = document.createElement("div");
  onlineWrapper.innerHTML = renderOnlineCompareHtml(item);
  listEl.appendChild(onlineWrapper);
  bindOnlineCompareEvents(onlineWrapper, item);

  modal.classList.remove("hidden");
}

// 開啟跨店最低價搜尋視窗
function openLowestPriceFinderModal() {
  const modal = document.getElementById("lowestPriceModal");
  if (!modal) return;
  renderLowestPriceModal();
  modal.classList.remove("hidden");
}

function renderLowestPriceModal() {
  const searchInput = document.getElementById("lowestPriceSearchInput");
  const chkOnlyMulti = document.getElementById("chkOnlyMultiStore");
  const bannerEl = document.getElementById("lowestPriceStatsBanner");
  const listEl = document.getElementById("lowestPriceList");

  const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
  const onlyMulti = chkOnlyMulti ? chkOnlyMulti.checked : false;

  const allList = getAllProductsComparisonList();
  const totalItems = allList.length;
  const multiStoreItems = allList.filter((g) => g.storeCount > 1);
  const diffItems = allList.filter((g) => g.diff > 0);
  const maxSavingsTotal = diffItems.reduce((sum, g) => sum + g.diff, 0);

  if (bannerEl) {
    bannerEl.innerHTML = `
      💡 <strong>比價雷達概況：</strong>手帳共記錄 <strong>${totalItems}</strong> 款商品，其中 <strong>${multiStoreItems.length}</strong> 款在多店有價格，<strong>${diffItems.length}</strong> 款存在價差！各買一件改選最低價店家可省 <strong>¥${maxSavingsTotal.toLocaleString("ja-JP")}</strong> (${formatTwd(maxSavingsTotal)})。
    `;
  }

  let filtered = allList;
  if (onlyMulti) {
    filtered = filtered.filter((g) => g.storeCount > 1);
  }
  if (query) {
    filtered = filtered.filter(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        (g.note && g.note.toLowerCase().includes(query)) ||
        g.stores.some((s) => s.storeName.toLowerCase().includes(query))
    );
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: var(--ink-muted); font-size: 0.88rem;">
        無符合的商品資料。可取消勾選「只看多店有標價」或更改搜尋關鍵字。
      </div>
    `;
    return;
  }

  listEl.innerHTML = "";
  filtered.forEach((group) => {
    const cardEl = document.createElement("div");
    cardEl.className = "lowest-product-card";

    const rowsHtml = group.stores
      .map((st) => {
        const isLowest = st.untaxedPrice === group.minUntaxed;
        const diff = st.untaxedPrice - group.minUntaxed;
        const isCurrent = st.storeId === state.currentStoreId;
        return `
          <div class="lowest-store-row ${isLowest ? "is-lowest" : ""}">
            <div class="lowest-store-name">
              <span>${isLowest ? "👑" : "・"}</span>
              <strong>${escapeHtml(st.storeName)}</strong>
              ${isCurrent ? '<span style="font-size: 0.7rem; color: var(--accent-sage);">(目前)</span>' : ""}
            </div>
            <div class="lowest-store-prices">
              <span class="price-yen">¥${st.untaxedPrice.toLocaleString("ja-JP")}</span>
              <span class="price-diff">${diff > 0 ? `+¥${diff}` : "(最低價)"}</span>
              ${
                !isCurrent
                  ? `<button type="button" class="mini-btn btn-jump-store" data-store-id="${st.storeId}">切換</button>`
                  : ""
              }
            </div>
          </div>
        `;
      })
      .join("");

    cardEl.innerHTML = `
      <div class="lowest-card-head">
        <div>
          <div class="product-name">${escapeHtml(group.name)}</div>
          ${group.note ? `<div class="product-note">${escapeHtml(group.note)}</div>` : ""}
        </div>
        <div class="lowest-spotlight-badge">
          👑 最低價 ¥${group.minUntaxed.toLocaleString("ja-JP")}
        </div>
      </div>
      <div class="lowest-store-table">
        ${rowsHtml}
      </div>
      <div class="jp-sites-grid" style="margin-top: 6px;">
        <span style="font-size:0.7rem; color:var(--ink-muted); align-self:center;">大國線上商城：</span>
        ${FAMOUS_JP_DRUGSTORE_SITES.map((site) => `
          <a href="${escapeHtml(site.getUrl(extractJapaneseSearchKeyword(group.sampleItem)))}" target="_blank" rel="noopener noreferrer" class="jp-site-chip" title="開啟 ${site.name} 查底價">
            <span>${escapeHtml(site.name)} ↗</span>
          </a>
        `).join("")}
      </div>
    `;

    cardEl.querySelectorAll(".btn-jump-store").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetStoreId = btn.dataset.storeId;
        state.currentStoreId = targetStoreId;
        saveState();
        document.getElementById("lowestPriceModal").classList.add("hidden");
        renderApp();
        showToast("已切換商店");
      });
    });

    listEl.appendChild(cardEl);
  });
}

// 計算兩個經緯度之間的公尺距離 (Haversine Formula)
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371e3; // 地球半徑 (公尺)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function formatDistance(meters) {
  if (meters == null || isNaN(meters)) return "";
  if (meters < 1000) return `約 ${meters} 公尺`;
  return `約 ${(meters / 1000).toFixed(1)} 公里`;
}

let lastUserLocation = { ...OSAKA_PRESET_LOCATION };

// 判斷目前位置附近店家主函式（預設以大阪心齋橋道頓堀 34.6687, 135.5012 為起點，亦支援手機 GPS 即時覆蓋）
function detectNearbyStores(forceGps = false) {
  const modal = document.getElementById("nearbyStoresModal");
  const titleEl = document.getElementById("currentLocationTitle");
  const coordsEl = document.getElementById("currentLocationCoords");
  const discListEl = document.getElementById("nearbyDiscoveredStoresList");
  const spinnerEl = document.getElementById("nearbySearchSpinner");

  modal.classList.remove("hidden");
  titleEl.textContent = `📍 目前定位：${lastUserLocation.address || "大阪心齋橋筋與道頓堀交會處附近"}`;
  coordsEl.textContent = `緯度 ${lastUserLocation.lat.toFixed(4)}, 經度 ${lastUserLocation.lon.toFixed(4)}`;

  // 即時繪製手帳內 3 家附近藥妝店（依心齋橋距離近到遠排序）
  renderNearbySavedStores(lastUserLocation);
  discListEl.innerHTML = `<div style="padding: 12px; color: var(--ink-muted); font-size: 0.8rem; text-align: center;">正在搜尋此座標周遭藥妝店與商場...</div>`;

  // 抓取線上附近藥妝店 (預設心齋橋道頓堀)
  fetchDiscoveredNearbyStores(lastUserLocation.lat, lastUserLocation.lon);

  if (forceGps) {
    if (!navigator.geolocation) {
      showToast("⚠️ 此瀏覽器不支援手機 GPS 即時定位！已維持心齋橋預設座標");
      return;
    }

    titleEl.textContent = "正在透過手機 GPS 獲取實際位置...";
    if (spinnerEl) spinnerEl.classList.remove("hidden");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        lastUserLocation = { lat, lon, address: "手機 GPS 即時定位位置" };

        coordsEl.textContent = `緯度 ${lat.toFixed(5)}, 經度 ${lon.toFixed(5)}（誤差約 ±${Math.round(pos.coords.accuracy || 10)}m）`;
        renderNearbySavedStores(lastUserLocation);

        // 反向地理編碼
        try {
          const revController = new AbortController();
          const timeoutRev = setTimeout(() => revController.abort(), 6000);
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ja,zh-TW,en`,
            { signal: revController.signal }
          );
          clearTimeout(timeoutRev);
          if (revRes.ok) {
            const revData = await revRes.json();
            const addr = revData.display_name || "";
            const parts = addr.split(",").slice(0, 3).join(", ");
            lastUserLocation.address = parts || "GPS 定位成功";
            titleEl.textContent = `📍 目前所在位置：${lastUserLocation.address}`;
          }
        } catch (_) {}

        fetchDiscoveredNearbyStores(lat, lon);
      },
      (err) => {
        titleEl.textContent = `📍 目前定位：${lastUserLocation.address}`;
        showToast("無法取得手機 GPS，已維持大阪心齋橋道頓堀座標");
        if (spinnerEl) spinnerEl.classList.add("hidden");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }
}

async function fetchDiscoveredNearbyStores(lat, lon) {
  const discListEl = document.getElementById("nearbyDiscoveredStoresList");
  const spinnerEl = document.getElementById("nearbySearchSpinner");
  if (spinnerEl) spinnerEl.classList.remove("hidden");

  try {
    const delta = 0.015;
    const searchController = new AbortController();
    const timeoutSearch = setTimeout(() => searchController.abort(), 8000);
    const searchRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=pharmacy&bounded=1&viewbox=${lon - delta},${lat + delta},${lon + delta},${lat - delta}&limit=12&accept-language=ja,zh-TW,en`,
      { signal: searchController.signal }
    );
    clearTimeout(timeoutSearch);

    let places = [];
    if (searchRes.ok) {
      places = await searchRes.json();
    }
    renderDiscoveredNearbyStores(places, { lat, lon });
  } catch (err) {
    if (discListEl) {
      discListEl.innerHTML = `<div style="padding: 12px; color: var(--ink-muted); font-size: 0.8rem; text-align: center;">無法連線外部地圖搜尋附近店家，您仍可點擊上方「手帳中的店家」切換心齋橋 3 家藥妝店。</div>`;
    }
  } finally {
    if (spinnerEl) spinnerEl.classList.add("hidden");
  }
}

function renderNearbySavedStores(coords) {
  const container = document.getElementById("nearbySavedStoresList");
  if (!container) return;

  const storesWithDist = state.stores.map((s) => {
    const dist =
      coords && s.lat != null && s.lon != null
        ? calculateDistanceMeters(coords.lat, coords.lon, s.lat, s.lon)
        : null;
    return { store: s, dist };
  });

  // 依距離排序（有距離的放前面由近到遠，沒距離的放後面）
  storesWithDist.sort((a, b) => {
    if (a.dist != null && b.dist != null) return a.dist - b.dist;
    if (a.dist != null) return -1;
    if (b.dist != null) return 1;
    return 0;
  });

  container.innerHTML = "";
  storesWithDist.forEach(({ store, dist }) => {
    const isCurrent = store.id === state.currentStoreId;
    const itemEl = document.createElement("div");
    itemEl.className = `nearby-item ${isCurrent ? "current-store" : ""}`;

    itemEl.innerHTML = `
      <div class="nearby-item-main">
        <div class="nearby-item-name">
          <span>🏪 ${escapeHtml(store.name)}</span>
          ${isCurrent ? '<span class="active-store-tag">目前所在</span>' : ""}
        </div>
        ${store.address ? `<div class="nearby-item-addr">${escapeHtml(store.address)}</div>` : ""}
        ${dist != null ? `<div class="nearby-item-dist">${formatDistance(dist)}</div>` : '<div class="nearby-item-addr" style="color:var(--ink-light);">尚未設定 GPS 座標</div>'}
      </div>
      <div class="nearby-item-actions">
        ${
          !isCurrent
            ? `<button type="button" class="mini-btn btn-switch-store">👉 切換</button>`
            : ""
        }
        ${
          coords
            ? `<button type="button" class="mini-btn btn-pin-here" title="將目前位置存為本店位置">📌 綁定此處</button>`
            : ""
        }
      </div>
    `;

    const switchBtn = itemEl.querySelector(".btn-switch-store");
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        state.currentStoreId = store.id;
        saveState();
        document.getElementById("nearbyStoresModal").classList.add("hidden");
        renderApp();
        showToast(`已切換至「${store.name}」`);
      });
    }

    const pinBtn = itemEl.querySelector(".btn-pin-here");
    if (pinBtn) {
      pinBtn.addEventListener("click", () => {
        store.lat = coords.lat;
        store.lon = coords.lon;
        const currentTitle = document.getElementById("currentLocationTitle")?.textContent || "";
        if (currentTitle && currentTitle.includes("：")) {
          store.address = currentTitle.split("：")[1].trim();
        }
        saveState();
        renderNearbySavedStores(coords);
        renderApp();
        showToast(`已將目前 GPS 綁定至「${store.name}」`);
      });
    }

    container.appendChild(itemEl);
  });
}

function renderDiscoveredNearbyStores(places, coords) {
  const container = document.getElementById("nearbyDiscoveredStoresList");
  if (!container) return;

  if (!places || places.length === 0) {
    container.innerHTML = `
      <div style="padding: 12px; color: var(--ink-muted); font-size: 0.8rem; text-align: center;">
        此 GPS 位置方圓 1.5 公里內未找到標記藥局/藥妝店。您仍可點擊「＋ 新增商店」手動命名。
      </div>
    `;
    return;
  }

  const uniquePlaces = [];
  const seenNames = new Set();

  places.forEach((p) => {
    const rawName = p.name || (p.display_name ? p.display_name.split(",")[0] : "附近商店");
    if (!seenNames.has(rawName)) {
      seenNames.add(rawName);
      const pLat = parseFloat(p.lat);
      const pLon = parseFloat(p.lon);
      const dist = coords ? calculateDistanceMeters(coords.lat, coords.lon, pLat, pLon) : null;
      uniquePlaces.push({
        name: rawName,
        lat: pLat,
        lon: pLon,
        address: p.display_name ? p.display_name.split(",").slice(1, 3).join(",") : "",
        dist,
      });
    }
  });

  uniquePlaces.sort((a, b) => (a.dist || 999999) - (b.dist || 999999));

  container.innerHTML = "";
  uniquePlaces.forEach((place) => {
    const existing = state.stores.find((s) => s.name === place.name || s.name.includes(place.name));
    const itemEl = document.createElement("div");
    itemEl.className = "nearby-item";

    itemEl.innerHTML = `
      <div class="nearby-item-main">
        <div class="nearby-item-name">
          <span>💊 ${escapeHtml(place.name)}</span>
          ${existing ? '<span style="font-size:0.7rem; color:var(--accent-sage); font-weight:600;">(手帳已建)</span>' : ""}
        </div>
        ${place.address ? `<div class="nearby-item-addr">${escapeHtml(place.address)}</div>` : ""}
        ${place.dist != null ? `<div class="nearby-item-dist">${formatDistance(place.dist)}</div>` : ""}
      </div>
      <div class="nearby-item-actions">
        ${
          existing
            ? `<button type="button" class="mini-btn btn-switch-disc">👉 切換至此店</button>`
            : `<button type="button" class="mini-btn btn-add-disc">➕ 加入手帳並切換</button>`
        }
      </div>
    `;

    const switchBtn = itemEl.querySelector(".btn-switch-disc");
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        state.currentStoreId = existing.id;
        saveState();
        document.getElementById("nearbyStoresModal").classList.add("hidden");
        renderApp();
        showToast(`已切換至「${existing.name}」`);
      });
    }

    const addBtn = itemEl.querySelector(".btn-add-disc");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const newStore = {
          id: "store_" + Date.now(),
          name: place.name,
          lat: place.lat,
          lon: place.lon,
          address: place.address,
          cards: [],
        };
        state.stores.push(newStore);
        state.currentStoreId = newStore.id;
        saveState();
        document.getElementById("nearbyStoresModal").classList.add("hidden");
        renderApp();
        showToast(`已新增並切換至「${place.name}」！`);
      });
    }

    container.appendChild(itemEl);
  });
}

// 繪製整個畫面
function renderApp() {
  renderHeaderRate();
  renderStoreTabs();
  renderTaxFreeProgress();
  renderPhotoCards();
  renderSummaryDock();
}

function renderHeaderRate() {
  const el = document.getElementById("headerRateDisplay");
  el.textContent = `¥1 = $${state.settings.exchangeRate}`;
}

function renderStoreTabs() {
  const container = document.getElementById("storeTabs");
  container.innerHTML = "";

  state.stores.forEach((store) => {
    const selectedQty = store.cards.reduce(
      (sum, c) =>
        sum +
        c.items.reduce((s, it) => s + (it.selected ? Number(it.qty) || 1 : 0), 0),
      0
    );

    const btn = document.createElement("button");
    btn.className = `store-tab ${store.id === state.currentStoreId ? "active" : ""}`;
    btn.innerHTML = `
      <span>${escapeHtml(store.name)}</span>
      <span class="store-tab-count">${selectedQty}</span>
    `;
    btn.addEventListener("click", () => {
      state.currentStoreId = store.id;
      saveState();
      renderApp();
    });
    container.appendChild(btn);
  });
}

function getStoreTotals(store) {
  let selectedKinds = 0;
  let totalQty = 0;
  let totalUntaxed = 0;
  let totalTaxed = 0;

  for (const card of store.cards) {
    for (const item of card.items) {
      if (item.selected) {
        selectedKinds += 1;
        const q = Math.max(1, Number(item.qty) || 1);
        totalQty += q;
        totalUntaxed += (Number(item.untaxedPrice) || 0) * q;
        totalTaxed += (Number(item.taxedPrice) || 0) * q;
      }
    }
  }
  return { selectedKinds, totalQty, totalUntaxed, totalTaxed };
}

function renderTaxFreeProgress() {
  const store = getCurrentStore();
  const { totalUntaxed } = getStoreTotals(store);
  const threshold = Math.max(1, Number(state.settings.taxFreeThreshold) || 5000);

  const cardEl = document.getElementById("taxFreeCard");
  const nameEl = document.getElementById("currentStoreName");
  const statusEl = document.getElementById("taxFreeStatusText");
  const barEl = document.getElementById("taxFreeProgressBar");

  nameEl.textContent = store.name;
  const pct = Math.min(100, Math.round((totalUntaxed / threshold) * 100));
  barEl.style.width = `${pct}%`;

  if (totalUntaxed >= threshold) {
    cardEl.classList.add("achieved");
    const savedTax = getStoreTotals(store).totalTaxed - totalUntaxed;
    statusEl.textContent = `🎉 已達免稅門檻！可省稅金 ${formatYen(savedTax)}`;
  } else {
    cardEl.classList.remove("achieved");
    const remain = threshold - totalUntaxed;
    statusEl.textContent = `距離免稅還差 ${formatYen(remain)} (${formatTwd(remain)})`;
  }
}

function renderPhotoCards() {
  const store = getCurrentStore();
  const container = document.getElementById("photoCardsContainer");
  container.innerHTML = "";

  const visibleCards = store.cards.filter((card) => {
    if (!filterSelectedOnly) return true;
    return card.items.some((item) => item.selected);
  });

  if (visibleCards.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>${
          filterSelectedOnly
            ? "目前這家店還沒有勾選要買的商品喔！"
            : "這家店還沒有商品照片，快點擊上方相機拍一張貨架吧！"
        }</p>
      </div>
    `;
    return;
  }

  visibleCards.forEach((card) => {
    const cardEl = document.createElement("article");
    cardEl.className = "photo-card";

    const itemsToShow = filterSelectedOnly
      ? card.items.filter((i) => i.selected)
      : card.items;

    const thumbHtml = card.imageUrl
      ? `
      <div class="shelf-thumb-wrap" data-img="${escapeHtml(card.imageUrl)}">
        <img src="${escapeHtml(card.imageUrl)}" alt="${escapeHtml(card.title)}" loading="lazy" />
        <span class="zoom-hint">放大</span>
      </div>
    `
      : "";

    const hintText = card.aiStatus
      ? card.aiStatus
      : `點擊下方商品即可勾選加入本店購物籃（共 ${card.items.length} 項）`;
    const hintColorStyle =
      card.aiStatus && card.aiStatus.startsWith("⚠️")
        ? 'style="color: var(--accent-persimmon); font-weight: 700;"'
        : "";

    cardEl.innerHTML = `
      <div class="photo-card-header">
        ${thumbHtml}
        <div class="photo-meta">
          <div class="photo-title-row">
            <h2 class="photo-title">${escapeHtml(card.title)}</h2>
          </div>
          <p class="photo-hint" ${hintColorStyle}>${escapeHtml(hintText)}</p>
          <div class="photo-card-actions">
            <button class="mini-btn btn-add-subitem" data-card-id="${card.id}">＋ 新增此圖商品</button>
            <button class="mini-btn highlight-pill btn-check-card-lowest" data-card-id="${card.id}" title="一鍵確認這張照片中所有商品是否為最低價">🔍 一鍵查此圖最低價</button>
            ${
              card.imageUrl
                ? `<button class="mini-btn btn-rescan-ai" data-card-id="${card.id}">✨ AI 重新辨識</button>`
                : ""
            }
            <button class="mini-btn danger btn-delete-card" data-card-id="${card.id}">刪除照片</button>
          </div>
        </div>
      </div>
      <div class="product-list"></div>
    `;

    // 綁定原圖放大
    const thumbWrap = cardEl.querySelector(".shelf-thumb-wrap");
    if (thumbWrap) {
      thumbWrap.addEventListener("click", () => {
        openLightbox(card.imageUrl);
      });
    }

    // 綁定卡片按鈕
    cardEl
      .querySelector(".btn-add-subitem")
      .addEventListener("click", () => openItemModal(card.id, null));

    const rescanBtn = cardEl.querySelector(".btn-rescan-ai");
    if (rescanBtn) {
      rescanBtn.addEventListener("click", () => rescanCardWithAI(card));
    }

    const checkCardBtn = cardEl.querySelector(".btn-check-card-lowest");
    if (checkCardBtn) {
      checkCardBtn.addEventListener("click", () => {
        card.items.forEach((it) => {
          const resEl = cardEl.querySelector(`#lowestResult_${it.id}`);
          if (resEl) {
            evaluateAndDisplayLowestResult(it, store.id, resEl);
          }
        });
        showToast(`已完成此圖 ${card.items.length} 件商品的最低價比對！`);
      });
    }

    cardEl.querySelector(".btn-delete-card").addEventListener("click", () => {
      showConfirmModal(
        `確定要刪除「${card.title}」這張照片與裡面的商品嗎？`,
        () => {
          store.cards = store.cards.filter((c) => c.id !== card.id);
          saveState();
          renderApp();
          showToast("已刪除照片卡片");
        }
      );
    });

    const listEl = cardEl.querySelector(".product-list");

    itemsToShow.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = `product-item ${item.selected ? "selected" : ""}`;

      const comparison = findCrossStoreComparison(item, store.id);
      const compareBadgeHtml = comparison
        ? `<span class="compare-badge ${comparison.type}" title="點擊查看所有店家標價明細">${escapeHtml(comparison.text)} ▾</span>`
        : "";

      itemEl.innerHTML = `
        <div class="product-top-row">
          <div class="check-circle">${item.selected ? "✓" : ""}</div>
          <div class="product-info">
            <div class="product-name">${escapeHtml(item.name)}</div>
            <div class="product-note-row">
              ${
                item.note
                  ? `<span class="product-note">${escapeHtml(item.note)}</span>`
                  : ""
              }
              ${compareBadgeHtml}
            </div>
          </div>
          <div class="item-action-btns">
            <button class="check-lowest-btn" type="button" title="按下去確認是否為最低價">🔍 查最低價</button>
            <button class="edit-item-btn" type="button" title="編輯名稱與價格">✎ 編輯</button>
            <button class="delete-item-btn" type="button" title="刪除此偵測品項">✕ 刪除</button>
          </div>
        </div>
        <div class="product-bottom-row">
          <div class="price-badges">
            <div class="price-pill untaxed">
              <span class="tag">未稅</span>
              <span class="val">${formatYen(item.untaxedPrice)}</span>
              <span class="twd-sub">(${formatTwd(item.untaxedPrice)})</span>
            </div>
            <div class="price-pill taxed">
              <span class="tag">含稅</span>
              <span class="val">${formatYen(item.taxedPrice)}</span>
              <span class="twd-sub">(${formatTwd(item.taxedPrice)})</span>
            </div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn btn-minus" type="button">−</button>
            <span class="qty-num">${item.qty || 1}</span>
            <button class="qty-btn btn-plus" type="button">＋</button>
          </div>
        </div>
        <div class="item-lowest-result hidden" id="lowestResult_${item.id}"></div>
      `;

      // 點擊卡片主體切換勾選
      itemEl.addEventListener("click", (e) => {
        if (
          e.target.closest(".qty-controls") ||
          e.target.closest(".item-action-btns") ||
          e.target.closest(".compare-badge")
        ) {
          return;
        }
        item.selected = !item.selected;
        if (item.selected && (!item.qty || item.qty < 1)) {
          item.qty = 1;
        }
        saveState();
        renderApp();
      });

      // 點擊比價徽章開啟跨店比價明細
      const badgeEl = itemEl.querySelector(".compare-badge");
      if (badgeEl) {
        badgeEl.addEventListener("click", (e) => {
          e.stopPropagation();
          openItemCompareModal(item);
        });
      }

      // 按鈕：按下去確認是否為最低價，若不是則顯示附近哪家店有低價、價位多少
      const checkLowestBtn = itemEl.querySelector(".check-lowest-btn");
      const resultBox = itemEl.querySelector(".item-lowest-result");
      if (checkLowestBtn && resultBox) {
        checkLowestBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!resultBox.classList.contains("hidden")) {
            resultBox.classList.add("hidden");
            checkLowestBtn.classList.remove("active");
          } else {
            evaluateAndDisplayLowestResult(item, store.id, resultBox);
            checkLowestBtn.classList.add("active");
          }
        });
      }

      // 編輯按鈕
      itemEl.querySelector(".edit-item-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        openItemModal(card.id, item.id);
      });

      // 刪除單一品項按鈕
      itemEl.querySelector(".delete-item-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        showConfirmModal(`確定要刪除「${item.name}」這個品項嗎？`, () => {
          card.items = card.items.filter((i) => i.id !== item.id);
          saveState();
          renderApp();
          showToast("已刪除品項");
        });
      });

      // 數量減少
      itemEl.querySelector(".btn-minus").addEventListener("click", (e) => {
        e.stopPropagation();
        if (!item.selected) {
          item.selected = true;
          item.qty = 1;
        } else if (item.qty > 1) {
          item.qty -= 1;
        } else {
          item.selected = false;
        }
        saveState();
        renderApp();
      });

      // 數量增加
      itemEl.querySelector(".btn-plus").addEventListener("click", (e) => {
        e.stopPropagation();
        if (!item.selected) {
          item.selected = true;
          item.qty = 1;
        } else {
          item.qty = (Number(item.qty) || 1) + 1;
        }
        saveState();
        renderApp();
      });

      listEl.appendChild(itemEl);
    });

    // 在照片品項列表最下方放置「＋ 新增此照片品項」按鈕，方便直接補漏
    const addRowBtn = document.createElement("button");
    addRowBtn.type = "button";
    addRowBtn.className = "add-card-item-row-btn";
    addRowBtn.textContent = "＋ 新增這張照片的品項";
    addRowBtn.addEventListener("click", () => openItemModal(card.id, null));
    listEl.appendChild(addRowBtn);

    container.appendChild(cardEl);
  });
}

function renderSummaryDock() {
  const store = getCurrentStore();
  const { selectedKinds, totalQty, totalUntaxed, totalTaxed } =
    getStoreTotals(store);

  document.getElementById("totalQtyBadge").textContent = totalQty;
  const qtyTextEl = document.getElementById("totalQtyText");
  if (qtyTextEl) qtyTextEl.textContent = `${totalQty} 件`;
  const kindsTextEl = document.getElementById("totalKindsText");
  if (kindsTextEl) kindsTextEl.textContent = `(共 ${selectedKinds} 品項)`;
  document.getElementById("totalUntaxedYen").textContent = formatYen(totalUntaxed);
  document.getElementById("totalUntaxedTwd").textContent = `(${formatTwd(totalUntaxed)})`;
  document.getElementById("totalTaxedYen").textContent = formatYen(totalTaxed);
  document.getElementById("totalTaxedTwd").textContent = `(${formatTwd(totalTaxed)})`;
}

// 影像壓縮與 Base64 轉換（針對 iPhone iOS Safari 與各行動瀏覽器極致相容優化）
function compressImageFile(file, maxDim = 600, quality = 0.6) {
  return new Promise((resolve, reject) => {
    // 檢查是否為 iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // iOS Safari 在處理相機原始 HEIC/JPEG 時，createImageBitmap 常有無聲當機或方向顛倒問題
    // 因此在 iOS 優先採用標準 FileReader + HTMLImageElement
    if (!isIOS && window.createImageBitmap) {
      createImageBitmap(file)
        .then((bitmap) => {
          let { width, height } = bitmap;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(bitmap, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        })
        .catch(() => fallbackCompress(file, maxDim, quality, resolve, reject));
    } else {
      fallbackCompress(file, maxDim, quality, resolve, reject);
    }
  });
}

function fallbackCompress(file, maxDim, quality, resolve, reject) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    // 跨域與 iOS 生命週期安全
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let { naturalWidth: width, naturalHeight: height } = img;
      if (!width || !height) {
        width = img.width || 600;
        height = img.height || 600;
      }
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      } catch (err) {
        reject(new Error("圖片壓縮失敗: " + err.message));
      }
    };
    img.onerror = () => reject(new Error("手機相片載入失敗，請確認檔案格式是否支援"));
    img.src = ev.target.result;
  };
  reader.onerror = () => reject(new Error("讀取手機照片失敗"));
  reader.readAsDataURL(file);
}

// 將網址或本地圖片轉為 Base64 供 AI 重新辨識使用
async function imageUrlToBase64(url) {
  if (url.startsWith("data:image/")) {
    return url.split(",")[1];
  }
  const resp = await fetch(url);
  const blob = await resp.blob();
  const dataUrl = await compressImageFile(blob, 800, 0.65);
  return dataUrl.split(",")[1];
}

let isUserExplicitCancel = false;
let currentAiAbortController = null;

// 帶超時與手動取消支援的 fetch（清楚區分「使用者主動略過」與「網路逾時」）
async function fetchWithTimeout(url, options = {}, timeoutMs = 28000) {
  const controller = new AbortController();
  currentAiAbortController = controller;
  let isTimeout = false;
  const timer = setTimeout(() => {
    isTimeout = true;
    try {
      controller.abort();
    } catch (_) {}
  }, timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (isTimeout) {
      throw new Error(`連線逾時 (${Math.round(timeoutMs / 1000)} 秒)`);
    }
    if (isUserExplicitCancel) {
      throw new Error("USER_CANCEL");
    }
    throw err;
  } finally {
    clearTimeout(timer);
    if (currentAiAbortController === controller) {
      currentAiAbortController = null;
    }
  }
}

// 將含有貨幣符號或逗號的價格字串轉為正整數
function parsePriceNumber(val) {
  if (typeof val === "number" && !isNaN(val)) return Math.round(val);
  if (!val) return 0;
  const cleaned = String(val).replace(/[,，\s¥￥円元]/g, "");
  const match = cleaned.match(/\d+(\.\d+)?/);
  return match ? Math.round( parseFloat(match[0]) ) : 0;
}

// 將各種不同 AI 回傳的 JSON 格式標準化為 { photoTitle, items }
function normalizeParsedShelfData(rawParsed) {
  if (!rawParsed) return { photoTitle: "", items: [] };

  let rawList = [];
  let photoTitle = "";

  if (Array.isArray(rawParsed)) {
    rawList = rawParsed;
  } else if (typeof rawParsed === "object") {
    photoTitle =
      rawParsed.photoTitle ||
      rawParsed.title ||
      rawParsed.store ||
      "";
    if (Array.isArray(rawParsed.items)) {
      rawList = rawParsed.items;
    } else if (Array.isArray(rawParsed.products)) {
      rawList = rawParsed.products;
    } else if (Array.isArray(rawParsed.data)) {
      rawList = rawParsed.data;
    } else if (rawParsed.name && (rawParsed.untaxedPrice || rawParsed.taxedPrice || rawParsed.price)) {
      rawList = [rawParsed];
    }
  }

  const normalizedItems = rawList
    .map((it, idx) => {
      if (!it || typeof it !== "object") return null;
      const name = String(
        it.name || it.productName || it.title || it.item || ""
      ).trim();
      const note = String(
        it.note || it.spec || it.description || it.capacity || ""
      ).trim();
      const rateNum = parsePriceNumber(it.taxRate);
      const taxRate = rateNum === 8 ? 8 : 10;

      let untaxed = parsePriceNumber(
        it.untaxedPrice ?? it.priceExcludingTax ?? it.basePrice ?? it.price
      );
      let taxed = parsePriceNumber(
        it.taxedPrice ?? it.priceIncludingTax ?? it.taxIncludedPrice
      );

      if (untaxed > 0 && taxed === 0) {
        taxed = Math.round(untaxed * (1 + taxRate / 100));
      } else if (taxed > 0 && untaxed === 0) {
        untaxed = Math.round(taxed / (1 + taxRate / 100));
      }

      if (!name && untaxed === 0 && taxed === 0) return null;

      return {
        id: `item_${Date.now()}_${idx}`,
        name: name || `商品 #${idx + 1}`,
        note,
        untaxedPrice: untaxed,
        taxedPrice: taxed,
        taxRate,
        selected: false,
        qty: 1,
      };
    })
    .filter(Boolean);

  return { photoTitle, items: normalizedItems };
}

// 從 Gemini 回傳結構中安全提取 JSON（自動跳過 Gemini 2.5/3 的 thought 思考段落，支援 Object 與 Array）
function extractJsonFromGeminiResult(result) {
  const parts = result?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    const reason = result?.candidates?.[0]?.finishReason || result?.promptFeedback?.blockReason || "EMPTY_PARTS";
    throw new Error(`AI 回傳內容為空 (${reason})`);
  }

  // 優先取非 thought 的最後一個文字段落
  const nonThoughtParts = parts.filter((p) => !p.thought && typeof p.text === "string");
  const candidateTexts =
    nonThoughtParts.length > 0
      ? nonThoughtParts.map((p) => p.text).reverse()
      : parts.filter((p) => typeof p.text === "string").map((p) => p.text).reverse();

  for (const raw of candidateTexts) {
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    try {
      return normalizeParsedShelfData(JSON.parse(cleaned));
    } catch (_) {
      // 嘗試擷取 {...} 或 [...]
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
          return normalizeParsedShelfData(
            JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
          );
        } catch (_2) {}
      }
      const firstBracket = cleaned.indexOf("[");
      const lastBracket = cleaned.lastIndexOf("]");
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        try {
          return normalizeParsedShelfData(
            JSON.parse(cleaned.slice(firstBracket, lastBracket + 1))
          );
        } catch (_3) {}
      }
    }
  }
  throw new Error("無法解析 AI 回傳的價格格式");
}

// 動態查詢該 API Key 可用的標準視覺 Gemini Flash 模型清單（依穩定與新舊排序）
async function fetchAvailableGeminiModelsList(apiKey) {
  try {
    const resp = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        apiKey
      )}`,
      {},
      5000
    );
    if (!resp.ok) return [];
    const data = await resp.json();
    const models = Array.isArray(data.models) ? data.models : [];
    const supported = models
      .filter(
        (m) =>
          Array.isArray(m.supportedGenerationMethods) &&
          m.supportedGenerationMethods.includes("generateContent")
      )
      .map((m) => String(m.name || "").replace(/^models\//, ""));

    // 過濾掉非標準圖文辨識的模型（排除 audio/tts/image/embedding/live/thinking/8b/gemma）
    const validVisionModels = supported.filter(
      (n) =>
        n.startsWith("gemini-") &&
        n.includes("flash") &&
        !n.includes("audio") &&
        !n.includes("tts") &&
        !n.includes("image") &&
        !n.includes("live") &&
        !n.includes("thinking") &&
        !n.includes("8b")
    );

    // 優先將極速穩定版模型（例如 gemini-2.0-flash, gemini-flash-latest, gemini-2.5-flash）排在最前面
    // 降級思考型/實驗型模型（如 3.6、preview 等預設思考耗時較長者排在後方）
    validVisionModels.sort((a, b) => {
      const getPriority = (name) => {
        if (name === "gemini-2.0-flash") return 100;
        if (name === "gemini-flash-latest") return 95;
        if (name === "gemini-2.5-flash") return 90;
        if (name === "gemini-3.8-flash") return 80;
        if (/^gemini-\d+(\.\d+)?-flash$/.test(name)) return 70;
        return 50;
      };
      return getPriority(b) - getPriority(a);
    });

    return validVisionModels;
  } catch (_) {
    return [];
  }
}

// 呼叫 Gemini Vision API 辨識貨架上的多個商品與未稅/含稅價（超速直連架構：不繞路、不浪費秒數查詢）
async function analyzeShelfImageWithGemini(base64Data, onStatusUpdate) {
  const apiKey = (state.settings.apiKey || "").trim();
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const promptText = `你是日本藥妝購物助手。請辨識照片中所有商品的日文/中文名稱與標價(未稅/含稅日幣數字)，回傳JSON格式：{"photoTitle":"主題","items":[{"name":"品名","note":"規格","untaxedPrice":1000,"taxedPrice":1100,"taxRate":10}]}`;

  const requestBody = JSON.stringify({
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  // 候選模型：上次成功的 → 目前主流穩定版 → 該金鑰實際可用清單 → 舊版備援
  // （2.0 系列對新建立的金鑰/專案已不再開放，會回 404，因此排在最後）
  const candidateModels = [];
  const addCandidate = (m) => {
    if (m && !candidateModels.includes(m)) candidateModels.push(m);
  };
  addCandidate(state.settings.preferredModel);
  addCandidate("gemini-2.5-flash");
  addCandidate("gemini-flash-latest");

  if (onStatusUpdate) onStatusUpdate("正在查詢此金鑰可用的 AI 模型...");
  try {
    const available = await fetchAvailableGeminiModelsList(apiKey);
    available
      .filter((n) => !n.startsWith("gemini-2.0"))
      .slice(0, 4)
      .forEach(addCandidate);
  } catch (_) {}

  addCandidate("gemini-2.0-flash");
  addCandidate("gemini-2.0-flash-lite");

  let lastErrorMsg = "";
  const errorLog = [];

  for (let i = 0; i < candidateModels.length; i++) {
    const modelName = candidateModels[i];
    if (onStatusUpdate) {
      onStatusUpdate(`正在用 AI (${modelName}) 判讀中...`);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    try {
      // 給予模型充足推論時間（25秒），逾時才切換備用模型
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        },
        25000
      );

      if (response.ok) {
        const result = await response.json();
        const parsed = extractJsonFromGeminiResult(result);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          state.settings.preferredModel = modelName;
          saveState();
          return parsed;
        }
        lastErrorMsg = `模型 ${modelName} 未產出品項`;
        continue;
      }

      const errText = await response.text();
      lastErrorMsg = `HTTP ${response.status}: ${errText.slice(0, 140)}`;
      errorLog.push(`${modelName}=${response.status}`);

      if (errText.includes("API_KEY_INVALID")) {
        throw new Error("API Key 無效，請至右上角「⚙️ 設定」檢查金鑰是否複製完整");
      }

      // 503 伺服器尖峰塞車 (high demand) 或 500 暫時錯誤：微等待 800ms 並無縫切換下一個模型！
      if (response.status === 503 || response.status === 500) {
        lastErrorMsg = `模型 ${modelName} 伺服器暫時塞車 (503)，已自動嘗試其他模型`;
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }

      // 429 額度/頻率限制：切換下一個模型
      if (response.status === 429) {
        lastErrorMsg = `模型 ${modelName} 額度受限 (429)`;
        continue;
      }

      // 404 已下架或不存在模型：直接切換下一個模型，不拋錯
      if (response.status === 404) {
        lastErrorMsg = `模型 ${modelName} 不適用 (404)，切換其他模型`;
        continue;
      }

      // 404 時自動擷取 Google 建議的新模型
      const suggestedMatch = errText.match(/models\/([a-zA-Z0-9._-]+)/g);
      if (suggestedMatch) {
        for (const raw of suggestedMatch) {
          const cleanName = raw.replace(/^models\//, "");
          if (cleanName && !candidateModels.includes(cleanName)) {
            candidateModels.splice(i + 1, 0, cleanName);
          }
        }
      }
    } catch (innerErr) {
      if (
        innerErr.name === "AbortError" ||
        String(innerErr.message).includes("USER_CANCEL") ||
        String(innerErr.message).includes("API Key 無效")
      ) {
        throw innerErr;
      }
      lastErrorMsg = innerErr.message || String(innerErr);
    }
  }

  throw new Error(
    `[v10] 已試 ${errorLog.join("、") || "無"}；最後錯誤：` +
      (lastErrorMsg || "未能成功辨識商品資料")
  );
}

// 剪裁狀態管理
let cropperState = {
  img: null,
  rawFile: null,
  box: { x: 0, y: 0, w: 0, h: 0 },
  imgRect: null,
  dragMode: null,
  startX: 0,
  startY: 0,
  startBox: null,
  resolve: null,
};

function openCropper(file) {
  return new Promise((resolve) => {
    cropperState.resolve = resolve;
    cropperState.rawFile = file;

    const modal = document.getElementById("cropperModal");
    const imgEl = document.getElementById("cropperImage");
    const wrap = document.getElementById("cropperViewportWrap");

    const reader = new FileReader();
    reader.onload = (e) => {
      imgEl.onload = () => {
        modal.classList.remove("hidden");
        const rect = imgEl.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const offsetX = rect.left - wrapRect.left;
        const offsetY = rect.top - wrapRect.top;

        // 預設框置中選取中央 70% 區域
        const w = Math.round(rect.width * 0.75);
        const h = Math.round(rect.height * 0.65);
        const x = Math.round(offsetX + (rect.width - w) / 2);
        const y = Math.round(offsetY + (rect.height - h) / 2);

        cropperState.img = imgEl;
        cropperState.imgRect = { left: offsetX, top: offsetY, width: rect.width, height: rect.height };
        cropperState.box = { x, y, w, h };
        applyCropBoxStyle();
      };
      imgEl.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function applyCropBoxStyle() {
  const boxEl = document.getElementById("cropBox");
  if (!boxEl) return;
  boxEl.style.left = `${cropperState.box.x}px`;
  boxEl.style.top = `${cropperState.box.y}px`;
  boxEl.style.width = `${cropperState.box.w}px`;
  boxEl.style.height = `${cropperState.box.h}px`;
}

function getCroppedCanvasDataUrl() {
  const img = cropperState.img;
  if (!img || !img.naturalWidth || !cropperState.imgRect) return null;

  const rect = cropperState.imgRect;
  const box = cropperState.box;

  const scaleX = img.naturalWidth / rect.width;
  const scaleY = img.naturalHeight / rect.height;

  const cropX = Math.max(0, (box.x - rect.left) * scaleX);
  const cropY = Math.max(0, (box.y - rect.top) * scaleY);
  const cropW = Math.min(img.naturalWidth - cropX, box.w * scaleX);
  const cropH = Math.min(img.naturalHeight - cropY, box.h * scaleY);

  const canvas = document.createElement("canvas");
  let outW = cropW;
  let outH = cropH;
  const maxDim = 600;
  if (outW > maxDim || outH > maxDim) {
    if (outW > outH) {
      outH = Math.round((outH * maxDim) / outW);
      outW = maxDim;
    } else {
      outW = Math.round((outW * maxDim) / outH);
      outH = maxDim;
    }
  }

  canvas.width = Math.max(10, outW);
  canvas.height = Math.max(10, outH);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.65);
}

// 處理使用者上傳新照片（先秒建照片卡片，再執行高解析 AI 辨識，並將狀態顯示於卡片上）
async function handlePhotoUpload(files) {
  if (!files || files.length === 0) return;
  const store = getCurrentStore();
  const banner = document.getElementById("aiLoadingBanner");
  const loadingText = document.getElementById("aiLoadingText");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // 跳出直覺框選視窗（可自由拖曳重點，或點全圖直接辨識）
    const cropChoice = await openCropper(file);

    banner.classList.remove("hidden");
    loadingText.textContent = `正在處理第 ${i + 1} / ${files.length} 張照片...`;

    const newCardId = "card_" + Date.now() + "_" + i;
    let newCard = null;
    let elapsedTimer = null;

    try {
      // 若有剪裁則使用特寫圖（AI 秒回），若跳過剪裁則傳全圖
      const dataUrl = cropChoice && cropChoice.croppedDataUrl
        ? cropChoice.croppedDataUrl
        : await compressImageFile(file, 600, 0.6);
      const base64Data = dataUrl.split(",")[1];

      newCard = {
        id: newCardId,
        title: `新上傳貨架 (${file.name})`,
        imageUrl: dataUrl,
        aiStatus: state.settings.apiKey
          ? "⏳ AI 正在辨識此照片中的商品與價格..."
          : "",
        items: [],
      };
      store.cards.unshift(newCard);
      saveState();
      renderApp();

      if (!state.settings.apiKey) {
        banner.classList.add("hidden");
        openItemModal(newCardId, null);
        continue;
      }

      let seconds = 0;
      let currentStageText = "正在用 AI 辨識照片中的商品與未稅/含稅價...";
      loadingText.textContent = currentStageText;
      elapsedTimer = setInterval(() => {
        seconds += 1;
        loadingText.textContent = `${currentStageText} (${seconds}s)`;
      }, 1000);

      const parsed = await analyzeShelfImageWithGemini(base64Data, (msg) => {
        currentStageText = msg;
        loadingText.textContent = `${currentStageText} (${seconds}s)`;
      });

      const items = Array.isArray(parsed.items) ? parsed.items : [];
      newCard.title = parsed.photoTitle || newCard.title;
      newCard.items = items;
      newCard.aiStatus =
        items.length > 0
          ? ""
          : "⚠️ AI 未在圖中找到清晰標價，請點「✨ AI 重新辨識」或下方手動新增品項";
      saveState();
      renderApp();
      showToast(
        items.length > 0
          ? `✨ 成功辨識出 ${items.length} 項商品！`
          : "未偵測到標價，可點下方手動新增品項"
      );
    } catch (err) {
      console.error(err);
      if (err.message === "USER_CANCEL" || isUserExplicitCancel) {
        if (newCard) {
          newCard.aiStatus = "已手動略過 AI 辨識，可點下方「＋ 新增這張照片的品項」";
          saveState();
          renderApp();
          openItemModal(newCard.id, null);
        }
        showToast("已略過 AI 辨識");
      } else {
        if (newCard) {
          newCard.aiStatus = `⚠️ AI 辨識未成功 (${err.message})，請點「✨ AI 重新辨識」或手動新增`;
          saveState();
          renderApp();
        }
        showToast(`AI 辨識未成功：${err.message}`);
      }
    } finally {
      isUserExplicitCancel = false;
      if (elapsedTimer) clearInterval(elapsedTimer);
      banner.classList.add("hidden");
    }
  }
}

async function rescanCardWithAI(card) {
  if (!state.settings.apiKey) {
    showToast("請先在設定中填入 Gemini API Key！");
    openSettingsModal();
    return;
  }
  const banner = document.getElementById("aiLoadingBanner");
  const loadingText = document.getElementById("aiLoadingText");
  banner.classList.remove("hidden");

  card.aiStatus = "⏳ AI 正在重新辨識此照片...";
  renderApp();

  let seconds = 0;
  let currentStageText = `正在重新辨識「${card.title}」...`;
  loadingText.textContent = currentStageText;
  const elapsedTimer = setInterval(() => {
    seconds += 1;
    loadingText.textContent = `${currentStageText} (${seconds}s)`;
  }, 1000);

  try {
    const base64Data = await imageUrlToBase64(card.imageUrl);
    const parsed = await analyzeShelfImageWithGemini(base64Data, (msg) => {
      currentStageText = msg;
      loadingText.textContent = `${currentStageText} (${seconds}s)`;
    });
    if (Array.isArray(parsed.items) && parsed.items.length > 0) {
      card.title = parsed.photoTitle || card.title;
      card.items = parsed.items;
      card.aiStatus = "";
      saveState();
      renderApp();
      showToast(`✨ 重新辨識完成，共 ${card.items.length} 項商品！`);
    } else {
      card.aiStatus = "⚠️ AI 未在照片中找到明確標價，可點下方手動新增品項";
      saveState();
      renderApp();
      showToast("AI 未在照片中找到明確標價");
    }
  } catch (err) {
    card.aiStatus = `⚠️ AI 辨識失敗 (${err.message})`;
    saveState();
    renderApp();
    showToast(`AI 重新辨識未完成：${err.message}`);
  } finally {
    clearInterval(elapsedTimer);
    banner.classList.add("hidden");
  }
}

// 新增 / 編輯單一商品視窗邏輯
function openItemModal(cardId, itemId) {
  const store = getCurrentStore();
  let targetCard = cardId
    ? store.cards.find((c) => c.id === cardId)
    : store.cards[0];

  if (!targetCard) {
    targetCard = {
      id: "card_manual_" + Date.now(),
      title: "手動記錄商品清單",
      imageUrl: "",
      items: [],
    };
    store.cards.unshift(targetCard);
  }

  const existingItem = itemId
    ? targetCard.items.find((i) => i.id === itemId)
    : null;

  document.getElementById("editCardId").value = targetCard.id;
  document.getElementById("editItemId").value = existingItem ? existingItem.id : "";
  document.getElementById("itemModalTitle").textContent = existingItem
    ? "✎ 編輯商品資訊"
    : "✎ 新增商品至此照片";

  document.getElementById("inputItemName").value = existingItem
    ? existingItem.name
    : "";
  const compareKeyEl = document.getElementById("inputItemCompareKey");
  if (compareKeyEl) {
    compareKeyEl.value = existingItem ? (existingItem.compareKey || "") : "";
  }
  document.getElementById("inputItemNote").value = existingItem
    ? existingItem.note || ""
    : "";
  document.getElementById("inputItemUntaxed").value = existingItem
    ? existingItem.untaxedPrice
    : "";
  document.getElementById("inputItemTaxed").value = existingItem
    ? existingItem.taxedPrice
    : "";

  setTaxChipActive(existingItem ? existingItem.taxRate || 10 : 10);
  const delBtn = document.getElementById("btnDeleteItemInModal");
  if (delBtn) {
    delBtn.classList.toggle("hidden", !existingItem);
  }
  document.getElementById("itemModal").classList.remove("hidden");
}

function setTaxChipActive(rate) {
  currentModalTaxRate = Number(rate) === 8 ? 8 : 10;
  document.querySelectorAll(".tax-chip").forEach((btn) => {
    btn.classList.toggle(
      "active",
      Number(btn.dataset.tax) === currentModalTaxRate
    );
  });
}

function openSettingsModal() {
  document.getElementById("inputApiKey").value = state.settings.apiKey || "";
  document.getElementById("inputExchangeRate").value =
    state.settings.exchangeRate;
  document.getElementById("inputTaxFreeThreshold").value =
    state.settings.taxFreeThreshold;
  updateStorageQuotaDisplay();
  document.getElementById("settingsModal").classList.remove("hidden");
}

function openCartDrawer() {
  const store = getCurrentStore();
  const listEl = document.getElementById("cartDrawerList");
  listEl.innerHTML = "";

  const selectedItems = [];
  store.cards.forEach((card) => {
    card.items.forEach((item) => {
      if (item.selected) {
        selectedItems.push({ card, item });
      }
    });
  });

  if (selectedItems.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><p>尚未勾選任何商品喔！點擊照片下方的商品卡片即可加入。</p></div>`;
  } else {
    selectedItems.forEach(({ item }) => {
      const q = Number(item.qty) || 1;
      const subUntaxed = item.untaxedPrice * q;
      const subTaxed = item.taxedPrice * q;

      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div>
          <div class="cart-row-title">${escapeHtml(item.name)} × ${q}</div>
          <div class="cart-row-sub">單價：未稅 ${formatYen(item.untaxedPrice)} / 含稅 ${formatYen(item.taxedPrice)}</div>
        </div>
        <div class="cart-row-right">
          <div class="cart-row-title" style="color: var(--accent-persimmon)">含稅 ${formatYen(subTaxed)}</div>
          <div class="cart-row-sub">未稅 ${formatYen(subUntaxed)} (${formatTwd(subTaxed)})</div>
        </div>
      `;
      listEl.appendChild(row);
    });
  }

  document.getElementById("cartDrawerModal").classList.remove("hidden");
}

function openLightbox(imgUrl) {
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImg");
  img.src = imgUrl;
  modal.classList.remove("hidden");
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let pendingConfirmAction = null;
let toastTimer = null;

function showToast(msg) {
  const banner = document.getElementById("toastBanner");
  if (!banner) return;
  banner.textContent = msg;
  banner.classList.remove("hidden");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    banner.classList.add("hidden");
  }, 2400);
}

function showConfirmModal(message, onConfirm) {
  const modal = document.getElementById("confirmModal");
  const msgEl = document.getElementById("confirmModalMessage");
  if (!modal || !msgEl) {
    if (typeof onConfirm === "function") onConfirm();
    return;
  }
  msgEl.textContent = message;
  pendingConfirmAction = onConfirm;
  modal.classList.remove("hidden");
}

function closeConfirmModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) modal.classList.add("hidden");
  pendingConfirmAction = null;
}

// 開啟商店管理視窗 (mode: 'add' | 'edit')
function openStoreModal(mode) {
  const modal = document.getElementById("storeModal");
  const modeInput = document.getElementById("storeModalMode");
  const titleEl = document.getElementById("storeModalTitle");
  const nameInput = document.getElementById("inputStoreName");
  const dangerZone = document.getElementById("storeDangerZone");
  const gpsText = document.getElementById("storeGpsInfoText");
  const latInput = document.getElementById("inputStoreLat");
  const lonInput = document.getElementById("inputStoreLon");

  modeInput.value = mode;
  if (mode === "add") {
    titleEl.textContent = "＋ 新增商店";
    nameInput.value = "";
    if (latInput) latInput.value = "";
    if (lonInput) lonInput.value = "";
    if (gpsText) gpsText.textContent = "尚未綁定 GPS 位置";
    dangerZone.classList.add("hidden");
  } else {
    const store = getCurrentStore();
    titleEl.textContent = `🏪 管理商店：${store.name}`;
    nameInput.value = store.name;
    if (latInput) latInput.value = store.lat != null ? store.lat : "";
    if (lonInput) lonInput.value = store.lon != null ? store.lon : "";
    if (gpsText) {
      gpsText.textContent =
        store.lat != null && store.lon != null
          ? `📍 已綁定 (緯度: ${Number(store.lat).toFixed(4)}, 經度: ${Number(store.lon).toFixed(4)})${store.address ? ` - ${store.address}` : ""}`
          : "尚未綁定 GPS 位置";
    }
    dangerZone.classList.remove("hidden");
  }

  modal.classList.remove("hidden");
  setTimeout(() => nameInput.focus(), 50);
}

// 清空當前商店的全部照片與商品資料
function clearCurrentStoreData() {
  const store = getCurrentStore();
  showConfirmModal(
    `確定要清空「${store.name}」店內的所有照片與商品資料嗎？\n（商店名稱會保留，內容將全部清空）`,
    () => {
      store.cards = [];
      saveState();
      document.getElementById("storeModal").classList.add("hidden");
      renderApp();
      showToast(`已清空「${store.name}」全部資料`);
    }
  );
}

// 刪除當前商店
function deleteCurrentStore() {
  const store = getCurrentStore();
  showConfirmModal(
    `確定要刪除「${store.name}」這家商店與其所有資料嗎？`,
    () => {
      if (state.stores.length <= 1) {
        // 若只剩最後一家商店，直接重置為空白商店
        store.name = "新商店";
        store.cards = [];
      } else {
        state.stores = state.stores.filter((s) => s.id !== store.id);
        state.currentStoreId = state.stores[0].id;
      }
      saveState();
      document.getElementById("storeModal").classList.add("hidden");
      renderApp();
      showToast("已刪除商店");
    }
  );
}

// 綁定所有全域事件
function bindEvents() {
  // 略過/取消 AI 辨識按鈕
  const cancelAiBtn = document.getElementById("btnCancelAiScan");
  if (cancelAiBtn) {
    cancelAiBtn.addEventListener("click", () => {
      isUserExplicitCancel = true;
      if (currentAiAbortController) {
        currentAiAbortController.abort();
      }
      document.getElementById("aiLoadingBanner").classList.add("hidden");
    });
  }

  // 確認視窗事件
  document
    .getElementById("btnCloseConfirmModal")
    .addEventListener("click", closeConfirmModal);
  document
    .getElementById("btnCancelConfirm")
    .addEventListener("click", closeConfirmModal);
  document
    .getElementById("btnAcceptConfirm")
    .addEventListener("click", () => {
      const fn = pendingConfirmAction;
      closeConfirmModal();
      if (typeof fn === "function") fn();
    });

  // 剪裁視窗按鈕與觸控拖曳綁定
  const cropperModal = document.getElementById("cropperModal");
  const cropBox = document.getElementById("cropBox");
  const wrap = document.getElementById("cropperViewportWrap");

  document.getElementById("btnCancelCrop").addEventListener("click", () => {
    cropperModal.classList.add("hidden");
    if (cropperState.resolve) cropperState.resolve(null);
  });

  document.getElementById("btnSkipCrop").addEventListener("click", () => {
    cropperModal.classList.add("hidden");
    if (cropperState.resolve) cropperState.resolve({ skip: true });
  });

  document.getElementById("btnConfirmCrop").addEventListener("click", () => {
    const croppedDataUrl = getCroppedCanvasDataUrl();
    cropperModal.classList.add("hidden");
    if (cropperState.resolve) cropperState.resolve({ croppedDataUrl });
  });

  // 剪裁框觸控與滑鼠拖曳
  const onPointerDown = (e) => {
    const target = e.target;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (target.dataset && target.dataset.handle) {
      cropperState.dragMode = target.dataset.handle;
    } else if (target === cropBox || cropBox.contains(target)) {
      cropperState.dragMode = "move";
    } else {
      return;
    }

    cropperState.startX = clientX;
    cropperState.startY = clientY;
    cropperState.startBox = { ...cropperState.box };
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!cropperState.dragMode || !cropperState.startBox || !cropperState.imgRect) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - cropperState.startX;
    const dy = clientY - cropperState.startY;

    const sb = cropperState.startBox;
    const r = cropperState.imgRect;
    let { x, y, w, h } = sb;

    if (cropperState.dragMode === "move") {
      x = Math.max(r.left, Math.min(r.left + r.width - w, sb.x + dx));
      y = Math.max(r.top, Math.min(r.top + r.height - h, sb.y + dy));
    } else if (cropperState.dragMode === "se") {
      w = Math.max(50, Math.min(r.left + r.width - x, sb.w + dx));
      h = Math.max(40, Math.min(r.top + r.height - y, sb.h + dy));
    } else if (cropperState.dragMode === "sw") {
      const newX = Math.max(r.left, Math.min(sb.x + sb.w - 50, sb.x + dx));
      w = sb.w + (sb.x - newX);
      x = newX;
      h = Math.max(40, Math.min(r.top + r.height - y, sb.h + dy));
    } else if (cropperState.dragMode === "ne") {
      const newY = Math.max(r.top, Math.min(sb.y + sb.h - 40, sb.y + dy));
      h = sb.h + (sb.y - newY);
      y = newY;
      w = Math.max(50, Math.min(r.left + r.width - x, sb.w + dx));
    } else if (cropperState.dragMode === "nw") {
      const newX = Math.max(r.left, Math.min(sb.x + sb.w - 50, sb.x + dx));
      const newY = Math.max(r.top, Math.min(sb.y + sb.h - 40, sb.y + dy));
      w = sb.w + (sb.x - newX);
      h = sb.h + (sb.y - newY);
      x = newX;
      y = newY;
    }

    cropperState.box = { x, y, w, h };
    applyCropBoxStyle();
  };

  const onPointerUp = () => {
    cropperState.dragMode = null;
    cropperState.startBox = null;
  };

  if (wrap) {
    wrap.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    wrap.addEventListener("touchstart", onPointerDown, { passive: false });
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
  }

  // 照片上傳
  const photoInput = document.getElementById("photoInput");
  photoInput.addEventListener("change", (e) => {
    handlePhotoUpload(e.target.files);
    photoInput.value = "";
  });

  // 新增商店按鈕 -> 開啟自訂商店視窗
  document.getElementById("btnAddStore").addEventListener("click", () => {
    openStoreModal("add");
  });

  // 改店名 / 刪除按鈕 -> 開啟自訂商店視窗
  document.getElementById("btnRenameStore").addEventListener("click", () => {
    openStoreModal("edit");
  });

  // 主畫面直接點擊「清空本店資料」
  document
    .getElementById("btnClearStoreData")
    .addEventListener("click", clearCurrentStoreData);

  // 商店視窗內按鈕
  document
    .getElementById("btnCloseStoreModal")
    .addEventListener("click", () => {
      document.getElementById("storeModal").classList.add("hidden");
    });

  document.getElementById("btnSaveStoreName").addEventListener("click", () => {
    const mode = document.getElementById("storeModalMode").value;
    const name = document.getElementById("inputStoreName").value.trim();
    const latVal = parseFloat(document.getElementById("inputStoreLat")?.value);
    const lonVal = parseFloat(document.getElementById("inputStoreLon")?.value);

    if (!name) {
      showToast("請輸入商店名稱！");
      return;
    }
    if (mode === "add") {
      const newStore = {
        id: "store_" + Date.now(),
        name,
        lat: !isNaN(latVal) ? latVal : null,
        lon: !isNaN(lonVal) ? lonVal : null,
        cards: [],
      };
      state.stores.push(newStore);
      state.currentStoreId = newStore.id;
      showToast(`已新增商店「${name}」`);
    } else {
      const store = getCurrentStore();
      store.name = name;
      if (!isNaN(latVal)) store.lat = latVal;
      if (!isNaN(lonVal)) store.lon = lonVal;
      showToast(`店名已更新為「${name}」`);
    }
    saveState();
    document.getElementById("storeModal").classList.add("hidden");
    renderApp();
  });

  // 商店視窗：綁定當前 GPS 位置按鈕
  document
    .getElementById("btnPinCurrentLocationToStore")
    ?.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showToast("此裝置或瀏覽器不支援 GPS 定位");
        return;
      }
      const gpsText = document.getElementById("storeGpsInfoText");
      if (gpsText) gpsText.textContent = "正在抓取目前 GPS 座標...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const latInput = document.getElementById("inputStoreLat");
          const lonInput = document.getElementById("inputStoreLon");
          if (latInput) latInput.value = lat;
          if (lonInput) lonInput.value = lon;
          if (gpsText) {
            gpsText.textContent = `📍 已抓取：${lat.toFixed(4)}, ${lon.toFixed(4)} (按下方儲存確認)`;
          }
          showToast("已抓取目前位置！請按儲存確認");
        },
        (err) => {
          if (gpsText) gpsText.textContent = "無法取得位置：" + err.message;
          showToast("無法取得 GPS 位置，請確認已授權權限");
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });

  document
    .getElementById("btnClearStoreInModal")
    .addEventListener("click", clearCurrentStoreData);

  document
    .getElementById("btnDeleteStoreInModal")
    .addEventListener("click", deleteCurrentStore);

  // 手動記一筆商品
  document.getElementById("btnAddManualItem").addEventListener("click", () => {
    const store = getCurrentStore();
    const firstCardId = store.cards[0] ? store.cards[0].id : null;
    openItemModal(firstCardId, null);
  });

  // 篩選已選購商品
  const filterBtn = document.getElementById("btnFilterSelected");
  filterBtn.addEventListener("click", () => {
    filterSelectedOnly = !filterSelectedOnly;
    filterBtn.dataset.active = String(filterSelectedOnly);
    filterBtn.textContent = filterSelectedOnly
      ? "✓ 只看已選購商品 (點擊顯示全部)"
      : "只看已選購商品";
    renderPhotoCards();
  });

  // 設定視窗
  document
    .getElementById("btnOpenSettings")
    .addEventListener("click", openSettingsModal);
  document.getElementById("btnCloseSettings").addEventListener("click", () => {
    document.getElementById("settingsModal").classList.add("hidden");
  });
  document.getElementById("btnSaveSettings").addEventListener("click", () => {
    state.settings.apiKey = document.getElementById("inputApiKey").value.trim();
    state.settings.exchangeRate =
      parseFloat(document.getElementById("inputExchangeRate").value) || 0.215;
    state.settings.taxFreeThreshold =
      parseInt(document.getElementById("inputTaxFreeThreshold").value, 10) ||
      5000;
    saveState();
    document.getElementById("settingsModal").classList.add("hidden");
    renderApp();
    showToast("設定已儲存");
  });

  // 複製含 API Key 的專屬分享連結（讓其他手機點開自動寫入免重填）
  document
    .getElementById("btnCopyShareLinkWithKey")
    .addEventListener("click", () => {
      const key =
        document.getElementById("inputApiKey").value.trim() ||
        state.settings.apiKey;
      if (!key) {
        showToast("請先在上方輸入 Gemini API Key！");
        return;
      }
      state.settings.apiKey = key;
      saveState();
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?key=${encodeURIComponent(key)}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("已複製專屬連結！傳給其他手機點開即自動綁定金鑰");
      });
    });

  // 重新載入預設 9 張實拍
  document
    .getElementById("btnRestoreDemoPhotos")
    .addEventListener("click", () => {
      showConfirmModal(
        "確定要重新載入資料夾內的 9 張日本藥妝實拍照片與預設商店資料嗎？",
        () => {
          const builtIn = createBuiltInStores();
          state.stores = builtIn;
          state.currentStoreId = builtIn[0].id;
          saveState();
          document.getElementById("settingsModal").classList.add("hidden");
          renderApp();
          showToast("已重新載入 9 張預設實拍");
        }
      );
    });

  // 商品編輯視窗稅率與自動互算
  const untaxedInput = document.getElementById("inputItemUntaxed");
  const taxedInput = document.getElementById("inputItemTaxed");

  document.querySelectorAll(".tax-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      setTaxChipActive(chip.dataset.tax);
      if (untaxedInput.value) {
        taxedInput.value = Math.round(
          Number(untaxedInput.value) * (1 + currentModalTaxRate / 100)
        );
      }
    });
  });

  untaxedInput.addEventListener("input", () => {
    const val = parseFloat(untaxedInput.value);
    if (!isNaN(val)) {
      taxedInput.value = Math.round(val * (1 + currentModalTaxRate / 100));
    }
  });

  taxedInput.addEventListener("input", () => {
    const val = parseFloat(taxedInput.value);
    if (!isNaN(val)) {
      untaxedInput.value = Math.round(val / (1 + currentModalTaxRate / 100));
    }
  });

  document.getElementById("btnCloseItemModal").addEventListener("click", () => {
    document.getElementById("itemModal").classList.add("hidden");
  });

  document
    .getElementById("btnDeleteItemInModal")
    .addEventListener("click", () => {
      const cardId = document.getElementById("editCardId").value;
      const itemId = document.getElementById("editItemId").value;
      if (!cardId || !itemId) return;
      const store = getCurrentStore();
      const card = store.cards.find((c) => c.id === cardId);
      if (!card) return;
      const item = card.items.find((i) => i.id === itemId);
      if (!item) return;
      showConfirmModal(`確定要刪除「${item.name}」這個品項嗎？`, () => {
        card.items = card.items.filter((i) => i.id !== itemId);
        saveState();
        document.getElementById("itemModal").classList.add("hidden");
        renderApp();
        showToast("已刪除品項");
      });
    });

  document.getElementById("btnSaveItem").addEventListener("click", () => {
    const cardId = document.getElementById("editCardId").value;
    const itemId = document.getElementById("editItemId").value;
    const name = document.getElementById("inputItemName").value.trim();
    const compareKey = (document.getElementById("inputItemCompareKey")?.value || "").trim();
    const note = document.getElementById("inputItemNote").value.trim();
    const untaxed = Math.round(
      Number(document.getElementById("inputItemUntaxed").value) || 0
    );
    const taxed = Math.round(
      Number(document.getElementById("inputItemTaxed").value) ||
        Math.round(untaxed * (1 + currentModalTaxRate / 100))
    );

    if (!name) {
      showToast("請輸入商品名稱！");
      return;
    }

    const store = getCurrentStore();
    const card = store.cards.find((c) => c.id === cardId);
    if (!card) return;

    if (itemId) {
      const item = card.items.find((i) => i.id === itemId);
      if (item) {
        item.name = name;
        item.compareKey = compareKey;
        item.note = note;
        item.untaxedPrice = untaxed;
        item.taxedPrice = taxed;
        item.taxRate = currentModalTaxRate;
      }
    } else {
      card.items.push({
        id: "item_" + Date.now(),
        name,
        compareKey,
        note,
        untaxedPrice: untaxed,
        taxedPrice: taxed,
        taxRate: currentModalTaxRate,
        selected: true,
        qty: 1,
      });
    }

    saveState();
    document.getElementById("itemModal").classList.add("hidden");
    renderApp();
    showToast("商品已儲存");
  });

  // 底部購物明細抽屜
  document
    .getElementById("btnToggleCartDetail")
    .addEventListener("click", openCartDrawer);
  document
    .getElementById("btnCloseCartDrawer")
    .addEventListener("click", () => {
      document.getElementById("cartDrawerModal").classList.add("hidden");
    });

  document.getElementById("btnClearSelection").addEventListener("click", () => {
    const store = getCurrentStore();
    showConfirmModal(`確定要清空「${store.name}」所有已勾選的商品嗎？`, () => {
      store.cards.forEach((c) =>
        c.items.forEach((i) => {
          i.selected = false;
          i.qty = 1;
        })
      );
      saveState();
      document.getElementById("cartDrawerModal").classList.add("hidden");
      renderApp();
      showToast("已清空勾選狀態");
    });
  });

  document.getElementById("btnCopySummary").addEventListener("click", () => {
    const store = getCurrentStore();
    const { totalQty, totalUntaxed, totalTaxed } = getStoreTotals(store);
    const lines = [`📒 【${store.name}】採買統計`];
    store.cards.forEach((c) => {
      c.items.forEach((i) => {
        if (i.selected) {
          lines.push(
            `・${i.name} ×${i.qty}｜未稅 ${formatYen(
              i.untaxedPrice * i.qty
            )} / 含稅 ${formatYen(i.taxedPrice * i.qty)}`
          );
        }
      });
    });
    lines.push(`------------------`);
    lines.push(`共 ${totalQty} 件商品`);
    lines.push(`未稅總額：${formatYen(totalUntaxed)} (${formatTwd(totalUntaxed)})`);
    lines.push(`含稅總額：${formatYen(totalTaxed)} (${formatTwd(totalTaxed)})`);

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      showToast("已複製採買明細！");
    });
  });

  // 附近店家定位與推薦視窗
  document.getElementById("btnNearbyStores")?.addEventListener("click", () => detectNearbyStores(false));
  document.getElementById("btnNearbyStoresQuick")?.addEventListener("click", () => detectNearbyStores(false));
  document.getElementById("btnRefreshLocation")?.addEventListener("click", () => detectNearbyStores(true));
  document.getElementById("btnSetOsakaPreset")?.addEventListener("click", () => {
    lastUserLocation = { ...OSAKA_PRESET_LOCATION };
    detectNearbyStores(false);
    showToast("已設定位置為：大阪心齋橋筋與道頓堀交會處");
  });
  document.getElementById("btnCloseNearbyModal")?.addEventListener("click", () => {
    document.getElementById("nearbyStoresModal")?.classList.add("hidden");
  });

  // 跨店最低價比價清單
  document.getElementById("btnFindLowestPrices")?.addEventListener("click", openLowestPriceFinderModal);
  document.getElementById("btnCloseLowestPriceModal")?.addEventListener("click", () => {
    document.getElementById("lowestPriceModal")?.classList.add("hidden");
  });
  document.getElementById("lowestPriceSearchInput")?.addEventListener("input", renderLowestPriceModal);
  document.getElementById("chkOnlyMultiStore")?.addEventListener("change", renderLowestPriceModal);

  // 單一商品跨店比價視窗關閉
  document.getElementById("btnCloseItemCompareModal")?.addEventListener("click", () => {
    document.getElementById("itemCompareModal")?.classList.add("hidden");
  });

  // Lightbox 關閉
  document.getElementById("btnCloseLightbox").addEventListener("click", () => {
    document.getElementById("lightboxModal").classList.add("hidden");
  });
  document.getElementById("lightboxModal").addEventListener("click", (e) => {
    if (e.target.id === "lightboxModal") {
      document.getElementById("lightboxModal").classList.add("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderApp();
  initHighCapacityStorage();
});
