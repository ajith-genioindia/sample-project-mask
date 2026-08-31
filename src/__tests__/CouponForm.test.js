import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CouponForm from "../components/CouponForm";

test("shows validation errors when required fields are empty", () => {
  render(
    <MemoryRouter>
      <CouponForm mode="register" />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText("確認"));
  expect(screen.getByText("クーポン名称は必須です。")).toBeInTheDocument();
});

test("coupon ID field is disabled and shows 自動採番 in register mode", () => {
  render(
    <MemoryRouter>
      <CouponForm mode="register" />
    </MemoryRouter>
  );
  expect(screen.getByDisplayValue("自動採番")).toBeDisabled();
});
