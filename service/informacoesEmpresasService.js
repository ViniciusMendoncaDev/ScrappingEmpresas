/* import informacoesEmpresasModel from "../model/informacoesEmpresasModel.js";
import pegaLinksSitesMaps from "../scripts/pegarSitesMaps.js";
import validarEmail from "../utils/validarEmail.js"; // Função de validação de email

class InformacoesEmpresasService {

  async buscarInformacoes(email) {
    if (email && !validarEmail(email)) {
      throw new Error("Insira um e-mail válido");
    }

    const informacoes = await informacoesEmpresasModel.buscarInformacoes(email);

    if (informacoes.length === 0) {
      throw new Error(email ? "Nenhuma informação encontrada para esse e-mail." : "Você não tem nenhuma informação cadastrada.");
    }

    return informacoes;
  }

  async buscarTodosEmails() {
    const todosEmails = await informacoesEmpresasModel.buscarTodosEmails();

    if (todosEmails.length === 0) {
      throw new Error("Você não tem nenhuma informação cadastrada.");
    }

    return todosEmails;
  }

  async salvarInformacoes(busca, cidade) {
    const script = await pegaLinksSitesMaps(busca, cidade);

    if (!script.status) {
      throw new Error("Ocorreu um erro ao buscar e salvar as informações.");
    }

    return script;
  }

  async deletarInformacoes(email) {
    if (!validarEmail(email)) {
      throw new Error("Insira um e-mail válido");
    }

    const checarEmail = await informacoesEmpresasModel.buscarInformacoes(email);
    if (!checarEmail || checarEmail.length === 0) {
      throw new Error("Não é possível deletar um e-mail não cadastrado.");
    }

    const deletarInformacoes = await informacoesEmpresasModel.deletarInformacoes(email);

    if (!deletarInformacoes) {
      throw new Error("Houve um erro interno ao deletar essa informação, tente novamente mais tarde!");
    }

    return `Informações de ${email} deletadas com sucesso!`;
  }
}

export default new nformacoesEmpresasService();
 */