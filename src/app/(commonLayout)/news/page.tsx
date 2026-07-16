import { newsService } from "@/services/news.service";
import { Calendar, Newspaper } from "lucide-react";
import Link from "next/link";

export default async function NewsPage() {
  const { data: newsList } = await newsService.getAll({ isActive: "true" });

  return (
    <div className="min-h-screen bg-background">
      <section className="overflow-hidden pt-20 pb-10">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Stay updated with the latest news <br /> and announcements.
        </h2>
      </section>

      <section className="pt-16 pb-20">
        <div className="container mx-auto max-w-5xl px-4">
          {!newsList || newsList.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No news available.
            </p>
          ) : (
            <div className="grid gap-6">
              {newsList.map((news) => {
                const date = new Date(news.publishedAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                );
                return (
                  <Link
                    key={news.id}
                    href={`/news/${news.id}`}
                    className="group rounded-xl border border-border p-4 md:p-6 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={news.publishedAt}>{date}</time>
                    </div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {news.title}
                    </h2>
                    {news.body && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {news.body}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
