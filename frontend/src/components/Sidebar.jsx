import {useEffect, useState} from "react";
import {Users} from "lucide-react";
import {useChatStore} from "../store/useChatStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import Avatar from "./Avatar.jsx";
import {useAuthStore} from "../store/useAuthStore.js";

function Sidebar() {
    const { getUsers, setSelectedUser, selectedUser, users, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;

    if(isUsersLoading) return <SidebarSkeleton />

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>

                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={() => setShowOnlineOnly((prev) => !prev)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">{`(${onlineUsers.length - 1} online)`}</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300" : ""}`}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <Avatar user={user} size={12} />
                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                            )}
                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    )
}

export default Sidebar;