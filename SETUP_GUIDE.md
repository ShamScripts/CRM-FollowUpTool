# Microsoft Outlook & Teams Integration Setup Guide

This guide will walk you through setting up the Microsoft Graph API integration for Outlook and Teams functionality.

## Prerequisites

- Microsoft 365 account with admin access
- Azure AD tenant
- Node.js and npm installed

## Step 1: Azure AD App Registration

### 1.1 Create Azure AD App
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: `CRM Outlook Integration`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `http://localhost:5173` (for development)
5. Click **Register**

### 1.2 Configure API Permissions
1. In your new app, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `User.Read`
   - `Mail.Send`
   - `Calendars.ReadWrite`
   - `OnlineMeetings.ReadWrite`
   - `People.Read`
   - `Contacts.Read`
6. Click **Add permissions**
7. Click **Grant admin consent** (requires admin privileges)

### 1.3 Get Application Credentials
1. Go to **Overview** in your app
2. Copy the **Application (client) ID**
3. Copy the **Directory (tenant) ID**

## Step 2: Environment Configuration

### 2.1 Create Environment File
Create a `.env` file in your project root:

```env
VITE_MICROSOFT_CLIENT_ID=your_azure_app_client_id_here
VITE_MICROSOFT_TENANT_ID=your_azure_tenant_id_here
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173
VITE_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/your_tenant_id_here
```

### 2.2 Update Configuration
Replace the placeholder values in `src/config/microsoft.ts` with your actual credentials.

## Step 3: Install Dependencies

The required packages have already been installed:
- `@azure/msal-browser`
- `@azure/msal-react`

## Step 4: Test the Integration

### 4.1 Start the Development Server
```bash
npm run dev
```

### 4.2 Test Authentication
1. Navigate to the Leads page
2. Open a lead's details
3. Look for the "Outlook Integration" section
4. Click "Connect to Microsoft" to test authentication

### 4.3 Test Email Functionality
1. In the lead details, try sending a test email
2. Check your Outlook inbox for the sent email

### 4.4 Test Meeting Scheduling
1. Try scheduling a meeting with a lead
2. Check your Outlook calendar for the created event

## Step 5: Production Deployment

### 5.1 Update Redirect URI
For production, update the redirect URI in:
- Azure AD app registration
- Environment variables
- Microsoft configuration

### 5.2 Environment Variables
Set production environment variables:
```env
VITE_MICROSOFT_REDIRECT_URI=https://yourdomain.com
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify client ID and tenant ID are correct
   - Ensure redirect URI matches exactly
   - Check that admin consent was granted

2. **Permission Errors**
   - Verify all required permissions are granted
   - Check that admin consent was given
   - Ensure user has appropriate Microsoft 365 license

3. **CORS Errors**
   - Add your domain to Azure AD app's redirect URIs
   - Check browser console for specific error messages

### Debug Mode
Enable debug logging by setting the log level in `src/services/msalConfig.ts`:
```typescript
logLevel: 3, // Debug level
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Client Secrets**: This setup uses public client authentication (no client secret needed)
3. **Scopes**: Only request necessary permissions
4. **HTTPS**: Always use HTTPS in production

## Next Steps

After successful setup:
1. Customize email templates in `src/config/microsoft.ts`
2. Add more Microsoft Graph API endpoints as needed
3. Implement additional features like contact sync
4. Set up automated testing for the integration

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Azure AD app configuration
3. Test with Microsoft Graph Explorer
4. Review the detailed integration guide in `MICROSOFT_INTEGRATION_GUIDE.md` 