const CART_KEY = "cart";

export const getCart = () => {
  const saved = localStorage.getItem(CART_KEY);

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.storeId != null &&
        item.storeName != null &&
        item.menuId != null &&
        item.menuName != null &&
        item.menuPrice != null &&
        item.quantity != null
    );
  } catch (error) {
    console.error("장바구니 파싱 실패:", error);
    return [];
  }
};

export const saveCart = (cart) => {
  const safeCart = Array.isArray(cart)
    ? cart.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.storeId != null &&
          item.storeName != null &&
          item.menuId != null &&
          item.menuName != null &&
          item.menuPrice != null &&
          item.quantity != null
      )
    : [];

  localStorage.setItem(CART_KEY, JSON.stringify(safeCart));
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

export const hasDifferentStoreInCart = (storeId) => {
  const cart = getCart();

  if (cart.length === 0) return false;

  const firstItem = cart[0];
  if (!firstItem || firstItem.storeId == null) return false;

  return firstItem.storeId !== storeId;
};

export const addToCart = (newItem) => {
  if (
    !newItem ||
    newItem.storeId == null ||
    newItem.storeName == null ||
    newItem.menuId == null ||
    newItem.menuName == null ||
    newItem.menuPrice == null ||
    newItem.quantity == null
  ) {
    console.error("잘못된 장바구니 데이터:", newItem);
    return;
  }

  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) => item.menuId === newItem.menuId && item.storeId === newItem.storeId
  );

  if (existingIndex !== -1) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: Number(cart[existingIndex].quantity) + Number(newItem.quantity),
    };
  } else {
    cart.push({
      ...newItem,
      menuPrice: Number(newItem.menuPrice),
      quantity: Math.max(1, Number(newItem.quantity)),
    });
  }

  saveCart(cart);
};

export const updateCartItemQuantity = (menuId, storeId, quantity) => {
  const safeQuantity = Math.max(1, Number(quantity) || 1);

  const cart = getCart().map((item) =>
    item.menuId === menuId && item.storeId === storeId
      ? { ...item, quantity: safeQuantity }
      : item
  );

  saveCart(cart);
};

export const removeCartItem = (menuId, storeId) => {
  const cart = getCart().filter(
    (item) => !(item.menuId === menuId && item.storeId === storeId)
  );

  saveCart(cart);
};

export const getCartTotalPrice = () => {
  return getCart().reduce(
    (sum, item) => sum + Number(item.menuPrice) * Number(item.quantity),
    0
  );
};