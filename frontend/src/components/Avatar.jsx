function Avatar({ user, selectedImage, size }) {
    const widthHeight = `size-${size}`;
    const borderMap = {
        32: "border-4",
        12: "border-2"
    };
    const textSizeMap = {
      32: "text-6xl",
      12: "text-2xl",
    };
    return (
        <div className={`${widthHeight} rounded-full ${borderMap[size]} flex items-center justify-center overflow-hidden`}>
            {user.profilePic || selectedImage ? (
                <img src={user.profilePic || selectedImage} alt="Avatar"
                     className={`${widthHeight} rounded-full object-cover`}/>
            ) : <span className={`${textSizeMap[size]} font-bold`}>{user?.fullName?.at(0)?.toUpperCase()}</span>
            }
        </div>
    );
}

export default Avatar;