# Microsoft Graph API Integration Guide

This guide explains how to integrate Microsoft Outlook and Teams functionality into your CRM application using the Microsoft Graph API.

## 🚀 Overview

The integration provides the following capabilities:
- **Send emails** through Outlook
- **Schedule meetings** in Outlook Calendar
- **Create Teams meetings** with join links
- **Manage contacts** and user profiles
- **Access calendar** and meeting information

## 📋 Prerequisites

1. **Microsoft 365 Account** (Business or Enterprise)
2. **Azure Active Directory** (Azure AD) tenant
3. **Microsoft Graph API** permissions
4. **Registered application** in Azure AD

## 🔧 Setup Instructions

### Step 1: Register Your Application in Azure AD

1. **Go to Azure Portal**
   - Navigate to [Azure Portal](https://portal.azure.com)
   - Sign in with your Microsoft 365 admin account

2. **Register New Application**
   - Go to **Azure Active Directory** → **App registrations**
   - Click **New registration**
   - Fill in the details:
     - **Name**: `CRM Outlook Integration`
     - **Supported account types**: `Accounts in this organizational directory only`
     - **Redirect URI**: `http://localhost:3000/auth/callback` (for development)

3. **Get Application Credentials**
   - Note down the **Application (client) ID**
   - Note down the **Directory (tenant) ID**

### Step 2: Configure API Permissions

1. **Add Microsoft Graph Permissions**
   - Go to **API permissions** in your app registration
   - Click **Add a permission**
   - Select **Microsoft Graph**
   - Choose **Delegated permissions**
   - Add the following permissions:
     - `User.Read` - Read user profile
     - `Mail.Send` - Send emails
     - `Calendars.ReadWrite` - Read and write calendar
     - `Contacts.Read` - Read contacts
     - `OnlineMeetings.ReadWrite` - Create Teams meetings

2. **Grant Admin Consent**
   - Click **Grant admin consent for [Your Organization]**
   - This allows all users in your organization to use the app

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Microsoft Graph API Configuration
REACT_APP_MS_CLIENT_ID=your-client-id-here
REACT_APP_MS_TENANT_ID=your-tenant-id-here
REACT_APP_MS_REDIRECT_URI=http://localhost:3000/auth/callback

# For production, use your actual domain
# REACT_APP_MS_REDIRECT_URI=https://yourdomain.com/auth/callback
```

### Step 4: Install Required Dependencies

```bash
npm install @azure/msal-browser @azure/msal-react
```

### Step 5: Configure MSAL (Microsoft Authentication Library)

Create `src/config/msalConfig.ts`:

```typescript
import { Configuration, PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_MS_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_MS_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_MS_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest: PopupRequest = {
  scopes: [
    'User.Read',
    'Mail.Send',
    'Calendars.ReadWrite',
    'Contacts.Read',
    'OnlineMeetings.ReadWrite',
  ],
};
```

## 🔐 Authentication Flow

### 1. Initialize MSAL

Update your `src/services/microsoftGraph.ts`:

```typescript
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../config/msalConfig';

export class MicrosoftGraphService {
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  async authenticate(): Promise<void> {
    try {
      // Check if user is already signed in
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        // User is already signed in
        const result = await this.msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        this.accessToken = result.accessToken;
        return;
      }

      // User needs to sign in
      const result = await this.msalInstance.loginPopup(loginRequest);
      this.accessToken = result.accessToken;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.msalInstance.logout();
    this.accessToken = null;
  }
}
```

### 2. Handle Authentication in Components

```typescript
import { useMsal } from '@azure/msal-react';

const OutlookIntegration = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setIsAuthenticated(true);
    }
  }, [accounts]);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ... rest of component
};
```

## 📧 Email Functionality

### Send Email to Lead

```typescript
import { microsoftGraphService } from '../services/microsoftGraph';

