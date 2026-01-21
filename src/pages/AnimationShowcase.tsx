import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export default function AnimationShowcase() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <h1 className="text-4xl font-bold text-foreground mb-12 animate-fade-in">
        Alibaba-Inspired Theme & Animations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fade In Animation */}
        <div className="bg-card rounded-lg p-6 shadow-md border border-border animate-fade-in">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Fade In</h3>
          <p className="text-muted-foreground">Smooth fade-in animation</p>
        </div>

        {/* Scale In Animation */}
        <div className="bg-card rounded-lg p-6 shadow-md border border-border animate-scale-in">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Scale In</h3>
          <p className="text-muted-foreground">Smooth scale animation</p>
        </div>

        {/* Slide In Animation */}
        <div className="bg-card rounded-lg p-6 shadow-md border border-border animate-slide-in">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Slide In</h3>
          <p className="text-muted-foreground">Smooth slide-in animation</p>
        </div>

        {/* Bounce Subtle Animation */}
        <div className="bg-card rounded-lg p-6 shadow-md border border-border animate-bounce-subtle">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Bounce</h3>
          <p className="text-muted-foreground">Subtle bounce animation</p>
        </div>

        {/* Float Animation */}
        <div className="bg-card rounded-lg p-6 shadow-md border border-border animate-float">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Float</h3>
          <p className="text-muted-foreground">Floating animation</p>
        </div>

        {/* Pulse Glow Animation */}
        <div className="bg-card rounded-lg p-6 shadow-md border border-border animate-pulse-glow">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Pulse Glow</h3>
          <p className="text-muted-foreground">Glowing pulse animation</p>
        </div>
      </div>

      {/* Alibaba Colors Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Alibaba Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg overflow-hidden shadow-lg animate-fade-in">
            <div className="h-24 bg-primary"></div>
            <div className="p-3 bg-card border border-border">
              <p className="font-semibold text-foreground">Primary</p>
              <p className="text-sm text-muted-foreground">Alibaba Orange</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-24 bg-secondary"></div>
            <div className="p-3 bg-card border border-border">
              <p className="font-semibold text-foreground">Secondary</p>
              <p className="text-sm text-muted-foreground">Alibaba Blue</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-24 bg-accent"></div>
            <div className="p-3 bg-card border border-border">
              <p className="font-semibold text-foreground">Accent</p>
              <p className="text-sm text-muted-foreground">Orange Accent</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="h-24 bg-success"></div>
            <div className="p-3 bg-card border border-border">
              <p className="font-semibold text-foreground">Success</p>
              <p className="text-sm text-muted-foreground">Success Green</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons with Animations */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">Interactive Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow">
            Primary Button
          </Button>
          <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
            Secondary Button
          </Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>

      {/* Theme Info */}
      <div className="mt-16 bg-gradient-accent rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Dark Mode Support</h2>
        <p className="mb-4">
          Current theme: <span className="font-semibold">{isDark ? 'Dark' : 'Light'}</span>
        </p>
        <p>
          Click the theme switcher in the navbar to toggle between Light, Dark, and System modes.
          Your preference is saved automatically!
        </p>
      </div>
    </div>
  );
}
