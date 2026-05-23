import { createContext, useState, useEffect } from "react";
import { format, isToday, isTomorrow } from "date-fns";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [loading, setLoading] = useState(false);

  const formatedDate = (createdAt) => {
    const date = new Date(createdAt);

    const datePart = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timePart = date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart}, ${timePart}`;
  };

  const formatExpectedCompletion = (expectedTime) => {
    const target = new Date(expectedTime);

    const timeStr = format(target, "hh:mm a"); // 02:15 PM is formate mai milega

    if (isToday(target)) return `Expected completion: today by ${timeStr}`;
    if (isTomorrow(target))
      return `Expected completion: tomorrow by ${timeStr}`;

    return `Expected completion on ${format(target, "dd/MM/yyyy")} by ${timeStr}`;
  };

  const value = {
    formatedDate,
    loading,
    setLoading,
    formatExpectedCompletion,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
