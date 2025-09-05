import informacoesEmpresas from "../database/schemas/informacoesEmpresasSchema.js"; 

class InformacoesEmpresas {
  async salvar(titulos, paragrafo, email, site, busca, cidade) {
    try {
      var todosEmails = await this.buscarInformacoes(email);

      if (todosEmails != "" || !todosEmails != []) {
        return false;
      }

      const novaEmpresa = new informacoesEmpresas({
        titulos: titulos,
        paragrafo: paragrafo,
        email: email,
        processado_ia: 0,
        site: site,
        busca: busca,
        cidade: cidade
      });

      const resultado = await novaEmpresa.save();
      if (!resultado) {
        return false;
      }

      return true;
    } catch (err) {
      console.error("Erro ao salvar empresa:", err);
      return false;
    }
  }
  async buscarInformacoes(email) {
    try {
      let resultado;

      if (email) {
        resultado = await informacoesEmpresas.find({ email: email });

        return resultado;
      }

      resultado = await informacoesEmpresas.find({});

      return resultado;
    } catch (err) {
      console.error("Erro ao buscar empresa:", err);
      throw err;
    }
  }

  async buscarTodosEmails(cidade) {
    try {
       
      if(cidade == 0){
        const resultado = await informacoesEmpresas.find(
          {},
          { email: 1, _id: 0 }
        );
        const emails = resultado.map((item) => item.email);
        return emails;
  
      }else{
        const resultado = await informacoesEmpresas.find(
          { cidade: cidade }, 
          { email: 1, _id: 0 } 
        );
        const emails = resultado.map((item) => item.email);
        return emails;
      }

      

    } catch (err) {
      console.error("Erro ao buscar empresa:", err);
      throw err;
    }
  }

  async deletarInformacoes(email) {
    try {

      const resultado = await informacoesEmpresas.deleteOne({ email: email });

      if(!resultado){
        return false
      }
      return true

    } catch (err) {
      return false
    }
  }
}

export default new InformacoesEmpresas();
