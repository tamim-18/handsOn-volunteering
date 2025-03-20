"use client";

import { motion } from "framer-motion";
import { BackgroundPattern } from "./BackgroundPattern";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageLayout({
  children,
  title,
  description,
  actions,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <BackgroundPattern />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {(title || actions) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-start mb-8"
            >
              <div>
                {title && (
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-muted-foreground mt-2">{description}</p>
                )}
              </div>
              {actions && <div>{actions}</div>}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
