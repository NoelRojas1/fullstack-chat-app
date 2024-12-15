import {useAuthStore} from "../store/useAuthStore.js";
import {Camera, Mail, User} from "lucide-react";
import {useState} from "react";
import Avatar from "../components/Avatar.jsx";

function ProfilePage() {
    const {isUpdatingProfile, updateProfile, authUser} = useAuthStore();
    const [selectedImage, setSelectedImage] = useState("");

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            await updateProfile({profilePic: base64Image});
        }
    }

    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    {/* Avatar upload section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar user={authUser} selectedImage={selectedImage} size={32} />
                            {/*<div className="size-32 rounded-full border-4 flex items-center justify-center overflow-hidden">*/}
                            {/*    {authUser.profilePic || selectedImage ? (*/}
                            {/*        <img src={authUser.profilePic || selectedImage} alt="Profile"*/}
                            {/*             className="size-32 rounded-full object-cover"/>*/}
                            {/*    ) : <span className="text-6xl font-bold">{authUser.fullName.at(0).toUpperCase()}</span>*/}
                            {/*    }*/}
                            {/*</div>*/}

                            <label
                                htmlFor="avatar-upload"
                                className={
                                    `absolute size-8 bottom-1 right-1 
                                    bg-base-content flex items-center justify-center 
                                    hover:scale-105 p2 rounded-full cursor-pointer 
                                    transition-all duration-200 
                                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`
                                }
                            >
                                <Camera className="size-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">{isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your avatar"}</p>
                    </div>

                    {/* User info section */}
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="size-4"/>
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="size-4"/>
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member since</span>
                                <span>{authUser?.createdAt?.split("T")[0]}</span>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <span>Account status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;