import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Put ALL node_modules in a single vendor chunk to avoid React undefined errors
          // This ensures React and all dependencies are in the same chunk with proper load order
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          // Calculator chunks - group by category for code splitting
          if (id.includes('/calculators/SIPCalculator') || id.includes('/calculators/InflationCalculator')) {
            return 'investment-calculators'
          }
          if (id.includes('/calculators/EMICalculator') || 
              id.includes('/calculators/HousingLoanCalculator') || 
              id.includes('/calculators/GoldLoanCalculator') || 
              id.includes('/calculators/PersonalLoanCalculator')) {
            return 'loan-calculators'
          }
          if (id.includes('/calculators/NPSCalculator') || 
              id.includes('/calculators/PFCalculator') || 
              id.includes('/calculators/GratuityCalculator')) {
            return 'retirement-calculators'
          }
          if (id.includes('/calculators/SSYCalculator') || 
              id.includes('/calculators/MarriagePlanningCalculator')) {
            return 'family-calculators'
          }
          if (id.includes('/calculators/AWSCostCalculator') || 
              id.includes('/calculators/AzureCostCalculator') || 
              id.includes('/calculators/GCPCostCalculator') || 
              id.includes('/calculators/CarbonFootprintCalculator')) {
            return 'cloud-calculators'
          }
          if (id.includes('/calculators/TaxCalculator') || 
              id.includes('/calculators/CurrencyConverter')) {
            return 'tax-currency-calculators'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
    minify: 'esbuild', // Use esbuild for faster minification
    sourcemap: false, // Disable sourcemaps for production to reduce size
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
      'lucide-react',
    ],
  },
})
