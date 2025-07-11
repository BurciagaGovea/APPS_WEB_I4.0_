import mongoose from "mongoose";

const hosts = '127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019';
const dbName = 'PRUEBA';  // pon aquí tu BD, o déjalo vacío para usar 'test'
const replicaSet = 'rs0';
const options = [
  `replicaSet=${replicaSet}`,
  `retryWrites=true`,
  `w=majority`
].join('&');

const mongoUri = `mongodb://${hosts}/${dbName}?${options}`;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri, {
      // mongoose 6+ ya trae estas por defecto, pero no está de más:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log('MongoDB replica set conectado');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB