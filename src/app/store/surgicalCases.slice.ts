import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CaseStatus, NewSurgicalCase, SurgicalCase } from "../../domain/surgicalCases";
import { createDemoCases, readCasesFromStorage, REQUIRED_DOCUMENTS } from "../../domain/surgicalCases";

const surgicalCasesSlice = createSlice({
  name: "surgicalCases",
  initialState: readCasesFromStorage,
  reducers: {
    caseAdded: (state, action: PayloadAction<NewSurgicalCase>) => {
      const largestId = state.reduce((largest, surgicalCase) => {
        const numericId = Number(surgicalCase.id.replace("SF-", ""));
        return Number.isNaN(numericId) ? largest : Math.max(largest, numericId);
      }, 2040);
      const newCase: SurgicalCase = {
        ...action.payload,
        id: `SF-${largestId + 1}`,
        status: "Scheduled",
        documents: REQUIRED_DOCUMENTS.map((label) => ({
          id: label.toLowerCase().replaceAll(" ", "-"),
          label,
          complete: false,
        })),
      };

      state.push(newCase);
    },
    caseStatusChanged: (state, action: PayloadAction<{ caseId: string; status: CaseStatus }>) => {
      const surgicalCase = state.find((item) => item.id === action.payload.caseId);

      if (surgicalCase) {
        surgicalCase.status = action.payload.status;
      }
    },
    documentToggled: (state, action: PayloadAction<{ caseId: string; documentId: string }>) => {
      const surgicalCase = state.find((item) => item.id === action.payload.caseId);

      if (!surgicalCase) {
        return;
      }

      const document = surgicalCase.documents.find((item) => item.id === action.payload.documentId);
      if (document) {
        document.complete = !document.complete;
      }

      const areDocumentsComplete = surgicalCase.documents.every((item) => item.complete);
      if (areDocumentsComplete && ["Scheduled", "Pre-op"].includes(surgicalCase.status)) {
        surgicalCase.status = "Ready";
      } else if (!areDocumentsComplete && surgicalCase.status === "Ready") {
        surgicalCase.status = "Pre-op";
      }
    },
    demoCasesRestored: () => createDemoCases(),
  },
});

export const {
  caseAdded,
  caseStatusChanged,
  documentToggled,
  demoCasesRestored,
} = surgicalCasesSlice.actions;

export default surgicalCasesSlice.reducer;
