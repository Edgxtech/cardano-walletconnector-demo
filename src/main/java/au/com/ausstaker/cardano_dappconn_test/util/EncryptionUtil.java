package au.com.ausstaker.cardano_dappconn_test.util;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;

/**
 * @author edge2ipi (https://github.com/Ausstaker)
 * @since Nov 2021
 */
public class EncryptionUtil {
    static PooledPBEStringEncryptor encryptor = null;
    static {
        encryptor = new PooledPBEStringEncryptor();
        encryptor.setPoolSize(4); 
        encryptor.setPassword("mine");
        encryptor.setAlgorithm("PBEWITHMD5ANDDES");
    }

    public static String encrypt(String input) {
        return encryptor.encrypt(input);
    }

    public static String decrypt(String encryptedMessage) {
        return encryptor.decrypt(encryptedMessage);
    }

}