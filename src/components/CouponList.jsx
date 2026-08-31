import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { searchCoupons, deleteCoupon } from "../api/couponApi";

const PAGE_SIZE = 20;

// クーポン一覧画面
// Search fields: クーポンID / クーポン名称 / 期間（開始日・終了日） / 種別 / 承認
function CouponList({ currentUser }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    couponId: "",
    couponName: "",
    startDate: "",
    endDate: "",
    type: "すべて", // すべて / QR / 来店
    approval: "すべて", // すべて / 未承認 / 承認
  });
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [sortDesc, setSortDesc] = useState(true);
  const [total, setTotal] = useState(0);

  const canManage = currentUser?.role === "管理者" || currentUser?.role === "利用者";

  // Plain function (not useCallback) so it always closes over the CURRENT
  // filters/page/sortDesc when called — no stale-filter bug.
  const handleSearch = async (overrides = {}) => {
    const result = await searchCoupons({
      ...filters,
      page: overrides.page ?? page,
      sortDesc: overrides.sortDesc ?? sortDesc,
    });
    setCoupons(result.items);
    setTotal(result.total);
  };

  // Load data as soon as the screen opens (e.g. after 一覧へ戻る from a save),
  // and again whenever the page or sort order changes.
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortDesc]);

  const handleSearchClick = () => {
    if (page === 1) {
      handleSearch({ page: 1 }); // already on page 1, effect above won't re-fire
    } else {
      setPage(1); // triggers the effect above, which refetches with current filters
    }
  };

  const handleSort = () => {
    setSortDesc((prev) => !prev);
  };

  // Delete happens right here in the list — no separate confirm screen/route,
  // just a native confirm dialog, then remove from localStorage and refresh.
  const handleDelete = async (id, name) => {
    if (!window.confirm(`「${name}」（${id}）を削除しますか？`)) return;
    await deleteCoupon(id);
    handleSearch();
  };

  return (
    <div className="coupon-list">
      <h1>リワードクーポンマスタ一覧</h1>

      <div className="search-area">
        <input
          placeholder="クーポンID"
          value={filters.couponId}
          onChange={(e) => setFilters({ ...filters, couponId: e.target.value })}
        />
        <input
          placeholder="クーポン名称"
          value={filters.couponName}
          onChange={(e) => setFilters({ ...filters, couponName: e.target.value })}
        />
        <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />

        <fieldset>
          <legend>種別</legend>
          {["すべて", "QR", "来店"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="type"
                checked={filters.type === opt}
                onChange={() => setFilters({ ...filters, type: opt })}
              />
              {opt}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>承認</legend>
          {["すべて", "未承認", "承認"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="approval"
                checked={filters.approval === opt}
                onChange={() => setFilters({ ...filters, approval: opt })}
              />
              {opt}
            </label>
          ))}
        </fieldset>

        <button onClick={handleSearchClick}>検索</button>
        {canManage && <button onClick={() => navigate("/coupons/new")}>新規登録</button>}
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={handleSort}>クーポンID</th>
            <th>クーポンコード</th>
            <th>オファーコード</th>
            <th>クーポン名称</th>
            <th>期間</th>
            <th>種別</th>
            <th>承認</th>
            {canManage && <th>操作</th>}
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.code}</td>
              <td>{c.offerCode}</td>
              <td><Link to={`/coupons/${c.id}`}>{c.name}</Link></td>
              <td>{c.startDate} 〜 {c.endDate}</td>
              <td>{c.type}</td>
              <td>{c.approval}</td>
              {canManage && (
                <td>
                  <button onClick={() => navigate(`/coupons/${c.id}/edit`)}>編集</button>
                  <button onClick={() => handleDelete(c.id, c.name)}>削除</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>全{total}件</span>
        <span>{(page - 1) * PAGE_SIZE + 1}件〜{Math.min(page * PAGE_SIZE, total)}件</span>
        {page > 1 && <button onClick={() => setPage(1)}>最初</button>}
        {page > 1 && <button onClick={() => setPage(page - 1)}>前へ</button>}
        <span>{page}</span>
        {page * PAGE_SIZE < total && <button onClick={() => setPage(page + 1)}>次へ</button>}
        {page * PAGE_SIZE < total && <button onClick={() => setPage(Math.ceil(total / PAGE_SIZE))}>最後</button>}
      </div>
    </div>
  );
}

export default CouponList;
