import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
  features?: string[];
}

const ServiceCard = ({ image, title, description, features }: ServiceCardProps) => {
  return (
    <Card className="group h-full bg-gradient-card hover:shadow-large transition-all duration-500 hover:-translate-y-2 border-border/50 overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-glow transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>
        
        {features && (
          <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-foreground">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
        >
          Book Now
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;