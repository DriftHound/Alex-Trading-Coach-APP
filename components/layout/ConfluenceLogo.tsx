'use client';

import { useEffect, useRef } from 'react';

interface ConfluenceLogoProps {
    size?: number;
    active?: boolean;
    className?: string;
}

export default function ConfluenceLogo({ size = 64, active = false, className = '' }: ConfluenceLogoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (active && containerRef.current) {
            // Reset animation
            containerRef.current.classList.remove('active');
            void containerRef.current.offsetWidth; // Force reflow

            // Fire pulse
            containerRef.current.classList.add('active');
        }
    }, [active]);

    return (
        <div
            ref={containerRef}
            className={`confluence-container ${className}`}
            style={{ width: size, height: size }}
        >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {/* Glow Filter for the Pulse */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer Orbit (Slowest) */}
                <circle
                    className="ring-outer"
                    cx="50" cy="50" r="45"
                    stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="10 15"
                />

                {/* Middle Orbit (Medium, Counter-Rotate) */}
                <path
                    className="ring-middle"
                    d="M50 15 A35 35 0 0 1 85 50 A35 35 0 0 1 50 85"
                    stroke="currentColor" strokeWidth="1" fill="none"
                />
                <path
                    className="ring-middle"
                    d="M50 85 A35 35 0 0 1 15 50 A35 35 0 0 1 50 15"
                    stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 4" opacity="0.5"
                />

                {/* Inner Orbit (Fastest) */}
                <circle
                    className="ring-inner"
                    cx="50" cy="50" r="20"
                    stroke="#10b981" strokeWidth="0.5" fill="none" strokeDasharray="5 5" opacity="0.4"
                />

                {/* The Price Line (Living Market Structure) */}
                <path
                    className="price-line"
                    d="M30 60 C 35 65, 40 55, 45 58 S 55 45, 60 48 S 70 35, 75 38"
                />

                {/* The Confluence Node (Hidden until Pulse) */}
                <circle className="pulse-node" cx="60" cy="48" r="3" />
            </svg>

            <style jsx>{`
                .confluence-container {
                    color: #64748B;
                    position: relative;
                }

                /* STATE A: THE IDLE LOOP */
                .ring-outer {
                    transform-origin: 50% 50%;
                    animation: spin 30s linear infinite;
                    opacity: 0.3;
                }

                .ring-middle {
                    transform-origin: 50% 50%;
                    animation: spin-reverse 20s linear infinite;
                    opacity: 0.5;
                }

                .ring-inner {
                    transform-origin: 50% 50%;
                    animation: spin 12s linear infinite;
                    opacity: 0.7;
                }

                /* The Price Line - Gently breathing */
                .price-line {
                    fill: none;
                    stroke: #10b981;
                    stroke-width: 1.5;
                    stroke-linecap: round;
                    stroke-dasharray: 100;
                    stroke-dashoffset: 0;
                    animation: price-breathe 6s ease-in-out infinite alternate;
                    filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.4));
                }

                /* STATE B: THE REACTIVE PULSE */
                .pulse-node {
                    fill: #10b981;
                    opacity: 0;
                    transform-origin: 50% 50%;
                    transform: scale(0.1);
                }

                /* Trigger Class */
                .confluence-container.active .pulse-node {
                    animation: flash-pulse 0.8s ease-out forwards;
                }

                .confluence-container.active .ring-outer,
                .confluence-container.active .ring-middle,
                .confluence-container.active .ring-inner {
                    stroke: #10b981;
                    transition: stroke 0.3s ease;
                }

                /* KEYFRAMES */
                @keyframes spin { 
                    100% { transform: rotate(360deg); } 
                }
                
                @keyframes spin-reverse { 
                    100% { transform: rotate(-360deg); } 
                }
                
                @keyframes price-breathe {
                    0% { stroke-dashoffset: 20; opacity: 0.6; }
                    100% { stroke-dashoffset: 0; opacity: 1; }
                }
                
                @keyframes flash-pulse {
                    0% { transform: scale(0.1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.8; filter: drop-shadow(0 0 10px #10b981); }
                    100% { transform: scale(2.0); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
