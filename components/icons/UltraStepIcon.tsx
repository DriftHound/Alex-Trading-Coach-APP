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

                <style jsx>{`
                    .ultra-step-icon {
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 16px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        justify-center;
                        position: relative;
                        overflow: hidden;
                        cursor: pointer;
                        backdrop-filter: blur(10px);
                        transform-style: preserve-3d;
                        perspective: 1000px;
                        transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    /* Sheen Sweep */
                    .ultra-step-icon::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                        transform: skewX(-25deg);
                        transition: left 0.5s ease;
                        pointer-events: none;
                        z-index: 10;
                    }

                    .ultra-step-icon:hover::before {
                        left: 150%;
                        transition: left 0.7s ease;
                    }

                    .ultra-step-icon:hover {
                        border-color: rgba(0, 209, 172, 0.3);
                        box-shadow: 0 0 30px rgba(0, 209, 172, 0.1);
                    }

                    .svg-box {
                        width: 100%;
                        height: 100%;
                        transform: translateZ(20px);
                        filter: drop-shadow(0 0 0 rgba(0,0,0,0));
                        transition: filter 0.3s ease;
                    }

                    .ultra-step-icon:hover .svg-box {
                        filter: drop-shadow(0 0 12px rgba(0, 209, 172, 0.4));
                    }

                    /* AI Node Pulse */
                    .ai-node {
                        fill: #22D3EE;
                        opacity: 0.3;
                    }

                    .ultra-step-icon:hover .ai-node {
                        animation: node-pulse 1s infinite;
                    }

                    @keyframes node-pulse {
                        0% { opacity: 0.3; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.5); filter: drop-shadow(0 0 4px #22D3EE); }
                        100% { opacity: 0.3; transform: scale(1); }
                    }

                    /* Gradient Strokes */
                    .grad-stroke { stroke: url(#laserGradient); }
                    .grad-fill { fill: url(#laserGradient); }

                    /* 1. Market Bias */
                    .bias-candle { opacity: 0.4; transition: height 0.3s, y 0.3s, fill 0.3s; }
                    .bias-arrow { 
                        stroke-dasharray: 80;
                        stroke-dashoffset: 80;
                        transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .bias-group { animation: drift-y 6s ease-in-out infinite alternate; }
                    
                    @keyframes drift-y {
                        from { transform: translateY(0); }
                        to { transform: translateY(-2px); }
                    }

                    .ultra-step-icon:hover .bias-candle { fill: url(#laserGradient); opacity: 1; }
                    .ultra-step-icon:hover .bias-arrow { stroke-dashoffset: 0; }
                    .ultra-step-icon:hover .bias-candle:nth-child(1) { animation: breathe-bar 1.2s infinite 0s; }
                    .ultra-step-icon:hover .bias-candle:nth-child(2) { animation: breathe-bar 1.5s infinite 0.2s; }
                    .ultra-step-icon:hover .bias-candle:nth-child(3) { animation: breathe-bar 1.3s infinite 0.1s; }

                    @keyframes breathe-bar {
                        0%, 100% { opacity: 0.5; }
                        50% { opacity: 1; }
                    }

                    /* 2. Price Zones */
                    .zone-line { opacity: 0.3; transition: transform 0.5s ease; }
                    .zone-test {
                        transform: translateY(-10px);
                        opacity: 0.5;
                        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
                    }
                    .zone-flash { opacity: 0; transform: scale(0); transform-origin: center; }

                    .ultra-step-icon:not(:hover) .zone-top { animation: para-shift 4s ease-in-out infinite alternate; }
                    .ultra-step-icon:not(:hover) .zone-bot { animation: para-shift-rev 4s ease-in-out infinite alternate; }

                    @keyframes para-shift {
                        from { transform: translateY(0); }
                        to { transform: translateY(-1px); }
                    }

                    @keyframes para-shift-rev {
                        from { transform: translateY(0); }
                        to { transform: translateY(1px); }
                    }

                    .ultra-step-icon:hover .zone-test { transform: translateY(0); opacity: 1; }
                    .ultra-step-icon:hover .zone-flash { animation: flash-burst 0.4s forwards 0.2s; }

                    @keyframes flash-burst {
                        0% { opacity: 1; transform: scale(0); }
                        50% { opacity: 1; transform: scale(2); }
                        100% { opacity: 0; transform: scale(3); }
                    }

                    /* 3. Scope */
                    .scope-ring {
                        transform-origin: center;
                        opacity: 0.4;
                        animation: radar-spin 20s linear infinite;
                    }
                    .scope-lines { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }
                    .scope-target {
                        transform: scale(0.5);
                        opacity: 0;
                        transform-origin: center;
                        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }

                    .ultra-step-icon:hover .scope-ring { animation-play-state: paused; stroke: #22D3EE; opacity: 1; }
                    .ultra-step-icon:hover .scope-lines { transform: rotate(90deg) scale(1.1); }
                    .ultra-step-icon:hover .scope-target { transform: scale(1); opacity: 1; transition-delay: 0.1s; }

                    @keyframes radar-spin {
                        100% { transform: rotate(360deg); }
                    }

                    /* 4. Risk Size */
                    .beam-group {
                        transform-origin: 50% 80px;
                        transform: rotate(-10deg);
                        transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    .risk-block { transition: opacity 0.3s; }
                    .reward-block {
                        transform-origin: bottom;
                        transform: scaleY(0.6);
                        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    .pivot-particle { opacity: 0; transform: scale(0); transform-origin: center; }

                    .ultra-step-icon:hover .beam-group { transform: rotate(0deg); }
                    .ultra-step-icon:hover .reward-block { transform: scaleY(1.2); }
                    .ultra-step-icon:hover .risk-block { opacity: 0.5; }
                    .ultra-step-icon:hover .pivot-particle { animation: particle-pop 0.5s ease-out forwards 0.3s; }

                    @keyframes particle-pop {
                        0% { opacity: 1; transform: scale(0); }
                        100% { opacity: 0; transform: scale(2); }
                    }

                    /* 5. Execution Lock */
                    .lock-body { fill: #1E293B; transition: fill 0.3s; }
                    .lock-shackle { transform: translateY(-8px); transition: transform 0.2s cubic-bezier(0.5, 0, 0.75, 0); }
                    .lock-glow { opacity: 0; transform-origin: center; transition: opacity 0.5s; }

                    .ultra-step-icon.active .lock-shackle { transform: translateY(0); }
                    .ultra-step-icon.active .lock-body { fill: #0F172A; }
                    .ultra-step-icon.active .lock-glow { opacity: 1; animation: glow-pulse 3s infinite; }

                    .shake { animation: shake-lock 0.3s ease-in-out; }

                    @keyframes shake-lock {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-2px); }
                        75% { transform: translateX(2px); }
                    }

                    @keyframes glow-pulse {
                        0%, 100% { opacity: 0.3; filter: blur(5px); }
                        50% { opacity: 0.6; filter: blur(8px); }
                    }

                    /* 6. Completed */
                    .check-path {
                        stroke-dasharray: 100;
                        stroke-dashoffset: 100;
                        transition: stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .ripple-circle { opacity: 0; transform: scale(0.8); transform-origin: center; }
                    .halo-ring { opacity: 0.2; transform-origin: center; animation: spin-slow 15s linear infinite; }

                    .ultra-step-icon.active .check-path { stroke-dashoffset: 0; }
                    .ultra-step-icon.active .ripple-circle { animation: ripple-out 0.8s ease-out forwards 0.4s; }

                    @keyframes ripple-out {
                        0% { opacity: 0.5; transform: scale(0.8); }
                        100% { opacity: 0; transform: scale(1.4); }
                    }

                    @keyframes spin-slow {
                        100% { transform: rotate(360deg); }
                    }

                    /* 7. Warning */
                    .warn-tri { transform-origin: center; }
                    .warn-glow { opacity: 0; filter: blur(8px); transition: opacity 0.3s; }

                    .ultra-step-icon .warn-tri { animation: warn-breathe 4s ease-in-out infinite; }
                    .ultra-step-icon:hover .warn-glow { opacity: 0.6; }
                    .ultra-step-icon:hover .warn-tri { animation: warn-alert 0.2s ease-in-out 3; }

                    @keyframes warn-breathe {
                        0%, 100% { transform: scale(1); opacity: 0.8; }
                        50% { transform: scale(1.05); opacity: 1; }
                    }

                    @keyframes warn-alert {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }

                    /* 8. Journal */
                    .book-lines { stroke-dasharray: 10; stroke-dashoffset: 0; opacity: 0; }
                    .page-l {
                        transform-origin: right;
                        transform: perspective(500px) rotateY(-30deg);
                        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    .page-r {
                        transform-origin: left;
                        transform: perspective(500px) rotateY(30deg);
                        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }

                    .ultra-step-icon:hover .page-l { transform: perspective(500px) rotateY(0deg); }
                    .ultra-step-icon:hover .page-r { transform: perspective(500px) rotateY(0deg); }
                    .ultra-step-icon:hover .book-lines { opacity: 1; animation: scroll-lines 1s linear infinite; }

                    @keyframes scroll-lines {
                        to { stroke-dashoffset: -20; }
                    }
                `}</style>
            </div>
        </>
    );
}
