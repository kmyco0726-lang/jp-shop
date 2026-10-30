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
function createBuiltInStores() {
  return [
    {
      id: "store_satudora",
      name: "サツドラ (札幌藥妝)",
      cards: [
        {
          id: "card_8498",
          title: "DHC 護唇膏貨架 (IMG_8498)",
          imageUrl: "./IMG_8498.JPG",
          items: [
            {
              id: "item_8498_1",
              name: "DHC 藥用護唇膏 安妮亞限定款 (アーニャ各種)",
              note: "SPY×FAMILY 聯名款・稅率 10%",
              untaxedPrice: 698,
              taxedPrice: 767,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8498_2",
              name: "DHC 純欖護唇膏 (薬用リップクリーム)",
              note: "1.5g 經典款・お買いヤスイ特價",
              untaxedPrice: 599,
              taxedPrice: 658,
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
              untaxedPrice: 1080,
              taxedPrice: 1188,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8500_2",
              name: "Melano CC 藥用黑斑集中保濕乳霜 (クリーム)",
              note: "手中拿取商品・W維他命滲透 23g",
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
              untaxedPrice: 1080,
              taxedPrice: 1188,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8502_3",
              name: "Melano CC プレミアム美容液 (Premium 特濃版)",
              note: "20ml 進階浸透版",
              untaxedPrice: 1480,
              taxedPrice: 1628,
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
              untaxedPrice: 900,
              taxedPrice: 990,
              taxRate: 10,
              selected: false,
              qty: 1,
            },
            {
              id: "item_8502_6",
              name: "Melano CC 藥用保濕凝露 (ジェル)",
              note: "右下角圓罐裝",
              untaxedPrice: 1100,
              taxedPrice: 1210,
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
          compareKey: "ag_c_30ml",
          items: [
            {
              id: "item_8503_1",
              name: "AG エージーアレルカットC 15ml (清涼型點鼻藥)",
              note: "第2類医薬品・15ml 小瓶",
              compareKey: "ag_allercut_c_15",
              untaxedPrice: 1480,
              taxedPrice: 1628,
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
      ],
    },
    {
      id: "store_daikoku",
      name: "ダイコクドラッグ (大國藥妝)",
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

// 跨店比價確定性輔助函式：找出其他商店是否有同名或相同 compareKey 的商品
function findCrossStoreComparison(currentItem, currentStoreId) {
  const normCurrent = normalizeProductName(currentItem);
  if (!normCurrent) return null;

  let bestMatch = null;
  for (const store of state.stores) {
    if (store.id === currentStoreId) continue;
    for (const card of store.cards) {
      for (const item of card.items) {
        const normOther = normalizeProductName(item);
        if (normOther && normOther === normCurrent) {
          if (
            !bestMatch ||
            item.untaxedPrice < bestMatch.item.untaxedPrice
          ) {
            bestMatch = { storeName: store.name, item };
          }
        }
      }
    }
  }
  if (!bestMatch) return null;

  const diff = currentItem.untaxedPrice - bestMatch.item.untaxedPrice;
  if (diff === 0) {
    return {
      type: "same",
      text: `與 ${bestMatch.storeName} 同價`,
    };
  } else if (diff < 0) {
    return {
      type: "cheaper",
      text: `★ 比 ${bestMatch.storeName} 便宜 ¥${Math.abs(diff)}`,
    };
  } else {
    return {
      type: "pricier",
      text: `⚠️ ${bestMatch.storeName} 賣 ¥${bestMatch.item.untaxedPrice} (省 ¥${diff})`,
    };
  }
}

function normalizeProductName(item) {
  if (item.compareKey) return item.compareKey;
  if (!item.name) return "";
  return item.name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[（）()・]/g, "");
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

    cardEl.innerHTML = `
      <div class="photo-card-header">
        ${thumbHtml}
        <div class="photo-meta">
          <div class="photo-title-row">
            <h2 class="photo-title">${escapeHtml(card.title)}</h2>
          </div>
          <p class="photo-hint">點擊下方商品即可勾選加入本店購物籃（共 ${card.items.length} 項）</p>
          <div class="photo-card-actions">
            <button class="mini-btn btn-add-subitem" data-card-id="${card.id}">＋ 新增此圖商品</button>
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
      const compareBadgeHtml =
        comparison && comparison.type !== "same"
          ? `<span class="compare-badge ${comparison.type}">${escapeHtml(comparison.text)}</span>`
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
      `;

      // 點擊卡片主體切換勾選
      itemEl.addEventListener("click", (e) => {
        if (
          e.target.closest(".qty-controls") ||
          e.target.closest(".item-action-btns")
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

// 影像壓縮與 Base64 轉換（避免手機原圖塞爆 LocalStorage 與加快 API 傳輸）
function compressImageFile(file, maxDim = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
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
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 將網址或本地圖片轉為 Base64 供 AI 重新辨識使用
async function imageUrlToBase64(url) {
  if (url.startsWith("data:image/")) {
    return url.split(",")[1];
  }
  const resp = await fetch(url);
  const blob = await resp.blob();
  const dataUrl = await compressImageFile(blob, 1280, 0.82);
  return dataUrl.split(",")[1];
}

let currentAiAbortController = null;

// 帶超時與手動取消支援的 fetch
async function fetchWithTimeout(url, options = {}, timeoutMs = 18000) {
  const controller = new AbortController();
  currentAiAbortController = controller;
  const timer = setTimeout(() => controller.abort(new Error("TIMEOUT")), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    if (currentAiAbortController === controller) {
      currentAiAbortController = null;
    }
  }
}

// 從 Gemini 回傳結構中安全提取 JSON（自動跳過 Gemini 2.5/3 的 thought 思考段落）
function extractJsonFromGeminiResult(result) {
  const parts = result?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) return {};

  // 優先取非 thought 的最後一個文字段落
  const nonThoughtParts = parts.filter((p) => !p.thought && typeof p.text === "string");
  const candidateTexts =
    nonThoughtParts.length > 0
      ? nonThoughtParts.map((p) => p.text).reverse()
      : parts.filter((p) => typeof p.text === "string").map((p) => p.text).reverse();

  for (const raw of candidateTexts) {
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch (_) {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
        } catch (_2) {}
      }
    }
  }
  return {};
}

// 動態查詢該 API Key 可用的最新 Gemini Vision 模型
async function fetchAvailableGeminiModel(apiKey) {
  try {
    const resp = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        apiKey
      )}`,
      {},
      5000
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    const models = Array.isArray(data.models) ? data.models : [];
    const supported = models
      .filter(
        (m) =>
          Array.isArray(m.supportedGenerationMethods) &&
          m.supportedGenerationMethods.includes("generateContent")
      )
      .map((m) => String(m.name || "").replace(/^models\//, ""));

    // 優先選擇最新數字版本 flash 模型（避免選到慢速 thinking preview 或 tts/image 模型）
    const flashCandidates = supported.filter(
      (n) =>
        n.includes("flash") &&
        !n.includes("8b") &&
        !n.includes("tts") &&
        !n.includes("image") &&
        !n.includes("thinking")
    );
    if (flashCandidates.length > 0) {
      // 取列表中排序較新（通常在後方）的穩定 flash 模型
      return flashCandidates[flashCandidates.length - 1];
    }
    return supported.find((n) => n.includes("gemini")) || null;
  } catch (_) {
    return null;
  }
}

// 呼叫 Gemini Vision API 辨識貨架上的多個商品與未稅/含稅價（具備進度顯示、超時保護與 404 自動切換模型）
async function analyzeShelfImageWithGemini(base64Data, onStatusUpdate) {
  const apiKey = (state.settings.apiKey || "").trim();
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const promptText = `請辨識這張日本商店貨架照片中的所有商品與標價，直接回傳 JSON：
{"photoTitle":"貨架簡短主題","items":[{"name":"日文原名與中文簡稱","note":"容量或規格","untaxedPrice":未稅日幣整數,"taxedPrice":含稅日幣整數,"taxRate":10或8}]}`;

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

  // 先快速查詢帳號可用模型（若尚未快取），避免盲目上傳圖片到 404 模型浪費時間
  if (!state.settings.preferredModel) {
    if (onStatusUpdate) onStatusUpdate("正在自動偵測您的金鑰支援的最快模型...");
    const discoveredFirst = await fetchAvailableGeminiModel(apiKey);
    if (discoveredFirst) {
      state.settings.preferredModel = discoveredFirst;
      saveState();
    }
  }

  const candidateModels = [];
  if (state.settings.preferredModel) {
    candidateModels.push(state.settings.preferredModel);
  }
  for (const m of [
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash",
  ]) {
    if (!candidateModels.includes(m)) candidateModels.push(m);
  }

  let lastStatus = 0;
  let lastErrorText = "";

  for (let i = 0; i < candidateModels.length; i++) {
    const modelName = candidateModels[i];
    if (onStatusUpdate) {
      onStatusUpdate(`正在用 AI (${modelName}) 辨識商品與未稅/含稅價...`);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const response = await fetchWithTimeout(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      },
      20000
    );

    if (response.ok) {
      if (state.settings.preferredModel !== modelName) {
        state.settings.preferredModel = modelName;
        saveState();
      }
      const result = await response.json();
      return extractJsonFromGeminiResult(result);
    }

    lastStatus = response.status;
    lastErrorText = await response.text();

    if (response.status !== 404) {
      break;
    }

    // 從 Google 404 訊息中自動擷取建議的新模型名稱（例如 "use models/gemini-xxx"）
    const suggestedMatch = lastErrorText.match(/models\/([a-zA-Z0-9._-]+)/g);
    if (suggestedMatch) {
      for (const raw of suggestedMatch) {
        const cleanName = raw.replace(/^models\//, "");
        if (cleanName && !candidateModels.includes(cleanName)) {
          candidateModels.splice(i + 1, 0, cleanName);
        }
      }
    }
  }

  throw new Error(`Gemini API (${lastStatus}): ${lastErrorText.slice(0, 180)}`);
}

// 處理使用者上傳新照片（先秒建照片卡片，再背景執行 AI 辨識，絕不卡死畫面）
async function handlePhotoUpload(files) {
  if (!files || files.length === 0) return;
  const store = getCurrentStore();
  const banner = document.getElementById("aiLoadingBanner");
  const loadingText = document.getElementById("aiLoadingText");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    banner.classList.remove("hidden");
    loadingText.textContent = `正在壓縮處理第 ${i + 1} / ${files.length} 張照片...`;

    const newCardId = "card_" + Date.now() + "_" + i;
    let newCard = null;
    let elapsedTimer = null;

    try {
      // 1. 卡片顯示用縮圖 (1024px) 與 AI 快速傳輸用輕量圖 (800px，大幅加快行動網路上傳速度)
      const dataUrl = await compressImageFile(file, 1024, 0.78);
      const aiDataUrl = await compressImageFile(file, 800, 0.7);
      const base64Data = aiDataUrl.split(",")[1];

      // 2. 立即把照片卡片放到畫面上，不等 AI 回應就能先看到照片！
      newCard = {
        id: newCardId,
        title: `新上傳貨架 (${file.name})`,
        imageUrl: dataUrl,
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

      // 3. 啟動秒數計時顯示，讓使用者清楚看到進度並可隨時點「略過 AI」
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

      const items = Array.isArray(parsed.items)
        ? parsed.items.map((it, idx) => ({
            id: `item_${Date.now()}_${idx}`,
            name: it.name || "未命名商品",
            note: it.note || "",
            untaxedPrice: Math.round(Number(it.untaxedPrice) || 0),
            taxedPrice: Math.round(
              Number(it.taxedPrice) ||
                Math.round((Number(it.untaxedPrice) || 0) * 1.1)
            ),
            taxRate: Number(it.taxRate) === 8 ? 8 : 10,
            selected: false,
            qty: 1,
          }))
        : [];

      newCard.title = parsed.photoTitle || newCard.title;
      newCard.items = items;
      saveState();
      renderApp();
      showToast(
        items.length > 0
          ? `✨ 成功辨識出 ${items.length} 項商品！`
          : "照片已加入（未偵測到標價，可點下方新增品項）"
      );
    } catch (err) {
      console.error(err);
      if (err.name === "AbortError" || String(err.message).includes("USER_CANCEL")) {
        showToast("已略過 AI 辨識，請手動輸入商品價格");
        if (newCard) openItemModal(newCard.id, null);
      } else if (String(err.message).includes("TIMEOUT")) {
        showToast("AI 回應逾時 (超過20秒)，照片已保留，可點「✨ AI 重新辨識」或手動新增");
      } else {
        showToast(`照片已保留，AI 辨識失敗：${err.message}`);
      }
    } finally {
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
      card.items = parsed.items.map((it, idx) => ({
        id: `item_${Date.now()}_${idx}`,
        name: it.name || "商品",
        note: it.note || "",
        untaxedPrice: Math.round(Number(it.untaxedPrice) || 0),
        taxedPrice: Math.round(Number(it.taxedPrice) || 0),
        taxRate: Number(it.taxRate) === 8 ? 8 : 10,
        selected: false,
        qty: 1,
      }));
      saveState();
      renderApp();
      showToast(`✨ 重新辨識完成，共 ${card.items.length} 項商品！`);
    } else {
      showToast("AI 未在照片中找到明確標價，可點選「＋ 新增這張照片的品項」");
    }
  } catch (err) {
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

  modeInput.value = mode;
  if (mode === "add") {
    titleEl.textContent = "＋ 新增商店";
    nameInput.value = "";
    dangerZone.classList.add("hidden");
  } else {
    const store = getCurrentStore();
    titleEl.textContent = `🏪 管理商店：${store.name}`;
    nameInput.value = store.name;
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
      if (currentAiAbortController) {
        currentAiAbortController.abort(new Error("USER_CANCEL"));
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
    if (!name) {
      showToast("請輸入商店名稱！");
      return;
    }
    if (mode === "add") {
      const newStore = {
        id: "store_" + Date.now(),
        name,
        cards: [],
      };
      state.stores.push(newStore);
      state.currentStoreId = newStore.id;
      showToast(`已新增商店「${name}」`);
    } else {
      const store = getCurrentStore();
      store.name = name;
      showToast(`店名已更新為「${name}」`);
    }
    saveState();
    document.getElementById("storeModal").classList.add("hidden");
    renderApp();
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
        item.note = note;
        item.untaxedPrice = untaxed;
        item.taxedPrice = taxed;
        item.taxRate = currentModalTaxRate;
      }
    } else {
      card.items.push({
        id: "item_" + Date.now(),
        name,
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
