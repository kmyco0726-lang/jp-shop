/**
 * 旅途採買手帳 - 日本藥妝團購喊單與許願本
 * 包含：個人帳號管理、現場即時喊單 +1、許願商品區(已購入跳轉)、回國分帳統計
 */

const GROUPBUY_STORAGE_KEY = "jp_travel_groupbuy_state_v1";

const DEFAULT_STATE = {
  currentUserId: "user_leader",
  settings: {
    exchangeRate: 0.215,
  },
  users: [
    { id: "user_leader", name: "品方", avatar: "👑", role: "leader" },
    { id: "user_flower", name: "小花", avatar: "🌸", role: "member" },
    { id: "user_ming", name: "阿明", avatar: "🍙", role: "member" },
  ],
  posts: [
    {
      id: "post_sample_1",
      authorId: "user_leader",
      authorName: "品方",
      title: "DHC 速攻藍莓 20日分 (40粒)",
      priceYen: 980,
      stockLimit: 6,
      store: "ダイコクドラッグ 道頓堀店 (大國藥妝)",
      note: "現場架上有現貨，常看螢幕必備！清涼眼藥水旁邊。",
      imageUrl: "./IMG_8504.JPG",
      createdAt: "2026-11-03 10:15",
      orders: [
        {
          id: "ord_1",
          userId: "user_flower",
          userName: "小花",
          userAvatar: "🌸",
          qty: 1,
          bought: false,
          boughtPriceYen: 980,
          boughtAt: null,
        },
        {
          id: "ord_2",
          userId: "user_ming",
          userName: "阿明",
          userAvatar: "🍙",
          qty: 2,
          bought: false,
          boughtPriceYen: 980,
          boughtAt: null,
        },
      ],
    },
  ],
  wishes: [
    {
      id: "wish_sample_1",
      userId: "user_flower",
      userName: "小花",
      userAvatar: "🌸",
      title: "DHC 速攻藍莓 20日分 (40粒)",
      qty: 1,
      targetPriceYen: null,
      note: "上班看電腦眼睛乾，希望能買 1 包！",
      imageUrl: "./IMG_8504.JPG",
      status: "pending",
      boughtPriceYen: null,
      boughtStore: null,
      fromPostId: null,
      createdAt: "2026-11-02 21:00",
    },
    {
      id: "wish_sample_2",
      userId: "user_ming",
      userName: "阿明",
      userAvatar: "🍙",
      title: "EVE QUICK DX 頭痛藥 40錠",
      qty: 1,
      targetPriceYen: null,
      note: "藍金盒裝加強款，常偏頭痛必備",
      imageUrl: "./IMG_8508.JPG",
      status: "pending",
      boughtPriceYen: null,
      boughtStore: null,
      fromPostId: null,
      createdAt: "2026-11-02 22:30",
    },
  ],
  payments: {
    user_flower: { isPaid: true, paidAt: "2026-11-03 12:00" },
    user_ming: { isPaid: false, paidAt: null },
  },
  sync: {
    roomId: "osaka_groupbuy_notebook",
    firebaseDbUrl: "",
  },
  deletedPostIds: [],
  deletedWishIds: [],
  deletedUserIds: [],
};

let state = loadGroupbuyState();
let currentWishFilter = { userId: "all", status: "all" };
let tempPostImageData = "";
let tempWishImageData = "";
let activeConfirmPost = null;
let mqttClient = null;
let isRealtimeConnected = false;

