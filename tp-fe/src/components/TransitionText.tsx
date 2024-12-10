import { HTMLMotionProps, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const TransitionText: React.FC<
    {
        text1: React.ReactNode;
        text2: React.ReactNode;
    } & HTMLMotionProps<"div">
> = ({ text1, text2, ...props }) => {
    const moveAmount = "50px";
    return (
        <motion.div
            {...props}
            initial="initial"
            whileHover="hover"
            className={cn(
                "relative flex items-center justify-center overflow-hidden",
                props.className,
            )}
            transition={{
                type: "spring",
                stiffness: 500,
            }}
        >
            <motion.span
                variants={{
                    initial: {
                        y: 0,
                    },
                    hover: {
                        y: `calc(-1 * ${moveAmount})`,
                    },
                }}
                className="inline-block pointer-events-none"
            >
                {text1}
            </motion.span>
            <motion.span
                variants={{
                    initial: {
                        y: moveAmount,
                    },
                    hover: {
                        y: 0,
                    },
                }}
                className="inline-block absolute inset-0 whitespace-nowrap"
            >
                {text2}
            </motion.span>
        </motion.div>
    );
};
