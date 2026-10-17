export const defaultPackages = [
  {
    id: 1,
    package: "Starter Fiber 25",
    plan_label: "Home Essential",
    speed: "25 Mbps",
    price: 600,
    category: "home",
    is_featured: false,
    description: "Ideal for daily streaming, web browsing, smart TVs, and social media.",
    features: [
      "25 Mbps Symmetrical Internet",
      "50 Mbps BDIX & Youtube Cache",
      "Zero Data Caps & Unlimited FUP",
      "Optical Fiber Direct to Home (FTTH)",
      "Standard 24/7 Phone Support"
    ],
    accent_badge: "POPULAR"
  },
  {
    id: 2,
    package: "Streamer Plus 50",
    plan_label: "Most Popular",
    speed: "50 Mbps",
    price: 1000,
    category: "home",
    is_featured: true,
    description: "Supercharged speed for 4K video, concurrent multi-device streaming, and cloud backup.",
    features: [
      "50 Mbps Symmetrical Internet",
      "100 Mbps BDIX / Netflix / FB Cache",
      "Ultra-Low Jitter (< 2ms)",
      "Dual-Band Wi-Fi 6 Router Ready",
      "Priority 24/7 Support Hotline"
    ],
    accent_badge: "BEST VALUE"
  },
  {
    id: 3,
    package: "Gamer Ultra 80",
    plan_label: "Low Latency Pro",
    speed: "80 Mbps",
    price: 1500,
    category: "gamer",
    is_featured: false,
    description: "Engineered specifically for competitive e-sports, Twitch streaming, and low-ping routing.",
    features: [
      "80 Mbps Synchronous Bandwidth",
      "Optimized Gaming Routing (Singapore/India)",
      "Real Public Static IPv4 Available",
      "100 Mbps BDIX Turbo Cache",
      "Direct VIP Discord & WhatsApp NOC Support"
    ],
    accent_badge: "PRO GAMER"
  },
  {
    id: 4,
    package: "Gigabit Enterprise 150",
    plan_label: "SME & Enterprise",
    speed: "150 Mbps",
    price: 2500,
    category: "corporate",
    is_featured: false,
    description: "Dedicated bandwidth with 99.99% SLA, backup routing, and corporate static IP.",
    features: [
      "150 Mbps 1:1 Dedicated Bandwidth",
      "2x Static Public IPv4 Included",
      "99.99% Enterprise Uptime SLA",
      "Direct BGP Peering & Dual Uplink",
      "Dedicated Enterprise Account Manager"
    ],
    accent_badge: "ENTERPRISE"
  }
];

export const defaultServices = [
  {
    id: "ftth",
    icon: "Cable",
    title: "Carrier-Grade FTTH Fiber",
    description: "Pure single-mode fiber optic cabling straight into your router. Zero interference, zero weather degradation, and zero packet drop.",
    badge: "100% Optical"
  },
  {
    id: "bdix",
    icon: "Zap",
    title: "10Gbps BDIX Peering",
    description: "Ultra-fast direct peering with Bangladesh Internet Exchange. Local content like YouTube, Netflix, Facebook & local mirrors run up to 100Mbps.",
    badge: "< 5ms Ping"
  },
  {
    id: "gaming",
    icon: "Gamepad2",
    title: "Low-Latency Game Routing",
    description: "Customized routing paths to regional game servers in Singapore, India, and Europe. Say goodbye to rubber-banding and high jitter.",
    badge: "Optimized Routes"
  },
  {
    id: "noc",
    icon: "ShieldCheck",
    title: "24/7 Proactive NOC Monitoring",
    description: "Our Network Operations Center monitors link status, packet health, and optical signal power (dBm) round the clock.",
    badge: "99.99% Uptime"
  },
  {
    id: "ipv6",
    icon: "Network",
    title: "Dual-Stack IPv6 & Static IP",
    description: "Next-gen Internet protocol ready out of the box with dedicated public static IP assignments available on request.",
    badge: "Next-Gen Stack"
  },
  {
    id: "support",
    icon: "Headphones",
    title: "On-Site Support Under 30 Mins",
    description: "Dispatched local field teams equipped with optical power meters and fusion splicers for immediate problem resolution.",
    badge: "Rapid Response"
  }
];

