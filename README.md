# E-Commerce Mobile App

A cross-platform e-commerce mobile application built with React Native and Expo, ready for deployment to both the Apple App Store and Google Play Store.

## Features

- **Product Browsing**: Browse through a catalog of products with images, descriptions, and prices
- **Product Details**: View detailed information about individual products
- **Shopping Cart**: Add items to cart, update quantities, and remove items
- **Checkout Flow**: Complete purchase with shipping and payment information
- **User Profile**: View and manage user account settings
- **Responsive Design**: Works seamlessly on both iOS and Android devices
- **Bottom Tab Navigation**: Easy navigation between main sections
- **Cart Badge**: Real-time cart item count indicator

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Simplified development and deployment workflow
- **TypeScript**: Type-safe code
- **React Navigation**: Navigation library (Stack and Bottom Tabs)
- **Context API**: Global state management for shopping cart

## Prerequisites

- Node.js (version 20.11.1 or higher)
- npm or yarn
- Expo Go app (for testing on physical devices)
- iOS Simulator (Mac only) or Android Emulator (optional)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd EcommerceApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the development server:
   ```bash
   npm start
   ```

2. Run on different platforms:
   ```bash
   # iOS (Mac only)
   npm run ios

   # Android
   npm run android

   # Web browser
   npm run web
   ```

3. Or scan the QR code with:
   - **iOS**: Camera app (opens Expo Go)
   - **Android**: Expo Go app

## Project Structure

```
EcommerceApp/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # Context providers (Cart)
│   ├── navigation/       # Navigation setup
│   ├── screens/          # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and mock data
├── assets/               # Images, fonts, and other assets
├── App.tsx               # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Key Files

- **App.tsx**: Main entry point with navigation and context providers
- **src/context/CartContext.tsx**: Shopping cart state management
- **src/navigation/AppNavigator.tsx**: Navigation configuration
- **src/utils/mockData.ts**: Mock product data (replace with real API)
- **app.json**: App configuration for store deployment

## Customization

### Replace Mock Data

Currently, the app uses mock product data from `src/utils/mockData.ts`. To connect to a real backend:

1. Create an API service in `src/services/`
2. Fetch products from your backend API
3. Update screens to use real data instead of MOCK_PRODUCTS

### Update Branding

1. **App Name**: Change in `app.json` (`name` field)
2. **Colors**: Update color scheme in screen stylesheets
3. **Icons**: Replace files in `assets/` folder
4. **Bundle Identifier**: Update in `app.json` for both iOS and Android

### Add Features

Consider adding:
- User authentication (login/signup)
- Product search and filtering
- Wishlist functionality
- Order history
- Push notifications
- Real payment integration (Stripe, PayPal)
- Product reviews and ratings
- Social sharing

## Deployment

For detailed deployment instructions to the App Store and Google Play Store, see [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick overview:
```bash
# Login to Expo
eas login

# Configure project
eas init

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Testing

The app includes mock data for testing. You can:

1. Browse products on the Home and Products screens
2. View product details
3. Add items to cart
4. Adjust quantities in cart
5. Proceed through checkout
6. Navigate using bottom tabs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

## Roadmap

- [ ] User authentication
- [ ] Backend API integration
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Product search and filters
- [ ] Order tracking
- [ ] User reviews
- [ ] Wishlist feature
- [ ] Dark mode support

## Acknowledgments

- Built with React Native and Expo
- Navigation powered by React Navigation
- Icons from placeholder service (replace with your own)
