"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Building2, Pill, FlaskConical } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

interface Medicine {
  id: number;
  name: string;
  strength: string;
  generic_name: string;
  manufacturer: string;
  type: string;
  dosage_form: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/medicines/`, { params: { search: debouncedQuery } });
        setSuggestions(res.data.results.slice(0, 8)); // Take top 8 suggestions
      } catch (err) {
        console.error("Error fetching suggestions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  return (
    <div className="flex-1 flex flex-col items-center pt-24 p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find & Review <span className="text-emerald-600">Medicines</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Search our database of over 26,000+ medicines to read reviews and detailed information.
          </p>
        </div>

        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search by medicine name or generic name..." 
              className="w-full pl-12 pr-4 py-8 text-lg rounded-full shadow-lg border-2 border-transparent focus-visible:ring-0 focus-visible:border-emerald-500 bg-white dark:bg-slate-900 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {(suggestions.length > 0 || loading) && (
            <Card className="mt-2 w-full shadow-xl overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 text-center text-slate-500">Loading...</div>
                ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {suggestions.map((med) => (
                      <li key={med.id}>
                        <Link href={`/medicines/${med.id}`} className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {med.name} {med.strength && <span className="font-normal text-sm text-slate-500 ml-1">{med.strength}</span>}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {med.generic_name}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
                            {med.manufacturer && <span className="flex items-center gap-1"><Building2 className="w-3 h-3"/> {med.manufacturer}</span>}
                            {med.type && <span className="flex items-center gap-1"><Pill className="w-3 h-3"/> {med.type}</span>}
                            {med.dosage_form && <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3"/> {med.dosage_form}</span>}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
