// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
} & {
  DocData: {
    docs: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"3rdSem.mdx": () => import("../content/blog/3rdSem.mdx?collection=docs"), "DSARoadmap.mdx": () => import("../content/blog/DSARoadmap.mdx?collection=docs"), "IITJEthernetLoginIssue.mdx": () => import("../content/blog/IITJEthernetLoginIssue.mdx?collection=docs"), "agentic-architecture.mdx": () => import("../content/blog/agentic-architecture.mdx?collection=docs"), "aula-f75-linux-reverse-engineering.mdx": () => import("../content/blog/aula-f75-linux-reverse-engineering.mdx?collection=docs"), "browser-hostname-dualboot-fix.mdx": () => import("../content/blog/browser-hostname-dualboot-fix.mdx?collection=docs"), "dockerizing-portfolio.mdx": () => import("../content/blog/dockerizing-portfolio.mdx?collection=docs"), "echoGo.mdx": () => import("../content/blog/echoGo.mdx?collection=docs"), "ethernetIITJDockerIssue.mdx": () => import("../content/blog/ethernetIITJDockerIssue.mdx?collection=docs"), "firstTechRound.mdx": () => import("../content/blog/firstTechRound.mdx?collection=docs"), "iitjLoginGoRewrite.mdx": () => import("../content/blog/iitjLoginGoRewrite.mdx?collection=docs"), "kernelNvidia.mdx": () => import("../content/blog/kernelNvidia.mdx?collection=docs"), "newJourney.mdx": () => import("../content/blog/newJourney.mdx?collection=docs"), "notionClassroomIntegration.mdx": () => import("../content/blog/notionClassroomIntegration.mdx?collection=docs"), "npmPackageGuide.mdx": () => import("../content/blog/npmPackageGuide.mdx?collection=docs"), "pathwayHackathon.mdx": () => import("../content/blog/pathwayHackathon.mdx?collection=docs"), "ubuntu-to-fedora-hyprland.mdx": () => import("../content/blog/ubuntu-to-fedora-hyprland.mdx?collection=docs"), "windows-reinstall-grub-post.mdx": () => import("../content/blog/windows-reinstall-grub-post.mdx?collection=docs"), }),
};
export default browserCollections;