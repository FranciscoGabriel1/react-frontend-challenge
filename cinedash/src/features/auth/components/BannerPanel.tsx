import { motion } from 'framer-motion'
import bannerImage from '@/assets/images/banner.png'
import { useEffect, useRef } from 'react'

const FilmGrain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number | null = null

    const syncCanvasSize = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      if (width <= 0 || height <= 0) return false

      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height

      return true
    }

    const draw = () => {
      if (!syncCanvasSize()) {
        animId = null
        return
      }

      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = (Math.random() * 255) | 0
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = 18
      }

      ctx.putImageData(imageData, 0, 0)
      animId = requestAnimationFrame(draw)
    }

    const startDrawing = () => {
      if (!syncCanvasSize() || animId !== null) return
      animId = requestAnimationFrame(draw)
    }

    startDrawing()

    const observer = new ResizeObserver(() => {
      if (!syncCanvasSize()) {
        if (animId !== null) {
          cancelAnimationFrame(animId)
          animId = null
        }
        return
      }

      startDrawing()
    })
    observer.observe(canvas)

    return () => {
      if (animId !== null) cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  )
}

const taglineWords = ['Seu', 'universo', 'de', 'filmes', 'e', 'séries']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const shimmerVariants = {
  animate: { width: ['0%', '60%', '0%'], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } },
}

export const BannerPanel = () => (
  <div className="relative hidden lg:flex lg:w-[62%]">
    <img
      src={bannerImage}
      alt="CineDash banner"
      className="h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-black/50" />

    <FilmGrain />

    <div className="absolute inset-0 flex flex-col items-center justify-end gap-4 p-16">
      <motion.div
        className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
        variants={shimmerVariants}
        animate="animate"
        style={{ width: '0%' }}
      />

      <motion.p
        className="flex flex-wrap justify-center gap-x-2 text-center text-lg font-light tracking-widest text-white/70 uppercase"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {taglineWords.map((word) => (
          <motion.span key={word} variants={wordVariants}>
            {word}
          </motion.span>
        ))}
      </motion.p>
    </div>
  </div>
)
