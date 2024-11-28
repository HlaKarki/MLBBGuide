import { motion } from 'framer-motion';
import React from 'react';
import { LucideProps } from 'lucide-react';

export function FeatureCard({
  feature,
  index = 0,
}: {
  feature: {
    link?: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >;
    title: string;
    description: string;
  };
  index?: number;
}) {
  const Component = feature.link ? motion.a : motion.div;

  return (
    <Component
      {...(feature.link && { href: feature.link })}
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
    >
      <feature.icon className="mx-auto w-12 h-12 mb-4 text-violet-400" />
      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
      <p className="text-gray-300">{feature.description}</p>
    </Component>
  );
}
