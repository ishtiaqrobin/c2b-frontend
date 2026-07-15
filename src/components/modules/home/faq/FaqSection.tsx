"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { faqService } from "@/services/faq.service";
import type { IFaq } from "@/types/faq.type";

export default function FaqSection() {
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    faqService.getAll({ isActive: "true" }).then((res) => {
      if (res.data) setFaqs(res.data);
    });
  }, []);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="container-custom py-10 sm:py-24">
      <h2 className="mb-10 text-4xl lg:text-5xl font-clash font-medium tracking-wide leading-12 text-text-primary">
        Here are some frequently <br /> asked questions?
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:gap-8 items-start">
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            const num = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={faq.id}
                onClick={() => toggle(faq.id)}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 cursor-pointer transition-all duration-500"
              >
                <div className="flex items-center justify-between py-4 gap-6">
                  <span className="text-base font-medium text-text-primary flex items-start gap-2">
                    <span className="text-base font-medium text-text-primary tabular-nums">
                      {num}.
                    </span>
                    {faq.question}
                  </span>

                  <span
                    className="text-text-primary shrink-0"
                    style={{
                      display: "inline-block",
                      transition:
                        "transform 350ms cubic-bezier(0.25, 1, 0.5, 1)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>

                <motion.div
                  initial={false}
                  animate={
                    isOpen
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="pb-4 text-base text-text-primary">
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
