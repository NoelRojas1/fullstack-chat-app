import {MessageSquare} from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern.jsx";

function VerifyEmailNotificationPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* left side */}
            <div className="flex flex-col justify-center items-center sm:p-12">

                {/*Logo*/}
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col justify-center items-center mb-8">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Verify your email</h1>
                        <p className="text-base-content/60">Check your email inbox or your spam folder</p>
                    </div>
                </div>
            </div>

            {/* Right */}
            <AuthImagePattern
                title="Thank you for signing up"
                subtitle="Before you can start sending messages, you must verify your email address"
            />
        </div>
    )
}

export default VerifyEmailNotificationPage;