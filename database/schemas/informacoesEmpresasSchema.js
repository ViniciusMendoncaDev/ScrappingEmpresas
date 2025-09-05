import mongoose from "mongoose";

const informacoesEmpresasSchema = new mongoose.Schema({
  titulos: {
    type: String,
    required: false,
  },
  paragrafo: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  site: {
    type: String,
    required: true, 
  },
  busca: {
    type: String,
    required: true, 
  },
  cidade: {
    type: String,
    required: true, 
  },
  processado_ia: {
    type: Boolean,
    required: true, 
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
});

// Criar o modelo com base no esquema
const informacoesEmpresas = mongoose.model('informacoesEmpresas', informacoesEmpresasSchema);

export default informacoesEmpresas;
