package expo.modules.tvtls

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

    AsyncFunction("connect") { host: String, port: Int, certPem: String, keyPem: String ->
      try {
        // 1. Clean and parse the client certificate
        val certStr = certPem
                .replace("-----BEGIN CERTIFICATE-----", "")
                .replace("-----END CERTIFICATE-----", "")
                .replace("\r", "")
                .replace("\n", "")
                .replace(" ", "")
        val certBytes = Base64.decode(certStr, Base64.DEFAULT)
        val certFactory = CertificateFactory.getInstance("X.509")
        val certificate = certFactory.generateCertificate(ByteArrayInputStream(certBytes))

        // 2. Clean and Parse the Private Key (Assumes PKCS#8 format)
        val keyStr = keyPem
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replace("\r", "")
                .replace("\n", "")
                .replace(" ", "")
        val keyBytes = Base64.decode(keyStr, Base64.DEFAULT)
        val keySpec = PKCS8EncodedKeySpec(keyBytes)
        val keyFactory = KeyFactory.getInstance("RSA")
        val privateKey = keyFactory.generatePrivate(keySpec)

        // 3. Supply a real password array to unlock the key within the KeyStor
        val password = "password".toCharArray()
        val keyStore = KeyStore.getInstance(KeyStore.getDefaultType())
        keyStore.load(null, null)
        keyStore.setKeyEntry("client", privateKey, null, arrayOf(certificate))

        // 4.   Initialize the KeyManagerFactory with the matching password
        val kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm())
        kmf.init(keyStore, null)

        // 5. Trust-All Manager for bypassing server validation checks
        val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
            override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
            override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
        })

        //6. Construct SSL Context
        val sslContext = SSLContext.getInstance("TLS")
        sslContext.init(kmf.keyManagers, trustAllCerts, SecureRandom())

        // 7. Establish the Secure Native Tunnel
        socket = sslContext.socketFactory.createSocket(host, port) as SSLSocket
        socket?.startHandshake()

        outputStream = socket?.outputStream
        inputStream = socket?.inputStream

        // 8. Spin up the background read runner
        readThread = thread {
            try {
                val buffer = ByteArray(4096)
                var bytesRead: Int
                while (inputStream?.read(buffer).also { bytesRead = it ?: -1 } != -1) {
                    val data = buffer.copyOfRange(0, bytesRead)
                    sendEvent("onData", mapOf("data" to Base64.encodeToString(data, Base64.NO_WRAP)))
                }
            } catch (e: Exception) {
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
