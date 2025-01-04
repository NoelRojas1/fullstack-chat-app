import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import {Loader2, MessageSquare} from "lucide-react";

function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const linkId = searchParams.get('linkId');

    const {verifyEmail, isVerifyingEmail} = useAuthStore();

    useEffect(() => {
        verifyEmail(linkId);
    }, [])


    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* left side */}
            <div className="flex flex-col justify-center items-center sm:p-12">

                {/*Logo*/}
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col justify-center gap-2 items-center mb-8">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">
                            {
                                isVerifyingEmail ? (
                                    <>Verifying your email <Loader2 className="size-5 animate-spin" /></>
                                ) : (
                                    <>Your email has been verified.</>
                                )
                            }
                        </h1>
                        {!isVerifyingEmail && <button className="btn btn-primary" onClick={() => {navigate("/chat")}}>Go to chat</button>}
                    </div>
                </div>
            </div>

            {/* Right */}
            <AuthImagePattern
                title="You can now chat"
                subtitle="Go to chat to start conversations with your friends"
            />
        </div>
    )
}

export default VerifyEmailPage;