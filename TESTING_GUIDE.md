# Mock API Testing Guide

## Setup

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser** to `http://localhost:3000`

---

## API Endpoints

All mock API endpoints are available at:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signin` | POST | Sign in with email/password |
| `/api/auth/signup` | POST | Create new account |
| `/api/auth/forgot-password` | POST | Request password reset OTP |
| `/api/auth/verify-otp` | POST | Verify OTP code |
| `/api/auth/resend-otp` | POST | Resend OTP code |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/auth/google` | POST | Google OAuth sign in |
| `/api/auth/microsoft` | POST | Microsoft OAuth sign in |

---

## Test Scenarios

### 1. Sign In Page (`/signin`)

####  Successful Sign In
1. Navigate to `/signin`
2. Enter email: `test@workhive.com`
3. Enter password: `password123`
4. Click "Sign In"
5. **Expected**: 
   - Button shows "Signing In..." with loading state
   - Network tab shows: `POST /api/auth/signin` with status 200
   - After 1 second, alert shows: "Sign in successful! Token: mock-jwt-token-12345"
   - Token is stored in localStorage
   - Check console for success log
   - Response includes user data (id, email, name, role)

####  Failed Sign In - Wrong Credentials
1. Navigate to `/signin`
2. Enter email: `wrong@workhive.com`
3. Enter password: `wrongpassword`
4. Click "Sign In"
5. **Expected**: 
   - Network tab shows: `POST /api/auth/signin` with status 401
   - Error message appears below password field: "Invalid email or password"
   - No token is stored

####  Validation Errors
1. Leave email empty, click "Sign In"
   - **Expected**: "Email is required"
2. Enter invalid email format: `notanemail`
   - **Expected**: "Please enter a valid email"
3. Leave password empty 
   - **Expected**: "Password is required"

---

### 2. Sign Up Page (`/signup`)

####  Successful Sign Up
1. Navigate to `/signup`
2. Enter email: `newuser@workhive.com`
3. Enter password: `password123`
4. Enter confirm password: `password123`
5. Click "Sign Up"
6. **Expected**: 
   - Button shows "Creating Account..." with loading state
   - Network tab shows: `POST /api/auth/signup` with status 201
   - After 1 second, alert shows: "Sign up successful! Token: mock-jwt-token-67890"
   - Token is stored in localStorage
   - Response includes user data with role "user"

####  Email Already Exists
1. Navigate to `/signup`
2. Enter email: `existing@workhive.com`
3. Enter password: `password123`
4. Enter confirm password: `password123`
5. Click "Sign Up"
6. **Expected**: 
   - Network tab shows: `POST /api/auth/signup` with status 409
   - Error message appears: "Email already exists"
   - No account is created

####  Validation Errors
1. Password less than 8 characters: `pass123`
   - **Expected**: "Password must be at least 8 characters"
2. Passwords don't match
   - Password: `password123`
   - Confirm: `password456`
   - **Expected**: "Passwords do not match"

---

### 3. Forgot Password Flow

#### Step 1: Forgot Password Page (`/forgot-password`)

#####  Successful Request
1. Navigate to `/forgot-password`
2. Enter email: `test@workhive.com`
3. Click "Submit"
4. **Expected**: 
   - Button shows "Sending..." with loading state
   - Network tab shows: `POST /api/auth/forgot-password` with status 200
   - After 1 second, redirects to `/verify-otp?email=test@workhive.com`
   - Response includes expiresIn: 300 (5 minutes)

#####  Email Not Found
1. Navigate to `/forgot-password`
2. Enter email: `notfound@workhive.com`
3. Click "Submit"
4. **Expected**: 
   - Network tab shows: `POST /api/auth/forgot-password` with status 404
   - Error message appears: "Email not found"
   - No OTP is sent

---

#### Step 2: Verify OTP Page (`/verify-otp`)

#####  Successful OTP Verification
1. You should be on `/verify-otp?email=test@workhive.com`
2. Enter OTP: `123456` (one digit per box)
3. Click "Continue"
4. **Expected**: 
   - Button shows "Verifying..." with loading state
   - Network tab shows: `POST /api/auth/verify-otp` with status 200
   - After 1 second, modal appears: "Link Sent Successfully!"
   - Click "Okay" to proceed to reset password page
   - Reset token `mock-reset-token-abc123` is stored in localStorage
   - Response includes expiresIn: 600 (10 minutes)

#####  Invalid OTP
1. Enter any OTP other than `123456` (e.g., `111111`)
2. Click "Continue"
3. **Expected**: 
   - Network tab shows: `POST /api/auth/verify-otp` with status 400
   - Error message appears: "Invalid OTP"
   - No reset token is generated

