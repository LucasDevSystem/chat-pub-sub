const express = require("express");
const cors = require("cors");
const amqp = require("amqplib");

const app = express();
const port = 3003;

// string de conexao com o rabbit
const RABBIT_CONN_URL = "amqp://localhost";

app.use(cors());
app.use(express.json());

/*
 rota de Publicacao
 
 publica a mensagem no canal dos assinantes.

*/
app.post("/publish/:channelId", async (req, res) => {
  const data = req.body;
  const channelId = req.params.channelId;

  try {
    const connection = await amqp.connect(RABBIT_CONN_URL);
    const channel = await connection.createChannel();
    const exchange = `channel_${channelId}`;

    await channel.assertExchange(exchange, "fanout", { durable: false });
    channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
    res.send("Message sent to RabbitMQ");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error sending message to RabbitMQ");
  }
});
/*
 rota subscribe

 A conexao e mantida ativa com o cliente, assim quanto o rabbit tiver atualizacoes 
 na fila do canal sera enviado para o assinante.

*/
app.get("/subscribe/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  // header para manter a conexao ativa
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const connection = await amqp.connect(RABBIT_CONN_URL); 
    const channel = await connection.createChannel();
    const exchange = `channel_${channelId}`;
    await channel.assertExchange(exchange, "fanout", { durable: false });

    const { queue } = await channel.assertQueue("", { exclusive: true });
    channel.bindQueue(queue, exchange, "");

    const sendMessage = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Configurar um intervalo para manter a conexao ativa
    const keepAliveInterval = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 30000);

    // fica escutando a fila do rabbitMQ
    channel.consume(
      queue,
      (msg) => {
        if (msg.content) {
          sendMessage(msg.content.toString());
        }
      },
      { noAck: true }
    );

    // sempre quando houver desconexao fechar o canal e a connexao
    req.on("close", () => {
      clearInterval(keepAliveInterval);
      channel.close();
      connection.close();
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).end();
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