// ==========================================
// 狀態持久化
// ==========================================
function loadGroupbuyState() {
  try {
    const raw = localStorage.getItem(GROUPBUY_STORAGE_KEY);
    let loaded = DEFAULT_STATE;
    if (raw) {
      const parsed = JSON.parse(raw);
      loaded = {
        ...DEFAULT_STATE,
        ...parsed,
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        users: parsed.users || DEFAULT_STATE.users,
        posts: parsed.posts || DEFAULT_STATE.posts,
        wishes: parsed.wishes || DEFAULT_STATE.wishes,
        payments: parsed.payments || DEFAULT_STATE.payments,
        sync: { ...DEFAULT_STATE.sync, ...(parsed.sync || {}) },
        deletedPostIds: parsed.deletedPostIds || [],
        deletedWishIds: parsed.deletedWishIds || [],
        deletedUserIds: parsed.deletedUserIds || [],
      };
      // 確保已刪除項目不會因快照殘留而復活
      if (Array.isArray(loaded.deletedPostIds) && loaded.deletedPostIds.length > 0) {
        loaded.posts = loaded.posts.filter((p) => !loaded.deletedPostIds.includes(p.id));
      }
      if (Array.isArray(loaded.deletedWishIds) && loaded.deletedWishIds.length > 0) {
        loaded.wishes = loaded.wishes.filter((w) => !loaded.deletedWishIds.includes(w.id));
      }
      if (Array.isArray(loaded.deletedUserIds) && loaded.deletedUserIds.length > 0) {
        loaded.users = loaded.users.filter((u) => !loaded.deletedUserIds.includes(u.id));
      }
    }

    // 檢查網址是否有自訂房號或 Firebase (例如 ?room=osaka2026&db=...)
    if (typeof window !== "undefined" && window.location && window.location.search) {
      const p = new URLSearchParams(window.location.search);
      if (p.get("room")) loaded.sync.roomId = p.get("room").trim();
      if (p.get("db")) loaded.sync.firebaseDbUrl = p.get("db").trim();
    }
    return loaded;
  } catch (err) {
    console.error("載入團購狀態失敗，使用預設值", err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveGroupbuyState() {
  try {
    localStorage.setItem(GROUPBUY_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("儲存團購狀態失敗", err);
    showToast("⚠️ 儲存空間已滿或發生錯誤");
  }
}

function getCurrentUser() {
  return state.users.find((u) => u.id === state.currentUserId) || state.users[0];
}

// ==========================================
// 初始化與 DOM 綁定
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
  bindGlobalEvents();
  initRealtimeSync();
});

function renderApp() {
  renderHeaderUser();
  renderLivePosts();
  renderWishlist();
  renderShoppingList();
  renderSettlement();
  updateBadgeCounts();
}

// 渲染頂部當前使用者身分
function renderHeaderUser() {
  const user = getCurrentUser();
  document.getElementById("currentUserAvatar").textContent = user.avatar || "👤";
  document.getElementById("currentUserName").textContent = user.name;
  const roleEl = document.getElementById("currentUserRole");
  if (user.role === "leader") {
    roleEl.textContent = "團主";
    roleEl.className = "user-role-tag leader";
  } else {
    roleEl.textContent = "團友";
    roleEl.className = "user-role-tag member";
  }

  // 許願彈窗的作者預設顯示
  const authorDisplay = document.getElementById("wishAuthorDisplay");
  if (authorDisplay) {
    authorDisplay.textContent = `${user.avatar} ${user.name}`;
  }
}

// 更新分頁上的徽章計數
function updateBadgeCounts() {
  const liveCountEl = document.getElementById("badgeLiveCount");
  const wishCountEl = document.getElementById("badgeWishCount");
  const shoppingCountEl = document.getElementById("badgeShoppingCount");

  if (liveCountEl) liveCountEl.textContent = state.posts.length;
  if (wishCountEl) {
    const pendingWishes = state.wishes.filter((w) => w.status === "pending").length;
    wishCountEl.textContent = pendingWishes;
  }
  if (shoppingCountEl) {
    // 統計團主待採購總數量 (待採購許願 + 現場連線未採購喊單)
    let totalPendingQty = 0;
    state.wishes.filter((w) => w.status === "pending").forEach((w) => (totalPendingQty += w.qty || 1));
    state.posts.forEach((p) => {
      (p.orders || []).filter((o) => !o.bought).forEach((o) => (totalPendingQty += o.qty || 1));
    });
    shoppingCountEl.textContent = totalPendingQty;
  }
}

// ==========================================
// TAB 1: 現場即時喊單 (Live Drop)
// ==========================================
function renderLivePosts() {
  const container = document.getElementById("livePostsContainer");
  if (!container) return;
  container.innerHTML = "";

  if (state.posts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 10px; color: var(--ink-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">📷</div>
        <p>目前現場還沒有連線喊單貼文</p>
        <p style="font-size:0.8rem;">團主可點擊上方「📷 團主拍照發起喊單」開始連線！</p>
      </div>
    `;
    return;
  }

  const currentUser = getCurrentUser();
  const isLeader = currentUser.role === "leader";

  state.posts.forEach((post) => {
    const postEl = document.createElement("article");
    postEl.className = "live-post-card";
    postEl.dataset.postId = post.id;

    // 計算總喊單件數與剩餘配額
    const totalOrderedQty = (post.orders || []).reduce((sum, o) => sum + o.qty, 0);
    const boughtOrders = (post.orders || []).filter((o) => o.bought);
    const totalBoughtQty = boughtOrders.reduce((sum, o) => sum + o.qty, 0);

    const priceTwd = Math.round(post.priceYen * state.settings.exchangeRate);

    // 檢查當前使用者是否已經喊過單
    const myOrder = (post.orders || []).find((o) => o.userId === currentUser.id);

    // 喊單人 Chips 列表
    const ordersChipsHtml = (post.orders || []).length > 0
      ? post.orders
          .map((ord) => `
            <span class="order-user-chip ${ord.bought ? "bought" : ""}">
              <span>${escapeHtml(ord.userAvatar)} ${escapeHtml(ord.userName)}</span>
              <span class="qty-badge">+${ord.qty}</span>
              ${ord.bought ? `<span class="bought-stamp">✓已購</span>` : ""}
            </span>
          `)
          .join("")
      : `<span class="no-orders-hint">尚未有人喊單，快來當第一個 +1！</span>`;

    postEl.innerHTML = `
      <div class="live-post-header">
        <div class="post-author-info">
          <span>${escapeHtml(post.authorName)} 正在連線</span>
          <span class="post-time">${escapeHtml(post.createdAt || "")}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          ${post.store ? `<span class="post-store-badge">📍 ${escapeHtml(post.store)}</span>` : ""}
          ${
            isLeader
              ? `<button type="button" class="btn-delete-post" data-post-id="${post.id}" title="團主刪除此即時連線商品">
                  🗑️ 刪除
                </button>`
              : ""
          }
        </div>
      </div>

      ${
        post.imageUrl
          ? `
        <div class="post-visual-box" data-img-url="${escapeHtml(post.imageUrl)}">
          <img src="${escapeHtml(post.imageUrl)}" alt="${escapeHtml(post.title)}" class="post-image" loading="lazy" />
          <span class="zoom-hint">🔍 點擊看大圖</span>
        </div>
      `
          : ""
      }

      <div class="post-body">
        <div class="post-title-row">
          <h3 class="post-title">${escapeHtml(post.title)}</h3>
          <div class="post-price-badge">
            <div class="post-price-yen">¥${post.priceYen.toLocaleString("ja-JP")}</div>
            <div class="post-price-twd">約 NT$ ${priceTwd}</div>
          </div>
        </div>

        ${post.note ? `<div class="post-note-text">📝 ${escapeHtml(post.note)}</div>` : ""}

        <div class="post-stock-info">
          <span>已喊單：<strong>${totalOrderedQty} 件</strong></span>
          <span>已購入：<strong>${totalBoughtQty} 件</strong></span>
          ${
            post.stockLimit
              ? `<span class="stock-tag ${totalOrderedQty >= post.stockLimit ? "limited" : ""}">
                  現貨限量：${post.stockLimit} 件
                </span>`
              : `<span class="stock-tag">現貨充足</span>`
          }
        </div>

        <!-- 喊單成員名單 -->
        <div class="post-orders-section">
          <div class="orders-header">
            <span>🙋 喊單名單（共 ${totalOrderedQty} 件）</span>
          </div>
          <div class="orders-chips-list">
            ${ordersChipsHtml}
          </div>
        </div>

        <!-- 操作工具列 (超醒目現場喊單 CTA) -->
        <div class="post-action-toolbar">
          <div class="order-cta-box">
            ${
              myOrder
                ? `
              <div class="my-order-status-banner ${myOrder.bought ? "is-bought-locked" : ""}">
                <span>
                  ${myOrder.bought ? "🔒 團主現場已購入" : "✅ 你已喊單"} 
                  <strong>${myOrder.qty} 件</strong> 
                  ${myOrder.bought ? "(已買進菜籃✓)" : "(待買入)"}
                </span>
                ${
                  !myOrder.bought
                    ? `<button type="button" class="btn-cancel-order btn-order-cancel" data-post-id="${post.id}">✕ 取消喊單</button>`
                    : `<span class="locked-hint" title="團主已在現場確認購入，團員無法取消喊單">不可取消</span>`
                }
              </div>
            `
                : ""
            }
            <div class="order-buttons-group">
              <button type="button" class="btn-call-order btn-order-plus1" data-post-id="${post.id}" data-qty="1">
                🙋 我要 +1
              </button>
              <button type="button" class="btn-call-order btn-order-plus2" data-post-id="${post.id}" data-qty="2">
                🔥 +2
              </button>
            </div>
          </div>

          ${
            isLeader
              ? `
            <div class="leader-action-row">
              <button type="button" class="btn-purchase-confirm btn-open-purchase-modal" data-post-id="${post.id}">
                🛒 團主確認購入此貼文
              </button>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;

    // 綁定大圖放大
    const visualBox = postEl.querySelector(".post-visual-box");
    if (visualBox) {
      visualBox.addEventListener("click", () => {
        openLightbox(post.imageUrl);
      });
    }

    // 綁定 +1 / +2
    postEl.querySelectorAll(".btn-call-order").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qty = parseInt(btn.dataset.qty, 10) || 1;
        handlePlaceOrder(post.id, qty);
      });
    });

    // 綁定取消喊單
    const cancelBtn = postEl.querySelector(".btn-order-cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        handleCancelOrder(post.id);
      });
    }

    // 綁定團主刪除此貼文
    const delPostBtn = postEl.querySelector(".btn-delete-post");
    if (delPostBtn) {
      delPostBtn.addEventListener("click", () => {
        handleDeleteLivePost(post.id);
      });
    }

    // 綁定團主確認購入彈窗
    const purchaseBtn = postEl.querySelector(".btn-open-purchase-modal");
    if (purchaseBtn) {
      purchaseBtn.addEventListener("click", () => {
        openConfirmPurchaseModal(post);
      });
    }

    container.appendChild(postEl);
  });
}

// 處理成員喊單 (+1 / +2)
function handlePlaceOrder(postId, addQty) {
  const post = state.posts.find((p) => p.id === postId);
  if (!post) return;
  const user = getCurrentUser();

  if (!post.orders) post.orders = [];
  const existingOrder = post.orders.find((o) => o.userId === user.id);

  if (existingOrder) {
    existingOrder.qty += addQty;
  } else {
    const newOrd = {
      id: "ord_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      qty: addQty,
      bought: false,
      boughtPriceYen: post.priceYen,
      boughtAt: null,
    };
    post.orders.push(newOrd);
  }

  const currentOrder = post.orders.find((o) => o.userId === user.id);
  // 即時跨手機廣播喊單
  broadcastSyncEvent("CHANGE_ORDER", { postId, order: currentOrder });

  saveGroupbuyState();
  renderLivePosts();
  renderSettlement();
  showToast(`🎉 ${user.name} 已成功喊單 +${addQty}！`);
}

// 取消當前成員喊單 (嚴格防護：若團主已在現場確認購入，團員無法取消！)
function handleCancelOrder(postId) {
  const post = state.posts.find((p) => p.id === postId);
  if (!post || !post.orders) return;
  const user = getCurrentUser();

  const idx = post.orders.findIndex((o) => o.userId === user.id);
  if (idx !== -1) {
    if (post.orders[idx].bought) {
      alert("⚠️ 此商品團主已在現場確認購入並放入購物籃，團員無法取消喊單！如需協調請直接向團主反映。");
      return;
    }
    const removedOrder = post.orders[idx];
    post.orders.splice(idx, 1);
    broadcastSyncEvent("CHANGE_ORDER", { postId, order: { ...removedOrder, qty: 0, removed: true } });
    saveGroupbuyState();
    renderLivePosts();
    renderShoppingList();
    renderSettlement();
    showToast(`已取消 ${user.name} 的喊單`);
  }
}

// 團主刪除即時連線貼文 (若已有人喊單需彈窗詳細提醒)
function handleDeleteLivePost(postId) {
  const post = state.posts.find((p) => p.id === postId);
  if (!post) return;

  const orders = post.orders || [];
  const totalQty = orders.reduce((sum, o) => sum + (o.qty || 0), 0);
  const memberNames = [...new Set(orders.map((o) => `${o.userAvatar || ""}${o.userName}`))];

  // 若已有人喊單，彈出詳細警告提醒
  if (orders.length > 0 && totalQty > 0) {
    const warningMsg =
      `⚠️【警告】此商品目前已有團友喊單！\n\n` +
      `📦 喊單總計：共 ${totalQty} 件\n` +
      `👥 喊單成員：${memberNames.join("、")}\n\n` +
      `若刪除此即時連線，上述成員的喊單紀錄將會一併被取消，且不會計入回國分帳！\n\n` +
      `確定仍要刪除「${post.title}」這篇現場連線嗎？`;

    const confirmed = confirm(warningMsg);
    if (!confirmed) return;
  } else {
    const confirmed = confirm(`確定要刪除「${post.title}」這篇現場連線貼文嗎？`);
    if (!confirmed) return;
  }

  // 執行刪除貼文並記錄墓碑標記，防止雲端同步或重整時復活
  state.posts = state.posts.filter((p) => p.id !== postId);
  if (!state.deletedPostIds) state.deletedPostIds = [];
  if (!state.deletedPostIds.includes(postId)) {
    state.deletedPostIds.push(postId);
  }

  // 跨手機即時廣播刪除事件
  broadcastSyncEvent("DELETE_POST", {
    postId,
    postTitle: post.title,
  });

  saveGroupbuyState();
  renderApp();
  showToast(`已成功刪除連線商品「${post.title}」`);
}

// 打開確認購入彈窗
function openConfirmPurchaseModal(post) {
  activeConfirmPost = post;
  const modal = document.getElementById("modalConfirmPurchase");
  const summaryEl = document.getElementById("confirmPurchaseProductSummary");
  const listEl = document.getElementById("confirmOrdersListContainer");

  summaryEl.innerHTML = `
    <div style="font-size:1.05rem; font-weight:700; color:var(--ink-main);">${escapeHtml(post.title)}</div>
    <div style="font-size:0.85rem; color:var(--accent-terracotta); font-weight:700; margin-top:2px;">
      現場標價：¥${post.priceYen.toLocaleString("ja-JP")} (約 NT$ ${Math.round(post.priceYen * state.settings.exchangeRate)})
    </div>
  `;

  listEl.innerHTML = "";
  if (!post.orders || post.orders.length === 0) {
    listEl.innerHTML = `<div style="text-align:center; color:var(--ink-muted); padding:20px;">尚無成員喊單</div>`;
  } else {
    post.orders.forEach((ord) => {
      const itemEl = document.createElement("div");
      itemEl.className = `confirm-order-item ${ord.bought ? "already-bought" : ""}`;
      itemEl.innerHTML = `
        <label class="order-checkbox-label">
          <input type="checkbox" class="order-select-chk" data-order-id="${ord.id}" ${ord.bought ? "checked" : "checked"} />
          <span>${escapeHtml(ord.userAvatar)} <strong>${escapeHtml(ord.userName)}</strong> (喊單 ${ord.qty} 件)</span>
        </label>
        <div>
          ${ord.bought ? `<span class="badge" style="background:#cce8d3; color:#27643b; font-size:0.75rem; padding:2px 6px; border-radius:4px;">已購入</span>` : `<span style="font-size:0.75rem; color:var(--ink-muted);">待確認</span>`}
        </div>
      `;
      listEl.appendChild(itemEl);
    });
  }

  modal.classList.remove("hidden");
}

// 執行確認購入，核心聯動：自動移至各成員個人許願專區的「已購入」
function executePurchase() {
  if (!activeConfirmPost) return;
  const modal = document.getElementById("modalConfirmPurchase");
  const checkboxes = modal.querySelectorAll(".order-select-chk");
  const post = activeConfirmPost;

  let newlyBoughtUsers = [];

  checkboxes.forEach((chk) => {
    const orderId = chk.dataset.orderId;
    const isChecked = chk.checked;
    const order = post.orders.find((o) => o.id === orderId);
    if (!order) return;

    if (isChecked) {
      order.bought = true;
      order.boughtPriceYen = post.priceYen;
      order.boughtAt = new Date().toLocaleString("zh-TW", { hour12: false });

      // ⭐ 核心聯動：將商品同步/移至該成員的個人許願專區「已購入」清單
      syncOrderToWishlistBought(order, post);
      newlyBoughtUsers.push(order.userName);
    }
  });

  const boughtOrderIds = (post.orders || []).filter((o) => o.bought).map((o) => o.id);
  // 即時跨手機廣播確認購入事件
  broadcastSyncEvent("CONFIRM_PURCHASE", {
    postId: post.id,
    boughtOrderIds,
    postTitle: post.title,
    boughtPriceYen: post.priceYen,
  });

  saveGroupbuyState();
  modal.classList.add("hidden");
  renderApp();

  if (newlyBoughtUsers.length > 0) {
    showToast(`✅ 已確認購入！已自動移至 [${newlyBoughtUsers.join("、")}] 的個人許願池已購入專區！`);
  }
}

// 將喊單確認購入的商品寫入個人許願專區「已購入」
function syncOrderToWishlistBought(order, post) {
  // 檢查該使用者是否在願望清單中已有相同商品
  const userWishes = state.wishes.filter((w) => w.userId === order.userId);
  const matchedWish = userWishes.find(
    (w) =>
      w.fromPostId === post.id ||
      w.title.trim().toLowerCase() === post.title.trim().toLowerCase()
  );

  if (matchedWish) {
    matchedWish.status = "bought";
    matchedWish.boughtPriceYen = post.priceYen;
    matchedWish.boughtStore = post.store || "日本藥妝店";
    matchedWish.imageUrl = post.imageUrl || matchedWish.imageUrl;
    matchedWish.qty = order.qty;
  } else {
    // 新增一筆已購入許願
    state.wishes.unshift({
      id: "wish_from_post_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      userId: order.userId,
      userName: order.userName,
      userAvatar: order.userAvatar,
      title: post.title,
      qty: order.qty,
      targetPriceYen: post.priceYen,
      note: `由現場連線喊單購入 (店鋪: ${post.store || "日本實體店"})`,
      imageUrl: post.imageUrl || "",
      status: "bought",
      boughtPriceYen: post.priceYen,
      boughtStore: post.store || "日本實體店",
      fromPostId: post.id,
      createdAt: new Date().toLocaleString("zh-TW", { hour12: false }),
    });
  }
}

// ==========================================
// TAB 2: 個人許願商品專區 (Wishlist)
// ==========================================
function renderWishlist() {
  const container = document.getElementById("wishlistContainer");
  const userFilterSelect = document.getElementById("wishlistUserFilter");
  if (!container || !userFilterSelect) return;

  // 更新使用者下拉選單
  const currentSelectVal = userFilterSelect.value || "all";
  userFilterSelect.innerHTML = `<option value="all">👥 全體成員的許願池</option>`;
  state.users.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = `${u.avatar} ${u.name} 的許願清單`;
    userFilterSelect.appendChild(opt);
  });
  userFilterSelect.value = currentSelectVal;

  // 過濾項目
  let filtered = [...state.wishes];
  if (currentWishFilter.userId !== "all") {
    filtered = filtered.filter((w) => w.userId === currentWishFilter.userId);
  }
  if (currentWishFilter.status !== "all") {
    filtered = filtered.filter((w) => w.status === currentWishFilter.status);
  }

  container.innerHTML = "";
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px 10px; color:var(--ink-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🌟</div>
        <p>目前沒有符合條件的許願商品</p>
        <p style="font-size:0.8rem;">點擊上方「➕ 我要許願商品」上傳你想買的日本商品吧！</p>
      </div>
    `;
    return;
  }

  const currentUser = getCurrentUser();
  const isLeader = currentUser.role === "leader";

  filtered.forEach((wish) => {
    const cardEl = document.createElement("div");
    cardEl.className = `wish-card status-${wish.status}`;
    cardEl.dataset.wishId = wish.id;

    const isMine = wish.userId === currentUser.id;
    const isBought = wish.status === "bought";

    cardEl.innerHTML = `
      <div class="wish-photo-box" data-img-url="${escapeHtml(wish.imageUrl || "")}">
        ${
          wish.imageUrl
            ? `<img src="${escapeHtml(wish.imageUrl)}" alt="${escapeHtml(wish.title)}" loading="lazy" />`
            : `<div class="wish-no-photo">🛍️</div>`
        }
      </div>

      <div class="wish-card-top-bar">
        <div class="wish-author-row">
          <span>${escapeHtml(wish.userAvatar || "👤")}</span>
          <strong>${escapeHtml(wish.userName || "成員")}</strong>
          <span>・${escapeHtml(wish.createdAt || "")}</span>
        </div>
        <span class="wish-status-badge ${isBought ? "bought" : "pending"}">
          ${isBought ? "✅ 現場已購入" : "⏳ 待採購(許願中)"}
        </span>
      </div>

      <h4 class="wish-title">${escapeHtml(wish.title)}</h4>

      <div class="wish-meta-row">
        <span class="wish-qty">想買數量：<strong>${wish.qty || 1} 件</strong></span>
        ${
          isBought
            ? `<span class="wish-price">購入金額：¥${(wish.boughtPriceYen || 0).toLocaleString("ja-JP")}</span>`
            : ""
        }
      </div>

      ${wish.note ? `<div class="wish-note">💬 ${escapeHtml(wish.note)}</div>` : ""}

      ${
        isBought && wish.boughtStore
          ? `<div style="font-size:0.72rem; color:#27643b; margin-bottom:6px;">📍 購於：${escapeHtml(wish.boughtStore)}</div>`
          : ""
      }

      <div class="wish-card-footer">
        <div>
          ${
            isLeader && !isBought
              ? `<button type="button" class="btn-wish-action bought-toggle btn-mark-wish-bought" data-wish-id="${wish.id}">
                  🛒 標記此項已買到
                </button>`
              : ""
          }
          ${
            isLeader && isBought
              ? `<button type="button" class="btn-wish-action btn-revert-wish-bought" data-wish-id="${wish.id}">
                  ↩ 改回許願中
                </button>`
              : ""
          }
        </div>
        ${
          isMine || isLeader
            ? `<button type="button" class="btn-wish-action btn-delete-wish" data-wish-id="${wish.id}">
                🗑️ 刪除
              </button>`
            : ""
        }
      </div>
    `;

    // 點照片看大圖
    const photoBox = cardEl.querySelector(".wish-photo-box");
    if (photoBox && wish.imageUrl) {
      photoBox.addEventListener("click", () => openLightbox(wish.imageUrl));
    }

    // 團主直接手動標記許願商品已購入
    const markBoughtBtn = cardEl.querySelector(".btn-mark-wish-bought");
    if (markBoughtBtn) {
      markBoughtBtn.addEventListener("click", () => {
        handleMarkWishBought(wish.id);
      });
    }

    // 改回許願中
    const revertBtn = cardEl.querySelector(".btn-revert-wish-bought");
    if (revertBtn) {
      revertBtn.addEventListener("click", () => {
        wish.status = "pending";
        wish.boughtPriceYen = null;
        wish.boughtStore = null;
        saveGroupbuyState();
        renderApp();
        showToast("已將商品移回許願中");
      });
    }

    // 刪除
    const delBtn = cardEl.querySelector(".btn-delete-wish");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        if (confirm(`確定要刪除「${wish.title}」這項許願嗎？`)) {
          state.wishes = state.wishes.filter((w) => w.id !== wish.id);
          if (!state.deletedWishIds) state.deletedWishIds = [];
          if (!state.deletedWishIds.includes(wish.id)) {
            state.deletedWishIds.push(wish.id);
          }

          // 跨手機即時廣播刪除許願事件
          broadcastSyncEvent("DELETE_WISH", {
            wishId: wish.id,
            wishTitle: wish.title,
          });

          saveGroupbuyState();
          renderApp();
          showToast("已刪除許願商品");
        }
      });
    }

    container.appendChild(cardEl);
  });
}

// 團主直接手動標記許願卡為已購入
function handleMarkWishBought(wishId) {
  const wish = state.wishes.find((w) => w.id === wishId);
  if (!wish) return;

  const inputPrice = prompt(
    `請輸入現場購入日圓含稅金額：`,
    wish.targetPriceYen || 980
  );
  if (inputPrice === null) return;
  const priceYen = parseInt(inputPrice, 10) || wish.targetPriceYen || 0;

  wish.status = "bought";
  wish.boughtPriceYen = priceYen;
  wish.boughtStore = "日本實體藥妝店";

  // 即時廣播給所有成員手機同步為已購入
  broadcastSyncEvent("CONFIRM_PURCHASE", {
    postId: null,
    boughtOrderIds: [],
    wishId: wish.id,
    postTitle: wish.title,
    boughtPriceYen: priceYen,
  });

  saveGroupbuyState();
  renderApp();
  showToast(`🎉 已成功將「${wish.title}」標記為已購入！已計入分帳！`);
}

// ==========================================
// 團主採買總清單模組 (Shopping Checklist)
// 自動統計全團所有成員「待採購許願」+「連線喊單」的商品總數量
// ==========================================
function renderShoppingList() {
  const container = document.getElementById("shoppingListContainer");
  const progressText = document.getElementById("shoppingProgressText");
  const remainingText = document.getElementById("shoppingRemainingText");
  const progressBar = document.getElementById("shoppingProgressBar");
  if (!container) return;

  // 1. 建立商品彙整 Map (key: 乾淨商品名稱)
  const itemMap = new Map();

  function getOrCreateGroup(title, sampleImg) {
    const key = title.trim().toLowerCase();
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        key,
        title: title.trim(),
        imageUrl: sampleImg || "",
        totalQty: 0,
        boughtQty: 0,
        pendingQty: 0,
        requesters: [], // { name, avatar, qty, type, bought, refObj }
      });
    }
    const group = itemMap.get(key);
    if (!group.imageUrl && sampleImg) group.imageUrl = sampleImg;
    return group;
  }

  // A. 彙整全體許願商品
  state.wishes.forEach((w) => {
    const group = getOrCreateGroup(w.title, w.imageUrl);
    const qty = w.qty || 1;
    group.totalQty += qty;
    if (w.status === "bought") {
      group.boughtQty += qty;
    } else {
      group.pendingQty += qty;
    }
    group.requesters.push({
      id: w.id,
      name: w.userName || "團員",
      avatar: w.userAvatar || "🌸",
      qty,
      type: "許願",
      bought: w.status === "bought",
      ref: w,
      sourceType: "wish",
    });
  });

  // B. 彙整現場連線貼文中的所有喊單
  state.posts.forEach((p) => {
    (p.orders || []).forEach((o) => {
      const group = getOrCreateGroup(p.title, p.imageUrl);
      const qty = o.qty || 1;
      group.totalQty += qty;
      if (o.bought) {
        group.boughtQty += qty;
      } else {
        group.pendingQty += qty;
      }
      group.requesters.push({
        id: o.id,
        name: o.userName || "團員",
        avatar: o.userAvatar || "🌸",
        qty,
        type: "連線喊單",
        bought: !!o.bought,
        ref: o,
        post: p,
        sourceType: "order",
      });
    });
  });

  // 計算採買總進度
  const groups = Array.from(itemMap.values());
  let grandTotal = 0;
  let grandBought = 0;
  groups.forEach((g) => {
    grandTotal += g.totalQty;
    grandBought += g.boughtQty;
  });

  const grandPending = grandTotal - grandBought;
  const percent = grandTotal > 0 ? Math.round((grandBought / grandTotal) * 100) : 0;

  if (progressText) progressText.textContent = `${grandBought} / ${grandTotal} 件 (${percent}%)`;
  if (remainingText) remainingText.textContent = `尚有 ${grandPending} 件待採購`;
  if (progressBar) progressBar.style.width = `${percent}%`;

  container.innerHTML = "";
  if (groups.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 10px; color: var(--ink-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🛒</div>
        <p>目前尚無待採購項目</p>
        <p style="font-size:0.8rem;">團員送出許願或在現場貼文按 +1 後，採買總清單會自動在此彙整！</p>
      </div>
    `;
    return;
  }

  // 排序：尚未買齊的排在前面，已買齊的排在後面
  groups.sort((a, b) => {
    const aDone = a.pendingQty === 0;
    const bDone = b.pendingQty === 0;
    if (aDone && !bDone) return 1;
    if (!aDone && bDone) return -1;
    return b.pendingQty - a.pendingQty;
  });

  groups.forEach((g) => {
    const isDone = g.pendingQty === 0;
    const cardEl = document.createElement("div");
    cardEl.className = `shopping-item-card ${isDone ? "is-done" : ""}`;

    const requestersHtml = g.requesters
      .map(
        (r) => `
        <span class="member-qty-pill" title="${escapeHtml(r.type)}">
          ${escapeHtml(r.avatar)} ${escapeHtml(r.name)} <strong>x${r.qty}</strong>
          ${r.bought ? `<span style="color:#27643b; font-weight:700;">✓</span>` : ""}
        </span>
      `
      )
      .join("");

    cardEl.innerHTML = `
      <div class="shopping-left-col">
        <button type="button" class="shopping-check-btn" title="${isDone ? "點擊改回未採購" : "點擊標記全數買到了"}">
          ${isDone ? "✓" : ""}
        </button>
        ${
          g.imageUrl
            ? `<img src="${escapeHtml(g.imageUrl)}" alt="${escapeHtml(g.title)}" class="shopping-thumb" />`
            : `<div class="shopping-thumb" style="display:flex;align-items:center;justify-content:center;font-size:1.4rem;">🛍️</div>`
        }
        <div class="shopping-item-info">
          <div class="shopping-item-title">${escapeHtml(g.title)}</div>
          <div class="shopping-members-tags">
            ${requestersHtml}
          </div>
        </div>
      </div>

      <div class="shopping-right-col">
        <div class="shopping-total-badge">
          ${isDone ? `已購齊 ${g.totalQty} 件` : `需採買 ${g.pendingQty} 件`}
        </div>
        <button type="button" class="btn-mark-basket btn-toggle-group-bought">
          ${isDone ? "↩ 移回待買" : "🛒 整批入袋"}
        </button>
      </div>
    `;

    // 勾選按鈕與整批入袋按鈕
    const checkBtn = cardEl.querySelector(".shopping-check-btn");
    const toggleBtn = cardEl.querySelector(".btn-toggle-group-bought");

    const handleToggle = () => {
      toggleGroupBoughtStatus(g, !isDone);
    };

    if (checkBtn) checkBtn.addEventListener("click", handleToggle);
    if (toggleBtn) toggleBtn.addEventListener("click", handleToggle);

    container.appendChild(cardEl);
  });
}

// 團主在採買清單上一鍵切換整批商品購買狀態
function toggleGroupBoughtStatus(group, targetBought) {
  let defaultPrice = 980;
  if (targetBought) {
    const inputPrice = prompt(`【${group.title}】共 ${group.pendingQty} 件\n請輸入實際現場購入含稅日圓單價：`, defaultPrice);
    if (inputPrice === null) return;
    defaultPrice = parseInt(inputPrice, 10) || defaultPrice;
  }

  // 1. 更新所有許願
  group.requesters.forEach((r) => {
    if (r.sourceType === "wish") {
      r.ref.status = targetBought ? "bought" : "pending";
      r.ref.boughtPriceYen = targetBought ? defaultPrice : null;
      r.ref.boughtStore = targetBought ? "日本現場藥妝店" : null;
    } else if (r.sourceType === "order") {
      r.ref.bought = targetBought;
      r.ref.boughtPriceYen = targetBought ? defaultPrice : null;
      if (targetBought && r.post) {
        syncOrderToWishlistBought(r.ref, r.post);
      }
    }
  });

  // 2. 跨手機廣播同步事件
  broadcastSyncEvent("CONFIRM_PURCHASE", {
    postTitle: group.title,
    boughtPriceYen: defaultPrice,
    isRevert: !targetBought,
    allBought: targetBought,
    requesterIds: group.requesters.map((r) => r.id),
  });

  saveGroupbuyState();
  renderApp();
  showToast(targetBought ? `🎉 已將「${group.title}」標記為全數購入入袋！` : `已將「${group.title}」移回待採購清單`);
}

// ==========================================
// TAB 4: 回國分帳結算 (Settlement)
// ==========================================
function renderSettlement() {
  const container = document.getElementById("memberBillsContainer");
  const rateInput = document.getElementById("settlementRateInput");
  if (!container || !rateInput) return;

  const currentRate = state.settings.exchangeRate || 0.215;
  rateInput.value = currentRate;

  // 整理所有「已購入」品項（彙整自 wishes 的 bought 狀態以及 posts 的 orders bought 狀態）
  // 以 userId 進行歸戶
  const memberBills = {};
  state.users.forEach((u) => {
    memberBills[u.id] = {
      user: u,
      items: [],
      totalYen: 0,
      totalTwd: 0,
      isPaid: state.payments[u.id]?.isPaid || false,
    };
  });

  // 1. 從已購入的許願池統計
  state.wishes
    .filter((w) => w.status === "bought")
    .forEach((w) => {
      if (!memberBills[w.userId]) {
        memberBills[w.userId] = {
          user: { id: w.userId, name: w.userName, avatar: w.userAvatar, role: "member" },
          items: [],
          totalYen: 0,
          totalTwd: 0,
          isPaid: false,
        };
      }
      const priceYen = w.boughtPriceYen || w.targetPriceYen || 0;
      const subtotalYen = priceYen * (w.qty || 1);
      memberBills[w.userId].items.push({
        name: w.title,
        qty: w.qty || 1,
        priceYen: priceYen,
        subtotalYen: subtotalYen,
        note: w.boughtStore || "日本藥妝店",
      });
      memberBills[w.userId].totalYen += subtotalYen;
    });

  // 計算全體總計
  let grandTotalItems = 0;
  let grandTotalYen = 0;
  let grandTotalTwd = 0;
  let grandPaidTwd = 0;

  Object.values(memberBills).forEach((bill) => {
    bill.totalTwd = Math.round(bill.totalYen * currentRate);
    const itemCount = bill.items.reduce((s, it) => s + it.qty, 0);
    grandTotalItems += itemCount;
    grandTotalYen += bill.totalYen;
    grandTotalTwd += bill.totalTwd;
    if (bill.isPaid) {
      grandPaidTwd += bill.totalTwd;
    }
  });

  // 渲染頂部 Hero 統計
  document.getElementById("statTotalItems").textContent = `${grandTotalItems} 件`;
  document.getElementById("statTotalYen").textContent = `¥${grandTotalYen.toLocaleString("ja-JP")}`;
  document.getElementById("statTotalTwd").textContent = `NT$ ${grandTotalTwd.toLocaleString()}`;
  document.getElementById("statPaidTwd").textContent = `NT$ ${grandPaidTwd.toLocaleString()}`;

  // 渲染各成員帳單列表
  container.innerHTML = "";

  const activeBills = Object.values(memberBills).filter((b) => b.items.length > 0);
  if (activeBills.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 30px; color: var(--ink-muted);">
        <p>目前尚無已購入商品，暫無分帳明細</p>
      </div>
    `;
    return;
  }

  activeBills.forEach((bill) => {
    const cardEl = document.createElement("div");
    cardEl.className = "member-bill-card";

    const rowsHtml = bill.items
      .map(
        (it) => `
        <tr>
          <td>${escapeHtml(it.name)}</td>
          <td class="num">${it.qty}</td>
          <td class="num">¥${it.priceYen.toLocaleString("ja-JP")}</td>
          <td class="num">¥${it.subtotalYen.toLocaleString("ja-JP")}</td>
        </tr>
      `
      )
      .join("");

    cardEl.innerHTML = `
      <div class="bill-head-row">
        <div class="bill-user-title">
          <span style="font-size:1.3rem;">${escapeHtml(bill.user.avatar || "👤")}</span>
          <span>${escapeHtml(bill.user.name)} 的採買帳單</span>
          <span class="user-role-tag ${bill.user.role === "leader" ? "leader" : "member"}">${bill.user.role === "leader" ? "團主" : "團友"}</span>
        </div>
        <div class="bill-total-badge">
          <div class="bill-total-twd">應付 NT$ ${bill.totalTwd.toLocaleString()}</div>
          <div class="bill-total-yen">總計 ¥${bill.totalYen.toLocaleString("ja-JP")} (匯率 ${currentRate})</div>
        </div>
      </div>

      <table class="bill-items-table">
        <thead>
          <tr>
            <th>商品品項</th>
            <th style="text-align:right;">數量</th>
            <th style="text-align:right;">單價</th>
            <th style="text-align:right;">小計(日圓)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="bill-foot-actions">
        <label class="paid-toggle-label">
          <input type="checkbox" class="chk-paid-status" data-user-id="${bill.user.id}" ${bill.isPaid ? "checked" : ""} />
          <span>${bill.isPaid ? "✅ 款項已結清" : "⏳ 尚未收款"}</span>
        </label>

        <button type="button" class="btn-copy-line" data-user-id="${bill.user.id}">
          📋 複製 LINE 請款明細
        </button>
      </div>
    `;

    // 勾選收款狀態
    const chk = cardEl.querySelector(".chk-paid-status");
    if (chk) {
      chk.addEventListener("change", (e) => {
        const isPaid = e.target.checked;
        if (!state.payments[bill.user.id]) {
          state.payments[bill.user.id] = {};
        }
        state.payments[bill.user.id].isPaid = isPaid;
        state.payments[bill.user.id].paidAt = isPaid ? new Date().toISOString() : null;
        saveGroupbuyState();
        renderSettlement();
        showToast(isPaid ? `已標記「${bill.user.name}」款項已結清` : `已更新「${bill.user.name}」為未收款`);
      });
    }

    // 複製 LINE 請款明細文字
    const copyBtn = cardEl.querySelector(".btn-copy-line");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyLineMessage(bill, currentRate);
      });
    }

    container.appendChild(cardEl);
  });
}

