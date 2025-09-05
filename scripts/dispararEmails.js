import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 

function criarTransporterEmail(emailUsuario, senhaAppEmailGoogle) {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function enviarEmail(transporter, destinatario) {
    
    const emailTemplate = fs.readFileSync(path.join(__dirname, '../email_template.html'), 'utf-8');
    const pdfPath = decodeURIComponent(path.join(__dirname, "../ViniciusCurr.pdf"));
    const mailOptions = {
        from: '',
        to: destinatario,
        subject: "Desenvolvedor Full Stack - Vinícius Mendonça",
        html: emailTemplate,
        attachments: [
            {
                filename: "Currículo Vinícius Mendonça.pdf",
                path:pdfPath 
            }
        ]
    };

    return transporter.sendMail(mailOptions);
}

// Função para enviar e-mails em massa
async function enviarEmailsEmMassa(emailsDestinatarios, emailUsuario, senhaAppEmailGoogle) {
    const transporter = criarTransporterEmail(emailUsuario, senhaAppEmailGoogle);

    const quantidadeEmails = emailsDestinatarios.length
    var statusEnvio = {sucesso: 0, erro: 0}

    for (let emailDestinatario of emailsDestinatarios) {
        try {
            console.log(emailDestinatario)
            await enviarEmail(transporter, emailDestinatario);
            console.log(`E-mail enviado com sucesso para: ${emailDestinatario}`);
            statusEnvio.sucesso += 1
        } catch (error) {
            console.error(`Falha ao enviar e-mail para: ${emailDestinatario}`, error);
            statusEnvio.erro += 1
            return {status:false}
        }
    }
    return {status:true, msg:`Sucesso: ${statusEnvio.sucesso} e-mails enviados com sucesso de ${quantidadeEmails}`}

}

export default enviarEmailsEmMassa


