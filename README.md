# Micro-Delivery App

A full-stack micro-delivery application that connects sellers, buyers, and deliverers in a local marketplace. Built with React frontend and Django REST API backend.

## Features

- **User Authentication & Verification**: Secure user registration with email verification
- **Marketplace**: Browse and sell products with location-based delivery
- **Real-time Delivery Tracking**: Track deliveries with GPS coordinates
- **Delivery Management**: Accept, manage, and complete deliveries
- **Location Services**: GPS-based pickup and dropoff locations
- **Credit System**: Built-in payment system for transactions
- **Responsive Design**: Modern UI with React and styled-components

## Architecture

### Frontend (React)
- **Location**: `/frontend/`
- **Framework**: React 18.3.1 with React Router
- **Styling**: Styled Components
- **HTTP Client**: Axios for API communication
- **Features**: 
  - User authentication and verification
  - Marketplace browsing and selling
  - Delivery tracking and management
  - Location-based services

### Backend (Django)
- **Location**: `/marketplace/`
- **Framework**: Django 5.1.3 with Django REST Framework
- **Database**: SQLite (development)
- **Authentication**: Token-based authentication
- **Features**:
  - RESTful API endpoints
  - User management and verification
  - Product and delivery management
  - Email verification system
  - Media file handling

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- pip (Python package manager)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ryanlin10/Micro-Delivery-App.git
cd Micro-Delivery-App
```

### 2. Backend Setup (Django)

```bash
# Navigate to marketplace directory
cd marketplace

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers pillow

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

## Configuration

### Backend Configuration
- Update `marketplace/settings.py` with your email settings for verification
- Configure `ALLOWED_HOSTS` for production deployment
- Set up proper database configuration for production

### Frontend Configuration
- Update API endpoints in components if backend URL changes
- Configure environment variables for different deployment environments

## Usage

### For Sellers
1. Register and verify your email
2. List products for sale with pickup/dropoff locations
3. Set authentication codes for secure delivery
4. Track order status and communicate with deliverers

### For Buyers
1. Browse available products in the marketplace
2. Place orders with your location details
3. Track delivery progress in real-time
4. Verify delivery with authentication codes

### For Deliverers
1. View available delivery opportunities
2. Accept deliveries based on location proximity
3. Navigate to pickup and dropoff locations
4. Update delivery status and complete orders

## Project Structure

```
Micro-Delivery-App/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   └── styles/         # CSS styling files
│   └── package.json
├── marketplace/             # Django backend application
│   ├── backend1/           # Main Django app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   └── urls.py         # URL routing
│   ├── marketplace/        # Django project settings
│   └── manage.py
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /backend1/register/` - User registration
- `POST /backend1/login/` - User login
- `POST /backend1/verify/` - Email verification

### Products
- `GET /backend1/products/` - List all products
- `POST /backend1/products/` - Create new product
- `GET /backend1/products/{id}/` - Get product details
- `PUT /backend1/products/{id}/` - Update product

### Deliveries
- `GET /backend1/open-deliveries/` - Get available deliveries
- `POST /backend1/accept-delivery/` - Accept a delivery
- `GET /backend1/my-deliveries/` - Get user's deliveries
- `PUT /backend1/update-delivery-status/` - Update delivery status

## Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables
3. Set `DEBUG = False` in settings
4. Configure static file serving
5. Deploy to platforms like Heroku, AWS, or DigitalOcean

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Configure environment variables for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- **Ryan Lin** - *Initial work* - [ryanlin10](https://github.com/ryanlin10)

## Acknowledgments

- Django REST Framework for the robust API framework
- React community for the excellent frontend ecosystem
- Open source contributors for various packages used
