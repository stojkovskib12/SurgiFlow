import { useTranslation } from "react-i18next";
import type { CaseStatus, SurgicalCase } from "../../domain/surgicalCases";

export const formatDate = (dateKey: string, locale: string): string => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
};

export const formatTime = (time: string, locale: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const getStatusClass = (status: CaseStatus): string =>
  status.toLowerCase().replaceAll(" ", "-");

export const useHomePageSection = (cases: SurgicalCase[], selectedDate: string) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === "mkd" ? "mk-MK" : "en-US";
  const localizeRoom = (room: string): string => t("common.operatingRoom", {
    number: room.replace(/\D/g, ""),
  });
  const selectedDateCases = cases
    .filter((surgicalCase) => surgicalCase.date === selectedDate)
    .sort((first, second) => first.startTime.localeCompare(second.startTime));
  const documentsReadyCount = cases.filter((surgicalCase) => (
    surgicalCase.documents.every((document) => document.complete)
  )).length;

  return {
    t,
    locale,
    localizeRoom,
    selectedDateCases,
    documentsReadyCount,
    formatDate,
    formatTime,
    getStatusClass,
  };
};
