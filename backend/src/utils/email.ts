import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { appConfig } from '../config/app.config';
import { IEmailTemplate } from '../types';

export const sendEmail = async (
    toEmail: string,
    template: IEmailTemplate,
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

    const mailOptions = {
        from: `RestaurantApp ${appConfig.EMAIL_USER}`,
        to: toEmail,
        subject: template.emailSubject,
        html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
};
