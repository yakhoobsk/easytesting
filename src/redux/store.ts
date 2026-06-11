import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/settings/userSlice'
import authSlice from './slices/authSlice'
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist"
import { authTransform } from '../utils/authTransform'
import piplinesSlice from './slices/settings/piplinesSlice'
import branchSlice from './slices/settings/branchSlice'
import IstmSlice from './slices/settings/istmSlice'
import AuditSlice from './slices/settings/auditSlice'
import notificationSlice from './slices/settings/notificationSlice'
import GithistorySlice from './slices/settings/gitHistorySlice'
import GitconfigSlice from './slices/settings/gitconfigrationSlice'
import RollbackSlice from './slices/settings/rollbackSlice'
import ApprovalsSlice from './slices/settings/approvalsSlice'
import DashboardSlice from './slices/settings/dasboardSlice'
import EmailNotificationSlice from './slices/settings/emailnotificationSlice'
import BoomiConfigSlice from './slices/settings/boomiConfigrationSlice'
import environmentSlice from './slices/settings/environmentSlice'
import resultSlice from './slices/settings/resultSlice'
import StatusSlice from './slices/settings/statusconfigSlice'
import AiTestCases from './slices/aitestcasesSlice'

const storageEngine = (storage as any).default || storage;
const authPersistConfig = {
  key: "auth",
  storage: storageEngine,
  transforms: [authTransform],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userSlice.reducer,
    Piplines: piplinesSlice.reducer,
    branch: branchSlice.reducer,
    ISTM: IstmSlice.reducer,
    audit: AuditSlice.reducer,
    notification: notificationSlice.reducer,
    gitHistory: GithistorySlice.reducer,
    gitConfig: GitconfigSlice.reducer,
    rollback: RollbackSlice.reducer,
    approvals: ApprovalsSlice.reducer,
    dashboard: DashboardSlice.reducer,
    email: EmailNotificationSlice.reducer,
    boomiConfig: BoomiConfigSlice.reducer,
    environment: environmentSlice.reducer,
    result: resultSlice.reducer,
    status: StatusSlice.reducer,
    Ai : AiTestCases.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch