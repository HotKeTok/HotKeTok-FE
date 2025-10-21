// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

const initialState = {
  role: 'guest', // 'tenant' | 'landlord' | 'guest'
  accessToken: '',
  refreshToken: '',
  hydrated: false, // persist 복원 완료 플래그
  onBoardingStageFlag: false, // 온보딩 진행 여부
};

export const useAuthStore = create(
  subscribeWithSelector(
    persist(
      set => ({
        ...initialState,

        setRole: role => set({ role }),
        clearRole: () => set({ role: 'guest' }),

        setTokens: ({ accessToken = '', refreshToken = '' }) => set({ accessToken, refreshToken }),
        clearTokens: () => set({ accessToken: '', refreshToken: '' }),

        setOnBoardingStageFlag: () => set({ onBoardingStageFlag: true }),
        clearOnBoardingStageFlag: () => set({ onBoardingStageFlag: false }),

        logout: () => set({ ...initialState, hydrated: true }),

        _setHydrated: v => set({ hydrated: v }),
      }),
      {
        name: 'auth', // localStorage key
        partialize: state => ({
          role: state.role,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          onBoardingStageFlag: state.onBoardingStageFlag,
        }),
        onRehydrateStorage: () => state => {
          if (state?._setHydrated) state._setHydrated(true);
        },
      }
    )
  )
);
