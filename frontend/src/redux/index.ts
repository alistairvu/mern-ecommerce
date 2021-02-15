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
import productDetailReducer from "./productDetailSlice"
import productListReducer from "./productListSlice"
import cartReducer from "./cartSlice"
import userAuthReducer from "./userAuthSlice"
import userDetailsReducer from "./userDetailsSlice"
import orderCreateReducer from "./orderCreateSlice"

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailReducer,
  cart: cartReducer,
  currentUser: userAuthReducer,
  userDetails: userDetailsReducer,
  orderCreate: orderCreateReducer,
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
