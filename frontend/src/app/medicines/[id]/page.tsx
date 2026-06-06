"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jwtDecode } from "jwt-decode";
import { Edit2, Trash2, Send, X, ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MedicineDetailPage() {
  const params = useParams();
  const id = params.id;
  const [medicine, setMedicine] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userId, setUserId] = useState<number | null>(null);
  const [rating, setRating] = useState("5");
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch (e) {}
    }

    const fetchData = async () => {
      try {
        const [medRes, revRes] = await Promise.all([
          api.get(`/medicines/${id}/`),
          api.get(`/reviews/medicine/${id}/`)
        ]);
        setMedicine(medRes.data);
        // The reviews endpoint is paginated, so the array is in .results
        setReviews(revRes.data.results || []);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        const res = await api.put(`/reviews/${editingReview.id}/`, { rating: parseFloat(rating), comment });
        setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...res.data, user: r.user } : r));
        setEditingReview(null);
      } else {
        const res = await api.post(`/reviews/medicine/${id}/`, { rating: parseFloat(rating), comment });
        setReviews([res.data, ...reviews]);
      }
      setRating("5");
      setComment("");
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}/`);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review", err);
    }
  };

  const startEditing = (review: any) => {
    setEditingReview(review);
    setRating(review.rating.toString());
    setComment(review.comment);
  };

  if (loading) return <div className="p-10 text-center">Loading medicine details...</div>;
  if (!medicine) return <div className="p-10 text-center">Medicine not found.</div>;

  const hasReviewed = reviews.some(r => r.user.id === userId);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-8 py-8">
      <div>
        <Link href="/medicines" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Medicines
        </Link>
      </div>
      <Card>
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-3xl text-emerald-700 dark:text-emerald-400">{medicine.name}</CardTitle>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{medicine.generic_name}</p>
          </div>
          {medicine.url && (
            <Link 
              href={medicine.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors border border-emerald-200 dark:border-emerald-800 shrink-0"
            >
              View on Medex <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            {medicine.pack_image_url && (
              <div className="shrink-0 w-full md:w-56 lg:w-64 flex justify-center items-start bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                <img 
                  src={medicine.pack_image_url} 
                  alt={medicine.name} 
                  className="w-full max-h-[220px] object-contain mix-blend-multiply"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                {medicine.strength && <div><span className="font-semibold">Strength:</span> {medicine.strength}</div>}
                {medicine.manufacturer && <div><span className="font-semibold">Manufacturer:</span> {medicine.manufacturer}</div>}
                {medicine.type && <div><span className="font-semibold">Type:</span> {medicine.type}</div>}
                {medicine.dosage_form && <div><span className="font-semibold">Dosage Form:</span> {medicine.dosage_form}</div>}
              </div>
              <div className="space-y-4">
                {medicine.unit_price && <div><span className="font-semibold">Unit Price:</span> {medicine.unit_price}</div>}
                {medicine.strip_price && <div><span className="font-semibold">Strip Price:</span> {medicine.strip_price}</div>}
                {medicine.pack_size_info && <div><span className="font-semibold">Pack Size:</span> {medicine.pack_size_info}</div>}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
          {[
            { key: 'description', label: 'Description' },
            { key: 'indications', label: 'Indications' },
            { key: 'side_effects', label: 'Side Effects' }
          ].map(({ key, label }) => {
            if (!medicine[key]) return null;
            return (
              <div key={key} className="col-span-1 md:col-span-2 mt-4 space-y-2 border-t pt-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{label}</h3>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{medicine[key]}</p>
              </div>
            );
          })}

          {showMoreInfo && [
            { key: 'dosage_administration', label: 'Dosage & Administration' },
            { key: 'pharmacology', label: 'Pharmacology' },
            { key: 'interaction', label: 'Interaction' },
            { key: 'contraindications', label: 'Contraindications' },
            { key: 'pregnancy_lactation', label: 'Pregnancy & Lactation' },
            { key: 'precautions_warnings', label: 'Precautions & Warnings' },
            { key: 'special_populations', label: 'Special Populations' },
            { key: 'overdose_effects', label: 'Overdose Effects' },
            { key: 'therapeutic_class', label: 'Therapeutic Class' },
            { key: 'storage_conditions', label: 'Storage Conditions' },
            { key: 'chemical_structure', label: 'Chemical Structure' },
            { key: 'reconstitution', label: 'Reconstitution' },
            { key: 'common_questions', label: 'Common Questions' },
            { key: 'alternate_brands', label: 'Alternate Brands' },
            { key: 'innovators_monograph', label: 'Innovator\'s Monograph' }
          ].map(({ key, label }) => {
            if (!medicine[key]) return null;
            return (
              <div key={key} className="col-span-1 md:col-span-2 mt-4 space-y-2 border-t pt-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{label}</h3>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{medicine[key]}</p>
              </div>
            );
          })}

          {(() => {
            const advancedKeys = [
              'dosage_administration', 'pharmacology', 'interaction', 'contraindications', 
              'pregnancy_lactation', 'precautions_warnings', 'special_populations', 
              'overdose_effects', 'therapeutic_class', 'storage_conditions', 
              'chemical_structure', 'reconstitution', 'common_questions', 
              'alternate_brands', 'innovators_monograph'
            ];
            const hasMore = advancedKeys.some(key => !!medicine[key]);
            if (!hasMore) return null;
            return (
              <div className="flex justify-center mt-4 pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMoreInfo(!showMoreInfo)}
                  className="gap-2 rounded-full px-6"
                >
                  {showMoreInfo ? (
                    <><ChevronUp className="w-4 h-4" /> Show Less Information</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> Show More Information</>
                  )}
                </Button>
              </div>
            );
          })()}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Reviews</h2>
        
        {userId ? (
          (!hasReviewed || editingReview) ? (
            <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <h3 className="font-semibold text-lg">{editingReview ? "Edit Your Review" : "Write a Review"}</h3>
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
                      className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Share your experience with this medicine..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="gap-2">
                      <Send className="w-4 h-4" /> {editingReview ? "Update Review" : "Submit Review"}
                    </Button>
                    {editingReview && (
                      <Button type="button" variant="ghost" className="gap-2" onClick={() => {
                        setEditingReview(null);
                        setRating("5");
                        setComment("");
                      }}>
                        <X className="w-4 h-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
              You have already reviewed this medicine. You can edit your review below.
            </div>
          )
        ) : (
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-md text-center flex flex-col items-center justify-center gap-3">
            <span className="text-slate-600 dark:text-slate-400">Please log in to write a review.</span>
            <Button onClick={() => window.dispatchEvent(new Event("openLogin"))}>
              Log In
            </Button>
          </div>
        )}

        <div className="space-y-4 mt-6">
          {reviews.length === 0 ? (
            <p className="text-slate-500 italic text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <Card key={review.id} className={review.user.id === userId ? "border-emerald-200 dark:border-emerald-800" : ""}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{review.user.first_name} {review.user.last_name}</span>
                        <span className="text-sm text-slate-500">(@{review.user.username})</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 my-1">
                        {[1, 2, 3, 4, 5].map(star => {
                          const ratingValue = Number(review.rating);
                          const isFull = star <= ratingValue;
                          const isHalf = star - 0.5 === ratingValue;
                          return (
                            <div key={star} className="relative w-4 h-4">
                              <svg className="absolute inset-0 w-4 h-4 text-slate-300 dark:text-slate-600 fill-transparent" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <div className={`absolute inset-0 overflow-hidden ${isHalf ? 'w-1/2' : isFull ? 'w-full' : 'w-0'}`}>
                                <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="mt-3 text-slate-700 dark:text-slate-300">{review.comment}</p>
                  
                  {review.user.id === userId && !editingReview && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => startEditing(review)}>
                        <Edit2 className="w-3 h-3" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDeleteReview(review.id)}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
