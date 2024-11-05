import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getEmailVerificationTemplate } from '../templates/verificationEmail';
import { appConfig } from '../config/app.config';

const SUBJECT = 'UserAuthApp Confirmation';

export const sendConfirmationEmail = async (
    toEmail: string,
    otp: string,
): Promise<SMTPTransport.SentMessageInfo> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: appConfig.EMAIL_USER,
            pass: appConfig.EMAIL_PASSWORD,
        },
        connectionTimeout: 10000,
    });

    const emailTemplate: { html: string; text: string } = getEmailVerificationTemplate(otp);

    const mailOptions = {
        from: `UserAuthApp ${appConfig.EMAIL_USER}`,
        to: toEmail,
        subject: SUBJECT,
        text: emailTemplate.text,
        html: emailTemplate.html,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
};
