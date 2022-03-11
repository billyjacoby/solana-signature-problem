import { Keypair, Message, SystemProgram, Transaction } from "@solana/web3.js";
import base58 from "bs58";

import nacl from "tweetnacl";

let testMessage =
  "7X67XgM8GNM5ZQyRsUrAoPY3Hpg1JnYcte8U3Wnfssp6qc7Xo4JZX2EbXt3xsgSrK8DtE5GSv6Kodtz2TcvGz3xqBH3DC6rz48teAme9hVLWCe8krFD8afPyongtQ3xz1pAtiU1dqT2MVKLPPUMj7uVJcDzz5ew4hgwDNHRJAZAc3rJ4jP4iPnS496Ts2rAtd7QQoAvJmyCjm2hJ1xAv4cRU5x32zQr8B1x2a5m38gfEuEAhk2eEvhSzZ3uiRyts5cRaN6iGJrWNpMsvYaghqoxRiyumVtH15vC9AbMKTbhqig967HThfyNn6bXG4g7AWm9dGQgJCPaWUdK2u2zbJ58Vfq7NT4JCkZ5dUqrzoA61LLVwmPJvHfuEGWmCQuQ4ssuYmsdWHfkaY1dZ987euGod4ujkPnFzmPcTfZPEMmtNaUe11w7xbmsYAWqtGEj2n4NR3wRtNJDRuYYZ86dPxyhMsp2owwkgqHdwcK5sLdJzcdmSJiwVAV3yw52NcfsXFXituwWzGbaJz7uvRJaGNQpZugcrPCVDRsiFNcRACVrgvKx5koRQ1pcKtJdcV9jcrTxfCSKkzXBNDjX46F6fwZeUqPtXVzBiACM3dYL5g4AhXcRYggJqDqpXbgN9CApuHUV9839UZBhPohqSuUaVztFnFbQ9jvk2eXLhVYqo82pTimPfTdFBsPg2kztvZZTjURSsiSsYaBh9T93UUFJd5pDzstknFbCZaGBRQmcbjMK64Nn8z1NeHzMEsSvHF74rQEwHFEH3pcQLfVUG4DJjdpCsvtjWBXNVgXkycsvBnetZ8c88jTCb9RJKJhDvs893nuJ57V53kwghyhYpyksTV423EdGE8q4bH";

async function signTransactionWeb(message = testMessage) {
  let keypair = Keypair.fromSecretKey(
    base58.decode(
      "5JLPhQuPs3jJX25CTo9GcsmBNbLgLgwS6dFoDh3sRdvhxy9pu7JdJzGsG8eXt2qrct7hwYqboQLupzVzS5JmdNuf"
    )
  );

  console.log(JSON.stringify(Message.from(base58.decode(message))));

  // Something has to be going on here...
  let newTX = Transaction.populate(Message.from(base58.decode(message)));

  newTX.recentBlockhash = "2AySDQYjsej4ajtqjrkiSpeCzuQ8pbPWyvmQpFNs4aNG";
  newTX.sign(keypair);
  console.log(newTX?.feePayer?.toBase58());

  console.log(JSON.stringify(Message.from(newTX.serializeMessage())));

  let sig = newTX.signatures[0].signature;
  sig ? console.log(base58.encode(sig)) : console.log("no sig");

  let signatures = [
    // Expected Signature
    "3QfLPJbSixK8CeqWUwpzStcW6eYLMH7iw4rsXcU3sh8YSZ4igJ6og43HVAinRYCV7ipds7Whgad5dDzBwFpNg8Wo",
    // Random Signature
    "3hWo9gQigGVQuT1DjDEHuMUjsyqkis8XiAWkPkWv2auqGNJ15QW1ThPGNfGh2e3p46Fx2cJYzWk41RfTdfHLTieW",
    // Previously Recieved Signature
    "38wyTQtsRaYrnrXJfCQ6KxfV8Rnj2fwgcoPqBd4cKMVpWwyZjDqZX21VxZBq6cS7VFNsGhCLwXXp3a8HeVdkn9KT",
    // Current signature encoded
    base58.encode(sig as Uint8Array),
  ];
  for (let i = 0; i < signatures.length; i++) {
    let verifyFeePayerSignatureResult = nacl.sign.detached.verify(
      //* When serializing the message here and verifying, this returns true for the signature that was provided
      newTX.serializeMessage() as Uint8Array,

      //* However when I pass in the oringial tesmessage decoded, this returns true for the expected signature
      // base58.decode(testMessage) as Uint8Array,
      //* Is there something I could be missing from the initial message when I'm re-populating the transaction?
      base58.decode(signatures[i]),
      keypair.publicKey.toBytes()
    );
    console.log(`verify feePayer signature: ${verifyFeePayerSignatureResult}`);
  }
}
signTransactionWeb();
