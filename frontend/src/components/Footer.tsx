import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <p>
          &copy; {currentYear} MedRev. All rights reserved.
        </p>
        <p className="flex items-center gap-1 mt-2 md:mt-0">
          Developed with <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" /> by{" "}
          <Link 
            href="https://github.com/ArkaKarmoker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            Arka Karmoker
          </Link>
        </p>
      </div>
    </footer>
  );
}
