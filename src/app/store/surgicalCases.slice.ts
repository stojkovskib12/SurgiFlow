import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CaseStatus, NewSurgicalCase, SurgicalCase } from "../../domain/surgicalCases";
import type { ApiSurgicalCase } from "../../services/api.types";
import {
  createSurgicalCase,
  getSurgicalCases,
  toggleSurgicalDocument,
  updateSurgicalCaseStatus,
} from "../../services/surgicalCasesApi";

interface SurgicalCasesState {
  items: SurgicalCase[];
  loading: boolean;
  error: string | null;
}

interface UpdateStatusPayload {
  caseId: string;
  entityId: string;
  status: CaseStatus;
}

interface ToggleDocumentPayload {
  caseId: string;
  caseEntityId: string;
  documentId: string;
  documentEntityId: string;
}

const initialState: SurgicalCasesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchSurgicalCases = createAsyncThunk(
  "surgicalCases/fetchAll",
  async () => (await getSurgicalCases()).map(mapApiCase),
);

export const addSurgicalCase = createAsyncThunk(
  "surgicalCases/create",
  async (surgicalCase: NewSurgicalCase) => mapApiCase(await createSurgicalCase(surgicalCase)),
);

export const changeSurgicalCaseStatus = createAsyncThunk(
  "surgicalCases/updateStatus",
  async (payload: UpdateStatusPayload) => {
    await updateSurgicalCaseStatus(payload.entityId, payload.status);
    return payload;
  },
);

export const changeSurgicalDocument = createAsyncThunk(
  "surgicalCases/toggleDocument",
  async (payload: ToggleDocumentPayload) => {
    await toggleSurgicalDocument(payload.caseEntityId, payload.documentEntityId);
    return payload;
  },
);

const surgicalCasesSlice = createSlice({
  name: "surgicalCases",
  initialState,
  reducers: {
    casesReplaced: (state, action: PayloadAction<SurgicalCase[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurgicalCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurgicalCases.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchSurgicalCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unable to load surgical cases.";
      })
      .addCase(addSurgicalCase.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(changeSurgicalCaseStatus.fulfilled, (state, action) => {
        const surgicalCase = state.items.find((item) => item.id === action.payload.caseId);
        if (surgicalCase) {
          surgicalCase.status = action.payload.status;
        }
      })
      .addCase(changeSurgicalDocument.fulfilled, (state, action) => {
        const surgicalCase = state.items.find((item) => item.id === action.payload.caseId);
        const document = surgicalCase?.documents.find((item) => item.id === action.payload.documentId);
        if (!surgicalCase || !document) {
          return;
        }

        document.complete = !document.complete;
        const areDocumentsComplete = surgicalCase.documents.every((item) => item.complete);
        if (areDocumentsComplete && ["Scheduled", "Pre-op"].includes(surgicalCase.status)) {
          surgicalCase.status = "Ready";
        } else if (!areDocumentsComplete && surgicalCase.status === "Ready") {
          surgicalCase.status = "Pre-op";
        }
      });
  },
});

export const { casesReplaced } = surgicalCasesSlice.actions;

export default surgicalCasesSlice.reducer;

const mapApiCase = (apiCase: ApiSurgicalCase): SurgicalCase => ({
  ...apiCase,
  documents: apiCase.documents.map((document) => ({ ...document })),
});
