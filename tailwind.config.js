/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
				  50: '#EFF6FF',
				  100: '#DBEAFE',
				  200: '#BFDBFE',
				  300: '#93C5FD',
				  400: '#60A5FA',
				  500: '#3B82F6',
				  600: '#2563EB',
				  700: '#1D4ED8',
				  800: '#1E40AF',
				  900: '#1E3A8A',
				  950: '#172554',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
				  50: '#ECFDF5',
				  100: '#D1FAE5',
				  200: '#A7F3D0',
				  300: '#6EE7B7',
				  400: '#34D399',
				  500: '#10B981',
				  600: '#059669',
				  700: '#047857',
				  800: '#065F46',
				  900: '#064E3B',
				  950: '#022C22',
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
				  50: '#ECFDF5',
				  100: '#D1FAE5',
				  200: '#A7F3D0',
				  300: '#6EE7B7',
				  400: '#34D399',
				  500: '#10B981',
				  600: '#059669',
				  700: '#047857',
				  800: '#065F46',
				  900: '#064E3B',
				  950: '#022C22',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
