"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/portfolio";

type SectionId = (typeof navigation)[number]["id"];
const isSection = (id: string): id is SectionId =>
  navigation.some((item) => item.id === id);

function navigationOffset() {
  return (
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navigation-offset",
      ),
    ) || 115
  );
}

export function useSectionNavigation() {
  const [active, setActive] = useState<SectionId>("home");
  const destination = useRef<{ id: SectionId; top: number } | null>(null);
  const navigationFrame = useRef(0);

  const navigate = useCallback((id: string, updateHistory = true) => {
    if (!isSection(id)) return;
    destination.current = { id, top: Number.POSITIVE_INFINITY };
    setActive(id);
    if (updateHistory) {
      const nextUrl = `${window.location.pathname}${window.location.search}${id === "home" ? "" : `#${id}`}`;
      if (
        `${window.location.pathname}${window.location.search}${window.location.hash}` !==
        nextUrl
      ) {
        window.history.pushState(null, "", nextUrl);
      }
    }
    cancelAnimationFrame(navigationFrame.current);
    // Wait for mobile drawers and modal dialogs to close before scrolling.
    navigationFrame.current = requestAnimationFrame(() => {
      const section = document.getElementById(id);
      if (!section) return;
      const maximum = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const top =
        id === "home"
          ? 0
          : Math.min(
              maximum,
              Math.max(
                0,
                window.scrollY +
                  section.getBoundingClientRect().top -
                  navigationOffset(),
              ),
            );
      destination.current = { id, top };
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }, []);

  useEffect(() => {
    let updateFrame = 0;
    let disposed = false;
    let initialNavigationCancelled = false;
    const updateActive = () => {
      updateFrame = 0;
      if (destination.current) {
        // Keep the clicked item selected while passing intermediate sections.
        if (Math.abs(window.scrollY - destination.current.top) > 2) return;
        setActive(destination.current.id);
        destination.current = null;
        return;
      }
      const maximum =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maximum > 0 && window.scrollY >= maximum - 2) {
        setActive(navigation[navigation.length - 1].id);
        return;
      }
      const offset = navigationOffset() + 2;
      let current: SectionId = "home";
      for (const item of navigation) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= offset)
          current = item.id;
      }
      setActive(current);
    };
    const scheduleUpdate = () => {
      if (!updateFrame) updateFrame = requestAnimationFrame(updateActive);
    };
    const interrupt = () => {
      initialNavigationCancelled = true;
      destination.current = null;
      cancelAnimationFrame(navigationFrame.current);
      scheduleUpdate();
    };
    const interruptKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      )
        return;
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        interrupt();
    };
    const finishScroll = () => {
      if (
        destination.current &&
        Math.abs(window.scrollY - destination.current.top) > 2
      )
        return;
      destination.current = null;
      scheduleUpdate();
    };
    const followLocation = () =>
      navigate(window.location.hash.slice(1) || "home", false);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("pointerdown", interrupt, { passive: true });
    window.addEventListener("keydown", interruptKey);
    window.addEventListener("scrollend", finishScroll);
    window.addEventListener("popstate", followLocation);
    window.addEventListener("hashchange", followLocation);
    const resize = new ResizeObserver(scheduleUpdate);
    resize.observe(document.documentElement);
    const initialSection = window.location.hash.slice(1);
    if (isSection(initialSection)) {
      followLocation();
      // Web fonts can move sections after the initial browser fragment jump.
      void document.fonts.ready.then(() => {
        if (
          !disposed &&
          !initialNavigationCancelled &&
          window.location.hash.slice(1) === initialSection
        ) {
          navigate(initialSection, false);
        }
      });
    } else scheduleUpdate();

    return () => {
      disposed = true;
      cancelAnimationFrame(updateFrame);
      cancelAnimationFrame(navigationFrame.current);
      resize.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interruptKey);
      window.removeEventListener("scrollend", finishScroll);
      window.removeEventListener("popstate", followLocation);
      window.removeEventListener("hashchange", followLocation);
    };
  }, [navigate]);

  return { active, navigate };
}
