export const getEmailVerificationTemplate = function (otp: string) {
    const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <title>Email verify</title>
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700"
        rel="stylesheet" media="screen">
      <style>
        
      </style>
    </head>

    <body>
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">UserApp</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>UserApp
    <p>Thank you for choosing UserAuthApp. Use the following OTP to complete your Sign Up procedures.
    This OTP is valid for 10 minutes from the time this email was sent. After this period, You need to click on resend 
    OTP or need to signup again to verify your email.
    </p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />UserApp</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>UserAuthApp</p>
      <p>India</p>
    </div>
  </div>
</div>
    </body>

    </html>`;
    const text = `
        Verify Email, A request to create your UserAuthApp account was received.
        Use this OTP to confirm your account and log in`;
    return {
        html: html,
        text: text,
    };
};
