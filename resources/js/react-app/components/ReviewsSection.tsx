import React from 'react';
import { Star, CheckCircle2, MessageSquare, Quote } from 'lucide-react';
import { defaultReviews } from '../data/defaultData';
import { ReviewItem } from '../types/site';

export interface ReviewsSectionProps {
  reviews?: ReviewItem[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews = [] }) => {
  const displayReviews =
    reviews.length > 0
      ? reviews.map((r: any) => ({
          id: r.id,
          customer_name: r.ppp_user?.customer?.full_name || r.customer_name || 'Verified Customer',
          rating: r.rating || 5,
          package: r.ppp_user?.profile || r.package || 'Fiber Broadband',
          review: r.review || r.comment || 'Consistently fast internet connection and stellar support.',
          date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent',
          verified: true,
        }))
      : defaultReviews;

  return (
    <section id="reviews" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono text-zinc-300 shadow-sm mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans mb-3">
            Trusted by Power Users.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
            Real feedback from software developers, content streamers, gamers, and remote workers.
          </p>

          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10">
            <div className="flex text-zinc-200">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-white">4.9 / 5.0</span>
            <span className="text-xs text-zinc-500 font-mono">• 1,200+ Active Subscriptions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((rev: any, idx: number) => (
            <div
              key={rev.id || idx}
              className="saas-card p-6 sm:p-7 relative flex flex-col justify-between space-y-4 saas-card-hover"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-zinc-200 gap-0.5">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white font-sans">{rev.customer_name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">
                    {rev.package}
                  </span>
                </div>

                <Quote className="w-5 h-5 text-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