// 產生並複製 LINE 請款訊息
function copyLineMessage(bill, rate) {
  let lines = [];
  lines.push(`${bill.user.avatar}【${bill.user.name} 日本藥妝代購請款清單】`);
  lines.push(`---------------------------------`);
  bill.items.forEach((it, idx) => {
    lines.push(`${idx + 1}. ${it.name} x ${it.qty} = ¥${it.subtotalYen.toLocaleString("ja-JP")}`);
  });
  lines.push(`---------------------------------`);
  lines.push(`合計日圓：¥${bill.totalYen.toLocaleString("ja-JP")}`);
  lines.push(`換算匯率：${rate}`);
  lines.push(`👉 應收台幣：NT$ ${bill.totalTwd.toLocaleString()}`);
  lines.push(`收款狀態：${bill.isPaid ? "✅ 款項已收齊" : "⏳ 待匯款"}`);
  lines.push(`\n感謝跟團！回國後相約面交取貨～✈️`);

  const text = lines.join("\n");
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast(`📋 已成功複製 ${bill.user.name} 的 LINE 請款明細！`);
    })
    .catch(() => {
      prompt("請手動複製下方文字：", text);
    });
}

// ==========================================
// 全域事件監聽與彈窗控制
// ==========================================
function bindGlobalEvents() {
  // 分頁切換
  document.querySelectorAll(".tab-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-item").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tabTarget = btn.dataset.tab;
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.add("hidden"));
      if (tabTarget === "liveStream") document.getElementById("tabLiveStream").classList.remove("hidden");
      if (tabTarget === "wishlist") document.getElementById("tabWishlist").classList.remove("hidden");
      if (tabTarget === "shoppingList") document.getElementById("tabShoppingList").classList.remove("hidden");
      if (tabTarget === "settlement") document.getElementById("tabSettlement").classList.remove("hidden");
    });
  });

  // 複製採買總清單純文字
  const btnCopyShopping = document.getElementById("btnCopyShoppingText");
  if (btnCopyShopping) {
    btnCopyShopping.addEventListener("click", copyShoppingListText);
  }

  // 關閉 Modal 按鈕 (共用)
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.closeModal;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add("hidden");
    });
  });

  // 點背景關閉 Modal
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add("hidden");
      }
    });
  });

  // 1. 切換/建立帳號彈窗
  const btnSwitchUser = document.getElementById("btnSwitchUser");
  if (btnSwitchUser) {
    btnSwitchUser.addEventListener("click", openAccountModal);
  }

  // 2. 建立新帳號表單
  const formNewUser = document.getElementById("formNewUser");
  if (formNewUser) {
    formNewUser.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("newUserNameInput").value.trim();
      const avatar = document.getElementById("newUserAvatar").value;
      const role = document.getElementById("newUserRole").value;
      if (!name) return;

      const newUser = {
        id: "user_" + Date.now(),
        name,
        avatar,
        role,
      };
      state.users.push(newUser);
      state.currentUserId = newUser.id;
      saveGroupbuyState();
      document.getElementById("modalAccount").classList.add("hidden");
      document.getElementById("newUserNameInput").value = "";
      renderApp();
      showToast(`👋 歡迎 ${newUser.name}！已建立並切換為此帳號`);
    });
  }

  // 3. 團主發起連線喊單
  const btnNewLivePost = document.getElementById("btnNewLivePost");
  if (btnNewLivePost) {
    btnNewLivePost.addEventListener("click", () => {
      const currentUser = getCurrentUser();
      if (currentUser.role !== "leader") {
        const confirmSwitch = confirm("發起現場連線通常由【團主】發布。是否將當前帳號更改為出國團主？");
        if (confirmSwitch) {
          setUserAsLeader(currentUser.id);
        } else {
          return;
        }
      }
      tempPostImageData = "";
      document.getElementById("formNewLivePost").reset();
      document.getElementById("postImagePreviewContainer").classList.add("hidden");
      document.getElementById("btnSelectPostImage").classList.remove("hidden");
      document.getElementById("modalNewLivePost").classList.remove("hidden");
    });
  }

  // 發文照片選擇
  setupPhotoUpload(
    "btnSelectPostImage",
    "postImageInput",
    "postImagePreview",
    "postImagePreviewContainer",
    "btnRemovePostImage",
    (dataUrl) => {
      tempPostImageData = dataUrl;
    }
  );

  // 提交喊單貼文
  const formNewLivePost = document.getElementById("formNewLivePost");
  if (formNewLivePost) {
    formNewLivePost.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("postTitleInput").value.trim();
      const priceYen = parseInt(document.getElementById("postPriceYenInput").value, 10);
      const stockLimit = parseInt(document.getElementById("postStockLimitInput").value, 10) || null;
      const store = document.getElementById("postStoreInput").value.trim();
      const note = document.getElementById("postNoteInput").value.trim();

      if (!title || !priceYen) return;

      const user = getCurrentUser();
      const newPost = {
        id: "post_" + Date.now(),
        authorId: user.id,
        authorName: user.name,
        title,
        priceYen,
        stockLimit,
        store: store || "日本藥妝店",
        note,
        imageUrl: tempPostImageData || "",
        createdAt: new Date().toLocaleString("zh-TW", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
        orders: [],
      };

      state.posts.unshift(newPost);
      // 即時跨手機廣播新現場連線貼文
      broadcastSyncEvent("NEW_POST", { post: newPost });

      saveGroupbuyState();
      document.getElementById("modalNewLivePost").classList.add("hidden");
      renderLivePosts();
      updateBadgeCounts();
      showToast(`📢 現場連線發布成功！團友手機已同步，可立即按 +1 喊單！`);
    });
  }

  // 4. 新增許願商品
  const btnOpenNewWish = document.getElementById("btnOpenNewWishModal");
  if (btnOpenNewWish) {
    btnOpenNewWish.addEventListener("click", () => {
      tempWishImageData = "";
      document.getElementById("formNewWish").reset();
      document.getElementById("wishImagePreviewContainer").classList.add("hidden");
      document.getElementById("btnSelectWishImage").classList.remove("hidden");
      document.getElementById("modalNewWish").classList.remove("hidden");
    });
  }

  // 許願照片選擇
  setupPhotoUpload(
    "btnSelectWishImage",
    "wishImageInput",
    "wishImagePreview",
    "wishImagePreviewContainer",
    "btnRemoveWishImage",
    (dataUrl) => {
      tempWishImageData = dataUrl;
    }
  );

  // 提交許願
  const formNewWish = document.getElementById("formNewWish");
  if (formNewWish) {
    formNewWish.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("wishTitleInput").value.trim();
      const qty = parseInt(document.getElementById("wishQtyInput").value, 10) || 1;
      const note = document.getElementById("wishNoteInput").value.trim();

      if (!title) return;
      const user = getCurrentUser();

      const newWish = {
        id: "wish_" + Date.now(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        title,
        qty,
        targetPriceYen: null,
        note,
        imageUrl: tempWishImageData || "",
        status: "pending",
        boughtPriceYen: null,
        boughtStore: null,
        fromPostId: null,
        createdAt: new Date().toLocaleString("zh-TW", { hour12: false, month: "2-digit", day: "2-digit" }),
      };

      state.wishes.unshift(newWish);
      // 即時跨手機廣播新許願 (團主手機自動跳出！)
      broadcastSyncEvent("ADD_WISH", { wish: newWish });

      saveGroupbuyState();
      document.getElementById("modalNewWish").classList.add("hidden");

      // 重設篩選器為全部，確保團主切換或當前頁面立刻看得到
      currentWishFilter.userId = "all";
      currentWishFilter.status = "all";
      const userSelect = document.getElementById("wishlistUserFilter");
      if (userSelect) userSelect.value = "all";

      renderWishlist();
      updateBadgeCounts();
      showToast(`✨ 許願成功！已即時同步至全體成員與團主的手機！`);
    });
  }

  // 許願清單過濾器
  const wishUserFilter = document.getElementById("wishlistUserFilter");
  if (wishUserFilter) {
    wishUserFilter.addEventListener("change", (e) => {
      currentWishFilter.userId = e.target.value;
      renderWishlist();
    });
  }

  document.querySelectorAll(".wishlist-status-tabs .status-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".wishlist-status-tabs .status-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentWishFilter.status = chip.dataset.status;
      renderWishlist();
    });
  });

  // 5. 團主執行確認購入按鈕
  const btnExecutePurchase = document.getElementById("btnExecutePurchase");
  if (btnExecutePurchase) {
    btnExecutePurchase.addEventListener("click", executePurchase);
  }

  // 6. 結算匯率儲存
  const btnSaveRate = document.getElementById("btnSaveRate");
  if (btnSaveRate) {
    btnSaveRate.addEventListener("click", () => {
      const rateVal = parseFloat(document.getElementById("settlementRateInput").value);
      if (rateVal && rateVal > 0) {
        state.settings.exchangeRate = rateVal;
        saveGroupbuyState();
        renderSettlement();
        renderLivePosts();
        showToast(`匯率已更新為 ${rateVal}`);
      }
    });
  }

  // 7. 匯出 CSV 按鈕
  const btnExportCsv = document.getElementById("btnExportAllCsv");
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", exportSettlementCsv);
  }

  // 8. 圖片 Lightbox 關閉
  const btnCloseLightbox = document.getElementById("btnCloseLightbox");
  if (btnCloseLightbox) {
    btnCloseLightbox.addEventListener("click", () => {
      document.getElementById("groupbuyLightbox").classList.add("hidden");
    });
  }

  // 9. 雲端同步房號設定與邀請
  const btnOpenSync = document.getElementById("btnOpenSyncSettings");
  if (btnOpenSync) {
    btnOpenSync.addEventListener("click", () => {
      document.getElementById("syncRoomIdInput").value = state.sync.roomId || "osaka_groupbuy_notebook";
      document.getElementById("firebaseDbUrlInput").value = state.sync.firebaseDbUrl || "";
      document.getElementById("modalSyncSettings").classList.remove("hidden");
    });
  }

  const formSync = document.getElementById("formSyncSettings");
  if (formSync) {
    formSync.addEventListener("submit", (e) => {
      e.preventDefault();
      const newRoom = document.getElementById("syncRoomIdInput").value.trim();
      const newDb = document.getElementById("firebaseDbUrlInput").value.trim();
      if (!newRoom) return;

      state.sync.roomId = newRoom;
      state.sync.firebaseDbUrl = newDb;
      saveGroupbuyState();
      document.getElementById("modalSyncSettings").classList.add("hidden");

      // 重新連線新房間
      if (mqttClient) {
        try { mqttClient.end(true); } catch (_) {}
      }
      initRealtimeSync();
      showToast(`☁️ 已切換並連線至房號：${newRoom}`);
    });
  }

  const btnCopyInvite = document.getElementById("btnCopyInviteLink");
  if (btnCopyInvite) {
    btnCopyInvite.addEventListener("click", copyInviteLink);
  }
}

