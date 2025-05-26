import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TextareaWithCopy from '@/components/TextareaWithCopy'; // client helper

type Hook = {
  seo: {
    title: string;
    meta_desc: string;
    keywords: string[];
  };
  copy: {
    cta: string[];
    tweet: string;
    linkedin: string;
    facebook: string;
    instagram: { caption: string; hashtags: string[] };
  };
};

export function HookTabs({ data }: { data: Hook }) {
  return (
    <Tabs defaultValue="seo">
      <TabsList>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="tweet">X</TabsTrigger>
        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        <TabsTrigger value="facebook">Facebook</TabsTrigger>
        <TabsTrigger value="insta">Instagram</TabsTrigger>
      </TabsList>

      {/* SEO */}
      <TabsContent value="seo" className="space-y-4 text-sm">
        <section>
          <h3 className="font-semibold">Title</h3>
          <p>{data.seo.title}</p>
        </section>
        <section>
          <h3 className="font-semibold">Meta description</h3>
          <p className="text-muted-foreground">{data.seo.meta_desc}</p>
        </section>
        <div className="flex flex-wrap gap-1">
          {data.seo.keywords.map(k => (
            <Badge key={k}>{k}</Badge>
          ))}
        </div>
        <section>
          <h3 className="font-semibold">CTAs</h3>
          <ul className="list-disc pl-5">
            {data.copy.cta.map(c => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </TabsContent>

      {/* X / Tweet */}
      <TabsContent value="tweet">
        <TextareaWithCopy label="Tweet" text={data.copy.tweet} />
      </TabsContent>

      {/* LinkedIn */}
      <TabsContent value="linkedin">
        <TextareaWithCopy label="LinkedIn post" text={data.copy.linkedin} />
      </TabsContent>

      {/* Facebook */}
      <TabsContent value="facebook">
        <TextareaWithCopy label="Facebook copy" text={data.copy.facebook} />
      </TabsContent>

      {/* Instagram */}
      <TabsContent value="insta">
        <TextareaWithCopy label="Caption" text={data.copy.instagram.caption} />
        <div className="flex flex-wrap gap-1 mt-2">
          {data.copy.instagram.hashtags.map(h => (
            <Badge key={h}>#{h}</Badge>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
