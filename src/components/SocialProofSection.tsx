
import React from 'react';
import { Star, Users, MessageSquare, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    number: "10,000+",
    label: "Active Users",
    description: "Muslims worldwide trust our guidance"
  },
  {
    icon: MessageSquare,
    number: "50,000+",
    label: "Questions Answered",
    description: "Accurate responses delivered instantly"
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "User Rating",
    description: "Based on authentic user feedback"
  },
  {
    icon: TrendingUp,
    number: "98%",
    label: "Satisfaction Rate",
    description: "Users find our guidance helpful"
  }
];

const testimonials = [
  {
    name: "Ahmad Abdullah",
    role: "Small Business Owner",
    content: "Finally found a reliable source for Islamic finance guidance. The Zakat calculator saved me hours of research.",
    rating: 5
  },
  {
    name: "Fatima Khan",
    role: "Investment Analyst",
    content: "The halal investment screening feature is incredibly detailed. It's like having a scholar and financial advisor in one.",
    rating: 5
  },
  {
    name: "Omar Hassan",
    role: "Software Engineer",
    content: "As someone new to Islamic finance, this platform made complex concepts easy to understand. Highly recommended!",
    rating: 5
  }
];

const SocialProofSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-4" style={{ fontFamily: "'Lora', serif" }}>
            Trusted by the Global Muslim Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Muslims who rely on our platform for accurate Islamic finance guidance
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal/10 rounded-full mb-4 group-hover:bg-brand-teal group-hover:text-white transition-colors">
                <stat.icon className="w-8 h-8 text-brand-teal group-hover:text-white" />
              </div>
              <div className="text-3xl font-bold text-brand-teal mb-2">{stat.number}</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-brand-teal mb-12" style={{ fontFamily: "'Lora', serif" }}>
            What Our Users Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-card p-6 rounded-xl border border-brand-teal/10">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-brand-teal">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16 p-8 bg-brand-teal/5 rounded-2xl border border-brand-teal/10">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Reviewed by Islamic Scholars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Based on Authentic Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Updated Regularly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Private & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
