import {Link} from "react-router-dom";
import ChatAppImage from "../assets/images/chat-app.png";

const Hero = () => {
    return (
        <section id="hero" className="relative bg-gradient-to-r from-primary via-accent to-secondary opacity-80 py-20">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-6 lg:px-0">
                {/* Left content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h1 className="text-5xl font-semibold text-base-content mb-4">
                        Welcome to PingMe
                    </h1>
                    <p className="text-lg text-base-content mb-8">
                        Connect instantly with friends, family, or teammates. Stay in touch and collaborate like never
                        before.
                    </p>
                    <div className="mt-6">
                        <Link to="/login" className="btn btn-primary rounded-lg text-lg">
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Right content (Image or images of the app) */}
                <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
                    <img
                        src={ChatAppImage}
                        alt="PingMe Screens"
                        className="rounded-xl shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
};

const Features = () => {
    return (
        <section id="features" className="py-20 bg-base-200">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-semibold text-base-content">Why PingMe?</h2>
                <p className="mt-4 text-lg text-base-content">Discover the best chat experience ever.</p>
                <div className="mt-10 grid place-items-center grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="bg-base-100 p-8 rounded-xl shadow-lg w-[80%] sm:w-full">
                        <h3 className="text-2xl font-semibold text-primary">Real-time Messaging</h3>
                        <p className="mt-4 text-base-content">Experience instant communication with no delays. Stay connected with friends and colleagues.</p>
                    </div>
                    <div className="bg-base-100 p-8 rounded-xl shadow-lg w-[80%] sm:w-full">
                        <h3 className="text-2xl font-semibold text-primary">Secure & Private</h3>
                        <p className="mt-4 text-base-content">Your privacy is our priority. End-to-end encryption ensures your conversations stay secure.</p>
                    </div>
                    <div className="bg-base-100 p-8 rounded-xl shadow-lg w-[80%] sm:w-full">
                        <h3 className="text-2xl font-semibold text-primary">Group Chats</h3>
                        <p className="mt-4 text-base-content">Create group chats and stay connected with multiple people at once. Perfect for teams and friends.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CTA = () => {
    return (
        <section id="cta" className="bg-accent text-white py-20">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-semibold">Ready to start chatting?</h2>
                <p className="mt-4 text-lg">Join PingMe today and connect with anyone, anywhere, anytime!</p>
                <div className="mt-6">
                    <Link to="/login" className="btn btn-primary rounded-lg text-lg">
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer id="footer" className="bg-base-300 text-base-content py-6">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} PingMe. All rights reserved.</p>
            </div>
        </footer>
    );
};

function LandingPage() {
    return (
        <div className="mt-16 min-h-screen">
            <Hero />
            <Features />
            <CTA />
            <Footer />
        </div>
    );
}

export default LandingPage;