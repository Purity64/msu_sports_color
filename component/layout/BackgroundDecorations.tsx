"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFutbol,
  faBasketball,
  faVolleyball,
  faTrophy,
  faMedal,
  faBowlingBall,
} from "@fortawesome/free-solid-svg-icons";

const floatingIcons = [
  { icon: faFutbol, left: "10%", top: "15%", delay: "0s", duration: "25s", size: "text-5xl" },
  { icon: faBasketball, left: "85%", top: "20%", delay: "-5s", duration: "30s", size: "text-6xl" },
  { icon: faTrophy, left: "75%", top: "75%", delay: "-2s", duration: "22s", size: "text-4xl" },
  { icon: faMedal, left: "15%", top: "70%", delay: "-8s", duration: "28s", size: "text-7xl" },
  { icon: faVolleyball, left: "50%", top: "10%", delay: "-12s", duration: "35s", size: "text-4xl" },
  { icon: faBowlingBall, left: "45%", top: "85%", delay: "-4s", duration: "26s", size: "text-5xl" },
];

export function BackgroundDecorations() {
  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        {floatingIcons.map((item, i) => (
          <div
            key={i}
            className={`absolute animate-float text-[#FFCB05] ${item.size}`}
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          >
            <FontAwesomeIcon icon={item.icon} />
          </div>
        ))}
      </div>


    </>
  );
}
