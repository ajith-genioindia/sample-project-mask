// Sample project: no real backend exists (REACT_APP_API_URL in .env is a fake
// domain). Data is persisted to the browser's localStorage instead, so the
// full CRUD flow (search / detail / register / edit / delete) works end to
// end without a server. Swap this file out for real `fetch` calls when
// pointing the pattern at an actual backend.

const STORAGE_KEY = "sample_coupon_master_coupons";
const PAGE_SIZE = 20;

const SEED_COUPONS = [
  {
    id: "C0001",
    code: "SUMMER10",
    offerCode: "OFR-SUMMER10",
    name: "サマーセール10%オフ",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    description: "夏季限定、来店時に提示で10%オフになるクーポン。",
    type: "来店",
    approval: "承認",
  },
  {
    id: "C0002",
    code: "QRPOINT2X",
    offerCode: "OFR-QRPOINT2X",
    name: "QR来店ポイント2倍",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    description: "QRコードを読み取って来店するとポイントが2倍になる。",
    type: "QR",
    approval: "承認",
  },
  {
    id: "C0003",
    code: "NEWMEMBER500",
    offerCode: "OFR-NEWMEMBER500",
    name: "新規会員限定500円引き",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    description: "新規会員登録者向けの限定割引クーポン。",
    type: "来店",
    approval: "未承認",
  },
];

function loadAll() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COUPONS));
      return [...SEED_COUPONS];
    }
    return JSON.parse(raw);
  } catch (e) {
    // localStorage unavailable (e.g. private mode) or corrupted data — fall
    // back to the seed data for this session only.
    console.warn("couponApi: localStorage unavailable, using in-memory seed data.", e);
    return [...SEED_COUPONS];
  }
}

function saveAll(coupons) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.warn("couponApi: failed to persist to localStorage.", e);
  }
}

function nextId(coupons) {
  const max = coupons.reduce((m, c) => {
    const n = parseInt(String(c.id).replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return `C${String(max + 1).padStart(4, "0")}`;
}

export async function searchCoupons(params = {}) {
  const {
    couponId = "",
    couponName = "",
    startDate = "",
    endDate = "",
    type = "すべて",
    approval = "すべて",
    page = 1,
    sortDesc = true,
  } = params;

  let items = loadAll();

  if (couponId) items = items.filter((c) => c.id === couponId); // 完全一致
  if (couponName) items = items.filter((c) => c.name.includes(couponName)); // 部分一致
  if (startDate) items = items.filter((c) => c.endDate >= startDate); // 期間一致
  if (endDate) items = items.filter((c) => c.startDate <= endDate); // 期間一致
  if (type !== "すべて") items = items.filter((c) => c.type === type);
  if (approval !== "すべて") items = items.filter((c) => c.approval === approval);

  items = [...items].sort((a, b) =>
    sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)
  );

  const total = items.length;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  return { items: pageItems, total };
}

export async function getCoupon(id) {
  const coupons = loadAll();
  return coupons.find((c) => c.id === id) || null;
}

export async function createCoupon(payload) {
  const coupons = loadAll();
  const coupon = { ...payload, id: nextId(coupons) };
  coupons.push(coupon);
  saveAll(coupons);
  return coupon;
}

export async function updateCoupon(id, payload) {
  const coupons = loadAll();
  const idx = coupons.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error(`Coupon not found: ${id}`);
  const updated = { ...coupons[idx], ...payload, id };
  coupons[idx] = updated;
  saveAll(coupons);
  return updated;
}

export async function deleteCoupon(id) {
  const coupons = loadAll();
  const next = coupons.filter((c) => c.id !== id);
  saveAll(next);
  return next.length !== coupons.length;
}
