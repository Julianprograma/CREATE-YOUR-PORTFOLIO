'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Code2, Zap } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen pt-28 lg:pt-32 flex flex-col justify-center items-center px-6 overflow-hidden bg-[#000000]">
      
      {/* Gradiente sutil de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/10 pointer-events-none -z-10" />
      
      {/* Efecto de luz minimalista */}
      <div className="absolute top-16 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-6xl mx-auto z-10 w-full"
      >
        {/* Badge subtil */}
        <motion.div variants={itemVariants} className="mb-12 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <Code2 size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-neutral-300">Ingeniería de Sistemas</span>
          </div>
        </motion.div>

        {/* Titular Principal - Estilo Apple */}
        <motion.h1 
          variants={itemVariants} 
          className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.05]"
        >
          Sistemas que <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-500">generan impacto</span>
        </motion.h1>

        {/* Descripción - Limpia y directa */}
        <motion.p 
          variants={itemVariants} 
          className="text-lg md:text-xl text-neutral-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
        >
          Desarrollo de soluciones tecnológicas eficientes, escalables y centradas en la experiencia del usuario. 
          Combinando arquitectura sólida con visión estratégica.
        </motion.p>

        {/* Credenciales */}
        <motion.div 
          variants={itemVariants} 
          className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-neutral-300">9° Semestre</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-blue-400" />
            <span className="text-neutral-300">Ingeniería en Sistemas</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/10"></div>
          <span className="text-neutral-500">Universidad de Cundinamarca</span>
        </motion.div>

        {/* Botones CTA - Minimalista */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="#proyectos" 
            className="group px-8 py-3 bg-white text-black rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-all duration-300 inline-flex items-center gap-2"
          >
            Explorar Proyectos
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a 
            href="#contacto" 
            className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            Contactar
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Muy sutil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-neutral-500 tracking-widest">SCROLL</span>
          <ChevronDown size={16} className="text-neutral-600" />
        </motion.div>
      </motion.div>

    </section>
  );
}