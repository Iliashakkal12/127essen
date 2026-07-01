import type { Review } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Rating } from "@/components/shared/rating";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((review) => (
        <Card key={review.id} className="gap-3 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-9">
                <AvatarFallback className="bg-secondary text-xs">{review.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{review.author}</p>
                <p className="text-xs text-muted-foreground">{review.service}</p>
              </div>
            </div>
            <Rating value={review.rating} />
          </div>
          <p className="text-sm text-muted-foreground">{review.comment}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(review.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </Card>
      ))}
    </div>
  );
}
