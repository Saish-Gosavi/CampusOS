import React from "react";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";

const Route = {
  head: () => ({
    meta: [
      { title: "Food Ratings & Feedback — Mess Manager" },
      { name: "description", content: "Student food quality feedback and reviews." }
    ]
  }),
  component: MessFeedbackPage
};

function MessFeedbackPage() {
  const reviews = [
    { id: 1, studentName: "Aarav Sharma", meal: "Lunch - Wednesday", rating: 5, comment: "Paneer butter masala and butter naan were super delicious!", date: "2026-08-05" },
    { id: 2, studentName: "Riya Sen", meal: "Dinner - Tuesday", rating: 4, comment: "Bhindi curry was well seasoned. Dal could be slightly thicker.", date: "2026-08-04" },
    { id: 3, studentName: "Karthik Raja", meal: "Breakfast - Sunday", rating: 5, comment: "Masala Dosa was crisp and sambhar was perfect!", date: "2026-08-02" },
    { id: 4, studentName: "Simran Kaur", meal: "Lunch - Monday", rating: 4, comment: "Good quality rice and fresh salad. Keep it up!", date: "2026-08-01" }
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Food Quality & Ratings</h1>
          <p className="text-xs text-muted-foreground">Student reviews and satisfaction ratings on daily hostel meals</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-purple-50 border border-purple-200 px-4 py-2">
          <div className="flex items-center gap-1 text-purple-700 font-bold text-lg">
            <Star className="h-5 w-5 fill-purple-600 text-purple-600" /> 4.5 / 5.0
          </div>
          <span className="text-xs text-purple-800 font-medium">Average Satisfaction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">{r.studentName}</h4>
                <p className="text-[11px] text-muted-foreground">{r.meal} • {r.date}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-amber-700 font-bold text-xs">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessFeedbackPage;
export { Route };
