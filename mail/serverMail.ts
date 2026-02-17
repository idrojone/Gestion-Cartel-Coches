import nodemailer from "nodemailer";

export async function sendMail(): Promise<nodemailer.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false
    });

    return transporter.sendMail({
        from: 'dev@local.test',
        to: 'usuario@test.local',
        subject: 'Mail desde Vue',
        text: 'Correo enviado pulsando un botón'
    });
}