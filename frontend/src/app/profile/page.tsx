"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserCircle, Star, Trash2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  // Review states
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          api.get("/auth/profile/"),
          api.get("/reviews/me/")
        ]);
        setProfile(profileRes.data);
        setEditForm(profileRes.data);
        setReviews(reviewsRes.data.results || reviewsRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch("/auth/profile/", {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone_number: editForm.phone_number,
        gender: editForm.gender,
      });
      setProfile(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please check the inputs and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
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

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    try {
      const res = await api.put(`/reviews/${editingReview.id}/`, { rating: parseFloat(rating), comment });
      setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...res.data } : r));
      setEditingReview(null);
    } catch (err) {
      console.error("Error updating review", err);
      alert("Failed to update review.");
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading profile...</div>;
  if (!profile) return <div className="p-12 text-center text-slate-500">Failed to load profile.</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        
        {/* Header Profile Info */}
        <header className="flex items-center gap-6 mb-16">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
            <UserCircle className="w-12 h-12 text-slate-300 dark:text-slate-700" strokeWidth={1} />
          </div>
          <div>
            <h1 className="text-3xl font-light tracking-tight">{profile.first_name} {profile.last_name}</h1>
            <p className="text-slate-500 mt-1 text-sm">@{profile.username}</p>
          </div>
        </header>

        <div className="space-y-16">
          {/* Profile Details Section */}
          <section>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
              <h2 className="text-xl font-medium tracking-tight">Profile Details</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-xs font-medium text-slate-500">First Name</Label>
                    <Input 
                      id="first_name" 
                      value={editForm.first_name || ""} 
                      onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} 
                      className="border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-xs font-medium text-slate-500">Last Name</Label>
                    <Input 
                      id="last_name" 
                      value={editForm.last_name || ""} 
                      onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} 
                      className="border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-slate-500">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={editForm.email || ""} 
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                      className="border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-xs font-medium text-slate-500">Phone Number</Label>
                    <Input 
                      id="phone_number" 
                      value={editForm.phone_number || ""} 
                      onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})} 
                      className="border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-slate-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="gender" className="text-xs font-medium text-slate-500">Gender</Label>
                    <Select value={editForm.gender || ""} onValueChange={(v: any) => setEditForm({...editForm, gender: (v as string) || ""})}>
                      <SelectTrigger className="border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-slate-400">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded shadow-none">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <button onClick={handleCancel} disabled={saving} className="text-sm text-slate-500 hover:text-slate-900">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <div className="text-xs text-slate-400 mb-1 tracking-wide uppercase">Email Address</div>
                  <div className="text-sm">{profile.email || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1 tracking-wide uppercase">Phone Number</div>
                  <div className="text-sm">{profile.phone_number || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1 tracking-wide uppercase">Gender</div>
                  <div className="text-sm">{profile.gender || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1 tracking-wide uppercase">Status</div>
                  <div className="text-sm text-emerald-600">Active</div>
                </div>
              </div>
            )}
          </section>

          {/* Reviews Section */}
          <section>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
              <h2 className="text-xl font-medium tracking-tight">My Reviews</h2>
            </div>
            
            <div className="space-y-8">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded">
                  <p>You haven't reviewed any medicines yet.</p>
                  <Link href="/medicines" className="text-slate-900 hover:underline mt-2 inline-block">
                    Browse Medicines
                  </Link>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="group border border-slate-200 dark:border-slate-800 rounded p-6 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                    {editingReview?.id === review.id ? (
                      <form onSubmit={handleUpdateReview} className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">Edit Review for {review.medicine.name}</h3>
                          <button type="button" onClick={() => setEditingReview(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-500">Rating</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const currentRating = hoverRating || parseFloat(rating);
                              const isFull = star <= currentRating;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  className="focus:outline-none"
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => setRating((hoverRating || parseFloat(rating)).toString())}
                                >
                                  <Star className={`w-5 h-5 ${isFull ? 'fill-slate-900 text-slate-900 dark:fill-slate-100 dark:text-slate-100' : 'text-slate-300 dark:text-slate-700'}`} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-500">Comment</Label>
                          <textarea 
                            className="w-full min-h-[100px] p-3 text-sm rounded border border-slate-200 dark:border-slate-800 shadow-none focus:ring-1 focus:ring-slate-400 outline-none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded shadow-none text-sm h-9">
                          Update Review
                        </Button>
                      </form>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Link 
                              href={`/medicines/${review.medicine.id}`} 
                              className="text-base font-medium text-slate-900 hover:underline dark:text-slate-100"
                            >
                              {review.medicine.name}
                            </Link>
                            <span className="text-xs text-slate-500 ml-2">{review.medicine.strength}</span>
                          </div>
                          
                          {/* Actions (visible on hover or always on touch) */}
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(review)} className="text-slate-400 hover:text-slate-900 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteReview(review.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-slate-900 text-slate-900 dark:fill-slate-100 dark:text-slate-100' : 'text-slate-200 dark:text-slate-800'}`} 
                            />
                          ))}
                          <span className="text-xs text-slate-400 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
