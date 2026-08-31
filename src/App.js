import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CouponList from "./components/CouponList";
import CouponDetail from "./components/CouponDetail";
import CouponForm from "./components/CouponForm";
import CouponConfirm from "./components/CouponConfirm";

// Fake logged-in user so the role-gated buttons (新規登録・編集・削除) are visible.
const currentUser = { name: "サンプル管理者", role: "管理者" };

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/coupons" replace />} />
      <Route path="/coupons" element={<CouponList currentUser={currentUser} />} />
      <Route path="/coupons/new" element={<CouponForm mode="register" />} />
      <Route path="/coupons/new/confirm" element={<CouponConfirm mode="register" />} />
      <Route path="/coupons/:id" element={<CouponDetail currentUser={currentUser} />} />
      <Route path="/coupons/:id/edit" element={<CouponForm mode="edit" />} />
      <Route path="/coupons/:id/edit/confirm" element={<CouponConfirm mode="edit" />} />
    </Routes>
  );
}

export default App;
