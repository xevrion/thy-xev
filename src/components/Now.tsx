import { Title, Meta, Link as HeadLink } from "react-head";
import SplitText from "./reactbits/splittext";

const items = [
  { label: "learning",  value: "agentic architecture, contributing to Kdenlive" },
  { label: "building",  value: "improving DaemonDoc, cooking up something new" },
  { label: "reading",   value: "The Alchemist — Paulo Coelho" },
  { label: "listening", value: "Babydoll — Dominic Fike" },
  { label: "life",      value: "grind is on" },
  { label: "mood",      value: "chill" },
];

export const Now = () => {
  return (
    <>
      <Title>Now | Xevrion</Title>
      <Meta name="description" content="What Xevrion is up to right now." />
      <HeadLink rel="canonical" href="https://xevrion.dev/now" />

      <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <SplitText
            text="Now"
            className="text-5xl sm:text-6xl text-soft-royal-blue sg-bold mb-3"
            delay={20}
            duration={1}
            ease="elastic.out(1, 0.5)"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          />
          <p className="text-battleship-gray/60 sg-regular text-sm">what i'm up to right now</p>
        </div>

        <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 border-b border-battleship-gray/15 pb-5">
              <span className="text-battleship-gray/70 sg-regular text-base w-28 shrink-0">{item.label}</span>
              <span className="text-soft-royal-blue sg-medium text-lg">{item.value}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-battleship-gray/60 sg-regular text-sm">
          last updated 11 April 2026 · inspired by <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="hover:text-battleship-gray transition-colors">nownownow.com</a>
        </p>
      </section>
    </>
  );
};

export default Now;
