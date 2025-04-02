import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useNavigate } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

function homepage() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EDE8F5] to-[#D2DAFF]">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-bold text-[#3D52A0]">ReviewIt</span>
          </div>
          <div>
            <button className="px-4 py-2 text-sm font-medium text-[#3D52A0] hover:text-[#7091E6] mr-4" 
            onClick={() => navigate('/login')}>Log in</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#7091E6] rounded-md hover:bg-[#3D52A0]"
            onClick={() => navigate('/demo-request')}>
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-[#3D52A0] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                className="text-4xl font-extrabold sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Empower Your Restaurant with Customer Feedback
              </motion.h1>
              <motion.p
                className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Join our platform to collect, manage, and leverage customer feedback to improve your restaurant's
                performance.
              </motion.p>
              <motion.div
                className="mt-10 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <button className="px-8 py-3 text-lg font-medium text-white bg-[#7091E6] rounded-full 
                  shadow-md hover:shadow-lg hover:bg-[#8697C4] transition-all duration-300 ease-in-out"
                  onClick={() => navigate('/demo-request')}>
                  Get Started
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={staggerChildren} ref={ref}>
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <motion.h2 className="text-3xl font-extrabold text-[#3D52A0] sm:text-4xl" variants={fadeIn}>
                  How It Works
                </motion.h2>
                <motion.p className="mt-4 max-w-2xl mx-auto text-xl text-[#8697C4]" variants={fadeIn}>
                  Join our platform in three simple steps
                </motion.p>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Join the Platform",
                      description:
                        "Contact us to express your interest in joining. Our admin will review your information.",
                      icon: "M",
                      image: "/images/join-platform.svg",
                    },
                    {
                      title: "Account Creation",
                      description:
                        "We'll set up your account and provide you with login credentials and a unique QR code.",
                      icon: "S",
                      image: "/images/account-creation.svg",
                    },
                    {
                      title: "Start Collecting Feedback",
                      description: "Log in to your dashboard and start viewing and responding to customer feedback.",
                      icon: "S",
                      image: "/images/collect-feedback.svg",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-xl hover:scale-105"
                      variants={fadeIn}
                    >
                      <div className="p-5">
                        <div className="flex items-center mb-4">
                          <div className="flex-shrink-0">
                            <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-12 h-12" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dt className="text-lg font-medium text-[#3D52A0] truncate">{step.title}</dt>
                          </div>
                        </div>
                        <dd className="text-base text-[#8697C4]">{step.description}</dd>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-[#D2DAFF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <motion.h2 className="text-3xl font-extrabold text-[#3D52A0] sm:text-4xl" variants={fadeIn}>
                  Subscription Plans
                </motion.h2>
                <motion.p className="mt-4 max-w-2xl mx-auto text-xl text-[#8697C4] lg:mx-auto" variants={fadeIn}>
                  Choose the plan that best fits your needs
                </motion.p>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                  {[
                    {
                      name: "Free Plan",
                      price: "$0/month",
                      description: "Access to public feedback (ratings above 5)",
                      features: ["View positive feedback", "Basic dashboard access", "Email support"],
                    },
                    {
                      name: "Premium Plan",
                      price: "Contact for pricing",
                      description: "Full access to all feedback, including ratings below 3",
                      features: ["View all feedback", "Advanced analytics", "Custom QR code"],
                    },
                  ].map((plan) => (
                    <motion.div
                      key={plan.name}
                      className={`bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 transition-all hover:shadow-xl ${plan.name === "Premium Plan" ? "border-2 border-[#7091E6]" : ""}`}
                      variants={fadeIn}
                    >
                      {plan.name === "Premium Plan" && (
                        <div className="bg-[#7091E6] text-white text-center py-2">
                          <span className="text-sm font-semibold">Most Popular</span>
                        </div>
                      )}
                      <div className="px-6 py-8">
                        <h3 className="text-2xl font-bold text-[#3D52A0] text-center">{plan.name}</h3>
                        <div className="mt-4 flex justify-center">
                          <span className="px-3 py-1 text-xl font-semibold text-[#7091E6] bg-[#EDE8F5] rounded-full">
                            {plan.price}
                          </span>
                        </div>
                        <p className="mt-4 text-[#8697C4] text-center">{plan.description}</p>
                      </div>
                      <div className="px-6 py-6">
                        <ul className="mt-6 space-y-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-6 w-6 text-[#7091E6]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base text-[#8697C4]">{feature}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                          <button
                            className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
                              plan.name === "Premium Plan"
                                ? "bg-[#7091E6] text-white hover:bg-[#3D52A0]"
                                : "bg-white text-[#7091E6] border border-[#7091E6] hover:bg-[#EDE8F5]"
                            }`}
                          >
                            Get Started
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </motion.div>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-[#3D52A0] sm:text-4xl mb-8">Frequently Asked Questions</h2>
              <div className="mt-8 space-y-4">
                {[
                  {
                    question: "How does the feedback system work?",
                    answer:
                      "Customers scan a QR code at your restaurant to leave feedback. You can then view and respond to this feedback through your dashboard.",
                  },
                  {
                    question: "Can I respond to customer feedback?",
                    answer:
                      "Yes, our platform allows you to respond directly to customer feedback, helping you engage with your customers and address their concerns.",
                  },
                  {
                    question: "How secure is my restaurant's data?",
                    answer:
                      "We take data security very seriously. All data is encrypted and stored securely, and we never share your information with third parties.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border-b border-[#ADBBDA] pb-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: 50 },
                    }}
                  >
                    <button className="flex justify-between items-center w-full text-left">
                      <span className="text-lg font-medium text-[#3D52A0]">{faq.question}</span>
                      <span className="h-5 w-5 text-[#7091E6]">▼</span>
                    </button>
                    <p className="mt-2 text-[#8697C4]">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#3D52A0]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-[#ADBBDA] tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#ADBBDA] tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#ADBBDA] tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#ADBBDA] tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-[#D2DAFF] hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[#7091E6] pt-8 flex justify-between items-center">
            <p className="text-base text-[#ADBBDA]">&copy; 2023 FeedbackPro. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#ADBBDA] hover:text-white">
                <img src="/icons/twitter.svg" alt="Twitter" className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#ADBBDA] hover:text-white">
                <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#ADBBDA] hover:text-white">
                <img src="/icons/instagram.svg" alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default homepage