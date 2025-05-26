// src/components/CopySetCard.tsx
import {
    Card, CardHeader, CardTitle, CardContent,
  } from '@/components/ui/card';
  
  export function CopySetCard({ data }: { data: any }) {
    return (
      <Card className="animate-in fade-in-50">
        <CardHeader>
          <CardTitle>AI Hooks</CardTitle>
        </CardHeader>
  
        <CardContent className="space-y-4 text-sm">
          {/* SEO ------------------------------------------------------- */}
          <section>
            <h3 className="font-semibold">SEO Title</h3>
            <p>{data.seo.title}</p>
          </section>
  
          <section>
            <h3 className="font-semibold">Meta Description</h3>
            <p className="text-muted-foreground">{data.seo.meta_desc}</p>
          </section>
  
          {/* CTA ------------------------------------------------------- */}
          <section>
            <h3 className="font-semibold">CTAs</h3>
            <ul className="list-disc pl-5 space-y-1">
              {data.copy.cta.map((c: string) => <li key={c}>{c}</li>)}
            </ul>
          </section>
        </CardContent>
      </Card>
    );
  }
  