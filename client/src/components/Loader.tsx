import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] w-full gap-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="w-16 h-16 bg-gradient-to-br from-primary to-secondary opacity-80"
      />
      <p className="text-muted-foreground font-medium animate-pulse">Breathing in...</p>
    </div>
  );
}
