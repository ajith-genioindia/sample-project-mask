import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getCoupon } from "../api/couponApi";

const EMPTY_FORM = {
  code: "",
  offerCode: "",
  name: "",
  startDate: "",
  endDate: "",
  description: "",
  type: "来店", // 来店 / QR
  approval: "未承認", // 未承認 / 承認
};

// クーポン登録・編集画面
function CouponForm({ mode }) {
  // mode: "register" | "edit"
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Coming back via 修正する (from the confirm screen) carries the in-progress
  // input in route state — restore it instead of re-fetching/blanking it.
  const [form, setForm] = useState(location.state?.form || EMPTY_FORM);
  const [errors, setErrors] = useState([]);

  // First time landing on the edit screen (not a 修正する round-trip): load
  // the existing coupon so its current values are actually editable.
  useEffect(() => {
    if (mode === "edit" && !location.state?.form) {
      getCoupon(id).then((coupon) => {
        if (coupon) {
          setForm({
            code: coupon.code,
            offerCode: coupon.offerCode,
            name: coupon.name,
            startDate: coupon.startDate,
            endDate: coupon.endDate,
            description: coupon.description,
            type: coupon.type,
            approval: coupon.approval,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const validate = () => {
    const errs = [];
    if (!form.name) errs.push("クーポン名称は必須です。");
    if (!form.startDate) errs.push("期間（開始日）は必須です。");
    if (!form.endDate) errs.push("期間（終了日）は必須です。");
    return errs;
  };

  const handleConfirm = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    navigate(mode === "edit" ? `/coupons/${id}/edit/confirm` : "/coupons/new/confirm", {
      state: { form },
    });
  };

  return (
    <div className="coupon-form">
      <h1>{mode === "edit" ? "リワードクーポンマスタ変更" : "リワードクーポンマスタ登録"}</h1>

      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <label>
        クーポンID
        <input value={mode === "edit" ? id : "自動採番"} disabled />
      </label>
      <label>
        クーポンコード
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
      </label>
      <label>
        オファーコード
        <input value={form.offerCode} onChange={(e) => setForm({ ...form, offerCode: e.target.value })} />
      </label>
      <label>
        クーポン名称
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label>
        期間（開始日）
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
      </label>
      <label>
        期間（終了日）
        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      </label>
      <label>
        詳細
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>

      <fieldset>
        <legend>種別</legend>
        {["来店", "QR"].map((opt) => (
          <label key={opt}>
            <input type="radio" name="type" checked={form.type === opt} onChange={() => setForm({ ...form, type: opt })} />
            {opt}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>承認</legend>
        {["承認", "未承認"].map((opt) => (
          <label key={opt}>
            <input type="radio" name="approval" checked={form.approval === opt} onChange={() => setForm({ ...form, approval: opt })} />
            {opt}
          </label>
        ))}
      </fieldset>

      <button onClick={handleConfirm}>確認</button>
    </div>
  );
}

export default CouponForm;
