import { Download } from "lucide-react";
import { Title, Meta, Link as HeadLink } from "react-head";
import SplitText from "./reactbits/splittext";

const DRIVE_FILE_ID = "1uIcQ10m-TV1sfBsVp4UM7aIf9AQ9bvBH";
const EMBED_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;

export const Resume = () => {
  return (
    <>
      <Title>Resume | Xevrion - Full Stack Developer</Title>
      <Meta name="title" content="Resume | Xevrion - Full Stack Developer" />
      <Meta name="description" content="View and download Yash Bavadiya's resume. Full Stack Developer and CS student at IIT Jodhpur." />
      <HeadLink rel="canonical" href="https://xevrion.dev/resume" />

      <Meta property="og:type" content="website" />
      <Meta property="og:url" content="https://xevrion.dev/resume" />
      <Meta property="og:title" content="Resume | Xevrion" />
      <Meta property="og:description" content="View and download Yash Bavadiya's resume." />
      <Meta property="og:image" content="https://xevrion.dev/android-chrome-512x512.png" />

      <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto flex flex-col gap-8">

        {/* Heading + download */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SplitText
            text="Resume"
            className="text-5xl sm:text-6xl text-soft-royal-blue sg-bold"
            delay={20}
            duration={1}
            ease="elastic.out(1, 0.5)"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          />
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-battleship-gray text-battleship-gray sg-medium text-sm hover:border-soft-royal-blue hover:text-soft-royal-blue transition-colors duration-200 w-fit"
          >
            <Download size={15} />
            Download PDF
          </a>
        </div>

        {/* PDF embed */}
        <div className="w-full rounded-xl overflow-hidden border border-battleship-gray/30" style={{ height: "80vh" }}>
          <iframe
            src={EMBED_URL}
            title="Resume"
            className="w-full h-full"
            allow="autoplay"
          />
        </div>

      </section>
    </>
  );
};

export default Resume;
