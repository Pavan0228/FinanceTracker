import React from "react";
import { Github, Mail, HelpCircle, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = [
        { text: "Dashboard", path: "/dashboard" },
        { text: "Daily", path: "/daily" },
        { text: "Input Finance", path: "/input" },
        { text: "Download Data", path: "/download" },
        { text: "Help", path: "/help" },
    ];

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 mt-auto backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Top Section with Logo and Company Info */}
                <div className="flex flex-col items-center mb-8">
                    <div className="text-2xl font-bold bg-white text-transparent bg-clip-text mb-2">
                        PennyTracker
                    </div>
                    <p className="text-slate-400 text-sm text-center max-w-md">
                        Smart financial tracking for the modern age. Your money,
                        your control.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h3 className="text-slate-200 font-semibold mb-2">
                            Company
                        </h3>
                        <div className="flex flex-col space-y-2">
                            {links.map(({ text, path }) => (
                                <Link
                                    to={path}
                                    key={text}
                                    onClick={handleScrollToTop}
                                    className="text-slate-400 hover:text-blue-400 transition-all hover:translate-x-1"
                                >
                                    {text}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h3 className="text-slate-200 font-semibold mb-2">
                            Legal
                        </h3>
                        <div className="flex flex-col space-y-2">
                            <a
                                href="#"
                                className="text-slate-400 hover:text-blue-400 transition-all hover:translate-x-1"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-slate-400 hover:text-blue-400 transition-all hover:translate-x-1"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-slate-400 hover:text-blue-400 transition-all hover:translate-x-1"
                            >
                                Security
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h3 className="text-slate-200 font-semibold mb-2">
                            Connect
                        </h3>
                        <div className="flex space-x-4">
                            <a href="#" className="group">
                                <Github className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-all transform group-hover:-translate-y-1" />
                            </a>
                            <a href="#" className="group">
                                <Mail className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-all transform group-hover:-translate-y-1" />
                            </a>
                            <a href="#" className="group">
                                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-all transform group-hover:-translate-y-1" />
                            </a>
                            <a href="#" className="group">
                                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-all transform group-hover:-translate-y-1" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-800/50 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-slate-400 text-sm">
                            © {currentYear} PennyTracker. All rights reserved.
                        </div>

                        <div className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
                                <span className="mr-1 w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                Your data is secure
                            </span>
                        </div>
                    </div>
                </div>

                {/* Security Message */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                        Protected by enterprise-grade encryption. Your financial
                        data never leaves your device.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
