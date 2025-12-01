# HadedaHealth MDT - Standalone Edition

A portable, offline-first Multi-Disciplinary Team (MDT) meeting management platform that runs entirely on your local machine.

## 🎯 What is Standalone Mode?

This is a self-contained version of the MDT app that:
- ✅ Runs completely offline on your computer
- ✅ Uses a local SQLite database (no cloud required)
- ✅ Works on both Mac and Windows
- ✅ Stores all data locally in the `data/` folder
- ✅ Simple email/password authentication (no Google account needed)
- ✅ Double-click to start - no technical knowledge required

## 🚀 Quick Start

### For Mac Users

1. **Download/Copy** the `hadedahealth-mdt` folder to your computer
2. **Double-click** `start-mdt.sh`
3. **Follow prompts** to create your first user account
4. **Browser opens** automatically at `http://localhost:3000`
5. **Sign in** with the email and password you created

### For Windows Users

1. **Download/Copy** the `hadedahealth-mdt` folder to your computer
2. **Double-click** `start-mdt.bat`
3. **Follow prompts** to create your first user account
4. **Browser opens** automatically at `http://localhost:3000`
5. **Sign in** with the email and password you created

### First-Time Setup

The startup script will automatically:
1. Install required dependencies (Node.js packages)
2. Set up the local database
3. Create sample data for testing
4. Prompt you to create an admin account

**Expected time**: 2-5 minutes on first run

## 👥 Managing Users

### Create Additional Users

```bash
npm run create-user
```

You'll be prompted for:
- Email address
- Full name
- Password
- Role (ADMIN, MANAGER, CLINICIAN, VIEWER)
- Discipline (optional)

### User Roles

- **ADMIN**: Full access including user management and deletions
- **MANAGER**: Can view team tasks and manage meetings
- **CLINICIAN**: Can create notes and tasks, participate in meetings
- **VIEWER**: Read-only access

## 📁 Data Storage

All your data is stored locally in:
```
data/
└── mdt.db          # SQLite database file
```

### Backup Your Data

Simply copy the entire `data/` folder to back up all patient records, meetings, notes, and tasks.

### Restore from Backup

Replace the `data/` folder with your backup copy.

## 🔧 Customizing the Database

The database schema can be easily modified to track different information:

1. **Edit the schema**: Open `prisma/schema.prisma`
2. **Add/modify fields**: Edit the models to include the fields you need
3. **Create migration**: Run `npm run db:migrate -- --name your_change_description`
4. **Restart the app**: Your changes will be applied automatically

### Example: Adding a New Field

To add a "referralSource" field to patients:

```prisma
model Patient {
  // ... existing fields ...
  referralSource    String?  // Add this line
}
```

Then run:
```bash
npm run db:migrate -- --name add_referral_source
```

## 🌐 Accessing from Other Devices

By default, the app only runs on your computer. To access it from other devices on your network:

1. Find your computer's local IP address:
   - **Mac**: System Preferences → Network
   - **Windows**: Run `ipconfig` in Command Prompt

2. Edit `.env` and change:
   ```
   NEXTAUTH_URL="http://localhost:3000"
   ```
   to:
   ```
   NEXTAUTH_URL="http://YOUR_IP:3000"
   ```

3. Other devices can now access: `http://YOUR_IP:3000`

**Note**: Both devices must be on the same Wi-Fi network.

## 🛠️ Advanced Commands

### Database Management

```bash
npm run db:studio      # Open visual database browser
npm run db:seed        # Reset with sample data
npm run db:migrate     # Update database schema
```

### Development

```bash
npm run dev            # Start development server
npm run build          # Create production build
npm run start          # Run production server
npm run typecheck      # Check for TypeScript errors
npm run lint           # Check code quality
```

## 📦 Sharing with Team Members

To distribute the app to other team members:

1. **Zip the entire folder** (excluding `node_modules` and `data` to keep it small)
2. **Share the zip file** via USB, email, or network drive
3. **Recipients** simply unzip and double-click the startup script
4. **Each user** gets their own local database

## ❓ Troubleshooting

### "Node.js is not installed"
Install Node.js from [nodejs.org](https://nodejs.org) (LTS version recommended)

### "Port 3000 is already in use"
Another app is using port 3000. Options:
1. Close other apps and try again
2. Edit `package.json` and change the port: `"dev": "next dev -p 3001"`

### "Cannot find module" errors
Delete `node_modules` folder and run the startup script again

### Database is locked
Close all instances of the app and try again

### Forgot password
Run `npm run create-user` with the same email to reset the password

## 🔒 Security Notes

- Passwords are hashed using bcrypt (industry standard)
- Data is stored locally - never transmitted to the cloud
- No telemetry or tracking
- Recommended for internal network use only

## 📋 System Requirements

- **Operating System**: macOS 10.14+, Windows 10+, or Linux
- **Node.js**: Version 18 or higher
- **RAM**: 2GB minimum
- **Disk Space**: 500MB for app + database

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the main README.md for general app documentation
3. Contact your system administrator

---

**Version**: 1.0.0 (Standalone)
**Last Updated**: December 2025