// ==========================================
// 全自動跨裝置即時雲端同步模組 (Realtime Cloud Sync)
// 解決：團員在自己手機填入，團主直接在自己手機看到，完全無需手動匯入與複製代碼！
// ==========================================

const MQTT_BROKER_URL = "wss://broker.emqx.io:8084/mqtt";
const MQTT_BASE_TOPIC = "jp_travel_groupbuy_v1";

function getSyncTopic() {
  const room = (state.sync && state.sync.roomId) || "osaka_groupbuy_notebook";
  return `${MQTT_BASE_TOPIC}/${room}`;
}

// 初始化即時雲端連線
function initRealtimeSync() {
  updateSyncStatusUI("connecting", "正在連線雲端房間...");

  // 1. MQTT.js 公共即時廣播連線
  if (typeof mqtt !== "undefined") {
    try {
      const clientId = "client_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
      mqttClient = mqtt.connect(MQTT_BROKER_URL, {
        clientId,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 4000,
      });

      mqttClient.on("connect", () => {
        isRealtimeConnected = true;
        const topic = getSyncTopic();
        mqttClient.subscribe(topic, { qos: 1 });
        updateSyncStatusUI("live", `即時雲端連線中 (${state.sync.roomId})`);
        console.log(`[Realtime Sync] Connected to room: ${topic}`);

        // 向同房在線成員發送同步請求，確保拿到最新資料
        broadcastSyncEvent("REQUEST_FULL_SYNC", { fromUserId: state.currentUserId });
      });

      mqttClient.on("message", (receivedTopic, messageBuffer) => {
        try {
          const payloadStr = messageBuffer.toString();
          const evt = JSON.parse(payloadStr);
          handleIncomingSyncEvent(evt);
        } catch (e) {
          console.error("解析雲端推播失敗", e);
        }
      });

      mqttClient.on("error", (err) => {
        console.warn("[Realtime Sync] MQTT error:", err);
        isRealtimeConnected = false;
        updateSyncStatusUI("error", "雲端連線重試中...");
      });

      mqttClient.on("offline", () => {
        isRealtimeConnected = false;
        updateSyncStatusUI("error", "雲端離線 (正在重連)");
      });
    } catch (err) {
      console.error("初始化 MQTT 失敗", err);
      updateSyncStatusUI("error", "即時連線異常");
    }
  }

  // 2. Firebase Realtime Database 支援 (若使用者有填寫資料庫網址)
  initFirebaseSyncIfConfigured();
}