export const defaultGallery = [
  {
    id: 1,
    title: "MikroTik CCR2004 Core Router",
    category: "Data Center",
    image: "/images/gallery/Router.png",
    description: "Core carrier routing handling multi-gigabit traffic with redundant uplinks."
  },
  {
    id: 2,
    title: "Fiber Distribution Rack & Patch Panel",
    category: "Infrastructure",
    image: "/images/gallery/rack.jpg",
    description: "High-density optical fiber cross-connect distribution cabinet."
  },
  {
    id: 3,
    title: "Carrier Server Infrastructure",
    category: "Data Center",
    image: "/images/gallery/server.jpg",
    description: "Enterprise caching engines and authentication servers."
  },
  {
    id: 4,
    title: "Gigabit Optical Network Unit (ONU)",
    category: "Hardware",
    image: "/images/gallery/ONU.jpg",
    description: "Customer-premises high-speed fiber optical termination terminal."
  },
  {
    id: 5,
    title: "Precision Fusion Splicer",
    category: "Field Operations",
    image: "/images/gallery/spliceing.jpg",
    description: "Core-alignment optical fiber fusion splicing with under 0.02dB loss."
  },
  {
    id: 6,
    title: "Calibrated Optical Power Meter",
    category: "Field Operations",
    image: "/images/gallery/optical-meter.jpg",
    description: "Real-time laser dBm testing for optimal link signal integrity."
  }
];

export const defaultReviews = [
  {
    id: 1,
    customer_name: "Tanvir Hasan",
    rating: 5,
    package: "Streamer Plus 50",
    review: "Hands down the most consistent fiber provider I have used. Ping in CS2 and Valorant dropped from 70ms to 24ms. Zero downtime in the last 6 months.",
    date: "2 days ago",
    verified: true
  },
  {
    id: 2,
    customer_name: "Farhana Chowdhury",
    rating: 5,
    package: "Starter Fiber 25",
    review: "Working from home requires dependable Zoom conferences and cloud uploads. Smart ISP delivers exactly the advertised speed even during rainstorms.",
    date: "1 week ago",
    verified: true
  },
  {
    id: 3,
    customer_name: "Sabbir Ahmed",
    rating: 5,
    package: "Gamer Ultra 80",
    review: "The quick voucher recharge system is so smooth. Recharged at 2 AM using my phone and it reconnected in 30 seconds. Support team is super polite and responsive.",
    date: "2 weeks ago",
    verified: true
  }
];

export const defaultFaqs = [
  {
    q: "How fast is installation after placing an order?",
    a: "Our field team deploys optical fiber within 4 to 24 hours of receiving your connection request, including complete cable routing, ONU setup, and speed verification."
  },
  {
    q: "What is BDIX and how does it benefit my connection?",
    a: "BDIX (Bangladesh Internet Exchange) connects you directly to local data centers. Streaming platforms, local servers, and downloads run at up to 100Mbps without consuming international bandwidth."
  },
  {
    q: "How can I instantly recharge or pay my bill?",
    a: "You can use our Quick Voucher Recharge right on the website with your voucher code, or pay through bKash, Nagad, and cards via our customer portal."
  },
  {
    q: "Do you provide real Public Static IP addresses?",
    a: "Yes! Static public IPv4 and IPv6 addresses are available on all gamer and corporate plans, ideal for CCTV surveillance, NAS servers, and port forwarding."
  },
  {
    q: "Are there any fair usage policies (FUP) or hidden data caps?",
    a: "No! All our broadband packages feature strictly unlimited data without hidden throttles, monthly caps, or bandwidth choking."
  }
];
