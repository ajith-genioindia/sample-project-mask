import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CouponList from "../components/CouponList";

test("renders the coupon list heading", () => {
  render(
    <MemoryRouter>
      <CouponList currentUser={{ role: "管理者" }} />
    </MemoryRouter>
  );
  expect(screen.getByText(/リワードクーポンマスタ一覧/i)).toBeInTheDocument();
});

test("shows the search button", () => {
  render(
    <MemoryRouter>
      <CouponList currentUser={{ role: "管理者" }} />
    </MemoryRouter>
  );
  expect(screen.getByText("検索")).toBeInTheDocument();
});

test("hides the new-registration button for a viewer without permission", () => {
  render(
    <MemoryRouter>
      <CouponList currentUser={{ role: "閲覧者" }} />
    </MemoryRouter>
  );
  expect(screen.queryByText("新規登録")).not.toBeInTheDocument();
});
