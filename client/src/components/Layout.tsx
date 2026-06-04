import type { ReactNode } from "react";
import stickyNote1 from "../assets/sticky-note-1.png";
import stickyNote2 from "../assets/sticky-note-2.png";
import stickyNote3 from "../assets/sticky-note-3.png";
import FloatingArrow from "./FloatingArrow";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className="fixed inset-0 -z-10 bg-white bg-[radial-gradient(#dbdbdb_1px,transparent_1px)] bg-size-[20px_20px]" />

      <img
        src={stickyNote1}
        alt="StickyNote1"
        className="fixed bottom-20 right-100 -z-10 w-80 opacity-50 pointer-events-none select-none"
      />

      <img
        src={stickyNote2}
        alt="StickyNote2"
        className="fixed top-30 left-55 -z-10 w-80 rotate-[-15deg] opacity-50 pointer-events-none select-none"
      />

      <img
        src={stickyNote3}
        alt="StickyNote3"
        className="fixed top-5 right-20 -z-10 w-80 rotate-15 opacity-50 pointer-events-none select-none"
      />

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <FloatingArrow
          color="#FFB6C1"
          className="top-30 left-10 rotate-[-50deg]"
          duration={20}
          delay={5}
        />

        <FloatingArrow
          color="#FFD700"
          className="top-1/2 right-20 rotate-[-50deg]"
          duration={15}
          delay={1}
        />

        <FloatingArrow
          color="#1E90FF"
          className="bottom-20 left-1/3 rotate-[-50deg]"
          duration={25}
          delay={0.5}
        />
      </div>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
