import EmailsModel from "../model/EmailsModel.js";
import enviarEmailsEmMassa from "../scripts/dispararEmails.js"

class EmailsController {

    async enviarEmails(req,res){
        var emails = req.body.emails
        if(emails.length <= 0){
            return res.status(400).json({status: false, message: "Nenhum email foi informado."})
        }

        var statusEnvioEmail = await enviarEmailsEmMassa(emails, 0, 0)

        if (statusEnvioEmail.status){
            return res.status(200).json({
                status: true,
                msg: statusEnvioEmail.msg,
              });
        }else{
            return res.status(400).json({status: false,
                msg: "Houve um erro interno ao tentar enviar seus e-mails. Tente novamente mais tarde",
              });
        }
    }

    

}

export default new EmailsController();
