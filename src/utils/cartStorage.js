const CART_KEY = "cart";

export const getCart = () => {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (newItem) => {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) => item.menuId === newItem.menuId && item.storeId === newItem.storeId
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);
};

export const updateCartItemQuantity = (menuId, storeId, quantity) => {
  const cart = getCart().map((item) =>
    item.menuId === menuId && item.storeId === storeId
      ? { ...item, quantity: quantity < 1 ? 1 : quantity }
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

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

export const getCartTotalPrice = () => {
  return getCart().reduce((sum, item) => sum + item.menuPrice * item.quantity, 0);
};