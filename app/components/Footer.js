"use client";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="relative w-full min-h-[70vh] text-black px-6 md:px-12 py-24 flex flex-col justify-between overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <h2 className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter">
            Write
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            <a
              href="mailto:rafal.chorazewicz@icloud.com"
              className="text-[4vw] md:text-[2.5vw] font-bold hover:opacity-70 transition-opacity pb-2"
            >
              rafal.chorazewicz@icloud.com
            </a>
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full flex justify-between items-end mt-24 border-t border-black/10 pt-16">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Stockholm</p>
        <p className="text-[12vw] md:text-[8vw] leading-none font-black uppercase tracking-tighter">
          {currentYear}
        </p>
      </div>
    </footer>
  );
}
