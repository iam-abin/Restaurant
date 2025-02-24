import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1],
        },
    },
};

const PageTransition = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{ willChange: 'transform, opacity' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
