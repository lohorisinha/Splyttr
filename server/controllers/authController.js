const resend = new Resend(process.env.RESEND_API_KEY);const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, name, otp) => {
  await transporter.sendMail({
    from: `"Splyttr 🧾" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify your Splyttr account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#CDEDB3;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#CDEDB3;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#084734;padding:32px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Splyttr 🧾</h1>
                    <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Split bills, not friendships.</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 32px;">
                    <p style="margin:0 0 8px;color:#0a0a0a;font-size:22px;font-weight:700;">Hey ${name} 👋</p>
                    <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">
                      Thanks for signing up! Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <div style="background-color:#f4faf4;border:2px dashed #CDEDB3;border-radius:16px;padding:28px;text-align:center;margin-bottom:32px;">
                      <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your verification code</p>
                      <p style="margin:0;color:#084734;font-size:48px;font-weight:800;letter-spacing:12px;">${otp}</p>
                    </div>

                    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                      If you didn't create a Splyttr account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f9fefb;border-top:1px solid #e2f5e2;padding:20px 32px;text-align:center;">
                    <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Splyttr · Made with 💚</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  });
};

const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: `"Splyttr 🧾" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Splyttr 🧾',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background-color:#CDEDB3;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#CDEDB3;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#084734;padding:48px 32px;text-align:center;position:relative;">
                    <h1 style="margin:0 0 6px;color:#ffffff;font-size:36px;font-weight:800;letter-spacing:-1px;">Splyttr 🧾</h1>
                    <p style="margin:0;color:#CEF17B;font-size:15px;font-style:italic;">Split bills, not friendships.</p>
                  </td>
                </tr>

                <!-- Welcome message -->
                <tr>
                  <td style="padding:40px 32px 24px;">
                    <p style="margin:0 0 6px;color:#0a0a0a;font-size:24px;font-weight:700;">Welcome, ${name}! 🎉</p>
                    <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.7;">
                      You're officially part of Splyttr. No more awkward "who owes what" moments — we've got you covered.
                    </p>

                    <!-- Feature highlights -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${[
                        { emoji: '📸', title: 'Scan any receipt', desc: 'Just photograph it — we read and extract every item automatically.' },
                        { emoji: '👥', title: 'Assign to anyone', desc: 'Split items between specific people, not just equal shares.' },
                        { emoji: '📊', title: 'Track your spending', desc: 'Beautiful analytics so you always know where your money goes.' },
                      ].map(({ emoji, title, desc }) => `
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f7f0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td width="48" style="vertical-align:top;padding-top:2px;">
                                  <div style="width:40px;height:40px;background-color:#f4faf4;border-radius:10px;text-align:center;line-height:40px;font-size:20px;">${emoji}</div>
                                </td>
                                <td style="padding-left:12px;vertical-align:top;">
                                  <p style="margin:0 0 3px;color:#0a0a0a;font-size:14px;font-weight:700;">${title}</p>
                                  <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">${desc}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding:8px 32px 40px;">
                    <a href="https://splyttr-orcin.vercel.app" style="display:block;background-color:#084734;color:#ffffff;text-decoration:none;text-align:center;padding:16px;border-radius:14px;font-size:15px;font-weight:700;">Start splitting</a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 32px;">
                    <div style="border-top:1px solid #e2f5e2;"></div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 32px;text-align:center;">
                    <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;">You're receiving this because you just signed up for Splyttr.</p>
                    <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Splyttr · Made with 💚</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  });
};

// Register — save user unverified, send OTP
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser && !existingUser.isVerified) {
      // Resend OTP to existing unverified user
      existingUser.password = hashedPassword;
      existingUser.name = name;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false
      });
    }

    console.log('Sending OTP to:', email);
    await sendOTPEmail(email, name, otp);
    console.log('OTP sent successfully');

    res.status(201).json({
      message: 'OTP sent to your email',
      email
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: 'OTP expired' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Send welcome email in background
    sendWelcomeEmail(user.email, user.name).catch(err => console.error('Welcome email failed:', err));

    res.json({
      message: 'Email verified successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Server error during verification' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};