// 發送即時同步事件給同房所有手機
function broadcastSyncEvent(action, data) {
  const payload = {
    senderId: state.currentUserId,
    senderName: getCurrentUser().name,
    timestamp: Date.now(),
    action,
    data,
  };

  // 1. 透過 MQTT 廣播
  if (mqttClient && isRealtimeConnected) {
    try {
      const topic = getSyncTopic();
      mqttClient.publish(topic, JSON.stringify(payload), { qos: 1 });
    } catch (e) {
      console.error("MQTT 廣播失敗", e);
    }
  }

  // 2. 透過 Firebase 更新 (若有設定)
  syncEventToFirebase(payload);
}

// 接收來自其他手機的即時事件
function handleIncomingSyncEvent(evt) {
  if (!evt || !evt.action) return;
  // 忽略自己發送的事件
  if (evt.senderId === state.currentUserId) return;

  console.log(`[Realtime Sync] 收到事件: ${evt.action}`, evt.data);

  switch (evt.action) {
    case "ADD_WISH": {
      const wish = evt.data.wish;
      if (!wish || !wish.id) return;

      // 檢查是否已存在
      const exists = state.wishes.some((w) => w.id === wish.id);
      if (!exists) {
        state.wishes.unshift(wish);

        // 自動加入該成員到清單 (若未被刪除)
        if (!state.users.some((u) => u.id === wish.userId) && !(state.deletedUserIds || []).includes(wish.userId)) {
          state.users.push({
            id: wish.userId,
            name: wish.userName,
            avatar: wish.userAvatar || "👤",
            role: "member",
          });
        }

        saveGroupbuyState();
        renderWishlist();
        updateBadgeCounts();
        showToast(`✨【${wish.userName}】剛剛在自己手機許願了：${wish.title}！`);
      }
      break;
    }

    case "CHANGE_ORDER": {
      const { postId, order } = evt.data;
      const post = state.posts.find((p) => p.id === postId);
      if (post && order) {
        if (!post.orders) post.orders = [];
        const idx = post.orders.findIndex((o) => o.id === order.id || o.userId === order.userId);
        if (idx !== -1) {
          post.orders[idx] = order;
        } else {
          post.orders.push(order);
        }
        saveGroupbuyState();
        renderLivePosts();
        renderSettlement();
        showToast(`🙋【${order.userName}】在現場貼文喊單 +${order.qty}！`);
      }
      break;
    }

    case "CONFIRM_PURCHASE": {
      const { postId, boughtOrderIds, postTitle, boughtPriceYen } = evt.data;
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.orders) {
        post.orders.forEach((o) => {
          if (boughtOrderIds.includes(o.id)) {
            o.bought = true;
            o.boughtPriceYen = boughtPriceYen;
            syncOrderToWishlistBought(o, post);
          }
        });
        saveGroupbuyState();
        renderApp();
        showToast(`🛒 團主已在現場確認購入「${postTitle}」！已自動移至已購入專區！`);
      }
      break;
    }

    case "NEW_POST": {
      const post = evt.data.post;
      if (post && !state.posts.some((p) => p.id === post.id)) {
        state.posts.unshift(post);
        saveGroupbuyState();
        renderLivePosts();
        updateBadgeCounts();
        showToast(`📸 團主正在現場發起新連線：${post.title}！快去喊單！`);
      }
      break;
    }

    case "DELETE_POST": {
      const { postId } = evt.data || {};
      if (postId) {
        state.posts = state.posts.filter((p) => p.id !== postId);
        if (!state.deletedPostIds) state.deletedPostIds = [];
        if (!state.deletedPostIds.includes(postId)) state.deletedPostIds.push(postId);
        saveGroupbuyState();
        renderApp();
      }
      break;
    }

    case "DELETE_WISH": {
      const { wishId } = evt.data || {};
      if (wishId) {
        state.wishes = state.wishes.filter((w) => w.id !== wishId);
        if (!state.deletedWishIds) state.deletedWishIds = [];
        if (!state.deletedWishIds.includes(wishId)) state.deletedWishIds.push(wishId);
        saveGroupbuyState();
        renderApp();
      }
      break;
    }

    case "DELETE_USER": {
      const { userId } = evt.data || {};
      if (userId) {
        state.users = state.users.filter((u) => u.id !== userId);
        if (!state.deletedUserIds) state.deletedUserIds = [];
        if (!state.deletedUserIds.includes(userId)) state.deletedUserIds.push(userId);
        state.wishes = state.wishes.filter((w) => w.userId !== userId);
        state.posts.forEach((p) => {
          if (Array.isArray(p.orders)) {
            p.orders = p.orders.filter((o) => o.userId !== userId);
          }
        });
        if (state.payments && state.payments[userId]) {
          delete state.payments[userId];
        }
        if (state.currentUserId === userId) {
          const leader = state.users.find((u) => u.role === "leader") || state.users[0];
          state.currentUserId = leader ? leader.id : "";
        }
        saveGroupbuyState();
        renderApp();
        const accountModal = document.getElementById("modalAccount");
        if (accountModal && !accountModal.classList.contains("hidden")) {
          openAccountModal();
        }
      }
      break;
    }

    case "UPDATE_USER_ROLE": {
      const { userId, userName, role } = evt.data || {};
      if (userId) {
        state.users.forEach((u) => {
          if (u.id === userId) {
            u.role = role || "leader";
          } else if (role === "leader" && u.role === "leader") {
            u.role = "member";
          }
        });
        saveGroupbuyState();
        renderApp();
        const accountModal = document.getElementById("modalAccount");
        if (accountModal && !accountModal.classList.contains("hidden")) {
          openAccountModal();
        }
        showToast(`✈️ 出國團主已變更為【${userName || "成員"}】！`);
      }
      break;
    }

    case "REQUEST_FULL_SYNC": {
      // 團主或在線成員回傳當前完整狀態給新進入房間的人（包含已刪除墓碑標記）
      if (getCurrentUser().role === "leader" || state.wishes.length > 0 || state.posts.length > 0) {
        broadcastSyncEvent("REPLY_FULL_SYNC", {
          wishes: state.wishes,
          posts: state.posts,
          users: state.users,
          payments: state.payments,
          deletedPostIds: state.deletedPostIds || [],
          deletedWishIds: state.deletedWishIds || [],
          deletedUserIds: state.deletedUserIds || [],
        });
      }
      break;
    }

    case "REPLY_FULL_SYNC": {
      const { wishes, posts, users, payments, deletedPostIds, deletedWishIds, deletedUserIds } = evt.data || {};
      
      // 合併已刪除 ID 集合
      const allDeletedPosts = new Set([
        ...(state.deletedPostIds || []),
        ...((Array.isArray(deletedPostIds) && deletedPostIds) || []),
      ]);
      const allDeletedWishes = new Set([
        ...(state.deletedWishIds || []),
        ...((Array.isArray(deletedWishIds) && deletedWishIds) || []),
      ]);
      const allDeletedUsers = new Set([
        ...(state.deletedUserIds || []),
        ...((Array.isArray(deletedUserIds) && deletedUserIds) || []),
      ]);
      state.deletedPostIds = Array.from(allDeletedPosts);
      state.deletedWishIds = Array.from(allDeletedWishes);
      state.deletedUserIds = Array.from(allDeletedUsers);

      if (Array.isArray(wishes)) {
        state.wishes = mergeListsById(state.wishes, wishes)
          .filter((w) => !allDeletedWishes.has(w.id));
      }
      if (Array.isArray(posts)) {
        state.posts = mergeListsById(state.posts, posts)
          .filter((p) => !allDeletedPosts.has(p.id));
      }
      if (Array.isArray(users)) {
        state.users = mergeListsById(state.users, users)
          .filter((u) => !allDeletedUsers.has(u.id));
      }
      if (payments) {
        state.payments = { ...state.payments, ...payments };
      }
      saveGroupbuyState();
      renderApp();
      console.log("[Realtime Sync] 已成功自雲端同步最新全量資料 (已排除已刪除項目)");
      break;
    }
  }
}

