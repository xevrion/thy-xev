// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { pageSchema } from "fumadocs-core/source/schema";

// src/lib/remarkReadingTime.ts
import readingTime from "reading-time";
import { visit, SKIP } from "unist-util-visit";
function remarkReadingTime() {
  return (tree, file) => {
    const textParts = [];
    visit(tree, (node) => {
      if (node.type === "code" || node.type === "inlineCode") return SKIP;
      if (node.type === "text") textParts.push(node.value);
    });
    const plainText = textParts.join(" ").replace(/\s+/g, " ").trim();
    file.data.readingTime = readingTime(plainText, { wordsPerMinute: 260 });
  };
}

// source.config.ts
import { z } from "zod";
var docs = defineDocs({
  dir: "content/blog",
  docs: {
    schema: pageSchema.extend({
      tags: z.array(z.string()).optional(),
      date: z.coerce.date().optional()
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      valueToExport: ["readingTime", "lastModified"]
    }
  }
});
var source_config_default = defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: [remarkReadingTime],
    rehypeCodeOptions: {
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  source_config_default as default,
  docs
};