#####  Resend OTP
1. Wait for 30-second timer to reach 0
2. "Resend OTP" button appears
3. Click "Resend OTP"
4. **Expected**: 
   - Network tab shows: `POST /api/auth/resend-otp` with status 200
   - Timer resets to 30 seconds
   - OTP inputs are cleared
   - Console shows "OTP resent"
   - Response confirms OTP was resent

##### ⌨️ OTP Input Features to Test
- **Auto-focus**: Type a digit, cursor moves to next box automatically
- **Backspace**: Press backspace on empty box, cursor moves to previous box
- **Paste**: Copy `123456` and paste in first box - all boxes fill automatically
- **Validation**: Try entering letters - only numbers are accepted

---

#### Step 3: Reset Password Page (`/reset-password`)

#####  Successful Password Reset
1. You should be on `/reset-password` (after OTP verification)
2. Enter new password: `newpassword123`
3. Re-enter password: `newpassword123`
4. Click "Update Password"
5. **Expected**: 
   - Button shows "Updating..." with loading state
   - Network tab shows: `POST /api/auth/reset-password` with status 200
   - After 1 second, modal appears: "Password Created!"
   - Click "Okay" to redirect to sign in page
   - Reset token is removed from localStorage
   - Response confirms password was reset successfully

#####  Validation Errors
1. Password less than 8 characters
   - **Expected**: "Password must be at least 8 characters"
2. Passwords don't match
   - **Expected**: "Passwords do not match"

---

## Testing Tips

### Check Browser Console
Open Developer Tools (F12) and check the Console tab to see:
- API call logs
- Success/error responses
- Token values

### Check localStorage
In Developer Tools:
1. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
2. Click "Local Storage" → `http://localhost:3000`
3. You should see:
   - `token` - JWT token after sign in/sign up
   - `resetToken` - Reset token after OTP verification

### Check Network Tab
1. Open Developer Tools → Network tab
2. Filter by "Fetch/XHR" to see API calls
3. Watch for real HTTP requests to `/api/auth/*` endpoints
4. Click on any request to see full request/response details
5. All API calls have 1-second delay simulation

---

## Complete Flow Test

### Full Password Reset Journey
1. Start at `/signin`
2. Click "Forgot Password?"
3. Enter email: `test@workhive.com` → Submit
4. Enter OTP: `123456` → Continue
5. Click "Okay" on success modal
6. Enter new password twice → Update Password
7. Click "Okay" on success modal
8. You're back at sign in page
9. Sign in with: `test@workhive.com` / `password123`

---

## Error Handling Features

### Real-time Validation
- Errors disappear when you start typing in a field
- Each field validates independently

### Loading States
- All buttons show loading text during API calls
- Buttons are disabled during loading
- Prevents double submissions

### Network Simulation
- All API calls have 1-second delay
- Simulates real network conditions
- Test loading states and user experience

---

## 🎯 End-to-End Testing Scenarios

### Test Case 1: Complete New User Journey 

**Step 1: Create New Account**
1. Go to `/signup`
2. Enter email: `john@test.com`
3. Enter password: `password123`
4. Enter confirm password: `password123`
5. Click "Sign Up"
6. **Expected**: Alert shows "Sign up successful! Token: jwt-token-2-..."
7. **Check Console**: Should see ` New user created: john@test.com`

**Step 2: Sign In with New Account**
1. Go to `/signin`
2. Enter email: `john@test.com`
3. Enter password: `password123`
4. Click "Sign In"
5. **Expected**: Alert shows "Sign in successful! Token: jwt-token-2-..."
6. **Check Console**: Should see ` User signed in: john@test.com`

---

### Test Case 2: Password Reset Flow 

**Step 1: Request Password Reset**
1. Go to `/signin`
2. Click "Forgot Password?"
3. Enter email: `john@test.com`
4. Click "Submit"
5. **Expected**: Redirects to `/verify-otp?email=john@test.com`
6. **Check Console**: Look for `📧 OTP generated for john@test.com: XXXXXX`
7. **Copy the 6-digit OTP from console**

**Step 2: Verify OTP**
1. You should be on `/verify-otp` page
2. Enter the OTP from console (e.g., `847392`)
3. Click "Continue"
4. **Expected**: Modal appears "Link Sent Successfully!"
5. Click "Okay"
6. **Expected**: Redirects to `/reset-password`

**Step 3: Reset Password**
1. You should be on `/reset-password` page
2. Enter new password: `newpassword456`
3. Re-enter password: `newpassword456`
4. Click "Update Password"
5. **Expected**: Modal appears "Password Created!"
6. **Check Console**: Should see ` Password reset for john@test.com`
7. Click "Okay"
8. **Expected**: Redirects to `/signin`