function mergeListsById(localList, remoteList) {
  const map = new Map();
  (remoteList || []).forEach((it) => map.set(it.id, it));
  (localList || []).forEach((it) => {
    if (!map.has(it.id)) map.set(it.id, it);
  });
  return Array.from(map.values());
}

// 更新頂部連線狀態指示
function updateSyncStatusUI(status, text) {
  const dot = document.getElementById("syncStatusDot");
  const txt = document.getElementById("syncStatusText");
  if (!dot || !txt) return;

  dot.className = `sync-dot ${status}`;
  txt.textContent = text;
}

// 複製邀請連結 (自動帶上當前房間號碼，點開的人自動在同房間即時連線)
function copyInviteLink() {
  const cleanUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(state.sync.roomId || "osaka_groupbuy_notebook")}`;
  copyTextToClipboard(cleanUrl, "🔗 已複製專屬團購邀請連結！團員打開此連結，許願與喊單會自動即時同步，完全不需任何手動設定！");
}

// Firebase 擴充支援
function initFirebaseSyncIfConfigured() {
  const dbUrl = state.sync && state.sync.firebaseDbUrl;
  if (!dbUrl) return;

  // 使用原生 fetch 定期拉取或 REST 更新
  console.log(`[Firebase] Configured DB: ${dbUrl}`);
}

function syncEventToFirebase(payload) {
  const dbUrl = state.sync && state.sync.firebaseDbUrl;
  if (!dbUrl) return;
  try {
    const room = state.sync.roomId || "osaka_groupbuy_notebook";
    fetch(`${dbUrl.replace(/\/$/, "")}/rooms/${room}/events.json`, {
      method: "POST",
      body: JSON.stringify(payload),
    }).catch((e) => console.warn("Firebase sync error", e));
  } catch (_) {}
}

// 開啟帳號管理彈窗
function openAccountModal() {
  const modal = document.getElementById("modalAccount");
  const listEl = document.getElementById("accountsListContainer");
  listEl.innerHTML = "";

  const currentUser = getCurrentUser();
  const isLeader = currentUser.role === "leader";

  // 若當前使用者不是團主，頂部顯示一鍵升為出國團主的便捷入口
  if (!isLeader) {
    const bannerEl = document.createElement("div");
    bannerEl.className = "promote-self-banner";
    bannerEl.style.cssText =
      "background:#fff7eb; border:1.5px solid #f2cf99; border-radius:10px; padding:10px 12px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; gap:10px;";
    bannerEl.innerHTML = `
      <div>
        <div style="font-weight:700; color:#b45309; font-size:0.9rem;">✈️ 這次換我出國採買！</div>
        <div style="font-size:0.78rem; color:#78350f;">點擊將自己（${escapeHtml(currentUser.name)}）更改為團主，可發起連線與確認購入！</div>
      </div>
      <button type="button" class="mini-btn btn-promote-self" style="background:#f59e0b; color:white; border:none; padding:6px 12px; font-weight:700; white-space:nowrap; cursor:pointer; border-radius:20px;">👑 改為團主</button>
    `;
    bannerEl.querySelector(".btn-promote-self").addEventListener("click", () => {
      if (confirm(`確定要將自己「${currentUser.name}」更改為本次出國採購的【團主】嗎？\n\n（原團主將轉為團友，換你主理現場連線與採買確認）`)) {
        setUserAsLeader(currentUser.id);
      }
    });
    listEl.appendChild(bannerEl);
  }

  state.users.forEach((u) => {
    const isCurrent = u.id === state.currentUserId;
    const canDelete = isLeader && u.role !== "leader";
    const cardEl = document.createElement("div");
    cardEl.className = `account-row-card ${isCurrent ? "active" : ""}`;
    cardEl.innerHTML = `
      <div class="account-info-left">
        <span style="font-size:1.4rem;">${escapeHtml(u.avatar || "👤")}</span>
        <div>
          <strong style="color:var(--ink-main);">${escapeHtml(u.name)}</strong>
          <span class="user-role-tag ${u.role === "leader" ? "leader" : "member"}">${u.role === "leader" ? "👑 團主(代購)" : "團友"}</span>
        </div>
      </div>
      <div class="account-actions-right" style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; justify-content:flex-end;">
        ${isCurrent ? `<span style="font-size:0.75rem; color:var(--accent-terracotta); font-weight:700;">● 使用中</span>` : `<button type="button" class="mini-btn btn-switch-user">切換</button>`}
        ${u.role !== "leader" ? `<button type="button" class="mini-btn btn-make-leader" title="換此人出國時設為團主" style="color:#b45309; border-color:#fcd34d; background:#fffbeb;">👑 設為團主</button>` : `<span style="font-size:0.72rem; color:#b45309; background:#fef3c7; padding:2px 6px; border-radius:4px; font-weight:600;">出國團主</span>`}
        ${canDelete ? `<button type="button" class="mini-btn danger btn-delete-user" title="刪除此團友" style="color:#c04e28; border-color:#f2baaa;">🗑️ 刪除</button>` : ""}
      </div>
    `;

    // 更改為出國團主按鈕事件
    const makeLeaderBtn = cardEl.querySelector(".btn-make-leader");
    if (makeLeaderBtn) {
      makeLeaderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`確定要將「${u.name}」更改為出國團主嗎？\n\n（換其他人出國採買時使用，將負責現場連線與採買確認，原團主將轉為團友身分）`)) {
          setUserAsLeader(u.id);
        }
      });
    }

    // 團主刪除團友按鈕事件
    const delBtn = cardEl.querySelector(".btn-delete-user");
    if (delBtn) {
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const hasOrders = state.posts.some((p) => (p.orders || []).some((o) => o.userId === u.id));
        const hasWishes = state.wishes.some((w) => w.userId === u.id);
        let msg = `確定要刪除團友「${u.name}」這個帳號嗎？`;
        if (hasOrders || hasWishes) {
          msg = `⚠️ 團友「${u.name}」目前已有喊單或許願紀錄！\n確定要刪除此帳號嗎？（該團友的所有相關喊單與許願也將一併清理）`;
        }
        if (confirm(msg)) {
          deleteUserAccount(u.id, u.name);
        }
      });
    }

    cardEl.addEventListener("click", () => {
      if (isCurrent) return;
      state.currentUserId = u.id;
      // 切換身分時一律將許願篩選器重設為 all，確保團主切換後能看見全體成員許願池
      currentWishFilter.userId = "all";
      const userSelect = document.getElementById("wishlistUserFilter");
      if (userSelect) userSelect.value = "all";
      saveGroupbuyState();
      modal.classList.add("hidden");
      renderApp();
      showToast(`已切換為：${u.avatar} ${u.name}`);
    });

    listEl.appendChild(cardEl);
  });

  modal.classList.remove("hidden");
}

// 將指定成員更改為出國團主（換其他人出國時使用）
function setUserAsLeader(userId) {
  const targetUser = state.users.find((u) => u.id === userId);
  if (!targetUser) return;

  // 1. 將指定成員改為 leader，其餘團主轉為 member（明確當期主理人）
  state.users.forEach((u) => {
    if (u.id === userId) {
      u.role = "leader";
    } else if (u.role === "leader") {
      u.role = "member";
    }
  });

  // 2. 切換當前使用者身分為該出國團主
  state.currentUserId = userId;
  currentWishFilter.userId = "all";
  const userSelect = document.getElementById("wishlistUserFilter");
  if (userSelect) userSelect.value = "all";

  // 3. 跨手機即時廣播
  broadcastSyncEvent("UPDATE_USER_ROLE", {
    userId,
    userName: targetUser.name,
    role: "leader",
  });

  saveGroupbuyState();
  openAccountModal(); // 刷新彈窗內身分狀態
  renderApp();
  showToast(`👑 已成功將【${targetUser.name}】更改為出國團主！`);
}

// 團主執行刪除團友帳號
function deleteUserAccount(userId, userName) {
  // 1. 從 users 移除
  state.users = state.users.filter((u) => u.id !== userId);

  // 2. 記錄墓碑標記，防止雲端同步或重整時復活
  if (!state.deletedUserIds) state.deletedUserIds = [];
  if (!state.deletedUserIds.includes(userId)) {
    state.deletedUserIds.push(userId);
  }

  // 3. 清理該用戶的許願
  state.wishes = state.wishes.filter((w) => w.userId !== userId);

  // 4. 清理該用戶在現場連線中的喊單
  state.posts.forEach((p) => {
    if (Array.isArray(p.orders)) {
      p.orders = p.orders.filter((o) => o.userId !== userId);
    }
  });

  // 5. 清理結算款項紀錄
  if (state.payments && state.payments[userId]) {
    delete state.payments[userId];
  }

  // 6. 若當前登入者恰好是被刪除的用戶（防呆），切換回團主
  if (state.currentUserId === userId) {
    const leader = state.users.find((u) => u.role === "leader") || state.users[0];
    state.currentUserId = leader ? leader.id : "";
  }

  // 7. 跨手機廣播
  broadcastSyncEvent("DELETE_USER", { userId, userName });

  saveGroupbuyState();
  openAccountModal(); // 重新渲染彈窗內帳號列表
  renderApp();
  showToast(`已成功刪除團友「${userName}」`);
}

// 通用照片選擇與壓縮預覽處理
function setupPhotoUpload(triggerBtnId, fileInputId, previewImgId, previewWrapId, removeBtnId, onDataReady) {
  const triggerBtn = document.getElementById(triggerBtnId);
  const fileInput = document.getElementById(fileInputId);
  const previewImg = document.getElementById(previewImgId);
  const previewWrap = document.getElementById(previewWrapId);
  const removeBtn = document.getElementById(removeBtnId);

  if (!triggerBtn || !fileInput) return;

  triggerBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      compressImage(event.target.result, 900, 0.75, (compressedUrl) => {
        previewImg.src = compressedUrl;
        previewWrap.classList.remove("hidden");
        triggerBtn.classList.add("hidden");
        onDataReady(compressedUrl);
      });
    };
    reader.readAsDataURL(file);
  });

  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      fileInput.value = "";
      previewImg.src = "";
      previewWrap.classList.add("hidden");
      triggerBtn.classList.remove("hidden");
      onDataReady("");
    });
  }
}

// 圖片壓縮函式 (Canvas)
function compressImage(base64Str, maxWidth, quality, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = base64Str;
  img.onload = () => {
    let width = img.width;
    let height = img.height;
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL("image/jpeg", quality));
  };
  img.onerror = () => callback(base64Str);
}

// 放大原圖 Lightbox
function openLightbox(url) {
  if (!url) return;
  const lb = document.getElementById("groupbuyLightbox");
  const img = document.getElementById("lightboxImg");
  img.src = url;
  lb.classList.remove("hidden");
}

// 匯出 CSV
function exportSettlementCsv() {
  const rate = state.settings.exchangeRate || 0.215;
  let rows = [["團購成員", "商品名稱", "數量", "單價(日圓)", "小計(日圓)", "折合台幣", "付款狀態"]];

  state.wishes
    .filter((w) => w.status === "bought")
    .forEach((w) => {
      const priceYen = w.boughtPriceYen || w.targetPriceYen || 0;
      const subtotalYen = priceYen * (w.qty || 1);
      const twd = Math.round(subtotalYen * rate);
      const isPaid = state.payments[w.userId]?.isPaid ? "已結清" : "待收款";
      rows.push([w.userName, w.title, w.qty || 1, priceYen, subtotalYen, twd, isPaid]);
    });

  const csvContent = "\uFEFF" + rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `日本代購回國分帳結算表_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// 輕量 Toast
