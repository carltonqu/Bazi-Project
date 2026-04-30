# Google Auth Debug Info

## Current Client ID (from code)
`459190608405-argcsqqnfsq8g6le54ntl6kagr8nc8re.apps.googleusercontent.com`

## Error
"The given client ID is not found"

## Possible Causes:
1. Client ID has a typo
2. Client ID belongs to a deleted project
3. Client ID is for a different project than where APIs are enabled
4. Need to create a fresh OAuth client

## Next Steps:
Create a brand new OAuth 2.0 Client ID in Google Cloud Console:
1. Go to https://console.cloud.google.com/apis/credentials
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: Web application
4. Name: Bazi Auth
5. Authorized JavaScript origins:
   - https://bazi-frontend-gray.vercel.app
   - http://localhost:5173
6. Click CREATE
7. Copy the new Client ID
8. Update Vercel env var with new Client ID
