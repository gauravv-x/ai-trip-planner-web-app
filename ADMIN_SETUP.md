# Admin Panel Setup Guide

This guide explains how to set up and use the admin panel to manage OpenRouter API configuration.

## Features

- **Change OpenRouter Model**: Switch between different AI models without redeploying
- **Update API Key**: Change the OpenRouter API key when the site is stuck or needs a new key
- **Real-time Updates**: Changes take effect immediately for all new requests
- **Secure Access**: Only authorized admins can access the panel

## Setup Instructions

### 1. Configure Admin Access

Add your admin email(s) to your environment variables:

```env
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
```

**Note**: Separate multiple emails with commas.

### 2. Access the Admin Panel

1. Sign in to your application with an admin email
2. Navigate to `/admin` in your browser
3. You should see the admin panel interface

### 3. Using the Admin Panel

#### Update OpenRouter Model

1. Enter the model identifier in the "OpenRouter Model" field
   - Example: `openrouter/polaris-alpha`
   - Example: `openrouter/meta-llama/llama-3.1-405b-instruct`
   - Find available models at [openrouter.ai/models](https://openrouter.ai/models)

2. Click "Save Changes"

#### Update API Key

1. Enter your new OpenRouter API key in the "OpenRouter API Key" field
2. **Note**: Leave this field empty if you only want to update the model (keeps existing key)
3. Click "Save Changes"

## How It Works

1. **Configuration Storage**: Admin settings are stored in Convex database (`AdminConfigTable`)
2. **Fallback Mechanism**: If no admin config exists, the system falls back to environment variables:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL` (optional, defaults to `openrouter/polaris-alpha`)
3. **Immediate Effect**: Changes are applied to all new API requests immediately

## Security

- Only users with emails listed in `ADMIN_EMAILS` can access the admin panel
- API keys are never displayed in the UI (masked for security)
- All admin actions are logged with the admin's email and timestamp

## Troubleshooting

### "Access Denied" Error

- Make sure your email is in the `ADMIN_EMAILS` environment variable
- Restart your development server after updating environment variables
- Check that you're signed in with the correct email

### Changes Not Taking Effect

- Clear your browser cache
- Check that the configuration was saved successfully (look for success message)
- Verify the model name is correct and available on OpenRouter
- Check server logs for any errors

### Site Still Using Old Configuration

- The system falls back to environment variables if admin config fails
- Make sure the admin config was saved correctly
- Check Convex database to verify the configuration exists

## Alternative: Using Clerk Metadata

You can also use Clerk's user metadata to assign admin roles:

1. In Clerk Dashboard, go to Users
2. Select a user and add to their metadata:
   ```json
   {
     "role": "admin"
   }
   ```

Then uncomment the metadata check in `app/api/admin/config/route.ts`:

```typescript
// Option 2: Check Clerk metadata
const metadata = user.publicMetadata;
if (metadata?.role === "admin") {
  return true;
}
```

