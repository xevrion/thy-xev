import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import constants from "../../constants/data.json";

// Import all icons you'll map to
import {
  FaJs,
  FaPython,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaLinux,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiC,
  SiCplusplus,
  SiTypescript,
  SiGoland,
  SiRust,
  SiNextdotjs,
  SiSvelte,
  SiTailwindcss,
  SiExpress,
  SiProxmox,
  // SiWasm,
  SiTensorflow,
  SiPytorch,
  SiNumpy,
  SiPandas,
  SiGithub,
  // SiVisualstudiocode,
  SiVim,
  SiArchlinux,
  SiVercel,
  SiWakatime,
  SiNeovim,
} from "react-icons/si";



gsap.registerPlugin(ScrollTrigger);

// Map skill string → Icon component
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  c: SiC,
  cplusplus: SiCplusplus,
  python: FaPython,
  java: FaJava,
  go: SiGoland,
  rust: SiRust,
  javascript: FaJs,
  typescript: SiTypescript,
  html5: FaHtml5,
  css3: FaCss3Alt,
  react: FaReact,
  nextjs: SiNextdotjs,
  svelte: SiSvelte,
  tailwindcss: SiTailwindcss,
  nodejs: FaNodeJs,
  express: SiExpress,
  docker: FaDocker,
  proxmox: SiProxmox,
  // wasm: SiWasm,
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,
  numpy: SiNumpy,
  pandas: SiPandas,
  git: FaGitAlt,
  github: SiGithub,
  // vscode: SiVisualstudiocode,
  vim: SiVim,
  nvim: SiNeovim,
  archlinux: SiArchlinux,
  linux: FaLinux,
  vercel: SiVercel,
  wakatime: SiWakatime,
};

export default function Skills() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const icons = containerRef.current.children;
    gsap.from(icons, {
      opacity: 0,
      scale: 0,
      rotate: -45,
      stagger: 0.04,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        // markers: true,
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto"
    >
      {constants.techStack.map((tech, i) => {
        const Icon = iconMap[tech];
        if (!Icon) return null;
        return (
          <div key={i} className="inline-block">
            <Icon className="skill-icon w-10 h-10 text-[#bcb8b1] hover:rotate-15 hover:scale-[1.1] transition-all duration-250" />
          </div>
        );
      })}
    </div>
  );
}
