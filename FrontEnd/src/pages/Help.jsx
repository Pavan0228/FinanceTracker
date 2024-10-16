import React from 'react';
import { Info, Lock, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

const HelpSection = ({ title, children, icon: Icon }) => (
    <section className="mb-8 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-orange-400 flex items-center">
            <Icon className="mr-2" size={24} />
            {title}
        </h2>
        {children}
    </section>
);

const HelpPage = () => {
    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-emerald-400">FinSense Help & Information</h1>

                <HelpSection title="What is FinSense?" icon={Info}>
                    <p className="mb-4">
                        FinSense is an innovative automatic finance tracking application designed to simplify your financial management.
                        By securely analyzing your financial messages, it provides you with real-time insights into your spending habits and financial health.
                    </p>
                </HelpSection>

                <HelpSection title="How Does It Work?" icon={TrendingUp}>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Message Scraping: The app automatically scans and extracts financial information from messages on your phone.</li>
                        <li>Data Analysis: It categorizes transactions, tracks expenses, and monitors your income.</li>
                        <li>Insights Generation: The app creates visual representations of your financial data, including charts and graphs.</li>
                        <li>Alerts and Notifications: You receive customized alerts for unusual spending, bill reminders, and financial goals.</li>
                    </ol>
                </HelpSection>

                <HelpSection title="Security Measures" icon={Lock}>
                    <p className="mb-4">Your privacy and data security are our top priorities. FinSense employs several measures to ensure your information remains safe:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>AES Encryption: All sensitive data is encrypted using Advanced Encryption Standard (AES) algorithms.</li>
                        <li>Local Processing: Your financial data is processed locally on your device, minimizing data transmission risks.</li>
                        <li>Secure Authentication: The app uses robust authentication methods to prevent unauthorized access.</li>
                        <li>Regular Security Audits: We conduct frequent security assessments to identify and address potential vulnerabilities.</li>
                    </ul>
                </HelpSection>

                <HelpSection title="Key Features" icon={HelpCircle}>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Automatic Expense Tracking: No manual entry required; the app does the work for you.</li>
                        <li>Customizable Categories: Tailor expense categories to fit your specific needs.</li>
                        <li>Budget Setting: Set and monitor budgets for different expense categories.</li>
                        <li>Financial Reports: Generate comprehensive reports to understand your spending patterns.</li>
                        <li>Goal Tracking: Set financial goals and track your progress towards achieving them.</li>
                        <li>Multi-account Support: Monitor multiple bank accounts and credit cards in one place.</li>
                    </ul>
                </HelpSection>

                <HelpSection title="Troubleshooting" icon={AlertTriangle}>
                    <p className="mb-4">If you encounter any issues while using FinSense, try these steps:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Ensure your app is updated to the latest version.</li>
                        <li>Check your device settings to confirm the app has necessary permissions.</li>
                        <li>Restart the app and your device.</li>
                        <li>If problems persist, contact our support team through the app's "Contact Us" section.</li>
                    </ol>
                </HelpSection>
            </div>
        </div>
    );
};

export default HelpPage;