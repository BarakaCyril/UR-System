package expo.modules.tvtls

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.InputStream
import java.io.OutputStream
import java.io.ByteArrayInputStream
import java.net.Socket
import javax.net.ssl.*
import java.security.KeyStore
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.security.cert.CertificateFactory
import java.security.KeyFactory
import java.security.spec.PKCS8EncodedKeySpec
import android.util.Base64
import kotlin.concurrent.thread

class ExpoTvTlsModule : Module() {
  private var socket: SSLSocket? = null
  private var outputStream: OutputStream? = null
  private var inputStream: InputStream? = null
  private var readThread: Thread? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoTvTls")

    // The events we will listen to in React Native
    Events("onData", "onError", "onClose")

    AsyncFunction("connect") {host: String, port: Int, certPerm: String, keyPem: string -> 
      try{
        // 1. Clean and Parse the Client Certificate
        val certStr = certPem.replace("-----BEGIN CERTIFICATE-----", "").replace("-----END CERTIFICATE-----", "").replace("\n", "")
            val certBytes = Base64.decode(certStr, Base64.DEFAULT)
            val certFactory = CertificateFactory.getInstance("X.509")
            val certificate = certFactory.generateCertificate(ByteArrayInputStream(certBytes))

            // 2. Clean and Parse the Private Key (Assumes PKCS#8 format)
            val keyStr = keyPem.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace("\n", "")
            val keyBytes = Base64.decode(keyStr, Base64.DEFAULT)
            val keySpec = PKCS8EncodedKeySpec(keyBytes)
            val keyFactory = KeyFactory.getInstance("RSA")
            val privateKey = keyFactory.generatePrivate(keySpec)

            // 3. Build the KeyStore with your identity\
            val keyStore = KeyStore.getInstance(KeyStore.getDefaultType())
            keyStore.load(null, null)
            keyStore.setKeyEntry("client", privateKey, null, arrayOf(certificate))

            val kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm())
            kmf.init(keyStore, null)

            // 4. A TrustManager that accepts the TV's self-signed certs
            val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
                override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
                override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
                override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            })

            // 5. Initialize the SSL Context
            val sslContext = SSLContext.getInstance("TLS")
            sslContext.init(kmf.keyManagers, trustAllCerts, SecureRandom())

            // 6. Connect the Socket
            socket = sslContext.socketFactory.createSocket(host, port) as SSLSocket
            socket?.startHandshake()

            outputStream = socket?.outputStream
            inputStream = socket?.inputStream

            // 7. Start a background thread to continuously read data from the TV
            readThread = thread {
              try {
                val buffer = ByteArray(4096)
                var bytesRead: Int
                while (inputStream?.read(buffer).also { bytesRead = it ?: -1 } != -1) {
                        val data = buffer.copyOfRange(0, bytesRead)
                        // Send binary data up to JS as a Base64 string
                        sendEvent("onData", mapOf("data" to Base64.encodeToString(data, Base64.NO_WRAP)))
                    }
              }catch (e: Exception) {
                sendEvent("onError", mapOf("error" to e.message))
              } finally {
                sendEvent("onClose", emptyMap<String, Any>())
              }
            }
            return@AsyncFunction true
      } catch ( e: Exception) {
        throw Exception("TLS Connection failed: ${e.message}")
      }
    }

    Function("send") {dataBase64: String -> 
      try {
        val bytes = Base64.decode(dataBase64, Base64.DEFAULT)
        outputStream?.write(bytes)
        outputStream?.flush()
      } catch (e: Exception) {
          sendEvent("onError", mapOf("error" to "Failed to send: ${e.message}"))
      }
    }

    Function("disconnect"){
      socket?.close()
      socket = null
    }
  }
}
