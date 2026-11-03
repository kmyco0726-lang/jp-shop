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
          bought: true,
          boughtPriceYen: 980,
          boughtAt: "2026-11-03 10:20",
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
      targetPriceYen: 1000,
      note: "上班看電腦眼睛乾，希望能買 1 包！",
      imageUrl: "./IMG_8504.JPG",
      status: "bought",
      boughtPriceYen: 980,
      boughtStore: "ダイコクドラッグ 道頓堀店",
      fromPostId: "post_sample_1",
      createdAt: "2026-11-02 21:00",
    },
    {
      id: "wish_sample_2",
      userId: "user_ming",
      userName: "阿明",
      userAvatar: "🍙",
      title: "EVE QUICK DX 頭痛藥 40錠",
      qty: 1,
      targetPriceYen: 1800,
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
};

let state = loadGroupbuyState();
let currentWishFilter = { userId: "all", status: "all" };
let tempPostImageData = "";
let tempWishImageData = "";
let activeConfirmPost = null;

// ==========================================
// 狀態持久化
// ==========================================
function loadGroupbuyState() {
  try {
    const raw = localStorage.getItem(GROUPBUY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        users: parsed.users || DEFAULT_STATE.users,
        posts: parsed.posts || DEFAULT_STATE.posts,
        wishes: parsed.wishes || DEFAULT_STATE.wishes,
        payments: parsed.payments || DEFAULT_STATE.payments,
      };
    }
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
});

function renderApp() {
  renderHeaderUser();
  renderLivePosts();
  renderWishlist();
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
  if (liveCountEl) liveCountEl.textContent = state.posts.length;
  if (wishCountEl) {
    const pendingWishes = state.wishes.filter((w) => w.status === "pending").length;
    wishCountEl.textContent = pendingWishes;
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
        ${post.store ? `<span class="post-store-badge">📍 ${escapeHtml(post.store)}</span>` : ""}
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

        <!-- 操作工具列 -->
        <div class="post-action-toolbar">
          <div class="order-buttons-group">
            <button type="button" class="btn-call-order btn-order-plus1" data-post-id="${post.id}" data-qty="1">
              🙋 我要 +1
            </button>
            <button type="button" class="btn-call-order btn-order-plus2" data-post-id="${post.id}" data-qty="2">
              +2
            </button>
            ${
              myOrder
                ? `<button type="button" class="btn-cancel-order btn-order-cancel" data-post-id="${post.id}">
                    取消我的單
                   </button>`
                : ""
            }
          </div>

          ${
            isLeader
              ? `
            <button type="button" class="btn-purchase-confirm btn-open-purchase-modal" data-post-id="${post.id}">
              🛒 團主確認購入
            </button>
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
    post.orders.push({
      id: "ord_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      qty: addQty,
      bought: false,
      boughtPriceYen: post.priceYen,
      boughtAt: null,
    });
  }

  saveGroupbuyState();
  renderLivePosts();
  renderSettlement();
  showToast(`🎉 ${user.name} 已成功喊單 +${addQty}！`);
}

// 取消當前成員喊單
function handleCancelOrder(postId) {
  const post = state.posts.find((p) => p.id === postId);
  if (!post || !post.orders) return;
  const user = getCurrentUser();

  const idx = post.orders.findIndex((o) => o.userId === user.id);
  if (idx !== -1) {
    if (post.orders[idx].bought) {
      alert("⚠️ 此品項團主已在現場確認購入，若需取消請先與團主聯繫！");
      return;
    }
    post.orders.splice(idx, 1);
    saveGroupbuyState();
    renderLivePosts();
    renderSettlement();
    showToast(`已取消 ${user.name} 的喊單`);
  }
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

      <div class="wish-author-row">
        <span>${escapeHtml(wish.userAvatar || "👤")}</span>
        <strong>${escapeHtml(wish.userName || "成員")}</strong>
        <span>・${escapeHtml(wish.createdAt || "")}</span>
      </div>

      <h4 class="wish-title">${escapeHtml(wish.title)}</h4>

      <div class="wish-meta-row">
        <span class="wish-qty">數量：<strong>${wish.qty || 1} 件</strong></span>
        <span class="wish-price">
          ${
            isBought
              ? `購入價：¥${(wish.boughtPriceYen || wish.targetPriceYen || 0).toLocaleString("ja-JP")}`
              : wish.targetPriceYen
              ? `預算約 ¥${wish.targetPriceYen.toLocaleString("ja-JP")}`
              : "預算未填"
          }
        </span>
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
                  ✅ 現場已買到
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

  saveGroupbuyState();
  renderApp();
  showToast(`🎉 已成功將「${wish.title}」標記為已購入！已計入分帳！`);
}

// ==========================================
// TAB 3: 回國分帳結算 (Settlement)
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
      if (tabTarget === "settlement") document.getElementById("tabSettlement").classList.remove("hidden");
    });
  });

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
        const confirmSwitch = confirm("發起現場連線通常由【團主】發布。是否將當前帳號切換或建立為團主？");
        if (confirmSwitch) {
          currentUser.role = "leader";
          saveGroupbuyState();
          renderHeaderUser();
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
      saveGroupbuyState();
      document.getElementById("modalNewLivePost").classList.add("hidden");
      renderLivePosts();
      updateBadgeCounts();
      showToast(`📢 現場連線發布成功！團友可立即按 +1 喊單！`);
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
      const targetPriceYen = parseInt(document.getElementById("wishTargetPriceInput").value, 10) || null;
      const note = document.getElementById("wishNoteInput").value.trim();

      if (!title) return;
      const user = getCurrentUser();

      state.wishes.unshift({
        id: "wish_" + Date.now(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        title,
        qty,
        targetPriceYen,
        note,
        imageUrl: tempWishImageData || "",
        status: "pending",
        boughtPriceYen: null,
        boughtStore: null,
        fromPostId: null,
        createdAt: new Date().toLocaleString("zh-TW", { hour12: false, month: "2-digit", day: "2-digit" }),
      });

      saveGroupbuyState();
      document.getElementById("modalNewWish").classList.add("hidden");
      renderWishlist();
      updateBadgeCounts();
      showToast(`✨ 許願成功！已加入「${user.name}」的待採購許願清單`);
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
}

// 開啟帳號管理彈窗
function openAccountModal() {
  const modal = document.getElementById("modalAccount");
  const listEl = document.getElementById("accountsListContainer");
  listEl.innerHTML = "";

  state.users.forEach((u) => {
    const isCurrent = u.id === state.currentUserId;
    const cardEl = document.createElement("div");
    cardEl.className = `account-row-card ${isCurrent ? "active" : ""}`;
    cardEl.innerHTML = `
      <div class="account-info-left">
        <span style="font-size:1.4rem;">${escapeHtml(u.avatar || "👤")}</span>
        <div>
          <strong style="color:var(--ink-main);">${escapeHtml(u.name)}</strong>
          <span class="user-role-tag ${u.role === "leader" ? "leader" : "member"}">${u.role === "leader" ? "團主(代購)" : "團友"}</span>
        </div>
      </div>
      <div>
        ${isCurrent ? `<span style="font-size:0.75rem; color:var(--accent-terracotta); font-weight:700;">● 使用中</span>` : `<button type="button" class="mini-btn">切換</button>`}
      </div>
    `;

    cardEl.addEventListener("click", () => {
      state.currentUserId = u.id;
      saveGroupbuyState();
      modal.classList.add("hidden");
      renderApp();
      showToast(`已切換為：${u.avatar} ${u.name}`);
    });

    listEl.appendChild(cardEl);
  });

  modal.classList.remove("hidden");
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

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
