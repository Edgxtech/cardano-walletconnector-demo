package au.com.ausstaker.cardano_dappconn_test.service;

import au.com.ausstaker.cardano_dappconn_test.model.BFProtocolParametersResponse;
import au.com.ausstaker.cardano_dappconn_test.model.ProtocolParametersRequestForm;
import au.com.ausstaker.cardano_dappconn_test.util.Helpers;
import au.com.ausstaker.cardano_dappconn_test.util.ProtocolParamsCache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author timmyedge (https://github.com/Ausstaker)
 * @since Nov 2021
 */
@Service("protocolParametersService")
public class ProtocolParametersService {

    protected static final Log log = LogFactory.getLog(ProtocolParametersService.class);

    @Resource(name="blockfrostService")
    BlockfrostService blockfrostService;

    /* Cache of parameters */
    Map<Long,ProtocolParamsCache> cacheMap = new HashMap<Long,ProtocolParamsCache>();

    @PostConstruct
    public void postConstruct() {
        cacheMap.put(Helpers.TESTNET_ID, new ProtocolParamsCache());
        cacheMap.put(Helpers.MAINNET_ID, new ProtocolParamsCache());
    }

    public BFProtocolParametersResponse getProtocolParametersFromBlockfrost(ProtocolParametersRequestForm form) throws Exception {
        ProtocolParamsCache cache = cacheMap.get(form.getNetwork());
        if (cache.getCacheSynchDate() == null) {
            // Get a fresh copy
            log.debug("No previous cache, getting fresh copy");
            BFProtocolParametersResponse response = blockfrostService.getProtocolParamsFromBlockfrost(form);
            cache.setProtocolParametersResponse(response);
            cache.setCacheSynchDate(new Date());
            cacheMap.put(form.getNetwork(), cache);
            return cache.getProtocolParametersResponse();
        }
        else {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_YEAR, -5);
            if (cache.getCacheSynchDate().after(cal.getTime())) {
                // If date is within 5 days (epoch) pull from cache (except latest slot, for ttl setting)
                log.debug("Cache is current, getting latest slot only");
                BFProtocolParametersResponse response = cache.getProtocolParametersResponse();
                response.setLatest_slot(blockfrostService.getLatestBlocks(form).getSlot());
                cache.setProtocolParametersResponse(response);
                cacheMap.put(form.getNetwork(), cache);
                return cache.getProtocolParametersResponse();
            }
            else {
                // Get a fresh copy
                log.debug("Cache is expired, getting fresh copy");
                BFProtocolParametersResponse response = blockfrostService.getProtocolParamsFromBlockfrost(form);
                cache.setProtocolParametersResponse(response);
                cache.setCacheSynchDate(new Date());
                cacheMap.put(form.getNetwork(), cache);
                return cache.getProtocolParametersResponse();
            }
        }
    }

    /* For testing, key parameters */
    public BFProtocolParametersResponse getProtocolParamsFromCannedData(ProtocolParametersRequestForm form) {
        log.debug("Getting from Canned: "+form.getNetwork());
        BFProtocolParametersResponse resultObj = new BFProtocolParametersResponse();
        if (form.getNetwork().equals(Helpers.TESTNET_ID)) {
            resultObj.setEpoch(new Long(166));
            resultObj.setMin_fee_a(44.0);
            resultObj.setMin_fee_b(155381.0);
            resultObj.setMax_block_size(new Long(65536));
            resultObj.setMax_tx_size(new Long(16384));
            resultObj.setKey_deposit(2000000.0);
            resultObj.setPool_deposit(500000000.0);
            resultObj.setMax_val_size(5000.0);
            resultObj.setMin_utxo(1000000.0);
            resultObj.setLatest_slot(new Long(412162133)); // this is dynamic, should be set prior to tests
            return resultObj;
        }
        else if (form.getNetwork().equals(Helpers.MAINNET_ID)) {
            resultObj.setEpoch(new Long(300));
            resultObj.setMin_fee_a(44.0);
            resultObj.setMin_fee_b(155381.0);
            resultObj.setMax_block_size(new Long(65536));
            resultObj.setMax_tx_size(new Long(16384));
            resultObj.setKey_deposit(2000000.0);
            resultObj.setPool_deposit(500000000.0);
            resultObj.setMax_val_size(5000.0);
            resultObj.setMin_utxo(1000000.0);
            resultObj.setLatest_slot(new Long(412162133)); // this is dynamic, should be set prior to tests
            return resultObj;
        }
        return null;
    }
}
