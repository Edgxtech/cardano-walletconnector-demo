package au.com.ausstaker.cardano_dappconn_test.util;

import au.com.ausstaker.cardano_dappconn_test.model.BFProtocolParametersResponse;
import java.util.Date;

/**
 * @author edge2ipi (https://github.com/Ausstaker)
 * @since Nov 2021
 */
public class ProtocolParamsCache {

    BFProtocolParametersResponse protocolParametersResponse;
    Date cacheSynchDate = null;

    public BFProtocolParametersResponse getProtocolParametersResponse() {
        return protocolParametersResponse;
    }

    public void setProtocolParametersResponse(BFProtocolParametersResponse protocolParametersResponse) {
        this.protocolParametersResponse = protocolParametersResponse;
    }

    public Date getCacheSynchDate() {
        return cacheSynchDate;
    }

    public void setCacheSynchDate(Date cacheSynchDate) {
        this.cacheSynchDate = cacheSynchDate;
    }
}
