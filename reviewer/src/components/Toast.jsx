import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, X } from "lucide-react"

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000) // Increased to 5 seconds for better readability

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const onAnimationComplete = () => {
    if (!isVisible) {
      onClose()
    }
  }

  const variants = {
    initial: { opacity: 0, y: 50, scale: 0.5 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  }

  const getToastColor = () => {
    switch (type) {
      case "success":
        return "bg-emerald-500/20 border-emerald-500/50 text-emerald-700"
      case "error":
        return "bg-rose-500/20 border-rose-500/50 text-rose-700"
      default:
        return "bg-blue-500/20 border-blue-500/50 text-blue-700"
    }
  }

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "text-emerald-500"
      case "error":
        return "text-rose-500"
      default:
        return "text-blue-500"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={onAnimationComplete}
          className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border ${getToastColor()}`}
        >
          <div className={`${getIconColor()}`}>
            {type === "success" ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={handleClose}
            className={`ml-2 ${getIconColor()} hover:opacity-70 focus:outline-none transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast

