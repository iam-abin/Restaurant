import { APPLICATION_NAME, CURRENT_YEAR } from '../constants';

export const getForgotPasswordEmailTemplate = (resetURL: string, tokenExpiryTime: number) => {
    const html = `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Reset Password</title>
                <style>
                    .email-container {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        padding: 20px;
                        background-color: #f4f4f4;
                        border-radius: 10px;
                        max-width: 600px;
                        margin: auto;
                    }
                    .email-header {
                        background-color: #d9534f;
                        color: white;
                        padding: 10px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .email-body {
                        padding: 20px;
                        background-color: white;
                        border-radius: 0 0 10px 10px;
                    }
                    .email-footer {
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                        color: #777;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        font-size: 16px;
                        color: white;
                        background-color: #d9534f;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Reset Your Password</h1>
                    </div>
                    <div class="email-body">
                        <p>Hi,</p>
                        <p>We received a request to reset your password. Click the button below to reset it.</p>
                        <a href="${resetURL}" class="button">Reset Password</a>
                        <p>
                            Please note that this link will expire in <strong>${tokenExpiryTime} seconds</strong>. 
                            If you didn't request a password reset, please ignore this email.
                        </p>
                        <p>Thank you,<br />The ${APPLICATION_NAME} Team</p>
                    </div>
                    <div class="email-footer">
                        <p>&copy; ${CURRENT_YEAR} ${APPLICATION_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
    const EMAIL_SUBJECT = `${APPLICATION_NAME} Reset Password Email`;

    return {
        html: html,
        emailSubject: EMAIL_SUBJECT,
    };
};
