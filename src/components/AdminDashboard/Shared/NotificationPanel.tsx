// src/components/NotificationPanelStatic.tsx
import { X, Check, Trash2 } from "lucide-react";

interface NotificationPanelProps {
  onClose: () => void;
}

const staticNotifications = [
  {
    id: "1",
    title: "Parcel #123 has been delivered",
    parcelId: "123",
    isRead: false,
    createdAt: "2025-11-11T09:30:00",
  },
  {
    id: "2",
    title: "New parcel assigned to you",
    parcelId: "124",
    isRead: true,
    createdAt: "2025-11-10T15:20:00",
  },
  {
    id: "3",
    title: "Payment received for parcel #125",
    parcelId: "125",
    isRead: false,
    createdAt: "2025-11-09T11:45:00",
  },
];

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-md bg-white  shadow-xl border border-gray-200 overflow-hidden">
      <div className="border-b border-[#E9EAEB]">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-blue-600">Notifications</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 px-4 pt-2 pb-3">
          You have {staticNotifications.filter((n) => !n.isRead).length} unread
          notifications
        </p>
      </div>

      <div className="divide-y divide-[#B2DDFF] max-h-96 overflow-y-auto">
        {staticNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications available
          </div>
        ) : (
          staticNotifications.map((notif, index) => (
            <div
              key={notif.id}
              className={`px-4 py-3 space-y-1 text-sm cursor-pointer ${
                notif.isRead ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p
                    className={`font-medium ${
                      notif.isRead ? "text-gray-700" : "text-blue-700"
                    }`}
                  >
                    {index + 1}. {notif.title}
                  </p>
                  <p className="text-gray-500">
                    Date & Time: {formatDate(notif.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!notif.isRead && (
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
