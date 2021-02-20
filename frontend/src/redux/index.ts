import storage from "redux-persist/lib/storage"
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist"
import productDetailReducer from "./product/productDetailsSlice"
import productListReducer from "./product/productListSlice"
import cartReducer from "./cartSlice"
import userAuthReducer from "./user/userAuthSlice"
import userDetailsReducer from "./user/userDetailsSlice"
import orderCreateReducer from "./order/orderCreateSlice"
import orderDetailsReducer from "./order/orderDetailsSlice"
import orderPayReducer from "./order/orderPaySlice"
import orderListReducer from "./order/orderListSlice"
import userListReducer from "./user/userListSlice"
import userDeleteReducer from "./user/userDeleteSlice"
import userUpdateReducer from "./user/userUpdateSlice"
import productDeleteReducer from "./product/productDeleteSlice"
import productCreateReducer from "./product/productCreateSlice"
import productUpdateReducer from "./product/productUpdateSlice"
import orderListAdminReducer from "./order/orderListAdminSlice"
import orderDeliveredReducer from "./order/orderDeliveredSlice"
import reviewCreateReducer from "./review/reviewCreateSlice"
import productSearchReducer from "./product/productSearchSlice"

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailReducer,
  cart: cartReducer,
  currentUser: userAuthReducer,
  userDetails: userDetailsReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderList: orderListReducer,
  orderListAdmin: orderListAdminReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  orderDelivered: orderDeliveredReducer,
  reviewCreate: reviewCreateReducer,
  productSearch: productSearchReducer,
})

const persistConfig = {
  key: "@proshop",
  storage: storage,
  whitelist: ["cart", "currentUser"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})

let persistor = persistStore(store)

export type rootState = ReturnType<typeof store.getState>
export { store, persistor }
