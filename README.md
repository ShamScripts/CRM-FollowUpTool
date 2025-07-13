# CRM Pro - Follow-Up Management System

A modern, AI-powered CRM system built with React, TypeScript, and Tailwind CSS for managing leads, companies, and follow-ups with intelligent insights.

## 🚀 Features

### Core CRM Features
- **Lead Management**: Track and manage leads with detailed profiles
- **Company Management**: Organize companies with industry and size classification
- **Follow-up System**: Automated follow-up scheduling and tracking
- **Call Notes Integration**: Integrated call notes within lead details
- **Email Automation**: Automated email scheduling and sending
- **Dashboard Analytics**: Real-time insights and performance metrics

### Advanced Features
- **Email Integration**: Send emails and schedule meetings (Outlook/Teams ready)
- **Excel Sync**: Import/export data from Excel files
- **Sentiment Analysis**: AI-powered sentiment analysis for lead interactions
- **Notification System**: Real-time notifications for follow-ups and reminders
- **Admin Panel**: Comprehensive admin controls and system management

### Technical Features
- **Modern UI**: Beautiful, responsive design with dark/light mode
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Context API**: State management for authentication and theming

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Heroicons
- **Database**: PostgreSQL (ready for integration)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🚀 Deployment

### GitHub Pages
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Vercel (Recommended)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Netlify
1. Build the project:
   ```bash
   npm run build
   ```

2. Drag the `dist` folder to Netlify dashboard

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components
│   └── UI/            # Basic UI components
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and external services
├── types/             # TypeScript type definitions
└── main.tsx          # Application entry point
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration (when ready)
DATABASE_URL=your_database_url
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=crm_pro
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# Email Service (when ready)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_key
RESEND_API_KEY=your_resend_key

# Microsoft Graph (when ready)
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_TENANT_ID=your_tenant_id
```

## 🎯 Usage

### Authentication
- Default login: `admin@techmantra.com` / `admin123`
- Role-based access control (Admin, Manager, Employee)

### Adding Leads
1. Navigate to "Leads" page
2. Click "Add New Lead"
3. Fill in lead details
4. Select or create a company
5. Add follow-up dates and notes

### Managing Follow-ups
1. View scheduled follow-ups in the "Follow-ups" page
2. Mark follow-ups as completed
3. Schedule new follow-ups
4. Set up automated email reminders

### Email Automation
1. Configure email service in Admin Panel
2. Set up email templates
3. Enable automated scheduling
4. Monitor email delivery status

## 🔮 Future Enhancements

- [ ] Real-time database integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] API integration with external CRM systems
- [ ] Advanced AI features
- [ ] Multi-tenant architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Fo

## 🙏 Acknowledgments

- Built with ❤️ by TechMantra team
- Icons by [Heroicons](https://heroicons.com/)
- UI framework by [Tailwind CSS](https://tailwindcss.com/) 
