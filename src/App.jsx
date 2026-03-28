import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import StoreListPage from "./pages/StoreListPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import OrderListPage from "./pages/OrderListPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PaymentPage from "./pages/PaymentPage";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CreateMenuPage from "./pages/CreateMenuPage";
import CreateStorePage from "./pages/CreateStorePage";
import CartPage from "./pages/CartPage";
import StoreOrderListPage from "./pages/StoreOrderListPage";
import EditMenuPage from "./pages/EditMenuPage";
import RiderOrderListPage from "./pages/RiderOrderListPage";
import RiderStoreListPage from "./pages/RiderStoreListPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stores" element={<StoreListPage />} />
        <Route path="/stores/:storeId" element={<StoreDetailPage />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/store/orders" element={<StoreOrderListPage />} />

        <Route
          path="/stores/new"
          element={
            <ProtectedRoute>
              <CreateStorePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stores/:storeId/menus/new"
          element={
            <ProtectedRoute>
              <CreateMenuPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stores/:storeId/menus/:menuId/edit"
          element={
            <ProtectedRoute>
              <EditMenuPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rider/orders"
          element={
            <ProtectedRoute>
              <RiderOrderListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/riderOrders"
          element={
            <ProtectedRoute>
              <RiderStoreListPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;