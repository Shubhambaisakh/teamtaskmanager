import { Resend } from 'resend';

// Lazy initialize Resend only when needed (not at build time)
let resendInstance: Resend | null = null;

function getResendClient() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not found. Email functionality will be disabled.');
      return null;
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// Email sender configuration
const FROM_EMAIL = 'onboarding@resend.dev'; // Replace with your verified domain email
const APP_NAME = 'Team Task Manager';

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(to: string, userName: string) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend client not available. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to ${APP_NAME}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to ${APP_NAME}!</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for signing up! We're excited to have you on board.</p>
          <p>You can now:</p>
          <ul>
            <li>Create and manage projects</li>
            <li>Assign tasks to team members</li>
            <li>Track progress with Kanban boards</li>
            <li>Collaborate with your team in real-time</li>
          </ul>
          <p>Get started by creating your first project!</p>
          <p>Best regards,<br/>The ${APP_NAME} Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send task assignment notification email
 */
export async function sendTaskAssignmentEmail(
  to: string,
  userName: string,
  taskTitle: string,
  projectName: string,
  taskUrl: string
) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend client not available. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">New Task Assigned</h1>
          <p>Hi ${userName},</p>
          <p>You have been assigned a new task in <strong>${projectName}</strong>:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin: 0; color: #555;">${taskTitle}</h2>
          </div>
          <p>
            <a href="${taskUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Task
            </a>
          </p>
          <p>Best regards,<br/>The ${APP_NAME} Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending task assignment email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending task assignment email:', error);
    return { success: false, error };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  resetUrl: string
) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend client not available. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <p>
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Best regards,<br/>The ${APP_NAME} Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}

/**
 * Send comment notification email
 */
export async function sendCommentNotificationEmail(
  to: string,
  userName: string,
  commenterName: string,
  taskTitle: string,
  commentBody: string,
  taskUrl: string
) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend client not available. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New Comment on: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">New Comment</h1>
          <p>Hi ${userName},</p>
          <p><strong>${commenterName}</strong> commented on <strong>${taskTitle}</strong>:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0070f3;">
            <p style="margin: 0;">${commentBody}</p>
          </div>
          <p>
            <a href="${taskUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Task
            </a>
          </p>
          <p>Best regards,<br/>The ${APP_NAME} Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending comment notification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending comment notification email:', error);
    return { success: false, error };
  }
}

/**
 * Send project invitation email
 */
export async function sendProjectInvitationEmail(
  to: string,
  inviteeName: string,
  inviterName: string,
  projectName: string,
  projectUrl: string
) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend client not available. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You've been invited to join ${projectName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Project Invitation</h1>
          <p>Hi ${inviteeName},</p>
          <p><strong>${inviterName}</strong> has invited you to join the project <strong>${projectName}</strong>.</p>
          <p>
            <a href="${projectUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Project
            </a>
          </p>
          <p>Best regards,<br/>The ${APP_NAME} Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending project invitation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending project invitation email:', error);
    return { success: false, error };
  }
}
