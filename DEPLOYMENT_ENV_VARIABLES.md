# Setting Environment Variables for Hosted Website

## ⚠️ Important: `.env.local` Files Don't Work on Hosted Sites

The `.env.local` file only works for **local development**. When you deploy to a hosted website, you need to set environment variables in your hosting platform's settings.

---

## Required Environment Variables

You need to set these 4 environment variables in your hosting platform:

1. `VITE_EMAILJS_SERVICE_ID` = `service_37smtg4`
2. `VITE_EMAILJS_PUBLIC_KEY` = `1DKWp32xmEO1K3Eq5`
3. `VITE_EMAILJS_CLIENT_TEMPLATE_ID` = `template_utpx54e`
4. `VITE_EMAILJS_STAFF_TEMPLATE_ID` = `template_qnn88zh`

---

## How to Set Environment Variables by Platform

### 🌐 Vercel

1. Go to your project dashboard on [vercel.com](https://vercel.com)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `VITE_EMAILJS_SERVICE_ID`
   - **Value**: `service_37smtg4`
   - **Environment**: Select "Production", "Preview", and "Development"
5. Repeat for all 4 variables
6. **Redeploy** your site (or it will auto-deploy)

### 🌐 Netlify

1. Go to your site dashboard on [netlify.com](https://netlify.com)
2. Go to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add each variable:
   - **Key**: `VITE_EMAILJS_SERVICE_ID`
   - **Value**: `service_37smtg4`
   - **Scopes**: Select "All scopes" or specific environments
5. Repeat for all 4 variables
6. Go to **Deploys** → **Trigger deploy** → **Deploy site**

### 🌐 GitHub Pages / GitHub Actions

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each variable:
   - **Name**: `VITE_EMAILJS_SERVICE_ID`
   - **Secret**: `service_37smtg4`
5. Repeat for all 4 variables
6. Update your GitHub Actions workflow to use these secrets:
   ```yaml
   env:
     VITE_EMAILJS_SERVICE_ID: ${{ secrets.VITE_EMAILJS_SERVICE_ID }}
     VITE_EMAILJS_PUBLIC_KEY: ${{ secrets.VITE_EMAILJS_PUBLIC_KEY }}
     VITE_EMAILJS_CLIENT_TEMPLATE_ID: ${{ secrets.VITE_EMAILJS_CLIENT_TEMPLATE_ID }}
     VITE_EMAILJS_STAFF_TEMPLATE_ID: ${{ secrets.VITE_EMAILJS_STAFF_TEMPLATE_ID }}
   ```

### 🌐 Render

1. Go to your service dashboard on [render.com](https://render.com)
2. Click on your service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable:
   - **Key**: `VITE_EMAILJS_SERVICE_ID`
   - **Value**: `service_37smtg4`
6. Repeat for all 4 variables
7. Click **Save Changes** (will trigger a new deployment)

### 🌐 Railway

1. Go to your project on [railway.app](https://railway.app)
2. Click on your service
3. Go to **Variables** tab
4. Click **New Variable**
5. Add each variable:
   - **Key**: `VITE_EMAILJS_SERVICE_ID`
   - **Value**: `service_37smtg4`
6. Repeat for all 4 variables
7. Railway will automatically redeploy

### 🌐 Cloudflare Pages

1. Go to your project on [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your Pages project
3. Go to **Settings** → **Environment variables**
4. Click **Add variable**
5. Add each variable:
   - **Variable name**: `VITE_EMAILJS_SERVICE_ID`
   - **Value**: `service_37smtg4`
   - **Environment**: Select "Production" (and Preview if needed)
6. Repeat for all 4 variables
7. Trigger a new deployment

### 🌐 Other Platforms

Most hosting platforms have similar steps:
1. Find **Environment Variables** or **Config Vars** in your project settings
2. Add each variable with the exact name (including `VITE_` prefix)
3. Set the value
4. Save and redeploy

---

## ⚠️ Important Notes

### 1. Variable Names Must Match Exactly
- Must start with `VITE_` (Vite requirement)
- Must match exactly: `VITE_EMAILJS_SERVICE_ID` (case-sensitive)

### 2. After Setting Variables
- **Always redeploy** your site after adding/changing environment variables
- Environment variables are only available at **build time** for Vite
- Changes won't take effect until you rebuild and redeploy

### 3. Security
- These are **public** variables (they're exposed in the browser)
- EmailJS Public Key is meant to be public
- Never put private keys or secrets in `VITE_` variables

### 4. Testing
- After deployment, test the booking form
- Check browser console for any errors
- Verify emails are being sent

---

## Quick Checklist

- [ ] Set `VITE_EMAILJS_SERVICE_ID` = `service_37smtg4`
- [ ] Set `VITE_EMAILJS_PUBLIC_KEY` = `1DKWp32xmEO1K3Eq5`
- [ ] Set `VITE_EMAILJS_CLIENT_TEMPLATE_ID` = `template_utpx54e`
- [ ] Set `VITE_EMAILJS_STAFF_TEMPLATE_ID` = `template_qnn88zh`
- [ ] Redeploy your site
- [ ] Test the booking form

---

## Troubleshooting

### Error: "Missing EmailJS configuration"
- ✅ Check that all 4 variables are set in your hosting platform
- ✅ Verify variable names match exactly (including `VITE_` prefix)
- ✅ Make sure you redeployed after setting variables
- ✅ Check that variables are set for the correct environment (Production/Preview)

### Variables Not Working
- Vite only includes `VITE_` prefixed variables in the build
- Variables must be set **before** building
- Some platforms require you to trigger a new build manually

### Still Having Issues?
1. Check your hosting platform's documentation for environment variables
2. Verify the build logs show the variables are being read
3. Check browser console for specific error messages

