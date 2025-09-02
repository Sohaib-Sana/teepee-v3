import { createSlice } from "@reduxjs/toolkit";

const papersSlice = createSlice({
  name: "papers",
  initialState: {
    papers: [],
  },
  reducers: {
    setPapers: (state, action) => {
      state.papers = action.payload;
    },
    addPaper: (state, action) => {
      state.papers.push(action.payload);
    },
    updatePaper: (state, action) => {
      const index = state.papers.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.papers[index] = action.payload;
    },
    deletePaper: (state, action) => {
      state.papers = state.papers.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setPapers, addPaper, updatePaper, deletePaper } = papersSlice.actions;
export default papersSlice.reducer;
