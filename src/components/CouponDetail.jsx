import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoupon } from "../api/couponApi";

// クーポン詳細画面
function CouponDetail({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);

  const canManage = currentUser?.role === "管理者" || currentUser?.role === "利用者";

  useEffect(() => {
    getCoupon(id).then(setCoupon);
  }, [id]);

  if (!coupon) return null;

  return (
    <div className="coupon-detail">
      <h1>リワードクーポンマスタ詳細</h1>
      <dl>
        <dt>クーポンID</dt><dd>{coupon.id}</dd>
        <dt>クーポンコード</dt><dd>{coupon.code}</dd>
        <dt>オファーコード</dt><dd>{coupon.offerCode}</dd>
        <dt>クーポン名称</dt><dd>{coupon.name}</dd>
        <dt>期間（開始日）</dt><dd>{coupon.startDate}</dd>
        <dt>期間（終了日）</dt><dd>{coupon.endDate}</dd>
        <dt>詳細</dt><dd>{coupon.description}</dd>
        <dt>種別</dt><dd>{coupon.type}</dd>
        <dt>承認</dt><dd>{coupon.approval}</dd>
      </dl>

      <button onClick={() => navigate("/coupons")}>一覧へ戻る</button>
      {canManage && <button onClick={() => navigate(`/coupons/${id}/edit`)}>編集</button>}
    </div>
  );
}

export default CouponDetail;
