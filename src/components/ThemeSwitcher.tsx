import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function ThemeSwitcher() {
  const { mode, setMode, isDark } = useTheme();

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === mode);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-2 border-primary hover:bg-primary/10 transition-colors duration-300"
          title="Toggle theme"
        >
          <CurrentIcon className="h-5 w-5 text-primary transition-all duration-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setMode(value)}
            className={`cursor-pointer flex items-center gap-2 transition-all duration-200 ${
              mode === value
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-primary/10'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {mode === value && (
              <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
