import * as React from "react";
import { motion } from "framer-motion";

const Path = (props: any) => {
    return (
        <motion.path
            strokeWidth="3"
            stroke={"#6B7280"}
            strokeLinecap="round"
            {...props}
        />
    );
};

export const MenuToggle = ({ toggle }: { toggle: () => void }) => (
    <button
        style={{
            zIndex: 110,
            top: 15,
            left: 13,
            transition: "0.5s",
            position: "absolute",
            cursor: "pointer",
        }}
        onClick={toggle}
    >
        <svg width="20" height="15" viewBox="0 0 20 20">
            <Path
                variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" },
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" },
                }}
            />
        </svg>
    </button>
);
