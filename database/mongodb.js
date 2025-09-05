import mongoose from 'mongoose';
const mongoURI = 'mongodb://127.0.0.1:27017/scrappingEmpresas';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Conectado ao MongoDB!');
    

  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
};

export default connectMongoDB;
