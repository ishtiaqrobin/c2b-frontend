import { newsService } from "@/services/news.service";
import { Calendar, Newspaper, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: news } = await newsService.getById(slug);

  if (!news) return { title: "News Not Found | Kroydot" };

  return {
    title: `${news.title} | Kroydot`,
    description: news.body?.slice(0, 160) ?? "Read the latest news",
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: news, error } = await newsService.getById(slug);

  if (error || !news) {
    notFound();
  }

  const publishedDate = new Date(news.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background mx-auto max-w-4xl px-4">
      <section className="overflow-hidden py-16">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
          <div className="flex items-center justify-start gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={news.publishedAt}>{publishedDate}</time>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {news.title}
          </h1>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="">
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            {news.body ? (
              <div className="leading-relaxed text-muted-foreground whitespace-pre-line">
                {news.body}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No content available.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
