"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function ProductReviews({ productId }: { productId: string }) {
  const { showToast } = useAppContext();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !displayName || !emailAddress) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSubmitting(true);
    let imageUrl = "";

    try {
      // 1. Upload Image if exists
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const path = await uploadRes.text();
          imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
        }
      }

      // 2. Submit Review
      const reviewData = {
        productId,
        rating,
        title,
        content,
        displayName,
        emailAddress,
        image: imageUrl,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        showToast("Review submitted successfully!", "success");
        setShowForm(false);
        // Reset form
        setRating(5);
        setTitle("");
        setContent("");
        setDisplayName("");
        setEmailAddress("");
        setImageFile(null);
        fetchReviews(); // Refresh list
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "Failed to submit review", "error");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      showToast("An error occurred while submitting", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <i
        key={idx}
        className={`fa-solid fa-star ${idx < ratingValue ? "text-luxePink-500" : "text-gray-600"} text-sm mr-1`}
      ></i>
    ));
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length
  }));

  if (loading) return null;

  return (
    <div className="mt-20 border-t border-luxePink-500/10 pt-16">
      <h2 className="text-3xl font-cinzel text-white text-center mb-12">Customer Reviews</h2>

      {!showForm ? (
        <div className="max-w-4xl mx-auto">
          {reviews.length === 0 ? (
            <div className="bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-8 mb-12">
               <h3 className="text-white font-bold text-lg mb-4 pb-4 border-b border-luxePink-500/10">Reviews (0)</h3>
               <div className="flex justify-between items-center mb-6">
                 <h4 className="text-xl text-white font-cinzel">Customer Reviews</h4>
                 <button 
                   onClick={() => setShowForm(true)}
                   className="border border-luxePink-500 text-luxePink-500 hover:bg-luxePink-500 hover:text-white px-6 py-2 rounded-full text-sm font-bold tracking-wider luxury-transition"
                 >
                   Write a review
                 </button>
               </div>
               <p className="text-gray-400 text-sm">No reviews yet.</p>
             </div>
          ) : (
            <>
              {/* Summary Section */}
              <div className="flex flex-col md:flex-row items-center justify-between bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-8 mb-12">
                
                <div className="text-center md:text-left mb-8 md:mb-0">
                  <div className="mb-2">{renderStars(Math.round(parseFloat(avgRating)))}</div>
                  <p className="text-white text-xl font-bold">{avgRating} out of 5</p>
                  <p className="text-gray-400 text-sm mt-1">Based on {reviews.length} reviews <i className="fa-solid fa-check-circle text-luxePink-500 ml-1"></i></p>
                </div>

                <div className="flex-1 max-w-sm w-full mx-8">
                  {ratingCounts.map(({ stars, count }) => (
                    <div key={stars} className="flex items-center gap-4 text-sm mb-2">
                      <div className="flex w-16">{renderStars(stars)}</div>
                      <div className="flex-1 bg-velvet-500 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-luxePink-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <div className="w-4 text-gray-400 text-right">{count}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 md:mt-0 text-center md:text-right">
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-luxePink-600 to-fuchsia-600 hover:from-luxePink-500 hover:to-fuchsia-500 text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider luxury-transition shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                  >
                    Write a review
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-8">
                <h3 className="text-xs uppercase tracking-widest text-luxePink-500 mb-6">Most Recent</h3>
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-luxePink-500/10 pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium capitalize flex items-center gap-2">
                            <i className="fa-regular fa-user text-luxePink-500"></i> {review.displayName}
                          </span>
                          <span className="bg-luxePink-500/20 text-luxePink-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Verified</span>
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <h4 className="text-white font-semibold mb-2">{review.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{review.content}</p>
                    {review.image && (
                      <img src={review.image} alt="Review attachment" className="w-24 h-24 object-cover rounded-lg border border-luxePink-500/20" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Form Mode */
        <div className="max-w-2xl mx-auto bg-velvet-300 border border-luxePink-500/20 rounded-2xl p-8 sm:p-12 shadow-2xl relative">
          <h3 className="font-cinzel text-2xl text-white text-center mb-8">Write a review</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="text-center mb-8">
              <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">Rating</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    onClick={() => setRating(star)}
                    className={`fa-solid fa-star text-2xl cursor-pointer transition-colors ${rating >= star ? 'text-luxePink-500' : 'text-gray-600 hover:text-luxePink-400'}`}
                  ></i>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Review Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your review a title"
                className="w-full bg-velvet-400 border border-luxePink-500/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxePink-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Review Content</label>
              <textarea
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing here..."
                rows={5}
                className="w-full bg-velvet-400 border border-luxePink-500/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxePink-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Picture/Video (Optional)</label>
              <div className="border-2 border-dashed border-luxePink-500/30 rounded-lg p-8 text-center bg-velvet-400 hover:bg-velvet-500 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files && setImageFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-luxePink-500 mb-2"></i>
                <p className="text-gray-400 text-sm">
                  {imageFile ? imageFile.name : "Click or drag to upload an image"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full bg-velvet-400 border border-luxePink-500/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxePink-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-velvet-400 border border-luxePink-500/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-luxePink-500 transition-colors"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-500 text-center italic mt-4">
              How we use your data: We'll only contact you about the review you left, and only if necessary. By submitting your review, you agree to our terms and privacy policies.
            </p>

            <div className="flex justify-center gap-4 pt-6 border-t border-luxePink-500/10">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-3 rounded text-sm font-bold uppercase tracking-wider border border-luxePink-500/30 text-gray-300 hover:text-white hover:border-luxePink-500 transition-colors"
              >
                Cancel Review
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-luxePink-500 hover:bg-luxePink-600 disabled:opacity-50 text-white px-8 py-3 rounded text-sm font-bold uppercase tracking-wider luxury-transition shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
