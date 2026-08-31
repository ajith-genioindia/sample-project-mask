import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createCoupon, updateCoupon } from "../api/couponApi";

// クーポン登録確認・編集確認画面
function CouponConfirm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state?.form;

  if (!form) return null;

  const handleBack = () => {
    navigate(mode === "edit" ? `/coupons/${id}/edit` : "/coupons/new", { state: { form } });
  };

  const handleSubmit = async () => {
    if (mode === "edit") {
      await updateCoupon(id, form);
    } else {
      await createCoupon(form);
    }
    navigate("/coupons");
  };

  return (
    <div className="coupon-confirm">
      <h1>{mode === "edit" ? "リワードクーポンマスタ変更確認" : "リワードクーポンマスタ登録確認"}</h1>
      <dl>
        <dt>クーポンID</dt><dd>{mode === "edit" ? id : "自動採番"}</dd>
        <dt>クーポン名称</dt><dd>{form.name}</dd>
        <dt>期間（開始日）</dt><dd>{form.startDate}</dd>
        <dt>期間（終了日）</dt><dd>{form.endDate}</dd>
        <dt>種別</dt><dd>{form.type}</dd>
        <dt>承認</dt><dd>{form.approval}</dd>
      </dl>

      <button onClick={handleBack}>修正する</button>
      <button onClick={handleSubmit}>{mode === "edit" ? "更新する" : "登録する"}</button>
    </div>
  );
}

export default CouponConfirm;
