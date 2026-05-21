import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface HeroProps {
  t: (key: string) => string;
  lang: string;
}

export default function Hero({ t, lang }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-glow/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Greeting */}
          <motion.p variants={item} className="text-sm md:text-base font-mono text-text-secondary tracking-widest uppercase">
            {t('hero.greeting')}
          </motion.p>

          {/* Name */}
          <motion.h1 variants={item} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="gradient-text">{t('hero.name')}</span>
          </motion.h1>

          {/* Title */}
          <motion.p variants={item} className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t('hero.title')}
          </motion.p>

          {/* Subtitle */}
          <motion.p variants={item} className="text-sm md:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#projects"
              className="group relative px-8 py-3.5 bg-accent text-white font-medium rounded-full overflow-hidden transition-all hover:bg-accent-hover"
            >
              <span className="relative z-10">{t('hero.cta.view')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 border border-border text-text-secondary font-medium rounded-full hover:border-border-hover hover:text-text transition-all"
            >
              {t('hero.cta.contact')}
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-border rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-text-secondary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
