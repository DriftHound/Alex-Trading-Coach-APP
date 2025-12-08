import type { Metadata } from 'next';
import { AlertTriangle, Shield, Info, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Disclaimer & Risk Warning | Confluence Checklist Coach',
    description: 'Important legal disclaimers, risk warnings, and regulatory notices for Confluence Checklist Coach.',
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-background py-12">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-4">Disclaimer & Risk Warning</h1>
                <p className="text-gray-400 mb-8">
                    Last updated: December 2024
                </p>

                {/* Educational Use Only */}
                <section className="card mb-8">
                    <div className="flex items-start gap-4 mb-4">
                        <Info className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-2xl font-semibold mb-3">Educational Use Only – No Financial Advice</h2>
                            <div className="space-y-3 text-gray-300">
                                <p>
                                    <strong>Confluence Checklist Coach</strong> is for educational use only and does not provide
                                    financial, investment or trading advice.
                                </p>
                                <p>
                                    The app does not tell you what to buy or sell and does not execute trades on your behalf.
                                </p>
                                <p>
                                    All content, tools, and features are provided for informational and educational purposes only.
                                    You are solely responsible for your own trading decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Risk Warning */}
                <section className="card mb-8 border-l-4 border-danger">
                    <div className="flex items-start gap-4 mb-4">
                        <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-2xl font-semibold mb-3 text-danger">Risk Warning</h2>
                            <div className="space-y-3 text-gray-300">
                                <p className="font-semibold">
                                    Trading financial markets involves a high risk of loss and is not suitable for everyone.
                                </p>
                                <p>
                                    You should not trade with money you cannot afford to lose. Past performance and simulated
                                    examples do not guarantee future results.
                                </p>
                                <p>
                                    Before trading, you should carefully consider your financial situation, level of experience,
                                    and risk tolerance. Seek advice from an independent financial advisor if you have any doubts.
                                </p>
                                <p>
                                    The use of leverage can work against you as well as for you. Leverage can magnify both
                                    profits and losses.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Independence */}
                <section className="card mb-8">
                    <div className="flex items-start gap-4 mb-4">
                        <Shield className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-2xl font-semibold mb-3">Independence – No Affiliation</h2>
                            <div className="space-y-3 text-gray-300">
                                <p>
                                    <strong>Confluence Checklist Coach</strong> is an independent product and is not affiliated
                                    with, endorsed by, sponsored by, or approved by any broker, educator, trading firm, or
                                    financial institution.
                                </p>
                                <p>
                                    We do not receive commissions or payments from any broker or trading platform. We do not
                                    recommend or endorse any specific broker, trading strategy, or financial product.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Regulatory Notice */}
                <section className="card mb-8">
                    <div className="flex items-start gap-4 mb-4">
                        <FileText className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-2xl font-semibold mb-3">Regulatory Notice (UK)</h2>
                            <div className="space-y-3 text-gray-300">
                                <p>
                                    The creator of Confluence Checklist Coach is not authorised or regulated by the Financial
                                    Conduct Authority (FCA) and does not provide regulated investment services.
                                </p>
                                <p>
                                    This tool is not a regulated financial service and does not constitute investment advice,
                                    financial promotion, or a recommendation to buy or sell any financial instrument.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What This Tool Does */}
                <section className="card mb-8">
                    <h2 className="text-2xl font-semibold mb-4">What This Tool Does (and Doesn't Do)</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-success mb-3">✓ Confluence Checklist Coach Helps You:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Follow a structured pre-trade checklist</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Document your trading plan before execution</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Apply your own rules systematically</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Commit to a set-and-forget management approach</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success mt-1">✓</span>
                                    <span>Review past trades for learning purposes</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-danger mb-3">✗ Confluence Checklist Coach Does NOT:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-danger mt-1">✗</span>
                                    <span>Provide trading signals or recommendations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-danger mt-1">✗</span>
                                    <span>Tell you what to buy or sell</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-danger mt-1">✗</span>
                                    <span>Execute trades on your behalf</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-danger mt-1">✗</span>
                                    <span>Connect to any broker or exchange</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-danger mt-1">✗</span>
                                    <span>Guarantee profits or reduce risk</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-danger mt-1">✗</span>
                                    <span>Provide financial, investment or trading advice</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Your Responsibility */}
                <section className="card mb-8 bg-warning/5 border-warning">
                    <h2 className="text-2xl font-semibold mb-4">Your Responsibility</h2>
                    <div className="space-y-3 text-gray-300">
                        <p className="font-semibold">You are solely responsible for:</p>
                        <ul className="space-y-2 ml-6">
                            <li className="flex items-start gap-2">
                                <span className="text-warning mt-1">•</span>
                                <span>Your trading decisions and their outcomes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-warning mt-1">•</span>
                                <span>Your risk management and position sizing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-warning mt-1">•</span>
                                <span>Executing trades with your broker</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-warning mt-1">•</span>
                                <span>Complying with applicable laws and regulations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-warning mt-1">•</span>
                                <span>Understanding that trading involves high risk of loss</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-warning mt-1">•</span>
                                <span>Seeking professional advice if needed</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* No Warranties */}
                <section className="card mb-8">
                    <h2 className="text-2xl font-semibold mb-4">No Warranties</h2>
                    <div className="space-y-3 text-gray-300">
                        <p>
                            This tool is provided "as is" without any warranties of any kind, either express or implied.
                        </p>
                        <p>
                            We do not warrant that the tool will be error-free, uninterrupted, or suitable for your particular
                            purpose. We are not liable for any losses or damages arising from your use of this tool.
                        </p>
                    </div>
                </section>

                {/* Changes to Disclaimer */}
                <section className="card">
                    <h2 className="text-2xl font-semibold mb-4">Changes to This Disclaimer</h2>
                    <div className="space-y-3 text-gray-300">
                        <p>
                            We may update this disclaimer from time to time. Continued use of the tool after changes
                            constitutes acceptance of the updated disclaimer.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                    <p>
                        By using Confluence Checklist Coach, you acknowledge that you have read, understood, and agree
                        to this disclaimer and risk warning.
                    </p>
                </div>
            </div>
        </div>
    );
}
