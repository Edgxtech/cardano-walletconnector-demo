package au.com.ausstaker.cardano_dappconn_test.service;

import au.com.ausstaker.cardano_dappconn_test.model.*;
import au.com.ausstaker.cardano_dappconn_test.util.Helpers;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

/**
 * @author ausstaker (https://github.com/Ausstaker)
 * @since Nov 2021
 */
@Service("blockfrostService")
public class BlockfrostService {

    protected static final Log log = LogFactory.getLog(BlockfrostService.class);

    Gson gson = new Gson();

    @Value("${blockfrost.cardano.testnet.project.id}")
    private String blockfrostCardanoTestnetProjectId;

    @Value("${blockfrost.cardano.mainnet.project.id}")
    private String blockfrostCardanoMainnetProjectId;

    public BFLatestBlocksResponse getLatestBlocks(ProtocolParametersRequestForm form) throws Exception {
        String url = null;
        HttpGet get = null;
        if (form.getNetwork().equals(Helpers.TESTNET_ID)) {
            url = "https://cardano-testnet.blockfrost.io/api/v0/blocks/latest";
            get = new HttpGet(url);
            get.addHeader("project_id",blockfrostCardanoTestnetProjectId);
        }
        else if (form.getNetwork().equals(Helpers.MAINNET_ID)) {
            url = "https://cardano-mainnet.blockfrost.io/api/v0/blocks/latest";
            get = new HttpGet(url);
            get.addHeader("project_id",blockfrostCardanoMainnetProjectId);
        }
        else {
            log.warn("Requested network id was not matched, returning null");
            return null;
        }
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = httpClient.execute(get);
        String result = EntityUtils.toString(response.getEntity());
        BFLatestBlocksResponse resultObj = gson.fromJson(result, BFLatestBlocksResponse.class);
        return resultObj;
    }

    /* API Ref: https://docs.blockfrost.io/#tag/Cardano-Epochs/paths/~1epochs~1latest~1parameters/get */
    public BFProtocolParametersResponse getProtocolParamsFromBlockfrost(ProtocolParametersRequestForm form) throws Exception {
        // IN case no BLOCKFROST TESTNET Key, can still test app using some defaults
        if (form.getNetwork().equals(Helpers.TESTNET_ID)) {
            return buildCannedTestnetProtocolParams();
        }
        String url;
        HttpGet get = null;
        if (form.getNetwork().equals(Helpers.TESTNET_ID)) {
            url = "https://cardano-testnet.blockfrost.io/api/v0/epochs/latest/parameters";
            get = new HttpGet(url);
            get.addHeader("project_id",blockfrostCardanoTestnetProjectId);
        }
        else if (form.getNetwork().equals(Helpers.MAINNET_ID)) {
            url = "https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest/parameters";
            get = new HttpGet(url);
            get.addHeader("project_id",blockfrostCardanoMainnetProjectId);
        }
        else {
            log.warn("Requested network id was not matched, returning null");
            return null;
        }
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse response = httpClient.execute(get);
        String result = EntityUtils.toString(response.getEntity());
        BFProtocolParametersResponse resultObj = gson.fromJson(result, BFProtocolParametersResponse.class);
        BFLatestBlocksResponse latestBlock = getLatestBlocks(form);
        if (latestBlock != null) {
            resultObj.setLatest_slot(latestBlock.getSlot());
        }
        return resultObj;
    }

    public BFProtocolParametersResponse buildCannedTestnetProtocolParams() {
        BFProtocolParametersResponse response = new BFProtocolParametersResponse();
        response.setMin_fee_a(44.0);
        response.setMin_fee_b(155381.0);
        response.setMin_utxo(34482.0);
        response.setKey_deposit(2000000.0);
        response.setPool_deposit(500000000.0);
        response.setMax_val_size(5000.0);
        response.setMax_tx_size(16384L);
        response.setPrice_mem(0.0577);
        response.setPrice_step(0.0000721);
        response.setCoins_per_utxo_word(34482.0);
        return response;
    }
}