const sendEmailToLead = async (lead: Lead, company: Company) => {
  try {
    await microsoftGraphService.sendEmailToLead(
      lead,
      company,
      'Follow-up Meeting',
      `
        <h2>Meeting Invitation</h2>
        <p>Dear ${lead.name},</p>
        <p>We would like to schedule a follow-up meeting regarding ${company.name}.</p>
        <p>Best regards,<br>Your Team</p>
      `,
      true // HTML format
    );
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
```

### Email Templates

```typescript
const emailTemplates = {
  welcome: {
    subject: 'Welcome to our CRM - {{companyName}}',
    body: `
      <h2>Welcome!</h2>
      <p>Dear {{leadName}},</p>
      <p>Thank you for your interest in our services.</p>
      <p>Best regards,<br>Your Team</p>
    `
  },
  followUp: {
    subject: 'Follow-up: {{meetingType}}',
    body: `
      <h2>Follow-up Meeting</h2>
      <p>Dear {{leadName}},</p>
      <p>This is a follow-up regarding {{companyName}}.</p>
    `
  }
};
```

## 📅 Meeting Scheduling

### Schedule Teams Meeting

```typescript
const scheduleTeamsMeeting = async (lead: Lead, company: Company) => {
  try {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour

    const meeting = await microsoftGraphService.createMeetingWithLead(
      lead,
      company,
      'Product Demo',
      startTime,
      endTime,
      'We would like to demonstrate our product and discuss how it can benefit your organization.',
      true // Online meeting
    );

    console.log('Meeting scheduled:', meeting.id);
    console.log('Join URL:', meeting.onlineMeeting?.joinUrl);
  } catch (error) {
    console.error('Failed to schedule meeting:', error);
  }
};
```

### Create Follow-up Meeting

```typescript
const createFollowUpMeeting = async (followUp: FollowUp, lead: Lead, company: Company) => {
  try {
    const meeting = await microsoftGraphService.createFollowUpMeeting(
      followUp,
      lead,
      company
    );
    
    console.log('Follow-up meeting created:', meeting.id);
  } catch (error) {
    console.error('Failed to create follow-up meeting:', error);
  }
};
```

## 🎯 Integration with CRM Components

### Add to Lead Details

```typescript
import { OutlookIntegration } from '../components/OutlookIntegration';

const LeadDetails = ({ lead, company }) => {
  return (
    <div>
      {/* Lead information */}
      <div className="lead-info">
        {/* ... existing lead details */}
      </div>
      
      {/* Outlook Integration */}
      <OutlookIntegration
        lead={lead}
        company={company}
        onEmailSent={() => {
          // Refresh lead data or show notification
          console.log('Email sent successfully');
        }}
        onMeetingScheduled={(meetingId) => {
          // Update follow-up or show notification
          console.log('Meeting scheduled:', meetingId);
        }}
      />
    </div>
  );
};
```

### Add to Follow-ups Page

```typescript
const FollowUpsPage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);

  const handleScheduleMeeting = async (followUp) => {
    try {
      const lead = await getLeadById(followUp.leadId);
      const company = await getCompanyById(followUp.companyId);
      
      const meeting = await microsoftGraphService.createFollowUpMeeting(
        followUp,
        lead,
        company
      );
      
      // Update follow-up status
      await updateFollowUp(followUp.id, {
        status: 'scheduled',
        meetingId: meeting.id
      });
      
      toast.success('Meeting scheduled successfully!');
    } catch (error) {
      toast.error('Failed to schedule meeting');
    }
  };

  return (
    <div>
      {followUps.map(followUp => (
        <div key={followUp.id}>
          {/* Follow-up details */}
          <Button onClick={() => handleScheduleMeeting(followUp)}>
            Schedule Meeting
          </Button>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 Advanced Configuration

### Custom Email Templates

```typescript
// Add to database schema
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'followup' | 'proposal' | 'demo' | 'contract';
  variables: string[]; // ['{{leadName}}', '{{companyName}}']
}

// Template management
const createEmailTemplate = async (template: EmailTemplate) => {
  // Save to database
  await databaseService.createEmailTemplate(template);
};

const sendTemplatedEmail = async (templateId: string, lead: Lead, company: Company, variables: Record<string, string>) => {
  const template = await databaseService.getEmailTemplateById(templateId);
  
  let subject = template.subject;
  let body = template.body;
  
  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, value);
    body = body.replace(regex, value);
  });
  
  await microsoftGraphService.sendEmailToLead(lead, company, subject, body);
};
```

### Meeting Templates

```typescript
const meetingTemplates = {
  demo: {
    subject: 'Product Demo - {{companyName}}',
    duration: 60,
    description: 'We will demonstrate our product and discuss how it can benefit your organization.',
    isOnline: true
  },
  proposal: {
    subject: 'Proposal Discussion - {{companyName}}',
    duration: 90,
    description: 'We will discuss our proposal and answer any questions you may have.',
    isOnline: true
  },
  followUp: {
    subject: 'Follow-up Meeting - {{companyName}}',
    duration: 30,
    description: 'Quick follow-up to discuss next steps.',
    isOnline: false
  }
};
```

## 🚀 Production Deployment

### 1. Update Redirect URIs

In Azure AD app registration:
- Add your production domain: `https://yourdomain.com/auth/callback`
- Remove development URLs if needed

### 2. Environment Variables

```env
# Production
REACT_APP_MS_CLIENT_ID=your-production-client-id
REACT_APP_MS_TENANT_ID=your-production-tenant-id
REACT_APP_MS_REDIRECT_URI=https://yourdomain.com/auth/callback
```

### 3. Security Considerations

- **HTTPS Only**: Ensure your production site uses HTTPS
- **Token Storage**: Store tokens securely (sessionStorage for SPA)
- **Error Handling**: Implement proper error handling for authentication failures
- **Rate Limiting**: Respect Microsoft Graph API rate limits

### 4. Monitoring and Logging

```typescript
// Add logging to track usage
const logEmailSent = async (leadId: string, emailType: string) => {
  await databaseService.createEmailRecord({
    leadId,
    subject: 'Email sent',
    content: `Email type: ${emailType}`,
    sentDate: new Date(),
    status: 'sent'
  });
};

const logMeetingScheduled = async (leadId: string, meetingType: string) => {
  await databaseService.createFollowUp({
    leadId,
    companyId: lead.companyId,
    type: meetingType,
    scheduledDate: new Date(),
    status: 'scheduled',
    priority: 'medium',
    createdBy: currentUserId
  });
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check client ID and tenant ID
   - Verify redirect URI matches exactly
   - Ensure admin consent is granted

2. **Permission Denied**
   - Verify API permissions are granted
   - Check if user has required licenses
   - Ensure admin consent is granted

3. **Email Not Sent**
   - Check Mail.Send permission
   - Verify recipient email address
   - Check for rate limiting

4. **Meeting Not Created**
   - Check Calendars.ReadWrite permission
   - Verify meeting time is in the future
   - Check for conflicting meetings

### Debug Mode

```typescript
// Enable debug logging
const debugMode = process.env.NODE_ENV === 'development';

if (debugMode) {
  console.log('MSAL Config:', msalConfig);
  console.log('Login Request:', loginRequest);
}
```

## 📚 Additional Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications)
- [Outlook REST API](https://docs.microsoft.com/en-us/outlook/rest/)
- [Teams API](https://docs.microsoft.com/en-us/microsoftteams/platform/)

## 🔄 Updates and Maintenance

### Regular Tasks

1. **Monitor API Usage**: Check Microsoft Graph API usage in Azure Portal
2. **Update Permissions**: Review and update permissions as needed
3. **Token Refresh**: Ensure tokens are refreshed properly
4. **Error Monitoring**: Monitor for authentication and API errors

### Version Updates

```bash
# Update MSAL library
npm update @azure/msal-browser @azure/msal-react

# Check for breaking changes
# Update code as needed
```

This integration provides a seamless way to use Microsoft Outlook and Teams within your CRM application, improving productivity and user experience. 