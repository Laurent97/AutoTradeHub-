# AutoTradeHub 🚗

A professional multi-vendor auto parts marketplace connecting customers, partner stores, and administrators in a seamless B2B/B2C platform.

## 🌟 Features

### For Customers
- **Browse Products**: Extensive catalog of auto parts with advanced filtering
- **Partner Stores**: Shop from multiple verified auto parts vendors
- **Wishlist Management**: Save favorite products for later purchase
- **Secure Checkout**: Integrated payment processing with Stripe
- **Order Tracking**: Real-time order status and shipping updates

### For Partners
- **Store Management**: Complete inventory and product management
- **Order Processing**: Efficient order fulfillment workflow
- **Analytics Dashboard**: Sales insights and performance metrics
- **Wallet Integration**: Secure payment processing and withdrawals
- **Product Catalog**: Easy product listing with image uploads

### For Administrators
- **User Management**: Manage customers and partner accounts
- **Order Oversight**: Complete order management and logistics
- **Revenue Analytics**: Comprehensive business intelligence
- **System Settings Platform**: Configure and maintain platform settings

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Shadcn/ui Components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Integration
- **Image Storage**: Cloudinary
- **State Management**: React Context API
- **Routing**: React Router v6

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Laurent97/AutoTradeHub-.git
   cd AutoTradeHub-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your Supabase and Stripe credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific components
│   ├── Partner/        # Partner-specific components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── lib/                # Utilities and services
│   ├── supabase/       # Database services
│   └── types/          # TypeScript definitions
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── partner/        # Partner pages
│   └── [other-pages]   # Customer pages
└── services/           # API services
```

## 🔧 Database Schema

### Core Tables
- **users**: Customer and partner accounts
- **partner_profiles**: Partner store information
- **products**: Auto parts catalog
- **partner_products**: Partner-specific product listings
- **orders**: Customer orders
- **order_items**: Order line items

### Key Features
- **Multi-tenant Architecture**: Partners manage their own inventory
- **Role-based Access**: Customer, Partner, and Admin roles
- **Real-time Updates**: Live order tracking and notifications
- **Secure Payments**: Integrated Stripe payment processing

## 🌐 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@autodrive-global.com or create an issue on GitHub.

---

**AutoTradeHub** - Connecting the auto parts world, one part at a time. 🚗💨
