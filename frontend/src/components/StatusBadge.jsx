import React from "react";
import {
  Hourglass,
  UserCheck,
  Loader2,
  CheckCircle,
  XCircle,
  SearchCheck,
} from "lucide-react";

function StatusBadge({ status, className = "" }) {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Assigned: "bg-blue-100 text-blue-700",
    "In Process": "bg-indigo-100 text-indigo-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-500",
    Cancelled: "bg-red-100 text-red-500",
    "In Review": "bg-blue-100 text-blue-700",
    Delay: "bg-red-100 text-red-500",
  };

  const statusIcons = {
    Pending: <Hourglass size={16} className="mr-1" />,
    Assigned: <UserCheck size={16} className="mr-1" />,
    "In Process": <Loader2 size={16} className="mr-1 animate-spin" />,
    Completed: <CheckCircle size={16} className="mr-1" />,
    Rejected: <XCircle size={16} className="mr-1" />,
    "In Review": <SearchCheck  size={16} className="mr-1" />,
    Cancelled: <XCircle size={16} className="mr-1" />,
  };

  return (
    <span
       className={`px-3 py-1 rounded-full font-semibold w-fit flex items-center ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      } ${className}`} 
    >
      {statusIcons[status]}
      {status}
    </span>
  );
}

export default StatusBadge;