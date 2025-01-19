import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { appConfig } from '../config/app.config';
import { IEmailTemplate } from '../types';
import { APPLICATION_NAME } from '../constants';

// SMTP Transporter instance (reused for multiple emails)
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

/**
 * Sends an email using the provided template.
 * @param toEmail - Recipient's email address.
 * @param template - The email template containing subject and HTML content.
 * @returns A promise that resolves to the sent message info.
 */
export const sendEmail = async (
    toEmail: string,
    template: IEmailTemplate,
): Promise<SMTPTransport.SentMessageInfo> => {
    const mailOptions = {
        from: `${APPLICATION_NAME} ${appConfig.EMAIL_USER}`,
        to: toEmail,
        subject: template.emailSubject,
        html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};
