package au.com.ausstaker.cardano_dappconn_test.controller;

import au.com.ausstaker.cardano_dappconn_test.model.ProtocolParametersRequestForm;
import au.com.ausstaker.cardano_dappconn_test.model.BFProtocolParametersResponse;
import au.com.ausstaker.cardano_dappconn_test.service.ProtocolParametersService;
import au.com.ausstaker.cardano_dappconn_test.validator.ProtocolParametersValidator;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * @author edge2ipi (https://github.com/Ausstaker)
 * @since Nov 2021
 */
@Controller
@RequestMapping(value = "/dappconn")
public class DappconnController {

    protected static final Log log = LogFactory.getLog(DappconnController.class);

    @Resource(name="protocolParametersService")
    ProtocolParametersService protocolParametersService;

    @Resource(name="protocolParametersValidator")
    ProtocolParametersValidator protocolParametersValidator;

    @RequestMapping(value = "/protocolparameters", method = RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
    @ResponseBody
    public ResponseEntity<BFProtocolParametersResponse> getProtocolParameters(HttpServletRequest req, @ModelAttribute("protocolParametersRequestForm") ProtocolParametersRequestForm form, BindingResult result) {
        protocolParametersValidator.validate(form, result);
        if (!result.hasErrors()) {
            try {
                return ResponseEntity.ok(protocolParametersService.getProtocolParametersFromBlockfrost(form));
                //return ResponseEntity.ok(protocolParametersService.getProtocolParamsFromCannedData(form)); // Alternate for testing, caution: update params incl latest_slot
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}
