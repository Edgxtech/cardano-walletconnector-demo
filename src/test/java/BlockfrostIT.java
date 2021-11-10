import au.com.ausstaker.cardano_dappconn_test.Application;
import au.com.ausstaker.cardano_dappconn_test.model.ProtocolParametersRequestForm;
import au.com.ausstaker.cardano_dappconn_test.service.ProtocolParametersService;
import au.com.ausstaker.cardano_dappconn_test.util.Helpers;
import com.google.gson.Gson;
import au.com.ausstaker.cardano_dappconn_test.model.BFLatestBlocksResponse;
import au.com.ausstaker.cardano_dappconn_test.model.BFProtocolParametersResponse;
import au.com.ausstaker.cardano_dappconn_test.service.BlockfrostService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import javax.annotation.Resource;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class) // NEWER SPRING USE SpringRunner.class
@SpringApplicationConfiguration(classes = Application.class) // NEWER SPRING USE @SpringBootTest
public class BlockfrostIT {
    protected static final Log log = LogFactory.getLog(BlockfrostIT.class);

    @Resource(name="blockfrostService")
    BlockfrostService blockfrostService;

    @Resource(name="protocolParametersService")
    ProtocolParametersService protocolParametersService;

    ProtocolParametersRequestForm form = new ProtocolParametersRequestForm();

    @Test
    public void testGetLatestBlocks_Testnet() {
        try {
            form.setNetwork(Helpers.TESTNET_ID);
            BFLatestBlocksResponse latestBlocks = blockfrostService.getLatestBlocks(form);
            log.info("Results: "+new Gson().toJson(latestBlocks));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testGetLatestBlocks_Mainnet() {
        try {
            form.setNetwork(Helpers.MAINNET_ID);
            BFLatestBlocksResponse latestBlocks = blockfrostService.getLatestBlocks(form);
            log.info("Results: "+new Gson().toJson(latestBlocks));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testGetProtocolParams_Testnet() {
        try {
            form.setNetwork(Helpers.TESTNET_ID);
            BFProtocolParametersResponse params = blockfrostService.getProtocolParamsFromBlockfrost(form);
            log.info("Results: "+new Gson().toJson(params));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testGetProtocolParams_Mainnet() {
        try {
            form.setNetwork(Helpers.MAINNET_ID);
            BFProtocolParametersResponse params = blockfrostService.getProtocolParamsFromBlockfrost(form);
            log.info("Results: "+new Gson().toJson(params));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testGetProtocolParams_Canned_Testnet() {
        try {
            form.setNetwork(Helpers.TESTNET_ID);
            BFProtocolParametersResponse params = protocolParametersService.getProtocolParamsFromCannedData(form);
            log.info("Results: "+new Gson().toJson(params));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testGetProtocolParams_Canned_Mainnet() {
        try {
            form.setNetwork(Helpers.MAINNET_ID);
            BFProtocolParametersResponse params = protocolParametersService.getProtocolParamsFromCannedData(form);
            log.info("Results: "+new Gson().toJson(params));
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
