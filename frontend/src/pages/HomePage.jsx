import {useEffect, useRef, useState} from "react";
import {Image, MessageSquare, Send, X, Mic, Languages} from "lucide-react";
import {useChatStore} from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar";
import {useAuthStore} from "../store/useAuthStore.js";
import Avatar from "../components/Avatar.jsx";
import MessageSkeleton from "../components/skeletons/MessageSkeleton.jsx";
import toast from "react-hot-toast";
import {formatMessageTime} from "../lib/utils.js";


function NoChatSelected() {
    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
            <div className="max-w-md text-center space-y-6">
                {/* Icon Display */}
                <div className="flex justify-center gap-4 mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                            <MessageSquare className="w-8 h-8 text-primary " />
                        </div>
                    </div>
                </div>

                {/* Welcome Text */}
                <h2 className="text-2xl font-bold">Welcome to PingMe!</h2>
                <p className="text-base-content/60">
                    Select a conversation from the sidebar to start chatting
                </p>
            </div>
        </div>
    );
}

function ChatContainer() {
    const messageContainerEndRef = useRef(null);

    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages
    } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();

        // cleanup function
        return () => unsubscribeFromMessages();
    }, [getMessages, subscribeToMessages, selectedUser._id]);

    useEffect(() => {
        if(messageContainerEndRef.current && messages.length > 0) {
            messageContainerEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if(isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        key={message._id}
                        ref={messageContainerEndRef}
                    >
                        <div className="chat-image avatar">
                            <Avatar user={message.senderId === authUser._id ? authUser : selectedUser} size={12} />
                        </div>

                        <div className="chat-header mb-1">
                            <time className="text-sm opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
                        </div>

                        <div className="chat-bubble flex flex-col group">
                            {message.image && (
                                <img src={message.image} alt="attachment" className="sm:max-w-[200px] rounded-md mb-2" />
                            )}
                            {message.text && <Message message={message.text} />}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
}

function Message({message}) {
    const [originalMessage] = useState(message);
    const [translatedMessage, setTranslatedMessage] = useState('');

    const isTranslationSupported = () => {
        return "translation" in self && "createTranslator" in self.translation;
    }

    const translateMessage = async (message) => {
        if(isTranslationSupported()) {
            // Translation API supported
            const translator = await window.translation.createTranslator({
                sourceLanguage: "en",
                targetLanguage: "es",
            });
            return await translator.translate(message);
        }
    }

    const handleTranslation = async () => {
        if (!translatedMessage) {
            setTranslatedMessage(await translateMessage(originalMessage));
            return;
        }
        setTranslatedMessage("");
    }

    return (
        <div>
            <p>{translatedMessage ? translatedMessage : originalMessage}</p>
            {isTranslationSupported() && <span
                onClick={handleTranslation}
                className="transition-all duration-200 ease-in-out hidden hover:text-base-content
                           group-hover:inline-block hover:cursor-pointer hover:bg-accent rounded-lg p-2">
                <Languages />
            </span>}
        </div>
    );
}

function ChatHeader() {
    const {selectedUser, setSelectedUser} = useChatStore();
    const {onlineUsers} = useAuthStore();

    return <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <Avatar user={selectedUser} size={12}/>

                {/* User info */}
                <div>
                    <h3 className="font-medium">{selectedUser.fullName}</h3>
                    <p className="text-sm text-base-content/70">
                        {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            {/* Close btn */}
            <button
                onClick={() => setSelectedUser(null)}
            >
                <X />
            </button>
        </div>
    </div>;
}

function MessageInput() {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [isCopyingAudioInput, setIsCopyingAudioInput] = useState(false);
    const [isSupportSpeechRecognition, setSupportSpeechRecognition] = useState(false);

    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file.type.startsWith("image/")) {
            toast.error("Please select an image");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if(!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            setText(() => "");
            setImagePreview(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            toast.error("Failed to send a message");
            console.log("Failed to send message:", error);
        }
    }

    const checkMicrophonePermission = async () => {
        try {
            // Request microphone access via getUserMedia
            await navigator.mediaDevices.getUserMedia({ audio: true });
            return true; // Permission granted
        } catch (error) {
            // If permission is denied, throw an error
            return false; // Permission denied
        }
    };

    const recognitionRef = useRef(null);
    const startListening = async () => {
        const hasPermission = await checkMicrophonePermission();
        if (!hasPermission) return;

        if(!isSupportSpeechRecognition) {
            toast.error("SpeechRecognition is not supported in this browser");
        }

        if(!recognitionRef.current) {
            recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognitionRef.current.lang = "en-US";
            recognitionRef.current.interimResults = true;
            recognitionRef.current.continuous = true;

            recognitionRef.current.onresult = async (event) => {
                const interimText = Array.from(event.results)
                    .filter(result => !result.isFinal)
                    .map(result => result[0].transcript)
                    .join(" ");

                const finalText = Array.from(event.results)
                    .filter(result => result.isFinal)
                    .map(result => result[0].transcript)
                    .join(" ");

                setText(interimText || finalText);
            }

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error", event.error);
            };

            // recognition.onend = (event) => {
            //     if(isCopyingAudioInput) recognition.start();
            // };
            recognitionRef.current.onend = () => {
                console.log('Speech recognition ended');
                setIsCopyingAudioInput(false);
                recognitionRef.current = null;
            };

            recognitionRef.current.start();
            setIsCopyingAudioInput(true);
        }
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsCopyingAudioInput(false);
    };

    const autoResize = (event) => {
        event.target.style.height = 'auto'; // Reset the height to auto
        event.target.style.height = `${event.target.scrollHeight}px`; // Set the height to fit content
    };

    useEffect(() => {
        if("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
            setSupportSpeechRecognition(true);
        }
    }, [])

    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img src={imagePreview} alt="Preview" className="size-20 object-cover rounded-lg border border-zinc-700" />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X  className="size-3"/>
                        </button>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
            >
                <div className="flex-1 flex gap-2">
                    {/*Text message*/}
                    <textarea
                        // type="text"
                        value={text}
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md resize-none leading-relaxed"
                        placeholder="Type a message..."
                        onInput={autoResize}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Audio input to text only show if browser supports SpeechRecognition API */}
                    {
                        isSupportSpeechRecognition && (
                            <button
                                type="button"
                                className={`hidden sm:flex btn btn-circle`}
                                onClick={!isCopyingAudioInput ? startListening : stopListening}
                            >
                                <Mic size={20}/>
                            </button>
                        )
                    }

                    {/*Image input*/}
                    <input
                        type="file"
                        accept="image/jpg,image/jpeg,image/png"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20}/>
                    </button>

                    {/* Send button */}
                    <button
                        type="submit"
                        className="sm:flex btn btn-circle"
                        disabled={!text.trim() && !imagePreview}
                    >
                        <Send size={20}/>
                    </button>
                </div>
            </form>
        </div>
    );
}

function HomePage() {
    const {selectedUser} = useChatStore();

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
                <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar />

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;