import { motion } from "framer-motion";

export const PageWrapper = ({ children }: {children: React.ReactNode}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};