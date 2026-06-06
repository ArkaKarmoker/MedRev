"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { ChevronUp, ChevronDown, ChevronsUpDown, FilterX, Eye, Star, ChevronLeft, ChevronRight, Send, Search, X } from "lucide-react";

interface Medicine {
  id: number;
  name: string;
  strength: string;
  generic_name: string;
  manufacturer: string;
  type: string;
  dosage_form: string;
  unit_price: string;
  average_rating: number | null;
  review_count: number;
}

export default function MedicinesPage() {
  const [data, setData] = useState<Medicine[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [type, setType] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableDosageForms, setAvailableDosageForms] = useState<string[]>([]);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [rating, setRating] = useState("5");
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.get("/medicines/filters/");
        setAvailableTypes(res.data.types);
        setAvailableDosageForms(res.data.dosage_forms);
      } catch (err) {
        console.error("Error fetching filters", err);
      }
    };
    fetchFilters();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params: any = { page, page_size: pageSize };
      if (debouncedSearch) params.search = debouncedSearch;
      if (type && type !== "All") params.type = type;
      if (dosageForm && dosageForm !== "All") params.dosage_form = dosageForm;
      if (sortColumn) {
        params.ordering = sortDirection === "desc" ? `-${sortColumn}` : sortColumn;
      }

      const res = await api.get("/medicines/", { params });
      setData(res.data.results);
      setTotal(res.data.count);
    } catch (err) {
      console.error("Error fetching medicines", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [page, pageSize, debouncedSearch, type, dosageForm, sortColumn, sortDirection]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [pageSize, debouncedSearch, type, dosageForm, sortColumn, sortDirection]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;
    setSubmittingReview(true);
    try {
      await api.post(`/reviews/medicine/${selectedMed.id}/`, { rating: parseFloat(rating), comment });
      alert("Review submitted successfully!");
      setReviewModalOpen(false);
      setRating("5");
      setComment("");
      fetchMedicines(); // Refresh the list
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.dispatchEvent(new Event("openLogin"));
      } else if (err.response?.data) {
        const msg = err.response.data;
        alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
      } else {
        alert("Failed to submit review.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortHeader = (label: string, column: string) => {
    return (
      <div 
        className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-300"
        onClick={() => handleSort(column)}
      >
        {label}
        {sortColumn === column ? (
          sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronsUpDown className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        )}
      </div>
    );
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 space-y-6 py-8">
      <h1 className="text-3xl font-bold">All Medicines</h1>
      
      <div className="flex flex-col xl:flex-row justify-between gap-4 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 dark:text-slate-300">Show</span>
            <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(parseInt(val || "10"))}>
              <SelectTrigger className="w-[75px] h-9 bg-white dark:bg-slate-950">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-700 dark:text-slate-300">entries</span>
          </div>

          <Select value={type} onValueChange={(val) => setType(val || "")}>
            <SelectTrigger className="w-[180px] h-9 bg-white dark:bg-slate-950">
              <SelectValue placeholder="Type (e.g. Allopathic)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {availableTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dosageForm} onValueChange={(val) => setDosageForm(val || "")}>
            <SelectTrigger className="w-[180px] h-9 bg-white dark:bg-slate-950">
              <SelectValue placeholder="Dosage Form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Forms</SelectItem>
              {availableDosageForms.map((df) => (
                <SelectItem key={df} value={df}>{df}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {((type && type !== 'All') || (dosageForm && dosageForm !== 'All')) && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setSearch("");
                setType("");
                setDosageForm("");
              }}
              className="text-slate-500 hover:text-slate-900 h-9 gap-2"
            >
              <FilterX className="w-4 h-4" /> Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center shrink-0 relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <Input 
            placeholder="Search medicines..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full xl:w-[250px] h-9 pl-9 pr-8 bg-white dark:bg-slate-950"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{renderSortHeader("Name", "name")}</TableHead>
              <TableHead>{renderSortHeader("Strength", "strength")}</TableHead>
              <TableHead>{renderSortHeader("Generic Name", "generic_name")}</TableHead>
              <TableHead>{renderSortHeader("Manufacturer", "manufacturer")}</TableHead>
              <TableHead>{renderSortHeader("Type", "type")}</TableHead>
              <TableHead>{renderSortHeader("Form", "dosage_form")}</TableHead>
              <TableHead>{renderSortHeader("Price", "unit_price")}</TableHead>
              <TableHead>{renderSortHeader("Reviews", "average_rating")}</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">No medicines found.</TableCell>
              </TableRow>
            ) : (
              data.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium whitespace-normal break-words min-w-[150px] max-w-[200px]">
                    <Link href={`/medicines/${med.id}`} className="text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300">
                      {med.name}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-normal break-words min-w-[100px] max-w-[150px]">{med.strength || <span className="text-slate-400 italic">N/A</span>}</TableCell>
                  <TableCell className="whitespace-normal break-words min-w-[150px] max-w-[250px]">{med.generic_name || "-"}</TableCell>
                  <TableCell className="whitespace-normal break-words min-w-[150px] max-w-[200px]">{med.manufacturer || "-"}</TableCell>
                  <TableCell className="whitespace-normal break-words min-w-[100px] max-w-[150px]">{med.type || "-"}</TableCell>
                  <TableCell className="whitespace-normal break-words min-w-[100px] max-w-[150px]">{med.dosage_form || "-"}</TableCell>
                  <TableCell className="whitespace-nowrap">{med.unit_price}</TableCell>
                  <TableCell>
                    {med.review_count > 0 ? (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{med.average_rating?.toFixed(1)}</span>
                        <span className="text-slate-500 text-xs">({med.review_count})</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/medicines/${med.id}`}>
                        <Button variant="outline" size="sm" className="gap-2"><Eye className="w-4 h-4" />View</Button>
                      </Link>
                      <Button variant="default" size="sm" className="gap-2" onClick={() => {
                        const token = localStorage.getItem("access_token");
                        if (!token) {
                          window.dispatchEvent(new Event("openLogin"));
                          return;
                        }
                        setSelectedMed(med);
                        setReviewModalOpen(true);
                      }}><Star className="w-4 h-4" />Review</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} entries
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            disabled={page === 1 || loading} 
            onClick={() => setPage(p => p - 1)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <div className="text-sm font-medium">Page {page} of {totalPages || 1}</div>
          <Button 
            variant="outline" 
            disabled={page >= totalPages || loading} 
            onClick={() => setPage(p => p + 1)}
            className="gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedMed?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentRating = hoverRating || parseFloat(rating);
                  const isFull = star <= currentRating;
                  const isHalf = star - 0.5 === currentRating;
                  
                  return (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110 relative w-8 h-8"
                      onMouseMove={(e) => {
                        const { left, width } = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - left) / width;
                        setHoverRating(star - 1 + (percent <= 0.5 ? 0.5 : 1));
                      }}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating((hoverRating || parseFloat(rating)).toString())}
                    >
                      <svg
                        className="absolute inset-0 w-8 h-8 text-slate-300 dark:text-slate-600 fill-transparent"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <div className={`absolute inset-0 overflow-hidden ${isHalf ? 'w-1/2' : isFull ? 'w-full' : 'w-0'}`}>
                        <svg
                          className="w-8 h-8 text-yellow-500 fill-yellow-500"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comment</Label>
              <textarea 
                className="w-full min-h-[100px] rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                placeholder="How did this medicine work for you?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={submittingReview}>
              <Send className="w-4 h-4" /> {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
