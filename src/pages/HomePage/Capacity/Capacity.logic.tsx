import { useEffect, type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceContext } from "../../../app/WorkspaceContext/WorkspaceContext";
import { getCapacity } from "../../../services/surgicalCasesApi";
import type { HomePageViewProps } from "../HomePageView.types";
import CapacityView from "./Capacity.view";

type CapacityPageProps = Pick<
  HomePageViewProps,
  "cases" | "selectedDate" | "onSelectedDateChange"
>;

const Capacity = (props: CapacityPageProps): JSX.Element => {
  const { setNotice } = useWorkspaceContext();
  const { selectedDate } = props;
  const {
    data: summary = null,
    isError,
  } = useQuery({
    queryKey: ["capacity", selectedDate],
    queryFn: () => getCapacity(selectedDate),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      setNotice({ key: "notifications.apiUnavailable" });
    }
  }, [isError, setNotice]);

  return <CapacityView {...props} capacitySummary={summary} />;
};

export default Capacity;
