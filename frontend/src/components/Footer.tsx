import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400 gap-4 md:gap-0">
        <div className="md:w-1/3 text-center md:text-left">
          &copy; {currentYear} MedRev. All rights reserved.
        </div>
        
        <div className="flex items-center justify-center gap-1 md:w-1/3">
          Developed with <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" /> by{" "}
          <Link 
            href="https://github.com/ArkaKarmoker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            Arka Karmoker
          </Link>
        </div>

        <div className="md:w-1/3 text-center md:text-right">
          <span>Data sourced from </span>
          <Link 
            href="https://medex.com.bd/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            MedEx
          </Link>
          <span className="hidden md:inline text-slate-300 dark:text-slate-600 mx-2">|</span>
          <span className="block md:inline text-xs md:text-sm mt-1 md:mt-0 opacity-80">Last updated: 06/06/2025</span>
        </div>
      </div>
    </footer>
  );
}
