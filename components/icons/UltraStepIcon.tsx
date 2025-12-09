'use client';

import { useState, useRef, useEffect } from 'react';

interface UltraStepIconProps {
    step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    size?: number;
    active?: boolean;
    className?: string;
}

export default function UltraStepIcon({ step, size = 70, active = false, className = '' }: UltraStepIconProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(active);
    const [isShaking, setIsShaking] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsActive(active);
    }, [active]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;

        const tiltX = yPct * -8;
        const tiltY = xPct * 8;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        }
        setIsHovered(false);
    };

    const handleClick = () => {
        if (step === 5) {
            if (isActive) {
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 300);
            } else {
                setIsActive(true);
            }
        } else if (step === 6) {
            setIsActive(!isActive);
        }
    };

    const renderIcon = () => {
        switch (step) {
            case 1: // Market Bias
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <g className="bias-group">
                            <rect className="bias-candle" x="20" y="60" width="6" height="20" rx="1" fill="#64748B" />
                            <rect className="bias-candle" x="35" y="50" width="6" height="25" rx="1" fill="#64748B" />
                            <rect className="bias-candle" x="50" y="55" width="6" height="15" rx="1" fill="#64748B" />
                            <path className="bias-arrow grad-stroke" d="M20 80 C 40 70, 50 80, 90 30" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <path className="bias-arrow grad-stroke" d="M90 30 L75 30 M90 30 L90 45" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </g>
                    </svg>
                );

            case 2: // Price Zones
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <rect className="zone-line zone-top" x="10" y="20" width="80" height="2" fill="#E2E8F0" rx="1" />
                        <rect className="zone-line zone-bot" x="10" y="80" width="80" height="2" fill="#E2E8F0" rx="1" />
                        <circle className="zone-flash" cx="50" cy="80" r="4" fill="url(#laserGradient)" />
                        <rect className="zone-test grad-fill" x="46" y="50" width="8" height="30" rx="1" />
                    </svg>
                );

            case 3: // Setup Criteria
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <circle className="scope-ring" cx="50" cy="50" r="35" stroke="#64748B" strokeWidth="1" fill="none" strokeDasharray="4 6" />
                        <g className="scope-lines grad-stroke">
                            <line x1="10" y1="50" x2="30" y2="50" strokeWidth="2" />
                            <line x1="70" y1="50" x2="90" y2="50" strokeWidth="2" />
                            <line x1="50" y1="10" x2="50" y2="30" strokeWidth="2" />
                            <line x1="50" y1="70" x2="50" y2="90" strokeWidth="2" />
                        </g>
                        <rect className="scope-target grad-fill" x="46" y="46" width="8" height="8" rx="1" />
                    </svg>
                );

            case 4: // Risk Size
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <polygon points="50,85 45,95 55,95" fill="#64748B" />
                        <circle className="pivot-particle" cx="50" cy="80" r="3" fill="#22D3EE" />
                        <g className="beam-group">
                            <rect x="15" y="60" width="70" height="2" fill="#E2E8F0" rx="1" />
                            <rect className="risk-block" x="20" y="40" width="15" height="20" fill="#64748B" rx="1" />
                            <rect className="reward-block grad-fill" x="65" y="20" width="15" height="40" rx="1" />
                        </g>
                    </svg>
                );

            case 5: // Execution
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <circle className="lock-glow" cx="50" cy="65" r="15" fill="var(--accent-teal)" />
                        <path className="lock-shackle" d="M30 40 V 25 A 20 20 0 0 1 70 25 V 40" stroke="#94A3B8" strokeWidth="4" fill="none" strokeLinecap="round" />
                        <rect className="lock-body" x="20" y="40" width="60" height="50" rx="4" stroke="#94A3B8" strokeWidth="1" />
                    </svg>
                );

            case 6: // Completed
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <circle className="halo-ring" cx="50" cy="50" r="40" stroke="#00D1AC" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
                        <circle className="ripple-circle" cx="50" cy="50" r="30" stroke="#00D1AC" strokeWidth="2" fill="none" />
                        <path className="check-path grad-stroke" d="M30 50 L 45 65 L 75 35" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );

            case 7: // Warning
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <circle className="warn-glow" cx="50" cy="55" r="20" fill="#F59E0B" />
                        <path className="warn-tri grad-stroke" d="M50 15 L 85 80 L 15 80 Z" strokeWidth="2" fill="none" strokeLinejoin="round" />
                        <rect className="grad-fill" x="48" y="35" width="4" height="25" rx="2" />
                        <circle className="grad-fill" cx="50" cy="70" r="3" />
                    </svg>
                );

            case 8: // Journal
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle className="ai-node" cx="90" cy="10" r="2" />
                        <rect className="grad-fill" x="49" y="20" width="2" height="60" />
                        <g className="page-l">
                            <rect x="18" y="20" width="30" height="60" fill="#334155" opacity="0.5" />
                        </g>
                        <g className="page-r">
                            <rect x="52" y="20" width="30" height="60" fill="#334155" opacity="0.5" />
                            <path className="book-lines grad-stroke" d="M56 30 H78 M56 40 H78 M56 50 H78 M56 60 H78 M56 70 H78" strokeWidth="2" strokeLinecap="round" />
                        </g>
                    </svg>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* SVG Gradients - Only render once */}
            {step === 1 && (
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#00D1AC', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#22D3EE', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>
            )}

            <div
                ref={cardRef}
                className={`ultra-step-icon ${isHovered ? 'hovered' : ''} ${isActive ? 'active' : ''} ${isShaking ? 'shake' : ''} ${className}`}
                style={{ width: size, height: size }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                <div className="svg-box">
                    {renderIcon()}
                </div>
            </div>
        </>
    );
}
