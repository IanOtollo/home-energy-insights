# Energy Usage Optimizer

Track and optimize your household electricity consumption in real-time.

## Features

- **Appliance Tracking**: Manage your household appliances and their power ratings.
- **Energy Insights**: Get real-time data on your energy usage and costs.
- **Usage Trends**: Visualize your consumption patterns over time.
- **Cost Estimation**: Calculate your monthly and yearly electricity expenses based on local rates.
- **Saving Tips**: Receive personalized recommendations to reduce your energy footprint.

## Tech Stack

- **Frontend**: React.js + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend/Database**: Supabase
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/IanOtollo/home-energy-insights.git
   cd home-energy-insights
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## Mobile App (PWA)

This application supports PWA (Progressive Web App) features. To install it on your mobile device:

- **Android**: Open the site in Chrome and click "Add to Home Screen".
- **iOS**: Open the site in Safari and click the "Share" button -> "Add to Home Screen".

---
Built and powered by IanOtollo