function showToast(msg) {
  const toast = document.getElementById("toastBanner");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2800);
}

// 產生並複製採買總清單純文字
function copyShoppingListText() {
  const itemMap = new Map();
  state.wishes.forEach((w) => {
    const key = w.title.trim();
    if (!itemMap.has(key)) itemMap.set(key, { title: key, pending: 0, bought: 0, users: [] });
    const g = itemMap.get(key);
    if (w.status === "bought") g.bought += w.qty || 1;
    else g.pending += w.qty || 1;
    g.users.push(`${w.userAvatar || "🌸"} ${w.userName} x${w.qty || 1}${w.status === "bought" ? "(已購✓)" : ""}`);
  });

  state.posts.forEach((p) => {
    (p.orders || []).forEach((o) => {
      const key = p.title.trim();
      if (!itemMap.has(key)) itemMap.set(key, { title: key, pending: 0, bought: 0, users: [] });
      const g = itemMap.get(key);
      if (o.bought) g.bought += o.qty || 1;
      else g.pending += o.qty || 1;
      g.users.push(`${o.userAvatar || "🍙"} ${o.userName} x${o.qty || 1}${o.bought ? "(已購✓)" : ""}`);
    });
  });

  let lines = [];
  lines.push(`🛒【日本藥妝店現場採買總彙整清單】`);
  lines.push(`================================`);
  let idx = 1;
  let totalPendingCount = 0;
  itemMap.forEach((g) => {
    const isDone = g.pending === 0;
    lines.push(`${idx++}. [${isDone ? "X" : " "}] ${g.title} (需買 ${g.pending} 件 / 總需求 ${g.pending + g.bought} 件)`);
    lines.push(`   成員細項：${g.users.join("、")}`);
    totalPendingCount += g.pending;
  });
  lines.push(`================================`);
  lines.push(`尚有 ${totalPendingCount} 件待採購。`);

  copyTextToClipboard(lines.join("\n"), "📋 已成功複製採買總清單文字！");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
