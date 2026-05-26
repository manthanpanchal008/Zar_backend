import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  menuOpen: boolean;
  activeSection: string;
  modalOpen: boolean;
  modalContent: string | null;
}

const initialState: UiState = {
  menuOpen: false,
  activeSection: 'home',
  modalOpen: false,
  modalContent: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMenu(state) {
      state.menuOpen = !state.menuOpen;
    },
    closeMenu(state) {
      state.menuOpen = false;
    },
    setActiveSection(state, action: PayloadAction<string>) {
      state.activeSection = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.modalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.modalContent = null;
    },
  },
});

export const { toggleMenu, closeMenu, setActiveSection, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