**Step 4: Verify Old Password Doesn't Work**
1. On `/signin` page
2. Enter email: `john@test.com`
3. Enter password: `password123` (old password)
4. Click "Sign In"
5. **Expected**: Error message "Invalid email or password"

**Step 5: Verify New Password Works**
1. On `/signin` page
2. Enter email: `john@test.com`
3. Enter password: `newpassword456` (new password)
4. Click "Sign In"
5. **Expected**: Alert shows "Sign in successful!"

---

### Test Case 3: Multiple Users 

**Create User 1**
1. Go to `/signup`
2. Email: `alice@test.com`, Password: `alice123`
3. Click "Sign Up"
4. **Expected**: Success

**Create User 2**
1. Go to `/signup`
2. Email: `bob@test.com`, Password: `bob123`
3. Click "Sign Up"
4. **Expected**: Success

**Sign In as User 1**
1. Go to `/signin`
2. Email: `alice@test.com`, Password: `alice123`
3. **Expected**: Success

**Sign In as User 2**
1. Go to `/signin`
2. Email: `bob@test.com`, Password: `bob123`
3. **Expected**: Success

---

### Test Case 4: Error Scenarios 

**Duplicate Email**
1. Go to `/signup`
2. Email: `alice@test.com` (already exists)
3. Password: `anything123`
4. Click "Sign Up"
5. **Expected**: Error "Email already exists"

**Wrong Password**
1. Go to `/signin`
2. Email: `alice@test.com`
3. Password: `wrongpassword`
4. Click "Sign In"
5. **Expected**: Error "Invalid email or password"

**Non-existent Email**
1. Go to `/signin`
2. Email: `notexist@test.com`
3. Password: `anything`
4. Click "Sign In"
5. **Expected**: Error "Invalid email or password"

**Forgot Password - Email Not Found**
1. Go to `/forgot-password`
2. Email: `notexist@test.com`
3. Click "Submit"
4. **Expected**: Error "Email not found"

**Wrong OTP**
1. Go to `/forgot-password`
2. Email: `alice@test.com`
3. Click "Submit"
4. On OTP page, enter: `000000` (wrong OTP)
5. Click "Continue"
6. **Expected**: Error "Invalid or expired OTP"

---

### Test Case 5: OTP Resend 

**Step 1: Request OTP**
1. Go to `/forgot-password`
2. Email: `alice@test.com`
3. Click "Submit"
4. **Check Console**: Note the OTP (e.g., `123456`)

**Step 2: Wait for Timer**
1. On `/verify-otp` page
2. Wait 30 seconds for timer to reach 0
3. **Expected**: "Resend OTP" button appears

**Step 3: Resend OTP**
1. Click "Resend OTP"
2. **Check Console**: New OTP generated (e.g., `789012`)
3. **Expected**: Timer resets to 30 seconds
4. **Expected**: OTP inputs are cleared

**Step 4: Use New OTP**
1. Enter the NEW OTP from console
2. Click "Continue"
3. **Expected**: Success modal appears

---

### Test Case 6: OTP Features ⌨️

**Auto-focus Test**
1. Go to `/verify-otp` page
2. Type `1` in first box
3. **Expected**: Cursor moves to second box automatically
4. Type `2`, `3`, `4`, `5`, `6`
5. **Expected**: All boxes filled, cursor on last box

**Backspace Test**
1. On `/verify-otp` page
2. Fill all boxes with `123456`
3. Press Backspace on last box
4. **Expected**: Last box clears
5. Press Backspace again
6. **Expected**: Cursor moves to previous box

**Paste Test**
1. On `/verify-otp` page
2. Copy `123456` to clipboard
3. Click on first input box
4. Paste (Ctrl+V or Cmd+V)
5. **Expected**: All 6 boxes fill automatically

---

### Test Case 7: Validation Errors 

**Email Validation**
1. Go to `/signin`
2. Enter: `notanemail`
3. Click "Sign In"
4. **Expected**: "Please enter a valid email"

**Password Length**
1. Go to `/signup`
2. Email: `test@test.com`
3. Password: `short`
4. **Expected**: "Password must be at least 8 characters"

**Password Mismatch**
1. Go to `/signup`
2. Email: `test@test.com`
3. Password: `password123`
4. Confirm: `password456`
5. **Expected**: "Passwords do not match"

**Empty Fields**
1. Go to `/signin`
2. Leave email empty
3. Click "Sign In"
4. **Expected**: "Email is required"

---

### Test Case 8: Default Test User 

The database comes with one pre-loaded user:

1. Go to `/signin`
2. Email: `test@workhive.com`
3. Password: `password123`
4. Click "Sign In"
5. **Expected**: Success (this user always exists)
