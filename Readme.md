# 🗳️ SmartVote - Online Voting System

**Version 1.0.0 | June 2026**

---

## 📌 What is SmartVote?

SmartVote is a complete online voting system that allows organizations to conduct elections digitally. It's like having a real voting booth on the internet - secure, transparent, and accessible from anywhere.

**Think of it as:** A digital polling station where administrators create elections, candidates register to run, and voters cast their ballots online.

---

## 🎯 Who Uses SmartVote?

| User Type | What They Can Do |
|-----------|------------------|
| **Admin** | Create elections, add candidates, manage voters, see results |
| **Voter** | Register, login, vote in active elections, see live results |

---

## ✨ What Can You Do?

### For Voters (Students/Users)

| Feature | What It Does |
|---------|--------------|
| 📝 **Register** | Create your account with email and password |
| 🔐 **Login** | Secure login to access the voting system |
| 🗳️ **Vote** | Select your preferred candidate in active elections |
| 📊 **See Results** | Watch live vote counts update in real-time |
| 🔍 **Search** | Find candidates by name or party |
| 👤 **Profile** | View your voting history and account details |
| 🌙 **Dark Mode** | Switch between light and dark themes |

### For Admins (Organizers)

| Feature | What It Does |
|---------|--------------|
| 📊 **Dashboard** | See overall statistics at a glance |
| 🗳️ **Create Elections** | Set up new elections with dates and details |
| 👥 **Add Candidates** | Add candidates with names, parties, and manifestos |
| 👤 **Manage Users** | View and manage all registered voters |
| 📈 **Reports** | Generate detailed reports and export data |
| ✏️ **Edit/Delete** | Modify or remove elections and candidates |

---

## 💻 How It Works

### System Flow
Admin creates an election
↓

Admin adds candidates
↓

Voters register and login
↓

Voters cast their votes
↓

Results update automatically in real-time
↓

Admin views reports and analytics

### User Journey

**For Voters:**
Home → Register → Verify Email → Login → Vote → View Results
**For Admins:**
Home → Login → Dashboard → Create Election → Add Candidates → Monitor Results

text

---

## 🛠️ Technology Used

### Frontend (What you see)
| Technology | What It Does |
|------------|--------------|
| React.js | Builds the user interface |
| Chart.js | Creates charts and graphs |
| Axios | Connects to the backend |

### Backend (Behind the scenes)
| Technology | What It Does |
|------------|--------------|
| Node.js | Runs the server |
| Express | Handles API requests |
| JWT | Manages user authentication |
| Bcrypt | Secures passwords |

### Database (Where data is stored)
| Technology | What It Does |
|------------|--------------|
| MySQL | Stores all user, election, and vote data |

---

## 📁 Project Structure (Simplified)
SmartVote/
├── client/ → The website you see (React)
│ ├── src/
│ │ ├── pages/ → All pages (Home, Vote, Results, etc.)
│ │ ├── components/ → Reusable parts (Navbar, Cards, etc.)
│ │ └── services/ → Connects to backend
│ └── package.json → Frontend dependencies
│
├── server/ → The backend API (Node.js)
│ ├── controllers/ → Handles logic (Auth, Votes, etc.)
│ ├── routes/ → API endpoints
│ └── package.json → Backend dependencies
│
└── database.sql → Database structure

text

---

## 🗄️ Database Tables (What's Stored)

| Table | What It Stores |
|-------|----------------|
| Users | Voter information (name, email, password) |
| Admins | Admin accounts |
| Elections | Election details (title, dates, status) |
| Candidates | Candidate information (name, party, manifesto) |
| Votes | Who voted for whom |
| Sessions | User login sessions |
| Logs | System activities |

---

## 📦 Setup Guide (Step by Step)

### Step 1: What You Need

| Software | Why You Need It |
|----------|-----------------|
| Node.js | To run the application |
| MySQL | To store data |
| Git | To download the code |

### Step 2: Download the Code

```bash
git clone https://github.com/yourusername/smartvote.git
cd smartvote
Step 3: Setup Database
bash
# Open MySQL and create database
mysql -u root -p
CREATE DATABASE smartvote_db;
USE smartvote_db;

# Import tables
SOURCE server/database.sql;
Step 4: Setup Backend
bash
cd server
npm install
npm run dev
Step 5: Setup Frontend
bash
cd client
npm install
npm start
Step 6: Access the Application
Website: http://localhost:3000

Backend API: http://localhost:5000/api

🔑 Login Credentials
For Testing
Role	Email	Password
Admin	admin@smartvote.com	admin123
Voter	voter@example.com	password123
📖 How to Use
As a Voter
1. Create Account

Go to Sign Up page

Enter your details

Click Sign Up

Verify your email

2. Login

Go to Login page

Enter your email and password

Click Login

3. Vote

Go to Vote page

Select an election

Choose a candidate

Click Vote Now

Confirm your vote

4. See Results

Go to Results page

Select an election

View live results with charts

As an Admin
1. Login

Email: admin@smartvote.com

Password: admin123

2. Create Election

Go to Admin Panel → Elections

Click "+ New Election"

Fill in details

Click Create

3. Add Candidates

Go to Admin Panel → Candidates

Select an election

Click "+ Add Candidate"

Fill in details

Click Add

4. Monitor Results

Go to Results page

View real-time vote counts

Export reports as CSV

🎯 Key Features Explained
Real-Time Results
When someone votes, the results update automatically. You don't need to refresh the page - the numbers change live.

One Person One Vote
Once you vote, you cannot vote again. The system prevents duplicate voting.

Secure Login
Your password is encrypted. Only you can access your account.

Dark Mode
Switch between light and dark themes for comfortable viewing.

❓ Common Questions
Can I vote more than once?
No, the system prevents duplicate voting.

What if I forget my password?
Click "Forgot Password" on the login page. You'll receive a reset link via email.

Can I change my vote?
No, votes are final once cast.

Who can see my vote?
Your vote is private and anonymous.

Can I see results before voting ends?
Yes, results update live as votes come in.

🔧 Having Problems?
Problem	Solution
Can't connect to server	Make sure backend is running: cd server && npm run dev
Can't login	Check your email and password, or use test accounts above
Can't vote	Make sure you're using a voter account, not admin
Can't see results	Check if there are active elections
Page won't load	Check if frontend is running: cd client && npm start

📞 Need Help?
Email: support@smartvote.com

Phone: +92 300 1234567

Address: 123 Voting Street, Karachi, Pakistan

📄 License
This project is proprietary and confidential. All rights reserved.

🙏 Thank You
SmartVote was built to make voting simple, secure, and accessible for everyone.

Made with ❤️ for democracy and fair elections
