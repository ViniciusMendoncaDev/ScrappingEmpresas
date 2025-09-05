import InformacoesEmpresasModel from "../model/InformacoesEmpresasModel.js";
import pegaLinksSitesMaps from "../scripts/pegarSitesMaps.js"

class InformacoesEmpresasController {

  async retornarInformacoesEmpresas(req, res) {
    const email = req.params.email;

    if (email) {
      const emailValido = validarEmail(email); 

      if (!emailValido) {
        return res.status(400).json({
          status: false,
          msg: "Insira um e-mail válido",
        });
      }
    }

    try {
      const informacoes = await InformacoesEmpresasModel.buscarInformacoes(
        email
      );

      if (informacoes.length === 0) {
        return res.status(404).json({
          status: false,
          msg: email ? "Nenhuma informação encontrada para esse e-mail." : "Você não tem nenhuma informação cadastrada.",
        });
      }

      return res.json({
        status: true,
        dados: informacoes,
      });

    } catch (err) {
      console.error("Erro ao buscar informações:", err);
      return res.status(500).json({
        status: false,
        msg: "Ocorreu um erro ao buscar as informações.",
      });
    }
  }

  async retornarEmailsEmpresas(req, res) {
    var cidade = req.params.cidade
    console.log(cidade)

    if(cidade == undefined){
      var todosEmails = await InformacoesEmpresasModel.buscarTodosEmails(0);

      if (todosEmails.length === 0) {
          return res.status(404).json({
            status: false,
            msg: "Você não tem nenhuma informação cadastrada.",
          });
        }
      res.json(todosEmails);
    }else{
      var todosEmailsporCidade = await InformacoesEmpresasModel.buscarTodosEmails(cidade);

      if (todosEmailsporCidade.length === 0) {
          return res.status(404).json({
            status: false,
            msg: "Você não tem nenhuma informação cadastrada.",
          });
        }
      res.json(todosEmailsporCidade);
    }

    
  }

  async salvarInformacoesEmpresa(req, res){
    var busca = req.body.busca
    var cidade = req.body.cidade
    
    var script = await pegaLinksSitesMaps(busca,cidade)
    
    if(!script.status){
        return res.status(500).json({
        status: false,
        msg: "Ocorreu um erro ao buscar e salvar as informações.",
      });
    }
    res.send(script);

  }

  async deletarInformacoesEmpresa(req,res){
    var email = req.params.email

    const emailValido = validarEmail(email); 
    if (!emailValido) {
      return res.status(400).json({
        status: false,
        msg: "Insira um e-mail válido",
      });
    }
    
    var checarEmail = await InformacoesEmpresasModel.buscarInformacoes(email)
    console.log(checarEmail)
    if(checarEmail == "" || checarEmail == []){
        return res.status(404).json({
            status: false,
            msg: "Não é possível deletar um e-mail não cadastrado.",
          });
    }

    var deletarEmail = await InformacoesEmpresasModel.deletarInformacoes(email)

    if(!deletarEmail){
        return res.status(404).json({
            status: false,
            msg: "Erro interno ao deletar email",
        });
    }
    res.json({status:true, msg: `Informações de ${email} deletadas com succeso!!`})

  }

  async retornarTodosEmailsEmpresas(req, res){
    try {
      var todosEmails = await InformacoesEmpresasModel.buscarTodosEmails(0);
    } catch (error) {
      
    }
  }
  
  
}


function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}



export default new InformacoesEmpresasController();
