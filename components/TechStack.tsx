"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { PipelineSeam } from "./PipelineSeam";
import { skillGroups } from "@/data/skills";

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => ["All", ...skillGroups.map((g) => g.category)], []);

  const visibleGroups = useMemo(() => {
    if (activeCategory === "All") return skillGroups;
    return skillGroups.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  const allItemsFlat = useMemo(
    () => skillGroups.flatMap((g) => g.items.map((item) => ({ item, category: g.category }))),
    []
  );

  return (
    <section id="stack" className="pb-24 sm:pb-28">
      <PipelineSeam label="stack" />
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="Toolbox"
          title="Technology stack"
          description="Filter by category, or leave it on All to see the whole mesh."
        />

        {/* filter pills — pipeline-tab style */}
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={
                "font-mono text-xs px-3.5 py-2 rounded-full border transition-colors " +
                (activeCategory === cat
                  ? "bg-ink text-white border-ink"
                  : "text-ink-soft border-line hover:border-emerald hover:text-ink")
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* All view: one flowing grid of chips */}
        {activeCategory === "All" ? (
          <motion.div layout className="mt-10 flex flex-wrap gap-2.5">
            <AnimatePresence mode="popLayout">
              {allItemsFlat.map(({ item, category }, i) => (
                <motion.span
                  layout
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.4) }}
                  title={category}
                  className="text-sm text-ink-soft bg-surface border border-line rounded-lg px-3 py-1.5 hover:border-emerald hover:text-ink hover:-translate-y-0.5 transition-all cursor-default"
                >
                  {item}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="mt-10 grid gap-8">
            {visibleGroups.map((group) => (
              <div key={group.category}>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint mb-4 border-b border-line pb-3">
                  {group.category}
                </p>
                <motion.div layout className="flex flex-wrap gap-2.5">
                  <AnimatePresence mode="popLayout">
                    {group.items.map((item, i) => (
                      <motion.span
                        layout
                        key={item}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, delay: i * 0.02 }}
                        className="text-sm text-ink-soft bg-surface border border-line rounded-lg px-3 py-1.5 hover:border-emerald hover:text-ink hover:-translate-y-0.5 transition-all cursor-default"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
