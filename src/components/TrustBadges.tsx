import { Shield, Award, Globe, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Every vehicle and part undergoes rigorous inspection before listing",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    description: "We ship to over 150 countries with tracked, secure logistics",
  },
  {
    icon: Award,
    title: "Trusted Since 2010",
    description: "Over 50,000 satisfied customers and counting",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our expert team is here to help you around the clock",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
