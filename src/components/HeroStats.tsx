
import { Users, Star, Award } from 'lucide-react';

const stats = [
  { icon: Users, number: '10,000+', label: 'Happy Customers' },
  { icon: Star, number: '4.8/5', label: 'Average Rating' },
  { icon: Award, number: '5+', label: 'Years Experience' },
];

export const HeroStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
            <stat.icon className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold">{stat.number}</div>
          <div className="text-sm opacity-90">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
